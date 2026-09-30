---
title: Tapo P110M
description: Integrating Tapo P110M into my small homelab :D
date: 2026-09-30
category: Azure
readingTime: 15
featured: true
published: true
---

# Overview

This document covers the complete setup process of integrating a **TP-Link Tapo P110M** smart plug into the Cerebrum homelab as a **local telemetry source**.

::note

Basically I just need a peace of mind, knowing I only spend *RM2.00* per month running my homelab (^_^)

::

The idea here is to **not** to use the Tapo mobile app as the interface, like, I genuinely do not want to look at the app at all, but rather to use my already existing Grafana Homelab dashboard, by querying the smart plug directly over the local network and expose its power consumption as structured data that can later be consumed by:

* OpenClaw
* Prometheus
* Grafana

The telemetry is entirely LAN-based.

---

# Final Architecture

```text
            WiFi LAN (192.168.1.x)

     ┌──────────────────────────┐
     │      Tapo P110M         │
     │  Power Monitoring Plug  │
     └─────────────┬────────────┘
                   │
         Local Encrypted Protocol
                   │
                   ▼
      Python (tapo library / Rust backend)
                   │
            JSON Telemetry
                   │
                   ▼
             Cerebrum Tools
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
      Discord             OpenClaw
        Ayam             LLM Reasoning
```

---

# Why Tapo?

The Tapo P110M provides live electrical telemetry without needing cloud polling.


# [`By enabling "Third Party Support" on the device settings from Tapo App`]

Available metrics include:

| Metric        | Description               |
| ------------- | ------------------------- |
| Current Power | Live wattage              |
| Voltage       | Line voltage              |
| Current       | Electrical current        |
| Energy Usage  | Daily / Monthly kWh       |
| Device Info   | Model, nickname, firmware |

This makes it a perfect IoT telemetry source for a homelab.

---

# Prerequisites

## Hardware

* TP-Link Tapo P110M
* ThinkPad / Linux machine on same WiFi
* Same LAN as the plug

## Software

```bash
sudo pacman -S python python-pip
```

Create a virtual environment:

```bash
python -m venv tapo-env
source tapo-env/bin/activate
```

Install the library:

```bash
pip install tapo
```

The library communicates directly with the P110M using TP-Link's local protocol. <Cite ref=turn696540search5/>

---

# Step 1 — Configure the Plug

Factory reset the plug (recommended if migrating accounts).

Inside the Tapo app:

1. Create / sign into TP-Link account
2. Add P110M
3. Connect to WiFi
4. Rename device (e.g. `Homelab Rack`)

Example:

```text
Device Name:
Homelab Rack
```

---

# Step 2 — Enable Local Third-Party Access

Inside Tapo:

```text
Me
 └── Third-Party Services
      └── Third-Party Compatibility
```

Enable it.

Without this, authentication succeeds but the device returns:

```text
FORBIDDEN
```

This is required for local API access.

---

# Step 3 — Obtain the IP Address

Do **not** scan the network.

The app already exposes it.

```text
Tapo
 └── P110M
      └── Settings
           └── Device Info
                ├── IP Address
                └── MAC Address
```

Example:

```text
IP Address:
192.168.1.39
```

Use this IP for all future requests.

---

# Step 4 — Test Connectivity

Create `tapo_test.py`

```python
import asyncio
from tapo import ApiClient

EMAIL = "your@email.com"
PASSWORD = "your_password"
IP = "tapo_ip" # Yes tapo is a smart device that will have its own IP, view it from the device setting

async def main():
    client = ApiClient(EMAIL, PASSWORD)
    plug = await client.p110(IP)

    info = await plug.get_device_info()

    print(f"Connected to: {info.nickname}")
    print(f"Model: {info.model}")

asyncio.run(main())
```

Run:

```bash
python tapo_test.py
```

Expected:

```text
Connected to: Tapo P110M
Model: P110M
```

If this succeeds, authentication and local communication are working.

---

# Step 5 — Read Live Power

