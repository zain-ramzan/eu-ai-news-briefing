/**
 * Fetch News Script
 * Aggregates AI news from official EU sources
 * Run via: node scripts/fetch-news.js
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Sample data structure - In production, this would integrate with real APIs
 * This demonstrates the concept without requiring external API authentication
 */
const SAMPLE_ARTICLES = [
  {
    id: `eu-ai-act-${Date.now()}`,
    title: "EU AI Act Implementation Progress Update",
    description: "Latest updates on the implementation of the European AI Act and compliance requirements for organizations.",
    content: "The European Commission continues to work on implementing the AI Act with various stakeholder consultations.",
    source: "European Commission",
    category: "Regulation",
    date: new Date().toISOString(),
    url: "https://digital-strategy.ec.europa.eu/en/policies/artificial-intelligence",
    image: "📋",
    tags: ["AI Act", "EU Policy", "Regulation"]
  },
  {
    id: `research-${Date.now()}`,
    title: "New AI Research Initiatives Announced",
    description: "European research institutions launch collaborative AI safety and trustworthiness projects.",
    content: "Multiple European universities and research centers are launching new initiatives focused on responsible AI development.",
    source: "Horizon Europe",
    category: "Research",
    date: new Date(Date.now() - 86400000).toISOString(),
    url: "https://ec.europa.eu/programmes/horizon2020",
    image: "🔬",
    tags: ["Research", "AI Safety", "Innovation"]
  }
];

/**
 * Load existing news data
 */
async function loadExistingNews() {
  try {
    const dataPath = path.join(__dirname, '../data/news.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing news file found, creating new one');
    return { articles: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * Fetch news from official EU sources
 * In a production environment, this would make actual API calls to:
 * - European Commission APIs
 * - Horizon Europe feeds
 * - Official EU AI Board publications
 */
async function fetchFromOfficialSources() {
  console.log('Fetching AI news from official EU sources...');
  
  const articles = [];
  
  // In production, implement actual API calls here
  // Example structure for real implementation:
  // try {
  //   const euResponse = await fetch('https://api.european-commission.eu/...');
  //   const euNews = await euResponse.json();
  //   articles.push(...euNews);
  // } catch (error) {
  //   console.error('Failed to fetch EU Commission news:', error);
  // }
  
  return articles;
}

/**
 * Merge and deduplicate articles
 */
function mergeArticles(existingNews, newArticles) {
  const allArticles = [...existingNews.articles, ...newArticles];
  const seen = new Set();
  const uniqueArticles = [];
  
  for (const article of allArticles) {
    // Use title + source as unique identifier
    const key = `${article.title}|${article.source}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticles.push(article);
    }
  }
  
  // Sort by date, newest first
  uniqueArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Keep only the most recent 100 articles
  return uniqueArticles.slice(0, 100);
}

/**
 * Save news data to file
 */
async function saveNewsData(newsData) {
  try {
    const dataDir = path.join(__dirname, '../data');
    const dataPath = path.join(dataDir, 'news.json');
    
    // Create data directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    await fs.writeFile(
      dataPath,
      JSON.stringify(newsData, null, 2),
      'utf-8'
    );
    
    console.log('✓ News data saved successfully');
    console.log(`  Articles: ${newsData.articles.length}`);
    console.log(`  Last updated: ${newsData.lastUpdated}`);
  } catch (error) {
    console.error('Error saving news data:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🤖 EU AI News Dashboard - News Fetcher');
    console.log('=====================================\n');
    
    // Load existing news
    const existingNews = await loadExistingNews();
    console.log(`Loaded ${existingNews.articles.length} existing articles`);
    
    // Fetch from official sources
    const newArticles = await fetchFromOfficialSources();
    console.log(`Fetched ${newArticles.length} new articles`);
    
    // Add sample articles for demo purposes
    newArticles.push(...SAMPLE_ARTICLES);
    
    // Merge and deduplicate
    const mergedArticles = mergeArticles(existingNews, newArticles);
    
    // Prepare final news data
    const finalNewsData = {
      lastUpdated: new Date().toISOString(),
      articles: mergedArticles
    };
    
    // Save to file
    await saveNewsData(finalNewsData);
    
    console.log('\n✓ News fetching completed successfully');
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function
main();
