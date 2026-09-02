---
title: "Build a Secure VoIP Lab: Asterisk with SRTP and TLS"
date: 2026-09-02
category: tutorial
tags: [voip, asterisk, cryptography]
summary: A hands-on lab to stand up an Asterisk PBX, prove that plain RTP audio can be replayed from a packet capture, then lock it down with TLS-protected SIP and SRTP-SDES media and confirm the difference in Wireshark.
---

Voice over IP is easy to stand up and easy to eavesdrop on when it is left
unencrypted. This tutorial builds a small lab where you place a call twice: once
over plain RTP, and once over SRTP media with TLS-protected signaling. Then you
capture both in Wireshark and hear the difference for yourself.

![Topology: MicroSIP (6001) and Zoiper (6002) register to an Asterisk PBX; SIP signaling runs over TLS 5061 and media over SRTP-SDES, while a Wireshark capture outside the trust boundary only sees noise.](/media/voip-lab-topology.svg)

## What you will build

- An **Asterisk** PBX with two extensions, `6001` and `6002`.
- A **baseline** call over SIP/UDP with plain RTP.
- A **secure** call over SIP/TLS with SRTP-SDES media.
- A side-by-side Wireshark comparison of the two captures.

## Prerequisites

- **Ubuntu Server 22.04** running Asterisk 22 with PJSIP (a VirtualBox VM in
  **bridged** mode works well, so it shares the LAN).
- Two softphones on the same network: **MicroSIP** (Windows) as `6001` and
  **Zoiper** (Android) as `6002`.
- **Wireshark** and **OpenSSL** on your host.

All devices must reach the server. Confirm with `ping <asterisk-ip>`.

## Step 1: Baseline RTP transport

Define a plain UDP transport in `pjsip.conf`:

```ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
```

Add extension `6001` (repeat the same pattern for `6002`):

```ini
[6001]
type=endpoint
context=from-internal
disallow=all
allow=ulaw
transport=transport-udp
auth=auth6001
aors=6001

[auth6001]
type=auth
auth_type=userpass
username=6001
password=CHANGE_ME_6001

[6001]
type=aor
max_contacts=1
```

Create the dialplan in `extensions.conf`:

```ini
[from-internal]
exten => 6001,1,Dial(PJSIP/6001,30)
 same => n,Hangup()
exten => 6002,1,Dial(PJSIP/6002,30)
 same => n,Hangup()
```

Restart and confirm both endpoints register:

```bash
sudo systemctl restart asterisk
sudo asterisk -rvvv
pjsip show endpoints
```

Point MicroSIP and Zoiper at the server over **UDP** with encryption disabled,
then place a call `6001 -> 6002`.

## Step 2: Capture the plain RTP call

Start a Wireshark capture on the call interface, place the call, then stop.
Filter with `rtp`, then open:

```text
Telephony -> RTP -> RTP Streams -> Play Streams
```

The conversation plays back clearly. Plain RTP gives the media no
confidentiality: anyone who obtains the capture can reconstruct the audio. Save
it as `rtp_unencrypted.pcapng`.

## Step 3: Generate a TLS certificate

For a lab, a self-signed certificate is enough:

```bash
sudo mkdir -p /etc/asterisk/keys
sudo openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout /etc/asterisk/keys/asterisk.key \
  -out /etc/asterisk/keys/asterisk.crt \
  -days 365 -subj "/CN=asterisk.local"
```

## Step 4: Enable TLS and SRTP

Add a TLS transport:

```ini
[transport-tls]
type=transport
protocol=tls
bind=0.0.0.0:5061
cert_file=/etc/asterisk/keys/asterisk.crt
priv_key_file=/etc/asterisk/keys/asterisk.key
method=tlsv1_2
```

Switch each endpoint to TLS and require encrypted media:

```ini
[6001]
type=endpoint
context=from-internal
disallow=all
allow=ulaw
transport=transport-tls
media_encryption=sdes
direct_media=no
auth=auth6001
aors=6001
```

Restart Asterisk:

```bash
sudo systemctl restart asterisk
```

## Step 5: Configure the softphones

- **MicroSIP**: server `IP:5061`, transport **TLS**, media encryption
  **Mandatory SRTP**.
- **Zoiper**: host `IP:5061`, transport **TLS**, **Enable SRTP**.

Both accounts should return to **Registered**.

## Step 6: Verify the secure setup

