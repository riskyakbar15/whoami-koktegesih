---
title: "PortSwigger XSS Labs: Reflected, Stored, DOM, and Filter Bypass"
date: 2026-09-04
category: writeup
tags: [xss, web, burp]
summary: Working through the Cross-Site Scripting labs on PortSwigger Web Security Academy. How each context (reflected, stored, DOM) is found and exploited in a safe lab, common filter bypasses, and the fixes that actually stop XSS.
---

Cross-Site Scripting (XSS) lets an attacker run JavaScript in another user's
browser, in the context of a site they trust. That is enough to steal session
cookies, act as the victim, or rewrite the page. These notes walk through the
XSS labs on [PortSwigger's Web Security Academy](https://portswigger.net/web-security),
which are intentionally vulnerable training targets, so everything here is
authorized lab practice.

> XSS is not one bug. Where the input lands (HTML body, an attribute, a script,
> a URL) decides both how you exploit it and how you fix it.

## Reflected XSS

The input is echoed straight back in the response. A search box that reflects the
query unencoded is the classic case: submit a term, then find it verbatim in the
HTML.

```html
https://LAB/?search=
<script>
  alert(1);
</script>
```

Method: find where the input is reflected, identify the **context** it lands in,
then craft a payload that breaks out of that context. Reflected XSS needs the
victim to open a crafted link, so impact depends on delivery (phishing, a planted
link).

## Stored XSS

Here the payload is **saved** by the app (a comment, a profile field) and served
to everyone who views it. No crafted link needed, which makes it more dangerous.

```html
<!-- posted as a blog comment -->
<script>
  alert(document.domain);
</script>
```

If the comment renders unencoded, the script fires for every visitor of that page.

## DOM-based XSS

No server round-trip needed. Vulnerable client-side JavaScript reads from a
**source** (like `location.search` or `location.hash`) and writes it into a
dangerous **sink** (`innerHTML`, `document.write`, `eval`).

```js
// vulnerable sink
document.write('<img src="' + location.search.slice(8) + '">');
```

```html
https://LAB/?query="><svg onload="alert(1)"></svg>
```

Finding DOM XSS is about tracing source-to-sink in the JS, not reading the HTML
response. Burp's DOM Invader helps automate the hunt.

## Filter bypass

Real apps rarely leave things wide open. When `<script>` is stripped, the same
execution can come from event handlers and alternative tags:

```html
<img src="x" onerror="alert(1)" />
<svg onload="alert(1)">
  <body onload="alert(1)">
    <a href="javascript:alert(1)">click</a>
  </body>
</svg>
```

When you land **inside an attribute**, break out of it first:

```html
"><svg onload="alert(1)">' autofocus onfocus=alert(1) x='</svg>
```

Other angles the labs cover: case variation (`<ScRiPt>`), HTML-encoding tricks,
tag/attribute allow-list gaps, and abusing frameworks (for example, Angular
sandbox escapes or template-injection style payloads). The
[XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
is the reference for which vectors survive a given filter.

## Working method with Burp

1. Map every place input is reflected or stored, with Repeater.
2. For each, identify the exact context (HTML text, attribute, JS string, URL).
3. Send context-appropriate probes; use Intruder to sweep a vector list quickly.
4. For DOM cases, trace sources to sinks in the JavaScript.

## How to actually fix it

Exploiting the labs is the easy half. The fixes are the point:

- **Context-aware output encoding.** Encode on output, per context: HTML entity
  encoding in HTML body, attribute encoding inside attributes, JavaScript
  encoding inside scripts, URL encoding in URLs. One encoder is not enough.
- **Avoid dangerous sinks.** Prefer `textContent` over `innerHTML`; never feed
  untrusted data to `eval`, `document.write`, or `innerHTML`.
- **Let the framework help.** React, for example, escapes text by default;
  trouble starts with `dangerouslySetInnerHTML`, so treat those as review points.
- **Sanitize rich HTML** with a vetted library like DOMPurify when you must allow
  markup.
- **Defense in depth:** a strong Content-Security-Policy limits what injected
  script can do, and `HttpOnly` cookies keep session tokens out of reach of JS.

## Takeaway

The three XSS contexts share one root cause: untrusted input reaching an
execution context without the right encoding. Learning to spot the context fast,
in the response or in the DOM, is the skill the labs build, and encoding output
correctly is the habit that removes the bug class for good.
