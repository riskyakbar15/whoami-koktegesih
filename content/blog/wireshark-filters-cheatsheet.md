---
title: "Wireshark Display Filters: A VoIP-Focused Cheat Sheet"
date: 2026-09-01
category: notes
tags: [wireshark, networking, voip]
summary: The Wireshark display filters I reach for most, with a focus on the SIP, RTP, SRTP, and TLS traffic from the VoIP security lab. Quick reference for isolating signal from noise in a capture.
---

Two filter types trip people up in Wireshark. **Capture filters** (BPF syntax)
decide what gets recorded and are set before capture. **Display filters** decide
what you see afterward and are far more expressive. This is a working reference
for display filters, weighted toward the VoIP traffic from the
[Asterisk SRTP/TLS lab](/blog/asterisk-srtp-tls-voip-lab).

> Capturing is easy. The skill is filtering a few thousand packets down to the
> one conversation that matters.

## Addresses and ports

```text
ip.addr == 192.168.1.22          # to or from this host
ip.src == 192.168.1.17           # source only
tcp.port == 5061                 # either side of the port
udp.port == 5060
!(ip.addr == 192.168.1.1)        # exclude a host
```

## Protocols at a glance

| Filter                                     | Shows                                      |
| ------------------------------------------ | ------------------------------------------ |
| `http`                                     | HTTP requests and responses                |
| `dns`                                      | DNS queries and answers                    |
| `tls`                                      | TLS records (handshake and encrypted data) |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | connection attempts (SYN)                  |
| `tcp.analysis.retransmission`              | retransmissions (loss or latency)          |

## VoIP: the ones from the lab

```text
sip                              # all SIP signaling
sip.Method == "INVITE"           # call setup only
sip.Status-Code == 200           # successful responses
rtp                              # RTP media streams
tls && tcp.port == 5061          # TLS-protected SIP signaling
```

In the encrypted scenario, `rtp` shows nothing at first because the media is
SRTP. Find it through **Statistics -> Conversations -> UDP**, select the media
flow, then **Decode As -> RTP** to force the parse. Remember that Decode As does
not decrypt SRTP: playback of that stream is just noise.

## Following a conversation

- Right-click a packet -> **Follow -> TCP/UDP/TLS Stream** to reassemble one flow.
- For calls, the **Telephony -> VoIP Calls** and **Telephony -> RTP** menus are
  faster than raw filters for playback and stream stats.

## Operators worth memorizing

```text
&&   ||   !                      # and / or / not
==   !=   >   <   >=   <=
contains   matches               # substring / regex
```

```text
frame contains "password"        # bytes anywhere in the frame
http.request.method == "POST"
sip.CSeq.method == "BYE"         # call teardown
```

## Small habits that help

- **Colorize** important protocols (View -> Coloring Rules) so calls stand out.
- Use `frame.time_delta` and the IO Graph to spot jitter or gaps in a call.
- Save a capture per scenario (`rtp_unencrypted.pcapng`,
  `srtp_encrypted.pcapng`) so you can compare side by side.

For the full RTP-versus-SRTP walkthrough these filters came from, see the
[VoIP security lab tutorial](/blog/asterisk-srtp-tls-voip-lab).