```bash
sudo asterisk -rvvv
pjsip show endpoint 6001
pjsip show transports
```

You want to see:

```text
Transport        : transport-tls
Media Encryption : sdes

transport-tls    tls    0.0.0.0:5061
transport-udp    udp    0.0.0.0:5060
```

## Step 7: Capture the secure call

Capture again while placing `6001 -> 6002`. Confirm the signaling is protected
with the filter `tls` or `tcp.port == 5061`.

The media will not show up under the `rtp` filter directly. Find it via:

```text
Statistics -> Conversations -> UDP
```

Select the media conversation, use **Decode As -> RTP**, then try **RTP Streams
-> Play Streams**. This time the audio is only noise. Note that "Decode As RTP"
just forces Wireshark to parse the packets as RTP; it does not decrypt SRTP. Save
it as `srtp_encrypted.pcapng`.

## Results

| Aspect                      | RTP (baseline) | SRTP + TLS |
| --------------------------- | -------------- | ---------- |
| SIP signaling               | UDP 5060       | TLS 5061   |
| Media                       | RTP            | SRTP-SDES  |
| Audio playback from capture | Clear          | Noise      |
| Eavesdropping risk          | High           | Much lower |

The call works in both cases, so encryption does not break VoIP. The difference
is entirely in what someone with a packet capture can recover.

## Security notes

- Self-signed certificates are fine for a lab. For anything real, use a
  certificate from a trusted CA.
- Never capture or intercept traffic you do not own or have permission to test.
- Replace every `CHANGE_ME_*` placeholder with a strong local password, and keep
  real credentials out of any repository.

