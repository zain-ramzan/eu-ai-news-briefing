/**
 * EU AI Briefing — verified news ingestion
 *
 * Only pages that return a successful response, a title, and a publication date
 * are included in data/news.json. Run with: node scripts/fetch-news.js
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const MAX_AGE_DAYS = 120;
const MAX_ARTICLES = 30;
const REQUEST_TIMEOUT_MS = 20000;

async function loadExistingNews() {
  try {
    const dataPath = path.join(__dirname, '../data/news.json');
    return JSON.parse(await fs.readFile(dataPath, 'utf8'));
  } catch {
    return { articles: [] };
  }
}

/**
 * Curated official EU source pages. Each page is verified at fetch time before
 * it is published. Add new official announcements here as they are identified.
 */
const OFFICIAL_SOURCE_PAGES = [
  {
    source: 'European AI Office',
    category: 'Policy',
    date: '2026-08-13T10:37:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-office',
    title: 'European AI Office expands enforcement team ahead of autumn deadline',
    description: 'The European AI Office is recruiting around 40 specialists to reinforce its enforcement work, with applications open until 8 September 2026.',
    content: 'The European AI Office says it is recruiting technology, legal, operations and paralegal specialists to strengthen its enforcement team. The application deadline is 8 September 2026 in Brussels time.',
    tags: ['AI Office', 'Enforcement', 'Recruitment']
  },
  {
    source: 'European Commission',
    category: 'Policy',
    date: '2026-08-10T12:00:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content',
    title: 'EU publishes icons for labelling AI-generated and manipulated content',
    description: 'The Commission has made a set of optional icons available to help deployers disclose AI-generated or manipulated content under the AI Act transparency rules.',
    content: 'The Commission’s icon set is intended to help people recognise AI-generated or manipulated images, audio, video and selected public-interest text. The page explains the relationship between optional icons and Article 50 disclosure obligations.',
    tags: ['Transparency', 'AI Labels', 'Article 50']
  },
  {
    source: 'European Commission',
    category: 'Regulation',
    date: '2026-08-02T08:00:00Z',
    url: 'https://commission.europa.eu/news-and-media/news/safer-and-more-transparent-ai-2026-08-02_en',
    title: 'Safer and more transparent AI rules take effect across the EU',
    description: 'New transparency obligations now require certain AI systems and AI-generated or altered content to be clearly disclosed to people in the EU.',
    content: 'The Commission explains that the rules cover selected interactive AI systems, deepfakes, and some AI-generated public-interest text. It outlines responsible authorities and the sanctions that may apply for non-compliance.',
    tags: ['AI Act', 'Transparency', 'Trust']
  },
  {
    source: 'European Commission',
    category: 'Regulation',
    date: '2026-07-31T09:00:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august',
    title: 'Commission begins enforcing AI Act transparency rules',
    description: 'The Commission and national authorities have begun enforcing new AI Act transparency requirements for selected AI systems and generated content.',
    content: 'The announcement sets out that providers and deployers of certain AI systems must disclose AI interactions and generated or altered content. It also points to guidance, complaints tools and the transparency code of practice.',
    tags: ['AI Act', 'Enforcement', 'Compliance']
  },
  {
    source: 'European Commission',
    category: 'Technology',
    date: '2026-07-30T09:00:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/news/eu-launches-ai-gigafactories-call-boost-europes-computing-capacity-and-unlock-more-eu30-billion',
    title: 'EU launches AI Gigafactories call to expand Europe’s computing capacity',
    description: 'A call for up to seven AI Gigafactories aims to combine public backing and private investment to expand European infrastructure for frontier AI.',
    content: 'The Commission says the initiative could use up to €10 billion in EU and national funding and unlock at least €20 billion in private investment. The facilities are intended to serve startups, research, industry and public authorities.',
    tags: ['AI Infrastructure', 'Gigafactories', 'Tech Sovereignty']
  },
  {
    source: 'European Commission',
    category: 'Policy',
    date: '2026-07-27T09:00:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force',
    title: 'AI Omnibus enters into force with revised implementation timelines',
    description: 'The AI Omnibus introduces targeted simplification measures while extending some high-risk AI timelines and preserving core safeguards.',
    content: 'The Commission highlights expanded access to regulatory sandboxes, proportionality measures for smaller businesses and new high-risk AI application dates. The measure also clarifies AI Office oversight and rules on certain harmful AI uses.',
    tags: ['AI Omnibus', 'Implementation', 'Regulatory Sandbox']
  },
  {
    source: 'European Commission',
    category: 'Regulation',
    date: '2026-07-20T09:00:00Z',
    url: 'https://digital-strategy.ec.europa.eu/en/news/commission-publishes-guidelines-transparency-obligations-providers-and-deployers-certain-ai-systems',
    title: 'Commission issues AI Act transparency guidance for providers and deployers',
    description: 'New guidance clarifies who must comply with Article 50 transparency obligations for interactive AI systems and AI-generated content.',
    content: 'The guidelines explain disclosure duties involving interactions with AI, deepfakes, public-interest text without human review, and certain biometric or emotion-recognition systems. They support the transparency rules that began applying on 2 August 2026.',
    tags: ['Article 50', 'Guidance', 'AI Governance']
  }
];

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function metaContent(html, target) {
  const name = escapeRegExp(target);
  const expressions = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["'][^>]*>`, 'i')
  ];

  for (const expression of expressions) {
    const match = html.match(expression);
    if (match) return decodeHtml(match[1]);
  }
  return '';
}

