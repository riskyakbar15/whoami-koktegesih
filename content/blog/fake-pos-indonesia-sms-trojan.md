---
title: "Static Analysis of a Fake Pos Indonesia APK: an SMS-to-Telegram OTP Forwarding Trojan"
date: 2026-03-07
category: writeup
tags: [android, malware, reverse-engineering]
summary: Static analysis of an Android APK impersonating PT Pos Indonesia. MobSF and JADX reveal an SMS interceptor that forwards incoming messages to a hardcoded Telegram bot, sends SMS on command, and stores data for retry, a classic OTP forwarding trojan.
---

Android's popularity makes it a favorite target for apps that impersonate real
institutions. A common trick is to name an app after a public service so victims
trust it enough to install. This writeup analyzes one such sample: an APK that
claims to be **PT Pos Indonesia** but ships under a completely different package.

> The app label says "PT POS INDONESIA", but the package is
> `com.smodj.app.smstotelegram`. The name already gives the game away.

## Methodology

The analysis is **static** only, examining the APK without running it. Tools:

- **MobSF** for automated manifest, certificate, permission, URL, and behavior analysis.
- **JADX** for decompiling the source and reading it by hand.

Steps: identify APK metadata, scan with MobSF, reverse engineer the source, then
correlate the automated findings against the actual code.

## Initial identification

```text
File   : PT.POS_INDONESIA_-2_3.apk
Size   : 5.71 MB
SHA256 : a07bcc68923cca9c37a60a5a059c0d9393190a56bed2519e6c4508bf7314a459
Score  : 47/100 (MobSF security score)
Package     : com.smodj.app.smstotelegram
Main activity: com.smodj.app.smstotelegram.MainActivity
```

A security score of 47/100 already flags multiple risk indicators. More telling,
the display name ("PT Pos Indonesia") does not match the package or the
`smstotelegram` naming: a strong impersonation signal.

## Certificate and signature

The APK is signed with **SHA1withRSA** using the Android **debug certificate**,
not a production certificate. That means:

- low integrity,
- trivially repackaged,
- not an official distribution build.

## Manifest and components

MobSF reports a large exported surface (the report notes 4 exported activities
and 7 exported services) and **19 manifest warnings**. The main issues:

- `allowBackup` enabled,
- activities not protected,
- broadcast receivers left open.

A wide exported surface lets other apps on the device reach these components.

## SMS interception

The core file is `SMSBroadcastReader.java`, which registers a broadcast receiver:

```java
public class SMSBroadcastReader extends BroadcastReceiver
```

Inside `onReceive`, it reads incoming SMS and pulls out the sender and body:

```java
SmsMessage.createFromPdu(...)
getDisplayOriginatingAddress()   // sender number
getDisplayMessageBody()          // message content
```

The captured message is then formatted and sent onward to Telegram.

## Telegram exfiltration

The same file builds a Telegram Bot API request:

```java
map.put("chat_id", str);
map.put("text", str2);
// POST to hxxps://api[.]telegram[.]org/bot<token>/sendMessage
```

That is the official Telegram Bot API `sendMessage` format, so every intercepted
SMS is forwarded to an attacker-controlled Telegram bot.

## Hardcoded bot token

`MainConstant.java` contains a **hardcoded Telegram bot token** (redacted here):

```java
private static final String bot_id = "5246XXXXX:AA...redacted...";
```

A baked-in token means the app has a ready-made channel straight to the attacker.
The same file also references a secondary server for device registration:

```text
hxxps://api[.]smj[.]ltd/smstotelegram/register
```

## Outbound SMS

`SendSMSClient.java` can also send SMS automatically:

```java
sendMultipartTextMessage(...)
```

This turns the victim's phone into an **SMS relay**, useful for smishing or
abusing the number for further fraud.

## Persistence

`DatabaseHandler.java` defines a local store:

```sql
CREATE TABLE offline_msgs
```

If Telegram is unreachable, messages are saved locally and resent later, a simple
persistence mechanism so nothing is lost.

## Indicators of compromise

```text
Package  : com.smodj.app.smstotelegram
SHA256   : a07bcc68923cca9c37a60a5a059c0d9393190a56bed2519e6c4508bf7314a459
C2       : hxxps://api[.]smj[.]ltd/smstotelegram/register
Exfil    : hxxps://api[.]telegram[.]org/bot<token>/sendMessage
```

(URLs are defanged; do not visit them.)

## Verdict

Putting the behaviors together, the app:

- reads incoming SMS,
- captures the sender number,
- forwards messages to a Telegram bot,
- can send SMS out on command,
- stores data for retry when exfiltration fails.

That profile classifies it as an **SMS interceptor spyware** with a Telegram
channel, subcategory **OTP forwarding trojan**, since the whole flow exists to
exfiltrate SMS (including one-time passwords) to an external channel.

## Takeaways

- **Check the package, not the label.** A "Pos Indonesia" app under
  `com.smodj.app.smstotelegram` is an immediate red flag.
- **Treat SMS permissions as high risk.** An app that reads and sends SMS in the
  background is rarely benign.
- **Avoid sideloaded APKs** impersonating banks, couriers, or government services;
  install only from official stores.
- For defenders, the package name, hash, and C2 domains above make useful blocking
  and hunting indicators.

For the same MobSF and JADX workflow applied to a safe training target, see the
[AndroGoat static analysis](/blog/androgoat-static-analysis-mobsf-jadx).
