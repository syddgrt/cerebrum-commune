---
title: Persistent Volumes and Claims with Azure Files
description: Follow a Kubernetes PVC from its request through CSI provisioning to an Azure Files mount in a Pod.
date: 2026-10-19
category: Kubernetes
readingTime: 10
featured: false
published: true
---

# Persistent Volumes and Claims with Azure Files

A Pod's writable container filesystem is temporary. If the Pod is replaced, data written only inside the container can disappear. Kubernetes persistent storage gives an application a durable volume whose lifecycle is separate from the Pod.

This guide follows a **PersistentVolumeClaim (PVC)** through dynamic provisioning with the Azure Files CSI driver on Azure Kubernetes Service (AKS). The result is a file share that can be mounted by more than one Pod, including Pods running on different nodes.

## The three Kubernetes objects

- A **PersistentVolume (PV)** represents storage available to the cluster. It records how Kubernetes can use the backing storage and has a lifecycle independent of an individual Pod.
- A **PersistentVolumeClaim (PVC)** is a namespaced request for capacity and access modes. A Pod refers to the claim by name; it does not normally describe Azure credentials or mount commands itself.
- A **StorageClass** describes how to create storage dynamically. In AKS, `azurefile-csi` is the built-in standard Azure Files class, and `azurefile-csi-premium` provisions premium shares.

A PVC binds to one PV. With dynamic provisioning, the CSI provisioner creates a PV and backing share to satisfy the claim, then Kubernetes binds the pair. Pods consume the PVC as a volume. [Kubernetes PV/PVC lifecycle](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) · [AKS Azure Files storage classes](https://learn.microsoft.com/en-us/azure/aks/create-volume-azure-files)

## Watch the request become mounted storage

The top path shows provisioning and binding. The lower path shows the mount used by the application after the Pod starts.

![Animated diagram showing a Kubernetes PVC, the Azure Files CSI controller, a bound PV, a Pod mount, and an Azure file share.](/images/kubernetes/azure-files-pv-pvc-flow.gif)

## Dynamic provisioning with the AKS StorageClass

This example uses the built-in `azurefile-csi` StorageClass and requests a 10 GiB read/write-many share. AKS creates the PV and Azure file share to satisfy the PVC.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: shared-files
  namespace: default
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile-csi
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: file-writer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: file-writer
  template:
    metadata:
      labels:
        app: file-writer
    spec:
      containers:
        - name: app
          image: nginx:1.27
          volumeMounts:
            - name: shared-data
              mountPath: /data
      volumes:
        - name: shared-data
          persistentVolumeClaim:
            claimName: shared-files
```

The driver mounts Azure Files over SMB for the built-in class. The share is visible to both replicas at `/data`; the replicas may be scheduled on different nodes. Azure Files CSI is a file-storage option for shared access, while Azure Disk is generally a single-node block-storage option. [AKS CSI drivers](https://learn.microsoft.com/en-us/azure/aks/csi-storage-drivers)

## What happens after `kubectl apply`

1. Kubernetes stores the PVC request. The request says *how much* storage and *how* the workload wants to mount it; it does not identify a specific Azure share.
2. The CSI provisioner sees the pending claim and uses its StorageClass to ask the Azure Files CSI driver for storage. The driver creates or selects the Azure storage account and file share according to the class configuration.
3. Kubernetes records the resulting PV and binds the PVC to it. The PVC becomes `Bound`; its `volumeName` points to the PV.
4. The Pod references `shared-files`. When scheduled, kubelet asks the CSI node plugin to prepare the volume on that node and mount the share.
5. The container sees the mounted directory at `/data`. File reads and writes travel between the Pod's mount and the Azure file share over SMB.

The CSI controller manages provisioning and other storage lifecycle operations. The node plugin performs node-side mount work. The application uses the mounted directory; it does not call the CSI driver directly.

## Verify the binding and data path

```bash
kubectl get pvc shared-files
kubectl get pv
kubectl describe pvc shared-files
kubectl get pods -l app=file-writer -o wide
```

Write a small file from one replica, then read it from the other:

```bash
POD_A=$(kubectl get pods -l app=file-writer -o jsonpath='{.items[0].metadata.name}')
POD_B=$(kubectl get pods -l app=file-writer -o jsonpath='{.items[1].metadata.name}')

kubectl exec "$POD_A" -- sh -c 'echo "shared data" > /data/hello.txt'
kubectl exec "$POD_B" -- cat /data/hello.txt
```

The file should be visible from both because both Pods mount the same Azure file share. This is useful for shared files and content. It does not make every application safe for concurrent writes: the application still needs suitable file locking and consistency behavior.

## Static provisioning for an existing share

Dynamic provisioning is convenient when AKS should create a share for a claim. If you already have a file share to keep and manage separately, create a PV that points to it, then make a PVC that matches the PV's capacity, access mode, and `storageClassName`.

An SMB static PV usually references a Kubernetes Secret containing the storage account name and key. Store credentials in a Secret through your normal secret-management process; do not commit real keys into a repository. A Secret's base64 representation is not encryption by itself. Azure Files on AKS also supports managed-identity and workload-identity authentication in supported AKS versions when configured with the required Azure role assignments. Check the AKS version and current driver prerequisites before choosing an authentication method. [Azure Files authentication options](https://learn.microsoft.com/en-us/azure/aks/create-volume-azure-files#use-managed-identity-to-access-azure-files-storage)

## Understand deletion before using it for important data

The built-in AKS Azure Files StorageClasses use a `Delete` reclaim policy. When the PVC is removed and the PV is reclaimed, the dynamically provisioned Azure file share can also be deleted. If the share must outlive a claim, use an appropriate custom StorageClass/reclaim policy or a statically managed PV with `Retain`, and make sure backups and recovery are handled separately. [AKS Azure Files reclaim behavior](https://learn.microsoft.com/en-us/azure/aks/create-volume-azure-files#use-built-in-storage-classes-to-create-dynamic-pvs-with-azure-files) · [Kubernetes reclaim policies](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming)

## Troubleshooting checklist

- **PVC stays `Pending`:** confirm the StorageClass exists, the provisioner is `file.csi.azure.com`, and the cluster's CSI components are healthy.
- **Pod events show a mount failure:** inspect `kubectl describe pod` and node CSI logs; check node-to-storage network access and DNS. SMB requires network access to the Azure Files endpoint.
- **Mounted but writes fail:** check the share's protocol and permissions, the container's user/group, and the configured mount options.
- **Claim bound but share disappears after deletion:** check the PV's reclaim policy and the StorageClass that created it before deleting PVCs.
- **Multiple replicas see different files:** verify that each Pod mounts the same PVC and that the application writes under the mounted path, not elsewhere in its container filesystem.

For dynamic provisioning, mount options belong on the StorageClass; for static provisioning, they belong on the PV. Use restrictive ownership and permission settings appropriate to the workload instead of copying permissive examples blindly. [Azure Files mount options](https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/storage/mountoptions-settings-azure-files)
