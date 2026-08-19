# Euro AI Briefing

> **Euro AI Briefing** is a lightweight, multilingual dashboard for following European artificial-intelligence policy, regulation, research, technology, and security developments. It turns a curated briefing feed into a focused, searchable reading experience.

The project is built as a static web application. It runs without a framework or build step, making it simple to host on GitHub Pages and straightforward to adapt for a different AI-policy briefing workflow.

| Project | Details |
|---|---|
| Repository | [`zain-ramzan/euro-ai-briefing`](https://github.com/zain-ramzan/euro-ai-briefing) |
| Live site | `https://zain-ramzan.github.io/euro-ai-briefing/` once GitHub Pages is enabled for the repository |
| Stack | HTML, CSS, vanilla JavaScript, Node.js utility scripts |
| License | MIT |

## What the dashboard provides

The interface uses an editorial “policy intelligence” layout designed for quickly scanning a briefing feed. Readers can search article titles, descriptions, sources, and tags; filter by category; choose a sort order; restore a full feed after a no-result search; and open source articles in a new tab.

| Capability | Description |
|---|---|
| Curated briefing feed | Displays the articles stored in `data/news.json`, with source links, dates, tags, and categories. |
| Search and filters | Supports keyword search, category filtering, and date or title sorting. |
| Responsive interface | Adapts from a multi-column desktop feed to a single-column mobile reading layout. |
| Multilingual interface | Offers UI translations for 23 principal EU languages. Article text remains in its original source language. |
| Accessible interaction | Provides visible keyboard focus states, accessible labels, live result counts, and reduced-motion support. |

## Supported interface languages

The language selector translates the dashboard’s navigation, headings, controls, status text, empty state, and article-card labels. It does **not** machine-translate external article titles or summaries, preserving the wording and attribution supplied by each source.

| Western and Southern Europe | Central and Eastern Europe | Northern and Baltic Europe |
|---|---|---|
| English, French, German, Spanish, Italian, Portuguese, Dutch, Irish | Polish, Romanian, Czech, Greek, Hungarian, Bulgarian, Croatian, Slovak, Slovenian | Swedish, Danish, Finnish, Lithuanian, Latvian, Estonian |

## Data and editorial scope

The dashboard currently reads from the checked-in file at `data/news.json`. Each article records a title, description, source, category, publication date, URL, and tags. Use the outgoing article links to review the original material before relying on it for policy, regulatory, or commercial decisions.

The included Node.js fetch utility is a development prototype. Its source-integration function is intentionally a placeholder, so production use should connect it to verified publication feeds or APIs, retain source URLs, and implement review and deduplication rules appropriate for the intended editorial standard.

| Reference source | Intended use |
|---|---|
| [European Commission: Artificial Intelligence](https://digital-strategy.ec.europa.eu/en/policies/artificial-intelligence) | AI Act and European AI policy context. |
| [European Commission: Digital Strategy](https://digital-strategy.ec.europa.eu/) | Digital-policy and programme announcements. |
| [European AI Board](https://digital-strategy.ec.europa.eu/en/policies/european-ai-board) | Governance information related to the AI Act. |
| [Horizon Europe](https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en) | EU research and innovation programme context. |

## Local development

Clone the repository, install the small set of Node.js dependencies, and start the included static server. Serving the files over HTTP is recommended because the dashboard fetches its news data from `data/news.json`.

```bash
git clone https://github.com/zain-ramzan/euro-ai-briefing.git
cd euro-ai-briefing
npm install
npm run dev
```

The server runs on `http://localhost:8000` by default. To refresh the sample news-data file manually, run:

```bash
npm run fetch-news
```

## Deployment

Euro AI Briefing can be deployed as a static site. For GitHub Pages, configure the repository’s Pages settings to deploy from the desired branch and root directory. After deployment, the expected project URL is:

```text
https://zain-ramzan.github.io/euro-ai-briefing/
```

If the project is hosted under a different owner, organization, or custom domain, update the corresponding links in `README.md` and `index.html`.

## Project structure

```text
euro-ai-briefing/
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
