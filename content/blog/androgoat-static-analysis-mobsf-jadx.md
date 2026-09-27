---
title: "AndroGoat Static Analysis: Reading a Deliberately Vulnerable App with MobSF and JADX"
date: 2026-09-28
category: writeup
tags: [android, sast, mobsf, reverse-engineering]
summary: A static analysis pass over AndroGoat, an intentionally vulnerable Android app. MobSF surfaces a debug certificate, a v1 signature, and dangerous permissions, then JADX confirms the real bugs in code: a concatenated SQL query and a hardcoded promo code.
---

<!-- markdownlint-disable MD024 -->

Most Android writeups start with a malicious sample. This one starts with a
training target. **AndroGoat** is an app built on purpose to be broken, which
makes it ideal for practising **Static Application Security Testing (SAST)**
without touching anything you are not allowed to touch.

The goal here is not to find something new. It is to build the habit that
matters in real work: let the scanner point, then **go read the code yourself**
before you believe it.

> AndroGoat is a deliberately vulnerable app for learning. Everything below
> happened in a local lab on a file I downloaded for that purpose.

## Tools and scope

The analysis is **static** only. The APK is never executed.

- **Kali Linux** as the working environment.
- **MobSF** for automated manifest, certificate, permission, and code analysis.
- **JADX** for decompiling and reading the source by hand.

MobSF runs locally:

```bash
./run.sh
```

Then open `http://127.0.0.1:8000` and upload the APK through **Upload & Analyze**.

One honest limitation: I did not build the project from source in Android
Studio, because the SDK and emulator images did not fit in the storage I had
available. That only removes dynamic testing. Everything in this post comes from
the APK itself, which is exactly what an analyst usually receives anyway.

## Identifying the target

```text
File         : AndroGoat.apk
Size         : 6.77 MB
MD5          : 8a38254ba65fa4ad4c6982f69ac72666
SHA1         : 7bd6736e38f9cede5accc5351b2f8d9373687fb9
Package      : owasp.sat.agoat
Main activity: owasp.sat.agoat.SplashActivity
Target SDK   : 33      Min SDK: 19
Score        : 48/100  Trackers: 0/432
```

Two things are worth noting before any deeper analysis.

**Min SDK 19** means the app still supports Android 4.4. Supporting an OS that
old drags along weak defaults and disables several modern platform protections.

**Trackers 0/432** is a useful contrast. A real malicious app usually carries
advertising or analytics SDKs. A clean tracker count is a reminder that a low
security score and malicious intent are two different things.

## Permissions

| Permission | Level | Why it matters |
| --- | --- | --- |
| `CAMERA` | dangerous | Capture images or video at any time |
| `READ_EXTERNAL_STORAGE` | dangerous | Read shared storage |
| `WRITE_EXTERNAL_STORAGE` | dangerous | Write and delete in shared storage |
| `INTERNET` | normal | Open network sockets |
| `USE_BIOMETRIC` | normal | Biometric prompt |
| `USE_FINGERPRINT` | normal | Deprecated since API 28 |

Three dangerous permissions on a demo app is already a lot. The pairing that
should always catch your eye is **external storage plus INTERNET**: it is the
minimum toolkit for reading local files and shipping them somewhere else.

`USE_FINGERPRINT` being deprecated is a small but real signal. Deprecated
security APIs tend to indicate code that has not been revisited in years.

## Signing and certificate

This is where MobSF returns its most severe finding.

- **Signed with a debug certificate.** A production build must never ship this
  way. The debug key is shared and well known, so anyone can resign a modified
  build and it will still look legitimate.
- **v1 signature scheme only.** This exposes the app to the **Janus
  vulnerability** on Android 5.0 through 8.0, where a DEX payload can be
  prepended to the APK without breaking the v1 signature. The app installs as an
  update to the real one and keeps its identity and permissions.

The fix is straightforward and belongs in the build pipeline: sign with a real
release key and enable the v2 or v3 scheme so the whole archive is covered.

## Exported components

```text
Activities: 1/30   Services: 1/1
Receivers : 2/2    Providers: 1/2
```

Exported components are reachable by **other apps on the same device**. An
exported content provider is the one to check first, because that is how local
data leaks to a neighbouring app without any network involvement.

## What MobSF flags in code

The automated code analysis groups its findings against CWE and OWASP MASVS:

| Finding | CWE |
| --- | --- |
| SQL query built from user input | CWE-89 |
| Sensitive information written to logs | CWE-532 |
| Insecure default permissions on files | CWE-276 |
| Insufficiently random values | CWE-330 |
| WebView configured unsafely | CWE-919 |
| Cleartext storage of sensitive data | CWE-312 |
| Certificate validation disabled | CWE-295 |

This list is a **map, not a verdict**. Scanners match patterns, so they raise
issues that are unreachable in practice and miss logic bugs entirely. The next
step is the one that actually decides.

## Confirming the findings in JADX

### SQL injection

In `SQLInjectionActivity`, the query is assembled by string concatenation:

```java
String qry = "SELECT * FROM users WHERE username='" + username.getText() + "'";
```

