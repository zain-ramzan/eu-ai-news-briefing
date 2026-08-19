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

    function getCounterLabel() {
        return document.querySelector('[data-i18n="siteVisits"]')?.textContent || 'Site visits';
    }

    function renderDirectCounter() {
        if (!counter) return;

        const counterStyle = `
            body { padding: 0; margin: 0; background: transparent; }
            div { width: auto; height: auto; border: 0; border-radius: 0; text-align: left; line-height: 1; overflow: visible; color: #f5d46d; font-family: monospace; font-size: 12px; font-weight: 700; }
            #gcvc-for { display: none; }
            #gcvc-views { font-size: 12px; }
        `;
        const frame = document.createElement('iframe');
        frame.width = '32';
        frame.height = '20';
        frame.title = getCounterLabel();
        frame.scrolling = 'no';
        frame.setAttribute('frameborder', '0');
        frame.src = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/TOTAL.html?no_branding=1&style=${encodeURIComponent(counterStyle)}`;
        frame.addEventListener('load', () => {
            counter.dataset.state = 'ready';
        }, { once: true });
        frame.addEventListener('error', markCounterUnavailable, { once: true });

        counter.textContent = '';
        counter.dataset.state = 'loading';
        counter.appendChild(frame);

        document.addEventListener('i18n:changed', () => {
            frame.title = getCounterLabel();
        });
    }

    function recordProductionVisit() {
        const pixel = new Image(1, 1);
        const path = window.location.pathname || '/';
        const viewport = `${window.screen?.width || 0},${window.screen?.height || 0},${window.devicePixelRatio || 1}`;

        pixel.alt = '';
        pixel.width = 1;
        pixel.height = 1;
        pixel.setAttribute('aria-hidden', 'true');
        pixel.style.display = 'none';
        pixel.src = `https://${GOATCOUNTER_CODE}.goatcounter.com/count?p=${encodeURIComponent(path)}&t=${encodeURIComponent(document.title)}&r=${encodeURIComponent(document.referrer || '')}&s=${encodeURIComponent(viewport)}&rnd=${Date.now()}`;
        document.body.appendChild(pixel);
    }

    if (window.location.hostname === PRODUCTION_HOST) {
        renderDirectCounter();
        recordProductionVisit();
    } else {
        markCounterUnavailable();
    }
})();
