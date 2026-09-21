---
title: Pipelines
description: Super beginner introduction to Kubernetes
seo:
  title: Kubernetes like im 5
  navigation: 1
  description: A beginner-friendly explanation of Kubernetes, what it is, and why it exists.
---

Kubernetes – Pipelines

Kubernetes pipelines are about getting images into the cluster safely.

Usually looks like:

1. Build container image

2. Push to registry

3. Apply YAML / Helm

4. Kubernetes does the rest

If your pipeline sucks, Kubernetes will happily deploy broken things very efficiently.