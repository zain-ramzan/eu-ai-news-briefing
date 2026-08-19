/**
 * Euro AI Briefing - Main Application
 */

const App = (() => {
    let allNews = [];
    let currentSearchTerm = '';
    let currentCategory = '';
    let currentSort = 'date-desc';
    let latestUpdate = null;

    /**
     * Initialize the application.
     */
    async function init() {
        setupEventListeners();
        document.addEventListener('i18n:changed', handleLanguageChange);
        await loadNews();
    }

    /**
     * Set up user interactions for the dashboard controls.
     */
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');
        const refreshBtn = document.getElementById('refreshBtn');
        const resetFilters = document.getElementById('resetFilters');

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                currentSearchTerm = event.target.value;
                renderNews();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (event) => {
                currentCategory = event.target.value;
                renderNews();
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', (event) => {
                currentSort = event.target.value;
                renderNews();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadNews);
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', resetAllFilters);
        }
    }

    /**
     * Restore the dashboard feed and control values to their defaults.
     */
    function resetAllFilters() {
        currentSearchTerm = '';
        currentCategory = '';
        currentSort = 'date-desc';
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('sortBy').value = 'date-desc';
        renderNews();
    }

    /**
     * Re-render dynamic content after the selected interface language changes.
     */
    function handleLanguageChange() {
        if (latestUpdate) updateStats({ lastUpdated: latestUpdate });
        renderNews();
    }

    /**
     * Load news from the local API data source.
     */
    async function loadNews() {
        const loading = document.getElementById('loading');
        const newsContainer = document.getElementById('newsContainer');
        const refreshBtn = document.getElementById('refreshBtn');

        if (loading) loading.style.display = 'flex';
        if (newsContainer) newsContainer.setAttribute('aria-busy', 'true');
        if (refreshBtn) {
            refreshBtn.classList.add('is-loading');
            refreshBtn.disabled = true;
        }

        try {
            const data = await API.fetchNews();
            allNews = data.articles || [];
            latestUpdate = data.lastUpdated;
            updateStats(data);
            renderNews();
        } catch (error) {
            console.error('Failed to load news:', error);
            updateResultsCount(null, true);
            showEmptyState(t('loadErrorMessage'));
        } finally {
            if (loading) loading.style.display = 'none';
            if (newsContainer) newsContainer.setAttribute('aria-busy', 'false');
            if (refreshBtn) {
                refreshBtn.classList.remove('is-loading');
                refreshBtn.disabled = false;
            }
        }
    }

    /**
     * Update overview statistics when those elements are present.
     */
    function updateStats(data) {
        const totalNewsEl = document.getElementById('totalNews');
        const lastUpdatedEl = document.getElementById('lastUpdated');
        const weekNewsEl = document.getElementById('weekNews');

        if (totalNewsEl) totalNewsEl.textContent = allNews.length;
        if (lastUpdatedEl && data.lastUpdated) lastUpdatedEl.textContent = API.formatLastUpdated(data.lastUpdated);
        if (weekNewsEl) weekNewsEl.textContent = API.getWeekNews(allNews).length;
    }

    /**
     * Render news articles based on the active filters and sort order.
     */
    function renderNews() {
        const filteredNews = API.sortNews(
            API.filterNews(allNews, currentSearchTerm, currentCategory),
            currentSort
        );
        const newsContainer = document.getElementById('newsContainer');
        const emptyState = document.getElementById('emptyState');

        updateResultsCount(filteredNews.length);

        if (filteredNews.length === 0) {
            if (newsContainer) newsContainer.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (newsContainer) newsContainer.innerHTML = filteredNews.map(createNewsCard).join('');
    }

    /**
     * Create a localized card for one source article.
     */
    function createNewsCard(article) {
        const date = API.formatDate(article.date);
        const category = translateCategory(article.category || 'Update');
        const categoryClass = getCategoryClass(article.category);
        const title = escapeHtml(article.title || 'Untitled briefing');
        const source = escapeHtml(article.source || 'Euro AI Briefing');
        const description = escapeHtml(article.description || 'No description is available for this briefing.');
        const url = escapeHtml(article.url || '#');
        const tags = Array.isArray(article.tags) ? article.tags : [];

        return `
            <article class="news-card news-card--${categoryClass}">
                <div class="news-card-header">
                    <div class="news-card-top">
                        <span class="news-category">${escapeHtml(category)}</span>
                        <span class="news-reading-time">${escapeHtml(t('briefing')).toUpperCase()}</span>
                    </div>
                    <h3 class="news-title"><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
                    <div class="news-meta">
                        <span class="news-date">
                            <svg class="news-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path></svg>
                            ${escapeHtml(date)}
                        </span>
                        <span class="news-source">
                            <svg class="news-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5M8 11h.01M12 11h.01M16 11h.01"></path></svg>
                            ${source}
                        </span>
                    </div>
                </div>
                <p class="news-description">${description}</p>
                <div class="news-footer">
                    <div class="news-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                        ${escapeHtml(t('readBriefing'))}<span class="sr-only">: ${title}</span>
                    </a>
                </div>
            </article>
        `;
    }

    /**
     * Update the visible article count in the selected interface language.
     */
    function updateResultsCount(count, hasError = false) {
        const resultsCount = document.getElementById('resultsCount');
        if (!resultsCount) return;

        if (hasError) {
            resultsCount.textContent = t('feedUnavailable');
            return;
        }

        const briefingKey = count === 1 ? 'briefing' : 'briefings';
        resultsCount.textContent = `${count} ${t(briefingKey)} ${t('inView')}`;
    }

    /**
     * Display the empty state with a localized message.
     */
    function showEmptyState(message) {
        const newsContainer = document.getElementById('newsContainer');
        const emptyState = document.getElementById('emptyState');
        const emptyMessage = emptyState ? emptyState.querySelector('p') : null;

        if (newsContainer) newsContainer.innerHTML = '';
        if (emptyMessage && message) emptyMessage.textContent = message;
        if (emptyState) emptyState.style.display = 'block';
    }

    function translateCategory(category) {
        return typeof I18n !== 'undefined' ? I18n.translateCategory(category) : category;
    }

    function t(key) {
        return typeof I18n !== 'undefined' ? I18n.t(key) : key;
    }

    /**
     * Translate a category to a safe CSS modifier.
     */
    function getCategoryClass(category) {
        const normalized = String(category || 'update').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return normalized || 'update';
    }

    /**
     * Escape HTML special characters to prevent XSS.
     */
    function escapeHtml(value) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(value).replace(/[&<>"']/g, (character) => map[character]);
    }

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
