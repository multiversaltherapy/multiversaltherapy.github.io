# Link Bio Analytics

The public Link Bio UI does not display an analytics dashboard.

## Current status

Analytics collection is currently **disabled**.

The browser sends events only if an analytics endpoint is explicitly configured in `index.html`. Country lookup likewise runs only if a context endpoint is configured. On the current `github.io` deployment both remain unconfigured, so no analytics or IP-geolocation request is sent.

No analytics read credential is embedded in frontend JavaScript. No CounterAPI, ipapi or Cloudflare runtime dependency is active.

## Event schema reserved for a future approved backend

| Action | Keys |
|---|---|
| `page_view` | `home` |
| `click` | `youtube`, `instagram`, `tiktok`, `share` |
| `source` | `instagram`, `tiktok`, `youtube`, `facebook`, `direct`, `other` |
| `language` | `tr`, `en` |
| `language_switch` | `en_to_tr`, `tr_to_en` |
| `app_fallback` | `youtube`, `instagram`, `tiktok` |
| `retry_app` | `youtube`, `instagram`, `tiktok` |

A fallback return (`?fallback=...`) is part of the original navigation attempt and must not create another `page_view`, `source` or `language` event.

## Source attribution design

1. `?src=` or `?utm_source=`.
2. Known Instagram/TikTok/YouTube/Facebook in-app user agent.
3. Incoming referrer when available.
4. `direct` or `other` fallback.

Recommended profile URLs if analytics is enabled later:

- Instagram: `https://multiversaltherapy.github.io/?src=instagram`
- TikTok: `https://multiversaltherapy.github.io/?src=tiktok`
- YouTube: `https://multiversaltherapy.github.io/?src=youtube`

Any future analytics/geo backend must be separately approved before activation.