The telemetry object exposes `current_power`.

```python
import asyncio
from tapo import ApiClient

EMAIL = "your@email.com"
PASSWORD = "your_password"
IP = "192.168.1.39"

async def main():
    client = ApiClient(EMAIL, PASSWORD)
    plug = await client.p110(IP)

    power = await plug.get_current_power()

    print(f"⚡ Power: {power.current_power} W")

asyncio.run(main())
```

Output:

```text
⚡ Power: 11 W
```

This is a **live** reading from the smart plug.

No cloud involved.

---

# Step 6 — Export JSON

Instead of printing formatted text, return structured JSON.

```python
import asyncio
import json
from tapo import ApiClient

EMAIL = "your@email.com"
PASSWORD = "your_password"
IP = "192.168.1.39"

async def main():
    client = ApiClient(EMAIL, PASSWORD)
    plug = await client.p110(IP)

    power = await plug.get_current_power()

    print(json.dumps(power.to_dict()))

asyncio.run(main())
```

Output:

```json
{
  "current_power": 11
}
```

JSON becomes the standard interface between telemetry tools and Cerebrum.

---

# Project Structure

Recommended layout:

```text
cerebrum/
│
├── tools/
│   ├── kubernetes.py
│   ├── linux.py
│   ├── tapo.py
│   └── docker.py
│
├── discord/
│   └── ayam.js
│
├── agent/
│   └── planner.py
│
└── telemetry/
```

Each tool returns JSON.

Example:

```python
def get_power():

    return {
        "current_power": 11
    }
```

The LLM never talks to hardware directly.

---

# Integrating with OpenClaw (Discord Bot)

Node.js simply executes the tool.

```javascript
import { exec } from "child_process";

exec("python tools/tapo.py", (err, stdout) => {

    const telemetry = JSON.parse(stdout);

    console.log(telemetry.current_power);

});
```

The Discord bot can now answer:

> How much power is my homelab using?

Response:

```text
⚡ Homelab Power Report

Current Draw: 11 W

Status:
Idle power consumption appears normal.
```

---

# Future Expansion

## Additional telemetry

| Device       | Tool       |
| ------------ | ---------- |
| Kubernetes   | kubectl    |
| Raspberry Pi | SSH        |
| Linux Host   | systemctl  |
| Docker       | docker CLI |
| Tapo P110M   | Local API  |
| Grafana      | HTTP API   |
| Prometheus   | PromQL     |

Cerebrum becomes a multi-source telemetry platform rather than a Kubernetes-only assistant.

---

## Troubleshooting

Based on my actual experiences having trouble with these thingies

# [`HASH_MISMATCH`]

**Cause**

Wrong TP-Link credentials. 

**Fix**

* Try to use an email instead of a phone number, for some reason phone number do not work, so if you initially signed up for Tapo account with a phone number, might want to recreate the account using an email address instead.

* Verify email/password

---

# [`FORBIDDEN`]

**Cause**

Third-Party Compatibility disabled.

**Fix**

```text
Open Tapo App
 └── Me
      └── Enable Third-Party Compatibility
            
```

---

# [`WRONG IP`]

Use the Tapo app:

```text
Settings
 └── Device Info
      └── IP Address
```

Avoid guessing or relying on network scans.

---

# Design Principle

> **Every infrastructure component should expose structured telemetry through a dedicated tool.**

Examples:

```text
get_cluster_status()
get_disk_usage()
get_power_usage()
get_pod_logs()
```

The LLM performs reasoning over telemetry.

It does **not** execute arbitrary shell commands.

---

# Milestone Achieved

* [x] Tapo P110M configured
* [x] Local LAN communication established
* [x] Third-party compatibility enabled
* [x] Python API authenticated
* [x] Live power telemetry retrieved
* [x] JSON export implemented

**First successful telemetry reading**

```text
Device : Tapo P110M
IP     : 192.168.1.39
Power  : 11 W
```

This marks the first non-Kubernetes telemetry source integrated into the Cerebrum ecosystem.
