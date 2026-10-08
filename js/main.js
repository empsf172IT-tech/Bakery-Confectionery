/* ==========================================================================
   Maison Sucre — shared site behaviour
   Icons · Theme · Navigation · Back-to-top · Reveal · Transitions · Toast
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Inline SVG icon sprite (injected once per page) ---------- */
  const ICONS = {
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor" stroke="none"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'arrow-up-right': '<path d="M7 17L17 7M8 7h9v9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    truck: '<path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    cake: '<path d="M4 20h16M5 20v-6.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5V20M5 15.5c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0M12 12V8.5M12 6.5c-.8-.7-.8-1.7 0-3 .8 1.3.8 2.3 0 3z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    gift: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.3S10 7 12 7zM12 7c1.5-3 5-3.5 5-1.3S14 7 12 7z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    bag: '<path d="M5 8h14l-1 12.5H6zM9 8V6.5a3 3 0 0 1 6 0V8"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>',
    pinterest: '<circle cx="12" cy="12" r="8.5"/><path d="M10.5 20l1.8-7.5M10 13.5c-1.2-2.8.7-6 3.4-5.6 2.2.3 3 2.6 2 4.8-.8 1.7-2.4 2.3-3.6 1.4"/>',
    x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" stroke="none"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    phone: '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
    store: '<path d="M4 9.5V20h16V9.5M3 9.5l1.8-5h14.4l1.8 5zM3 9.5c0 1.6 1.3 2.5 3 2.5s3-.9 3-2.5c0 1.6 1.3 2.5 3 2.5s3-.9 3-2.5c0 1.6 1.3 2.5 3 2.5s3-.9 3-2.5M9.5 20v-5h5v5"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
    box: '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4zM3.5 7.5L12 11.5l8.5-4M12 11.5v9"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    logout: '<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4M6 12h10"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 0 0 4 0"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    more: '<circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 15-14-.5 10-6 15-14 15M5 19l7-7"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    whisk: '<path d="M13.5 10.5L4 20M14.5 9.5c-2-4 0-7 3-7s4.5 3.5 1.5 6.5-6 2.5-6 2.5"/>',
    orders: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h3.5"/>',
    layers: '<path d="M12 3.5l9 4.5-9 4.5L3 8z"/><path d="M3 12.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
    quote: '<path d="M9.5 7C6.5 8 5 10.5 5 13.5V17h5v-5H7.5c0-1.8.8-3 2.5-3.6zM18.5 7c-3 1-4.5 3.5-4.5 6.5V17h5v-5h-2.5c0-1.8.8-3 2.5-3.6z" fill="currentColor" stroke="none"/>'
  };

  function injectSprite() {
    if (document.getElementById('ms-sprite')) return;
    const symbols = Object.entries(ICONS).map(([k, v]) =>
      `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`
    ).join('');
    const wrap = document.createElement('div');
    wrap.innerHTML = `<svg id="ms-sprite" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${symbols}</svg>`;
    document.body.prepend(wrap.firstChild);
  }

  /** Returns the markup for an icon from the sprite. */
  function icon(name, cls = '') {
    return `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  /* ---------- Currency formatting ---------- */
  const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });
  const gbp0 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
  const money = (n, whole) => (whole ? gbp0 : gbp).format(n);

  /* ---------- Animated number updates ---------- */
  function animateNumber(el, to, { duration = 600, format = (v) => money(v) } = {}) {
    if (!el) return;
    const from = parseFloat(el.dataset.value || '0');
    el.dataset.value = to;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) {
      el.textContent = format(to);
      return;
    }
    const start = performance.now();
    cancelAnimationFrame(el._raf);
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(from + (to - from) * eased);
      if (t < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
    el.classList.remove('is-bumped');
    void el.offsetWidth;
    el.classList.add('is-bumped');
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = 'ms-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', theme === 'dark');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }
  function initTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.add('theme-anim');
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
        setTimeout(() => document.documentElement.classList.remove('theme-anim'), 450);
      });
    });
  }

  /* ---------- Header + mobile navigation ---------- */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const toggle = header.querySelector('.nav-toggle');
    const menu = document.getElementById('mobile-menu');

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!toggle || !menu) return;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', open);
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.innerHTML = icon(open ? 'close' : 'menu');
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 960) setOpen(false); });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    const scroller = btn.dataset.scroller ? document.querySelector(btn.dataset.scroller) : null;
    const target = scroller || window;
    const getY = () => (scroller ? scroller.scrollTop : window.scrollY);
    const ring = btn.querySelector('.btt-ring circle');
    const update = () => {
      const y = getY();
      btn.classList.toggle('is-visible', y > 480);
      if (ring) {
        const max = scroller ? scroller.scrollHeight - scroller.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? y / max : 0;
        ring.style.strokeDashoffset = 138 - 138 * p;
      }
    };
    target.addEventListener('scroll', update, { passive: true });
    update();
    btn.addEventListener('click', () => target.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }
  /** Observe elements added later (e.g. JS-rendered cards). */
  function observeReveal(root) {
    const els = (root || document).querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Smooth in-page anchors (accounts for sticky header) ---------- */
  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  }

  /* ---------- Subtle page transitions between internal pages ---------- */
  function initTransitions() {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
          a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (!/\.html(#.*)?$/.test(href)) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { location.href = href; }, 260);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  }

  /* ---------- Toast ---------- */
  function toast(message, type = 'default') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `${icon(type === 'error' ? 'close' : 'check')}<span>${message}</span>`;
    stack.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 320); }, 3200);
  }

  /* ---------- Modal helpers ---------- */
  let lastFocus = null;
  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('modal-open');
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 60);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 280);
    if (lastFocus) lastFocus.focus();
  }
  function initModals() {
    document.addEventListener('click', (e) => {
      const closer = e.target.closest('[data-close-modal]');
      if (closer) closeModal(closer.closest('.modal'));
      if (e.target.classList.contains('modal')) closeModal(e.target);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.querySelectorAll('.modal.is-open').forEach(closeModal);
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Public API ---------- */
  window.MS = { icon, money, animateNumber, toast, openModal, closeModal, observeReveal };

  injectSprite();
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initBackToTop();
    initReveal();
    initAnchors();
    initTransitions();
    initModals();
    initYear();
  });
})();
