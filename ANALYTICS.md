# Link Bio Analytics

The Link Bio uses anonymous aggregate counters for lightweight traffic analytics.

## Current behavior

The browser records aggregate events through CounterAPI. These counters are public/no-auth and can be manipulated by repeated or automated requests. This is an explicitly accepted integrity risk: the data is useful for directional traffic analysis, not as a tamper-proof audit log.

No social-media password, account credential, OAuth token or analytics read secret is stored in the frontend.

## Event schema

- `page_view`: `home`
- `click`: `youtube`, `instagram`, `tiktok`, `share`
- `source`: `instagram`, `tiktok`, `youtube`, `facebook`, `direct`, `other`
- `language`: `tr`, `en`
- `language_switch`: `en_to_tr`, `tr_to_en`
- `app_fallback`: `youtube`, `instagram`, `tiktok`
- `retry_app`: `youtube`, `instagram`, `tiktok`

Fallback returns do not create a second page view.

Initial language priority is explicit `?lang=`, saved manual preference, current-session automatic result, IP-country result, then browser language. The initial `language` event waits for that choice to settle; `page_view` and `source` are sent immediately.

IP-country detection calls `https://api.ipapi.is` without a key. The site reads only the `cc` country-code field, maps `TR` to Turkish and every other valid country to English, and stores only the resolved language in session storage. A timeout, malformed response, network error or rate limit falls back to browser language.

## Non-mutating verification

Read a counter without incrementing it:

```text
https://counterapi.com/api/multiversaltherapy.github.io/page_view/home?readOnly=true
```

For an end-to-end test, read the relevant counters first, load the page once with a known `?lang=` and `?src=`, trigger the intended control, then read the same counters again. A one-step increase confirms the event path; remember that these public counters are not protected against synthetic requests.
