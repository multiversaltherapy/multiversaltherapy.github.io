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
- Browser language is used as the automatic fallback.
- Country-based language detection is currently disabled because no geo backend is configured.

## Analytics & privacy

The frontend contains no public analytics read token and no third-party CounterAPI/ipapi runtime calls.

Analytics collection is currently disabled until a separate backend is explicitly selected and configured. No replacement service is silently enabled.

See `ANALYTICS.md` and `privacy.html`.

## Reliability

`Validate Link Bio` checks referenced assets, image decoding, JavaScript syntax, CSP/JSON-LD integrity and basic security invariants before deployment.

The legacy `/youtube-app-opener/` path is retained only as a compatibility redirect to `/`; it no longer processes `?v=` video IDs.
