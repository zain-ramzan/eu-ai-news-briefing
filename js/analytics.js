(() => {
    'use strict';

    const GOATCOUNTER_CODE = 'eu-ai-news-briefing';
    const PRODUCTION_HOST = 'zain-ramzan.github.io';
    const counter = document.getElementById('siteVisitCount');

    function formatCount(value) {
        const numericValue = Number(String(value).replace(/[^0-9]/g, ''));
        if (!Number.isFinite(numericValue)) return String(value || '—');
        return new Intl.NumberFormat(I18n?.getLocale?.() || undefined).format(numericValue);
    }

    function renderCounter(value) {
        if (!counter) return;

        const hasValue = value !== null && value !== undefined && value !== '';
        counter.textContent = hasValue ? formatCount(value) : '—';
        counter.dataset.state = hasValue ? 'ready' : 'unavailable';
        if (hasValue) counter.dataset.rawCount = String(value);
    }

    async function loadTotalVisits() {
        if (!counter) return;

        try {
            const response = await fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/TOTAL.json`, {
                cache: 'no-store'
            });
            if (!response.ok) throw new Error(`Counter request failed with ${response.status}`);
            const payload = await response.json();
            renderCounter(payload.count);
        } catch (error) {
            renderCounter(null);
        }
    }

    function enableProductionTracking() {
        if (window.location.hostname !== PRODUCTION_HOST) return;

        const tracker = document.createElement('script');
        tracker.async = true;
        tracker.src = 'https://gc.zgo.at/count.js';
        tracker.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
        document.head.appendChild(tracker);
    }

    document.addEventListener('i18n:changed', () => {
        if (counter?.dataset.rawCount) renderCounter(counter.dataset.rawCount);
    });

    enableProductionTracking();
    loadTotalVisits();
})();
