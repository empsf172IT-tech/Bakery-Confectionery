/* ==========================================================================
   Maison Sucre — Custom Cake Studio Interactions & Pricing Engine
   ========================================================================== */
(function () {
  'use strict';
  const { icon, money, animateNumber, toast, openModal, closeModal } = window.MS;

  /* ---------- State ---------- */
  const state = {
    shape: 'round-1',
    shapeName: 'Round',
    tiers: 1,
    tierPrice: 0,
    size: '8',
    sizeName: '8" Medium',
    serves: 'Serves 14–16',
    basePrice: 78,
    flavor: 'vanilla',
    flavorName: 'Madagascan Vanilla Bean',
    flavorPrice: 0,
    filling: 'raspberry',
    fillingName: 'Kentish Raspberry Gel',
    fillingPrice: 0,
    frostingColor: '#F9F5EC',
    frostingHex1: '#FDFBF7',
    frostingHex2: '#F4EFE6',
    frostingHex3: '#E2D7C5',
    frostingName: 'Ivory Cream',
    decor: 'florals',
    decorName: 'Pressed Organic Florals',
    decorPrice: 18,
    message: 'Happy Birthday',
    addons: {
      candles: 6,
      box: 8
    },
    qty: 1,
    deliveryFee: 6.50,
    deliveryDate: 'Thu, 9 Oct 2026',
    deliverySlot: 'Morning (8 AM – 12 PM)',
    method: 'delivery',
    address: '14 Montagu Square, W1H 2NN'
  };

  /* ---------- URL Sync ---------- */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('qty')) state.qty = Math.max(1, parseInt(params.get('qty'), 10) || 1);
    if (params.has('slot')) state.deliverySlot = decodeURIComponent(params.get('slot'));
  }

  /* ---------- Customizer Controls & Listeners ---------- */
  function initCustomizer() {
    // 1. Shape Radio Buttons
    document.querySelectorAll('[data-opt="shape"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-opt="shape"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        state.shape = btn.dataset.val;
        state.shapeName = btn.dataset.shape;
        state.tiers = parseInt(btn.dataset.tiers, 10);
        state.tierPrice = parseFloat(btn.dataset.price);
        document.getElementById('out-shape').textContent = `${state.shapeName} · ${state.tiers} Tier${state.tiers > 1 ? 's' : ''}`;
        updatePreviewVisuals();
        recalculatePricing();
      });
    });

    // 2. Size Radio Buttons
    document.querySelectorAll('[data-opt="size"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-opt="size"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        state.size = btn.dataset.val;
        state.sizeName = btn.dataset.label;
        state.serves = btn.dataset.serves;
        state.basePrice = parseFloat(btn.dataset.price);
        document.getElementById('out-size').textContent = `${state.sizeName} (${state.serves})`;
        updatePreviewVisuals();
        recalculatePricing();
      });
    });

    // 3. Flavor Radio Buttons
    document.querySelectorAll('[data-opt="flavor"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-opt="flavor"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        state.flavor = btn.dataset.val;
        state.flavorName = btn.dataset.label;
        state.flavorPrice = parseFloat(btn.dataset.price);
        document.getElementById('out-flavor').textContent = state.flavorName;
        recalculatePricing();
      });
    });

    // 4. Filling Radio Buttons
    document.querySelectorAll('[data-opt="filling"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-opt="filling"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        state.filling = btn.dataset.val;
        state.fillingName = btn.dataset.label;
        state.fillingPrice = parseFloat(btn.dataset.price);
        document.getElementById('out-filling').textContent = state.fillingName;
        recalculatePricing();
      });
    });

    // 5. Frosting Swatches
    document.querySelectorAll('.swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-checked', 'false'));
        swatch.setAttribute('aria-checked', 'true');
        state.frostingColor = swatch.dataset.color;
        state.frostingHex1 = swatch.dataset.hex1;
        state.frostingHex2 = swatch.dataset.hex2;
        state.frostingHex3 = swatch.dataset.hex3;
        state.frostingName = swatch.dataset.name;
        document.getElementById('out-frosting').textContent = state.frostingName;
        updateFrostingColor();
      });
    });

    // 6. Decor Radio Buttons
    document.querySelectorAll('[data-opt="decor"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-opt="decor"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
        btn.setAttribute('aria-checked', 'true');
        state.decor = btn.dataset.val;
        state.decorName = btn.dataset.label;
        state.decorPrice = parseFloat(btn.dataset.price);
        document.getElementById('out-decor').textContent = state.decorName;
        updateDecorVisuals();
        recalculatePricing();
      });
    });

    // 7. Message Input
    const msgInput = document.getElementById('cake-msg-input');
    const msgCount = document.getElementById('msg-count');
    const svgMsg = document.getElementById('svg-msg-text');

    msgInput.addEventListener('input', () => {
      state.message = msgInput.value.trim();
      msgCount.textContent = `${msgInput.value.length}/40`;
      if (svgMsg) svgMsg.textContent = state.message || 'Custom Message';
      document.getElementById('sum-spec-msg').textContent = state.message ? `"${state.message}"` : 'None';
    });
  }

  /* ---------- SVG 2D Render Updates ---------- */
  function updatePreviewVisuals() {
    const svg = document.getElementById('cake-svg');
    const tier2 = document.getElementById('svg-tier-2');
    const tier3 = document.getElementById('svg-tier-3');
    const shapeTag = document.getElementById('preview-shape-tag');

    if (svg) {
      svg.classList.remove('is-swapping');
      void svg.offsetWidth;
      svg.classList.add('is-swapping');
    }

    if (tier2) tier2.style.display = state.tiers >= 2 ? 'inline' : 'none';
    if (tier3) tier3.style.display = state.tiers >= 3 ? 'inline' : 'none';

    if (shapeTag) shapeTag.textContent = `${state.shapeName} · ${state.tiers} Tier${state.tiers > 1 ? 's' : ''}`;

    document.getElementById('meta-size').textContent = `${state.sizeName} (${state.serves})`;
    document.getElementById('meta-flavor').textContent = state.flavorName;
    document.getElementById('meta-fill').textContent = state.fillingName;
  }

  function updateFrostingColor() {
    const s1 = document.getElementById('gradStop1');
    const s2 = document.getElementById('gradStop2');
    const s3 = document.getElementById('gradStop3');

    if (s1) s1.setAttribute('stop-color', state.frostingHex1);
    if (s2) s2.setAttribute('stop-color', state.frostingHex2);
    if (s3) s3.setAttribute('stop-color', state.frostingHex3);

    const tops = ['t1-top', 't2-top', 't3-top'];
    tops.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('fill', state.frostingHex1);
    });
  }

  function updateDecorVisuals() {
    const drip = document.getElementById('svg-drip');
    const florals = document.getElementById('svg-decor-florals');

    if (drip) drip.style.opacity = state.decor === 'ganache-drip' ? '0.95' : '0';
    if (florals) florals.style.display = (state.decor === 'florals' || state.decor === 'sugar-flowers') ? 'inline' : 'none';
  }

  /* ---------- Pricing Calculator ---------- */
  function initAddonsAndQty() {
    document.querySelectorAll('.addon input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const name = cb.dataset.addon;
        const price = parseFloat(cb.dataset.price);
        if (cb.checked) {
          state.addons[name] = price;
        } else {
          delete state.addons[name];
        }
        recalculatePricing();
      });
    });

    const qtyOut = document.getElementById('calc-qty-out');
    document.getElementById('calc-qty-minus').addEventListener('click', () => {
      if (state.qty > 1) {
        state.qty--;
        if (qtyOut) qtyOut.textContent = state.qty;
        recalculatePricing();
      }
    });
    document.getElementById('calc-qty-plus').addEventListener('click', () => {
      if (state.qty < 10) {
        state.qty++;
        if (qtyOut) qtyOut.textContent = state.qty;
        recalculatePricing();
      }
    });
  }

  function recalculatePricing() {
    const flavorComp = state.flavorPrice + state.fillingPrice;
    const addonTotal = Object.values(state.addons).reduce((a, b) => a + b, 0);

    const singleCakeCost = state.basePrice + state.tierPrice + flavorComp + state.decorPrice + addonTotal;
    const subtotal = singleCakeCost * state.qty;
    const total = subtotal + (state.method === 'delivery' ? state.deliveryFee : 0);

    // Update Stage Price
    animateNumber(document.getElementById('stage-price-val'), total);

    // Update Receipt Breakdown
    document.getElementById('rcpt-size').textContent = state.sizeName;
    document.getElementById('rcpt-base-price').textContent = money(state.basePrice);
    document.getElementById('rcpt-tiers').textContent = `${state.tiers} Tier${state.tiers > 1 ? 's' : ''}`;
    document.getElementById('rcpt-tier-price').textContent = money(state.tierPrice);
    document.getElementById('rcpt-flavor-price').textContent = money(flavorComp);
    document.getElementById('rcpt-decor-price').textContent = money(state.decorPrice);
    document.getElementById('rcpt-addon-price').textContent = money(addonTotal);
    document.getElementById('rcpt-del-price').textContent = state.method === 'delivery' ? money(state.deliveryFee) : 'FREE';

    animateNumber(document.getElementById('rcpt-final-total'), total);

    // Update Summary Section
    updateSummaryView(total);
  }

  /* ---------- Delivery Slot Picker & Calendar ---------- */
  function initCalendarAndSlots() {
    const calDaysBox = document.getElementById('cal-days');
    if (!calDaysBox) return;

    // Generate 31 days for current month
    const totalDays = 31;
    const firstDayOffset = 3; // Start Thursday
    let html = '';

    for (let i = 0; i < firstDayOffset; i++) {
      html += `<div class="cal-day is-past"></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      let cls = 'is-available';
      if (d < 8) cls = 'is-prep';
      else if (d === 8) cls = 'is-today is-available';
      else if (d === 9) cls = 'is-selected';
      else if (d === 15 || d === 24) cls = 'is-limited';
      else if (d === 18 || d === 25) cls = 'is-full';

      html += `<button class="cal-day ${cls}" type="button" data-day="${d}">
        ${d}
      </button>`;
    }

    calDaysBox.innerHTML = html;

    calDaysBox.querySelectorAll('.cal-day:not(.is-past):not(.is-prep):not(.is-full)').forEach((btn) => {
      btn.addEventListener('click', () => {
        calDaysBox.querySelectorAll('.cal-day').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const day = btn.dataset.day;
        state.deliveryDate = `${getDayOfWeek(day)}, ${day} Oct 2026`;
        document.getElementById('sel-date-text').textContent = `${getDayOfWeek(day)} ${day} Oct`;
        document.getElementById('sum-date').textContent = state.deliveryDate;
        toast(`Selected date: ${state.deliveryDate}`, 'success');
      });
    });

    // Slots Radio Buttons
    document.querySelectorAll('#slot-list .slot').forEach((slotBtn) => {
      slotBtn.addEventListener('click', () => {
        document.querySelectorAll('#slot-list .slot').forEach(b => b.setAttribute('aria-checked', 'false'));
        slotBtn.setAttribute('aria-checked', 'true');
        state.deliverySlot = slotBtn.dataset.slot;
        document.getElementById('sum-slot').textContent = state.deliverySlot;
      });
    });

    // Delivery vs Pickup Toggle
    const tabDelivery = document.getElementById('tab-delivery');
    const tabPickup = document.getElementById('tab-pickup');
    const delPanel = document.getElementById('method-delivery-panel');
    const pickPanel = document.getElementById('method-pickup-panel');

    tabDelivery.addEventListener('click', () => {
      tabDelivery.classList.add('is-active'); tabDelivery.setAttribute('aria-selected', 'true');
      tabPickup.classList.remove('is-active'); tabPickup.setAttribute('aria-selected', 'false');
      delPanel.hidden = false; pickPanel.hidden = true;
      state.method = 'delivery';
      recalculatePricing();
    });

    tabPickup.addEventListener('click', () => {
      tabPickup.classList.add('is-active'); tabPickup.setAttribute('aria-selected', 'true');
      tabDelivery.classList.remove('is-active'); tabDelivery.setAttribute('aria-selected', 'false');
      delPanel.hidden = true; pickPanel.hidden = false;
      state.method = 'pickup';
      recalculatePricing();
    });

    // Address input
    const addrInput = document.getElementById('cust-address');
    const postInput = document.getElementById('cust-postcode');
    const onAddressChange = () => {
      state.address = `${addrInput.value}, ${postInput.value}`;
      document.getElementById('sum-address').textContent = state.address;
    };
    addrInput.addEventListener('input', onAddressChange);
    postInput.addEventListener('input', onAddressChange);
  }

  function getDayOfWeek(dayNum) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const idx = (parseInt(dayNum, 10) + 3) % 7;
    return days[idx];
  }

  /* ---------- Summary View Sync & Final Confirmation ---------- */
  function updateSummaryView(total) {
    document.getElementById('sum-cake-title').textContent = `${state.sizeName} Bespoke ${state.flavorName} Cake`;
    document.getElementById('sum-spec-shape').textContent = `${state.shapeName} · ${state.tiers} Tier${state.tiers > 1 ? 's' : ''}`;
    document.getElementById('sum-spec-size').textContent = `${state.sizeName} (${state.serves})`;
    document.getElementById('sum-spec-flavor').textContent = state.flavorName;
    document.getElementById('sum-spec-filling').textContent = state.fillingName;
    document.getElementById('sum-spec-decor').textContent = state.decorName;

    // Render mini cake preview SVG into summary
    const sumRender = document.getElementById('sum-cake-render');
    if (sumRender) {
      sumRender.innerHTML = `
        <svg viewBox="0 0 400 400" fill="none">
          <path d="M100 240 C100 230, 300 230, 300 240 L300 320 C300 330, 100 330, 100 320 Z" fill="${state.frostingHex2}"/>
          <ellipse cx="200" cy="240" rx="100" ry="14" fill="${state.frostingHex1}"/>
          ${state.tiers >= 2 ? `<path d="M130 160 C130 150, 270 150, 270 160 L270 240 C270 250, 130 250, 130 240 Z" fill="${state.frostingHex2}"/><ellipse cx="200" cy="160" rx="70" ry="10" fill="${state.frostingHex1}"/>` : ''}
          ${state.decor === 'florals' || state.decor === 'sugar-flowers' ? `<circle cx="200" cy="150" r="10" fill="var(--terra)"/>` : ''}
        </svg>`;
    }

    animateNumber(document.getElementById('sum-tot-val'), total);
    animateNumber(document.getElementById('sum-pay-val'), total);
  }

  function initBookingConfirmation() {
    const form = document.getElementById('booking-confirm-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('confirm-modal');
      openModal(modal);
      toast('Booking submitted successfully!', 'success');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    initCustomizer();
    initAddonsAndQty();
    initCalendarAndSlots();
    initBookingConfirmation();
    updatePreviewVisuals();
    updateFrostingColor();
    updateDecorVisuals();
    recalculatePricing();
  });
})();
