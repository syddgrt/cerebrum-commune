---
navigation:
  icon: i-lucide-folder-tree
title: What this is all about
description: The what the heck is this shit
date: 1601-01-01
readingTime: 0
order: 1
---

# Welcome to Cerebrum Commune

> A personal engineering codex documenting how I understand systems, infrastructure, and the decisions behind modern software.

This isn't meant to be the ultimate source of truth.

It's a **living knowledge base** built from hands-on work, homelab experiments, production incidents, certifications, and the occasional 2AM debugging session. Everything here reflects **my own mental models** which would means some ideas may evolve as I learn more.

::warning
Always cross-reference important technical topics with official documentation and trusted sources. Treat this site as an engineer's journal, not a specification.
::

---

## The philosophy

Rather than memorizing commands, I prefer understanding **why** systems behave the way they do.

Most articles in this codex aim to answer questions like:

::card-group
  ::card
  ---
  icon: i-lucide-brain-circuit
  title: Why?
  ---
  Why was this technology designed this way?
  ::

  ::card
  ---
  icon: i-lucide-cog
  title: How?
  ---
  How does it actually work beneath the abstraction?
  ::

  ::card
  ---
  icon: i-lucide-bug
  title: When?
  ---
  When does it fail, and how do you troubleshoot it?
  ::
::

The goal is to build intuition—not just documentation.

---

## The Codex

Everything is organized into four major disciplines.

::card-group
  ::card
  ---
  icon: i-lucide-server
  title: DevOps
  to: /documentation/devops/kubernetes/concepts
  ---
  CI/CD, Infrastructure as Code, Kubernetes, Terraform and operational workflows.
  ::

  ::card
  ---
  icon: i-lucide-cloud
  title: Cloud
  to: /documentation/cloud/cloud-fundamentals
  ---
  Azure architecture, networking, identity, scalability and real-world cloud design.
  ::

  ::card
  ---
  icon: i-lucide-terminal
  title: Linux
  to: /documentation/linux/linux-fundamentals
  ---
  Filesystems, processes, networking, shell scripting and system administration.
  ::

  ::card
  ---
  icon: i-lucide-heart-pulse
  title: Site Reliability Engineering
  to: /documentation/site-reliability-engineering/concepts
  ---
  SLIs, SLOs, monitoring, incident response and reliability engineering principles.
  ::
::

---

## What you'll find here

Instead of isolated notes, each section is written around **connected concepts**.

| Discipline | Examples |
|---|---|
| **DevOps** | CI/CD, GitOps, Docker, Kubernetes, Terraform |
| **Cloud** | Azure, networking, identity, high availability |
| **Linux** | Arch Linux, filesystem, services, shell scripting |
| **SRE** | Observability, SLIs/SLOs, alerting, postmortems |
| **Automation** | Manufacturing systems, machine fundamentals |

As the codex grows, every article should connect back to a broader mental model rather than exist in isolation.

---

## Who is this for?

Primarily… myself.

But if you're a Cloud Engineer, DevOps Engineer, SRE, or someone learning modern infrastructure, hopefully these notes help shorten your learning curve.

The best documentation isn't the one with the most pages—it's the one you'll actually come back to six months later.

---

> *"First principles over memorization. Understanding over copying. Curiosity over certainty."*