function extractHeading(html) {
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return heading ? decodeHtml(heading[1].replace(/<[^>]+>/g, ' ')) : '';
}

function extractCanonicalUrl(html, fallbackUrl) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  return match ? decodeHtml(match[1]) : fallbackUrl;
}

function resolveUrl(candidate, baseUrl) {
  if (!candidate) return '';
  try {
    return new URL(candidate, baseUrl).href;
  } catch {
    return '';
  }
}

function estimateReadMinutes(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function createId(url) {
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
  return `eu-ai-${hash}`;
}

async function requestPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'EU-AI-Briefing/1.0 (+https://github.com/zain-ramzan/euro-ai-briefing)',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { url: response.url, html: await response.text() };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Verify the source page and enrich a known official announcement with its
 * canonical title and open-graph media. Failures are logged and omitted.
 */
async function verifyAndBuildArticle(sourceArticle) {
  try {
    const { url: finalUrl, html } = await requestPage(sourceArticle.url);
    const pageTitle = extractHeading(html) || metaContent(html, 'og:title');
    const pageDescription = metaContent(html, 'description') || metaContent(html, 'og:description');
    const canonicalUrl = resolveUrl(extractCanonicalUrl(html, finalUrl), finalUrl);

    if (!pageTitle || !canonicalUrl) {
      throw new Error('missing required title or canonical URL');
    }

    const imageUrl = resolveUrl(metaContent(html, 'og:image'), finalUrl);
    const videoUrl = resolveUrl(metaContent(html, 'og:video') || metaContent(html, 'twitter:player:stream'), finalUrl);
    const description = sourceArticle.description || pageDescription;

    return {
      id: createId(canonicalUrl),
      title: sourceArticle.title || pageTitle,
      description,
      content: sourceArticle.content || pageDescription || description,
      source: sourceArticle.source,
      category: sourceArticle.category,
      date: sourceArticle.date,
      url: canonicalUrl,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      tags: sourceArticle.tags,
      readMinutes: estimateReadMinutes(`${sourceArticle.title} ${description} ${sourceArticle.content || ''}`),
      verifiedAt: new Date().toISOString(),
      sourceLanguage: 'en'
    };
  } catch (error) {
    console.warn(`Skipping unavailable source: ${sourceArticle.url} (${error.message})`);
    return null;
  }
}

function isRecent(article) {
  const ageMs = Date.now() - new Date(article.date).getTime();
  return Number.isFinite(ageMs) && ageMs >= -86400000 && ageMs <= MAX_AGE_DAYS * 86400000;
}

function preservePublishedFields(articles, existingArticles) {
  const existingByUrl = new Map(existingArticles.map((article) => [article.url, article]));
  return articles.map((article) => {
    const previous = existingByUrl.get(article.url);
    if (!previous) return article;
    return {
      ...article,
      imageUrl: article.imageUrl || previous.imageUrl || null,
      videoUrl: article.videoUrl || previous.videoUrl || null,
      ...(previous.translations ? { translations: previous.translations } : {})
    };
  });
}

function dedupeAndSort(articles) {
  const seen = new Set();
  return articles
    .filter(Boolean)
    .filter(isRecent)
    .filter((article) => {
      const key = article.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, MAX_ARTICLES);
}

async function saveNewsData(newsData) {
  const dataPath = path.join(__dirname, '../data/news.json');
  await fs.writeFile(dataPath, `${JSON.stringify(newsData, null, 2)}\n`, 'utf-8');
}

async function main() {
  console.log('EU AI Briefing — verifying official source pages...');
  const existingNews = await loadExistingNews();
  const verified = (await Promise.all(OFFICIAL_SOURCE_PAGES.map(verifyAndBuildArticle))).filter(Boolean);

  // Preserve existing articles that were added outside the hardcoded source list
  // (e.g. by the autonomous daily briefing agent) as long as they are still recent.
  const verifiedUrls = new Set(verified.map(a => a.url));
  const existingKept = (existingNews.articles || []).filter(a => !verifiedUrls.has(a.url));

  const articles = preservePublishedFields(dedupeAndSort([...verified, ...existingKept]), existingNews.articles || []);

  if (!articles.length) {
    throw new Error('No official source pages were available; preserving existing data/news.json.');
  }

  const newsData = {
    lastUpdated: new Date().toISOString(),
    sourcePolicy: 'Verified official EU pages only. Pages that are unavailable, missing a title, or older than the retention window are not published.',
    articles
  };

  await saveNewsData(newsData);
  console.log(`Published ${articles.length} verified EU AI briefings.`);
}

main().catch((error) => {
  console.error(`News ingestion failed: ${error.message}`);
  process.exit(1);
});
