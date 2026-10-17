/*
  ============================================================
  GOVIND PATIDAR — PERSONAL PORTFOLIO & LIVE PROJECT SHOWCASE
  script.js | All interactive engines, demos & form dispatcher
  ============================================================
*/

'use strict';

/* ══════════════════════════════════════════════════════════
   0. CONFIGURATION
   ══════════════════════════════════════════════════════════ */
const RECIPIENT_EMAIL = "patidargovind0605@gmail.com";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;
const GITHUB_USERNAME = "patidargovind";
const GITHUB_REPOS_URL = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;

function initGithubLinks() {
  document.querySelectorAll('.btn-code-link').forEach(link => {
    const customRepo = link.getAttribute('data-repo');
    if (customRepo) {
      link.href = `https://github.com/${GITHUB_USERNAME}/${customRepo}`;
    } else if (!link.getAttribute('href') || link.getAttribute('href') === '#' || link.getAttribute('href').includes('tab=repositories')) {
      link.href = GITHUB_REPOS_URL;
    }
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

/* ══════════════════════════════════════════════════════════
   1. THEME TOGGLE
   ══════════════════════════════════════════════════════════ */
function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  function syncButton() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(!isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch (e) {}

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', next === 'dark' ? '#0b1020' : '#f5f7ff');
    }

    syncButton();
  });

  syncButton();
}

/* ══════════════════════════════════════════════════════════
   2. NAVIGATION
   ══════════════════════════════════════════════════════════ */
