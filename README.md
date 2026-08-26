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
- Language priority is: explicit `?lang=`, saved manual choice, current-session automatic result, IP-country lookup, then browser language.
- A first-session request to `api.ipapi.is` selects Turkish for Türkiye and English for every other country.
- The lookup is free and keyless for up to 100 requests per client IP per UTC day; session caching keeps normal use to one request.
- No Cloudflare account, Worker, DNS change or proxy is required. A failed, blocked or rate-limited lookup falls back to browser language.

## Analytics & privacy

The site uses lightweight anonymous aggregate counters for page views, source categories, language selection and social-button clicks. Counter values are public/no-auth and can be manipulated, so they are directional metrics rather than tamper-proof records. The IP-country provider receives the visitor’s connection IP; this site uses only the returned country code and does not store the IP or precise location.

No social-media password, account credential, OAuth token or analytics read secret is embedded in the frontend.

See `ANALYTICS.md` and `privacy.html`.

## Reliability

`Validate Link Bio` checks referenced assets, image decoding, JavaScript syntax, CSP/JSON-LD integrity and basic security invariants before deployment.

The legacy `/youtube-app-opener/` path is retained only as a compatibility redirect to `/`; it no longer processes `?v=` video IDs.
