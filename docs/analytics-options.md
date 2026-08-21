# Website analytics options for EU AI News Briefing

## Context

The site is a static GitHub Pages deployment. A genuine cross-visitor traffic counter and actionable traffic analytics cannot be implemented with browser-only code, because browser storage is per visitor and static hosting provides no server-side data store. A hosted analytics provider is therefore required.

| Option | Capabilities | Privacy and operational trade-offs | Required setup |
|---|---|---|---|
| GoatCounter | Page views, referrers, locations, page and site-wide counters; supports displaying an aggregate counter directly on the site. | Open-source and privacy-conscious; hosted service is donation-supported. Counters are public only when explicitly enabled, and counter responses may be cached for up to four hours. | Create a site, obtain its public site code, enable the optional counter in settings, then add the tracking script and counter integration. |
| Cloudflare Web Analytics | Core traffic, top URLs, referrers, countries, performance and traffic spikes. | Free and privacy-first; does not use cookies, local storage, or fingerprinting according to its documentation. It provides an owner dashboard rather than a native public counter. | Create a Cloudflare account, create a Web Analytics site token, then add the JavaScript beacon. |
| Plausible Analytics | Real-time traffic, top pages/referrers, AI-referral detection, SEO insights, goals, funnels and journeys. | Lightweight, cookie-free, EU-hosted service; paid after its 30-day trial. It provides a private dashboard rather than a native public counter. | Create a Plausible site, confirm the domain, and add its tracking script. |

## Preliminary recommendation

For the requested combination of a **visible traffic counter** and useful owner analytics on a static GitHub Pages site, GoatCounter is the direct fit. If the user prefers a private owner dashboard with no public count, Cloudflare Web Analytics is a free alternative. Plausible is suitable where AI referrals, goals and deeper editorial/SEO analysis justify a paid service.

## Sources

1. https://goatcounter.com/help/visitor-counter
2. https://www.cloudflare.com/web-analytics/
3. https://plausible.io/

## Selected implementation

The user created the free GoatCounter property with the public code `eu-ai-news-briefing`. The public sign-up and dashboard pages rendered successfully in browser verification. The repository uses the production-only tracking endpoint `https://eu-ai-news-briefing.goatcounter.com/count` and GoatCounter’s supported embedded aggregate `TOTAL` counter.

A local browser preview rendered the compact footer metric successfully and retrieved the initial aggregate count of `0`. The preview uses a non-production host, so it is intentionally prevented from loading the visit-recording script. A French interface check rendered the label `Visites du site` and the valid `0` total. The zero value initially surfaced an unavailable-state edge case, which was corrected so zero visits are represented as a valid count. The completed desktop page retained the compact footer layout without disrupting the editorial feed.

The Pages deployment for pull request #9 succeeded. Live verification confirmed that the localized German counter label and the production tracking script load correctly. After the account owner verified the email and enabled public counts, the aggregate endpoint returned HTTP 200 with `{"count":"0"}` and permissive CORS headers to a direct request. The deployed browser context nevertheless rejected the JavaScript `fetch` request with `TypeError: Failed to fetch`, leaving the visible fallback as an em dash. The counter was therefore revised to use GoatCounter’s documented script-based embedded `TOTAL` counter, which avoids the failing browser `fetch` transport.

The repair deployed successfully in pull request #10, but live diagnostics show the `gc.zgo.at/count.js` resource was requested while its `window.goatcounter` helper was not initialized. No embedded iframe was created, so the fallback remained visible. The final compatibility repair avoids that helper entirely: it uses GoatCounter’s documented direct aggregate-counter iframe for the public total and the documented 1×1 `/count` tracking pixel for production pageviews, titles, referrers, and viewport metrics. The direct aggregate-counter page itself is reachable in the browser and displays `0`. The final deployed module source matched the repaired source exactly, but the browser retained the former asset under the unchanged `goatcounter-2` cache key; the script reference was therefore advanced to `goatcounter-3` for a clean live load. The cache-refresh deployment succeeded. Final production verification confirmed the footer frame is present and ready, the tracking pixel is present, and the page loads `analytics.js?v=goatcounter-3`.
