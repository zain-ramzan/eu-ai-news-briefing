# EU AI News Briefing

> **EU AI News Briefing** is a lightweight, multilingual dashboard for following European artificial-intelligence policy, regulation, research, technology, and security developments. It turns a curated briefing feed into a focused, searchable reading experience.

The project is built as a static web application. It runs without a framework or build step, making it simple to host on GitHub Pages and straightforward to adapt for a different AI-policy briefing workflow.

| Project | Details |
|---|---|
| Repository | [`zain-ramzan/eu-ai-news-briefing`](https://github.com/zain-ramzan/eu-ai-news-briefing) |
| Live site | `https://zain-ramzan.github.io/eu-ai-news-briefing/` once GitHub Pages is enabled for the repository |
| Stack | HTML, CSS, vanilla JavaScript, Node.js utility scripts |
| License | MIT |

## What the dashboard provides

The interface uses an editorial “policy intelligence” layout designed for quickly scanning a briefing feed. Readers can search article titles, descriptions, sources, and tags; filter by category; choose a sort order; restore a full feed after a no-result search; and open source articles in a new tab.

| Capability | Description |
|---|---|
| Curated briefing feed | Displays the articles stored in `data/news.json`, with source links, dates, tags, and categories. |
| Search and filters | Supports keyword search, category filtering, and date or title sorting. |
| Responsive interface | Adapts from a multi-column desktop feed to a single-column mobile reading layout. |
| Multilingual briefings | Offers complete dashboard and briefing-card translations for 23 principal EU languages, with automatic first-visit language selection. |
| Accessible interaction | Provides visible keyboard focus states, accessible labels, live result counts, and reduced-motion support. |

## Supported interface languages

The language selector translates dashboard controls and verified briefing-card titles, summaries, tags, categories, dates, and action labels. On a first visit, the site prioritizes a saved selection, then the browser language, then a local European timezone fallback; unsupported locations use English. Original publisher pages always open in their source language.

| Western and Southern Europe | Central and Eastern Europe | Northern and Baltic Europe |
|---|---|---|
| English, French, German, Spanish, Italian, Portuguese, Dutch, Irish | Polish, Romanian, Czech, Greek, Hungarian, Bulgarian, Croatian, Slovak, Slovenian | Swedish, Danish, Finnish, Lithuanian, Latvian, Estonian |

## Data and editorial scope

The dashboard currently reads from the checked-in file at `data/news.json`. Each article records a title, description, source, category, publication date, URL, and tags. Use the outgoing article links to review the original material before relying on it for policy, regulatory, or commercial decisions.

The included Node.js fetch utility verifies each curated official source page before it is published. The scheduled workflow audits source destinations and confirms all supported briefing translations are complete before deploying the updated feed.

| Reference source | Intended use |
|---|---|
| [European Commission: Artificial Intelligence](https://digital-strategy.ec.europa.eu/en/policies/artificial-intelligence) | AI Act and European AI policy context. |
| [European Commission: Digital Strategy](https://digital-strategy.ec.europa.eu/) | Digital-policy and programme announcements. |
| [European AI Board](https://digital-strategy.ec.europa.eu/en/policies/european-ai-board) | Governance information related to the AI Act. |
| [Horizon Europe](https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en) | EU research and innovation programme context. |

## Local development

Clone the repository, install the small set of Node.js dependencies, and start the included static server. Serving the files over HTTP is recommended because the dashboard fetches its news data from `data/news.json`.

```bash
git clone https://github.com/zain-ramzan/eu-ai-news-briefing.git
cd eu-ai-news-briefing
npm install
npm run dev
```

The server runs on `http://localhost:8000` by default. To refresh the sample news-data file manually, run:

```bash
npm run fetch-news
```

## Deployment

EU AI News Briefing can be deployed as a static site. For GitHub Pages, configure the repository’s Pages settings to deploy from the desired branch and root directory. After deployment, the expected project URL is:

```text
https://zain-ramzan.github.io/eu-ai-news-briefing/
```

If the project is hosted under a different owner, organization, or custom domain, update the corresponding links in `README.md` and `index.html`.

## Project structure

```text
eu-ai-news-briefing/
├── index.html              # Dashboard structure and language selector
├── css/
│   └── style.css           # Visual system, layout, and responsive rules
├── js/
│   ├── api.js              # News-data loading, filtering, sorting, and dates
│   ├── app.js              # Dashboard rendering and interactions
│   └── i18n.js             # Interface translations and language persistence
├── data/
│   └── news.json           # Curated briefing data consumed by the dashboard
├── scripts/
│   └── fetch-news.js       # Prototype data-fetching utility
├── .github/
│   └── workflows/          # Repository automation configuration
├── package.json
└── README.md
```

## Contributing

Contributions are welcome. Please create a focused branch, test the dashboard locally, and open a pull request that explains the user-facing change. For new data connectors, document the source, refresh cadence, licensing or terms, failure behavior, and deduplication strategy.

## License

This project is declared under the MIT License in `package.json`. Add a repository-level `LICENSE` file before distributing the project if formal license text is required.
