# Multiversal Therapy — Official Links

Official Link Bio for **Multiversal Therapy / Çokluevren Terapisi**.

Live: https://multiversaltherapy.github.io/

## Scope

The site intentionally remains a focused social-link hub:

- YouTube: https://www.youtube.com/@multiversaltherapy
- Instagram: https://www.instagram.com/multiversaltherapy/
- TikTok: https://www.tiktok.com/@multiversaltherapy

It does **not** display or synchronize individual video links, latest-video metadata, character libraries, voting, countdowns or video automation.

## Localization

- Manual TR / EN switch is always available.
- A saved manual language preference takes precedence.
- When the first-party context endpoint is enabled, Turkey (`TR`) selects Turkish and other countries select English.
- Browser language is the fallback when no context endpoint is configured or available.

## Analytics & privacy

The frontend contains no public analytics read token and no third-party CounterAPI/ipapi runtime calls. Analytics and country lookup are designed to use a first-party endpoint when configured. See `ANALYTICS.md`, `privacy.html` and `cloudflare/README.md`.

## Reliability

`Validate Link Bio` checks referenced assets, image decoding, JavaScript syntax, CSP/JSON-LD integrity and basic security invariants before deployment.

The legacy `/youtube-app-opener/` path is retained only as a compatibility redirect to `/`; it no longer processes `?v=` video IDs.
