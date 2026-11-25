// ==UserScript==
// @name         Flow Tools Manager (TechGyro)
// @namespace    https://portfolio.agenticframework.in/flow-tools/
// @version      2.1
// @description  List and card views for Google Flow's Tools page: one row per tool, versions collapsed underneath, hover details, action buttons, search, stars, filters and sorting. Only changes how the page looks on your computer.
// @author       TechGyro
// @homepageURL  https://github.com/karthikkrishnaswamysr/aio-story-pipeline-skills#google-flow-tools-manager-userscript
// @downloadURL  https://github.com/karthikkrishnaswamysr/aio-story-pipeline-skills/raw/main/userscripts/flow-tools-manager.user.js
// @updateURL    https://github.com/karthikkrishnaswamysr/aio-story-pipeline-skills/raw/main/userscripts/flow-tools-manager.user.js
// @match        https://flow.google.com/*
// @match        https://labs.google/fx/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';
  if (window.__tgfoLoaded) return;
  window.__tgfoLoaded = true;

  // ---------- settings (saved in this browser) ----------
  const KEY = 'tgFlowOrganizer.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const S = Object.assign({ view: 'list', q: '', latestOnly: true, hideRemix: false, who: 'all', sort: 'recent', stars: {}, open: {}, collapsedSec: {} }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // ---------- name parsing ----------
  // "Remix of Moto Forge 1.13"        -> family "Moto Forge", version "1.13", remix
  // "AIO Story Pipeline 5.4 - Booster" -> family "AIO Story Pipeline", version "5.4", tag "Booster"
  function parse(raw) {
    let name = raw.replace(/\s+/g, ' ').trim();
    let remix = false;
    if (/^remix of /i.test(name)) { remix = true; name = name.replace(/^remix of /i, ''); }
    const m = name.match(/^(.*?)[\s_-]+v?(\d+(?:\.\d+)*)([\s_-].*|_\w+)?$/i);
    let family = name, version = '', tag = '';
    if (m && m[1].length > 1) { family = m[1]; version = m[2]; tag = (m[3] || '').replace(/^[\s_-]+/, ''); }
    family = family.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
    return { family, version, tag, remix, key: family.toLowerCase() };
  }
  function cmpVer(a, b) { // newest first
    const pa = (a || '0').split('.').map(Number), pb = (b || '0').split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const x = pa[i] || 0, y = pb[i] || 0;
      if (x !== y) return y - x;
    }
    return 0;
  }

  // Flow enforces Trusted Types, so DOM nodes are built directly (no innerHTML)
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null) continue;
      if (k === 'class') e.className = v;
      else if (k.startsWith('data-') || k === 'title' || k === 'colspan') e.setAttribute(k, v);
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e[k] = v;
    }
    kids.flat().forEach(k => { if (k != null && k !== false) e.append(k); });
    return e;
  }

  // ---------- styles ----------
  const css = `
  #tgfo-bar{position:sticky;top:0;z-index:20;display:flex;flex-wrap:wrap;gap:10px;align-items:center;
    margin:0 0 18px;padding:12px 14px;border-radius:16px;background:rgba(28,28,32,.94);backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,.08);font-family:"Google Sans",Roboto,sans-serif;color:#e3e3e3}
  #tgfo-bar input[type=search]{flex:1 1 220px;min-width:180px;background:#111;border:1px solid #3a3a40;color:#eee;
    border-radius:10px;padding:9px 12px;font-size:14px;outline:none}
  #tgfo-bar input[type=search]:focus{border-color:#ffb347}
  .tgfo-seg{display:flex;background:#111;border:1px solid #3a3a40;border-radius:10px;overflow:hidden}
  .tgfo-seg button,.tgfo-btn{background:transparent;border:0;color:#bbb;padding:8px 11px;font:inherit;font-size:13px;cursor:pointer}
  .tgfo-seg button.on{background:#ffb347;color:#1a1205;font-weight:600}
  .tgfo-btn{border:1px solid #3a3a40;border-radius:10px;background:#111}
  .tgfo-btn.on{border-color:#ffb347;color:#ffb347}
  #tgfo-count{font-size:12px;color:#999;margin-left:auto;white-space:nowrap}

  /* card view extras */
  .tgfo-badges{position:absolute;top:8px;left:8px;right:8px;display:flex;gap:6px;align-items:flex-start;z-index:5;pointer-events:none}
  .tgfo-chip{pointer-events:auto;font:600 11px "Google Sans",Roboto,sans-serif;padding:3px 8px;border-radius:999px;
    background:rgba(0,0,0,.72);color:#fff;border:1px solid rgba(255,255,255,.18);white-space:nowrap}
  .tgfo-chip.latest{background:#ffb347;color:#1a1205;border-color:#ffb347}
  .tgfo-chip.remix{background:rgba(120,120,255,.25)}
  .tgfo-more{cursor:pointer}
  .tgfo-more:hover{background:#fff;color:#000}
  .tgfo-star{margin-left:auto;cursor:pointer;font-size:15px;line-height:1;padding:3px 7px}
  .tgfo-star.on{color:#ffcc33;border-color:#ffcc33}
  [data-tgfo="older"] .applet-card{opacity:.72;outline:1px dashed rgba(255,179,71,.45);outline-offset:4px;border-radius:12px}
  [data-tgfo="starred"] .applet-card{outline:2px solid rgba(255,204,51,.7);outline-offset:4px;border-radius:12px}

  /* list view */
  #tgfo-list{font-family:"Google Sans",Roboto,sans-serif;color:#e3e3e3;margin-bottom:40px}
  .tgfo-sec{margin:0 0 26px}
  .tgfo-sech{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:500;margin:6px 0 10px;cursor:pointer;user-select:none}
  .tgfo-sech small{font-size:12px;color:#999;font-weight:400}
  .tgfo-sech .car{font-size:14px;color:#888;width:14px}
  table.tgfo-t{width:100%;border-collapse:separate;border-spacing:0;font-size:13.5px;table-layout:fixed}
  .tgfo-t th{position:sticky;top:var(--tgfo-bh,0px);z-index:2;text-align:left;font-weight:500;font-size:12px;color:#9a9aa5;padding:8px 10px;
    border-bottom:1px solid #2c2c33;background:#0d0d10}
  .tgfo-t td{padding:7px 10px;border-bottom:1px solid #1f1f25;vertical-align:middle;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .tgfo-t tr.fam:hover td,.tgfo-t tr.ver:hover td{background:#17171c}
  .tgfo-t tr.ver td{background:#0f0f13;color:#c9c9d1}
  .tgfo-t tr.ver td.name{padding-left:34px}
  .tgfo-t tr.starred td:first-child{box-shadow:inset 3px 0 0 #ffcc33}
  .tgfo-t .name{font-weight:500;color:#f1f1f4;white-space:normal;line-height:1.3}
  .tgfo-t .name .fam-n{cursor:pointer}
  .tgfo-t .desc{color:#9d9da8}
  .tgfo-t .muted{color:#888}
  .tgfo-thumb{width:34px;height:34px;border-radius:8px;object-fit:cover;background:#222;display:block}
  .tgfo-t td:nth-child(2){padding:7px 0}
  .tgfo-tog{cursor:pointer;color:#aaa;width:22px;text-align:center;font-size:12px;border-radius:6px;padding:2px 0}
  .tgfo-tog:hover{background:#2a2a31;color:#fff}
  .tgfo-vchip{display:inline-block;font:600 11px "Google Sans",Roboto,sans-serif;padding:2px 7px;border-radius:999px;margin-left:6px;
    background:#ffb347;color:#1a1205;vertical-align:1px}
  .tgfo-vchip.old{background:#2a2a31;color:#ddd}
  .tgfo-vchip.rx{background:rgba(120,120,255,.25);color:#dde}
  .tgfo-count-pill{display:inline-block;min-width:22px;text-align:center;padding:2px 8px;border-radius:999px;background:#1e1e24;color:#ccc;font-size:12px;cursor:pointer}
  .tgfo-count-pill:hover{background:#ffb347;color:#1a1205}
  .tgfo-acts{display:flex;gap:4px;justify-content:flex-end;flex-wrap:nowrap}
  .tgfo-a{border:1px solid #33333b;background:#141418;color:#ddd;border-radius:8px;padding:4px 8px;font:12px "Google Sans",Roboto,sans-serif;cursor:pointer;white-space:nowrap}
  .tgfo-a:hover{border-color:#ffb347;color:#ffb347}
  .tgfo-a.primary{background:#ffb347;color:#1a1205;border-color:#ffb347;font-weight:600}
  .tgfo-a.primary:hover{filter:brightness(1.08);color:#1a1205}
  .tgfo-a.danger:hover{border-color:#ff6b6b;color:#ff6b6b}
  .tgfo-t td.tgfo-starbtn{cursor:pointer;font-size:16px;color:#666;text-align:center;padding:7px 0;overflow:visible}
  .tgfo-t td.tgfo-starbtn:hover{color:#ffcc33}
  .tgfo-t td.tgfo-starbtn.on{color:#ffcc33}
  .tgfo-moremenu{position:fixed;z-index:10000;background:#1c1c21;border:1px solid #33333b;border-radius:12px;padding:6px;
    box-shadow:0 12px 30px rgba(0,0,0,.5);font:13px "Google Sans",Roboto,sans-serif;min-width:160px}
  .tgfo-moremenu div{padding:8px 12px;border-radius:8px;cursor:pointer;color:#e3e3e3}
  .tgfo-moremenu div:hover{background:#2a2a31}
  .tgfo-moremenu div.danger{color:#ff8a8a}
  #tgfo-tip{position:fixed;z-index:9999;width:320px;background:#1a1a1f;border:1px solid #33333b;border-radius:14px;
    box-shadow:0 16px 40px rgba(0,0,0,.55);font:13px/1.45 "Google Sans",Roboto,sans-serif;color:#e3e3e3;overflow:hidden;pointer-events:none}
  #tgfo-tip img{width:100%;height:170px;object-fit:cover;display:block;background:#222}
  #tgfo-tip .b{padding:12px 14px}
  #tgfo-tip .t{font-weight:600;font-size:14px;margin-bottom:2px}
  #tgfo-tip .a{color:#999;font-size:12px;margin-bottom:8px}
  #tgfo-tip .d{color:#c9c9d1;margin-bottom:8px;white-space:normal}
  #tgfo-tip .v{color:#999;font-size:12px}
  .tgfo-silent .cdk-overlay-pane{opacity:0 !important}
  .tgfo-empty{color:#888;padding:30px 0;text-align:center}
  `;
  function addStyle() {
    if (document.getElementById('tgfo-style')) return;
    document.head.appendChild(h('style', { id: 'tgfo-style', textContent: css }));
  }

  // ---------- running Flow's own actions on a tool ----------
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function openTool(it) {
    const target = it.el.querySelector('.applet-thumbnail') || it.el.querySelector('.applet-card');
    if (target) target.click();
  }
  async function menuAction(it, label) {
    const btn = it.el.querySelector('.applet-menu-button');
    if (!btn) return alert('Could not find this tool’s menu.');
    document.body.classList.add('tgfo-silent');
    try {
      btn.click();
      let item = null;
      for (let i = 0; i < 20 && !item; i++) {
        await sleep(50);
        item = [...document.querySelectorAll('.cdk-overlay-container [role=menuitem]')]
          .find(m => m.innerText.trim().toLowerCase().endsWith(label.toLowerCase()));
      }
      document.body.classList.remove('tgfo-silent');
      if (!item) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return alert('Flow’s menu has no "' + label + '" for this tool.'); }
      item.click();
    } finally {
      document.body.classList.remove('tgfo-silent');
    }
  }

  // ---------- hover details ----------
  let tip;
  function showTip(e, f, it) {
    hideTip();
    const img = it.el.querySelector('.applet-thumbnail-image');
    const vers = f.list.map(x => x.name);
    tip = h('div', { id: 'tgfo-tip' },
      img && img.src ? h('img', { src: img.src, alt: '' }) : null,
      h('div', { class: 'b' },
        h('div', { class: 't' }, it.name),
        h('div', { class: 'a' }, (it.author || '') + (f.list.length > 1 ? ` · ${f.list.length} builds` : '')),
        it.desc ? h('div', { class: 'd' }, it.desc) : null,
        f.list.length > 1 ? h('div', { class: 'v' }, 'Versions: ' + vers.slice(0, 12).join(', ') + (vers.length > 12 ? ` +${vers.length - 12} more` : '')) : null));
    document.body.appendChild(tip);
    moveTip(e);
  }
  function moveTip(e) {
    if (!tip) return;
    const w = 320, hgt = tip.offsetHeight || 300;
    let x = e.clientX + 18, y = e.clientY + 14;
    if (x + w > innerWidth - 10) x = e.clientX - w - 18;
    if (y + hgt > innerHeight - 10) y = Math.max(10, innerHeight - hgt - 10);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { if (tip) { tip.remove(); tip = null; } }

  let moreMenu;
  function closeMore() { if (moreMenu) { moreMenu.remove(); moreMenu = null; } }
  document.addEventListener('click', e => { if (moreMenu && !moreMenu.contains(e.target)) closeMore(); }, true);
  function showMore(btn, it) {
    closeMore();
    const r = btn.getBoundingClientRect();
    const opt = (label, cls) => h('div', { class: cls || '', onclick: () => { closeMore(); menuAction(it, label); } }, label);
    moreMenu = h('div', { class: 'tgfo-moremenu' },
      opt('Favorite'), opt('Set cover'), opt('Pin to dock'), opt('Delete', 'danger'));
    document.body.appendChild(moreMenu);
    const mh = moreMenu.offsetHeight;
    moreMenu.style.left = Math.min(r.right - 160, innerWidth - 170) + 'px';
    moreMenu.style.top = (r.bottom + 6 + mh > innerHeight ? r.top - mh - 6 : r.bottom + 6) + 'px';
  }

  // ---------- toolbar ----------
  function seg(name, opts) {
    return h('div', { class: 'tgfo-seg', 'data-k': name },
      opts.map(([v, l]) => h('button', { 'data-v': v, class: S[name] === v ? 'on' : '' }, l)));
  }
  function buildBar(host) {
    let bar = document.getElementById('tgfo-bar');
    if (bar && bar.parentElement === host) return bar;
    if (bar) bar.remove();
    bar = h('div', { id: 'tgfo-bar' },
      seg('view', [['list', '☰ List'], ['cards', '▦ Cards']]),
      h('input', { type: 'search', placeholder: 'Search tools…  ( / )', value: S.q }),
      seg('who', [['all', 'All'], ['mine', 'Mine'], ['shared', 'Shared']]),
      seg('sort', [['recent', 'Recent'], ['az', 'A–Z'], ['versions', 'Most versions']]),
      h('button', { class: 'tgfo-btn' + (S.latestOnly ? ' on' : ''), 'data-t': 'latestOnly', title: 'Card view: show only the newest version of each tool' }, 'Latest only'),
      h('button', { class: 'tgfo-btn' + (S.hideRemix ? ' on' : ''), 'data-t': 'hideRemix' }, 'Hide remixes'),
      h('button', { class: 'tgfo-btn', 'data-a': 'collapse' }, 'Collapse all'),
      h('span', { id: 'tgfo-count' }));
    host.insertBefore(bar, host.firstChild);
    const input = bar.querySelector('input');
    input.addEventListener('input', () => { S.q = input.value; save(); apply(); });
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const sg = b.closest('.tgfo-seg');
      if (sg) { S[sg.dataset.k] = b.dataset.v; sg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }
      else if (b.dataset.t) { S[b.dataset.t] = !S[b.dataset.t]; b.classList.toggle('on', S[b.dataset.t]); }
      else if (b.dataset.a === 'collapse') { S.open = {}; }
      save(); apply(true);
    });
    return bar;
  }

  // ---------- model ----------
  function buildModel(q) {
    const sections = [];
    document.querySelectorAll('.applet-section').forEach(sec => {
      const grid = sec.querySelector('.applet-grid'); if (!grid) return;
      const title = (sec.querySelector('.section-title')?.textContent || 'Tools').trim();
      const cards = [...grid.children].filter(c => c.tagName === 'FLOW-APPLET-CARD');
      const items = cards.map((el, i) => {
        const name = (el.querySelector('.applet-name')?.textContent || '').trim();
        const author = (el.querySelector('.applet-author')?.textContent || '').trim();
        const desc = (el.querySelector('.applet-description')?.textContent || '').trim();
        return Object.assign({ el, i, name, author, desc, mine: author === 'You' }, parse(name));
      });
      const fams = new Map();
      items.forEach(it => { if (!fams.has(it.key)) fams.set(it.key, []); fams.get(it.key).push(it); });
      fams.forEach(list => list.sort((a, b) => cmpVer(a.version, b.version) || (a.remix - b.remix) || (a.i - b.i)));
      const famList = [...fams.entries()].map(([key, list]) => ({
        key, list, first: Math.min(...list.map(x => x.i)), star: !!S.stars[key], fam: list[0].family,
        match: !q || list.some(x => (x.name + ' ' + x.desc).toLowerCase().includes(q))
      }));
      famList.sort((a, b) =>
        (b.star - a.star) ||
        (S.sort === 'az' ? a.fam.localeCompare(b.fam) :
         S.sort === 'versions' ? (b.list.length - a.list.length) || (a.first - b.first) :
         a.first - b.first));
      sections.push({ sec, grid, title, famList });
    });
    return sections;
  }
  function itemVisible(it, f) {
    if (!f.match) return false;
    if (S.who === 'mine' && !it.mine) return false;
    if (S.who === 'shared' && it.mine) return false;
    if (S.hideRemix && it.remix) return false;
    return true;
  }

  // ---------- card view ----------
  function renderCards(sections, q) {
    const anyFilter = q || S.who !== 'all';
    sections.forEach(({ sec, grid, famList }) => {
      let order = 0, visibleHere = 0;
      famList.forEach(f => {
        const open = !!S.open[f.key];
        const vis = f.list.filter(x => itemVisible(x, f)), firstVis = vis[0];
        f.list.forEach((it, idx) => {
          const el = it.el;
          el.style.order = String(order++);
          let hide = !itemVisible(it, f);
          if (S.latestOnly && it !== firstVis && !open) hide = true;
          el.style.display = hide ? 'none' : '';
          const vIdx = vis.indexOf(it) >= 0 ? vis.indexOf(it) : idx;
          const mark = vIdx > 0 ? 'older' : (f.star ? 'starred' : '');
          if ((el.dataset.tgfo || '') !== mark) el.dataset.tgfo = mark;
          if (!hide) visibleHere++;
          badge(it, vIdx, f, open);
        });
      });
      const title = sec.querySelector('.section-title');
      if (title) title.style.display = (anyFilter && !visibleHere) ? 'none' : '';
    });
  }
  function badge(it, idx, f, open) {
    const card = it.el.querySelector('.applet-card');
    if (!card) return;
    let b = card.querySelector(':scope > .tgfo-badges');
    if (!b) {
      b = h('div', { class: 'tgfo-badges' });
      card.appendChild(b);
      b.addEventListener('click', e => {
        const t = e.target.closest('[data-act]'); if (!t) return;
        e.preventDefault(); e.stopPropagation();
        const k = t.dataset.key;
        if (t.dataset.act === 'star') toggle(S.stars, k);
        if (t.dataset.act === 'more') toggle(S.open, k);
        save(); apply(true);
      }, true);
    }
    const n = f.list.filter(x => itemVisible(x, f)).length;
    const sig = [it.version, it.tag, it.remix, idx, n, open, f.star].join('|');
    if (b.dataset.sig === sig) return;
    b.dataset.sig = sig;
    const parts = [];
    if (it.version) parts.push(h('span', { class: 'tgfo-chip' + (idx === 0 ? ' latest' : '') }, 'v' + it.version + (it.tag ? ' ' + it.tag : '')));
    else if (idx === 0 && n > 1) parts.push(h('span', { class: 'tgfo-chip latest' }, 'latest'));
    if (it.remix) parts.push(h('span', { class: 'tgfo-chip remix' }, 'remix'));
    if (idx === 0 && n > 1) parts.push(h('span', { class: 'tgfo-chip tgfo-more', 'data-act': 'more', 'data-key': f.key }, open ? '− hide older' : '+' + (n - 1) + ' older'));
    if (idx === 0) parts.push(h('span', { class: 'tgfo-chip tgfo-star' + (f.star ? ' on' : ''), 'data-act': 'star', 'data-key': f.key, title: 'Star this tool' }, f.star ? '★' : '☆'));
    b.replaceChildren(...parts);
  }
  const toggle = (obj, k) => { if (obj[k]) delete obj[k]; else obj[k] = 1; };

  // ---------- list view ----------
  function actions(it, isFamilyRow) {
    return h('div', { class: 'tgfo-acts' },
      h('button', { class: 'tgfo-a' + (isFamilyRow ? ' primary' : ''), title: 'Open this tool', onclick: e => { e.stopPropagation(); openTool(it); } }, 'Open'),
      h('button', { class: 'tgfo-a', title: 'Edit in Tool Builder', onclick: e => { e.stopPropagation(); menuAction(it, 'Edit'); } }, 'Edit'),
      h('button', { class: 'tgfo-a', title: 'Remix this version', onclick: e => { e.stopPropagation(); menuAction(it, 'Remix tool'); } }, 'Remix'),
      h('button', { class: 'tgfo-a', title: 'Share', onclick: e => { e.stopPropagation(); menuAction(it, 'Share'); } }, 'Share'),
      h('button', { class: 'tgfo-a', title: 'More: Favorite, Set cover, Pin to dock, Delete', onclick: e => { e.stopPropagation(); showMore(e.currentTarget, it); } }, '⋯'));
  }
  function nameCell(it, f, isFam) {
    const chips = [];
    if (it.version && isFam) chips.push(h('span', { class: 'tgfo-vchip' }, 'v' + it.version + (it.tag ? ' ' + it.tag : '')));
    if (it.remix) chips.push(h('span', { class: 'tgfo-vchip rx' }, 'remix'));
    const label = isFam ? h('span', { class: 'fam-n' }, it.remix ? it.name : (it.family + (it.tag && !it.version ? ' ' + it.tag : ''))) : h('span', {}, it.name);
    const td = h('td', { class: 'name' }, label, chips);
    td.addEventListener('mouseenter', e => showTip(e, f, it));
    td.addEventListener('mousemove', moveTip);
    td.addEventListener('mouseleave', hideTip);
    return td;
  }
  function thumb(it) {
    const img = it.el.querySelector('.applet-thumbnail-image');
    return h('td', {}, img && img.src ? h('img', { class: 'tgfo-thumb', src: img.src, alt: '' }) : h('div', { class: 'tgfo-thumb' }));
  }
  function renderList(host, sections) {
    let list = document.getElementById('tgfo-list');
    if (!list || list.parentElement !== host) {
      if (list) list.remove();
      list = h('div', { id: 'tgfo-list' });
      const bar = document.getElementById('tgfo-bar');
      host.insertBefore(list, bar ? bar.nextSibling : host.firstChild);
    }
    const out = [];
    sections.forEach(({ title, famList }) => {
      const rows = [];
      let famCount = 0, buildCount = 0;
      famList.forEach(f => {
        const vis = f.list.filter(it => itemVisible(it, f));
        if (!vis.length) return;
        famCount++; buildCount += vis.length;
        const top = vis[0];
        const open = !!S.open[f.key];
        const n = vis.length;
        const tr = h('tr', { class: 'fam' + (f.star ? ' starred' : '') },
          h('td', { class: 'tgfo-starbtn' + (f.star ? ' on' : ''), title: 'Star (pins to top)', onclick: () => { toggle(S.stars, f.key); save(); apply(true); } }, f.star ? '★' : '☆'),
          h('td', {}, n > 1 ? h('div', { class: 'tgfo-tog', title: open ? 'Hide versions' : 'Show versions', onclick: () => { toggle(S.open, f.key); save(); apply(true); } }, open ? '▾' : '▸') : ''),
          thumb(top),
          nameCell(top, f, true),
          h('td', {}, n > 1 ? h('span', { class: 'tgfo-count-pill', title: 'Show versions', onclick: () => { toggle(S.open, f.key); save(); apply(true); } }, String(n)) : h('span', { class: 'muted' }, '1')),
          h('td', { class: 'muted' }, top.author),
          h('td', { class: 'desc', title: top.desc }, top.desc),
          h('td', {}, actions(top, true)));
        tr.addEventListener('dblclick', () => openTool(top));
        rows.push(tr);
        if (open && n > 1) vis.slice(1).forEach(it => {
          const vr = h('tr', { class: 'ver' },
            h('td', {}), h('td', {}), thumb(it),
            nameCell(it, f, false),
            h('td', {}), h('td', { class: 'muted' }, it.author),
            h('td', { class: 'desc', title: it.desc }, it.desc),
            h('td', {}, actions(it, false)));
          vr.addEventListener('dblclick', () => openTool(it));
          rows.push(vr);
        });
      });
      if (!rows.length) return;
      const collapsed = !!S.collapsedSec[title];
      out.push(h('div', { class: 'tgfo-sec' },
        h('div', { class: 'tgfo-sech', onclick: () => { toggle(S.collapsedSec, title); save(); apply(true); } },
          h('span', { class: 'car' }, collapsed ? '▸' : '▾'), title, h('small', {}, `${famCount} tools · ${buildCount} builds`)),
        collapsed ? null : h('table', { class: 'tgfo-t' },
          h('colgroup', {},
            h('col', { style: 'width:34px' }), h('col', { style: 'width:28px' }), h('col', { style: 'width:52px' }),
            h('col', { style: 'width:27%' }), h('col', { style: 'width:64px' }), h('col', { style: 'width:120px' }),
            h('col', {}), h('col', { style: 'width:290px' })),
          h('thead', {}, h('tr', {}, h('th', {}), h('th', {}), h('th', {}), h('th', {}, 'Tool'), h('th', {}, 'Builds'), h('th', {}, 'By'), h('th', {}, 'Description'), h('th', { style: 'text-align:right' }, 'Actions'))),
          h('tbody', {}, rows))));
    });
    if (!out.length) out.push(h('div', { class: 'tgfo-empty' }, 'No tools match.'));
    list.replaceChildren(...out);
  }

  // ---------- main ----------
  let busy = false, lastSig = '';
  function apply(force) {
    const host = document.querySelector('.applet-manager-content');
    if (!host || !document.querySelector('.applet-section .applet-grid')) return;
    busy = true;
    try {
      addStyle();
      const bar = buildBar(host);
      host.style.setProperty('--tgfo-bh', (bar.offsetHeight + 0) + 'px');
      const q = S.q.trim().toLowerCase();
      const sections = buildModel(q);

      // stats
      let tf = 0, tb = 0, sf = 0, sb = 0;
      sections.forEach(s => s.famList.forEach(f => {
        tf++; tb += f.list.length;
        const vis = f.list.filter(it => itemVisible(it, f));
        if (vis.length) { sf++; sb += vis.length; }
      }));
      const cnt = document.getElementById('tgfo-count');
      if (cnt) cnt.textContent = `Showing ${sf} of ${tf} tools · ${sb} of ${tb} builds`;
      document.querySelectorAll('#tgfo-bar [data-t="latestOnly"]').forEach(b => b.style.display = S.view === 'list' ? 'none' : '');

      // show the chosen view; everything else Flow draws in this area stays as it is in card view
      const isList = S.view === 'list';
      [...host.children].forEach(ch => {
        if (ch.id === 'tgfo-bar' || ch.id === 'tgfo-list') return;
        if (isList) { if (ch.style.display !== 'none') { ch.dataset.tgfoHid = '1'; ch.style.display = 'none'; } }
        else if (ch.dataset.tgfoHid) { ch.style.display = ''; delete ch.dataset.tgfoHid; }
      });
      if (isList) {
        const sig = JSON.stringify([S, sections.map(s => [s.title, s.famList.map(f => f.list.map(i => i.name + '|' + i.author + '|' + i.desc.length))])]);
        if (force || sig !== lastSig || !document.getElementById('tgfo-list')) { lastSig = sig; renderList(host, sections); }
      } else {
        document.getElementById('tgfo-list')?.remove();
        lastSig = '';
        renderCards(sections, q);
      }
    } finally {
      setTimeout(() => { busy = false; }, 0);
    }
  }

  // keyboard: "/" focuses search
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName || '') && !document.activeElement?.isContentEditable) {
      const i = document.querySelector('#tgfo-bar input'); if (i) { e.preventDefault(); i.focus(); }
    }
  });

  // re-apply when Flow re-renders the page (ignore changes made by this script)
  const ours = n => n && n.nodeType === 1
    ? !!n.closest('#tgfo-bar, #tgfo-list, #tgfo-tip, .tgfo-moremenu, .tgfo-badges')
    : !!(n && n.parentElement && ours(n.parentElement));
  let timer;
  new MutationObserver(recs => {
    if (busy) return;
    if (recs.every(r => ours(r.target) || [...r.addedNodes, ...r.removedNodes].every(x => x.id === 'tgfo-tip' || (x.classList && x.classList.contains('tgfo-moremenu'))))) return;
    clearTimeout(timer); timer = setTimeout(() => apply(false), 250);
  }).observe(document.documentElement, { childList: true, subtree: true });
  apply(true);
  window.__tgfo = apply;
})();
