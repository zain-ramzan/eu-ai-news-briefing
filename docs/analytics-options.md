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

The user created the free GoatCounter property with the public code `eu-ai-news-briefing`. The public sign-up and dashboard pages rendered successfully in browser verification. The repository will use the production-only tracking endpoint `https://eu-ai-news-briefing.goatcounter.com/count` and the aggregate `TOTAL.json` counter endpoint.

A local browser preview rendered the compact footer metric successfully and retrieved the initial aggregate count of `0`. The preview uses a non-production host, so it is intentionally prevented from loading the visit-recording script. A French interface check rendered the label `Visites du site` and the valid `0` total. The zero value initially surfaced an unavailable-state edge case, which was corrected so zero visits are represented as a valid count. The completed desktop page retained the compact footer layout without disrupting the editorial feed.
