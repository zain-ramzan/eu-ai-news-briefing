# EU AI News Dashboard

A modern, real-time dashboard for European AI news and regulatory updates from official EU sources.
Website: - [EU AI News](https://zain-ramzan.github.io/eu-ai-news-dashboard/)

## Features

- 📰 Real-time news aggregation from official EU sources
- 🔄 Automatic data fetching from EU APIs
- 🎨 Modern, responsive dashboard interface
- 📊 News categorization and filtering
- 🌍 Multi-language support (EN, FR, DE, IT, ES)
- 📱 Mobile-friendly design
- 🚀 Deployed on GitHub Pages

## Data Sources

- [EU AI Act Official Portal](https://digital-strategy.ec.europa.eu/en/policies/artificial-intelligence)
- [European Commission - Digital Services](https://digital-strategy.ec.europa.eu/)
- [European AI Board](https://digital-strategy.ec.europa.eu/en/policies/european-ai-board)
- [NIST AI RSS Feed](https://www.nist.gov/ai)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Fetching**: GitHub Actions, Node.js
- **Hosting**: GitHub Pages
- **API Integration**: REST APIs from official EU sources

## Project Structure

```
eu-ai-news-dashboard/
├── index.html           # Main dashboard page
├── css/
│   └── style.css       # Dashboard styling
├── js/
│   ├── app.js          # Main application logic
│   └── api.js          # API integration and data fetching
├── data/
│   └── news.json       # Cached news data (updated by GitHub Actions)
├── .github/
│   └── workflows/
│       └── fetch-news.yml  # GitHub Actions workflow for data fetching
└── README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/zain-ramzan/eu-ai-news-dashboard.git
cd eu-ai-news-dashboard
```

### 2. Local Development

Simply open `index.html` in your browser to view the dashboard.

### 3. Enable GitHub Pages

1. Go to repository settings
2. Navigate to "Pages" section
3. Select "main" branch as source
4. Save

The dashboard will be available at: `https://zain-ramzan.github.io/eu-ai-news-dashboard/`

### 4. Configure GitHub Actions

The workflow automatically fetches news data daily. No additional configuration needed!

## Usage

The dashboard automatically loads news from the cached data. Fresh data is fetched daily via GitHub Actions.

### Manual Data Fetch

To manually trigger a news fetch:

```bash
npm install
node scripts/fetch-news.js
```

## Features Explained

### Real-time Updates
News data is updated automatically every day via GitHub Actions without any manual intervention.

### Filtering & Search
- Filter news by category (Regulation, Technology, Research, etc.)
- Search by keywords
- Sort by date or relevance

### Responsive Design
Works seamlessly on:
- Desktop browsers
- Tablets
- Mobile devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or suggestions, please open a GitHub Issue.

---

**Last Updated**: Auto-updated daily via GitHub Actions