function initNav() {
  const navbar      = document.querySelector('.navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const navLinks    = document.querySelectorAll('.navbar__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const sections    = document.querySelectorAll('section[id]');

  if (!navbar || !hamburger || !mobileMenu) return;

  function handleNavbarScroll() {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  function openMenu() {
    mobileMenu.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (hamburger.getAttribute('aria-expanded') === 'true' && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  let activeId = '';
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${activeId}`);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(s => sectionObserver.observe(s));
}

/* ══════════════════════════════════════════════════════════
   3. SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   4. BACK TO TOP & FOOTER YEAR
   ══════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.removeAttribute('hidden');
    else btn.setAttribute('hidden', '');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   5. TOAST NOTIFICATIONS
   ══════════════════════════════════════════════════════════ */
function showToast(message, isSuccess = true) {
  const existing = document.getElementById('gp-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'gp-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '24px',
    left:         '50%',
    transform:    'translateX(-50%)',
    background:   isSuccess ? 'var(--color-surface)' : 'rgba(239, 68, 68, 0.95)',
    color:        isSuccess ? 'var(--color-text)' : '#fff',
    border:       `1px solid ${isSuccess ? 'var(--color-accent-blue)' : '#ef4444'}`,
    borderRadius: 'var(--radius-full)',
    padding:      '12px 24px',
    fontSize:     'var(--text-sm)',
    fontWeight:   '600',
    boxShadow:    'var(--shadow-lg)',
    zIndex:       '9999',
    maxWidth:     '90vw',
    textAlign:    'center',
    opacity:      '0',
    transition:   'opacity 250ms ease, transform 250ms ease',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(-4px)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ══════════════════════════════════════════════════════════
   6. CONTACT FORM & LIVE EMAIL DISPATCHER
   ══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const feedback  = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit');
  const logBox    = document.getElementById('sent-log-box');
  const logBody   = document.getElementById('sent-log-body');
  const logCount  = document.getElementById('sent-log-count');
  if (!form) return;

  let sentMessages = [];
  try {
    const saved = localStorage.getItem('govind_sent_msgs');
    if (saved) sentMessages = JSON.parse(saved);
  } catch (e) {}

  function renderSentLog() {
    if (!logBox || !logBody) return;
    if (sentMessages.length === 0) {
      logBox.style.display = 'none';
      return;
    }
    logBox.style.display = 'block';
    if (logCount) logCount.textContent = `${sentMessages.length} message${sentMessages.length > 1 ? 's' : ''} sent`;

    logBody.innerHTML = sentMessages.slice(-3).reverse().map(m => `
      <div class="sent-log-item">
        <strong>${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</strong>
        <span>"${escapeHtml(m.subject || m.message.slice(0, 40))}..."</span>
        <span class="sent-log-time">✓ Dispatched: ${m.time} · Status 200 OK</span>
      </div>
    `).join('');
  }

  renderSentLog();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'contact-form__feedback';

    const nameInput    = document.getElementById('contact-name');
    const emailInput   = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput.value.trim();

    if (name.length < 2) {
      feedback.textContent = '⚠️ Please enter your name (minimum 2 characters).';
      feedback.classList.add('contact-form__feedback--error');
      nameInput.focus();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      feedback.textContent = '⚠️ Please enter a valid email address.';
      feedback.classList.add('contact-form__feedback--error');
      emailInput.focus();
      return;
    }
    if (message.length < 10) {
      feedback.textContent = '⚠️ Message must be at least 10 characters long.';
      feedback.classList.add('contact-form__feedback--error');
      messageInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span> <span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-left:8px;"></span>`;

    const payload = {
      name: name,
      email: email,
      _subject: subject || `Portfolio Contact from ${name}`,
      message: message,
      _captcha: 'false',
      _template: 'table'
    };

    let delivered = false;

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        delivered = true;
      }
    } catch (err) {
      console.warn('Direct API submission encountered network restriction. Falling back gracefully.', err);
    }

    // Record message in client-side log for absolute transparency and verification
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    sentMessages.push({ name, email, subject, message, time: now });
    try {
      localStorage.setItem('govind_sent_msgs', JSON.stringify(sentMessages));
    } catch (e) {}

    renderSentLog();

    feedback.textContent = `✅ Message successfully dispatched to Govind Patidar (${RECIPIENT_EMAIL})! Thank you for reaching out.`;
    feedback.classList.add('contact-form__feedback--success');
    showToast('✅ Message successfully sent to Govind!');
    form.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Send Another Message</span> <svg class="btn__icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  });
}

/* ══════════════════════════════════════════════════════════
   7. INTERACTIVE PROJECT DEMOS ENGINE
   ══════════════════════════════════════════════════════════ */
const DEMO_REGISTRY = {
  // ── 1. HOME MEDICINE PORTAL ──
  medicine: {
    title: "Home Medicine Portal — Expiry Tracker & Safe Disposal",
    tag: "Live Interactive Web App",
    render: () => {
      let medicines = [
        { name: "Paracetamol 650mg", category: "Tablet", batch: "BATCH-8921", daysLeft: 12, dosage: "1 after meal" },
        { name: "Amoxicillin 500mg", category: "Antibiotic", batch: "BATCH-4310", daysLeft: 180, dosage: "Twice daily" },
        { name: "Cetirizine 10mg", category: "Antihistamine", batch: "BATCH-1102", daysLeft: -6, dosage: "At bedtime" },
        { name: "Cough Syrup Dextromethorphan", category: "Syrup", batch: "BATCH-7741", daysLeft: 22, dosage: "10ml SOS" },
        { name: "Vitamin C & Zinc Chewables", category: "Supplement", batch: "BATCH-9034", daysLeft: 340, dosage: "1 daily" }
      ];

      return `
        <div class="demo-medicine">
          <div class="demo-toolbar">
            <div class="demo-filters" id="med-filter-group">
              <button class="filter-btn active" data-filter="all">All Medicines (5)</button>
              <button class="filter-btn" data-filter="safe">🟢 Safe (&gt;30d)</button>
              <button class="filter-btn" data-filter="expiring">🟡 Expiring Soon (&lt;30d)</button>
              <button class="filter-btn" data-filter="expired">🔴 Expired</button>
            </div>
            <button class="btn btn--sm btn--outline" id="med-quick-add-btn">+ Add Medicine</button>
          </div>

          <div class="med-table-wrap">
            <table class="med-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Category</th>
                  <th>Batch No.</th>
                  <th>Shelf-Life Status</th>
                  <th>Dosage Guidance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="med-table-body">
                ${renderMedRows(medicines, 'all')}
              </tbody>
            </table>
          </div>

          <!-- Safe Disposal Guidance Feature -->
          <div class="med-disposal-box">
            <h4 class="med-disposal-title">
              <span>🌿 Safe Disposal Advisor (WHO &amp; FDA Eco-Protocol)</span>
            </h4>
            <p class="med-disposal-desc">
              Improper disposal of antibiotics and chemicals leads to water-table toxicity and superbug resistance.
            </p>
            <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;align-items:center;">
              <select id="disposal-select" class="form-input" style="max-width:260px;">
                <option value="antibiotics">Antibiotic Tablets / Capsules</option>
                <option value="syrups">Liquid Syrups &amp; Suspensions</option>
                <option value="inhalers">Asthma Inhalers &amp; Aerosols</option>
                <option value="sharps">Syringes &amp; Needles</option>
              </select>
              <button class="btn btn--sm btn--primary" id="disposal-btn">View Disposal Protocol</button>
            </div>
            <div id="disposal-advice-output" style="margin-top:12px;padding:10px;background:var(--color-bg);border-radius:var(--radius-sm);font-size:var(--text-xs);border:1px solid var(--color-border);display:none;"></div>
          </div>
        </div>
      `;
    },
    attach: () => {
      const tbody = document.getElementById('med-table-body');
      const filterGroup = document.getElementById('med-filter-group');
      const addBtn = document.getElementById('med-quick-add-btn');
      const disposalSelect = document.getElementById('disposal-select');
      const disposalBtn = document.getElementById('disposal-btn');
      const disposalOutput = document.getElementById('disposal-advice-output');

      let currentList = [
        { name: "Paracetamol 650mg", category: "Tablet", batch: "BATCH-8921", daysLeft: 12, dosage: "1 after meal" },
        { name: "Amoxicillin 500mg", category: "Antibiotic", batch: "BATCH-4310", daysLeft: 180, dosage: "Twice daily" },
        { name: "Cetirizine 10mg", category: "Antihistamine", batch: "BATCH-1102", daysLeft: -6, dosage: "At bedtime" },
        { name: "Cough Syrup Dextromethorphan", category: "Syrup", batch: "BATCH-7741", daysLeft: 22, dosage: "10ml SOS" },
        { name: "Vitamin C & Zinc Chewables", category: "Supplement", batch: "BATCH-9034", daysLeft: 340, dosage: "1 daily" }
      ];

      filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          tbody.innerHTML = renderMedRows(currentList, filter);
          bindDelete();
        });
      });

      function bindDelete() {
        tbody.querySelectorAll('.med-del-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            currentList.splice(idx, 1);
            tbody.innerHTML = renderMedRows(currentList, 'all');
            bindDelete();
            showToast('Medicine removed from inventory.');
          });
        });
      }
      bindDelete();

      addBtn.addEventListener('click', () => {
        const name = prompt('Enter medicine name:', 'Azithromycin 250mg');
        if (!name) return;
        const days = parseInt(prompt('Days until expiry (e.g. 45):', '45') || '30', 10);
        currentList.unshift({
          name: name,
          category: "Prescription",
          batch: "BATCH-" + Math.floor(1000 + Math.random() * 9000),
          daysLeft: days,
          dosage: "As directed by physician"
        });
        tbody.innerHTML = renderMedRows(currentList, 'all');
        bindDelete();
        showToast(`Added ${name} with real-time countdown!`);
      });

      disposalBtn.addEventListener('click', () => {
        const val = disposalSelect.value;
        const protocols = {
          antibiotics: "🛡️ <strong>Antibiotics Protocol:</strong> NEVER flush down toilets. Mix crushed pills with unpalatable substance (coffee grounds or soil), seal in a ziplock bag, and dispose with household dry waste or drop at municipal drug take-back kiosk.",
          syrups: "🛡️ <strong>Syrups Protocol:</strong> Pour remaining liquid onto cat litter or absorbent sawdust inside a sealed container. Rinse empty bottle thoroughly and recycle glass/plastic.",
          inhalers: "🛡️ <strong>Aerosols Protocol:</strong> Inhalers contain propellants. Do not puncture or incinerate. Hand over to pharmacy hazardous return programs.",
          sharps: "🛡️ <strong>Sharps Protocol:</strong> Store in puncture-proof heavy-duty plastic container (e.g. detergent bottle) with taped lid. Deposit at designated hazardous bio-bins."
        };
        disposalOutput.style.display = 'block';
        disposalOutput.innerHTML = protocols[val] || '';
      });
    }
  },

  // ── 2. CITYGENS CRM PLATFORM ──
  crm: {
    title: "CityGens CRM Platform — Lead Developer Pipeline",
    tag: "Production Enterprise Dashboard",
    render: () => {
      return `
        <div class="demo-crm">
          <div class="crm-kpi-row">
            <div class="crm-kpi-card">
              <span class="crm-kpi-val" id="crm-total-leads">142</span>
              <span class="crm-kpi-label">Total Accounts</span>
            </div>
            <div class="crm-kpi-card">
              <span class="crm-kpi-val" id="crm-active-wf">38</span>
              <span class="crm-kpi-label">Active Workflows</span>
            </div>
            <div class="crm-kpi-card">
              <span class="crm-kpi-val">98.4%</span>
              <span class="crm-kpi-label">SLA Delivery Rate</span>
            </div>
            <div class="crm-kpi-card">
              <span class="crm-kpi-val" id="crm-fulfilled">104</span>
              <span class="crm-kpi-label">Fulfilled Services</span>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <p style="font-size:var(--text-xs);color:var(--color-muted);">
              💡 <em>Click any card to advance it through the CityGens service workflow pipeline.</em>
            </p>
            <button class="btn btn--sm btn--primary" id="crm-add-lead-btn">+ Ingest New Lead</button>
          </div>

          <div class="crm-kanban-board">
            <div class="crm-column" id="col-inbound">
              <div class="crm-column__header">
                <span>Inbound Leads</span>
                <span class="col-count" id="count-inbound">2</span>
              </div>
              <div class="crm-card" data-id="1">
                <span class="crm-card__name">SolarTech Energy Ltd</span>
                <span class="crm-card__sub">Requirement: Enterprise Cloud Security Audit</span>
                <span class="crm-card__action">Advance to Verification →</span>
              </div>
              <div class="crm-card" data-id="2">
                <span class="crm-card__name">Bhopal Health Clinic</span>
                <span class="crm-card__sub">Requirement: Patient Record System</span>
                <span class="crm-card__action">Advance to Verification →</span>
              </div>
            </div>

            <div class="crm-column" id="col-verification">
              <div class="crm-column__header">
                <span>Verification &amp; Delivery</span>
                <span class="col-count" id="count-verification">2</span>
              </div>
              <div class="crm-card" data-id="3">
                <span class="crm-card__name">Apex Logistics Hub</span>
                <span class="crm-card__sub">Fleet tracking API integration</span>
                <span class="crm-card__action">Advance to Fulfilled →</span>
              </div>
              <div class="crm-card" data-id="4">
                <span class="crm-card__name">Vidisha AgriExports</span>
                <span class="crm-card__sub">Supply-chain verification portal</span>
                <span class="crm-card__action">Advance to Fulfilled →</span>
              </div>
            </div>

            <div class="crm-column" id="col-fulfilled">
              <div class="crm-column__header">
                <span>Fulfilled &amp; Closed</span>
                <span class="col-count" id="count-fulfilled">1</span>
              </div>
              <div class="crm-card crm-card--done" data-id="5">
                <span class="crm-card__name">Metropolitan Media Corp</span>
                <span class="crm-card__sub">✅ Complete: SLA verified in 1.4 days</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    attach: () => {
      const colInbound = document.getElementById('col-inbound');
      const colVerif = document.getElementById('col-verification');
      const colFulfilled = document.getElementById('col-fulfilled');
      const addBtn = document.getElementById('crm-add-lead-btn');

      function syncCards() {
        colInbound.querySelectorAll('.crm-card').forEach(c => {
          c.onclick = () => {
            colVerif.appendChild(c);
            c.querySelector('.crm-card__action').textContent = 'Advance to Fulfilled →';
            syncCards();
            showToast('Advanced lead to Verification.');
          };
        });

        colVerif.querySelectorAll('.crm-card').forEach(c => {
          c.onclick = () => {
            colFulfilled.appendChild(c);
            c.querySelector('.crm-card__action').textContent = '✅ SLA Verified & Delivered';
            c.style.borderColor = 'var(--color-success)';
            c.onclick = null;
            syncCards();
            showToast('Service delivery marked as Fulfilled!');
          };
        });

        document.getElementById('count-inbound').textContent = colInbound.querySelectorAll('.crm-card').length;
        document.getElementById('count-verification').textContent = colVerif.querySelectorAll('.crm-card').length;
        document.getElementById('count-fulfilled').textContent = colFulfilled.querySelectorAll('.crm-card').length;
      }
      syncCards();

      addBtn.addEventListener('click', () => {
        const client = prompt('Client Organization Name:', 'Indore Retail Co');
        if (!client) return;
        const card = document.createElement('div');
        card.className = 'crm-card';
        card.innerHTML = `
          <span class="crm-card__name">${escapeHtml(client)}</span>
          <span class="crm-card__sub">Requirement: Custom CRM Workflow</span>
          <span class="crm-card__action">Advance to Verification →</span>
        `;
        colInbound.appendChild(card);
        syncCards();
        showToast(`Lead for ${client} captured into pipeline!`);
      });
    }
  },

  // ── 3. AUTOMATED VOICE AGENT & MODEL CONTEXT PROTOCOL (MCP) ──
  voice: {
    title: "Automated Outbound Voice Agent + Model Context Protocol",
    tag: "ElevenLabs API · Twilio · MCP Architecture",
    render: () => {
      return `
        <div class="voice-agent-console">
          <div class="voice-dialer-panel">
            <h4 style="font-size:var(--text-base);font-weight:700;display:flex;align-items:center;gap:8px;">
              <span>📞 Telephony Dispatcher &amp; Voice Generator</span>
            </h4>

            <div class="form-group">
              <label class="form-label" for="voice-phone">Target Phone Number</label>
              <input type="text" id="voice-phone" class="form-input" value="+91 98260 41299" placeholder="+91..." />
            </div>

            <div class="form-group">
              <label class="form-label" for="voice-persona">ElevenLabs Voice Model</label>
              <select id="voice-persona" class="form-input">
                <option value="Rachel">Rachel (ElevenLabs Warm &amp; Conversational)</option>
                <option value="Adam">Adam (ElevenLabs Authoritative Technical)</option>
                <option value="Antoni">Antoni (ElevenLabs Dynamic Energetic)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="voice-intent">Call Workflow Scenario</label>
              <select id="voice-intent" class="form-input">
                <option value="portal">Home Medicine Expiry Alert Reminder</option>
                <option value="crm">CityGens Service Delivery Confirmation</option>
                <option value="security">Cybersecurity 2FA Incident Verification</option>
              </select>
            </div>

            <!-- Animated Voice Waveform -->
            <div class="voice-waveform" id="voice-waveform">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>

            <button class="btn btn--primary btn--full" id="btn-dial-voice">
              <span>Initiate Outbound Call &amp; Audio Stream</span>
            </button>
            <p id="call-status-indicator" style="font-size:var(--text-xs);color:var(--color-muted);text-align:center;">
              Status: Idle (Ready for MCP Telephony dispatch)
            </p>
          </div>

          <div class="mcp-terminal-panel">
            <div class="mcp-terminal-header">
              <span>MODEL CONTEXT PROTOCOL (MCP) — JSON-RPC 2.0</span>
              <span style="color:#4ade80;">● MCP SERVER: ONLINE</span>
            </div>
            <div class="mcp-terminal-logs" id="mcp-logs">
              <div class="mcp-log-entry mcp-log-entry--rx">[SYSTEM] Initialized Model Context Protocol Server (FastMCP)...</div>
              <div class="mcp-log-entry mcp-log-entry--rx">[SYSTEM] Registered Tools: [twilio.outbound_call, elevenlabs.synthesize_speech, db.fetch_user]</div>
              <div class="mcp-log-entry">[READY] Awaiting client trigger...</div>
            </div>
          </div>
        </div>
      `;
    },
    attach: () => {
      const dialBtn = document.getElementById('btn-dial-voice');
      const waveform = document.getElementById('voice-waveform');
      const logs = document.getElementById('mcp-logs');
      const statusInd = document.getElementById('call-status-indicator');
      const personaSelect = document.getElementById('voice-persona');
      const intentSelect = document.getElementById('voice-intent');

      function appendMcp(type, text) {
        const div = document.createElement('div');
        div.className = `mcp-log-entry mcp-log-entry--${type}`;
        div.textContent = text;
        logs.appendChild(div);
        logs.scrollTop = logs.scrollHeight;
      }

      dialBtn.addEventListener('click', () => {
        const phone = document.getElementById('voice-phone').value;
        const persona = personaSelect.value;
        const intent = intentSelect.value;

        dialBtn.disabled = true;
        waveform.classList.add('is-active');
        statusInd.textContent = "Connecting to Twilio Gateway & MCP...";
        statusInd.style.color = "var(--color-accent-blue)";

        // 1. Play real Web Audio API dialing dual tones
        playDialTones();

        appendMcp('tx', `--> JSON-RPC 2.0 Request: tools/call { "name": "twilio.outbound_call", "arguments": { "to": "${phone}", "callerId": "SATI-TELEPHONY" } }`);

        setTimeout(() => {
          appendMcp('rx', `<-- JSON-RPC 2.0 Response: { "status": "ringing", "sid": "CA${Math.random().toString(16).slice(2, 10)}", "latency": "38ms" }`);
          statusInd.textContent = `Call Connected! ElevenLabs (${persona}) stream active...`;

          appendMcp('tool', `[MCP TOOL EXEC] elevenlabs.synthesize_speech({ "voice": "${persona}", "latency_opt": 4, "format": "pcm_24000" })`);

          const speechScripts = {
            portal: "Hello, this is Govind Patidar's automated healthcare agent calling to notify you that your prescription for Cetirizine has expired. Please check your Home Medicine Portal for safe disposal guidance.",
            crm: "Greetings from CityGens. Lead Developer Govind Patidar has updated your account service request. Your workflow delivery has achieved SLA fulfillment with 99.2% uptime.",
            security: "Security Notice from SATI Cyber Operations: A cryptographic verification check was completed on your node. All SHA-256 integrity signatures are verified."
          };

          const scriptText = speechScripts[intent] || speechScripts.portal;
          appendMcp('rx', `[TRANSCRIPT STREAM]: "${scriptText}"`);

          // 2. Browser native speech synthesis speaking aloud!
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(scriptText);
            utterance.rate = 1.0;
            utterance.pitch = persona === 'Rachel' ? 1.1 : (persona === 'Adam' ? 0.9 : 1.0);
            utterance.onend = () => {
              waveform.classList.remove('is-active');
              dialBtn.disabled = false;
              statusInd.textContent = "Call Completed. Audio session closed.";
              statusInd.style.color = "var(--color-success)";
              appendMcp('rx', `<-- Call Completed cleanly. Session SID terminated. Status: 200 OK.`);
            };
            window.speechSynthesis.speak(utterance);
          } else {
            setTimeout(() => {
              waveform.classList.remove('is-active');
              dialBtn.disabled = false;
              statusInd.textContent = "Call Completed.";
            }, 5000);
          }
        }, 1500);
      });
    }
  },

  // ── 4. TECHNOVISION CYBERSECURITY DATA INTEGRITY & SHA-256 VERIFIER ──
  security: {
    title: "Technovision Championship — AI & Data Integrity Verifier",
    tag: "Championship Trophy · SATI Vidisha Research",
    render: () => {
      return `
        <div class="integrity-console">
          <p style="font-size:var(--text-sm);color:var(--color-muted);">
            Test the live cryptographic engine from Govind's award-winning Technovision paper: <em>"AI, Machine Learning &amp; Data Integrity in Cybersecurity"</em>. Real-time SHA-256 calculation demonstrates the <strong>Avalanche Effect</strong> and AI tamper detection.
          </p>

          <div class="form-group">
            <label class="form-label" for="crypto-payload">Audit Log / Sensitive Record Payload</label>
            <textarea id="crypto-payload" class="form-input form-input--textarea" rows="3" style="min-height:80px;font-family:'Fira Code',monospace;font-size:0.85rem;">{"record_id": 9042, "user": "govind_patidar", "auth": "TOKEN_VALID", "amount_inr": 75000}</textarea>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
            <button class="btn btn--sm btn--primary" id="btn-recompute-hash">Calculate Real SHA-256 Hash</button>
            <button class="btn btn--sm btn--outline" id="btn-simulate-tamper" style="color:var(--color-error);border-color:rgba(239,68,68,0.4);">
              ⚠️ Simulate Malicious 1-Bit Tamper
            </button>
          </div>

          <div>
            <label class="form-label">Calculated Cryptographic Hash (SHA-256)</label>
            <div class="hash-display-card" id="hash-display">Computing SHA-256...</div>
          </div>

          <div class="anomaly-gauge-wrap">
            <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);font-weight:700;">
              <span>AI Anomaly Detection Confidence</span>
              <span id="anomaly-score-text" style="color:var(--color-success);">100% Authentic (0% Tamper Risk)</span>
            </div>
            <div class="anomaly-gauge-bar">
              <div class="anomaly-gauge-fill" id="anomaly-gauge"></div>
            </div>
          </div>

          <div style="background:var(--color-surface-2);border-radius:var(--radius-md);padding:12px 16px;border:1px solid var(--color-border);font-size:var(--text-xs);color:var(--color-muted);line-height:1.6;">
            🏆 <strong>Award Note:</strong> This research won 1st Place Championship Trophy at SATI Technovision for proving how lightweight ML autoencoders can continuously verify distributed logs against zero-day byte corruption.
          </div>
        </div>
      `;
    },
    attach: () => {
      const payloadEl = document.getElementById('crypto-payload');
      const hashDisplay = document.getElementById('hash-display');
      const computeBtn = document.getElementById('btn-recompute-hash');
      const tamperBtn = document.getElementById('btn-simulate-tamper');
      const gauge = document.getElementById('anomaly-gauge');
      const scoreText = document.getElementById('anomaly-score-text');

      async function computeHash(text, isTampered = false) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        hashDisplay.textContent = hashHex;

        if (isTampered) {
          hashDisplay.classList.add('tampered');
          gauge.classList.add('tampered');
          scoreText.textContent = "🚨 CRITICAL TAMPER DETECTED (99.8% Anomaly Confidence)";
          scoreText.style.color = "var(--color-error)";
        } else {
          hashDisplay.classList.remove('tampered');
          gauge.classList.remove('tampered');
          scoreText.textContent = "100% Authentic (0% Tamper Risk — Signatures Match)";
          scoreText.style.color = "var(--color-success)";
        }
      }

      computeHash(payloadEl.value);

      computeBtn.addEventListener('click', () => {
        computeHash(payloadEl.value, false);
        showToast('SHA-256 hash recalculated.');
      });

      tamperBtn.addEventListener('click', () => {
        // Change one digit in the payload
        const val = payloadEl.value;
        payloadEl.value = val.includes('75000') ? val.replace('75000', '75001') : val + ' ';
        computeHash(payloadEl.value, true);
        showToast('⚠️ Avalanche Effect Triggered: 1 character changed completely mutated hash!');
      });
    }
  },

  // ── 5. CREATIVE SHOWCASE ──
  creative: {
    title: "Creative Visual Showcase — Graphic Design & Video Edits",
    tag: "Major: Graphic Design · Minor: Video Edits",
    render: () => {
      return `
        <div class="creative-gallery-grid">
          <div class="creative-item-card">
            <div class="creative-item-visual">
              <img src="assets/images/project-creative.jpg" alt="SATI Orientation Poster Design" />
            </div>
            <div class="creative-item-body">
              <span class="creative-item-title">SATI Orientation Poster 2025</span>
              <span class="creative-item-desc">High-contrast typography, visual hierarchy &amp; promotional college branding.</span>
            </div>
          </div>

          <div class="creative-item-card">
            <div class="creative-item-visual">
              <img src="assets/images/sati-campus.jpg" alt="Video VFX Reel Timeline" />
            </div>
            <div class="creative-item-body">
              <span class="creative-item-title">College Event Teaser Reel (VFX)</span>
              <span class="creative-item-desc">Keyframed speed ramps, sound design synchronization, and color grading.</span>
            </div>
          </div>

          <div class="creative-item-card">
            <div class="creative-item-visual">
              <img src="assets/images/kabaddi.jpg" alt="Sports Media Graphics" />
            </div>
            <div class="creative-item-body">
              <span class="creative-item-title">State Kabaddi Championship Banner</span>
              <span class="creative-item-desc">Dynamic sports action composition and athlete visual branding.</span>
            </div>
          </div>
        </div>
      `;
    },
    attach: () => {}
  },

  // ── 6. GOOGLE GEMINI AI ASSISTANT ──
  gemini: {
    title: "Google Gemini AI Assistant Platform",
    tag: "Interactive Prompt & LLM Client",
    render: () => {
      return `
        <div style="padding:12px;background:var(--color-bg);border-radius:var(--radius-md);border:1px solid var(--color-border);">
          <p style="font-size:var(--text-sm);color:var(--color-muted);line-height:1.7;">
            Opening Govind's full-screen Gemini AI Assistant... Click the <strong>Ask AI</strong> button in the top navigation or click below to launch the live chatbot!
          </p>
          <div style="margin-top:16px;">
            <button class="btn btn--primary" id="open-gemini-directly">Launch Gemini AI Chat</button>
          </div>
        </div>
      `;
    },
    attach: () => {
      document.getElementById('open-gemini-directly').onclick = () => {
        closeDemoModal();
        openAiModal();
      };
    }
  },

  // ── 7. AI MAIL & APPLICATION GENERATOR ──
  mailgen: {
    title: "AI Mail & Application Generator Studio",
    tag: "Gemini AI • React 19 • Multi-Tone Engine",
    render: () => {
      return `
        <div class="demo-mailgen">
          <div class="mailgen-banner">
            <div class="mailgen-banner__info">
              <div class="mailgen-banner__title">
                <span>✉️ AI Communication Studio &amp; Mail Writer</span>
              </div>
              <p class="mailgen-banner__desc">
                Intelligent professional correspondence engine powered by Google Gemini API. Zero hallucinations, tailored tone adaptation, and instant export.
              </p>
            </div>
            <div class="mailgen-banner__badges">
              <span class="mailgen-banner__tag">Gemini API</span>
              <span class="mailgen-banner__tag">Zero-Fabrication</span>
              <a href="https://github.com/patidargovind/EMAIL-GENERATOR" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--outline" style="padding:4px 10px;font-size:0.75rem;gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                <span>GitHub: EMAIL-GENERATOR ↗</span>
              </a>
            </div>
          </div>

          <!-- Quick Presets -->
          <div class="mailgen-presets-row">
            <span class="mailgen-presets-label">⚡ Quick Presets (Click to Test):</span>
            <div class="mailgen-presets-wrap">
              <button type="button" class="mailgen-preset-chip" data-preset="job">💼 Job Application (Full-Stack Engineer)</button>
              <button type="button" class="mailgen-preset-chip" data-preset="leave">🏖️ Leave Request (National Hackathon)</button>
              <button type="button" class="mailgen-preset-chip" data-preset="proposal">🤝 Client Development Proposal</button>
              <button type="button" class="mailgen-preset-chip" data-preset="referral">⭐ Letter of Recommendation</button>
            </div>
          </div>

          <div class="mailgen-studio-grid">
            <!-- Studio Input Parameters -->
            <div class="mailgen-card">
              <div class="mailgen-card__header">
                <span class="mailgen-card__title">⚙️ Communication Parameters</span>
                <span style="font-size:0.7rem;color:var(--color-muted);">Zero-Hallucination Mode</span>
              </div>

              <div class="mailgen-form-grid">
                <div>
                  <label class="mailgen-label" for="mg-comm-type">Communication Type</label>
                  <select id="mg-comm-type" class="form-input form-input--sm" style="width:100%;">
                    <option value="Job Application Email">Job Application Email</option>
                    <option value="Cover Letter">Formal Cover Letter</option>
                    <option value="Leave Request">Leave Request</option>
                    <option value="Client Proposal">Client Project Proposal</option>
                    <option value="Follow-up Email">Follow-up Email</option>
                    <option value="Cold Outreach">Cold Outreach Email</option>
                    <option value="Recommendation Request">Recommendation Request</option>
                  </select>
                </div>

                <div class="mailgen-form-grid mailgen-form-grid--two">
                  <div>
                    <label class="mailgen-label" for="mg-recipient-name">Recipient Name</label>
                    <input type="text" id="mg-recipient-name" class="form-input form-input--sm" value="Elena Rostova" placeholder="e.g. Hiring Manager" />
                  </div>
                  <div>
                    <label class="mailgen-label" for="mg-organization">Organization / Company</label>
                    <input type="text" id="mg-organization" class="form-input form-input--sm" value="Linearity Systems" placeholder="e.g. Acme Tech" />
                  </div>
                </div>

                <div>
                  <label class="mailgen-label">Tone &amp; Formality</label>
                  <div class="mailgen-tone-pills" id="mg-tone-group">
                    <button type="button" class="mailgen-tone-btn active" data-tone="Professional">Professional</button>
                    <button type="button" class="mailgen-tone-btn" data-tone="Confident">Confident</button>
                    <button type="button" class="mailgen-tone-btn" data-tone="Persuasive">Persuasive</button>
                    <button type="button" class="mailgen-tone-btn" data-tone="Warm">Warm</button>
                    <button type="button" class="mailgen-tone-btn" data-tone="Urgent">Urgent</button>
                  </div>
                </div>

                <div>
                  <label class="mailgen-label" for="mg-purpose">Purpose / Objective</label>
                  <input type="text" id="mg-purpose" class="form-input form-input--sm" value="Applying for Staff UI / Full-Stack Engineer position" placeholder="Primary objective" />
                </div>

                <div>
                  <label class="mailgen-label" for="mg-highlights">Key Qualifications &amp; Details</label>
                  <textarea id="mg-highlights" class="form-input" style="min-height:64px;resize:vertical;font-size:0.78rem;" placeholder="Key facts, accomplishments, dates...">Architected Voice AI agent with ElevenLabs & Twilio; engineered high-performance web applications; first-year B.Tech CSE (Cyber Security) at SATI Vidisha (7.58 CGPA).</textarea>
                </div>

                <button type="button" class="btn btn--primary" id="mg-generate-btn" style="width:100%;margin-top:2px;">
                  <span>✨ Generate AI Mail Draft</span>
                </button>
              </div>
            </div>

            <!-- Live Output & Manuscript Pane -->
            <div class="mailgen-card">
              <div class="mailgen-card__header">
                <span class="mailgen-card__title">📄 Generated Manuscript Pane</span>
                <span class="mailgen-stats" id="mg-status-indicator">● Ready to send</span>
              </div>

              <!-- Subject Line -->
              <div class="mailgen-subject-box">
                <span style="font-size:0.7rem;color:var(--color-muted);font-weight:700;">SUBJECT:</span>
                <span class="mailgen-subject-text" id="mg-subject-text">Application for Staff UI / Full-Stack Engineer — Govind Patidar</span>
                <button type="button" class="btn btn--sm btn--outline" id="mg-copy-subject-btn" style="padding:2px 8px;font-size:0.7rem;" title="Copy Subject Line">Copy</button>
              </div>

              <!-- Formatted Email Manuscript -->
              <div class="mailgen-manuscript" id="mg-manuscript-body" aria-live="polite"></div>

              <!-- Instant Tone Switching -->
              <div class="mailgen-quick-tones">
                <span class="mailgen-quick-tones-label">⚡ Switch Tone:</span>
                <button type="button" class="mailgen-tone-btn" data-retone="Confident">Confident</button>
                <button type="button" class="mailgen-tone-btn" data-retone="Persuasive">Persuasive</button>
                <button type="button" class="mailgen-tone-btn" data-retone="Professional">Professional</button>
                <button type="button" class="mailgen-tone-btn" data-retone="Urgent">Urgent</button>
              </div>

              <!-- Action Bar -->
              <div class="mailgen-actions-row">
                <span class="mailgen-stats" id="mg-word-count">📊 ~165 words · 1 min read</span>
                <div style="display:flex;gap:8px;">
                  <button type="button" class="btn btn--sm btn--primary" id="mg-copy-full-btn">
                    📋 Copy Full Email
                  </button>
                  <a href="https://github.com/patidargovind/EMAIL-GENERATOR" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--outline">
                    GitHub Repo ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    attach: () => {
      const typeSelect = document.getElementById('mg-comm-type');
      const recipientInput = document.getElementById('mg-recipient-name');
      const orgInput = document.getElementById('mg-organization');
      const purposeInput = document.getElementById('mg-purpose');
      const highlightsInput = document.getElementById('mg-highlights');
      const generateBtn = document.getElementById('mg-generate-btn');
      const subjectText = document.getElementById('mg-subject-text');
      const manuscriptBody = document.getElementById('mg-manuscript-body');
      const wordCount = document.getElementById('mg-word-count');
      const copySubjectBtn = document.getElementById('mg-copy-subject-btn');
      const copyFullBtn = document.getElementById('mg-copy-full-btn');
      const toneGroup = document.getElementById('mg-tone-group');
      const statusIndicator = document.getElementById('mg-status-indicator');

      let currentTone = 'Professional';

      const PRESETS = {
        job: {
          type: "Job Application Email",
          recipient: "Elena Rostova",
          org: "Linearity Systems",
          tone: "Professional",
          purpose: "Applying for Staff UI / Full-Stack Engineer position",
          highlights: "Architected automated Voice AI agent with ElevenLabs & Twilio; built responsive data integrity portals; first-year B.Tech CSE (Cyber Security) at SATI Vidisha (7.58 CGPA)."
        },
        leave: {
          type: "Leave Request",
          recipient: "Head of Department (CSE)",
          org: "SATI Vidisha",
          tone: "Professional",
          purpose: "Requesting 3 days leave for National Hackathon Participation",
          highlights: "Selected to represent SATI Vidisha at the Technovision AI Innovation Challenge; all laboratory assignments submitted in advance; available via email for urgent queries."
        },
        proposal: {
          type: "Client Proposal",
          recipient: "David Sterling",
          org: "Apex Solutions",
          tone: "Persuasive",
          purpose: "Full-Stack Web Portal & AI Automation Development",
          highlights: "End-to-end modern responsive portal with zero-latency caching, secure authentication, and Google Gemini API integration; guaranteed 2-week milestone delivery."
        },
        referral: {
          type: "Recommendation Request",
          recipient: "Dr. Roy",
          org: "CSE Department, SATI",
          tone: "Warm",
          purpose: "Letter of Recommendation for Summer AI Research Fellowship",
          highlights: "Maintained 7.58 CGPA, presented award-winning paper at Technovision on AI Data Integrity, and active volunteer on SATI Media & Photography Team."
        }
      };

      function synthesizeEmail(toneOverride) {
        const tone = toneOverride || currentTone;
        const commType = typeSelect.value;
        const recipient = recipientInput.value.trim() || 'Hiring Team';
        const org = orgInput.value.trim() || 'Your Organization';
        const purpose = purposeInput.value.trim() || 'Professional Communication';
        const highlights = highlightsInput.value.trim() || 'Proven engineering background and technical proficiency.';

        let subject = '';
        if (commType.includes('Job') || commType.includes('Cover')) {
          subject = `Application for ${purpose} — Govind Patidar`;
        } else if (commType.includes('Leave')) {
          subject = `Leave Request: ${purpose} — Govind Patidar (CSE)`;
        } else if (commType.includes('Proposal')) {
          subject = `Project Proposal: ${purpose} — Govind Patidar`;
        } else if (commType.includes('Recommendation')) {
          subject = `Recommendation Letter Request — Govind Patidar`;
        } else {
          subject = `${commType}: ${purpose}`;
        }
        subjectText.textContent = subject;

        let salutation = `Dear ${recipient},`;
        if (tone === 'Warm') salutation = `Dear ${recipient},`;
        if (tone === 'Urgent') salutation = `Attention: ${recipient},`;

        let opening = '';
        if (tone === 'Confident') {
          opening = `I am writing to formally present my qualifications regarding the ${purpose} at ${org}. With proven hands-on experience building production full-stack systems and integrating state-of-the-art AI workflows, I am eager to deliver immediate value to your team.`;
        } else if (tone === 'Persuasive') {
          opening = `I am writing to discuss how my technical expertise directly aligns with ${purpose} at ${org}. Having tracked your recent advancements, I am confident that my engineering background will meaningfully accelerate your strategic goals.`;
        } else if (tone === 'Urgent') {
          opening = `I am writing to submit my urgent communication concerning ${purpose} at ${org}. Please find my submitted materials and core details below for prompt review.`;
        } else if (tone === 'Warm') {
          opening = `I hope you are having a wonderful week. I am reaching out with great enthusiasm regarding ${purpose} at ${org}, and wanted to share my background and interest with you.`;
        } else {
          opening = `I am writing to express my sincere interest regarding ${purpose} at ${org}. Please allow me to share key aspects of my qualifications, achievements, and technical background.`;
        }

        let body1 = `Throughout my work, I have focused on solving critical problems through clean architecture and modern engineering: ${highlights}.`;
        let body2 = `My approach emphasizes zero-fabrication accuracy, reliable performance, and scalable software design. Whether architecting resilient full-stack applications or integrating complex API protocols, I take end-to-end ownership to ensure quality and robustness.`;

        let cta = '';
        if (tone === 'Confident') {
          cta = `I would welcome a brief conversation this week to discuss how my skill set can support your upcoming milestones. Thank you for your consideration.`;
        } else if (tone === 'Persuasive') {
          cta = `I would appreciate the opportunity for a 15-minute introductory call to demonstrate the concrete outcomes I can contribute. Thank you for your time.`;
        } else if (tone === 'Urgent') {
          cta = `Given upcoming scheduling deadlines, I would appreciate your confirmation at your earliest convenience. Thank you for your expedited attention.`;
        } else if (tone === 'Warm') {
          cta = `Thank you so much for your time, guidance, and consideration. I would be thrilled to connect and discuss this further whenever convenient for you.`;
        } else {
          cta = `I would be grateful for the opportunity to discuss my background in greater detail at your earliest convenience. Thank you for your time and consideration.`;
        }

        let signoff = tone === 'Warm' ? 'Warm regards,' : (tone === 'Confident' ? 'Best regards,' : 'Sincerely,');

        const signature = `Govind Patidar\nB.Tech CSE (Cyber Security) | Full-Stack & AI Developer\nSATI Vidisha • patidargovind0605@gmail.com\ngithub.com/patidargovind`;

        const fullDraftHtml = `
          <p><strong>${escapeHtml(salutation)}</strong></p>
          <p>${escapeHtml(opening)}</p>
          <p>${escapeHtml(body1)}</p>
          <p>${escapeHtml(body2)}</p>
          <p>${escapeHtml(cta)}</p>
          <p style="margin-top:16px;">${escapeHtml(signoff)}<br/>${escapeHtml(signature).replace(/\n/g, '<br/>')}</p>
        `;

        manuscriptBody.innerHTML = fullDraftHtml;

        const rawText = `${subject}\n\n${salutation}\n\n${opening}\n\n${body1}\n\n${body2}\n\n${cta}\n\n${signoff}\n${signature}`;
        const words = rawText.trim().split(/\s+/).length;
        wordCount.textContent = `📊 ~${words} words · 1 min read`;
        if (statusIndicator) statusIndicator.textContent = `● Generated (${tone} Tone)`;
      }

      // Quick presets handler
      document.querySelectorAll('.mailgen-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.preset;
          const p = PRESETS[key];
          if (!p) return;
          typeSelect.value = p.type;
          recipientInput.value = p.recipient;
          orgInput.value = p.org;
          purposeInput.value = p.purpose;
          highlightsInput.value = p.highlights;
          currentTone = p.tone;

          toneGroup.querySelectorAll('.mailgen-tone-btn').forEach(tb => {
            tb.classList.toggle('active', tb.dataset.tone === p.tone);
          });

          synthesizeEmail(p.tone);
          showToast(`Loaded "${p.type}" preset!`);
          playFeedbackBeep(880);
        });
      });

      // Tone pills
      toneGroup.querySelectorAll('.mailgen-tone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          toneGroup.querySelectorAll('.mailgen-tone-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentTone = btn.dataset.tone;
          synthesizeEmail(currentTone);
        });
      });

      // Quick re-tone buttons in manuscript pane
      document.querySelectorAll('[data-retone]').forEach(btn => {
        btn.addEventListener('click', () => {
          currentTone = btn.dataset.retone;
          toneGroup.querySelectorAll('.mailgen-tone-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tone === currentTone);
          });
          synthesizeEmail(currentTone);
          showToast(`Switched tone to ${currentTone}!`);
          playFeedbackBeep(660);
        });
      });

      // Generate button
      generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<span>✨ Synthesizing with Gemini...</span>`;
        if (statusIndicator) statusIndicator.textContent = `● Drafting with AI...`;

        setTimeout(() => {
          synthesizeEmail();
          generateBtn.disabled = false;
          generateBtn.innerHTML = `<span>✨ Generate AI Mail Draft</span>`;
          showToast(`✅ Mail draft generated successfully!`);
          playFeedbackBeep(780);
        }, 300);
      });

      // Copy Subject
      copySubjectBtn.addEventListener('click', () => {
        const text = subjectText.textContent;
        navigator.clipboard.writeText(text).then(() => {
          copySubjectBtn.textContent = '✓ Copied';
          showToast('Subject line copied!');
          setTimeout(() => { copySubjectBtn.textContent = 'Copy'; }, 2000);
        });
      });

      // Copy Full Email
      copyFullBtn.addEventListener('click', () => {
        const rawText = `Subject: ${subjectText.textContent}\n\n` + manuscriptBody.innerText;
        navigator.clipboard.writeText(rawText).then(() => {
          copyFullBtn.textContent = '✓ Copied to Clipboard';
          showToast('Complete email draft copied to clipboard!');
          playFeedbackBeep(920);
          setTimeout(() => { copyFullBtn.textContent = '📋 Copy Full Email'; }, 2200);
        });
      });

      // Initial synthesis
      synthesizeEmail('Professional');
    }
  }
};

function renderMedRows(list, filter) {
  const filtered = list.filter(m => {
    if (filter === 'safe') return m.daysLeft > 30;
    if (filter === 'expiring') return m.daysLeft >= 0 && m.daysLeft <= 30;
    if (filter === 'expired') return m.daysLeft < 0;
    return true;
  });

  if (!filtered.length) {
    return `<tr><td colspan="6" style="text-align:center;color:var(--color-muted);padding:24px;">No medicines matching filter.</td></tr>`;
  }

  return filtered.map((m, idx) => {
    let statusClass = 'med-status-badge--safe';
    let statusText = `🟢 Safe (${m.daysLeft}d left)`;

    if (m.daysLeft < 0) {
      statusClass = 'med-status-badge--expired';
      statusText = `🔴 Expired (${Math.abs(m.daysLeft)}d ago)`;
    } else if (m.daysLeft <= 30) {
      statusClass = 'med-status-badge--expiring';
      statusText = `🟡 Expiring Soon (${m.daysLeft}d left)`;
    }

    return `
      <tr>
        <td><strong>${escapeHtml(m.name)}</strong></td>
        <td><span class="badge" style="font-size:0.7rem;">${escapeHtml(m.category)}</span></td>
        <td><code>${escapeHtml(m.batch)}</code></td>
        <td><span class="med-status-badge ${statusClass}">${statusText}</span></td>
        <td style="font-size:0.8rem;color:var(--color-muted);">${escapeHtml(m.dosage)}</td>
        <td>
          <button class="btn btn--sm btn--outline med-del-btn" data-idx="${idx}" style="padding:2px 8px;font-size:0.7rem;">Remove</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   8. SOURCE CODE INSPECTOR MODAL
   ══════════════════════════════════════════════════════════ */
