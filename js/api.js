/**
 * API Integration Module
 * Handles fetching EU AI news from various official sources
 */

const API = (() => {
    const DATA_FILE = 'data/news.json?v=localized-briefings-1';
    const CACHE_KEY = 'eu_ai_news_cache_v2';

    /**
     * Fetch news data from the local data file or cache
     * @returns {Promise<Object>} News data with articles array
     */
    async function fetchNews() {
        try {
            const response = await fetch(DATA_FILE, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            cacheData(data);
            return data;
        } catch (error) {
            console.error('Error fetching news:', error);
            const cachedData = getCachedData();
            if (cachedData) return cachedData;
            throw error;
        }
    }

    /**
     * Get cached data if still valid
     * @returns {Object|null} Cached data or null if expired
     */
    function getCachedData() {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        } catch (e) {
            console.error('Error parsing cached data:', e);
        }
        return null;
    }

    /**
     * Cache the news data
     * @param {Object} data - News data to cache
     */
    function cacheData(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Error caching data:', e);
        }
    }

    /**
     * Filter news based on criteria
     * @param {Array} articles - Articles to filter
     * @param {String} searchTerm - Search term
     * @param {String} category - Category filter
     * @returns {Array} Filtered articles
     */
    function filterNews(articles, searchTerm = '', category = '') {
        return articles.filter(article => {
            const matchesSearch = searchTerm === '' || 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesCategory = category === '' || article.category === category;
            
            return matchesSearch && matchesCategory;
        });
    }

    /**
     * Sort articles based on criteria
     * @param {Array} articles - Articles to sort
     * @param {String} sortBy - Sort criterion (date-desc, date-asc, title-asc)
     * @returns {Array} Sorted articles
     */
    function sortNews(articles, sortBy = 'date-desc') {
        const sorted = [...articles];
        
        switch (sortBy) {
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date-desc':
            default:
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return sorted;
    }

    /**
     * Get articles from this week
     * @param {Array} articles - Articles to filter
     * @returns {Array} Articles from the last 7 days
     */
    function getWeekNews(articles) {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return articles.filter(article => new Date(article.date).getTime() > weekAgo);
    }

    /**
     * Format date for display
     * @param {String} dateString - ISO date string
     * @returns {String} Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const locale = typeof I18n !== 'undefined' ? I18n.getLocale() : 'en-GB';

        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }

    /**
     * Format last updated timestamp
     * @param {String} dateString - ISO date string
     * @returns {String} Formatted timestamp
     */
    function formatLastUpdated(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const locale = typeof I18n !== 'undefined' ? I18n.getLocale() : 'en-GB';
        const relativeTime = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        const diffMs = date - now;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (Math.abs(diffMins) < 60) return relativeTime.format(diffMins, 'minute');
        if (Math.abs(diffHours) < 24) return relativeTime.format(diffHours, 'hour');
        return relativeTime.format(diffDays, 'day');
    }

    return {
        fetchNews,
        filterNews,
        sortNews,
        getWeekNews,
        formatDate,
        formatLastUpdated
    };
})();