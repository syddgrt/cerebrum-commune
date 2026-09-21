---
title: Infrastructure as Code
description: A containerized file sync application, NextCloud, running on my small homelab setup.
---

# Homelab Kubernetes Cluster

## Summary

I built a lightweight Kubernetes cluster at home to better understand container orchestration, networking, and operational trade-offs in a constrained environment.

This project focuses more on **learning failure modes** than achieving production-grade perfection.

Setup my own file sync storage server using containerized NextCloud, an open source file sync application. Just to understand file server implementation inside a Linux Environment

---

## Tech Stack

<div class="flex flex-wrap gap-2">

<u-badge color="neutral">NextCloud</u-badge>
<u-badge color="neutral">Raspberry Pi</u-badge>
<u-badge color="neutral">Docker</u-badge>
<u-badge color="neutral">Cloudflare Tunnel</u-badge>

</div>

---

## Context

I wanted hands-on experience with Kubernetes beyond tutorials.
Most guides assume cloud resources and unlimited budgets, which hides many real-world constraints.

This project forced me to think about hardware limits, networking issues, and operational visibility.

---

## Constraints

- Limited hardware (Raspberry Pis)
- No static public IP
- Minimal power and cooling
- Learning while working full-time

---

## Architecture

::u-alert{icon="i-lucide-info" color="neutral"}
Diagram coming soon. Current setup uses k3s with a single control plane and worker nodes.
::

High-level design:
- k3s for reduced resource usage
- Cloudflare Tunnel for external access
- Local persistent storage for stateful workloads

---

## What Broke (And Why)

Things that went wrong:
- Node instability due to SD card I/O limits
- Networking issues when exposing services
- Cluster reboots causing service downtime

Each failure revealed gaps in my understanding of Kubernetes internals.

---

## Lessons Learned

- Kubernetes hides complexity, it doesn’t remove it
- Observability matters even in small clusters
- Infrastructure decisions are always trade-offs

---

## What I’d Improve Next

- Proper monitoring with Prometheus
- External storage solution
- Automated backups

---

## Links

- GitHub repository (if public)
- Related documentation pages
