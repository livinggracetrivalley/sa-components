/**
 * sa-components.js — Dashboard UI Web Component Library
 * Version: 3.0  |  Part of: ui-components skill
 *
 * Components (19 total):
 *   CORE (v1, unchanged):
 *     sa-banner, sa-hero, sa-card, sa-section, sa-verdict,
 *     sa-table, sa-ratio-grid, sa-indicators, sa-scenarios,
 *     sa-entry-points, sa-premortem, sa-timeline, sa-footer
 *
 *   NEW (v3):
 *     sa-page-header  — flexible hero for non-stock reports (fund, plan, index)
 *     sa-stat-grid    — responsive stat tile grid (4→2→1 col)
 *     sa-feature-box  — gradient callout with icon + title (data or slot)
 *     sa-chart-card   — container for canvas/SVG/Plotly charts
 *     sa-grid         — named-slot layout: 2col | 3col | sidebar | 2-to-1
 *     sa-callout      — enhanced verdict: icon + title + body (data or slot)
 *
 * Usage:
 *   <script src="sa-components.js"></script>
 *   All data via window.* objects. Zero CSS to write.
 *
 * CDN:
 *   https://livinggracetrivalley.github.io/sa-components/sa-components.js
 */

/* ─── Global CSS — injected once ─────────────────────────────── */
const _CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --bg:          #07111f;
    --bg1:         #0c1929;
    --bg2:         #101f33;
    --border:      #1a2d45;
    --border2:     #243852;
    --txt:         #cdd8ec;
    --txt2:        #7a90b0;
    --txt3:        #3d5270;
    --head:        #e8effc;
    --green:       #10b981;
    --green-bg:    rgba(16,185,129,0.08);
    --green-dim:   rgba(16,185,129,0.15);
    --yellow:      #f59e0b;
    --yellow-bg:   rgba(245,158,11,0.08);
    --red:         #ef4444;
    --red-bg:      rgba(239,68,68,0.08);
    --blue:        #3b82f6;
    --blue-bg:     rgba(59,130,246,0.08);
    --orange:      #f97316;
    --orange-bg:   rgba(249,115,22,0.08);
    --mono:        'IBM Plex Mono', monospace;
    --sans:        'Inter', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--txt);
    line-height: 1.6;
    padding: 28px 20px 56px;
    max-width: 1240px;
    margin: 0 auto;
  }

  /* Section headings */
  .sa-h2 {
    font-size: 11px; font-weight: 700; color: var(--txt3);
    text-transform: uppercase; letter-spacing: 1.2px;
    margin: 36px 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  /* Tables */
  .sa-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
  .sa-tbl th {
    background: #060e1a; color: var(--txt3);
    font-size: 10px; text-transform: uppercase; letter-spacing: .7px;
    font-weight: 700; padding: 8px 12px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .sa-tbl td { padding: 9px 12px; border-bottom: 1px solid #0e1c2e; font-size: 13px; }
  .sa-tbl tr:last-child td { border-bottom: none; }
  .sa-tbl tr:hover td { background: rgba(59,130,246,.03); }
  .sa-tbl .num   { text-align: right; font-family: var(--mono); }
  .sa-tbl .pos   { color: var(--green); }
  .sa-tbl .neg   { color: var(--red); }
  .sa-tbl .warn  { color: var(--yellow); }
  .sa-tbl .info  { color: var(--blue); }
  .sa-tbl .total { background: #060e1a; font-weight: 700; border-top: 1px solid var(--border); }
  .sa-tbl .hi    { background: rgba(59,130,246,.05); font-weight: 600; }

  /* Grid layouts */
  .g2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
  .g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  .g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }

  /* Inline text helpers */
  .pos  { color: var(--green); }
  .neg  { color: var(--red); }
  .warn { color: var(--yellow); }
  .info { color: var(--blue); }

  /* Lists */
  ul.sa-list { padding-left: 18px; }
  ul.sa-list li { margin-bottom: 7px; font-size: 13px; color: var(--txt); line-height: 1.55; }

  /* Source footnote */
  .sa-src { font-size: 10px; color: var(--txt3); font-style: italic; margin-top: 6px; }

  @media (max-width: 760px) { .g2,.g3,.g4 { grid-template-columns: 1fr; } }
  @media print {
    body { background: #fff; color: #111; }
    .g2,.g3,.g4 { grid-template-columns: 1fr; }
  }
`;

function _injectCSS() {
  if (document.getElementById('_sa_css')) return;
  const s = document.createElement('style');
  s.id = '_sa_css';
  s.textContent = _CSS;
  document.head.appendChild(s);
}

/* ─── Colour helpers ──────────────────────────────────────────── */
const _ACCENT = {
  green:  'var(--green)',
  yellow: 'var(--yellow)',
  red:    'var(--red)',
  blue:   'var(--blue)',
  orange: 'var(--orange)',
};
const _ACCENT_BG = {
  green:  'rgba(16,185,129,0.06)',
  yellow: 'rgba(245,158,11,0.06)',
  red:    'rgba(239,68,68,0.06)',
  blue:   'rgba(59,130,246,0.06)',
  orange: 'rgba(249,115,22,0.06)',
};
const _ACCENT_SOFT = {
  green:  '#a7f3d0',
  yellow: '#fde68a',
  red:    '#fecaca',
  blue:   '#bfdbfe',
  orange: '#fed7aa',
};

/* ════════════════════════════════════════════════════════════════
   ▌ V1 COMPONENTS (13) — unchanged from v1.0
   ════════════════════════════════════════════════════════════════ */

/* ── sa-banner ────────────────────────────────────────────────── */
customElements.define('sa-banner', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const type  = this.getAttribute('type')  || 'info';
    const label = this.getAttribute('label') || '';
    const title = this.getAttribute('title') || '';
    const body  = this.innerHTML;
    const C = {
      breaking: { bg:'#130608', border:'var(--red)',    lbl:'#fca5a5' },
      warning:  { bg:'#130c04', border:'var(--yellow)', lbl:'#fde68a' },
      success:  { bg:'#030e08', border:'var(--green)',  lbl:'#6ee7b7' },
      info:     { bg:'#030b18', border:'var(--blue)',   lbl:'#93c5fd' },
    }[type] || { bg:'#030b18', border:'var(--blue)', lbl:'#93c5fd' };
    this.style.cssText = `display:block;background:${C.bg};border:1px solid ${C.border};border-radius:10px;padding:14px 20px;margin-bottom:18px;`;
    this.innerHTML = `
      ${label ? `<div style="font-size:10px;letter-spacing:1.2px;font-weight:700;text-transform:uppercase;color:${C.lbl};margin-bottom:5px;">${label}</div>` : ''}
      ${title ? `<div style="font-size:17px;font-weight:700;color:#f0f4ff;margin-bottom:5px;">${title}</div>` : ''}
      <div style="font-size:13px;line-height:1.6;color:#c0cede;">${body}</div>`;
  }
});

/* ── sa-hero ──────────────────────────────────────────────────── */
customElements.define('sa-hero', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window.SA_DATA || {};
    const up = +D.change_dollar >= 0;
    const priceClr = up ? 'var(--green)' : 'var(--red)';
    const arrow    = up ? '▲' : '▼';
    const verdictStyle = {
      undervalued: `background:#04120a;color:#6ee7b7;border:1px solid var(--green);`,
      fair:        `background:#130d02;color:#fde68a;border:1px solid var(--yellow);`,
      overvalued:  `background:#130404;color:#fca5a5;border:1px solid var(--red);`,
    }[D.verdict] || `background:#070f1c;color:#93c5fd;border:1px solid var(--blue);`;
    const stats = (D.stats || []).map(s => `
      <div>
        <div style="font-size:10px;color:var(--txt3);text-transform:uppercase;letter-spacing:.7px;font-weight:700;">${s.label}</div>
        <div style="font-size:18px;font-weight:800;color:${s.color || 'var(--head)'};margin-top:3px;">${s.value}</div>
      </div>`).join('');
    this.style.display = 'block';
    this.innerHTML = `
      <div style="background:linear-gradient(145deg,#0c1929,#07111f);border:1px solid var(--border2);border-radius:14px;padding:24px 28px;margin-bottom:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;right:0;width:320px;height:100%;background:radial-gradient(ellipse at top right,rgba(59,130,246,.07),transparent 65%);pointer-events:none;"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="font-size:12px;font-weight:800;color:var(--blue);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">${D.ticker || ''}</div>
            <div style="font-size:26px;font-weight:800;color:var(--head);line-height:1.2;">${D.name || ''}</div>
            <div style="font-size:13px;color:var(--txt3);margin-top:4px;">${D.sector || ''} · ${D.industry || ''}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:46px;font-weight:900;color:${priceClr};line-height:1;">$${D.price || '—'}</div>
            <div style="font-size:13px;color:${priceClr};margin-top:4px;">${arrow} $${D.change_dollar || '0'} (${D.change_pct || '0'}%) · ${D.asof || ''}</div>
          </div>
        </div>
        ${stats ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;margin-top:20px;padding-top:18px;border-top:1px solid var(--border);">${stats}</div>` : ''}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;">
          <div style="padding:9px 16px;border-radius:8px;font-size:13px;font-weight:700;display:inline-flex;flex-direction:column;gap:2px;${verdictStyle}">
            <span style="font-size:9px;text-transform:uppercase;letter-spacing:.8px;opacity:.7;">Valuation Verdict</span>
            <span>${D.verdict_text || ''}</span>
          </div>
          <div style="padding:9px 16px;border-radius:8px;font-size:13px;font-weight:700;display:inline-flex;flex-direction:column;gap:2px;background:#03091a;color:#93c5fd;border:1px solid var(--blue);">
            <span style="font-size:9px;text-transform:uppercase;letter-spacing:.8px;opacity:.7;">6-Month Projected Range</span>
            <span>$${D.range_low} – $${D.range_high} &nbsp;(mid ~$${D.range_mid})</span>
          </div>
          ${D.analyst_rating ? `
          <div style="padding:9px 16px;border-radius:8px;font-size:13px;font-weight:700;display:inline-flex;flex-direction:column;gap:2px;background:#0a1020;color:#94a3b8;border:1px solid #1e2d4a;">
            <span style="font-size:9px;text-transform:uppercase;letter-spacing:.8px;opacity:.7;">Analyst Consensus</span>
            <span>${D.analyst_rating} · Avg PT $${D.avg_pt}</span>
          </div>` : ''}
        </div>
      </div>`;
  }
});

/* ── sa-card ──────────────────────────────────────────────────── */
customElements.define('sa-card', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const accent = this.getAttribute('accent') || '';
    const title  = this.getAttribute('title')  || '';
    const inner  = this.innerHTML;
    const border = _ACCENT[accent] || 'var(--border)';
    this.innerHTML = `
      <div style="background:var(--bg1);border:1px solid ${border};border-radius:10px;padding:18px 20px;margin-bottom:14px;">
        ${title ? `<div style="font-size:12px;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.7px;margin-bottom:12px;">${title}</div>` : ''}
        ${inner}
      </div>`;
  }
});

/* ── sa-section ───────────────────────────────────────────────── */
customElements.define('sa-section', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const title  = this.getAttribute('title')  || '';
    const icon   = this.getAttribute('icon')   || '';
    const accent = this.getAttribute('accent') || '';
    const inner  = this.innerHTML;
    const border = _ACCENT[accent] || 'var(--border2)';
    this.innerHTML = `
      ${title ? `<div class="sa-h2">${icon ? icon + ' ' : ''}${title}</div>` : ''}
      <div style="background:var(--bg1);border:1px solid ${border};border-radius:10px;padding:18px 20px;margin-bottom:14px;">${inner}</div>`;
  }
});

/* ── sa-verdict ───────────────────────────────────────────────── */
customElements.define('sa-verdict', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const type  = this.getAttribute('type') || 'blue';
    const inner = this.innerHTML;
    const C = {
      green:  { bg:'var(--green-bg)',  border:'var(--green)',  color:'#a7f3d0' },
      yellow: { bg:'var(--yellow-bg)', border:'var(--yellow)', color:'#fde68a' },
      red:    { bg:'var(--red-bg)',    border:'var(--red)',    color:'#fecaca' },
      blue:   { bg:'var(--blue-bg)',   border:'var(--blue)',   color:'#bfdbfe' },
    }[type] || { bg:'var(--blue-bg)', border:'var(--blue)', color:'#bfdbfe' };
    this.innerHTML = `<div style="padding:12px 16px;border-radius:8px;margin:12px 0;font-size:13px;line-height:1.55;border-left:4px solid ${C.border};background:${C.bg};color:${C.color};">${inner}</div>`;
  }
});

/* ── sa-table ─────────────────────────────────────────────────── */
customElements.define('sa-table', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')];
    if (!D) { this.innerHTML = `<div style="color:var(--red);font-size:12px;padding:8px;">⚠ sa-table: window.${this.getAttribute('data')} not found</div>`; return; }
    const cls  = D.classes || [];
    const thHTML   = D.head.map((h, i) => `<th class="${cls[i] || ''}">${h}</th>`).join('');
    const rowsHTML = D.rows.map((row, ri) => {
      const isTot = D.totals     && ri === D.rows.length - 1;
      const isHi  = D.highlights && D.highlights.includes(ri);
      return `<tr${isHi ? ' class="hi"' : ''}>${row.map((cell, ci) => `<td class="${cls[ci] || ''}${isTot ? ' total' : ''}">${cell}</td>`).join('')}</tr>`;
    }).join('');
    this.innerHTML = `<table class="sa-tbl"><thead><tr>${thHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>${D.source ? `<div class="sa-src">${D.source}</div>` : ''}`;
  }
});

/* ── sa-ratio-grid ────────────────────────────────────────────── */
customElements.define('sa-ratio-grid', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || [];
    const valClr = { rich:'var(--red)', fair:'var(--yellow)', cheap:'var(--green)' };
    this.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:14px;';
    this.innerHTML = D.map(r => `
      <div style="background:#060d1a;border:1px solid var(--border);border-radius:8px;padding:14px 16px;">
        <div style="font-size:10px;color:var(--txt3);text-transform:uppercase;letter-spacing:.7px;font-weight:700;">${r.name}</div>
        <div style="font-size:26px;font-weight:800;color:${valClr[r.sentiment] || 'var(--head)'};margin:6px 0 2px;">${r.value}</div>
        <div style="font-size:11px;color:var(--txt3);">${r.bench || ''}</div>
        <div style="font-size:11px;color:var(--txt2);line-height:1.4;margin-top:4px;">${r.interp || ''}</div>
      </div>`).join('');
  }
});

/* ── sa-indicators ────────────────────────────────────────────── */
customElements.define('sa-indicators', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || [];
    const pillBg = { green:'rgba(16,185,129,.15)', red:'rgba(239,68,68,.15)', yellow:'rgba(245,158,11,.15)', gray:'rgba(100,116,139,.15)' };
    const pillFg = { green:'var(--green)', red:'var(--red)', yellow:'var(--yellow)', gray:'#94a3b8' };
    const rows = D.map(r => {
      const bg = pillBg[r.sentiment] || pillBg.gray;
      const fg = pillFg[r.sentiment] || pillFg.gray;
      return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #0e1c2e;">
        <div style="font-size:12px;color:var(--txt2);flex:1;">${r.label}</div>
        <div style="font-size:13px;font-weight:600;font-family:var(--mono);">${r.value}</div>
        ${r.pill ? `<div style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;text-transform:uppercase;background:${bg};color:${fg};">${r.pill}</div>` : ''}
      </div>`;
    }).join('');
    this.innerHTML = `<div style="background:var(--bg1);border:1px solid var(--border);border-radius:10px;padding:14px 18px;">${rows}</div>`;
  }
});

/* ── sa-scenarios ─────────────────────────────────────────────── */
customElements.define('sa-scenarios', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || {};
    const cfg = [
      { key:'bull', emoji:'🐂', label:'Bull', border:'var(--green)', bg:'rgba(16,185,129,.04)', priceClr:'var(--green)' },
      { key:'base', emoji:'📊', label:'Base', border:'var(--yellow)',bg:'rgba(245,158,11,.04)', priceClr:'var(--yellow)' },
      { key:'bear', emoji:'🐻', label:'Bear', border:'var(--red)',   bg:'rgba(239,68,68,.04)',  priceClr:'var(--red)' },
    ];
    this.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px;';
    this.innerHTML = cfg.map(c => {
      const s = D[c.key] || {};
      return `<div style="border-radius:10px;padding:16px 18px;border:1px solid ${c.border};background:${c.bg};">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${c.border};margin-bottom:3px;">${c.emoji} ${c.label}</div>
        <div style="font-size:11px;color:var(--txt3);margin-bottom:8px;">Probability: ${s.prob || '—'}</div>
        <div style="font-size:30px;font-weight:900;color:${c.priceClr};margin:8px 0;">${s.price_range || '—'}</div>
        <p style="font-size:12px;color:var(--txt2);line-height:1.5;">${s.drivers || ''}</p>
      </div>`;
    }).join('');
  }
});

/* ── sa-entry-points ──────────────────────────────────────────── */
customElements.define('sa-entry-points', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || {};
    const cfg = [
      { key:'aggressive',   emoji:'🔥', label:'Aggressive',   border:'var(--red)',    color:'#fca5a5' },
      { key:'moderate',     emoji:'⚖️',  label:'Moderate',     border:'var(--yellow)', color:'#fde68a' },
      { key:'conservative', emoji:'🛡️',  label:'Conservative', border:'var(--green)',  color:'#6ee7b7' },
    ];
    this.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px;';
    this.innerHTML = cfg.map(c => {
      const e = D[c.key] || {};
      return `<div style="border-radius:10px;padding:16px 18px;border:1px solid var(--border);border-left:4px solid ${c.border};background:#060d1a;">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${c.border};margin-bottom:4px;">${c.emoji} ${c.label}</div>
        <div style="font-size:28px;font-weight:900;color:${c.color};margin:6px 0;">${e.price || '—'}</div>
        <div style="font-size:12px;color:var(--txt2);line-height:1.4;">${e.condition || ''}</div>
      </div>`;
    }).join('');
  }
});

/* ── sa-premortem ─────────────────────────────────────────────── */
customElements.define('sa-premortem', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || {};
    const probClr = { High:'var(--red)', Medium:'var(--yellow)', Low:'var(--green)' };
    const impClr  = { Catastrophic:'var(--red)', Severe:'var(--yellow)', Mild:'var(--green)' };
    const riskRows = (D.risks || []).map(r => `<tr>
      <td>${r.failure}</td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:${probClr[r.probability]}22;color:${probClr[r.probability]};">${r.probability}</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:${impClr[r.impact]}22;color:${impClr[r.impact]};">${r.impact}</span></td>
    </tr>`).join('');
    const narratives = (D.risks || []).filter(r => r.narrative).slice(0, 2).map(r => `
      <div style="background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:14px 16px;margin:10px 0;">
        <div style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">📖 Post-Mortem: ${r.failure}</div>
        <div style="font-size:13px;color:#fecaca;font-style:italic;line-height:1.6;">${r.narrative}</div>
      </div>`).join('');
    const leadingRows = (D.leading || []).map(l => `<tr>
      <td>${l.failure}</td>
      <td><ul style="padding-left:16px;margin:0;">${(l.indicators || []).map(i => `<li style="font-size:12px;color:var(--txt2);margin-bottom:3px;">${i}</li>`).join('')}</ul></td>
    </tr>`).join('');
    this.innerHTML = `
      <table class="sa-tbl" style="margin-bottom:14px;">
        <thead><tr><th>Failure Mode</th><th>Probability</th><th>Impact</th></tr></thead>
        <tbody>${riskRows}</tbody>
      </table>
      ${narratives}
      ${leadingRows ? `
        <div style="font-size:11px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.8px;margin:14px 0 8px;">Leading Indicators</div>
        <table class="sa-tbl"><thead><tr><th>Failure Mode</th><th>Watch For</th></tr></thead><tbody>${leadingRows}</tbody></table>` : ''}
      ${D.implications ? `<div style="background:var(--blue-bg);border-left:4px solid var(--blue);border-radius:0 8px 8px 0;padding:12px 16px;margin-top:12px;font-size:13px;color:#bfdbfe;line-height:1.5;">${D.implications}</div>` : ''}`;
  }
});

/* ── sa-timeline ──────────────────────────────────────────────── */
customElements.define('sa-timeline', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || [];
    const dotClr = { green:'var(--green)', yellow:'var(--yellow)', red:'var(--red)', blue:'var(--blue)', gray:'#334155' };
    const items = D.map(e => `
      <div style="position:relative;padding-left:24px;margin-bottom:18px;">
        <div style="position:absolute;left:0;top:5px;width:10px;height:10px;border-radius:50%;border:2px solid ${dotClr[e.color] || dotClr.gray};background:var(--bg);${e.color === 'green' ? 'box-shadow:0 0 6px rgba(16,185,129,.4);' : ''}"></div>
        <div style="font-size:11px;color:var(--txt3);font-weight:600;">${e.date}</div>
        <div style="font-size:13px;color:#d0daf0;font-weight:600;">${e.event}</div>
        ${e.desc ? `<div style="font-size:12px;color:var(--txt2);margin-top:2px;">${e.desc}</div>` : ''}
      </div>`).join('');
    this.innerHTML = `<div style="position:relative;padding-left:8px;"><div style="position:absolute;left:4px;top:8px;bottom:8px;width:2px;background:var(--border);border-radius:1px;"></div>${items}</div>`;
  }
});

/* ── sa-footer ────────────────────────────────────────────────── */
customElements.define('sa-footer', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const ticker  = this.getAttribute('ticker')  || 'this security';
    const date    = this.getAttribute('date')    || 'the report date';
    const sources = this.getAttribute('sources') || '';
    this.innerHTML = `
      <div style="margin-top:40px;padding:18px 20px;background:#060d1a;border:1px solid #111d30;border-radius:10px;font-size:11px;color:#2e4460;line-height:1.7;">
        <strong style="color:#3d5a7a;">Disclaimer:</strong> This report is an analytical framework for ${ticker}, not personalized financial advice. Numbers reflect publicly available data as of ${date} and author-estimated assumptions. Stock prices, fundamentals, and projections change frequently. Always do your own research and consult a licensed financial advisor before making investment decisions. This analysis is produced by an AI assistant and is not from a registered financial advisor.
        ${sources ? `<br><br><span style="color:#1e3048;">Sources: ${sources}</span>` : ''}
      </div>`;
  }
});


/* ════════════════════════════════════════════════════════════════
   ▌ V3 COMPONENTS (6) — new in v3.0
   ════════════════════════════════════════════════════════════════ */

/* ── sa-page-header ───────────────────────────────────────────────
   Flexible hero for non-stock reports (fund, plan, index, event).
   Attrs: data="VAR_NAME"
   window[VAR_NAME] = {
     title, subtitle?, description?, meta?,
     badge?: { text, color, icon },
     stats?: [ { label, value, color?, sub?, trend?, trendDir? } ]
   }
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-page-header', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D = window[this.getAttribute('data')] || {};
    const badgeColor = _ACCENT[D.badge?.color] || 'var(--blue)';
    const badgeBg    = _ACCENT_BG[D.badge?.color] || 'rgba(59,130,246,0.1)';
    const badgeSoft  = _ACCENT_SOFT[D.badge?.color] || '#bfdbfe';

    const statsHTML = (D.stats || []).map(s => {
      const trendClr = s.trendDir === 'up'   ? 'var(--green)'
                     : s.trendDir === 'down' ? 'var(--red)'
                     : 'var(--txt3)';
      const trendArrow = s.trendDir === 'up' ? '▲' : s.trendDir === 'down' ? '▼' : '';
      return `
        <div style="text-align:center;padding:0 16px;border-right:1px solid var(--border);">
          <div style="font-size:10px;color:var(--txt3);text-transform:uppercase;letter-spacing:.7px;font-weight:700;margin-bottom:4px;">${s.label}</div>
          <div style="font-size:20px;font-weight:800;color:${s.color || 'var(--head)'};">${s.value}</div>
          ${s.sub    ? `<div style="font-size:11px;color:var(--txt3);margin-top:2px;">${s.sub}</div>` : ''}
          ${s.trend  ? `<div style="font-size:11px;color:${trendClr};margin-top:2px;">${trendArrow} ${s.trend}</div>` : ''}
        </div>`;
    }).join('');

    this.style.display = 'block';
    this.innerHTML = `
      <div style="background:linear-gradient(145deg,#0c1929,#07111f);border:1px solid var(--border2);border-radius:14px;padding:26px 28px;margin-bottom:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;right:0;width:400px;height:100%;background:radial-gradient(ellipse at top right,rgba(59,130,246,.06),transparent 65%);pointer-events:none;"></div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            ${D.badge ? `<div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.1px;color:${badgeSoft};background:${badgeBg};border:1px solid ${badgeColor};border-radius:4px;padding:3px 10px;margin-bottom:10px;">${D.badge.icon ? D.badge.icon + ' ' : ''}${D.badge.text}</div>` : ''}
            <div style="font-size:28px;font-weight:800;color:var(--head);line-height:1.15;">${D.title || ''}</div>
            ${D.subtitle     ? `<div style="font-size:14px;color:var(--txt2);margin-top:5px;">${D.subtitle}</div>` : ''}
            ${D.description  ? `<div style="font-size:13px;color:var(--txt3);margin-top:8px;max-width:600px;line-height:1.5;">${D.description}</div>` : ''}
          </div>
          ${D.meta ? `<div style="font-size:11px;color:var(--txt3);text-align:right;white-space:nowrap;">${D.meta}</div>` : ''}
        </div>
        ${statsHTML ? `
          <div style="display:flex;flex-wrap:wrap;margin-top:22px;padding-top:18px;border-top:1px solid var(--border);gap:0;">
            ${statsHTML}
            <div style="flex:1;"></div>
          </div>` : ''}
      </div>`;
  }
});


/* ── sa-stat-grid ──────────────────────────────────────────────────
   Responsive stat tile grid. Auto-fits 4→2→1 columns.
   Attr: data="VAR_NAME"  cols="4|3|2"
   window[VAR_NAME] = [
     { label, value, sub?, icon?, color?, trend?, trendDir?, href? }
   ]
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-stat-grid', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const D    = window[this.getAttribute('data')] || [];
    const cols = this.getAttribute('cols') || '4';
    const minW = cols === '2' ? '220px' : cols === '3' ? '180px' : '140px';

    this.style.cssText = `display:grid;grid-template-columns:repeat(auto-fit,minmax(${minW},1fr));gap:12px;margin-bottom:14px;`;
    this.innerHTML = D.map(s => {
      const trendClr = s.trendDir === 'up'   ? 'var(--green)'
                     : s.trendDir === 'down' ? 'var(--red)'
                     : 'var(--txt3)';
      const trendArr = s.trendDir === 'up' ? '▲' : s.trendDir === 'down' ? '▼' : '';
      const inner = `
        <div style="background:var(--bg1);border:1px solid var(--border);border-radius:10px;padding:16px 18px;${s.href ? 'cursor:pointer;transition:border-color .15s;' : ''}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div style="font-size:10px;color:var(--txt3);text-transform:uppercase;letter-spacing:.7px;font-weight:700;">${s.label}</div>
            ${s.icon ? `<div style="font-size:18px;opacity:.6;">${s.icon}</div>` : ''}
          </div>
          <div style="font-size:26px;font-weight:800;color:${s.color || 'var(--head)'};line-height:1.1;">${s.value}</div>
          ${s.trend ? `<div style="font-size:11px;color:${trendClr};margin-top:5px;">${trendArr} ${s.trend}</div>` : ''}
          ${s.sub   ? `<div style="font-size:11px;color:var(--txt3);margin-top:3px;">${s.sub}</div>` : ''}
        </div>`;
      return s.href ? `<a href="${s.href}" style="text-decoration:none;">${inner}</a>` : inner;
    }).join('');
  }
});


/* ── sa-feature-box ────────────────────────────────────────────────
   Gradient callout with icon, title, and body. Supports data or slot.
   SLOT mode:  <sa-feature-box icon="🎯" title="X" color="green">body</sa-feature-box>
   DATA mode:  <sa-feature-box data="FEATURES"></sa-feature-box>
   window.FEATURES = [ { icon, title, subtitle?, body?, color?, cta?:{text,href} } ]
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-feature-box', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const dataKey = this.getAttribute('data');
    if (dataKey) {
      // DATA mode — render array as grid
      const D = window[dataKey] || [];
      this.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:14px;';
      this.innerHTML = D.map(f => {
        const clr  = _ACCENT[f.color]     || 'var(--blue)';
        const bg   = _ACCENT_BG[f.color]  || 'rgba(59,130,246,0.06)';
        const soft = _ACCENT_SOFT[f.color] || '#bfdbfe';
        return `
          <div style="background:linear-gradient(135deg,${bg},rgba(0,0,0,0));border:1px solid ${clr}44;border-radius:12px;padding:20px 22px;">
            ${f.icon ? `<div style="font-size:28px;margin-bottom:12px;">${f.icon}</div>` : ''}
            <div style="font-size:15px;font-weight:700;color:${soft};margin-bottom:4px;">${f.title || ''}</div>
            ${f.subtitle ? `<div style="font-size:12px;color:var(--txt3);margin-bottom:8px;">${f.subtitle}</div>` : ''}
            ${f.body     ? `<div style="font-size:13px;color:var(--txt2);line-height:1.55;">${f.body}</div>` : ''}
            ${f.cta      ? `<a href="${f.cta.href || '#'}" style="display:inline-block;margin-top:12px;font-size:11px;font-weight:700;color:${clr};text-decoration:none;text-transform:uppercase;letter-spacing:.7px;">${f.cta.text} →</a>` : ''}
          </div>`;
      }).join('');
    } else {
      // SLOT mode — single box
      const color = this.getAttribute('color') || 'blue';
      const icon  = this.getAttribute('icon')  || '';
      const title = this.getAttribute('title') || '';
      const body  = this.innerHTML;
      const clr   = _ACCENT[color]     || 'var(--blue)';
      const bg    = _ACCENT_BG[color]  || 'rgba(59,130,246,0.06)';
      const soft  = _ACCENT_SOFT[color] || '#bfdbfe';
      this.innerHTML = `
        <div style="background:linear-gradient(135deg,${bg},rgba(0,0,0,0));border:1px solid ${clr}44;border-radius:12px;padding:20px 22px;margin-bottom:14px;">
          ${icon  ? `<div style="font-size:28px;margin-bottom:12px;">${icon}</div>` : ''}
          ${title ? `<div style="font-size:15px;font-weight:700;color:${soft};margin-bottom:8px;">${title}</div>` : ''}
          <div style="font-size:13px;color:var(--txt2);line-height:1.55;">${body}</div>
        </div>`;
    }
  }
});


/* ── sa-chart-card ─────────────────────────────────────────────────
   Container for canvas / SVG / Plotly charts. Slot-based only.
   Attrs: title  subtitle?  height="400"  source?  loading?
   Usage:
     <sa-chart-card title="Revenue by Quarter" height="320" source="10-K">
       <canvas id="myChart"></canvas>
     </sa-chart-card>
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-chart-card', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const title    = this.getAttribute('title')    || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const height   = this.getAttribute('height')   || '400';
    const source   = this.getAttribute('source')   || '';
    const loading  = this.getAttribute('loading')  || '';
    const inner    = this.innerHTML;
    this.innerHTML = `
      <div style="background:var(--bg1);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:14px;">
        ${title ? `<div style="font-size:14px;font-weight:700;color:var(--head);margin-bottom:${subtitle ? '2px' : '14px'};">${title}</div>` : ''}
        ${subtitle ? `<div style="font-size:12px;color:var(--txt3);margin-bottom:14px;">${subtitle}</div>` : ''}
        <div style="position:relative;width:100%;height:${height}px;overflow:hidden;">
          ${loading ? `<div id="_sa_cld" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg1);z-index:2;font-size:12px;color:var(--txt3);">${loading}</div>` : ''}
          ${inner}
        </div>
        ${source ? `<div class="sa-src" style="margin-top:8px;">Source: ${source}</div>` : ''}
      </div>`;
  }
});


/* ── sa-grid ───────────────────────────────────────────────────────
   Named-slot multi-column layout. No data object needed.
   Attrs: layout="2col|3col|4col|sidebar|2-to-1"  gap="14"  collapse-at="768"
   Usage:
     <sa-grid layout="sidebar">
       <div slot="sidebar">...</div>
       <div slot="main">...</div>
     </sa-grid>
     <sa-grid layout="2col">
       <div slot="col1">...</div>
       <div slot="col2">...</div>
     </sa-grid>
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-grid', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const layout     = this.getAttribute('layout')      || '2col';
    const gap        = this.getAttribute('gap')         || '14';
    const collapseAt = this.getAttribute('collapse-at') || '768';

    // Collect named slots
    const slots = {};
    [...this.children].forEach(el => {
      const slot = el.getAttribute('slot') || 'col1';
      if (!slots[slot]) slots[slot] = [];
      slots[slot].push(el.outerHTML);
    });
    const slotHTML = name => (slots[name] || []).join('');

    const gridStyle = (cols) => `display:grid;grid-template-columns:${cols};gap:${gap}px;margin-bottom:14px;align-items:start;`;

    const LAYOUTS = {
      '2col':    { cols: '1fr 1fr',         slots: ['col1','col2'] },
      '3col':    { cols: '1fr 1fr 1fr',      slots: ['col1','col2','col3'] },
      '4col':    { cols: '1fr 1fr 1fr 1fr',  slots: ['col1','col2','col3','col4'] },
      'sidebar': { cols: '280px 1fr',         slots: ['sidebar','main'] },
      '2-to-1':  { cols: '2fr 1fr',           slots: ['col1','col2'] },
    };
    const cfg = LAYOUTS[layout] || LAYOUTS['2col'];

    // Responsive override injected inline via a unique class
    const uid = '_saG' + Math.random().toString(36).slice(2,7);
    const style = document.createElement('style');
    style.textContent = `@media(max-width:${collapseAt}px){.${uid}{grid-template-columns:1fr !important;}}`;
    document.head.appendChild(style);

    this.style.cssText = gridStyle(cfg.cols);
    this.classList.add(uid);
    this.innerHTML = cfg.slots.map(s => `<div>${slotHTML(s)}</div>`).join('');
  }
});


/* ── sa-callout ────────────────────────────────────────────────────
   Enhanced verdict box with icon + bold title + body. Supports data or slot.
   SLOT mode:  <sa-callout type="blue" title="X" icon="💡">body</sa-callout>
   DATA mode:  <sa-callout data="CALLOUTS"></sa-callout>
   window.CALLOUTS = [
     { type, icon?, title?, body, level? }
     // type: 'blue'|'green'|'red'|'yellow'|'orange'
     // level: 'info'|'warning'|'critical'  (optional glow)
   ]
   ════════════════════════════════════════════════════════════════ */
customElements.define('sa-callout', class extends HTMLElement {
  connectedCallback() {
    _injectCSS();
    const _render = (type, icon, title, body) => {
      type = type || 'blue';
      const C = {
        green:  { bg:'rgba(16,185,129,.06)',  border:'var(--green)',  color:'#a7f3d0', titleClr:'#6ee7b7' },
        yellow: { bg:'rgba(245,158,11,.06)',   border:'var(--yellow)', color:'#fde68a', titleClr:'#fbbf24' },
        red:    { bg:'rgba(239,68,68,.06)',    border:'var(--red)',    color:'#fecaca', titleClr:'#f87171' },
        blue:   { bg:'rgba(59,130,246,.06)',   border:'var(--blue)',   color:'#bfdbfe', titleClr:'#60a5fa' },
        orange: { bg:'rgba(249,115,22,.06)',   border:'var(--orange)', color:'#fed7aa', titleClr:'#fb923c' },
      }[type] || { bg:'rgba(59,130,246,.06)', border:'var(--blue)', color:'#bfdbfe', titleClr:'#60a5fa' };
      return `
        <div style="border:1px solid ${C.border}44;border-left:4px solid ${C.border};border-radius:0 10px 10px 0;background:${C.bg};padding:14px 18px;margin-bottom:12px;">
          ${(icon || title) ? `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
              ${icon  ? `<span style="font-size:16px;line-height:1;">${icon}</span>` : ''}
              ${title ? `<span style="font-size:13px;font-weight:700;color:${C.titleClr};text-transform:uppercase;letter-spacing:.5px;">${title}</span>` : ''}
            </div>` : ''}
          <div style="font-size:13px;color:${C.color};line-height:1.6;">${body}</div>
        </div>`;
    };

    const dataKey = this.getAttribute('data');
    if (dataKey) {
      // DATA mode
      const D = window[dataKey] || [];
      this.style.display = 'block';
      this.innerHTML = D.map(c => _render(c.type, c.icon, c.title, c.body)).join('');
    } else {
      // SLOT mode
      const type  = this.getAttribute('type')  || 'blue';
      const icon  = this.getAttribute('icon')  || '';
      const title = this.getAttribute('title') || '';
      const body  = this.innerHTML;
      this.innerHTML = _render(type, icon, title, body);
    }
  }
});


console.log('[sa-components v3.0] ✅ 19 components registered (13 core + 6 new).');
