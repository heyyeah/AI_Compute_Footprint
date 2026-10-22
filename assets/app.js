/* AI Compute Footprint. All numbers come from window.MODEL (data/model.js). */
(function () {
  "use strict";
  const M = window.MODEL;
  const F = M.factors;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PLURAL = {
    query: "short answers", image: "images", webpage: "simple web pages", doc: "document drafts", maths: "maths solutions",
    interactive: "interactive pages", song: "songs", slides: "presentations", program: "small programs", video: "short videos",
    webapp: "full web apps", animation: "animations", "program-full": "full programs", mvp: "app MVPs", musicvideo: "music videos",
    prodapp: "functional apps"
  };
  const CONF = { good: "Measured", rough: "Estimate", guess: "Rough estimate", missing: "Not shown" };
  const CONF_SHORT = { good: "measured", rough: "estimate", guess: "rough estimate" };
  const FREQ_INTERVAL = { y1: 365, m1: 30.44, w1: 7 };

  /* 24×24 filled glyphs */
  const ICON = {
    bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
    drop: "M12 2.5c3.8 4.6 6.5 8.3 6.5 11.6a6.5 6.5 0 0 1-13 0c0-3.3 2.7-7 6.5-11.6z",
    cloud: "M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.6 4.6 4.6 0 0 1 17.5 19z",
    steak: "M6.5 6C9 3.6 14.4 3 17.7 5.4c3.3 2.5 3.4 7.6.4 10.6-2.6 2.7-6.1 2.5-8.4 4.4-1.6 1.3-4 1.4-5.2-.2-1.3-1.7-.4-3.6-.4-5.5 0-3.3-.3-6.1 2.4-8.7zM14.5 8.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    coal: "M3.5 15.5 6 8.5l5.5-3.5 6 2.5 3 6-2.5 5.5-7 1.5-5.5-2z",
    car: "M2.5 17.2v-3.7c0-.6.4-1 1-1.1l2.7-.6 2.4-3.4h6.6l2.4 3.4 2.9.6c.6.1 1 .5 1 1.1v3.7h-1.9a2.6 2.6 0 0 0-5.2 0H9.6a2.6 2.6 0 0 0-5.2 0zM9.1 9.4h2.6v2.2H7.6zm3.7 0h2.1l1.9 2.2h-4zM7 15.4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zm10 0a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z",
    land: "M3 3h18v18H3zM5 5v6h6V5zm8 0v6h6V5zM5 13v6h6v-6zm8 0v6h6v-6z",
    plane: "M21.5 12c0-.9-.7-1.5-1.5-1.5h-5.2L10 3h-2.2l2.4 7.5H5.3L3.6 8H2l1 4-1 4h1.6l1.7-2.5h4.9L7.8 21H10l4.8-7.5H20c.8 0 1.5-.6 1.5-1.5z",
    house: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    glass: "M5 3h14l-1.8 16.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8z",
    person: "M12 3a3.6 3.6 0 1 1 0 7.2A3.6 3.6 0 0 1 12 3zM4.5 21v-2.2c0-3.5 3.2-5.8 7.5-5.8s7.5 2.3 7.5 5.8V21z",
    burger: "M4 10.5C4 7 7.6 4.5 12 4.5s8 2.5 8 6zM3.5 12.5h17v2.2h-17zM4 16.3h16v1.2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z",
    pool: "M2 14.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5v7H2zM2 8.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5V10c-2 0-2 1.5-4 1.5S16 10 14 10s-2 1.5-4 1.5S8 10 6 10s-2 1.5-4 1.5z",
    pitch: "M2 5h20v14H2zM11.3 6.5H3.5v11h7.8zm1.4 0v11h7.8v-11z",
    bulb: "M12 2.5a6.5 6.5 0 0 1 3.8 11.8c-.6.5-.8 1.1-.8 1.8V17H9v-.9c0-.7-.3-1.3-.8-1.8A6.5 6.5 0 0 1 12 2.5zM9 18.5h6V20a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20z",
    kettle: "M5 8.5h11l1.5 10.5a1.5 1.5 0 0 1-1.5 1.7H5.5A1.5 1.5 0 0 1 4 19zM7 8.5V7a3.5 3.5 0 0 1 7 0v1.5h-1.6V7a1.9 1.9 0 0 0-3.8 0v1.5zM16.4 11l3.3-1.6.6 1.4-3.6 1.7z",
    rack: "M6 2.5h12a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1zM7.5 5v2.2h9V5zm0 4.2v2.2h9V9.2zm0 4.2v2.2h9v-2.2z",
    tower: "M6 21c1.6-4.2 1.6-9.6 0-15h12c-1.6 5.4-1.6 10.8 0 15zM9 3h2.2v2H9zm3.8-1H15v3h-2.2z",
    pin: "M12 2.5a7 7 0 0 1 7 7c0 5-7 12-7 12s-7-7-7-12a7 7 0 0 1 7-7zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    campus: "M2 20.5V9.5l6-3v3l6-3v3l6-3v14z",
    globe: "M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zM12 4.6c-2 2.1-3 4.6-3 7.4s1 5.3 3 7.4c2-2.1 3-4.6 3-7.4s-1-5.3-3-7.4z",
    gpu: "M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM8 9v6h8V9z"
  };
  const svgIcon = (name, cls = "ico") => `<svg class="${cls} i-${name}" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="${ICON[name] || ICON.bolt}"/></svg>`;
  const CMP_ICON = { beef: "steak", coal: "coal", car: "car", flight: "plane", power: "house", water: "glass", total: "person" };
  const EQ_ICON = { burger: "burger", carkm: "car", aucarkm: "car", zrhlon: "plane", sydmel: "plane", nycchi: "plane", shower: "drop", pool: "pool" };

  // visitors in American or Australian time zones start with their own averages
  function guessBasis() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return /^America\//.test(tz) ? "US" : /^Australia\//.test(tz) ? "AU" : "CH";
    } catch (e) { return "CH"; }
  }
  const BASIS = guessBasis();
  const state = {
    task: 0, freq: 6, people: "person", customN: null, period: 3, own: true, adoption: null, share: null,
    basis: BASIS, grid: null, metric: "co2", view: "bars",
    compare: new Set(["beef", "coal", "car", "flight", "total"]), taskLog: true
  };

  /* ---------- formatting */
  const NF = {};
  function nf(x, sig = 2) {
    if (x == null || !isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a < 1e-4) {
      const e = Math.floor(Math.log10(a));
      const sup = String(e).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
      return `${(NF["s" + sig] ||= new Intl.NumberFormat("en", { maximumSignificantDigits: sig })).format(x / Math.pow(10, e))}×10${sup}`;
    }
    return (NF[sig] ||= new Intl.NumberFormat("en", { maximumSignificantDigits: sig })).format(x);
  }
  function fmtCount(x, sig = 2) {
    const a = Math.abs(x);
    if (a < 1e6) return nf(x, a >= 1000 ? 3 : sig);
    for (const [v, w] of [[1e21, "sextillion"], [1e18, "quintillion"], [1e15, "quadrillion"], [1e12, "trillion"], [1e9, "billion"], [1e6, "million"]]) if (a >= v) return `${nf(x / v, sig)} ${w}`;
    return nf(x);
  }
  const compact = new Intl.NumberFormat("en", { notation: "compact", maximumSignificantDigits: 2 });
  function fmtE(kwh) {
    if (kwh < 1) return `${nf(kwh * 1000)} Wh`;
    for (const [v, s] of [[1e12, "PWh"], [1e9, "TWh"], [1e6, "GWh"], [1e3, "MWh"], [1, "kWh"]]) if (kwh >= v) return `${nf(kwh / v)} ${s}`;
    return `${nf(kwh)} kWh`;
  }
  function fmtW(L) {
    if (L < 1) return `${nf(L * 1000)} mL`;
    if (L < 1000) return `${nf(L)} L`;
    if (L < 1e9) return `${nf(L / 1000)} m³`;
    if (L < 1e12) return `${nf(L / 1e9)} million m³`;
    return `${nf(L / 1e12)} km³`;
  }
  function fmtM(kg) {
    if (kg < 0.001) return `${nf(kg * 1e6)} mg`;
    if (kg < 1) return `${nf(kg * 1000)} g`;
    if (kg < 1000) return `${nf(kg)} kg`;
    for (const [v, s] of [[1e12, "Gt"], [1e9, "Mt"], [1e6, "kt"], [1e3, "t"]]) if (kg >= v) return `${nf(kg / v)} ${s}`;
    return `${nf(kg)} kg`;
  }
  function fmtD(s) {
    if (s < 1) return `${nf(s * 1000)} ms`;
    if (s < 60) return `${nf(s)} s`;
    if (s < 3600) return `${nf(s / 60)} min`;
    if (s < 86400) return `${nf(s / 3600)} h`;
    if (s < 86400 * 365) return `${nf(s / 86400)} days`;
    return `${nf(s / (86400 * 365))} years`;
  }
  function fmtA(m2) {
    if (m2 < 1) return `${nf(m2 * 1e4)} cm²`;
    if (m2 < 1e4) return `${nf(m2)} m²`;
    if (m2 < 1e6) return `${nf(m2 / 1e4)} ha`;
    return `${nf(m2 / 1e6)} km²`;
  }
  function fmtPow(w) {
    for (const [v, s] of [[1e12, "TW"], [1e9, "GW"], [1e6, "MW"], [1e3, "kW"], [1, "W"]]) if (w >= v) return `${nf(w / v)} ${s}`;
    return `${nf(w * 1000)} mW`;
  }
  const fmtRatio = (r) => (!isFinite(r) ? "—" : r >= 1 ? `${nf(r)}×` : `${nf(r * 100)}%`);
  const FMT = { co2: fmtM, kwh: fmtE, water: fmtW };
  const METRIC = { co2: "CO₂", kwh: "energy", water: "water" };

  function srcLinks(ids) {
    return [...new Set(ids || [])].filter((id) => M.sources[id]).map((id) => {
      const s = M.sources[id];
      const short = s.t.split(/,|:/)[0].replace(/\s*\(.*$/, "");
      return `<a href="${esc(s.u)}" target="_blank" rel="noopener" title="${esc(s.t)} (${esc(s.d)})">${esc(short)}</a>`;
    }).join(" ");
  }

  /* ---------- model */
  const presetsSorted = () => M.presets.slice().sort((a, b) => a[state.basis].n - b[state.basis].n);
  const preset = () => M.presets.find((p) => p.id === state.people);
  const peopleN = () => (state.people === "custom" ? state.customN : preset()[state.basis].n);
  const isOnce = () => M.frequencies[state.freq].perDay == null;
  const allowedPeriod = (i) => M.periods[i].days >= (FREQ_INTERVAL[M.frequencies[state.freq].id] || 0) - 0.01;
  function fixPeriod() { if (!allowedPeriod(state.period)) state.period = M.periods.findIndex((p, i) => allowedPeriod(i)); }
  // daily-users filter defaults on from 50 people
  const adopt = () => (state.adoption != null ? state.adoption : peopleN() >= 50);
  function peopleLabel() {
    const n = peopleN(), pct = adopt() ? `${nf(shareV() * 100)}% daily users` : "";
    if (state.people === "custom") return `${nf(n, 6)} ${n === 1 ? "person" : "people"}${pct ? ` (${pct})` : ""}`;
    const p = preset();
    if (p.id === "person") return `1 person${pct ? ` (${pct})` : ""}`;
    return `${p.label} (${compact.format(n)}${pct ? `, ${pct}` : ""})`;
  }
  // country and world presets use their own averages
  const LOCK = { smallcountry: "CH", midcountry: "AU", bigcountry: "US", world: "World" };
  const basisId = () => LOCK[state.people] || state.basis;
  const adoptionRef = () => (state.people !== "custom" && preset().work ? M.bases[basisId()].work : M.bases[basisId()].adoption);
  const shareV = () => (state.share != null ? state.share : adoptionRef().v);
  // grid follows the country unless picked; Swiss users are mostly served from European data centres
  const gridId = () => state.grid || { AU: "au", US: "us", World: "world" }[basisId()] || "eu";
  const homeW = () => (M.bases[basisId()].homeKWhPerDay * 1000) / 24;

  const GPU_AVG_KW = F.gpuKW.v * F.draw.v;
  const SERVER = F.serverGPUs.v;
  const RACK_MW = (F.gpusPerRack.v * F.gpuKW.v) / F.pue.v / 1000;
  const SERVER_MW = (RACK_MW * SERVER) / F.gpusPerRack.v;
  const serverSec = (wh) => (wh / 1000 / GPU_AVG_KW / SERVER) * 3600;
  function compute() {
    const t = M.tasks[state.task], f = M.frequencies[state.freq], b = M.bases[basisId()], g = M.grids[gridId()];
    const once = f.perDay == null;
    const own = once && state.own;
    const days = own ? Math.max(1, t.dur / 86400) : M.periods[state.period].days;
    const span = own ? (t.dur >= 86400 ? `~${fmtD(t.dur)}` : "a day") : `a ${M.periods[state.period].label.toLowerCase()}`;
    const people = peopleN();
    const users = people * (adopt() ? shareV() : 1);
    const count = once ? users : users * f.perDay * days;
    const kwh = t.wh.map((w) => (w * count) / 1000);
    const hours = days * 24;
    const gpuH = kwh.map((e) => e / GPU_AVG_KW);
    const running = gpuH.map((x) => x / hours);
    const racks = running.map((x) => x / F.gpusPerRack.v);
    const itMW = running.map((x) => (x * F.gpuKW.v) / F.pue.v / 1000);
    const dcs = itMW.map((m) => m / F.dcMW.v);
    // physical space: whole servers, at least one
    const fullRacks = racks.map((x) => Math.max(1, Math.ceil(x - 1e-9)));
    const servers = running.map((x) => Math.max(1, Math.ceil(x / SERVER - 1e-9)));
    const floor = servers.map((n, i) => n * SERVER_MW * F.buildingM2perMW.v[i]);
    const site = servers.map((n, i) => n * SERVER_MW * F.landM2perMW.v[i]);
    const waterOn = kwh.map((e, i) => (e / F.pue.v) * F.onsiteWater.v[i]); // WUE is per IT kWh
    const waterOff = kwh.map((e, i) => e * [g.waterRange[0], g.water, g.waterRange[1]][i]);
    const water = kwh.map((e, i) => waterOn[i] + waterOff[i]);
    const co2 = kwh.map((e) => e * g.co2);
    const watts = kwh.map((e) => (e * 1000) / hours);
    return { t, f, b, g, once, days, span, people, users, count, tokens: count * t.tokens, kwh, hours, gpuH, running, racks, fullRacks, servers, itMW, dcs, floor, site, waterOn, waterOff, water, co2, watts };
  }

  /* ---------- popover */
  const pop = { el: $("#pop"), scrim: $("#scrim"), anchor: null, update: null };
  function closePop(refocus) {
    if (!pop.anchor) return;
    pop.anchor.setAttribute("aria-expanded", "false");
    if (refocus) pop.anchor.focus();
    pop.el.hidden = true; pop.scrim.hidden = true; pop.anchor = null; pop.update = null;
  }
  function openPop(anchor, title, build) {
    if (pop.anchor === anchor) { closePop(); return; }
    closePop();
    const { node, update } = build();
    pop.el.innerHTML = `<div class="pop-head"><span class="lbl">${esc(title)}</span><button type="button" class="pop-x" aria-label="Close">×</button></div>`;
    pop.el.appendChild(node);
    pop.el.querySelector(".pop-x").addEventListener("click", () => closePop(true));
    pop.el.setAttribute("aria-label", title);
    pop.el.hidden = false; pop.anchor = anchor; pop.update = update || null;
    anchor.setAttribute("aria-expanded", "true");
    placePop();
    const first = ["input", ".opt[aria-pressed='true']", ".seg button:not([disabled])", "a"].map((q) => pop.el.querySelector(q)).find(Boolean);
    if (first) first.focus({ preventScroll: true });
  }
  function placePop() {
    if (!pop.anchor) return;
    const sheet = window.innerWidth < 640;
    pop.el.classList.toggle("sheet", sheet);
    pop.scrim.hidden = !sheet;
    if (sheet) { pop.el.style.left = ""; pop.el.style.top = ""; return; }
    const r = pop.anchor.getBoundingClientRect();
    const w = pop.el.offsetWidth, h = pop.el.offsetHeight;
    const left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 12) top = Math.max(12, r.top - h - 8);
    pop.el.style.left = `${left}px`;
    pop.el.style.top = `${top}px`;
  }
  const node = (html) => { const d = document.createElement("div"); d.style.display = "grid"; d.style.gap = "10px"; d.innerHTML = html; return d; };
  const MORE = `<p class="more-links">Info about <a href="#sure" data-goto="sure">confidence</a>, <a href="#assumptions" data-goto="assumptions">assumptions and sources</a></p>`;
  const infoPop = (anchor, title, html) => openPop(anchor, title, () => ({ node: node(html + MORE) }));
  function goTo(id) {
    const d = document.getElementById(id);
    closePop();
    d.open = true;
    d.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    d.querySelector("summary").focus({ preventScroll: true });
  }

  function popTask() {
    const lo = Math.log10(0.1), hi = Math.log10(200000);
    const n = node(`<div class="optlist">${M.tasks.map((t, i) => `
      <button type="button" class="opt" data-i="${i}" aria-pressed="${i === state.task}">
        <span>${esc(t.name)}</span>
        <span class="mini" style="width:${Math.max(4, ((Math.log10(t.wh[1]) - lo) / (hi - lo)) * 100)}%"></span>
        <span class="w">${esc(fmtE(t.wh[1] / 1000))}</span>
      </button>`).join("")}</div><p>Ordered by energy per task, in watt-hours (Wh).</p>`);
    n.addEventListener("click", (e) => { const b = e.target.closest(".opt"); if (!b) return; state.task = +b.dataset.i; closePop(true); render(); });
    return { node: n };
  }
  function popFreq() {
    const n = node(`<div class="val" id="pfVal"></div>
      <input type="range" id="pfRange" min="0" max="${M.frequencies.length - 1}" step="1" value="${state.freq}" aria-label="How often, per person">
      <p id="pfNote"></p>`);
    const update = () => {
      n.querySelector("#pfVal").textContent = M.frequencies[state.freq].label;
      n.querySelector("#pfRange").setAttribute("aria-valuetext", M.frequencies[state.freq].label);
      n.querySelector("#pfNote").textContent = isOnce() ? "Each person does it once. The time is the task's own duration." : "Per person, every day of the period.";
    };
    n.querySelector("#pfRange").addEventListener("input", (e) => { state.freq = +e.target.value; fixPeriod(); render(); });
    update();
    return { node: n, update };
  }
  function popPeople() {
    const list = presetsSorted();
    const n = node(`<div class="val" id="ppVal"></div><div class="sub" id="ppSub"></div>
      <input type="range" id="ppRange" min="0" max="${list.length - 1}" step="1" aria-label="How many people">
      <label class="inline" for="ppNum">Or type a number<input type="number" id="ppNum" min="1" step="1" inputmode="numeric" placeholder="e.g. 12000"></label>
      <div class="seg" id="ppCountry" role="group" aria-label="People live in">${Object.entries(M.bases).filter(([id]) => id !== "World").map(([id, b]) => `<button type="button" data-id="${id}">${esc(b.label)}</button>`).join("")}</div>
      <label class="switch" for="ppAdopt"><input type="checkbox" id="ppAdopt"><span>Only people who use AI daily<br><small class="sub" id="ppAdoptNote"></small></span></label>
      <label class="inline" for="ppShare" id="ppShareWrap">Share who use AI daily, %<input type="number" id="ppShare" min="1" max="100" step="1" inputmode="numeric"></label>`);
    const range = n.querySelector("#ppRange"), num = n.querySelector("#ppNum");
    const update = () => {
      const N = peopleN();
      n.querySelector("#ppVal").textContent = state.people === "custom" ? peopleLabel() : preset().label;
      const note = state.people === "custom" ? "" : preset()[state.basis].note;
      n.querySelector("#ppSub").textContent = state.people === "custom" ? "Your own number" : `${nf(N, 10)} ${N === 1 ? "person" : "people"}${note ? ` · ${note}` : ""}`;
      let idx = list.findIndex((p) => p.id === state.people);
      if (idx < 0) idx = list.reduce((best, p, i) => (Math.abs(Math.log(p[state.basis].n / N)) < Math.abs(Math.log(list[best][state.basis].n / N)) ? i : best), 0);
      range.value = idx;
      range.setAttribute("aria-valuetext", peopleLabel());
      n.querySelectorAll("#ppCountry button").forEach((b) => { b.setAttribute("aria-pressed", String(b.dataset.id === basisId())); b.disabled = !!LOCK[state.people]; });
      n.querySelector("#ppAdopt").checked = adopt();
      const ref = adoptionRef(), share = n.querySelector("#ppShare");
      n.querySelector("#ppAdoptNote").innerHTML = `${esc(ref.label)}. ${esc(ref.note)} ${srcLinks(ref.src)}`;
      n.querySelector("#ppShareWrap").hidden = !adopt();
      if (document.activeElement !== share) share.value = Math.round(shareV() * 100);
    };
    range.addEventListener("input", (e) => { state.people = list[+e.target.value].id; state.share = null; num.value = ""; render(); });
    num.addEventListener("input", (e) => {
      const v = Math.round(+e.target.value);
      if (v >= 1 && v <= 1e11) { state.people = "custom"; state.customN = v; render(); }
    });
    n.querySelector("#ppCountry").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && !b.disabled) { state.basis = b.dataset.id; render(); } });
    n.querySelector("#ppAdopt").addEventListener("change", (e) => { state.adoption = e.target.checked; render(); });
    n.querySelector("#ppShare").addEventListener("input", (e) => { const v = +e.target.value; if (v >= 1 && v <= 100) { state.share = v / 100; render(); } });
    update();
    return { node: n, update };
  }
  function popPeriod() {
    const once = isOnce(), t = M.tasks[state.task], own = once && state.own;
    const ownBtn = once ? `<div class="optlist"><button type="button" class="opt two" data-own="1" aria-pressed="${own}"><span>The task's own time</span><span class="w">${t.dur < 86400 ? "under a day" : `~${esc(fmtD(t.dur))}`}</span></button></div>` : "";
    const note = once ? "Within a shorter time needs more GPUs at once. The energy stays the same."
      : M.periods.some((p, i) => !allowedPeriod(i)) ? `Shorter periods are off for ${esc(M.frequencies[state.freq].label.toLowerCase())}.` : "Totals are added up over this period.";
    const n = node(`${ownBtn}<div class="seg" role="group" aria-label="Time period">${M.periods.map((p, i) =>
      `<button type="button" data-i="${i}" aria-pressed="${!own && i === state.period}" ${allowedPeriod(i) ? "" : "disabled"}>${esc(p.label)}</button>`).join("")}</div><p>${note}</p>`);
    n.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i], button[data-own]"); if (!b || b.disabled) return;
      if (b.dataset.own) state.own = true; else { state.period = +b.dataset.i; if (once) state.own = false; }
      closePop(true); render();
    });
    return { node: n };
  }
  function popGrid() {
    const n = node(`<div class="optlist">${Object.entries(M.grids).map(([id, g]) => `
      <button type="button" class="opt two" data-id="${id}" aria-pressed="${id === gridId()}"><span>${esc(g.label)}</span><span class="w">${nf(g.co2 * 1000)} g CO₂/kWh</span></button>`).join("")}</div>
      <p>Where a request is served is not public; for users in Switzerland, European and US data centres are the most likely; for users in Australia, Sydney and Melbourne.</p><p>Follows the country unless you pick one.</p><p>${esc(M.grids[gridId()].note)}</p><div class="srcs">${srcLinks(M.grids[gridId()].src)}</div>`);
    n.addEventListener("click", (e) => { const b = e.target.closest(".opt"); if (!b) return; state.grid = b.dataset.id; closePop(true); render(); });
    return { node: n };
  }
  function popCountry() {
    const n = node(`<div class="optlist">${Object.entries(M.bases).filter(([id]) => id !== "World").map(([id, b]) => `
      <button type="button" class="opt two" data-id="${id}" aria-pressed="${id === state.basis}"><span>${esc(b.label)}</span><span class="w">${esc(id)}</span></button>`).join("")}</div>
      <p>Sets the per-person averages, the city and state sizes, and the share of daily AI users.</p>`);
    n.addEventListener("click", (e) => { const b = e.target.closest(".opt"); if (!b) return; state.basis = b.dataset.id; closePop(true); render(); });
    return { node: n };
  }

  /* ---------- log bar chart */
  function logChart(container, rows, opts) {
    const vals = [];
    rows.forEach((r) => [r.v, r.lo, r.hi].forEach((x) => { if (x > 0 && isFinite(x)) vals.push(x); }));
    if (!vals.length) { container.innerHTML = ""; return; }
    let x, grid;
    if (opts.log) {
      const d0 = Math.floor(Math.log10(Math.min(...vals)));
      let d1 = Math.ceil(Math.log10(Math.max(...vals)));
      if (d1 - d0 < 2) d1 = d0 + 2;
      const span = d1 - d0, step = span > 12 ? 3 : span > 7 ? 2 : 1;
      x = (v) => Math.max(0, Math.min(100, ((Math.log10(v) - d0) / span) * 100));
      grid = [];
      for (let d = d0; d <= d1; d += step) grid.push(Math.pow(10, d));
    } else {
      const raw = Math.max(...vals) / 4, e = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * e).find((v) => v >= raw);
      const top = Math.ceil(Math.max(...vals) / step) * step;
      x = (v) => Math.max(0, Math.min(100, (v / top) * 100));
      grid = [];
      for (let v = 0; v <= top + step / 2; v += step) grid.push(v);
    }
    const gridHTML = grid.map((g) => `<span class="gridline" style="left:${x(g)}%"></span>`).join("");
    const wrap = document.createElement("div");
    wrap.className = `lchart ${opts.log ? "log" : "lin"}`;
    const ticks = `<div></div><div class="ticks">${grid.map((g) => `<span style="left:${x(g)}%">${g === 0 ? "0" : esc(opts.fmt(g))}</span>`).join("")}</div><div></div>`;
    if (opts.onScale) {
      wrap.insertAdjacentHTML("beforeend", `<label class="logtoggle"><input type="checkbox" ${opts.log ? "checked" : ""}> <b>Log scale</b></label>`);
      wrap.querySelector(".logtoggle input").addEventListener("change", (e) => opts.onScale(e.target.checked));
    }
    wrap.insertAdjacentHTML("beforeend", `<div class="axis top" aria-hidden="true">${ticks}</div>`);
    rows.forEach((r, i) => {
      const row = document.createElement("div");
      row.className = `lrow ${r.cls || ""} ${r.na ? "na" : ""} ${opts.onClick ? "btn" : ""}`;
      const ib = r.info ? ` <button type="button" class="info sm" aria-label="About ${esc(r.label)}">i</button>` : "";
      const lab = opts.onClick ? `<button type="button" class="pick">${esc(r.label)}</button>` : esc(r.label);
      const name = `<div class="lname"><span class="lt">${lab}${ib}</span>${r.sub ? `<small>${r.sub}</small>` : ""}</div>`;
      const wh = !r.na && r.lo != null && r.hi > r.lo ? `<span class="whisk" style="left:${x(r.lo)}%;width:${Math.max(0.6, x(r.hi) - x(r.lo))}%"></span>` : "";
      const track = r.na ? `<div class="track">${esc(r.na)}</div>` : `<div class="track">${gridHTML}${opts.log ? `<span class="mk" style="left:${x(r.v)}%"></span>` : `<span class="bar" style="width:${x(r.v)}%"></span>`}${wh}</div>`;
      const val = r.na ? `<div class="lval">—</div>` : `<div class="lval">${esc(opts.fmt(r.v))}${r.valSub ? `<small>${r.valSub}</small>` : ""}</div>`;
      row.innerHTML = name + track + val;
      if (opts.onClick) {
        row.addEventListener("click", (e) => { if (!e.target.closest(".info")) opts.onClick(i); });
      }
      if (r.info) row.querySelector(".info").addEventListener("click", (e) => { e.stopPropagation(); r.info(e.currentTarget); });
      if (r.tip) { row.addEventListener("pointermove", (e) => showTip(e, r.tip)); row.addEventListener("pointerleave", hideTip); }
      wrap.appendChild(row);
    });
    const axis = document.createElement("div");
    axis.className = "axis"; axis.setAttribute("aria-hidden", "true");
    axis.innerHTML = ticks;
    wrap.appendChild(axis);
    container.innerHTML = "";
    container.appendChild(wrap);
  }
  const tip = $("#tip");
  function showTip(e, text) {
    tip.textContent = text; tip.hidden = false;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = e.clientX + 14, top = e.clientY + 14;
    if (left + w > window.innerWidth - 8) left = e.clientX - w - 14;
    if (top + h > window.innerHeight - 8) top = e.clientY - h - 14;
    tip.style.left = `${Math.max(8, left)}px`; tip.style.top = `${Math.max(8, top)}px`;
  }
  function hideTip() { tip.hidden = true; }

  /* ---------- power ladder */
  // local references follow the people's country, or the visitor's for the world
  const localId = () => (basisId() === "World" ? state.basis : basisId());
  const local = (x) => !x.basis || [].concat(x.basis).includes(localId());
  function rungs() { return M.rungs.filter(local).map((g) => ({ ...g, w: g.id === "home" ? homeW() : g.w })).sort((a, b) => a.w - b.w); }
  const RUNG_SAY = {
    bulb: (n) => `${n} LED bulbs`, kettle: (n) => `${n} kettles`, home: (n) => `the home electricity of ${n} people`,
    chdc: (n) => `${n}× all Swiss data centres`, goesgen: (n) => `${n} nuclear plants the size of Gösgen`,
    ch: (n) => `${n}× all of Switzerland's electricity`,
    audc: (n) => `${n}× Australia's east-coast data centres`, eraring: (n) => `${n} Eraring power stations`, au: (n) => `${n}× all of Australia's electricity`,
    usdc: (n) => `${n}× all US data centres`, hoover: (n) => `${n} Hoover Dams at full output`, us: (n) => `${n}× all US electricity`, dcworld: (n) => `${n}× all data centres worldwide`, world: (n) => `${n}× all electricity worldwide`
  };
  function renderPower(r) {
    const w = r.watts[1], R = rungs();
    const below = R.filter((g) => g.w <= w).pop(), above = R.find((g) => g.w > w);
    let say;
    if (!below) say = `As much as <em>${esc(nf((w / R[0].w) * 100))}%</em> of one LED bulb, non-stop.`;
    else {
      const n = w / below.w;
      say = `As much as <em>${esc(RUNG_SAY[below.id](n >= 1000 ? fmtCount(n) : nf(n)))}</em>, non-stop.`;
    }
    $("#powerSay").innerHTML = say;
    const lo = Math.floor(Math.log10(Math.min(w, R[0].w))) - 0.3, hi = Math.ceil(Math.log10(Math.max(w, R[R.length - 1].w))) + 0.3;
    const x = (v) => ((Math.log10(Math.max(v, 1e-12)) - lo) / (hi - lo)) * 100;
    const ticks = [];
    for (let d = Math.ceil(lo / 3) * 3; d <= hi; d += 3) ticks.push(d);
    $("#ladder").innerHTML = `<div class="track"></div>${R.map((g, i) =>
      `<button type="button" class="rung ${i % 2 ? "dn" : "up"} ${g === below || g === above ? "near" : ""}" style="left:${x(g.w)}%" data-id="${g.id}" aria-label="${esc(g.label)}, ${esc(fmtPow(g.w))}">${svgIcon(g.icon)}</button>`).join("")}
      <span class="you" style="left:${x(w)}%"></span>
      ${ticks.map((d) => `<span class="tickl" style="left:${x(Math.pow(10, d))}%">${esc(fmtPow(Math.pow(10, d)))}</span>`).join("")}`;
    $("#ladder").querySelectorAll(".rung").forEach((b) => {
      const g = R.find((q) => q.id === b.dataset.id);
      b.addEventListener("pointermove", (e) => showTip(e, `${g.label}: ${fmtPow(g.w)}`));
      b.addEventListener("pointerleave", hideTip);
      b.addEventListener("click", () => infoPop(b, g.label, `<div class="val">${esc(fmtPow(g.w))}</div>${g.note ? `<p>${esc(g.note)}</p>` : ""}<div class="srcs">${srcLinks(g.src)}</div>`));
    });
    const you = $("#ladder .you");
    you.addEventListener("pointermove", (e) => showTip(e, `This scenario: ${fmtPow(w)} on average`));
    you.addEventListener("pointerleave", hideTip);
    const lab = (g) => `${g.label} (${fmtPow(g.w)})`;
    $("#powerBetween").textContent = `${fmtPow(w)} on average${below && above ? `, between ${lab(below)} and ${lab(above)}` : ""}. Log scale: 1,000× between labels.`;
  }

  /* ---------- land, to scale */
  const LAND_SAY = {
    parking: ["a parking space", "parking spaces"], tennis: ["a tennis court", "tennis courts"], pitch: ["a football pitch", "football pitches"],
    central: ["Central Park", "× Central Park"], manhattan: ["Manhattan", "× Manhattan"], la: ["Los Angeles", "× Los Angeles"],
    ch: ["Switzerland", "× Switzerland"], tx: ["Texas", "× Texas"]
  };
  /* Line art per reference: w × h in its own units (m, or 0–100 for outlines), area = w·h·fill.
     Outlines: NYC Planning, US Census and FSO boundaries, simplified; holes are enclaves. */
  const SHAPE = {
    parking: { w: 2.5, h: 5, gap: 0, art: `<path d="M0 5V0H2.5V5"/><rect x=".38" y=".4" width="1.74" height="4.2" rx=".45"/><path d="M.5 1.65Q1.25 1.35 2 1.65M.55 3.55Q1.25 3.8 1.95 3.55M.48 1.7V3.5M2.02 1.7V3.5"/>` },
    tennis: { w: 23.77, h: 10.97, gap: 3, art: `<rect width="23.77" height="10.97"/><path d="M0 1.37H23.77M0 9.6H23.77M5.485 1.37V9.6M18.285 1.37V9.6M5.485 5.485H18.285"/><path class="net" d="M11.885 -.9V11.87"/>` },
    pitch: { w: 105, h: 68, gap: 8, art: `<rect width="105" height="68"/><path d="M52.5 0V68M0 13.84H16.5V54.16H0M105 13.84H88.5V54.16H105M0 24.84H5.5V43.16H0M105 24.84H99.5V43.16H105M16.5 26.69A9.15 9.15 0 0 1 16.5 41.31M88.5 26.69A9.15 9.15 0 0 0 88.5 41.31M0 30.34H-2V37.66H0M105 30.34H107V37.66H105M0 1A1 1 0 0 0 1 0M104 0A1 1 0 0 0 105 1M105 67A1 1 0 0 0 104 68M1 68A1 1 0 0 0 0 67"/><circle cx="52.5" cy="34" r="9.15"/><circle class="spot" cx="52.5" cy="34" r=".5"/><circle class="spot" cx="11" cy="34" r=".5"/><circle class="spot" cx="94" cy="34" r=".5"/>` },
    central: { w: 4100, h: 832, gap: 300, art: `<rect width="4100" height="832"/><rect x="110" y="110" width="3880" height="612" rx="300"/><ellipse cx="2570" cy="430" rx="400" ry="290"/><ellipse cx="1880" cy="420" rx="260" ry="170"/><path d="M1050 300C1250 220 1420 320 1360 430C1310 530 1140 470 1060 560C980 640 860 520 950 430C1000 380 960 340 1050 300Z"/><path d="M3850 560C3950 560 3990 660 3920 720H3700C3720 640 3760 560 3850 560Z"/>` },
    manhattan: { w: 45.9, h: 100, fill: 0.271, gap: 8, d: "M3.4 85.9L2.9 89L3.9 90.7L5.6 91.4L11.3 87.4L14.9 86.6L17.5 86.7L19.8 85.6L21.7 77.9L20.6 73.2L21.3 72.5L21.8 69.1L33 53L32.9 48.6L34.3 47.5L35.8 44.6L38.4 42.1L38.5 39.5L36.4 35L36.2 21.7L41.6 10L41.5 8.8L42.6 9L45.2 5L45.9 2.8L45 1.7L43.5 1.4L41.6 2.1L40.9 0L38.8 0.3L37.4 3.1L37.1 5L33.4 12L31.5 13.8L31.8 17.2L29.8 23L28.4 25.5L27.2 26.2L26.6 27.4L27 28.4L24.6 31.9L10.9 58.3L7.5 63.7L6.7 66.1L7 68.5L6.1 76L4.9 76.4L6 77.1L5.3 82L3.8 82.6L3.6 84.3L4 84.8ZM35.8 47.8L36.2 48.7L39.2 49.7L40.9 48.6L42.7 45.3L44 44L44.5 42.9L43.9 41.6L41.2 39.1L39.9 39L39.2 40.5L38.9 43.6L39.9 44.2L39.7 44.8L37.7 44.7ZM0 99L0.3 99.9L1.4 100L5.2 97.9L5.6 96.5L4.7 95.5L2.8 95.4Z" },
    la: { w: 67.5, h: 100, fill: 0.396, gap: 8, d: "M0 23.3L0 25.3L1.3 25.3L1.3 26.5L3 27.1L5.2 30L7 29.7L13.6 32.7L9.1 41.5L12.9 42.3L13 55L13.8 55.2L19.8 49.3L22.9 45.3L24.3 46.7L25.1 45.9L29.6 50.6L17.2 58.5L22.3 66.5L30.4 66.5L27.7 62.5L27.6 59.4L31.4 66.4L32.4 66.4L31.5 64.1L39.4 64.4L39.2 60.7L38.1 60.7L39.2 56.1L43.8 56.1L44.1 58.4L46.1 57.8L46.7 63L48.1 61.8L48.4 59.6L49.5 59.6L49.7 74.3L48.7 74.5L49.2 73.7L48.6 73.7L48.5 74.4L47.2 74.5L47.6 88.8L46.9 90.6L48.3 91.5L47.2 91.5L47.2 93.2L46 93.2L46 95.5L44.1 97.1L49.2 99.9L50.7 99.2L52.9 100L57.4 98.2L55.2 91.8L58.9 87.6L58 86.4L58.6 84.2L58.1 80.1L58.5 83.8L57.6 86L56.7 84.7L53.9 84.9L54.2 84.1L53.1 84.1L53.1 84.9L48.6 85.2L48.5 77.5L50.3 77.5L49.7 75.5L50.9 74.9L50.8 65.4L57.6 64.4L58 62.2L57.1 60.6L55.4 60.5L54.5 62.2L54.2 54.9L56.6 54.9L56.4 50.9L62.7 51.2L62.6 43.5L66.2 43.4L67.5 37.7L64.5 37.7L64.5 35.8L66.1 33.4L64.6 33.8L63.4 32.1L64.2 31L63.7 29.7L58.1 29.6L57 33.2L54.6 33.6L54.5 34.5L51 28.6L47.2 27.8L46.7 28.9L45.5 28.7L42.5 30.7L40.9 27.8L40.4 22.5L39.2 22.2L40.2 20.6L43.2 20.6L43.5 18.3L52.8 18.2L52.8 13.7L54.2 13.4L54.1 11.1L56.5 11.1L56.5 8.8L50.2 9.3L50.2 7L48.5 6.9L48.5 8.1L41.2 9.2L39.6 9L39.3 8.1L37.2 8.3L37.6 6.9L36.9 6.1L34.5 8.1L33.9 7.2L35.1 5.8L34.6 4.6L35.8 3L34.6 2.4L34.6 1.2L33.5 1.2L33.2 2L32.8 1.2L23.1 1L21.6 0L17.7 3.6L16 3.2L16.8 6.1L13.1 6.7L10.7 5.4L9.5 9.9L8 9.4L4.6 10.7L4.9 15.7L2.8 15.7L2.4 17.4L1.3 18L2 19.6L0 20.2L0 22.5L1.5 22.2L1.4 23.3ZM29 54.4L31.5 53L32.6 53.4L32.5 51.6L39.3 47.7L38 50.2L38.9 50.3L38.8 51.4L39.7 50.8L39.9 52.4L40.9 51.8L40.8 53.7L43.7 51.9L44.3 53L43.5 55.1L41.5 54.9L41.5 55.9L39 55.9L39 56.8L37.9 57L34.5 54.9L34.9 52.7L34.5 53.4L33.4 52.7L32.7 53.6L31.2 53.8L31.2 54.9L30.4 54ZM31.7 39L33.7 38.7L34.1 37.2L35.2 38.4L35.7 35.5L36.5 36L35.8 38.9L39.4 37.8L42.7 38.4L42.7 39.2L41.5 39.5L38.3 39.3L39.2 40.6L36.5 41.2L36.5 41.9L38.5 42.2L38.9 43.4L34.5 44.2L34.5 44.9Z" },
    ch: { w: 100, h: 63.5, fill: 0.54, gap: 8, d: "M57.7 0L61.1 1.4L62.4 4.1L62.8 2.2L64.8 5.1L72.8 4.7L79.4 8.4L82 13.6L78.8 17.1L77.6 24.1L86.4 25.1L86.4 27.8L91.5 30.8L94.3 30L97 26L99.9 27.7L97.6 35.8L100 38L99.6 40.3L95.6 40.1L94.4 37.4L90.2 40.3L90.1 43.6L92.8 44.7L91.5 47L92.4 50.3L90.1 50.4L88.1 45.6L83.3 46.5L82.8 48.4L79.2 48L77.3 45.7L77.3 41.5L76.2 42.8L73.3 41.8L73.4 48.2L67.3 56.5L66.9 58.6L69.1 60.9L67.5 63.5L65.2 63.1L64.8 59L62.4 58L63.8 55.3L58.5 53.8L54.8 49.7L54.9 42.9L47 49.2L48.5 53L42.1 60.4L35.1 58.1L31.4 61L25.2 62.2L21.6 55.7L20.3 56.2L20.8 53.7L18.6 53.3L20 48.7L18 46.3L19.1 44.1L16 43.2L8.4 44.8L5.8 47.7L7.5 50.5L4 53.2L0 53.5L4.7 46L2.4 44.4L4.4 40.3L3.4 39.3L10.9 33L10.5 28L16.8 24.1L24.3 15.1L20.4 14.5L22.6 10L27.4 10L26.8 11.6L28.6 12.2L31.9 11.8L37.3 6.7L38.4 8.7L41.1 7L46.9 7.9L49.5 5.9L55.3 7.5L58.9 5L54 4.2Z" },
    tx: { w: 100, h: 93.2, fill: 0.467, gap: 8, d: "M27.7 0L50.6 0L50.6 17L52.8 18.5L55.3 17.9L56.8 20L62.2 21.3L65 20.5L66.1 22.9L68.5 22L70.1 23.4L71.9 22.6L72.5 24.3L74.1 22.2L78.3 24.5L80 23.3L87 22.2L93.3 25.8L96 25.8L96 39.4L100 47.9L98.3 52.1L98.6 56.3L96.9 58.6L97.6 59.6L90.8 62.3L92.6 61L90.5 60.8L90.6 58.7L89.1 59.5L89.5 62.9L87.5 64.6L90.8 62.7L73.5 75.1L70.6 81.7L72.3 91.1L70.7 86.9L70.7 80L72.9 75.1L77.9 70.8L75.9 71.6L75.2 70.7L74 73.2L72.3 73.1L73.3 73.9L72.1 75.8L69.7 75.3L71.5 77L70.3 80.2L68.6 80.7L70.3 80.7L70.1 86.5L72.4 92.2L70.6 93.2L57.6 88.3L54.8 82.8L54.3 78.1L48.4 71.8L44.6 63.4L39.9 58.9L33.1 57.9L30.3 59.1L28.6 63.7L25.6 65.7L16.3 60L13.1 51.5L0.1 40.5L0.2 39.3L27.3 39.3Z" }
  };
  // largest reference that fits up to 60 times, else the smallest bigger one
  const closestRef = (m2) => {
    const R = M.landRefs.slice().sort((x, y) => x.m2 - y.m2);
    return R.filter((g) => g.m2 <= m2 * 1.05 && m2 / g.m2 <= 60).pop() || R.find((g) => g.m2 > m2) || R[R.length - 1];
  };
  function sayRef(m2, ref, em) {
    const ratio = m2 / ref.m2, [one, many] = LAND_SAY[ref.id], wrap = (s) => (em ? `<em>${esc(s)}</em>` : esc(s));
    const n = ratio >= 1000 ? fmtCount(ratio) : nf(ratio);
    if (Math.abs(ratio - 1) < 0.05) return `the size of ${wrap(one)}`;
    if (ratio < 1) return `${wrap(`${nf(ratio * 100)}%`)} of ${esc(one)}`;
    return wrap(many.startsWith("×") ? `${n}${many}` : `${n} ${many}`);
  }
  // area a (m²) as filled copies of the reference, drawn to scale with its markings on top
  function landArt(a, ref) {
    const sh = SHAPE[ref.id], { w, h } = sh, gap = sh.gap || 0, k = a / ref.m2, BW = 360, BH = 220, P = 3;
    const fillShape = (f, x, y) => sh.d
      ? `<path class="ai" fill="url(#fp${f < 1 ? 2 : ""})" d="${sh.d}" transform="translate(${x + (w / 2) * (1 - Math.sqrt(f))} ${y + (h / 2) * (1 - Math.sqrt(f))}) scale(${Math.sqrt(f)})"/>`
      : h > w ? `<rect class="ai" fill="url(#fp)" x="${x}" y="${y + h * (1 - f)}" width="${w}" height="${Math.max(h * f, h * 0.004)}"/>`
      : `<rect class="ai" fill="url(#fp)" x="${x}" y="${y}" width="${Math.max(w * f, w * 0.004)}" height="${h}"/>`;
    const artAt = (x, y) => `<g transform="translate(${x} ${y})">${sh.d ? `<path d="${sh.d}"/>` : sh.art}</g>`;
    const gndAt = (x, y) => sh.d ? `<path class="gnd" d="${sh.d}" transform="translate(${x} ${y})"/>` : `<rect class="gnd" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    const n = Math.max(1, Math.ceil(k - 1e-9));
    let gnd = "", fills = "", art = "", gw, gh;
    if (n <= 100) {
      let best = null;
      for (let c = 1; c <= n; c++) {
        const rows = Math.ceil(n / c), tw = c * w + (c - 1) * gap, th = rows * h + (rows - 1) * gap, s = Math.min(BW / tw, BH / th);
        if (!best || s > best.s) best = { c, s, tw, th };
      }
      for (let i = 0; i < n; i++) {
        const x = (i % best.c) * (w + gap), y = Math.floor(i / best.c) * (h + gap);
        gnd += gndAt(x, y);
        fills += fillShape(Math.min(1, k - i), x, y);
        art += artAt(x, y);
      }
      gw = best.tw; gh = best.th;
    } else {
      // too many to tile: one square of the floor, the reference at the same scale in its corner
      const side = Math.sqrt(a / ref.m2 * w * h * (sh.fill || 1));
      fills = `<rect class="ai" fill="url(#fp)" width="${side}" height="${side}"/>`;
      gnd = gndAt(0, side - h);
      art = artAt(0, side - h);
      gw = gh = side;
    }
    const s = Math.min(BW / gw, BH / gh), p = P / s;
    // floor texture: the floor icon (⊞) tiled, 16 px per tile on screen
    const pat = (id, u) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${16 * u}" height="${16 * u}"><rect class="fpbg" width="${16 * u}" height="${16 * u}"/><path class="fpc" stroke-width="${u}" d="M${2.5 * u} ${2.5 * u}h${11 * u}v${11 * u}h${-11 * u}zM${8 * u} ${2.5 * u}v${11 * u}M${2.5 * u} ${8 * u}h${11 * u}"/></pattern>`;
    const defs = `<defs>${pat("fp", 1 / s)}${sh.d && k % 1 ? pat("fp2", 1 / s / Math.sqrt(k % 1)) : ""}</defs>`;
    return { w: Math.round(gw * s + 2 * P), h: Math.round(gh * s + 2 * P), vb: `${-p} ${-p} ${gw + 2 * p} ${gh + 2 * p}`, html: defs + (n <= 100 ? gnd + fills : fills + gnd) + `<g class="art">${art}</g>`, cls: ref.id };
  }
  const infoCompute = (b) => infoPop(b, "How compute is estimated",
    `<p>GPU time = electricity ÷ ${F.gpuKW.v} kW per H100-class GPU, all-in, at ${F.draw.v * 100}% of peak on average. Spare capacity kept idle is not counted.</p><p>One request runs on one copy of the model, usually one ${SERVER}-GPU server, shared with many other requests at once. A bigger task takes longer rather than using more servers: tokens are generated one after another. Many people at once need many servers.</p><p>${F.gpusPerRack.v} GPUs per rack, ${F.dcMW.v} MW data centres.</p><p>Hardware, power and land follow the rate of use, so they stay the same over a longer period. Electricity, water and CO₂ add up over the period.</p><div class="srcs">${srcLinks(["epoch", "dgx", "superpod", "epochdc", "nebius"])}</div>`);
  function renderLand(r) {
    const a = r.floor[1], st = r.site[1], ref = closestRef(a), sref = closestRef(st);
    $("#landSay").innerHTML = r.servers[1] === 1 ? `One shared server: about ${sayRef(a, ref, true)}` : `About ${sayRef(a, ref, true)}`;
    const gpuSec = (r.gpuH[1] / SERVER) * 3600, racks = r.fullRacks[1];
    const countTxt = r.count === 1 ? `1 ${r.t.name.replace(/^./, (ch) => ch.toLowerCase())}` : `${r.count < 1e6 ? nf(Math.round(r.count), 6) : fmtCount(r.count)} ${PLURAL[r.t.id]}`;
    $("#landCompute").innerHTML = (gpuSec <= r.hours * 3600
      ? `${esc(countTxt)} = <b>one ${SERVER}-GPU server for ${esc(fmtD(gpuSec))}</b>`
      : `${esc(countTxt)} = <b>${esc(fmtCount(r.running[1]))} GPUs non-stop</b> for ${esc(r.span)}, in ${esc(fmtCount(racks))} rack${racks > 1 ? "s" : ""}`)
      + ` <button type="button" class="info" id="infoCompute" aria-label="How compute is estimated">i</button>`;
    $("#infoCompute").addEventListener("click", (e) => infoCompute(e.currentTarget));
    const art = landArt(a, ref), svg = $("#landSvg");
    svg.setAttribute("viewBox", art.vb);
    svg.setAttribute("width", art.w);
    svg.setAttribute("height", art.h);
    svg.setAttribute("aria-label", `Data-centre floor drawn to scale against ${ref.label}`);
    svg.innerHTML = art.html;
    svg.setAttribute("class", art.cls);
    $("#landLegend").innerHTML = `<span><span class="sw floor"></span>Data-centre floor: ${esc(fmtA(a))}</span><span><span class="sw ref ${ref.id}"></span>${esc(ref.label)} (${esc(ref.note)})</span>`;
    $("#landMeta").textContent = `Drawn to scale. Its share of the whole site, with roads, substations and space between buildings, is about ${fmtA(st)}, or ${sayRef(st, sref)}. Floor counts whole ${SERVER}-GPU servers, at least one: a lab model needs a full server, shared by many users at once. It includes aisles, cabling, power and cooling rooms and walls.`;
  }

  /* ---------- compare */
  const cmpInfo = (b, c) => infoPop(b, c.label, `<p>${esc(c[basisId()].qty)} per person a year (${esc(M.bases[basisId()].label)}).</p><p>${esc(c.note)}</p><div class="srcs">${srcLinks(c.src)}</div>`);
  const taskInfo = (b, t) => infoPop(b, t.name, `<p style="color:var(--ink)">${esc(t.desc)}</p><p class="${t.conf}">${CONF[t.conf]}</p><p>${esc(nf(t.wh[1]))} Wh (${esc(nf(t.wh[0]))}–${esc(nf(t.wh[2]))}) per task · ${esc(t.basis)}.</p><p>${esc(t.note)}</p><div class="srcs">${srcLinks(t.src)}</div>`);
  function renderCompare(r) {
    const grp = adopt() ? r.users : r.people;
    const m = state.metric, ai = r[m], who = grp === 1 ? "1 person" : `${fmtCount(grp, 3)} ${adopt() ? "daily AI users" : "people"}`;
    const items = M.comparisons.filter((c) => state.compare.has(c.id)).map((c) => {
      const per = c[basisId()][m];
      return { c, v: per == null ? null : per * grp * (r.days / 365) };
    });
    const out = $("#cmpOut");
    if (state.view === "bars") {
      logChart(out, [{ label: "AI, this scenario", v: ai[1], lo: ai[0], hi: ai[2], cls: "ai", tip: `AI, this scenario: ${FMT[m](ai[1])} (${FMT[m](ai[0])}–${FMT[m](ai[2])}) for ${who} over ${r.span}` }].concat(items.map(({ c, v }) =>
        v == null ? { label: c.label, na: `no ${METRIC[m]} figure` }
          : { label: c.label, sub: esc(c[basisId()].qty) + " each a year", v, valSub: v >= ai[1] ? `${esc(fmtCount(v / ai[1]))}× the AI` : `AI is ${esc(fmtCount(ai[1] / v))}×`, tip: `${c.label}: ${FMT[m](v)} for ${who} over ${r.span}`, info: (b) => cmpInfo(b, c) })), { fmt: FMT[m], log: false });
      return;
    }
    const gauge = (ic, ratio) => {
      if (!(ratio > 0) || !isFinite(ratio)) return "";
      const one = (f) => `<span class="gi"><svg class="bg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${ICON[ic]}"/></svg><svg class="fg" viewBox="0 0 24 24" style="clip-path:inset(${100 - (f >= 0.01 ? Math.min(1, f) * 100 : 0)}% 0 0 0)"><path fill-rule="evenodd" d="${ICON[ic]}"/></svg></span>`;
      if (ratio > 10) return one(1) + `<span class="times">× ${esc(fmtCount(ratio))}</span>`;
      let s = "";
      for (let i = 0; i < Math.max(1, Math.ceil(ratio - 0.02)); i++) s += one(ratio - i);
      return s;
    };
    out.innerHTML = `<p class="legend"><span><span class="sw" style="background:var(--line)"></span>1 icon = what ${esc(who)} already use${grp === 1 ? "s" : ""} over ${esc(r.span)}</span><span><span class="sw" style="background:var(--hot)"></span>AI's ${esc(METRIC[m])}: ${esc(FMT[m](ai[1]))}</span></p>`
      + items.map(({ c, v }) => {
        const head = `<div class="cname"><span class="t">${esc(c.label)} <button type="button" class="info" data-cmp="${c.id}" aria-label="About ${esc(c.label)}">i</button></span><small>${v == null ? `No ${METRIC[m]} figure` : `${esc(FMT[m](v))} over ${esc(r.span)}`}</small></div>`;
        if (v == null) return `<div class="crow na">${head}<div class="cgauge">—</div><div class="cratio">—</div></div>`;
        const ratio = ai[1] / v;
        return `<div class="crow">${head}<div class="cgauge" role="img" aria-label="AI is ${esc(fmtRatio(ratio))} of this">${gauge(CMP_ICON[c.id], ratio)}</div><div class="cratio">${esc(fmtRatio(ratio))}<small>${ratio >= 1 ? "times" : "of"} what they ${esc(c.phrase)}</small></div></div>`;
      }).join("");
    out.querySelectorAll("[data-cmp]").forEach((b) => {
      const c = M.comparisons.find((q) => q.id === b.dataset.cmp);
      b.addEventListener("click", () => cmpInfo(b, c));
    });
  }

  /* ---------- render */
  function render() {
    fixPeriod();
    const r = compute(), t = r.t;
    const once = r.once;

    // equation
    const setTok = (k, text) => document.querySelectorAll(`.tok[data-k="${k}"]`).forEach((b) => { b.textContent = text; });
    setTok("task", t.name);
    $("#article").textContent = /^[aeiou]/i.test(t.name) ? "an" : "a";
    setTok("freq", r.people > 1 ? `${r.f.label} each` : r.f.label);
    setTok("people", peopleLabel());
    const pl = M.periods[state.period].label.toLowerCase();
    setTok("period", once ? (state.own ? (t.dur < 86400 ? "within a day" : `over ~${fmtD(t.dur)}`) : `within a ${pl}`) : `for a ${pl}`);
    $("#eqres").textContent = `= ${fmtE(r.kwh[1])} · ${fmtM(r.co2[1])} CO₂`;
    const one = t.name.replace(/^./, (ch) => ch.toLowerCase());
    const total = t.media ? `${fmtCount(r.count)} ${r.count === 1 ? one : PLURAL[t.id]}` : `${fmtCount(r.tokens)} tokens`;
    const grid = `<button type="button" class="tok sm" id="tokGrid2" aria-haspopup="dialog" aria-expanded="false">${esc(r.g.say || r.g.label)}</button>`;
    $("#taskline").innerHTML = `<span>${r.count === 1 ? "For inference only" : `<b>${esc(total)}</b> for inference only`}, powered by the ${grid}.<br>One ${esc(one)} = ${t.media ? "" : `~${esc(fmtCount(t.tokens))} tokens · `}${esc(fmtE(t.wh[1] / 1000))} · ${esc(t.time)} (~${esc(fmtD(serverSec(t.wh[1])))} of ${SERVER}-GPU server time) · <span class="${t.conf}">${CONF_SHORT[t.conf]}</span></span><button type="button" class="info" id="infoTask" aria-label="About this task">i</button>`;
    $("#infoTask").addEventListener("click", (e) => taskInfo(e.currentTarget, t));
    $("#tokGrid2").addEventListener("click", (e) => openPop(e.currentTarget, "Data centres run on", popGrid));
    document.querySelectorAll("#scenarios .chip").forEach((b) => b.setAttribute("aria-pressed", "false"));

    // footprint
    const conf = (c, sfx = "") => `<span class="cf ${c}" title="${CONF[c]}${sfx}">${CONF_SHORT[c]}${sfx}</span>`;
    const stat = (cls, ic, k, v, rng, c, id, sfx) => `<div class="stat ${cls}">${svgIcon(ic)}<span class="k">${k}</span><button type="button" class="info" data-stat="${id}" aria-label="About ${k}">i</button><span class="v">${esc(v)}</span><span class="r"><span class="rg">${esc(rng)} </span>${conf(c, sfx)}</span></div>`;
    const oneServer = r.servers[1] === 1;
    $("#stats").innerHTML =
      stat("e", "bolt", "Energy", fmtE(r.kwh[1]), `${fmtE(r.kwh[0])} – ${fmtE(r.kwh[2])}`, t.conf, "e", t.conf === "good" ? " per task" : "") +
      stat("l", "land", "Floor space", fmtA(r.floor[1]), oneServer ? `1 shared ${SERVER}-GPU server` : `${fmtA(r.floor[0])} – ${fmtA(r.floor[2])}`, "guess", "l") +
      stat("w", "drop", "Water", fmtW(r.water[1]), `${fmtW(r.water[0])} – ${fmtW(r.water[2])}`, "guess", "w") +
      stat("c", "cloud", "CO₂", fmtM(r.co2[1]), `${fmtM(r.co2[0])} – ${fmtM(r.co2[2])}`, t.conf === "good" ? "rough" : t.conf, "c");
    const statInfo = {
      e: ["Energy", `<div class="val">${esc(fmtE(r.kwh[0]))} – ${esc(fmtE(r.kwh[2]))}</div><p>Inference only: training the models, making the chips, building the data centres and shipping the equipment are not included.</p><p>Electricity: ${esc(nf(t.wh[1]))} Wh per task × ${esc(fmtCount(r.count))} tasks. Includes cooling and other data-centre overhead.</p><p>${esc(t.note)}</p><div class="srcs">${srcLinks(t.src)}</div>`],
      w: ["Water", `<div class="val">${esc(fmtW(r.water[0]))} – ${esc(fmtW(r.water[2]))}</div><p>${esc(fmtW(r.waterOn[1]))} evaporated cooling the data centre + ${esc(fmtW(r.waterOff[1]))} at power plants.</p><p>${esc(F.onsiteWater.note)}</p><p>${esc(r.g.note)}</p><div class="srcs">${srcLinks(F.onsiteWater.src.concat(r.g.src))}</div>`],
      l: ["Floor space", `<div class="val">${esc(fmtA(r.floor[0]))} – ${esc(fmtA(r.floor[2]))}</div><p>Data-centre floor for ${esc(fmtCount(r.servers[1]))} whole ${SERVER}-GPU server${r.servers[1] > 1 ? "s" : ""}${oneServer ? `, the smallest unit a lab model runs on, shared with many other users at once` : ""}. It includes aisles, cabling, power and cooling rooms and walls: ${esc(nf(F.buildingM2perMW.v[1]))} m² per MW of IT power. With roads, substations and space between buildings, the site is ${esc(fmtA(r.site[1]))}.</p><p>${esc(F.buildingM2perMW.note)}</p><div class="srcs">${srcLinks(F.buildingM2perMW.src.concat(F.landM2perMW.src))}</div>`],
      c: ["CO₂", `<div class="val">${esc(fmtM(r.co2[0]))} – ${esc(fmtM(r.co2[2]))}</div><p>${esc(fmtE(r.kwh[1]))} × ${esc(nf(r.g.co2 * 1000))} g per kWh on the ${esc(r.g.label)}. The grid follows the country; change it below the figures.</p><p>${esc(r.g.note)}</p><div class="srcs">${srcLinks(r.g.src)}</div>`]
    };
    $("#stats").querySelectorAll("[data-stat]").forEach((b) => b.addEventListener("click", () => infoPop(b, ...statInfo[b.dataset.stat])));

    renderPower(r);
    renderLand(r);

    // everyday
    const eqv = { co2: r.co2[1], water: r.water[1], land: r.floor[1] };
    const homeDays = r.kwh[1] / r.b.homeKWhPerDay;
    const home = { id: "home", icon: "house", per: "kwh", value: r.b.homeKWhPerDay, n: homeDays, label: `days of one person's home electricity (${r.b.short})`,
      amt: `${nf(r.b.homeKWhPerDay)}kWh`, each: `${nf(r.b.homeKWhPerDay)}kWh a day`, src: M.rungs.find((g) => g.id === "home").src };
    const eqs = M.equivalents.filter(local).map((e) => {
      const amt = `${FMT[e.per](e.value).replace(/^([\d.,]+) /, "$1")}${e.per === "co2" ? " CO₂" : ""}`;
      return { ...e, icon: EQ_ICON[e.id], n: eqv[e.per] / e.value, amt, each: `${amt} each${EQ_ICON[e.id] === "car" ? " km" : ""}` };
    })
      .filter((e) => !(e.id === "pool" && e.n < 1) && !(e.id === "shower" && e.n > 1e7)).concat(home);
    $("#equivs").innerHTML = eqs.map((e, i) => `<button type="button" class="equiv" data-i="${i}">${svgIcon(e.icon)}<b>${esc(fmtCount(e.n))}</b><span>${esc(e.label)}</span><small>${esc(e.each)}</small></button>`).join("");
    $("#equivs").querySelectorAll(".equiv").forEach((b) => {
      const e = eqs[b.dataset.i], tot = { co2: r.co2[1], water: r.water[1], kwh: r.kwh[1] }[e.per];
      b.addEventListener("click", () => infoPop(b, e.label.replace(/^./, (ch) => ch.toUpperCase()), `<div class="val">${esc(e.each)}</div>${e.note ? `<p>${esc(e.note)}.</p>` : ""}<p>This scenario's ${METRIC[e.per]}, ${esc(FMT[e.per](tot))}, ÷ ${esc(e.amt)} = ${esc(fmtCount(e.n))}.</p><div class="srcs">${srcLinks(e.src || [])}</div>`));
    });

    // compare
    const grp = adopt() ? r.users : r.people;
    $("#cmpWho").textContent = grp === 1 ? "1 person" : `${fmtCount(grp, 3)} ${adopt() ? "daily AI users" : "people"}`;
    $("#cmpVerb").textContent = grp === 1 ? "uses" : "use";
    $("#tokCountry").textContent = basisId() === "World" ? "the world" : r.b.label;
    $("#tokCountry").disabled = !!LOCK[state.people];
    $("#tokGrid").textContent = r.g.label.replace(/ \(.*\)/, "");
    document.querySelectorAll("#metric button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.metric)));
    document.querySelectorAll("#view button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.view)));
    $("#cmpChips").innerHTML = M.comparisons.map((c) => `<button type="button" class="chip" data-id="${c.id}" aria-pressed="${state.compare.has(c.id)}">${esc(c.label)}</button>`).join("");
    renderCompare(r);

    // tasks
    logChart($("#taskChart"), M.tasks.map((tk, i) => ({
      label: tk.name, sub: esc(CONF[tk.conf]), v: tk.wh[1], lo: tk.wh[0], hi: tk.wh[2], cls: i === state.task ? "sel" : "",
      tip: `${tk.name}: ${nf(tk.wh[1])} Wh (${nf(tk.wh[0])}–${nf(tk.wh[2])})`, info: (b) => taskInfo(b, tk)
    })), { fmt: (wh) => fmtE(wh / 1000), log: state.taskLog, onScale: (on) => { state.taskLog = on; render(); }, onClick: (i) => { state.task = i; render(); } });

    if (pop.update) pop.update();
  }

  /* ---------- static content */
  function renderStatic() {
    $("#scenarios").innerHTML = M.scenarios.map((s, i) => `<button type="button" class="chip" data-i="${i}">${esc(s.label)}</button>`).join("");
    $("#uncTable tbody").innerHTML = M.uncertainty.map((u) => `<tr><td>${esc(u.what)}</td><td><span class="pill ${u.level}">${CONF[u.level]}</span></td><td>${esc(u.why)}</td><td class="srcs">${u.src ? srcLinks(u.src) : "—"}</td></tr>`).join("");
    $("#method").innerHTML = [
      "Tasks = people × share using AI × uses per day × days. “Once” = each person once, over the task's own duration.",
      "Electricity = tasks × electricity per task, including data-centre overhead.",
      `GPU time = electricity ÷ (${F.gpuKW.v} kW per H100-class GPU, all-in, × ${F.draw.v * 100}% average draw). Server time = GPU time ÷ ${SERVER}.`,
      `GPUs = GPU time ÷ hours in the period. Racks = GPUs ÷ ${F.gpusPerRack.v}. Data centres = IT power ÷ ${F.dcMW.v} MW.`,
      "Floor and site = whole servers (at least one) × IT power per server × area per MW.",
      "Power draw = electricity ÷ hours in the period.",
      "Water = electricity × (cooling + power-plant water). CO₂ = electricity × grid carbon intensity.",
      "Comparisons: per-person averages for everyone in the group, over the same period: Swiss, US or Australian averages, and world averages for the world. Inference only: training the models, making the chips, building the data centres and shipping the equipment are not included."
    ].map((s) => `<li>${esc(s)}</li>`).join("");
    const frow = (f, val) => `<tr><td>${esc(f.label)}</td><td class="num">${esc(val)}</td><td>${esc(f.note)}</td><td class="srcs">${srcLinks(f.src)}</td></tr>`;
    const tri = (v, u) => `${nf(v[1])} ${u} (${nf(v[0])}–${nf(v[2])})`;
    $("#factorTable tbody").innerHTML = frow(F.gpuKW, `${F.gpuKW.v} kW`) + frow(F.pue, `${F.pue.v} (${F.pue.range.join("–")})`)
      + frow(F.draw, `${F.draw.v * 100}% (${F.draw.range.map((x) => x * 100).join("–")}%)`) + frow(F.serverGPUs, `${SERVER}`) + frow(F.gpusPerRack, `${F.gpusPerRack.v}`) + frow(F.dcMW, `${F.dcMW.v} MW`)
      + frow(F.buildingM2perMW, tri(F.buildingM2perMW.v, "m²/MW")) + frow(F.landM2perMW, tri(F.landM2perMW.v, "m²/MW")) + frow(F.onsiteWater, tri(F.onsiteWater.v, "L/kWh"))
      + Object.values(M.grids).map((g) => `<tr><td>${esc(g.label)}</td><td class="num">${nf(g.co2 * 1000)} g/kWh<br>${nf(g.water)} L/kWh</td><td>${esc(g.note)}</td><td class="srcs">${srcLinks(g.src)}</td></tr>`).join("");
    const cell = (d) => `${esc(d.qty)}<br>${d.co2 != null ? nf(d.co2, 3) + " kg CO₂" : "—"} · ${d.kwh != null ? nf(d.kwh, 3) + " kWh" : "—"} · ${d.water != null ? fmtW(d.water) : "—"}`;
    const ids = Object.keys(M.bases), cids = ids.filter((id) => id !== "World");
    $("#baseTable thead tr").innerHTML = `<th>Item</th>${ids.map((id) => `<th>${esc(id)}</th>`).join("")}<th>Note</th><th>Sources</th>`;
    $("#baseTable tbody").innerHTML = M.comparisons.map((c) => `<tr><td>${esc(c.label)}</td>${ids.map((id) => `<td class="num">${cell(c[id])}</td>`).join("")}<td>${esc(c.note)}</td><td class="srcs">${srcLinks(c.src)}</td></tr>`).join("");
    $("#presetTable thead tr").innerHTML = `<th>Preset</th>${cids.map((id) => `<th>${esc(M.bases[id].label)}</th>`).join("")}`;
    $("#presetTable tbody").innerHTML = M.presets.map((p) => `<tr><td>${esc(p.label)}</td>${cids.map((id) => `<td class="num">${nf(p[id].n, 10)}${p[id].note ? `<br><small>${esc(p[id].note)}</small>` : ""}</td>`).join("")}</tr>`).join("");
    $("#sourceList").innerHTML = Object.values(M.sources).map((s) => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a> <span class="d">${esc(s.d)}</span></li>`).join("");
    $("#prior").innerHTML = M.priorArt.map((p) => `<div><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a><br>${esc(p.what)}</div>`).join("");
  }

  /* ---------- events */
  function bind() {
    const POPS = { task: ["Task", popTask], freq: ["How often, per person", popFreq], people: ["How many people", popPeople], period: ["Time period", popPeriod] };
    document.querySelectorAll(".tok[data-k]").forEach((b) => b.addEventListener("click", (e) => openPop(e.currentTarget, ...POPS[b.dataset.k])));
    $("#tokGrid").addEventListener("click", (e) => openPop(e.currentTarget, "Data centres run on", popGrid));
    $("#tokCountry").addEventListener("click", (e) => openPop(e.currentTarget, "People live in", popCountry));
    $("#infoPower").addEventListener("click", (e) => infoPop(e.currentTarget, "Power draw",
      `<p>Average power = electricity ÷ hours in the period, as if spread evenly. Tap an icon on the line for its value and source.</p><p>Hardware, power and land follow the rate of use, so they stay the same over a longer period. Electricity, water and CO₂ add up over the period.</p>`));
    pop.el.addEventListener("click", (e) => { const a = e.target.closest("[data-goto]"); if (a) { e.preventDefault(); goTo(a.dataset.goto); } });
    $("#infoCompare").addEventListener("click", (e) => infoPop(e.currentTarget, "About the comparisons",
      `<p>Per-person averages (${esc(M.bases[basisId()].label)}) for everyone in the group, over the same period. Australia, Switzerland, the USA and the world always use their own averages. They include people who don't eat beef, drive or fly.</p><p>With "only daily AI users" on, both sides count only those users.</p>`));
    $("#infoLand").addEventListener("click", (e) => infoPop(e.currentTarget, "Data-centre floor space",
      `<p>Counted in whole ${SERVER}-GPU servers, at least one: a lab model needs at least one full server, shared by many users at once. Floor: ${esc(nf(F.buildingM2perMW.v[1]))} m² per MW of IT power (about ${esc(nf(SERVER_MW * F.buildingM2perMW.v[1]))} m² per server, ${esc(nf(RACK_MW * F.buildingM2perMW.v[1]))} m² per rack of ${F.gpusPerRack.v}). Whole site: ${esc(nf(F.landM2perMW.v[1]))} m² per MW (range ${esc(nf(F.landM2perMW.v[0]))}–${esc(nf(F.landM2perMW.v[2]))}), from recent AI campuses. Land is taken up by capacity, not used up by each prompt.</p><p>Hardware, power and land follow the rate of use, so they stay the same over a longer period. Electricity, water and CO₂ add up over the period.</p><div class="srcs">${srcLinks(F.landM2perMW.src.concat(...M.landRefs.map((g) => g.src || [])))}</div>`));
    $("#infoTasks").addEventListener("click", (e) => infoPop(e.currentTarget, "Every task",
      `<p>Electricity for one task, once. Log scale: each gridline is 10× the one before. Whiskers show the low–high range. Click a row to pick that task.</p>`));
    document.querySelectorAll("#metric button").forEach((b) => b.insertAdjacentHTML("afterbegin", svgIcon({ kwh: "bolt", water: "drop", co2: "cloud" }[b.dataset.v])));
    $("#metric").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { state.metric = b.dataset.v; render(); } });
    $("#view").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { state.view = b.dataset.v; render(); } });
    $("#cmpChips").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      state.compare.has(b.dataset.id) ? state.compare.delete(b.dataset.id) : state.compare.add(b.dataset.id);
      render();
    });
    $("#scenarios").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const s = M.scenarios[+b.dataset.i].s;
      Object.assign(state, {
        task: M.tasks.findIndex((t) => t.id === s.task), freq: M.frequencies.findIndex((f) => f.id === s.freq),
        people: s.people, period: M.periods.findIndex((p) => p.id === s.period), own: true, share: null, adoption: s.adoption ?? null, basis: s.basis || state.basis
      });
      render();
      b.setAttribute("aria-pressed", "true");
      window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
    });
    pop.scrim.addEventListener("click", () => closePop());
    pop.el.addEventListener("focusout", (e) => { const t = e.relatedTarget; if (pop.anchor && t && !pop.el.contains(t) && t !== pop.anchor) closePop(); });
    // tabbing past either end returns to the control that opened it
    pop.el.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [...pop.el.querySelectorAll("a, button, input")].filter((n) => !n.disabled && n.offsetParent);
      if (!f.length) return;
      if (!e.shiftKey && document.activeElement === f[f.length - 1]) closePop(true);
      else if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); closePop(true); }
    });
    document.addEventListener("pointerdown", (e) => {
      if (pop.anchor && !pop.el.contains(e.target) && !pop.anchor.contains(e.target) && e.target !== pop.scrim) closePop();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePop(true); });
    window.addEventListener("resize", placePop);
    window.addEventListener("scroll", () => { if (pop.anchor && !pop.el.classList.contains("sheet")) placePop(); }, { passive: true });
    if ("IntersectionObserver" in window) {
      // fixed overlay, so showing it never shifts the page
      const mini = $("#minibar");
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        mini.classList.toggle("show", show);
        mini.inert = !show;
        if (!show && pop.anchor && mini.contains(pop.anchor)) closePop();
      }).observe($("#eqbar"));
    }
  }

  renderStatic();
  bind();
  render();
})();
