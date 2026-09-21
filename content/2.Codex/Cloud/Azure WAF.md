---
navigation:
  title: Azure WAF
  hidden: true
---
Azure WAF (Web Application Firewall) is there to protect web apps from dumb and common attacks.
Stuff like:

SQL injection

XSS

Bots doing weird things

You usually attach WAF to:

Application Gateway

Azure Front Door

You don’t really “code” WAF rules at first — you mostly:

Enable it

Use managed rules

Then slowly tune it because false positives will happen

It’s one of those things you hope you don’t notice, because if it’s noisy, something’s wrong.