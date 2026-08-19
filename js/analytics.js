(() => {
    'use strict';

    const GOATCOUNTER_CODE = 'eu-ai-news-briefing';
    const PRODUCTION_HOST = 'zain-ramzan.github.io';
    const counter = document.getElementById('siteVisitCount');

    function markCounterUnavailable() {
        if (!counter) return;
        counter.textContent = '—';
        counter.dataset.state = 'unavailable';
    }

    function renderEmbeddedCounter() {
        if (!counter || !window.goatcounter?.visit_count) {
            markCounterUnavailable();
            return;
        }

        counter.textContent = '';
        counter.dataset.state = 'ready';

        window.goatcounter.visit_count({
            append: '#siteVisitCount',
            path: 'TOTAL',
            type: 'html',
            no_branding: true,
            attr: {
                width: '30',
                height: '20',
                title: 'Total site visits'
            },
            style: `
                body { padding: 0; margin: 0; background: transparent; }
                div { width: auto; height: auto; border: 0; border-radius: 0; text-align: left; line-height: 1; overflow: visible; color: #f5d46d; font-family: monospace; font-size: 12px; font-weight: 700; }
                #gcvc-for { display: none; }
                #gcvc-views { font-size: 12px; }
            `
        });
    }

    function enableProductionTracking() {
        if (window.location.hostname !== PRODUCTION_HOST) return;

        const tracker = document.createElement('script');
        tracker.async = true;
        tracker.src = 'https://gc.zgo.at/count.js';
        tracker.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
        tracker.addEventListener('load', renderEmbeddedCounter, { once: true });
        tracker.addEventListener('error', markCounterUnavailable, { once: true });
        document.head.appendChild(tracker);
    }

    enableProductionTracking();
})();
