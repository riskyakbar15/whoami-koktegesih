---
title: Network Enumeration Notes: Nmap First Steps
date: 2026-06-09
category: notes
tags: [nmap, networking, recon]
summary: A compact personal cheat sheet for the enumeration phase: host discovery, service and version detection, and reading results without drowning in flags.
---

Enumeration is where most of the real work happens. Before exploiting anything,
you have to know what is actually listening. These are my working notes for
using **Nmap** during the recon phase in the lab.

## Host discovery

Find live hosts on a subnet without port scanning:

```bash
nmap -sn 10.10.10.0/24
```

- `-sn` = ping sweep only (no port scan)
- Useful for building a target list before going deeper

## Service and version detection

Once a host is confirmed up:

```bash
nmap -sV -sC -p- 10.10.10.5
```

| Flag  | Meaning                                       |
| ----- | --------------------------------------------- |
| `-sV` | Probe open ports to determine service/version |
| `-sC` | Run default NSE scripts (safe, informative)   |
| `-p-` | Scan all 65535 ports, not just the top 1000   |

## Reading the output

Focus on three things first:

1. **Open ports** and the services behind them
2. **Version strings**, which map directly to known CVEs
3. **Anything unusual**, since odd ports often hide the intended path

> Version detection is the bridge between enumeration and exploitation. A single
> outdated banner can decide the whole engagement.

## A note on noise

Aggressive scans (`-T4`, `-A`) are loud. In a lab that is fine; against a
monitored network it lights up the SOC dashboard instantly. Knowing _when_ to be
quiet is part of the craft.