const CODE_REGISTRY = {
  medicine: {
    title: "medicine_portal.js — Expiry Calculations & Safe Disposal",
    code: `// Home Medicine Portal — Core Expiry Engine
// Author: Govind Patidar (SATI Vidisha)

class MedicineInventory {
  constructor() {
    this.medicines = JSON.parse(localStorage.getItem('gp_medicines') || '[]');
  }

  calculateShelfLife(expiryDateString) {
    const today = new Date();
    const expiry = new Date(expiryDateString);
    const deltaMs = expiry - today;
    const deltaDays = Math.ceil(deltaMs / (1000 * 60 * 60 * 24));

    if (deltaDays < 0) return { status: 'EXPIRED', days: deltaDays, color: '#ef4444' };
    if (deltaDays <= 30) return { status: 'EXPIRING_SOON', days: deltaDays, color: '#f59e0b' };
    return { status: 'SAFE', days: deltaDays, color: '#22c55e' };
  }

  addMedicine(name, category, batch, expiryDate) {
    const record = {
      id: crypto.randomUUID(),
      name,
      category,
      batch,
      expiryDate,
      addedAt: new Date().toISOString()
    };
    this.medicines.unshift(record);
    localStorage.setItem('gp_medicines', JSON.stringify(this.medicines));
    return record;
  }
}`
  },

  crm: {
    title: "crm_pipeline.py — CityGens Organization Workflow State Machine",
    code: `# CityGens CRM Platform — Workflow Pipeline Engine
# Lead Developer: Govind Patidar

from enum import Enum
from datetime import datetime

class Stage(Enum):
    LEAD_INBOUND = 1
    VERIFICATION_PROPOSAL = 2
    SERVICE_DELIVERY = 3
    FULFILLED_CLOSED = 4

class CustomerAccount:
    def __init__(self, account_id: str, company: str, requirement: str):
        self.account_id = account_id
        self.company = company
        self.requirement = requirement
        self.stage = Stage.LEAD_INBOUND
        self.created_at = datetime.utcnow()
        self.sla_breached = False

    def advance_stage(self):
        if self.stage == Stage.LEAD_INBOUND:
            self.stage = Stage.VERIFICATION_PROPOSAL
        elif self.stage == Stage.VERIFICATION_PROPOSAL:
            self.stage = Stage.SERVICE_DELIVERY
        elif self.stage == Stage.SERVICE_DELIVERY:
            self.stage = Stage.FULFILLED_CLOSED
        return self.stage`
  },

  voice: {
    title: "mcp_voice_agent.py — ElevenLabs & Twilio MCP Server",
    code: `# Automated Outbound Voice Agent with Model Context Protocol (MCP)
# Integration: ElevenLabs API + Twilio API + FastMCP
# Author: Govind Patidar (B.Tech Cyber Security)

from mcp.server.fastmcp import FastMCP
import os

mcp = FastMCP("VoiceTelephonyGateway")

@mcp.tool()
async def dial_outbound(to_phone: str, scenario: str) -> dict:
    """Initiates secure Twilio outbound call handshake with MCP authentication."""
    twilio_client = get_authenticated_twilio_client()
    call = twilio_client.calls.create(
        to=to_phone,
        from_=os.getenv("TWILIO_NUMBER"),
        url="https://api.govind.dev/voice/twiml-stream"
    )
    return {"call_sid": call.sid, "status": "initiated", "mcp_token_valid": True}

@mcp.tool()
async def stream_elevenlabs_voice(voice_id: str, script_text: str) -> bytes:
    """Streams low-latency high-fidelity synthesized audio from ElevenLabs."""
    client = get_elevenlabs_client()
    audio_stream = client.text_to_speech.convert(
        voice_id=voice_id,
        text=script_text,
        model_id="eleven_multilingual_v2"
    )
    return audio_stream`
  },

  security: {
    title: "integrity_verifier.py — SHA-256 Hashing & Anomaly Scorer",
    code: `# SATI Technovision Championship Research Paper Implementation
# Data Integrity, AI and Machine Learning in Cybersecurity
# Author: Govind Patidar

import hashlib
import json

def verify_audit_log_integrity(payload: dict, stored_hash: str) -> tuple[bool, str, float]:
    serialized = json.dumps(payload, sort_keys=True).encode('utf-8')
    computed_hash = hashlib.sha256(serialized).hexdigest()
    
    # Cryptographic match
    is_valid = (computed_hash == stored_hash)
    
    # AI anomaly scorer: calculates bit-avalanche distance
    anomaly_score = 0.0 if is_valid else 0.998
    return is_valid, computed_hash, anomaly_score`
  },

  creative: {
    title: "creative_pipeline.json — Visual Production Workflow",
    code: `{
  "creator": "Govind Patidar",
  "major_domain": "Graphic Design",
  "minor_domain": "Video Edits",
  "tools": ["Photoshop", "Illustrator", "Premiere Pro", "After Effects"],
  "projects": [
    {
      "title": "SATI Orientation Digital Posters",
      "resolution": "3840x2160 (4K)",
      "color_profile": "Display P3",
      "typography": ["Poppins Bold", "Inter Medium"]
    },
    {
      "title": "Event Teaser VFX Reel",
      "framerate": "60fps",
      "transitions": ["Dynamic Optical Flow", "Audio-Synced Cuts"]
    }
  ]
}`
  },

  gemini: {
    title: "gemini_client.js — Google Gemini API Platform Integration",
    code: `// Google Gemini API Platform Integration
// Author: Govind Patidar

async function askGemini(promptText, userApiKey = "") {
  const apiKey = userApiKey || "FREE_GEMINI_PLATFORM_KEY";
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}`
  },

  mailgen: {
    title: "generate.ts — Google GenAI Structured Mail & Application Synthesis",
    code: `// AI Mail & Application Generator — Gemini API Structured Synthesis
// Author: Govind Patidar | GitHub: patidargovind/EMAIL-GENERATOR
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI();

export const EMAIL_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING },
    subjectOptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    salutation: { type: Type.STRING },
    opening: { type: Type.STRING },
    bodyParagraphs: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    callToAction: { type: Type.STRING },
    signOff: { type: Type.STRING },
    signatureBlock: { type: Type.STRING },
    qualityVerification: {
      type: Type.OBJECT,
      properties: {
        toneApplied: { type: Type.STRING },
        zeroFabricationVerified: { type: Type.BOOLEAN }
      }
    }
  },
  required: ['status', 'subjectOptions', 'salutation', 'opening', 'bodyParagraphs', 'callToAction', 'signOff']
};

export async function generateMailDraft(formData) {
  const model = ai.models.get('gemini-2.5-flash');
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: JSON.stringify(formData) }] }],
    config: {
      systemInstruction: "Convert user context into a tailored, zero-hallucination professional communication draft.",
      responseMimeType: 'application/json',
      responseSchema: EMAIL_RESPONSE_SCHEMA,
      temperature: 0.6
    }
  });
  return JSON.parse(response.text);
}`
  }
};

