---
navigation:
  title: Azure Cloud
  hidden: true
---
Azure Cloud is basically Microsoft’s cloud platform where you rent computers instead of buying them.


Instead of having a physical server sitting somewhere, you spin up things like VMs, storage, databases, and networks through the Azure portal or CLI.

At first it’s kinda confusing because everything is a “resource”, but once you get it:

Resources live inside Resource Groups

Resource Groups live inside Subscriptions

Everything is tied to a Region (like East US, Southeast Asia, etc.)

You can do:

Virtual Machines (IaaS)

App Services / Functions (PaaS)

Fully managed stuff like databases

Azure is very enterprise-y, but it makes sense once you accept that everything has 3 layers of configuration 😅