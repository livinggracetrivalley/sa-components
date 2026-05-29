/* ============================================================
   sa-components-v4.js
   SA Web Components Library — Version 4.0
   Released: May 2026

   WHAT'S NEW IN v4.0:
   ─────────────────────────────────────────────────────────────
   NEW CORE COMPONENTS (+9):
     sa-editorial-hero     Full-width editorial title block
     sa-section-head       Numbered section header with subtitle
     sa-kpi-insight        Giant-number insight card grid
     sa-phase-cards        Sequential phase/stage card strip
     sa-compare-cards      A/B side-by-side comparison panels
     sa-sticky-nav         Sticky header with logo + live indicator
     sa-tag-pill           Inline tone-colored status chip
     sa-data-chip-row      Wrapping row of labeled value chips
     sa-callout-box        Large editorial callout with heading

   UPGRADED COMPONENTS:
     sa-table              + cell tone coloring, serif first-col option
     sa-chart-card         + subtitle attr, span="full" layout attr
     sa-callout            Renamed alias → sa-verdict-chip (backward compat kept)

   SYSTEM ADDITIONS:
     Typography tokens     --sa-font-display, --sa-font-mono, --sa-font-body
     Tone system           Unified: bull | ok | neutral | warn | crit
     Dark theme variant    data-theme="dark" on body or wrapper
     Ambient BG layer      sa-ambient-bg component

   BACKWARD COMPAT:
     All v3.0 components unchanged. New components are additive.
     sa-callout still works; sa-verdict-chip is the new canonical name.

   TOTAL: 19 existing + 9 new core + 12 plugin = 40 core, 52 with plugin
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     DESIGN TOKENS
     ───────────────────────────────────────────────────────── */
  const CSS = `
    /* ── v4 Typography Tokens ── */
    :root {
      --sa-font-display: 'Fraunces', 'Georgia', serif;
      --sa-font-mono:    'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', monospace;
      --sa-font-body:    'Inter', 'Helvetica Neue', sans-serif;
    }

    /* ── v3 Original Tokens (preserved) ── */
    :root {
      --bg:      #07111f;
      --bg1:     #0c1929;
      --bg2:     #101f33;
      --border:  #1a2d45;
      --txt:     #cdd8ec;
      --txt2:    #7a90b0;
      --txt3:    #3d5270;
      --head:    #e8effc;
      --green:   #10b981;
      --yellow:  #f59e0b;
      --red:     #ef4444;
      --blue:    #3b82f6;
      --mono:    'IBM Plex Mono', monospace;
      --sans:    'Inter', sans-serif;
    }

    /* ── v4 Dark-Editorial Theme ── */
    [data-theme="dark"], .sa-dark {
      --sa-bg:         #0a0e0d;
      --sa-bg-elev:    #131817;
      --sa-bg-card:    #1a201f;
      --sa-ink:        #e8e6e0;
      --sa-ink-dim:    #8a8f8c;
      --sa-ink-faint:  #545957;
      --sa-accent:     #d4ff3a;
      --sa-warn:       #ff6b35;
      --sa-crit:       #c8102e;
      --sa-gold:       #d4a574;
      --sa-blue:       #6ec5ff;
      --sa-line:       #232928;
      --sa-line-hi:    #2e3534;
    }

    /* ── v4 Tone Palette (unified) ── */
    :root {
      --sa-tone-bull:    #10b981;
      --sa-tone-ok:      #10b981;
      --sa-tone-neutral: #7a90b0;
      --sa-tone-warn:    #f59e0b;
      --sa-tone-crit:    #ef4444;
      /* pill backgrounds */
      --sa-pill-bull:    rgba(16,185,129,0.12);
      --sa-pill-ok:      rgba(16,185,129,0.12);
      --sa-pill-neutral: rgba(122,144,176,0.12);
      --sa-pill-warn:    rgba(245,158,11,0.12);
      --sa-pill-crit:    rgba(239,68,68,0.14);
      /* legacy aliases */
      --sa-pill-strong:  rgba(16,185,129,0.12);
      --sa-pill-soft:    rgba(245,158,11,0.12);
      --sa-pill-weak:    rgba(239,68,68,0.14);
      --sa-pill-neut:    rgba(122,144,176,0.12);
    }

    /* ── Shared Utility ── */
    .sa-mono { font-family: var(--sa-font-mono, var(--mono)); }
    .sa-serif { font-family: var(--sa-font-display); }
    .sa-eyebrow {
      font-family: var(--sa-font-mono, var(--mono));
      font-size: 10px; letter-spacing: 0.22em;
      text-transform: uppercase; color: var(--txt2);
    }
  `;

  /* inject CSS once */
  let _cssInjected = false;
  function _injectCSS() {
    if (_cssInjected) return;
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    _cssInjected = true;
  }

  /* tone → color helpers */
  function _toneColor(tone) {
    const map = {
      bull:'var(--sa-tone-bull)', ok:'var(--sa-tone-ok)',
      neutral:'var(--sa-tone-neutral)', warn:'var(--sa-tone-warn)',
      crit:'var(--sa-tone-crit)',
      // v3 legacy
      green:'var(--green)', yellow:'var(--yellow)', red:'var(--red)', blue:'var(--blue)',
      // editorial aliases
      good:'var(--sa-accent, var(--green))', amber:'var(--sa-gold, var(--yellow))'
    };
    return map[tone] || 'var(--txt)';
  }
  function _pillBg(tone) {
    const map = {
      bull:'var(--sa-pill-bull)', ok:'var(--sa-pill-ok)',
      neutral:'var(--sa-pill-neutral)', warn:'var(--sa-pill-warn)',
      crit:'var(--sa-pill-crit)',
      strong:'var(--sa-pill-strong)', soft:'var(--sa-pill-soft)',
      weak:'var(--sa-pill-weak)', neut:'var(--sa-pill-neut)'
    };
    return map[tone] || 'rgba(122,144,176,0.12)';
  }

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 1: sa-editorial-hero
     Full-width editorial header with eyebrow, giant serif
     headline (em support), subtext, and KPI stat bar.
     Replaces .hero / .hero-stats inline CSS pattern.

     Data: window[data-attr] OR window.HERO_DATA
     Schema: {
       eyebrow: string,
       headline: string,
       headline_em: string[],   // words to italicize/accent
       subtext: string,
       stats: [{label, value, tone?}]  // tone: good|warn|crit
     }
     Attrs: data="HERO_DATA" (optional — falls back to HERO_DATA)
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-editorial-hero', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || 'HERO_DATA';
      const D = window[key] || {};
      const eyebrow = D.eyebrow || '';
      const headline = D.headline || '';
      const ems = D.headline_em || [];
      const subtext = D.subtext || '';
      const stats = D.stats || [];

      // highlight em words in headline
      let hl = headline;
      ems.forEach(w => {
        hl = hl.replace(new RegExp(w, 'g'), `<em style="font-style:italic;font-weight:600;color:var(--sa-accent,var(--blue))">${w}</em>`);
      });

      const statCells = stats.map(s => {
        const color = _toneColor(s.tone || '');
        return `
          <div style="background:var(--bg);padding:20px 26px">
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--txt3);margin-bottom:10px">${s.label}</div>
            <div style="font-family:var(--sa-font-display,serif);font-size:34px;font-weight:600;letter-spacing:-0.02em;color:${color}">${s.value}</div>
          </div>`;
      }).join('');

      const statBar = stats.length ? `
        <div style="display:grid;grid-template-columns:repeat(${Math.min(stats.length,4)},1fr);gap:1px;margin-top:56px;background:var(--border,#1a2d45);border:1px solid var(--border,#1a2d45)">
          ${statCells}
        </div>` : '';

      this.innerHTML = `
        <div style="padding:72px 48px 56px;border-bottom:1px solid var(--border,#1a2d45)">
          ${eyebrow ? `<div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;letter-spacing:0.25em;color:var(--sa-accent,var(--blue));text-transform:uppercase;margin-bottom:22px">${eyebrow}</div>` : ''}
          <h1 style="font-family:var(--sa-font-display,serif);font-size:clamp(44px,7vw,88px);font-weight:300;line-height:0.97;letter-spacing:-0.04em;margin:0 0 28px;color:var(--head,#e8effc)">${hl}</h1>
          ${subtext ? `<p style="font-size:16px;color:var(--txt2);max-width:720px;line-height:1.7;margin:0">${subtext}</p>` : ''}
          ${statBar}
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 2: sa-section-head
     Numbered section heading: mono seq label + serif title
     + optional right-aligned descriptor blurb.

     Attrs:
       num="01"               sequence label (e.g. "01 · THE PATTERN")
       title="..."            section title text
       em="..."               substring to italicize+accent in title
       sub="..."              right-side descriptor text (optional)
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-section-head', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const num   = this.getAttribute('num')   || '';
      const title = this.getAttribute('title') || '';
      const em    = this.getAttribute('em')    || '';
      const sub   = this.getAttribute('sub')   || '';

      let ht = title;
      if (em) ht = ht.replace(new RegExp(em, 'g'),
        `<em style="font-style:italic;font-weight:600">${em}</em>`);

      this.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:20px;padding-top:4px">
          <div>
            ${num ? `<div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:var(--txt3);letter-spacing:0.25em;margin-bottom:8px">${num}</div>` : ''}
            <h2 style="font-family:var(--sa-font-display,serif);font-size:clamp(28px,4.5vw,48px);font-weight:400;letter-spacing:-0.03em;line-height:1.05;max-width:760px;margin:0;color:var(--head,#e8effc)">${ht}</h2>
          </div>
          ${sub ? `<p style="color:var(--txt2);max-width:400px;font-size:13px;line-height:1.7;margin:0;flex-shrink:0">${sub}</p>` : ''}
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 3: sa-kpi-insight
     3-up (or N-up) giant-number insight card grid.
     Each card: mono label, huge colored value, prose desc.
     Top border accent driven by tone.

     Data: window[data] → array of {label, value, tone, desc}
     tone: bull | ok | neutral | warn | crit
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-kpi-insight', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const items = window[key] || [];
      const cols = this.getAttribute('cols') || Math.min(items.length, 3);

      const cards = items.map(it => {
        const color = _toneColor(it.tone || 'neutral');
        const borderColor = color;
        return `
          <div style="background:var(--bg1);border:1px solid var(--border);border-top:2px solid ${borderColor};padding:26px;overflow:hidden">
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:10px;letter-spacing:0.2em;color:var(--txt3);text-transform:uppercase;margin-bottom:14px">${it.label}</div>
            <div style="font-family:var(--sa-font-display,serif);font-size:46px;font-weight:300;letter-spacing:-0.03em;line-height:1;margin-bottom:12px;color:${color}">${it.value}</div>
            <div style="font-size:13px;color:var(--txt2);line-height:1.55">${it.desc || ''}</div>
          </div>`;
      }).join('');

      this.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;margin-bottom:24px">
          ${cards}
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 4: sa-phase-cards
     Horizontal N-up phase / stage card strip.
     Each card: colored mono label, serif title, period sub,
     body prose. Hover lifts border to accent.

     Data: window[data] → array of:
       {label, tone, title, period, body}
     tone: bull | warn | crit | neutral (controls label color)
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-phase-cards', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const phases = window[key] || [];
      const cols = this.getAttribute('cols') || Math.min(phases.length, 4);

      const cards = phases.map(p => {
        const lc = _toneColor(p.tone || 'neutral');
        return `
          <div style="background:var(--bg1);border:1px solid var(--border);padding:26px;transition:border-color 0.3s;cursor:default"
               onmouseenter="this.style.borderColor='var(--sa-accent,var(--blue))';this.style.background='var(--bg2)'"
               onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--bg1)'">
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:${lc};letter-spacing:0.2em;margin-bottom:14px">${p.label}</div>
            <div style="font-family:var(--sa-font-display,serif);font-size:21px;font-weight:500;margin-bottom:6px;letter-spacing:-0.01em;color:var(--head)">${p.title}</div>
            ${p.period ? `<div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px">${p.period}</div>` : ''}
            <div style="font-size:13px;color:var(--txt2);line-height:1.6">${p.body || ''}</div>
          </div>`;
      }).join('');

      this.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;margin-bottom:36px">
          ${cards}
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 5: sa-compare-cards
     2-up (or N-up) side-by-side comparison panel.
     Each panel: colored eyebrow, heading, sub, 2×2 stat
     grid, prose body, optional chip row.

     Data: window[data] → array of:
       {
         eyebrow: string,
         color: hex or CSS var string,
         heading: string,
         sub: string,
         stats: [{label, value, highlight?}],  // up to 4
         body: string,
         chips: [{label, dir}]   // dir: 'up'|'dn'|'neutral'
       }
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-compare-cards', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const items = window[key] || [];
      const cols = this.getAttribute('cols') || Math.min(items.length, 2);

      const cards = items.map(it => {
        const accent = it.color || 'var(--blue)';
        const statCells = (it.stats || []).map(s => `
          <div style="background:var(--bg1);padding:16px 18px">
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:9px;color:var(--txt3);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:7px">${s.label}</div>
            <div style="font-family:var(--sa-font-display,serif);font-size:26px;font-weight:600;letter-spacing:-0.02em;color:${s.highlight ? accent : 'var(--head)'}">${s.value}</div>
          </div>`).join('');

        const chipRow = (it.chips || []).map(c => {
          const cc = c.dir === 'up' ? 'var(--green)' : c.dir === 'dn' ? 'var(--sa-warn,var(--yellow))' : 'var(--txt2)';
          const bc = c.dir === 'up' ? 'rgba(16,185,129,0.25)' : c.dir === 'dn' ? 'rgba(255,107,53,0.25)' : 'var(--border)';
          return `<span style="font-family:var(--sa-font-mono,var(--mono));font-size:10px;padding:3px 8px;border:1px solid ${bc};border-radius:3px;color:${cc}">${c.label}</span>`;
        }).join('');

        return `
          <div style="background:var(--bg1);border:1px solid var(--border);border-top:3px solid ${accent};padding:32px;overflow:hidden">
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:${accent};margin-bottom:10px">${it.eyebrow}</div>
            <div style="font-family:var(--sa-font-display,serif);font-size:26px;font-weight:500;letter-spacing:-0.02em;margin-bottom:4px;color:var(--head)">${it.heading}</div>
            <div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:var(--txt2);margin-bottom:20px;letter-spacing:0.1em">${it.sub || ''}</div>
            ${statCells ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);margin-bottom:20px">${statCells}</div>` : ''}
            <div style="font-size:13px;color:var(--txt2);line-height:1.6;margin-bottom:${chipRow ? '14px' : '0'}">${it.body || ''}</div>
            ${chipRow ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${chipRow}</div>` : ''}
          </div>`;
      }).join('');

      this.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:20px;margin-bottom:36px">
          ${cards}
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 6: sa-sticky-nav
     Sticky top navigation bar: serif logo + accent highlight,
     mono meta labels, pulsing live indicator.

     Attrs:
       brand="MIDTERM CYCLE"    full brand text
       brand-em="CYCLE"         substring to accent-color
       meta="Vol. 02 | ..."     pipe-separated meta labels
       live="Live label"        text after pulsing dot (optional)
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-sticky-nav', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const brand   = this.getAttribute('brand')    || '';
      const brandEm = this.getAttribute('brand-em') || '';
      const meta    = this.getAttribute('meta')     || '';
      const live    = this.getAttribute('live')     || '';

      let brandHtml = brand;
      if (brandEm) brandHtml = brand.replace(brandEm,
        `<span style="color:var(--sa-accent,var(--blue))">${brandEm}</span>`);

      const metaItems = meta.split('|').filter(Boolean).map(m =>
        `<span style="margin:0 16px">${m.trim()}</span>`).join('');

      const liveHtml = live ? `
        <span style="display:inline-flex;align-items:center;gap:6px">
          <span style="width:7px;height:7px;border-radius:50%;background:var(--sa-accent,var(--green));display:inline-block;animation:sa-pulse 2s infinite"></span>
          ${live}
        </span>` : '';

      const id = 'sa-nav-' + Math.random().toString(36).slice(2);

      /* inject pulse keyframes once */
      if (!document.getElementById('sa-pulse-kf')) {
        const kf = document.createElement('style');
        kf.id = 'sa-pulse-kf';
        kf.textContent = `@keyframes sa-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`;
        document.head.appendChild(kf);
      }

      this.innerHTML = `
        <header id="${id}" style="
          border-bottom:1px solid var(--border);
          padding:20px 48px;
          display:flex;justify-content:space-between;align-items:center;
          position:sticky;top:0;
          background:rgba(7,17,31,0.93);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          z-index:50;">
          <div style="font-family:var(--sa-font-display,serif);font-weight:800;font-size:21px;letter-spacing:-0.02em;color:var(--head)">${brandHtml}</div>
          <div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.15em;display:flex;align-items:center">
            ${metaItems}${liveHtml}
          </div>
        </header>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 7: sa-tag-pill
     Inline tone-colored status chip. Mono uppercase text,
     colored background/foreground by tone.

     Attrs:
       tone="strong|soft|weak|neut|bull|ok|warn|crit|neutral"
     Slot: chip label text
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-tag-pill', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const tone = this.getAttribute('tone') || 'neutral';
      const color = _toneColor(tone);
      const bg = _pillBg(tone);
      const label = this.textContent.trim();
      this.innerHTML = `
        <span style="
          font-family:var(--sa-font-mono,var(--mono));
          font-size:9px;text-transform:uppercase;
          letter-spacing:0.15em;padding:4px 10px;
          border-radius:3px;display:inline-block;
          font-weight:600;background:${bg};color:${color}">${label}</span>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 8: sa-data-chip-row
     Wrapping row of year/label chips with directional color.

     Data: window[data] → array of {label, value?, dir}
     dir: 'up' | 'dn' | 'neutral'
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-data-chip-row', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const chips = window[key] || [];

      const html = chips.map(c => {
        const cc = c.dir === 'up'
          ? 'var(--sa-accent,var(--green))'
          : c.dir === 'dn'
            ? 'var(--sa-warn,var(--yellow))'
            : 'var(--txt2)';
        const bc = c.dir === 'up'
          ? 'rgba(16,185,129,0.28)'
          : c.dir === 'dn'
            ? 'rgba(255,107,53,0.28)'
            : 'var(--border)';
        const txt = c.value ? `${c.label} ${c.value}` : c.label;
        return `<span style="font-family:var(--sa-font-mono,var(--mono));font-size:10px;padding:4px 9px;border:1px solid ${bc};border-radius:3px;color:${cc};white-space:nowrap">${txt}</span>`;
      }).join('');

      this.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin:14px 0">${html}</div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 9: sa-callout-box
     Large editorial callout block with serif heading,
     multi-paragraph prose, gradient tint by tone, and
     a decorative icon in the top-right corner.

     NOTE: This is distinct from the v3 <sa-callout> verdict
     chip. The v3 sa-callout still works unchanged.

     Attrs:
       tone="default|warn"   default = accent-green, warn = red
       title="The signal..."
     Slot: prose content (HTML allowed)
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-callout-box', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const tone   = this.getAttribute('tone') || 'default';
      const title  = this.getAttribute('title') || '';
      const inner  = this.innerHTML;

      const isWarn  = tone === 'warn';
      const bg      = isWarn
        ? 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(245,158,11,0.04))'
        : 'linear-gradient(135deg,rgba(16,185,129,0.07),rgba(59,130,246,0.03))';
      const border  = isWarn ? 'var(--red)' : 'var(--sa-accent,var(--green))';
      const hColor  = isWarn ? 'var(--red)'  : 'var(--sa-accent,var(--green))';
      const icon    = isWarn ? '⚠' : '⬆';

      this.innerHTML = `
        <div style="
          background:${bg};
          border:1px solid ${border};
          padding:28px 32px;
          margin-top:28px;
          position:relative;
          overflow:hidden">
          <span style="position:absolute;top:20px;right:28px;font-size:28px;color:${border};opacity:0.25">${icon}</span>
          ${title ? `<h4 style="font-family:var(--sa-font-display,serif);font-size:21px;font-weight:600;margin:0 0 10px;color:${hColor}">${title}</h4>` : ''}
          <div style="font-size:13px;color:var(--txt);line-height:1.72">${inner}</div>
        </div>`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 NEW COMPONENT 10: sa-ambient-bg
     Fixed decorative background layer: SVG noise grain
     + radial gradient accent glows. Zero content.

     Attrs:
       grain="true|false"     enable noise texture (default true)
       accent-x="20"          % x position of first glow
       accent-y="10"          % y position of first glow
       color="accent CSS var" glow color override
     ════════════════════════════════════════════════════════ */
  customElements.define('sa-ambient-bg', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const grain   = this.getAttribute('grain') !== 'false';
      const ax      = this.getAttribute('accent-x') || '20';
      const ay      = this.getAttribute('accent-y') || '10';
      const color   = this.getAttribute('color')    || 'rgba(16,185,129,0.04)';
      const color2  = this.getAttribute('color2')   || 'rgba(245,158,11,0.03)';

      const noiseUri = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

      this.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0';
      this.innerHTML = `
        <div style="position:absolute;inset:0;background:
          radial-gradient(circle at ${ax}% ${ay}%,${color} 0%,transparent 40%),
          radial-gradient(circle at 80% 80%,${color2} 0%,transparent 40%);
          background-attachment:fixed"></div>
        ${grain ? `<div style="position:absolute;inset:0;opacity:0.04;background-image:url('${noiseUri}');pointer-events:none"></div>` : ''}`;
    }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v4 UPGRADE: sa-verdict-chip
     Canonical name for the v3 sa-callout verdict chip.
     Identical logic. sa-callout preserved as alias.
     ════════════════════════════════════════════════════════ */
  function _verdictChipImpl(el) {
    _injectCSS();
    const type = el.getAttribute('type') || 'yellow';
    const title = el.getAttribute('title') || '';
    const inner = el.innerHTML;
    const colors = {
      green:  ['var(--green)',  'rgba(16,185,129,0.12)'],
      yellow: ['var(--yellow)', 'rgba(245,158,11,0.12)'],
      red:    ['var(--red)',    'rgba(239,68,68,0.12)'],
      blue:   ['var(--blue)',   'rgba(59,130,246,0.12)']
    };
    const [c, bg] = colors[type] || colors.yellow;
    el.innerHTML = `
      <div style="background:${bg};border-left:3px solid ${c};padding:14px 18px;margin:12px 0;border-radius:0 6px 6px 0">
        ${title ? `<div style="font-weight:600;color:${c};margin-bottom:4px;font-size:13px">${title}</div>` : ''}
        <div style="color:var(--txt);font-size:13px;line-height:1.6">${inner}</div>
      </div>`;
  }

  customElements.define('sa-verdict-chip', class extends HTMLElement {
    connectedCallback() { _verdictChipImpl(this); }
  });

  /* ════════════════════════════════════════════════════════
     ▌ v3 COMPONENTS — All preserved unchanged.
     Listed here in definition order.
     Inline CSS pattern _injectCSS() → this.innerHTML.
     ════════════════════════════════════════════════════════ */

  /* v3: sa-hero ─────────────────────────────────────────── */
  customElements.define('sa-hero', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const D = window.SA_DATA || {};
      const vColors = { undervalued:'var(--green)', fair:'var(--yellow)', overvalued:'var(--red)' };
      const vc = vColors[D.verdict] || 'var(--yellow)';
      const stats = (D.stats || []).map(s =>
        `<div style="padding:14px 18px;border-right:1px solid var(--border)">
          <div style="font-size:11px;color:var(--txt2);margin-bottom:4px">${s.label}</div>
          <div style="font-weight:600;color:${s.color||'var(--head)'};font-size:15px">${s.value}</div>
        </div>`).join('');
      const changeColor = (D.change_pct||'').startsWith('-') ? 'var(--red)' : 'var(--green)';
      this.innerHTML = `
        <div style="background:var(--bg1);border-bottom:1px solid var(--border);padding:28px 32px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
            <div>
              <div style="font-size:12px;color:var(--txt2);margin-bottom:4px">${D.sector||''} · ${D.industry||''}</div>
              <div style="font-size:28px;font-weight:700;color:var(--head);margin-bottom:2px">${D.ticker||''} — ${D.name||''}</div>
              <div style="font-size:13px;color:var(--txt2)">As of ${D.asof||''}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:40px;font-weight:700;color:var(--head)">$${D.price||''}</div>
              <div style="font-size:18px;color:${changeColor}">${D.change_dollar||''} (${D.change_pct||''}%)</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;border-top:1px solid var(--border);margin-top:16px">${stats}</div>
          <div style="margin-top:16px;padding:12px 16px;background:${vc}20;border-left:3px solid ${vc};border-radius:0 6px 6px 0">
            <div style="font-weight:600;color:${vc}">${D.verdict_text||''}</div>
            <div style="font-size:13px;color:var(--txt2);margin-top:4px">6-Month Range: $${D.range_low||''} — $${D.range_mid||''} — $${D.range_high||''}</div>
          </div>
        </div>`;
    }
  });

  /* v3: sa-page-header ──────────────────────────────────── */
  customElements.define('sa-page-header', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || 'PAGE_HEADER';
      const D = window[key] || {};
      const bColors = { blue:'var(--blue)', green:'var(--green)', red:'var(--red)', yellow:'var(--yellow)' };
      const bc = bColors[(D.badge||{}).color] || 'var(--blue)';
      const stats = (D.stats||[]).map(s => {
        const tc = s.trendDir==='up'?'var(--green)':s.trendDir==='down'?'var(--red)':'var(--txt2)';
        return `<div style="padding:14px 18px;border-right:1px solid var(--border)">
          <div style="font-size:11px;color:var(--txt2);margin-bottom:4px">${s.label}</div>
          <div style="font-weight:600;color:${s.color?`var(--${s.color})`:'var(--head)'};font-size:16px">${s.value}</div>
          ${s.trend?`<div style="font-size:12px;color:${tc}">${s.trend}</div>`:''}
        </div>`;
      }).join('');
      this.innerHTML = `
        <div style="background:var(--bg1);border-bottom:1px solid var(--border);padding:24px 32px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
            <div>
              ${D.badge?`<span style="background:${bc}20;color:${bc};font-size:11px;padding:3px 10px;border-radius:4px;font-weight:600;letter-spacing:0.05em">${D.badge.text}</span>`:''}
              <div style="font-size:26px;font-weight:700;color:var(--head);margin:8px 0 4px">${D.title||''}</div>
              <div style="font-size:14px;color:var(--txt2)">${D.subtitle||''}</div>
            </div>
            <div style="font-size:12px;color:var(--txt2);text-align:right">${D.meta||''}</div>
          </div>
          ${stats?`<div style="display:flex;flex-wrap:wrap;border-top:1px solid var(--border);margin-top:16px">${stats}</div>`:''}
        </div>`;
    }
  });

  /* v3: sa-stat-grid ────────────────────────────────────── */
  customElements.define('sa-stat-grid', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const items = window[key] || [];
      const cols = this.getAttribute('cols') || Math.min(items.length, 4);
      const html = items.map(s => `
        <div style="background:var(--bg1);border:1px solid var(--border);padding:18px 20px">
          <div style="font-size:11px;color:var(--txt2);margin-bottom:8px">${s.label}</div>
          <div style="font-size:24px;font-weight:700;color:${s.color||'var(--head)'};">${s.value}</div>
          ${s.sub?`<div style="font-size:12px;color:var(--txt2);margin-top:4px">${s.sub}</div>`:''}
        </div>`).join('');
      this.innerHTML = `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px;margin:8px 0">${html}</div>`;
    }
  });

  /* v3: sa-table (UPGRADED v4: cell tone + serif first-col) */
  customElements.define('sa-table', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key  = this.getAttribute('data') || '';
      const D    = window[key] || {};
      const head = D.head  || [];
      const rows = D.rows  || [];
      const cls  = D.classes || [];
      const source = D.source || '';
      const serifFirst = this.getAttribute('serif-first') !== null;

      /* v4 tone→color for td class or per-cell tone field */
      function _cellColor(c) {
        if (!c) return '';
        if (c.includes('pos'))    return `color:var(--green)`;
        if (c.includes('neg'))    return `color:var(--red)`;
        if (c.includes('warn'))   return `color:var(--yellow)`;
        if (c.includes('bull'))   return `color:var(--sa-tone-bull,var(--green))`;
        if (c.includes('ok'))     return `color:var(--sa-tone-ok,var(--green))`;
        if (c.includes('crit'))   return `color:var(--sa-tone-crit,var(--red))`;
        if (c.includes('green'))  return `color:var(--green)`;
        if (c.includes('red'))    return `color:var(--red)`;
        if (c.includes('amber'))  return `color:var(--sa-gold,var(--yellow))`;
        return '';
      }

      const ths = head.map(h =>
        `<th style="padding:12px 16px;font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.15em;font-weight:500;border-bottom:1px solid var(--border);text-align:left">${h}</th>`
      ).join('');

      const trs = rows.map(r => {
        const cells = r.map((cell, ci) => {
          const c = cls[ci] || '';
          const isNum = c.includes('num');
          const color = _cellColor(c);
          const isFirst = ci === 0;
          const fontStyle = isFirst && serifFirst
            ? `font-family:var(--sa-font-display,serif);font-weight:600;font-size:14px`
            : isNum
              ? `text-align:right;font-family:var(--sa-font-mono,var(--mono));font-size:12px;font-weight:500`
              : `font-size:13px`;
          /* v4: support array cell with {value, tone} */
          let val = cell;
          let extraColor = '';
          if (cell && typeof cell === 'object') {
            val = cell.value;
            extraColor = `color:${_toneColor(cell.tone)}`;
          }
          return `<td style="padding:12px 16px;border-bottom:1px solid var(--border);${fontStyle};${color};${extraColor};color:${color?'':'var(--txt)'}">${val}</td>`;
        }).join('');
        return `<tr style="transition:background 0.15s" onmouseenter="this.style.background='var(--bg2)'" onmouseleave="this.style.background=''">${cells}</tr>`;
      }).join('');

      this.innerHTML = `
        <div style="overflow-x:auto;border:1px solid var(--border)">
          <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:600px">
            <thead style="background:var(--bg2)"><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
          ${source?`<div style="padding:8px 16px;font-size:11px;color:var(--txt3);border-top:1px solid var(--border)">Source: ${source}</div>`:''}
        </div>`;
    }
  });

  /* v3: sa-chart-card (UPGRADED v4: subtitle + span="full") */
  customElements.define('sa-chart-card', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const title    = this.getAttribute('title')    || '';
      const subtitle = this.getAttribute('subtitle') || '';
      const height   = this.getAttribute('height')   || '360';
      const span     = this.getAttribute('span');
      const inner    = this.innerHTML;
      const spanStyle = span === 'full' ? 'grid-column:1/-1' : '';

      this.style.cssText = spanStyle;
      this.innerHTML = `
        <div style="background:var(--bg1);border:1px solid var(--border);padding:24px;${spanStyle}">
          ${title ? `<div style="font-family:var(--sa-font-display,serif);font-size:20px;font-weight:500;margin-bottom:${subtitle?'3px':'20px'};letter-spacing:-0.01em;color:var(--head)">${title}</div>` : ''}
          ${subtitle ? `<div style="font-family:var(--sa-font-mono,var(--mono));font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:20px">${subtitle}</div>` : ''}
          <div style="height:${height}px;position:relative">${inner}</div>
        </div>`;
    }
  });

  /* v3: sa-feature-box ──────────────────────────────────── */
  customElements.define('sa-feature-box', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const items = window[key];
      if (items && Array.isArray(items)) {
        this.innerHTML = items.map(it => `
          <div style="background:linear-gradient(135deg,var(--bg2),var(--bg1));border:1px solid var(--border);border-radius:8px;padding:20px 24px;margin-bottom:12px">
            ${it.icon?`<div style="font-size:24px;margin-bottom:8px">${it.icon}</div>`:''}
            <div style="font-weight:600;color:var(--head);margin-bottom:6px">${it.title||''}</div>
            <div style="font-size:13px;color:var(--txt2);line-height:1.6">${it.body||''}</div>
          </div>`).join('');
      } else {
        const icon  = this.getAttribute('icon')  || '';
        const title = this.getAttribute('title') || '';
        this.innerHTML = `
          <div style="background:linear-gradient(135deg,var(--bg2),var(--bg1));border:1px solid var(--border);border-radius:8px;padding:20px 24px">
            ${icon?`<div style="font-size:24px;margin-bottom:8px">${icon}</div>`:''}
            ${title?`<div style="font-weight:600;color:var(--head);margin-bottom:6px">${title}</div>`:''}
            <div style="font-size:13px;color:var(--txt2);line-height:1.6">${this.innerHTML}</div>
          </div>`;
      }
    }
  });

  /* v3: sa-grid ─────────────────────────────────────────── */
  customElements.define('sa-grid', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const layout = this.getAttribute('layout') || '2col';
      const gap = this.getAttribute('gap') || '20px';
      const grids = { '2col':'1fr 1fr', '3col':'1fr 1fr 1fr', 'sidebar':'320px 1fr' };
      const cols = grids[layout] || '1fr 1fr';
      this.style.cssText = `display:grid;grid-template-columns:${cols};gap:${gap};margin:12px 0`;
    }
  });

  /* v3: sa-callout (preserved, also aliased as sa-verdict-chip) */
  customElements.define('sa-callout', class extends HTMLElement {
    connectedCallback() { _verdictChipImpl(this); }
  });

  /* v3: sa-card ─────────────────────────────────────────── */
  customElements.define('sa-card', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const title  = this.getAttribute('title')  || '';
      const accent = this.getAttribute('accent') || 'blue';
      const aColor = { blue:'var(--blue)', green:'var(--green)', red:'var(--red)', yellow:'var(--yellow)' }[accent] || 'var(--blue)';
      const inner  = this.innerHTML;
      this.innerHTML = `
        <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:20px 24px;border-top:2px solid ${aColor}">
          ${title?`<div style="font-weight:600;color:var(--head);margin-bottom:14px;font-size:16px">${title}</div>`:''}
          ${inner}
        </div>`;
    }
  });

  /* v3: sa-banner ───────────────────────────────────────── */
  customElements.define('sa-banner', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const type  = this.getAttribute('type')  || 'info';
      const label = this.getAttribute('label') || '';
      const title = this.getAttribute('title') || '';
      const inner = this.innerHTML;
      const colors = { breaking:'var(--red)', warning:'var(--yellow)', info:'var(--blue)', success:'var(--green)' };
      const c = colors[type] || colors.info;
      this.innerHTML = `
        <div style="background:${c}15;border-left:4px solid ${c};padding:14px 20px;display:flex;align-items:flex-start;gap:12px;margin-bottom:20px">
          ${label?`<span style="font-weight:700;color:${c};font-size:12px;white-space:nowrap">${label}</span>`:''}
          <div><div style="font-weight:600;color:var(--head);font-size:14px">${title}</div>
          <div style="font-size:13px;color:var(--txt2);margin-top:3px">${inner}</div></div>
        </div>`;
    }
  });

  /* v3: sa-section ──────────────────────────────────────── */
  customElements.define('sa-section', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const title  = this.getAttribute('title')  || '';
      const icon   = this.getAttribute('icon')   || '';
      const accent = this.getAttribute('accent') || 'blue';
      const inner  = this.innerHTML;
      const aColor = { blue:'var(--blue)', green:'var(--green)', red:'var(--red)', yellow:'var(--yellow)' }[accent] || 'var(--blue)';
      this.innerHTML = `
        <div style="margin:20px 0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)">
            ${icon?`<span style="font-size:18px">${icon}</span>`:''}
            <span style="font-weight:600;color:${aColor};font-size:16px">${title}</span>
          </div>
          <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:20px">${inner}</div>
        </div>`;
    }
  });

  /* v3: sa-ratio-grid ───────────────────────────────────── */
  customElements.define('sa-ratio-grid', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const ratios = window[key] || [];
      const sColors = { rich:'var(--red)', fair:'var(--yellow)', cheap:'var(--green)' };
      const html = ratios.map(r => {
        const c = sColors[r.sentiment] || 'var(--txt)';
        return `
          <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:16px;border-top:2px solid ${c}">
            <div style="font-size:12px;color:var(--txt2);margin-bottom:4px">${r.name}</div>
            <div style="font-size:22px;font-weight:700;color:${c}">${r.value}</div>
            <div style="font-size:12px;color:var(--txt3);margin-top:4px">${r.bench||''}</div>
            <div style="font-size:12px;color:var(--txt2);margin-top:6px">${r.interp||''}</div>
          </div>`;
      }).join('');
      this.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin:8px 0">${html}</div>`;
    }
  });

  /* v3: sa-indicators ───────────────────────────────────── */
  customElements.define('sa-indicators', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const items = window[key] || [];
      const sColors = { green:'var(--green)', red:'var(--red)', yellow:'var(--yellow)', gray:'var(--txt2)' };
      const rows = items.map(it => {
        const c = sColors[it.sentiment] || 'var(--txt2)';
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border)">
            <div style="font-size:13px;color:var(--txt2)">${it.label}</div>
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-weight:600;color:var(--head)">${it.value}</span>
              <span style="background:${c}20;color:${c};font-size:11px;padding:2px 8px;border-radius:4px;font-weight:600">${it.pill||''}</span>
            </div>
          </div>`;
      }).join('');
      this.innerHTML = `<div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin:8px 0">${rows}</div>`;
    }
  });

  /* v3: sa-scenarios ────────────────────────────────────── */
  customElements.define('sa-scenarios', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const D = window[key] || {};
      const cases = [
        { key:'bull', label:'Bull Case', color:'var(--green)',  d: D.bull  || {} },
        { key:'base', label:'Base Case', color:'var(--yellow)', d: D.base  || {} },
        { key:'bear', label:'Bear Case', color:'var(--red)',    d: D.bear  || {} }
      ];
      const cols = cases.map(c => `
        <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:20px;border-top:3px solid ${c.color}">
          <div style="font-weight:700;color:${c.color};font-size:14px;margin-bottom:8px">${c.label}</div>
          <div style="font-size:22px;font-weight:700;color:var(--head);margin-bottom:4px">${c.d.prob||''}</div>
          <div style="font-size:14px;color:${c.color};font-weight:600;margin-bottom:10px">${c.d.price_range||''}</div>
          <div style="font-size:13px;color:var(--txt2);line-height:1.55">${c.d.drivers||''}</div>
        </div>`).join('');
      this.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin:8px 0">${cols}</div>`;
    }
  });

  /* v3: sa-entry-points ─────────────────────────────────── */
  customElements.define('sa-entry-points', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const D = window[key] || {};
      const tiers = [
        { k:'aggressive',   label:'Aggressive',   color:'var(--red)'    },
        { k:'moderate',     label:'Moderate',     color:'var(--yellow)' },
        { k:'conservative', label:'Conservative', color:'var(--green)'  }
      ];
      const html = tiers.map(t => {
        const d = D[t.k] || {};
        return `
          <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:18px 20px;border-left:3px solid ${t.color}">
            <div style="font-size:11px;color:var(--txt2);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.1em">${t.label}</div>
            <div style="font-size:20px;font-weight:700;color:${t.color};margin-bottom:6px">${d.price||''}</div>
            <div style="font-size:13px;color:var(--txt2)">${d.condition||''}</div>
          </div>`;
      }).join('');
      this.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin:8px 0">${html}</div>`;
    }
  });

  /* v3: sa-premortem ────────────────────────────────────── */
  customElements.define('sa-premortem', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const D = window[key] || {};
      const probC = { High:'var(--red)', Medium:'var(--yellow)', Low:'var(--green)' };
      const rows = (D.risks||[]).map(r => `
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:var(--txt);border-bottom:1px solid var(--border)">${r.failure||''}</td>
          <td style="padding:12px 16px;border-bottom:1px solid var(--border)"><span style="color:${probC[r.probability]||'var(--txt2)'};font-weight:600;font-size:13px">${r.probability||''}</span></td>
          <td style="padding:12px 16px;font-size:13px;color:var(--txt2);border-bottom:1px solid var(--border)">${r.impact||''}</td>
          <td style="padding:12px 16px;font-size:13px;color:var(--txt2);border-bottom:1px solid var(--border)">${r.narrative||''}</td>
        </tr>`).join('');
      this.innerHTML = `
        <div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin:8px 0">
          <table style="width:100%;border-collapse:collapse">
            <thead style="background:var(--bg2)">
              <tr>
                ${['Failure Mode','Probability','Impact','Narrative'].map(h =>
                  `<th style="padding:10px 16px;font-size:11px;color:var(--txt2);text-transform:uppercase;letter-spacing:0.12em;text-align:left;font-weight:500;border-bottom:1px solid var(--border)">${h}</th>`
                ).join('')}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          ${D.implications?`<div style="padding:12px 16px;background:var(--yellow)15;border-top:1px solid var(--border);font-size:13px;color:var(--txt2)">Implications: ${D.implications}</div>`:''}
        </div>`;
    }
  });

  /* v3: sa-timeline ─────────────────────────────────────── */
  customElements.define('sa-timeline', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const key = this.getAttribute('data') || '';
      const events = window[key] || [];
      const typeColors = { catalyst:'var(--blue)', risk:'var(--red)', event:'var(--yellow)', milestone:'var(--green)' };
      const html = events.map((e, i) => `
        <div style="display:flex;gap:16px;padding:14px 0;border-bottom:${i<events.length-1?'1px solid var(--border)':'none'}">
          <div style="min-width:48px;font-size:11px;color:var(--txt3);padding-top:2px">${e.date||''}</div>
          <div style="width:3px;background:${typeColors[e.type]||'var(--blue)'};border-radius:2px;flex-shrink:0"></div>
          <div>
            <div style="font-weight:600;color:var(--head);font-size:14px">${e.title||''}</div>
            <div style="font-size:13px;color:var(--txt2);margin-top:3px">${e.desc||''}</div>
          </div>
        </div>`).join('');
      this.innerHTML = `<div style="background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:6px 16px;margin:8px 0">${html}</div>`;
    }
  });

  /* v3: sa-scenarios → sa-callout already defined */

  /* v3: sa-footer ───────────────────────────────────────── */
  customElements.define('sa-footer', class extends HTMLElement {
    connectedCallback() {
      _injectCSS();
      const ticker  = this.getAttribute('ticker')  || '';
      const date    = this.getAttribute('date')    || '';
      const sources = this.getAttribute('sources') || '';
      this.innerHTML = `
        <div style="margin-top:32px;padding:24px 32px;border-top:1px solid var(--border);font-size:11px;color:var(--txt3);line-height:1.7">
          <div style="margin-bottom:6px;font-weight:600;color:var(--txt2)">DISCLAIMER</div>
          <div>This report is for informational purposes only and does not constitute investment advice. Past performance is not indicative of future results. All data as of ${date}. ${ticker?`Ticker: ${ticker}.`:''}</div>
          ${sources?`<div style="margin-top:8px">Sources: ${sources}</div>`:''}
        </div>`;
    }
  });

  /* ── CSS Utility Classes (v3 preserved) ── */
  const utilCSS = `
    .g2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
    .g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .pos { color:var(--green); }
    .neg { color:var(--red); }
    .warn { color:var(--yellow); }
    .info { color:var(--blue); }
    td.num { text-align:right; font-family:var(--mono); font-size:12px; font-weight:500; }
    td.num.pos { color:var(--green); }
    td.num.neg { color:var(--red); }
    td.num.warn { color:var(--yellow); }
    .sa-list { list-style:none; padding:0; }
    .sa-list li { padding:6px 0; border-bottom:1px solid var(--border); font-size:13px; color:var(--txt2); }
    .sa-list li::before { content:'›'; color:var(--blue); margin-right:8px; }
    .sa-src { font-size:11px; color:var(--txt3); margin-top:6px; font-style:italic; }
    .sa-h2 { font-size:16px; font-weight:700; color:var(--head); margin:24px 0 12px;
             padding-bottom:8px; border-bottom:1px solid var(--border); }
    /* v4 additions */
    .sa-section { padding:64px 48px; border-bottom:1px solid var(--sa-line,var(--border)); }
    .sa-chart-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:32px; }
    .sa-chart-grid > [span='full'] { grid-column:1/-1; }
    @media(max-width:800px) {
      .g2,.g3,.g4,.sa-chart-grid { grid-template-columns:1fr; }
      sa-editorial-hero div[style*='grid-template-columns:repeat(4'] { grid-template-columns:1fr 1fr!important; }
      sa-phase-cards div { grid-template-columns:1fr!important; }
      sa-compare-cards div { grid-template-columns:1fr!important; }
      .sa-section { padding:48px 24px!important; }
    }
  `;
  const us = document.createElement('style');
  us.textContent = utilCSS;
  document.head.appendChild(us);

})();

/* ─────────────────────────────────────────────────────────
   sa-components-v4.js  ·  End of file
   v4.0 | May 2026
   40 core components (19 v3 + 9 new v4 + 12 plugin separately)
   Backward compatible with all v3.0 reports
───────────────────────────────────────────────────────── */