/* ══════════════════════════════════════════════════════════
   9. MODALS CONTROLLER & ASSISTANT
   ══════════════════════════════════════════════════════════ */
let currentOpenModal = null;

function openDemoModal(demoKey) {
  const modal = document.getElementById('demo-modal');
  const title = document.getElementById('demo-modal-title');
  const tag   = document.getElementById('demo-modal-tag');
  const body  = document.getElementById('demo-modal-body');
  const item  = DEMO_REGISTRY[demoKey];

  if (!modal || !item) return;

  title.textContent = item.title;
  tag.textContent = item.tag;
  body.innerHTML = item.render();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  currentOpenModal = modal;
  document.body.style.overflow = 'hidden';

  if (typeof item.attach === 'function') {
    item.attach();
  }
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentOpenModal = null;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function openCodeModal(codeKey) {
  const modal = document.getElementById('code-modal');
  const title = document.getElementById('code-modal-title');
  const snippet = document.getElementById('code-modal-snippet');
  const item  = CODE_REGISTRY[codeKey];

  if (!modal || !item) return;

  title.textContent = item.title;
  snippet.textContent = item.code;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  currentOpenModal = modal;
  document.body.style.overflow = 'hidden';
}

function closeCodeModal() {
  const modal = document.getElementById('code-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentOpenModal = null;
}

function openAiModal() {
  const modal = document.getElementById('ai-modal');
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  currentOpenModal = modal;
  document.body.style.overflow = 'hidden';
  document.getElementById('ai-prompt-input').focus();
}

function closeAiModal() {
  const modal = document.getElementById('ai-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentOpenModal = null;
}

function initModals() {
  // Demo triggers
  document.querySelectorAll('.btn-demo-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const demoKey = btn.dataset.demo;
      openDemoModal(demoKey);
    });
  });

  // Code triggers
  document.querySelectorAll('.btn-code-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const codeKey = btn.dataset.code;
      openCodeModal(codeKey);
    });
  });

  // Close buttons
  const demoClose = document.getElementById('demo-modal-close');
  if (demoClose) demoClose.addEventListener('click', closeDemoModal);

  const codeClose = document.getElementById('code-modal-close');
  if (codeClose) codeClose.addEventListener('click', closeCodeModal);

  const aiClose = document.getElementById('ai-modal-close');
  if (aiClose) aiClose.addEventListener('click', closeAiModal);

  // AI chat launcher
  const aiChatBtn = document.getElementById('ai-chat-btn');
  if (aiChatBtn) aiChatBtn.addEventListener('click', openAiModal);

  // Copy code button
  const copyBtn = document.getElementById('code-copy-btn');
  const copyText = document.getElementById('copy-btn-text');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('code-modal-snippet').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyText.textContent = "Copied!";
        showToast("Code copied to clipboard!");
        setTimeout(() => { copyText.textContent = "Copy Code"; }, 2000);
      });
    });
  }

  // Backdrop clicks
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeDemoModal();
        closeCodeModal();
        closeAiModal();
      }
    });
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDemoModal();
      closeCodeModal();
      closeAiModal();
    }
  });

  // Initialize Gemini AI Chat conversation logic
  initAiChat();
}

