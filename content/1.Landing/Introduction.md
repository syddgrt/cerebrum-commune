---
navigation:
  icon: i-lucide-folder-tree
title: Introduction
order: 1
---

This documentation exists primarily as a **personal knowledge base** and a way to share how I understand systems, tooling, and engineering concepts.

It reflects **my own perspective, experience, and mental models**.  
I might be wrong. I might oversimplify things, i might be hallucinating. If something feels ambiguous or incorrect, **always cross-check with other sources**.


This documentation will consists of multiple major topics ranging from

```bash
DevOps
  CI/CD
  Infrastructure-As-Code
  Automation-And-Monitoring
Linux
Site-Reliability-Engineering(SRE)
Cloud-Computing-Architecture
  Azure
  AWS
Chaos-Engineering
OpenAI
Lean-Manufacturing
Six-Sigma
```

```text
DevOps
├─ CI/CD
├─ Infrastructure as Code
├─ CI/CD
├─ Deployment strategies
└─ Common DevOps tools and workflows

Cloud Computing Architecture
├─ Cloud fundamentals
├─ High availability and fault tolerance
├─ Security and identity management
├─ Scalability and cost optimization
└─ Real-world architecture decisions

Azure

Linux
├─ Distros
├─ Kernel
├─ Linux Filesystem
└─ Arch Linux

Site Reliability Engineering (SRE)
├─ SLIs, SLOs and SLAs
├─ Incident Management
├─ Error Budget and Velocity
└─ Monitoring and Alerting


Chaos Engineering
OpenAI
Lean Manufacturing
Six Sigma

```

### `DevOps`

<!-- This is where you [write pages](https://docus.dev/concepts/edition) in Markdown. -->

This section documents concepts, practices, and tools related to DevOps.
It focuses on how development and operations work together to deliver software reliably and efficiently.

Topics may include:

- CI/CD pipelines

- Infrastructure as Code (IaC)

- Automation and monitoring

- Deployment strategies

- Tooling (Git, Docker, Kubernetes, etc.)

Content here reflects practical experience, lessons learned, and real-world workflows rather than strict theory.


### `Cloud-Computing-Architecture`

Cloud architecture focuses on designing systems that run reliably on cloud platforms.
This section emphasizes why architectures are designed a certain way, not just how to deploy them.

Topics may include:

- Cloud fundamentals

- High availability and fault tolerance

- Scalability and cost optimization

- Security and identity management

- Real-world architecture decisions


### `Linux`

Linux is the foundational operating system behind most modern infrastructure.
This section focuses on understanding Linux as a working system — how processes run, how services behave, and how to debug things when they inevitably break.

Topics may include:

- Linux filesystem and permissions

- Process and service management

- Networking basics

- Shell scripting

- Troubleshooting and system administration

The focus is on hands-on usage and operational understanding rather than distribution-specific documentation.

<!-- Files contained within the `public/` directory are served at the root and are not modified by the build process of your documentation. This is where you can locate your medias. -->

### `Site Reliability Engineering`

SRE focuses on designing and operating systems that are reliable, scalable, and measurable.
This section explores how reliability is defined, measured, and protected in production systems.

- Topics may include:

- SLIs, SLOs, and SLAs

- Incident management and postmortems

- Monitoring and alerting

- Capacity planning

- Reliability vs. velocity trade-offs

<!-- <!-- This file contains all the dependencies and scripts for your application. The `package.json` of a Docus application si really minimal and looks like:

```json [package.json]
{
  "name": "docus-starter",
  "scripts": {
    "dev": "docus dev",
    "build": "docus build"
  },
  "devDependencies": {
    "docus": "latest"
  }
} 
``` -->

<!-- This section explores SRE principles and practices focused on system reliability and scalability.

Topics may include:

SLIs, SLOs, and SLAs

Incident management and postmortems

Monitoring and alerting

Capacity planning

Reliability vs. velocity trade-offs` -->

<!-- *This file is not mandatory to start a Docus application.*

This is where you can [configure Docus](https://docus.dev/concepts/configuration) to fit your branding, handle SEO and adapt links and socials.

::prose-tip{to="https://docus.dev/concepts/nuxt"}
Docus uses a layer system, you can go further and use any feature or file of a classical Nuxt project from `nuxt.config.ts` to `app/components` or `server/` directory.
:: -->
