/* ==========================================================================
   Maison Sucre — Baker Operations SaaS Dashboard Logic
   ========================================================================== */
(function () {
  'use strict';
  const { icon, money, toast } = window.MS;

  /* ---------- Sample Orders Data ---------- */
  const orders = [
    { id: 'MS-8492', customer: 'Léa Seydoux', email: 'lea.seydoux@example.com', product: 'Rose & Lychee Celestine (Two-Tier)', date: 'Thu 9 Oct', slot: 'Morning (8-12)', amount: 116.50, status: 'New', payment: 'Paid' },
    { id: 'MS-8491', customer: 'Arthur Pendelton', email: 'arthur.p@example.com', product: 'Ivory Pampas Wedding Cake (Four-Tier)', date: 'Fri 10 Oct', slot: 'Morning (8-12)', amount: 640.00, status: 'Preparing', payment: 'Paid' },
    { id: 'MS-8489', customer: 'Sophie Turner', email: 'sophie.t@example.com', product: 'Morello Cherry Ganache Torte', date: 'Thu 9 Oct', slot: 'Afternoon (12-4)', amount: 58.00, status: 'Preparing', payment: 'Paid' },
    { id: 'MS-8488', customer: 'James McAvoy', email: 'james.m@example.com', product: 'Strawberry Chantilly Birthday Cake', date: 'Wed 8 Oct', slot: 'Evening (4-8)', amount: 62.00, status: 'Ready', payment: 'Paid' },
    { id: 'MS-8485', customer: 'Charlotte Gainsbourg', email: 'charlotte.g@example.com', product: 'Custom Bronte Pistachio 8" Cake', date: 'Wed 8 Oct', slot: 'Morning (8-12)', amount: 96.00, status: 'Ready', payment: 'Paid' },
    { id: 'MS-8480', customer: 'Benedict Cumberbatch', email: 'benedict.c@example.com', product: 'Grand Goûter Dessert Box x 2', date: 'Tue 7 Oct', slot: 'Afternoon (12-4)', amount: 108.00, status: 'Completed', payment: 'Paid' },
    { id: 'MS-8478', customer: 'Florence Pugh', email: 'florence.p@example.com', product: 'Rose & Lychee Celestine Single', date: 'Tue 7 Oct', slot: 'Morning (8-12)', amount: 68.00, status: 'Completed', payment: 'Paid' },
    { id: 'MS-8472', customer: 'Gemma Arterton', email: 'gemma.a@example.com', product: 'Vanilla Bean Chantilly Cake', date: 'Mon 6 Oct', slot: 'Afternoon (12-4)', amount: 62.00, status: 'Completed', payment: 'Paid' }
  ];

  /* ---------- Sample Products Data ---------- */
  const catalog = [
    { id: 'p1', name: 'Rose & Lychee Celestine', price: 68, active: true, orders: 412, img: 'images/hero_cake.jpg' },
    { id: 'p2', name: 'Ivory Pampas Four-Tier', price: 640, active: true, orders: 96, img: 'images/wedding_cake.jpg' },
    { id: 'p5', name: 'Morello Cherry Ganache Torte', price: 58, active: true, orders: 688, img: 'images/chocolate_cake.jpg' },
    { id: 'p10', name: 'Strawberry Chantilly Cake', price: 62, active: false, orders: 734, img: 'images/berry_birthday_cake.jpg' }
  ];

  /* ---------- Sidebar Navigation & Section Toggling ---------- */
  function initSidebarNav() {
    const navBtns = document.querySelectorAll('.db-nav button');
    const sections = document.querySelectorAll('.db-section');
    const titleEl = document.getElementById('db-tab-title');
    const subEl = document.getElementById('db-tab-sub');

    const titles = {
      overview: { title: 'Dashboard Overview', sub: 'Real-time bookings, production timeline, and atelier performance for today.' },
      orders: { title: 'Order & Production Management', sub: 'Manage incoming bespoke bookings, update status, and track delivery slots.' },
      products: { title: 'Custom Cake Options & Catalog', sub: 'Configure available cake shapes, sizes, flavors, and toggle product availability.' },
      analytics: { title: 'Revenue & Performance Analytics', sub: 'Weekly revenue growth, popular flavor metrics, and customer conversion rates.' },
      settings: { title: 'Atelier Settings', sub: 'Manage delivery zones, kitchen operating hours, and baker profile details.' }
    };

    navBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.dbTab;
        navBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        sections.forEach((sec) => {
          sec.hidden = sec.id !== `sec-${tab}`;
        });

        if (titles[tab]) {
          titleEl.textContent = titles[tab].title;
          subEl.textContent = titles[tab].sub;
        }

        // Close mobile sidebar
        document.getElementById('db-sidebar')?.classList.remove('is-open');
      });
    });

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('sidebar-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        document.getElementById('db-sidebar')?.classList.toggle('is-open');
      });
    }

    // Default view: Show overview & keep others hidden
    sections.forEach((sec) => {
      sec.hidden = sec.id !== 'sec-overview';
    });
  }

  /* ---------- Orders Management Table ---------- */
  function renderOrders(filterStatus = 'all') {
    const tbody = document.getElementById('db-orders-tbody');
    if (!tbody) return;

    let list = [...orders];
    if (filterStatus !== 'all') {
      list = list.filter((o) => o.status === filterStatus);
    }

    const statusClasses = {
      'New': 'st-new',
      'Preparing': 'st-prep',
      'Ready': 'st-ready',
      'Out for Delivery': 'st-out',
      'Completed': 'st-done'
    };

    tbody.innerHTML = list.map((o) => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <strong>${o.customer}</strong><br>
          <small style="color:var(--muted);">${o.email}</small>
        </td>
        <td>${o.product}</td>
        <td>
          <strong>${o.date}</strong><br>
          <small style="color:var(--muted);">${o.slot}</small>
        </td>
        <td><strong>${money(o.amount)}</strong></td>
        <td><span class="status-badge ${statusClasses[o.status] || 'st-done'}">${o.status}</span></td>
        <td><span style="color:#2E7D32; font-weight:600; font-size:.82rem;">✓ ${o.payment}</span></td>
        <td>
          <select class="select" style="min-height:36px; padding:4px 30px 4px 10px; font-size:.82rem;" data-order-id="${o.id}">
            <option value="New" ${o.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready for Courier</option>
            <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
      </tr>`).join('');

    // Attach status update handlers
    tbody.querySelectorAll('select[data-order-id]').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const id = sel.dataset.orderId;
        const newStatus = e.target.value;
        const order = orders.find((o) => o.id === id);
        if (order) {
          order.status = newStatus;
          toast(`Updated ${id} status to ${newStatus}`, 'success');
          renderOrders(filterStatus);
        }
      });
    });
  }

  function initOrderStatusTabs() {
    const tabs = document.querySelectorAll('#order-status-tabs button');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        renderOrders(tab.dataset.stFilter);
      });
    });
  }

  /* ---------- Product Catalog Management ---------- */
  function renderCatalogManagement() {
    const grid = document.getElementById('mgmt-product-grid');
    if (!grid) return;

    grid.innerHTML = catalog.map((p) => `
      <div class="mgmt-card">
        <div class="media">
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="mgmt-card-body">
          <div class="mgmt-card-head">
            <div>
              <h3>${p.name}</h3>
              <p style="font-size:.86rem; color:var(--muted);">${p.orders} total bookings</p>
            </div>
            <label class="toggle-switch" aria-label="Toggle product availability">
              <input type="checkbox" data-product-id="${p.id}" ${p.active ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:12px; border-top:1px solid var(--line);">
            <strong>${money(p.price, true)}</strong>
            <button class="btn btn--ghost btn--sm" type="button" onclick="window.MS.toast('Opening product editor...', 'default')">Edit Product</button>
          </div>
        </div>
      </div>`).join('');

    grid.querySelectorAll('input[data-product-id]').forEach((toggle) => {
      toggle.addEventListener('change', () => {
        const id = toggle.dataset.productId;
        const item = catalog.find((c) => c.id === id);
        if (item) {
          item.active = toggle.checked;
          toast(`${item.name} is now ${item.active ? 'AVAILABLE' : 'OFFLINE'}`, item.active ? 'success' : 'default');
        }
      });
    });
  }

  /* ---------- Refresh & Action Handlers ---------- */
  function initDashboardActions() {
    document.getElementById('btn-refresh')?.addEventListener('click', () => {
      toast('Live order feed refreshed!', 'success');
    });

    document.getElementById('btn-new-product')?.addEventListener('click', () => {
      toast('Opening product creation wizard...', 'default');
    });

    document.getElementById('btn-add-flavor')?.addEventListener('click', () => {
      toast('Opening custom flavor option form...', 'default');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSidebarNav();
    renderOrders();
    initOrderStatusTabs();
    renderCatalogManagement();
    initDashboardActions();
  });
})();