The full configs, captures, and report for this lab live in the project repo:
[SRTP-VoIP-Security-Implementation](https://github.com/riskyakbar15/SRTP-VoIP-Security-Implementation).

<!-- lang:id -->

Voice over IP mudah dibangun dan mudah disadap ketika dibiarkan tanpa enkripsi.
Tutorial ini membangun lab kecil tempat kamu melakukan panggilan dua kali: sekali
lewat RTP biasa, dan sekali lewat media SRTP dengan signaling terlindungi TLS.
Lalu kamu menangkap keduanya di Wireshark dan mendengar sendiri perbedaannya.

![Topologi: MicroSIP (6001) dan Zoiper (6002) mendaftar ke PBX Asterisk; signaling SIP lewat TLS 5061 dan media lewat SRTP-SDES, sementara capture Wireshark di luar batas kepercayaan hanya melihat noise.](/media/voip-lab-topology.svg)

## Yang akan kamu bangun

- PBX **Asterisk** dengan dua ekstensi, `6001` dan `6002`.
- Panggilan **baseline** lewat SIP/UDP dengan RTP biasa.
- Panggilan **aman** lewat SIP/TLS dengan media SRTP-SDES.
- Perbandingan Wireshark berdampingan untuk kedua capture.

## Prasyarat

- **Ubuntu Server 22.04** menjalankan Asterisk 22 dengan PJSIP (VM VirtualBox mode
  **bridged** cocok agar berbagi LAN).
- Dua softphone di jaringan yang sama: **MicroSIP** (Windows) sebagai `6001` dan
  **Zoiper** (Android) sebagai `6002`.
- **Wireshark** dan **OpenSSL** di host.

Semua perangkat harus bisa menjangkau server. Pastikan dengan `ping <asterisk-ip>`.

## Langkah 1: Transport RTP baseline

Definisikan transport UDP biasa di `pjsip.conf`:

```ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
```

Tambahkan ekstensi `6001` (ulangi pola yang sama untuk `6002`):

```ini
[6001]
type=endpoint
context=from-internal
disallow=all
allow=ulaw
transport=transport-udp
auth=auth6001
aors=6001

[auth6001]
type=auth
auth_type=userpass
username=6001
password=CHANGE_ME_6001

[6001]
type=aor
max_contacts=1
```

Buat dialplan di `extensions.conf`:

```ini
[from-internal]
exten => 6001,1,Dial(PJSIP/6001,30)
 same => n,Hangup()
exten => 6002,1,Dial(PJSIP/6002,30)
 same => n,Hangup()
```

Restart dan pastikan kedua endpoint teregistrasi:

```bash
sudo systemctl restart asterisk
sudo asterisk -rvvv
pjsip show endpoints
```

Arahkan MicroSIP dan Zoiper ke server lewat **UDP** dengan enkripsi dimatikan,
lalu lakukan panggilan `6001 -> 6002`.

## Langkah 2: Tangkap panggilan RTP biasa

Mulai capture Wireshark di interface panggilan, lakukan panggilan, lalu hentikan.
Filter dengan `rtp`, kemudian buka:

```text
Telephony -> RTP -> RTP Streams -> Play Streams
```

Percakapan terputar dengan jelas. RTP biasa tidak memberi kerahasiaan pada media:
siapa pun yang memperoleh capture dapat merekonstruksi audio. Simpan sebagai
`rtp_unencrypted.pcapng`.

## Langkah 3: Buat sertifikat TLS

Untuk lab, sertifikat self-signed sudah cukup:

```bash
sudo mkdir -p /etc/asterisk/keys
sudo openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout /etc/asterisk/keys/asterisk.key \
  -out /etc/asterisk/keys/asterisk.crt \
  -days 365 -subj "/CN=asterisk.local"
```

## Langkah 4: Aktifkan TLS dan SRTP

Tambahkan transport TLS:

```ini
[transport-tls]
type=transport
protocol=tls
bind=0.0.0.0:5061
cert_file=/etc/asterisk/keys/asterisk.crt
priv_key_file=/etc/asterisk/keys/asterisk.key
method=tlsv1_2
```

Ubah tiap endpoint ke TLS dan wajibkan media terenkripsi:

```ini
[6001]
type=endpoint
context=from-internal
disallow=all
allow=ulaw
transport=transport-tls
media_encryption=sdes
direct_media=no
auth=auth6001
aors=6001
```

Restart Asterisk:

```bash
sudo systemctl restart asterisk
```

## Langkah 5: Konfigurasi softphone

- **MicroSIP**: server `IP:5061`, transport **TLS**, media encryption
  **Mandatory SRTP**.
- **Zoiper**: host `IP:5061`, transport **TLS**, **Enable SRTP**.

Kedua akun harus kembali ke status **Registered**.

## Langkah 6: Verifikasi konfigurasi aman

```bash
sudo asterisk -rvvv
pjsip show endpoint 6001
pjsip show transports
```

Yang diharapkan muncul:

```text
Transport        : transport-tls
Media Encryption : sdes

transport-tls    tls    0.0.0.0:5061
transport-udp    udp    0.0.0.0:5060
```

## Langkah 7: Tangkap panggilan aman

Capture lagi sambil memanggil `6001 -> 6002`. Pastikan signaling terlindungi
dengan filter `tls` atau `tcp.port == 5061`.

Media tidak langsung muncul di filter `rtp`. Temukan lewat:

```text
Statistics -> Conversations -> UDP
```

Pilih conversation media, gunakan **Decode As -> RTP**, lalu coba **RTP Streams
-> Play Streams**. Kali ini audionya hanya noise. Perhatikan bahwa "Decode As
RTP" hanya memaksa Wireshark memparsing paket sebagai RTP; ini bukan dekripsi
SRTP. Simpan sebagai `srtp_encrypted.pcapng`.

## Hasil

| Aspek                       | RTP (baseline) | SRTP + TLS        |
| --------------------------- | -------------- | ----------------- |
| Signaling SIP               | UDP 5060       | TLS 5061          |
| Media                       | RTP            | SRTP-SDES         |
| Playback audio dari capture | Jelas          | Noise             |
| Risiko eavesdropping        | Tinggi         | Jauh lebih rendah |

Panggilan tetap berhasil di kedua kasus, jadi enkripsi tidak merusak VoIP.
Perbedaannya sepenuhnya pada apa yang bisa dipulihkan seseorang dari packet
capture.

## Catatan keamanan

- Sertifikat self-signed cukup untuk lab. Untuk yang sungguhan, pakai sertifikat
  dari CA terpercaya.
- Jangan pernah menangkap atau menyadap trafik yang bukan milikmu atau tanpa izin
  uji.
- Ganti setiap placeholder `CHANGE_ME_*` dengan password lokal yang kuat, dan
  jauhkan kredensial asli dari repository mana pun.

Konfigurasi, capture, dan laporan lengkap lab ini ada di repo proyek:
[SRTP-VoIP-Security-Implementation](https://github.com/riskyakbar15/SRTP-VoIP-Security-Implementation).
