/* ==========================================================================
   Maison Sucre — Home page interactions
   ========================================================================== */
(function () {
  'use strict';
  const { icon, money } = window.MS;
  const { products, bakeryById } = window.MS_DATA;

  /* ---------- Cake Studio step showcase ---------- */
  function initStudio() {
    const steps = [...document.querySelectorAll('.cx-step')];
    const rows = [...document.querySelectorAll('#cx-rows li')];
    const bar = document.getElementById('cx-progress');
    if (!steps.length) return;
    let current = 0;
    let timer = null;

    const setStep = (i) => {
      current = i;
      steps.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
      rows.forEach((r, idx) => r.classList.toggle('is-active', idx === i));
      if (bar) bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    };
    const start = () => { stop(); timer = setInterval(() => setStep((current + 1) % steps.length), 3200); };
    const stop = () => clearInterval(timer);

    steps.forEach((s, idx) => {
      s.addEventListener('click', () => { setStep(idx); stop(); });
      s.addEventListener('mouseenter', () => { setStep(idx); stop(); });
    });
    const section = document.getElementById('experience');
    section.addEventListener('mouseleave', start);

    // Only auto-advance while the section is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.35 }).observe(section);
    }
    setStep(0);
  }

  /* ---------- Marketplace highlights carousel ---------- */
  const HL_LABEL = { signature: 'Signature Cake', celebration: 'Celebration Dessert', pastries: 'Artisan Pastry', gifts: 'Gift Box', seasonal: 'Seasonal' };

  function initHighlights() {
    const track = document.getElementById('hl-track');
    const tabs = document.querySelectorAll('#hl-tabs [data-hl]');
    const progress = document.getElementById('hl-progress');
    if (!track) return;

    track.innerHTML = products.map((p) => {
      const b = bakeryById(p.bakery);
      return `
        <a class="hl-card" href="marketplace.html?q=${encodeURIComponent(p.name)}#products" data-group="${p.highlight}" aria-label="${p.name} by ${b.name}, from ${money(p.price, true)}">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="380" height="475" ${p.pos ? `style="object-position:${p.pos}"` : ''}>
          <span class="badge">${HL_LABEL[p.highlight]}</span>
          <div class="hl-body">
            <small>${b.name}</small>
            <h3>${p.name}</h3>
            <div class="hl-foot">
              <span><strong>${money(p.price, true)}</strong> <small style="opacity:.75">· ${p.serves}</small></span>
              <span class="hl-go">${icon('arrow-right')}</span>
            </div>
          </div>
        </a>`;
    }).join('');

    const updateProgress = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      progress.style.width = `${Math.max(ratio, 0.12) * 100}%`;
      progress.style.transform = `translateX(${p * ((1 / Math.max(ratio, 0.12)) - 1) * 100}%)`;
    };
    track.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    const step = () => {
      const card = track.querySelector('.hl-card:not([hidden])');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    document.getElementById('hl-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    document.getElementById('hl-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
      const g = tab.dataset.hl;
      track.querySelectorAll('.hl-card').forEach((c) => { c.hidden = g !== 'all' && c.dataset.group !== g; });
      track.scrollTo({ left: 0, behavior: 'smooth' });
      requestAnimationFrame(updateProgress);
    }));

    updateProgress();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStudio();
    initHighlights();
  });
})();
