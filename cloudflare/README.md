# Cloudflare first-party analytics / geo backend

This directory contains the backend prepared for the approved Link Bio privacy/analytics architecture.

## Endpoints

- `GET /api/context` returns Cloudflare's two-letter request country code.
- `POST /api/event` accepts only the documented analytics actions/keys and writes aggregate data to Workers Analytics Engine.

## Security / privacy properties

- No analytics read token is shipped to the browser.
- Raw IP addresses are not written to Analytics Engine.
- A daily pseudonymous visitor hash is derived inside the Worker from IP + User-Agent + a secret salt; only the truncated hash is written for approximate daily uniqueness.
- The Worker validates the Origin header and an explicit event allow-list.
- Event POSTs require the configured browser Origin and reject oversized bodies.
- Set `VISITOR_SALT` as a Worker secret; never commit it.
- Browser-side writes are inherently forgeable by determined non-browser clients, so Cloudflare rate limiting/WAF should be added if abuse becomes material.

## Required Cloudflare configuration

1. Create a Worker and bind Workers Analytics Engine as `ANALYTICS`.
2. Set `ALLOWED_ORIGIN=https://multiversaltherapy.github.io` (or the future custom domain).
3. Add secret `VISITOR_SALT`.
4. Deploy the Worker.
5. Put the deployed `/api/event` and `/api/context` URLs into the two `mt-*` meta tags in `index.html`.
6. If a custom domain is later placed behind Cloudflare, prefer same-origin routes and move CSP to HTTP response headers; add `frame-ancestors 'none'` and CSP reporting there.

## Retention

Workers Analytics Engine has limited retention. For analytics history longer than the platform retention window, add a scheduled aggregation/export into D1/R2 or another persistent store.
