---
title: OverTheWire Bandit — Levels 0 to 5
date: 2026-05-18
category: writeup
tags: [linux, ssh, wargame]
summary: Walking through the first Bandit levels to build core Linux command-line and SSH muscle memory — file reading, hidden files, and filtering by properties.
---

Bandit is the entry-point wargame on [OverTheWire](https://overthewire.org/wargames/bandit/).
Each level hands you credentials to SSH into the next. It looks trivial, but it
quietly drills the Linux fundamentals every red-teamer leans on daily.

> The goal is not to "win" — it is to make `ls`, `cat`, `find`, and `ssh` feel automatic.

## Level 0 → 1

Connect over SSH on port `2220`:

```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
# password: bandit0
```

The password for the next level sits in a plain file in the home directory:

```bash
cat readme
```

## Level 1 → 2

The file is literally named `-`, which `cat` reads as stdin. Reference it by path:

```bash
cat ./-
```

## Level 2 → 3

A file with spaces in the name. Quote it or escape the spaces:

```bash
cat "spaces in this filename"
```

## Level 3 → 4

The password lives in a hidden file inside `inhere/`:

```bash
ls -la inhere/
cat inhere/...Hiding-From-You
```

## Level 4 → 5

Only one file in `inhere/` is human-readable text. Let `file` classify them:

```bash
file inhere/*
cat inhere/-file07
```

## Commands worth internalizing

| Command   | Why it matters                              |
| --------- | ------------------------------------------- |
| `ls -la`  | Reveals hidden dotfiles and permissions     |
| `file`    | Identifies content type without guessing    |
| `find`    | Filters by size, owner, and permission bits |
| `cat ./-` | Escapes filenames that break naive commands |

## Takeaway

The early Bandit levels are muscle memory: reading awkward filenames, spotting
hidden files, and classifying unknown data. These same reflexes show up later
during enumeration on real engagements.
