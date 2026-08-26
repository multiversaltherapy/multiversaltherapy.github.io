# Link Bio Analytics

The public Link Bio UI does not display analytics. Anonymous aggregate events are sent to CounterAPI under the namespace `multiversaltherapy.github.io`.

## Event schema

| Action | Keys |
|---|---|
| `page_view` | `home` |
| `click` | `youtube`, `instagram`, `tiktok`, `share` |
| `source` | `instagram`, `tiktok`, `youtube`, `direct`, `other` |
| `language` | `tr`, `en` |
| `language_switch` | `en_to_tr`, `tr_to_en` |
| `app_fallback` | `youtube`, `instagram`, `tiktok` |
| `retry_app` | `youtube`, `instagram`, `tiktok` |

CounterAPI supports read-only totals, timelines and unique-user aggregation. Unique-user counts are approximate anonymous aggregates rather than authenticated identities.

## Source attribution

Source detection order:

1. `?src=` or `?utm_source=` query parameter.
2. Known Instagram/TikTok/YouTube in-app user agent.
3. HTTP referrer when available.
4. `direct` or `other` fallback.

For exact per-profile attribution, these URL forms are supported without changing the page shown to visitors:

- Instagram: `https://multiversaltherapy.github.io/?src=instagram`
- TikTok: `https://multiversaltherapy.github.io/?src=tiktok`
- YouTube: `https://multiversaltherapy.github.io/?src=youtube`

## Localization

Initial language selection:

1. Explicit `?lang=tr` or `?lang=en`.
2. Visitor's saved manual TR/EN choice.
3. IP country lookup: `TR` => Turkish, all other countries => English.
4. Browser language only as a fallback when country lookup is unavailable.

No video metadata, latest-video sync, character library, voting, countdown or YouTube content automation is part of this Link Bio.