User input becomes part of the query **structure**, not just its data. Entering
`' OR '1'='1` turns the condition into something always true and returns every
row. The same pattern you would exploit on a web target works identically
against a local SQLite database.

The fix is parameter binding, which keeps input as a value:

```java
Cursor c = db.rawQuery(
    "SELECT * FROM users WHERE username = ?",
    new String[] { username.getText().toString() }
);
```

Input filtering is not the answer here. Separating code from data is.

### Hardcoded sensitive data

In `HardCodeActivity`:

```java
private final String promoCode = "NEW2019";
```

A promo code sounds harmless, and in this demo it is. The **pattern** is not.
Anything compiled into an APK is readable, because the APK is just an archive
that ships to the user's device. Pulling this string took one decompile and one
search. Had it been an API key, a signing secret, or a backend password, the
effort would have been identical.

Obfuscation does not solve this either. It raises the reading cost and nothing
more. Secrets belong on a server, behind an authenticated request.

## Takeaways

- **The scanner points, you confirm.** MobSF listed the SQL injection, but only
  JADX showed the concatenation that makes it real. Reporting a finding you have
  not read in code is how false positives spread.
- **Debug certificates and v1 signatures are release problems**, not code
  problems. They are caught by build configuration, not by better coding.
- **Nothing shipped inside an APK is secret.** Treat every embedded string as
  public from the moment you build.
- **A low score is not proof of malice.** AndroGoat scores 48/100 with zero
  trackers. Judge behaviour, not just the number.

If you want to see the same two tools applied to something that is actually
hostile, the [fake Pos Indonesia SMS trojan](/blog/fake-pos-indonesia-sms-trojan)
walks through a real OTP forwarding sample.

<!-- lang:id -->

Kebanyakan writeup Android dimulai dari sampel berbahaya. Yang ini dimulai dari
target latihan. **AndroGoat** adalah aplikasi yang sengaja dibuat rentan,
sehingga cocok untuk melatih **Static Application Security Testing (SAST)** tanpa
menyentuh apa pun yang bukan hakmu.

Tujuannya bukan menemukan sesuatu yang baru, melainkan membangun kebiasaan yang
penting di pekerjaan nyata: biarkan scanner menunjuk, lalu **baca sendiri
kodenya** sebelum kamu percaya.

> AndroGoat adalah aplikasi rentan untuk pembelajaran. Semua di bawah ini
> dikerjakan di lab lokal pada berkas yang memang diunduh untuk tujuan itu.

## Tools dan ruang lingkup

Analisis bersifat **statis** saja. APK tidak pernah dijalankan.

- **Kali Linux** sebagai lingkungan kerja.
- **MobSF** untuk analisis otomatis manifest, sertifikat, permission, dan kode.
- **JADX** untuk dekompilasi dan membaca source secara manual.

MobSF dijalankan secara lokal:

```bash
./run.sh
```

Lalu buka `http://127.0.0.1:8000` dan unggah APK lewat **Upload & Analyze**.

Satu keterbatasan yang perlu disampaikan jujur: saya tidak membangun project dari
source di Android Studio, karena SDK dan image emulator tidak muat di kapasitas
penyimpanan yang tersedia. Itu hanya menghilangkan pengujian dinamis. Semua isi
tulisan ini berasal dari APK-nya sendiri, dan justru itulah yang biasanya
diterima seorang analis.

## Mengenali target

```text
File         : AndroGoat.apk
Size         : 6.77 MB
MD5          : 8a38254ba65fa4ad4c6982f69ac72666
SHA1         : 7bd6736e38f9cede5accc5351b2f8d9373687fb9
Package      : owasp.sat.agoat
Main activity: owasp.sat.agoat.SplashActivity
Target SDK   : 33      Min SDK: 19
Score        : 48/100  Trackers: 0/432
```

Ada dua hal yang layak dicatat sebelum masuk lebih dalam.

**Min SDK 19** berarti aplikasi masih mendukung Android 4.4. Mendukung OS setua
itu membawa serta default yang lemah dan mematikan sejumlah proteksi platform
modern.

**Trackers 0/432** adalah pembanding yang berguna. Aplikasi berbahaya biasanya
membawa SDK iklan atau analitik. Jumlah tracker nol mengingatkan bahwa skor
keamanan rendah dan niat jahat adalah dua hal berbeda.

## Permission

| Permission | Level | Kenapa penting |
| --- | --- | --- |
| `CAMERA` | dangerous | Mengambil gambar atau video kapan saja |
| `READ_EXTERNAL_STORAGE` | dangerous | Membaca penyimpanan bersama |
| `WRITE_EXTERNAL_STORAGE` | dangerous | Menulis dan menghapus di penyimpanan bersama |
| `INTERNET` | normal | Membuka soket jaringan |
| `USE_BIOMETRIC` | normal | Prompt biometrik |
| `USE_FINGERPRINT` | normal | Sudah deprecated sejak API 28 |

Tiga dangerous permission pada aplikasi demo sudah tergolong banyak. Kombinasi
yang selalu perlu diwaspadai adalah **external storage plus INTERNET**: itu
perangkat minimum untuk membaca berkas lokal lalu mengirimkannya ke luar.

