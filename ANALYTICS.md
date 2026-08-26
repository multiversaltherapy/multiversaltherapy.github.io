# Link Bio Analytics

The public Link Bio currently has **analytics disabled**.

## Current state

- No analytics dashboard is shown to visitors.
- No analytics event is sent from the browser.
- No IP-geolocation request is sent.
- No public analytics read credential is embedded in the frontend.
- No third-party analytics or geo runtime dependency is active.

The site still accepts normal URL parameters such as `?lang=tr` / `?lang=en` for language selection and `?fallback=` internally for app-opening fallback behavior, but these are not used for analytics collection.

## Language selection

Initial language priority:

1. Explicit `?lang=tr` or `?lang=en` parameter.
2. Previously saved manual TR/EN preference in local storage.
3. Browser language (`tr*` → Turkish, otherwise English).

Country/IP-based language detection is disabled.

## Future analytics

If analytics is reintroduced later, the implementation must be selected and approved separately before activation. At minimum it should support aggregate page views and social-button clicks without exposing a browser-side read credential or silently enabling third-party tracking.