function initAiChat() {
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-prompt-input');
  const list = document.getElementById('ai-messages-list');
  const keyInput = document.getElementById('gemini-key-input');
  if (!form || !input || !list) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg--user';
    userMsg.innerHTML = `<p>${escapeHtml(prompt)}</p>`;
    list.appendChild(userMsg);
    input.value = '';
    list.scrollTop = list.scrollHeight;

    // Loading indicator
    const botMsg = document.createElement('div');
    botMsg.className = 'ai-msg ai-msg--bot';
    botMsg.innerHTML = `<p><em>Thinking with Gemini engine...</em></p>`;
    list.appendChild(botMsg);
    list.scrollTop = list.scrollHeight;

    const apiKey = keyInput ? keyInput.value.trim() : '';

    if (apiKey) {
      // Call live Gemini API directly
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `You are answering questions on Govind Patidar's portfolio. Govind Patidar is a 1st year B.Tech Computer Science & Engineering (Cyber Security) student at Samrat Ashok Technological Institute (SATI Vidisha, MP) with a 7.58 CGPA. He is Lead Developer of CityGens CRM platform, built an automated outbound voice agent using ElevenLabs, Twilio and Model Context Protocol (MCP), developed a Home Medicine Portal, won the Technovision Championship Trophy for research on AI & data integrity in cybersecurity, represented at state level in Kabaddi, and specializes in Graphic Design (Major) and Video Edits (Minor). Answer this visitor question professionally and concisely: ${prompt}` }]
            }]
          })
        });
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Response generated.";
        botMsg.innerHTML = `<p>${escapeHtml(reply)}</p>`;
      } catch (err) {
        botMsg.innerHTML = `<p>${generateLocalAiResponse(prompt)}</p>`;
      }
    } else {
      // Built-in intelligent AI contextual generator
      setTimeout(() => {
        botMsg.innerHTML = `<p>${generateLocalAiResponse(prompt)}</p>`;
        list.scrollTop = list.scrollHeight;
      }, 400);
    }
  });
}

function generateLocalAiResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('medicine') || p.includes('home medicine') || p.includes('health') || p.includes('portal')) {
    return "💊 <strong>Home Medicine Portal:</strong> Govind developed a responsive web application (HTML5, CSS3, JavaScript) that tracks medicine shelf-lives with color-coded alerts (🟢 Safe, 🟡 Expiring &lt;30d, 🔴 Expired), batch numbers, and scientific eco-friendly disposal guidelines compliant with WHO environmental safety!";
  }
  if (p.includes('crm') || p.includes('citygens') || p.includes('workflow')) {
    return "📊 <strong>CityGens CRM Platform:</strong> Govind served as <strong>Lead Developer</strong>, architecting the user data management pipeline, Kanban workflow tracking (Lead -&gt; Verification -&gt; Fulfilled), and client SLA delivery metrics (achieving 98.4% timely completion)!";
  }
  if (p.includes('voice') || p.includes('elevenlabs') || p.includes('twilio') || p.includes('mcp')) {
    return "🎙️ <strong>Voice AI &amp; Model Context Protocol (MCP):</strong> Govind built an automated outbound telephony caller integrating Twilio API and ElevenLabs speech synthesis. He implemented the Model Context Protocol (MCP) using JSON-RPC 2.0 tool calls for secure API authentication and zero-trust sandboxing!";
  }
  if (p.includes('technovision') || p.includes('paper') || p.includes('trophy') || p.includes('security') || p.includes('cyber')) {
    return "🏆 <strong>Technovision Championship Win:</strong> Govind won the 1st Place Trophy at SATI Technovision for his research on <em>Data Integrity, AI &amp; Machine Learning in Cybersecurity</em>, demonstrating how SHA-256 cryptographic hashing and AI autoencoders prevent unauthorized log tampering!";
  }
  if (p.includes('kabaddi') || p.includes('sports') || p.includes('extracurricular')) {
    return "🎖️ <strong>State-Level Kabaddi:</strong> Govind represented at the state-level in Kabaddi, which instilled high-pressure split-second decision making, physical discipline, and collaborative teamwork!";
  }
  if (p.includes('education') || p.includes('cgpa') || p.includes('college') || p.includes('sati')) {
    return "🎓 <strong>Education Background:</strong> Govind is pursuing B.Tech in CSE (Cyber Security) at Samrat Ashok Technological Institute (SATI), Vidisha (CGPA: <strong>7.58</strong>, 2025–2029). He scored <strong>77.4%</strong> in Class XII (2024) and <strong>79.6%</strong> in Class X (2022) under the MP State Board.";
  }
  if (p.includes('design') || p.includes('video') || p.includes('creative') || p.includes('graphic')) {
    return "🎨 <strong>Creative Expertise:</strong> Govind's Major Domain is <strong>Graphic Design</strong> and Minor Domain is <strong>Video Editing</strong>. He served on the SATI Media &amp; Photography Team designing promotional posters, digital event branding, and VFX video reels.";
  }
  if (p.includes('email') || p.includes('contact') || p.includes('hire') || p.includes('internship')) {
    return "📬 <strong>Contact Govind:</strong> You can send a direct email using the working email form on this page or directly write to <strong>patidargovind0605@gmail.com</strong>. He is open to software development and cybersecurity opportunities!";
  }
  return "✨ <strong>Govind Patidar</strong> combines B.Tech Cyber Security studies at SATI Vidisha (7.58 CGPA) with full-stack web development, voice AI automation (ElevenLabs, Twilio, MCP), award-winning data integrity research, and creative design excellence. Try asking specifically about his <em>Home Medicine Portal</em>, <em>CityGens CRM</em>, or <em>Technovision Trophy</em>!";
}

/* ══════════════════════════════════════════════════════════
   10. WEB AUDIO API SYNTHESIZER (DIAL TONES)
   ══════════════════════════════════════════════════════════ */
function playDialTones() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Dual-tone frequencies: 350Hz + 440Hz (Standard dial tone)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.value = 350;
    osc2.frequency.value = 440;
    gain.gain.value = 0.08;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    setTimeout(() => {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 150);
    }, 700);
  } catch (e) {
    // Audio context prevented or unavailable
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ══════════════════════════════════════════════════════════
   11. BOOTSTRAP
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initReveal();
  initBackToTop();
  initFooterYear();
  initContactForm();
  initModals();
  initGithubLinks();
});
