---
title: OverTheWire Bandit: Levels 10 to 20
date: 2026-06-08
category: writeup
tags: [linux, ssh, encoding, wargame]
summary: Continuing Bandit from level 10: decoding data, peeling back layered compression, using SSH keys, talking to services with netcat and OpenSSL, port scanning, and abusing a setuid binary.
---

Picking up where [Levels 0 to 10](/blog/overthewire-bandit) left off, the middle
Bandit levels move past plain files. Now the password is encoded, compressed,
hidden behind a network service, or guarded by a setuid binary.

> The theme shifts from "where is the file?" to "what shape is the data in, and
> what speaks to it?"

## Level 10 → 11

`data.txt` holds the password as Base64. Decode it:

```bash
base64 -d data.txt
```

## Level 11 → 12

The password is ROT13, letters rotated 13 places. `tr` maps them back:

```bash
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

## Level 12 → 13

`data.txt` is a hexdump of a file that was compressed over and over. Work in a
scratch directory, reverse the hexdump, then peel each layer using `file` to
tell you what you are looking at each step:

```bash
mkdir /tmp/work && cp data.txt /tmp/work && cd /tmp/work
xxd -r data.txt > data.bin
file data.bin        # gzip? bzip2? tar? decompress accordingly, then repeat
```

Rename and decompress in a loop (`gzip -d`, `bzip2 -d`, `tar xf`) until `file`
finally reports ASCII text, which is the password.

## Level 13 → 14

There is no password here, just an SSH private key. Use it to log in as the
next user:

```bash
ssh -i sshkey.private bandit14@localhost -p 2220
```

## Level 14 → 15

The next password is handed back if you submit the **current** level's password
to port 30000 on localhost:

```bash
cat /etc/bandit_pass/bandit14 | nc localhost 30000
```

## Level 15 → 16

Same idea, but port 30001 expects an SSL/TLS connection. Use OpenSSL instead of
raw netcat:

```bash
openssl s_client -connect localhost:30001 -quiet
# then paste the current password
```

## Level 16 → 17

The service is somewhere in ports 31000–32000. Scan for open ports, find the one
speaking SSL, and submit the password, and it returns an SSH key:

```bash
nmap -p 31000-32000 localhost
openssl s_client -connect localhost:<port> -quiet
```

## Level 17 → 18

Two files differ by a single line. `diff` shows exactly what changed; the new
line is the password:

```bash
diff passwords.old passwords.new
```

## Level 18 → 19

`.bashrc` logs you out the moment you land. Skip the interactive shell and run
the command directly over SSH:

```bash
ssh bandit18@bandit.labs.overthewire.org -p 2220 cat readme
```

## Level 19 → 20

A setuid binary lets you act as `bandit20`. Use it to read the protected
password file:

```bash
./bandit20-do cat /etc/bandit_pass/bandit20
```

## Commands worth internalizing

| Command                      | Why it matters                                  |
| ---------------------------- | ----------------------------------------------- |
| `base64 -d`                  | Decodes Base64-encoded data                     |
| `tr 'A-Za-z' 'N-ZA-Mn-za-m'` | Reverses ROT13 in one pass                      |
| `xxd -r`                     | Rebuilds a binary from a hexdump                |
| `file`                       | Identifies each compression layer to peel next  |
| `nc` / `openssl s_client`    | Talks to plain and SSL/TLS services             |
| `nmap -p`                    | Finds which port a hidden service listens on    |
| `diff`                       | Isolates the one line that changed              |
| setuid binary                | Runs an action as another, more-privileged user |

## Takeaway

These levels are a compact tour of the skills enumeration relies on: recognizing
encodings, unwrapping nested formats, and coaxing answers out of network
services. The setuid finale is a first taste of privilege escalation, the same
instinct that later turns a foothold into full compromise.

**Continue:** [Bandit: Levels 20 to 34](/blog/overthewire-bandit-21-34) closes out
the wargame with cron jobs, restricted-shell escapes, and the git-based levels.
