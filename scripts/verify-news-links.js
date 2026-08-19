const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/news.json');
const news = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const timeoutMs = 20000;

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? title[1].replace(/\s+/g, ' ').trim() : '';
}

async function verify(article) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(article.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; EU-AI-Briefing-Link-Validator/1.0)',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    const text = await response.text();
    return {
      status: response.status,
      finalUrl: response.url,
      title: extractTitle(text),
      ok: response.ok && Boolean(extractTitle(text))
    };
  } catch (error) {
    return { status: 0, finalUrl: '', title: '', ok: false, error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const report = [];
  for (const article of news.articles) {
    const result = await verify(article);
    report.push({ id: article.id, articleTitle: article.title, sourceUrl: article.url, ...result });
    console.log(`${result.ok ? 'OK ' : 'FAIL'} ${result.status} | ${article.title}`);
    if (!result.ok) console.log(`  ${article.url} ${result.error || ''}`.trim());
  }
  fs.writeFileSync(path.join(__dirname, '../data/link-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.some((entry) => !entry.ok) ? 1 : 0);
})();
