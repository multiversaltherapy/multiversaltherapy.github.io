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

Country/IP based language detection remains disabled. Initial language priority is explicit `?lang=`, saved manual preference, then browser language.
