const fs = require('fs');
const path = require('path');

const languages = ['fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'sv', 'da', 'fi', 'cs', 'el', 'hu', 'bg', 'hr', 'sk', 'sl', 'lt', 'lv', 'et', 'ga'];
const dataPath = path.join(__dirname, '../data/news.json');
const { articles = [] } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const issues = [];

for (const article of articles) {
  for (const language of languages) {
    const translation = article.translations?.[language];
    const isComplete = translation
      && typeof translation.title === 'string' && translation.title.trim()
      && typeof translation.description === 'string' && translation.description.trim()
      && Array.isArray(translation.tags) && translation.tags.length > 0;
    if (!isComplete) issues.push(`${article.id}: ${language}`);
  }
}

if (issues.length) {
  console.error(`Incomplete briefing translations:\n${issues.join('\n')}`);
  process.exit(1);
}

console.log(`Validated ${articles.length} briefings across ${languages.length} non-English languages.`);
