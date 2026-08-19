/**
 * EU AI News Dashboard - Main Application
 */

const App = (() => {
    let allNews = [];
    let currentSearchTerm = '';
    let currentCategory = '';
    let currentSort = 'date-desc';

    /**
     * Initialize the application
     */
    async function init() {
        setupEventListeners();
        await loadNews();
    }

    /**
     * Setup event listeners for all interactive elements
     */
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');
        const refreshBtn = document.getElementById('refreshBtn');
        const resetFilters = document.getElementById('resetFilters');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchTerm = e.target.value;
                renderNews();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                currentCategory = e.target.value;
                renderNews();
            });
        }

        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                currentSort = e.target.value;
                renderNews();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadNews);
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                currentSearchTerm = '';
                currentCategory = '';
                currentSort = 'date-desc';
                document.getElementById('searchInput').value = '';
                document.getElementById('categoryFilter').value = '';
                document.getElementById('sortBy').value = 'date-desc';
                renderNews();
            });
        }
    }

    /**
     * Load news from API
     */
    async function loadNews() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';

        try {
            const data = await API.fetchNews();
            allNews = data.articles || [];
            updateStats(data);
            renderNews();
        } catch (error) {
            console.error('Failed to load news:', error);
            showEmptyState();
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    /**
     * Update statistics display
     */
    function updateStats(data) {
        const totalNewsEl = document.getElementById('totalNews');
        const lastUpdatedEl = document.getElementById('lastUpdated');
        const weekNewsEl = document.getElementById('weekNews');

        if (totalNewsEl) {
            totalNewsEl.textContent = allNews.length;
        }

        if (lastUpdatedEl) {
            const formatted = API.formatLastUpdated(data.lastUpdated);
            lastUpdatedEl.textContent = formatted;
        }

        if (weekNewsEl) {
            const weekNews = API.getWeekNews(allNews);
            weekNewsEl.textContent = weekNews.length;
        }
    }

    /**
     * Render news articles based on current filters
     */
    function renderNews() {
        // Filter news
        let filtered = API.filterNews(allNews, currentSearchTerm, currentCategory);

        // Sort news
        filtered = API.sortNews(filtered, currentSort);

        const newsContainer = document.getElementById('newsContainer');
        const emptyState = document.getElementById('emptyState');

        if (filtered.length === 0) {
            newsContainer.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        newsContainer.innerHTML = filtered.map(article => createNewsCard(article)).join('');
    }

    /**
     * Create a news card HTML element
     */
    function createNewsCard(article) {
        const date = API.formatDate(article.date);
        
        return `
            <div class="news-card">
                <div class="news-card-header">
                    <div class="news-category">${escapeHtml(article.category)}</div>
                    <h3 class="news-title">${escapeHtml(article.title)}</h3>
                    <div class="news-meta">
                        <div class="news-date">
                            <span>📅</span>
                            <span>${escapeHtml(date)}</span>
                        </div>
                        <div class="news-source">
                            <span>🏢</span>
                            <span>${escapeHtml(article.source)}</span>
                        </div>
                    </div>
                </div>
                <div class="news-description">
                    ${escapeHtml(article.description)}
                </div>
                <div class="news-footer">
                    <div>
                        ${article.tags.map(tag => `<span class="tag" style="display: inline-block; background: #E8F0FF; color: #4169E1; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; margin-right: 5px; margin-bottom: 5px;">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                    <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                        Read More →
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Show empty state when no news is available
     */
    function showEmptyState() {
        const newsContainer = document.getElementById('newsContainer');
        const emptyState = document.getElementById('emptyState');
        
        newsContainer.innerHTML = '';
        emptyState.style.display = 'block';
    }

    /**
     * Escape HTML special characters to prevent XSS
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    return {
        init
    };
})();

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}