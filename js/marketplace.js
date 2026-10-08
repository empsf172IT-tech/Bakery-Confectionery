/* ==========================================================================
   Maison Sucre — Marketplace Interactions
   ========================================================================== */
(function () {
  'use strict';
  const { icon, money, toast, openModal, closeModal, observeReveal } = window.MS;
  const { bakeries, products, categories, deliveryLabel, bakeryById } = window.MS_DATA;

  /* ---------- State ---------- */
  const state = {
    search: '',
    category: 'all',
    occasion: 'all',
    dietary: new Set(),
    maxPrice: 650,
    sort: 'featured',
    bakery: 'all',
    favorites: new Set(['p1', 'p4']),
    selectedBookingProduct: products[0].id,
    bookingQty: 1,
    bookingSlot: 'Morning (8 AM – 12 PM)',
    bookingDateIndex: 1
  };

  /* ---------- URL sync ---------- */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) state.search = params.get('q');
    if (params.has('cat')) state.category = params.get('cat');
    if (params.has('occasion')) state.occasion = params.get('occasion');
    if (params.has('bakery')) state.bakery = params.get('bakery');
  }

  /* ---------- Smart Discovery & Category bar ---------- */
  function renderCategories() {
    const row = document.getElementById('mp-cat-row');
    if (!row) return;
    row.innerHTML = categories.map((cat) => {
      const active = state.category === cat.id;
      const count = cat.id === 'all' ? products.length : products.filter((p) => p.category === cat.id).length;
      return `<button class="chip ${active ? 'is-active' : ''}" role="tab" aria-selected="${active}" data-cat="${cat.id}">
        ${cat.label} <span class="count">(${count})</span>
      </button>`;
    }).join('');

    row.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.cat;
        renderCategories();
        filterAndRenderProducts();
      });
    });
  }

  /* ---------- Filters & Search Listeners ---------- */
  function initFilters() {
    const searchInput = document.getElementById('mp-search');
    const searchBtn = document.getElementById('mp-search-btn');
    const toggleFiltersBtn = document.getElementById('filters-toggle');
    const filtersBox = document.getElementById('mp-filters');
    const occasionSelect = document.getElementById('f-occasion');
    const dietChips = document.querySelectorAll('#f-dietary [data-diet]');
    const priceSlider = document.getElementById('f-price');
    const priceOutput = document.getElementById('f-price-out');
    const sortSelect = document.getElementById('f-sort');

    if (state.search) searchInput.value = state.search;
    if (state.occasion !== 'all') occasionSelect.value = state.occasion;

    const onSearch = () => {
      state.search = searchInput.value.trim().toLowerCase();
      filterAndRenderProducts();
    };

    searchInput.addEventListener('input', onSearch);
    searchBtn.addEventListener('click', onSearch);

    document.querySelectorAll('.search-suggest button').forEach((btn) => {
      btn.addEventListener('click', () => {
        searchInput.value = btn.dataset.search;
        state.search = btn.dataset.search.toLowerCase();
        filterAndRenderProducts();
      });
    });

    if (toggleFiltersBtn && filtersBox) {
      toggleFiltersBtn.addEventListener('click', () => {
        const open = filtersBox.classList.toggle('is-open');
        toggleFiltersBtn.setAttribute('aria-expanded', open);
        toggleFiltersBtn.querySelector('span').textContent = open ? 'Hide Filters' : 'Refine Filters';
      });
    }

    occasionSelect.addEventListener('change', (e) => {
      state.occasion = e.target.value;
      filterAndRenderProducts();
    });

    dietChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const diet = chip.dataset.diet;
        if (state.dietary.has(diet)) {
          state.dietary.delete(diet);
          chip.classList.remove('is-active');
        } else {
          state.dietary.add(diet);
          chip.classList.add('is-active');
        }
        filterAndRenderProducts();
      });
    });

    priceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.maxPrice = val;
      priceOutput.textContent = money(val, true);
      const pct = ((val - 20) / (650 - 20)) * 100;
      priceSlider.style.setProperty('--fill', `${pct}%`);
      filterAndRenderProducts();
    });

    sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      filterAndRenderProducts();
    });
  }

  /* ---------- Product Filtering & Rendering ---------- */
  function filterAndRenderProducts() {
    let list = [...products];

    if (state.search) {
      list = list.filter((p) => {
        const b = bakeryById(p.bakery);
        return p.name.toLowerCase().includes(state.search) ||
               p.desc.toLowerCase().includes(state.search) ||
               b.name.toLowerCase().includes(state.search) ||
               p.category.toLowerCase().includes(state.search);
      });
    }

    if (state.category !== 'all') {
      list = list.filter((p) => p.category === state.category);
    }

    if (state.occasion !== 'all') {
      list = list.filter((p) => p.occasions.includes(state.occasion));
    }

    if (state.dietary.size > 0) {
      list = list.filter((p) => [...state.dietary].every((d) => p.dietary.includes(d)));
    }

    if (state.bakery !== 'all') {
      list = list.filter((p) => p.bakery === state.bakery);
    }

    list = list.filter((p) => p.price <= state.maxPrice);

    if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);

    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('results-count');
    const activeBox = document.getElementById('active-filters');

    countEl.textContent = `${list.length} ${list.length === 1 ? 'creation' : 'creations'}`;

    renderActiveFilterChips(activeBox);

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state reveal">
          <h3>No creations matched your criteria</h3>
          <p>Try resetting your price slider, clearing dietary preferences, or searching for broader terms like "Cake" or "Box".</p>
          <button class="btn btn--primary" type="button" id="reset-filters-btn">Reset All Filters</button>
        </div>`;
      document.getElementById('reset-filters-btn')?.addEventListener('click', resetAllFilters);
      observeReveal(grid);
      return;
    }

    grid.innerHTML = list.map((p) => {
      const b = bakeryById(p.bakery);
      const isFav = state.favorites.has(p.id);
      return `
        <article class="product-card reveal" data-id="${p.id}">
          <div class="media">
            <div class="pc-top">
              ${p.badge ? `<span class="badge ${p.badge === 'Signature' || p.badge === 'Bestseller' ? 'badge--accent' : ''}">${p.badge}</span>` : ''}
              <button class="fav-btn" type="button" data-fav="${p.id}" aria-pressed="${isFav}" aria-label="Add to wishlist">
                <svg class="i"><use href="#i-heart"></use></svg>
              </button>
            </div>
            <img src="${p.img}" alt="${p.name}" loading="lazy" width="400" height="440" ${p.pos ? `style="object-position:${p.pos}"` : ''}>
            <button class="quick-view" type="button" data-qv="${p.id}">
              <svg class="i"><use href="#i-eye"></use></svg> Quick View
            </button>
          </div>
          <div class="pc-body">
            <div class="pc-bakery">
              <span>${b.name}</span>
              <span class="rating"><svg class="i"><use href="#i-star"></use></svg>${p.rating}</span>
            </div>
            <h3 class="pc-name">${p.name}</h3>
            <span class="pc-delivery"><svg class="i"><use href="#i-truck"></use></svg> ${deliveryLabel[p.delivery]}</span>
            <div class="pc-foot">
              <div class="pc-price">
                <small>Starting at</small>
                <strong>${money(p.price, true)}</strong>
              </div>
              <div class="pc-actions">
                <a href="custom-cake.html?product=${p.id}" class="btn btn--ghost btn--sm" aria-label="Customize ${p.name}">Customize</a>
                <button class="btn btn--dark btn--sm pc-add" type="button" data-add-booking="${p.id}">Book</button>
              </div>
            </div>
          </div>
        </article>`;
    }).join('');

    grid.querySelectorAll('[data-fav]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.fav;
        if (state.favorites.has(id)) {
          state.favorites.delete(id);
          btn.setAttribute('aria-pressed', 'false');
          toast('Removed from favorites');
        } else {
          state.favorites.add(id);
          btn.setAttribute('aria-pressed', 'true');
          toast('Added to your saved favorites', 'success');
        }
      });
    });

    grid.querySelectorAll('[data-qv]').forEach((btn) => {
      btn.addEventListener('click', () => openQuickView(btn.dataset.qv));
    });

    grid.querySelectorAll('[data-add-booking]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedBookingProduct = btn.dataset.add-booking;
        updateBookingPreview();
        const bookingSection = document.getElementById('booking');
        bookingSection?.scrollIntoView({ behavior: 'smooth' });
        toast('Loaded product into Booking Preview', 'success');
      });
    });

    observeReveal(grid);
  }

  function renderActiveFilterChips(container) {
    if (!container) return;
    const chips = [];

    if (state.search) chips.push({ label: `Search: "${state.search}"`, clear: () => { state.search = ''; document.getElementById('mp-search').value = ''; } });
    if (state.category !== 'all') chips.push({ label: `Category: ${categories.find(c => c.id === state.category)?.label}`, clear: () => { state.category = 'all'; renderCategories(); } });
    if (state.occasion !== 'all') chips.push({ label: `Occasion: ${state.occasion}`, clear: () => { state.occasion = 'all'; document.getElementById('f-occasion').value = 'all'; } });
    if (state.bakery !== 'all') chips.push({ label: `Bakery: ${bakeryById(state.bakery)?.name}`, clear: () => { state.bakery = 'all'; } });
    state.dietary.forEach((d) => chips.push({ label: `Dietary: ${d}`, clear: () => { state.dietary.delete(d); document.querySelector(`[data-diet="${d}"]`)?.classList.remove('is-active'); } }));
    if (state.maxPrice < 650) chips.push({ label: `Under ${money(state.maxPrice, true)}`, clear: () => { state.maxPrice = 650; const slider = document.getElementById('f-price'); if (slider) slider.value = 650; document.getElementById('f-price-out').textContent = '£650'; } });

    if (chips.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = chips.map((c, i) => `
      <button type="button" data-chip-idx="${i}">${c.label} ${icon('close')}</button>
    `).join('') + `<button type="button" style="background:none; border:none; text-decoration:underline; cursor:pointer; font-size:.82rem; color:var(--muted);" id="clear-all-chips">Clear all</button>`;

    container.querySelectorAll('[data-chip-idx]').forEach((btn) => {
      const idx = parseInt(btn.dataset.chip-idx, 10);
      btn.addEventListener('click', () => {
        chips[idx].clear();
        filterAndRenderProducts();
      });
    });

    document.getElementById('clear-all-chips')?.addEventListener('click', resetAllFilters);
  }

  function resetAllFilters() {
    state.search = '';
    state.category = 'all';
    state.occasion = 'all';
    state.dietary.clear();
    state.maxPrice = 650;
    state.sort = 'featured';
    state.bakery = 'all';
    document.getElementById('mp-search').value = '';
    document.getElementById('f-occasion').value = 'all';
    document.getElementById('f-sort').value = 'featured';
    const slider = document.getElementById('f-price');
    if (slider) slider.value = 650;
    document.getElementById('f-price-out').textContent = '£650';
    document.querySelectorAll('#f-dietary .chip').forEach(c => c.classList.remove('is-active'));
    renderCategories();
    filterAndRenderProducts();
  }

  /* ---------- Quick View Modal ---------- */
  function openQuickView(id) {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    const b = bakeryById(p.bakery);
    const modal = document.getElementById('qv-modal');

    document.getElementById('qv-img').src = p.img;
    document.getElementById('qv-img').alt = p.name;
    document.getElementById('qv-badge').textContent = p.badge || 'Featured';
    document.getElementById('qv-title').textContent = p.name;
    document.getElementById('qv-bakery').textContent = `${b.name} · ${b.baker}`;
    document.getElementById('qv-desc').textContent = p.desc;
    document.getElementById('qv-serves').textContent = p.serves;
    document.getElementById('qv-lead').textContent = p.lead;
    document.getElementById('qv-del').textContent = deliveryLabel[p.delivery];
    document.getElementById('qv-rating').textContent = `${p.rating} (${p.reviews} reviews)`;
    document.getElementById('qv-price').textContent = money(p.price);

    document.getElementById('qv-custom-cta').href = `custom-cake.html?product=${p.id}`;

    const bookBtn = document.getElementById('qv-book-btn');
    bookBtn.onclick = () => {
      closeModal(modal);
      state.selectedBookingProduct = p.id;
      updateBookingPreview();
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      toast(`Added ${p.name} to booking preview`, 'success');
    };

    openModal(modal);
  }

  /* ---------- Artisan Baker Profiles ---------- */
  function renderBakerProfiles() {
    const grid = document.getElementById('baker-grid');
    if (!grid) return;

    grid.innerHTML = bakeries.map((b) => `
      <article class="baker-card reveal">
        <div class="media">
          <img src="${b.signatureImg}" alt="${b.signature}" loading="lazy" width="400" height="400">
        </div>
        <div class="baker-years">
          <strong>${b.years}</strong>
          <span>Years Exp.</span>
        </div>
        <div class="baker-body">
          <span class="rating"><svg class="i"><use href="#i-star"></use></svg>${b.rating} <small>(${b.reviews} orders)</small></span>
          <h3>${b.name}</h3>
          <p class="baker-who">${b.baker} · ${b.role}</p>
          <p class="baker-spec">${b.specialty}</p>
          <div class="baker-stats">
            <span class="zone"><svg class="i"><use href="#i-pin"></use></svg> ${b.zone}</span>
          </div>
          <div class="baker-signature">
            <img src="${b.signatureImg}" alt="${b.signature}">
            <div>
              <small>Signature Creation</small>
              <strong>${b.signature}</strong>
            </div>
          </div>
          <button type="button" class="btn btn--dark btn--sm" data-filter-bakery="${b.id}">
            Explore Bakery Products <svg class="i i--move"><use href="#i-arrow-right"></use></svg>
          </button>
        </div>
      </article>`).join('');

    grid.querySelectorAll('[data-filter-bakery]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.bakery = btn.dataset.filter-bakery;
        state.category = 'all';
        renderCategories();
        filterAndRenderProducts();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        toast(`Showing creations from ${bakeryById(state.bakery).name}`, 'default');
      });
    });

    observeReveal(grid);
  }

  /* ---------- Booking & Delivery Preview ---------- */
  function initBookingPreview() {
    const changeBar = document.getElementById('bp-change');
    if (!changeBar) return;

    changeBar.innerHTML = products.slice(0, 6).map((p) => `
      <button type="button" class="${p.id === state.selectedBookingProduct ? 'is-active' : ''}" data-bp-product="${p.id}" aria-label="Select ${p.name}">
        <img src="${p.img}" alt="${p.name}">
      </button>`).join('');

    changeBar.querySelectorAll('[data-bp-product]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedBookingProduct = btn.dataset.bpProduct;
        changeBar.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
        updateBookingPreview();
      });
    });

    // Date chips (next 7 days starting tomorrow)
    const dateChipsBox = document.getElementById('bp-date-chips');
    const today = new Date();
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        date: d,
        dayName: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-GB', { month: 'short' }),
        disabled: i === 1 && false // available
      });
    }

    dateChipsBox.innerHTML = days.map((d, idx) => `
      <button type="button" class="date-chip ${idx === state.bookingDateIndex ? 'is-active' : ''}" data-date-idx="${idx}">
        <small>${d.dayName}</small>
        <strong>${d.dayNum}</strong>
      </button>`).join('');

    dateChipsBox.querySelectorAll('[data-date-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.bookingDateIndex = parseInt(btn.dataset.dateIdx, 10);
        dateChipsBox.querySelectorAll('.date-chip').forEach((c, idx) => c.classList.toggle('is-active', idx === state.bookingDateIndex));
        updateBookingPreview();
      });
    });

    // Slot seg
    const slotSeg = document.getElementById('bp-slot-seg');
    slotSeg.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        slotSeg.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.bookingSlot = btn.dataset.slot;
        updateBookingPreview();
      });
    });

    // Stepper
    document.getElementById('bp-qty-minus').addEventListener('click', () => {
      if (state.bookingQty > 1) {
        state.bookingQty--;
        document.getElementById('bp-qty-out').textContent = state.bookingQty;
        updateBookingPreview();
      }
    });
    document.getElementById('bp-qty-plus').addEventListener('click', () => {
      if (state.bookingQty < 10) {
        state.bookingQty++;
        document.getElementById('bp-qty-out').textContent = state.bookingQty;
        updateBookingPreview();
      }
    });

    document.getElementById('bp-continue').addEventListener('click', (e) => {
      e.preventDefault();
      const p = products.find((prod) => prod.id === state.selectedBookingProduct);
      window.location.href = `custom-cake.html?product=${p.id}&qty=${state.bookingQty}&slot=${encodeURIComponent(state.bookingSlot)}`;
    });

    updateBookingPreview();
  }

  function updateBookingPreview() {
    const p = products.find((prod) => prod.id === state.selectedBookingProduct) || products[0];
    const b = bakeryById(p.bakery);

    document.getElementById('bp-img').src = p.img;
    document.getElementById('bp-bakery-tag').textContent = `${b.name} · ${b.zone.split('·')[0]}`;
    document.getElementById('bp-name').textContent = p.name;
    document.getElementById('bp-desc').textContent = p.desc;
    document.getElementById('bp-baker-name').textContent = `Baked fresh by ${b.baker}`;
    document.getElementById('bp-baker-zone').textContent = `Direct delivery from ${b.zone.split('·')[0]} Atelier`;

    if (b.portrait) {
      document.getElementById('bp-avatar').innerHTML = `<img src="${b.portrait}" alt="${b.baker}">`;
    } else {
      document.getElementById('bp-avatar').innerHTML = b.initials;
    }

    const prodPrice = p.price * state.bookingQty;
    const delFee = 6.50;
    const total = prodPrice + delFee;

    document.getElementById('bp-est-qty').textContent = state.bookingQty;
    document.getElementById('bp-est-prod').textContent = money(prodPrice);
    document.getElementById('bp-est-del').textContent = money(delFee);
    document.getElementById('bp-est-total').textContent = money(total);
  }

  document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    renderCategories();
    initFilters();
    filterAndRenderProducts();
    renderBakerProfiles();
    initBookingPreview();
  });
})();
