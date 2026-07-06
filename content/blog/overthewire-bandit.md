---
title: OverTheWire Bandit — Levels 0 to 10
date: 2026-05-18
category: writeup
tags: [linux, ssh, wargame]
summary: Walking through the first Bandit levels to build core Linux command-line and SSH muscle memory — file reading, hidden files, filtering by properties, and searching inside data.
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

Only one file in `inhere/` is human-readable text. Let `file` classify them,
then read the one that comes back as text:

```bash
file inhere/*
cat "$(file inhere/* | grep text | cut -d: -f1)"
```

## Level 5 → 6

The password is in a file under `inhere/` with a specific fingerprint:
human-readable, exactly 1033 bytes, and not executable. Let `find` filter by
all three at once:

```bash
find inhere/ -type f -size 1033c ! -executable
cat "$(find inhere/ -type f -size 1033c ! -executable)"
```

## Level 6 → 7

This time the file is somewhere on the whole system — owned by user `bandit7`,
group `bandit6`, and 33 bytes in size. Silence the permission-denied noise with
`2>/dev/null`:

```bash
find / -type f -user bandit7 -group bandit6 -size 33c 2>/dev/null
```

## Level 7 → 8

The password sits in `data.txt`, right next to the word `millionth`. `grep`
pulls the matching line out of thousands:

```bash
grep millionth data.txt
```

## Level 8 → 9

The password is the only line in `data.txt` that appears exactly once. `sort`
groups duplicates so that `uniq -u` can isolate the single unique line:

```bash
sort data.txt | uniq -u
```

## Level 9 → 10

The password is one of a few human-readable strings inside the binary
`data.txt`, preceded by several `=` characters. `strings` extracts the readable
text, then `grep` narrows it down:

```bash
strings data.txt | grep '===='
```

## Commands worth internalizing

| Command           | Why it matters                                  |
| ----------------- | ----------------------------------------------- |
| `ls -la`          | Reveals hidden dotfiles and permissions         |
| `file`            | Identifies content type without guessing        |
| `find`            | Filters by size, owner, and permission bits     |
| `cat ./-`         | Escapes filenames that break naive commands     |
| `grep`            | Finds a word or pattern inside noisy files      |
| `sort \| uniq -u` | Isolates the one line that occurs a single time |
| `strings`         | Extracts readable text from binary data         |

## Takeaway

The early Bandit levels are muscle memory: reading awkward filenames, spotting
hidden files, and classifying unknown data. These same reflexes show up later
during enumeration on real engagements.