`USE_FINGERPRINT` yang sudah deprecated adalah sinyal kecil tapi nyata. API
keamanan yang usang biasanya menandakan kode yang bertahun-tahun tidak ditinjau.

## Signing dan sertifikat

Di sinilah MobSF mengeluarkan temuan paling parah.

- **Ditandatangani dengan debug certificate.** Build produksi tidak boleh dirilis
  seperti ini. Kunci debug bersifat umum dan diketahui luas, sehingga siapa pun
  bisa menandatangani ulang build yang sudah dimodifikasi dan tetap terlihat sah.
- **Hanya skema tanda tangan v1.** Ini membuka celah **Janus** pada Android 5.0
  sampai 8.0, di mana payload DEX bisa disisipkan di depan APK tanpa merusak
  tanda tangan v1. Aplikasi terpasang sebagai pembaruan dari yang asli dan
  mewarisi identitas beserta permission-nya.

Perbaikannya sederhana dan ada di ranah build pipeline: tanda tangani dengan
kunci rilis sungguhan dan aktifkan skema v2 atau v3 agar seluruh arsip tercakup.

## Komponen yang terekspos

```text
Activities: 1/30   Services: 1/1
Receivers : 2/2    Providers: 1/2
```

Komponen exported dapat dijangkau oleh **aplikasi lain di perangkat yang sama**.
Content provider yang terekspos adalah yang pertama harus diperiksa, karena dari
situlah data lokal bocor ke aplikasi tetangga tanpa melibatkan jaringan sama
sekali.

## Yang ditandai MobSF pada kode

Analisis kode otomatis mengelompokkan temuan berdasarkan CWE dan OWASP MASVS:

| Temuan | CWE |
| --- | --- |
| Query SQL dibangun dari input pengguna | CWE-89 |
| Informasi sensitif tertulis di log | CWE-532 |
| Permission default berkas tidak aman | CWE-276 |
| Nilai acak tidak cukup acak | CWE-330 |
| WebView dikonfigurasi tidak aman | CWE-919 |
| Data sensitif disimpan dalam bentuk terbuka | CWE-312 |
| Validasi sertifikat dimatikan | CWE-295 |

Daftar ini adalah **peta, bukan vonis**. Scanner bekerja dengan pencocokan pola,
jadi ia memunculkan isu yang sebenarnya tidak terjangkau dan melewatkan bug
logika sepenuhnya. Langkah berikutnyalah yang benar-benar menentukan.

## Membuktikan temuan lewat JADX

### SQL injection

Pada `SQLInjectionActivity`, query disusun dengan penggabungan string:

```java
String qry = "SELECT * FROM users WHERE username='" + username.getText() + "'";
```

Input pengguna menjadi bagian dari **struktur** query, bukan sekadar datanya.
Memasukkan `' OR '1'='1` mengubah kondisi menjadi selalu benar dan mengembalikan
seluruh baris. Pola yang sama yang kamu eksploitasi di target web bekerja persis
sama terhadap database SQLite lokal.

Perbaikannya adalah parameter binding, yang menjaga input tetap sebagai nilai:

```java
Cursor c = db.rawQuery(
    "SELECT * FROM users WHERE username = ?",
    new String[] { username.getText().toString() }
);
```

Menyaring input bukan jawabannya. Memisahkan kode dari data, itu jawabannya.

### Data sensitif yang di-hardcode

Pada `HardCodeActivity`:

```java
private final String promoCode = "NEW2019";
```

Kode promo terdengar sepele, dan pada demo ini memang begitu. Tapi **polanya**
tidak sepele. Apa pun yang dikompilasi ke dalam APK bisa dibaca, karena APK
hanyalah arsip yang dikirim ke perangkat pengguna. Mengambil string ini cukup
dengan sekali dekompilasi dan sekali pencarian. Andai isinya API key, secret
signing, atau password backend, usahanya sama persis.

Obfuscation juga bukan solusi. Ia hanya menaikkan biaya membaca, tidak lebih.
Rahasia tempatnya di server, di balik permintaan yang terautentikasi.

## Poin penting

- **Scanner menunjuk, kamu yang membuktikan.** MobSF menyebut SQL injection, tapi
  hanya JADX yang memperlihatkan penggabungan string yang membuatnya nyata.
  Melaporkan temuan yang belum kamu baca di kode adalah awal dari false positive.
- **Debug certificate dan tanda tangan v1 adalah masalah rilis**, bukan masalah
  kode. Keduanya diselesaikan lewat konfigurasi build, bukan dengan menulis kode
  yang lebih baik.
- **Tidak ada yang rahasia di dalam APK.** Anggap setiap string yang tertanam
  sudah bersifat publik sejak kamu menekan build.
- **Skor rendah bukan bukti jahat.** AndroGoat mendapat 48/100 dengan nol
  tracker. Nilailah perilakunya, bukan angkanya saja.

Kalau ingin melihat dua tool yang sama dipakai pada sesuatu yang benar-benar
berbahaya, [trojan SMS Pos Indonesia palsu](/blog/fake-pos-indonesia-sms-trojan)
membedah sampel OTP forwarding yang nyata.
