# Review prompt (round 2: ChatGPT, Gemini, Codex or a person)

Paste everything below the line. With folder access, the reviewer reads the files; in a web chat, give it the live page and the GitHub repo.

---

Please do a short, critical second-round review of "AI Compute Footprint", a small interactive web page. I'm about to share it with colleagues in higher education.

- Live page: https://heyyeah.github.io/AI_Compute_Footprint/
- Code and data: https://github.com/heyyeah/AI_Compute_Footprint (or the project folder, if you have it; `index.html` opens from the file with no build step).
- Every number, range, note and source is in `data/model.js`. Calculations are in `assets/app.js` (`compute()` and the render functions).

**What it does.** The opening line reads "How much energy, space, water and CO₂ does it take to generate a: [task] × [how often] × [how many people] × [time period]". 16 tasks run from a short answer (0.3 Wh) to a production app (40 kWh); groups run from 1 person to the world. The page shows, in order: a card with energy, data-centre floor space, water and CO₂ (each with a range and a confidence label) plus the tokens and server time; data-centre land drawn to scale against a parking space, tennis court, football pitch, Central Park, Manhattan, Los Angeles, Switzerland or Texas; average power draw on a log ladder from an LED bulb to all electricity worldwide; "footprint in everyday terms" (burgers, car-km, flights, showers, pools); a comparison with what the same people already use (beef, coal, driving, flying, home electricity, home water, total CO₂); and every task on a log chart. Audience: curious non-experts. It aims to be neutral, neither alarmist nor dismissive. Research cut-off: October 2026.

**Changed since the last review** (don't repeat these unless still wrong):
- Australia was added as a country basis (adoption, workers, home electricity, grid, all seven comparison rows, group sizes) and "Mid-size country" uses Australia's population. Countries: Australia, Switzerland, USA, World.
- The compute visual (GPU zoom, clock) was replaced by floor space: whole 8-GPU servers, at least one, × 280 m² of building per MW IT (range 230–310); site land 2,800 m²/MW (800–3,500). One server ≈ 2.8 m².
- Land references switched to mostly US places.
- Already fixed from review 1: LTX-2 9 Wh video low end; Gallup 16%; WIN 15% / 12%; Hausfather 5.9 kWh/day bound; app MVP 10 kWh; "Total CO₂ footprint" labelled fossil CO₂ only; home water marked "supplied, not consumed"; market-based grid kept as an option with a note.

**Please check, briefly:**

1. **Australian data.** Verify every AU figure in `data/model.js` against its source: grid 525 g CO₂e/kWh (Ember) vs 590 g (NGA 2026), power-plant water 0.8 L/kWh (0.6–1.8), adoption 15% (13–23%), workers 18%, home electricity 7.4 kWh/day, and the AU columns of beef, coal, driving, flying, home electricity, home water and total CO₂, plus the AU group sizes. Flag wrong values, unit slips, mismatched years or boundaries (e.g. CO₂ vs CO₂e, lifecycle vs combustion), and anything inconsistent with how CH and US are done.
2. **Floor space and land.** Is 280 m²/MW IT for building floor and 2,800 m²/MW for site land defensible for 2025–26 AI data centres? Is "at least one whole server" an honest minimum? Are the land reference areas right?
3. **The five most consequential assumptions now.** Short answer 0.3 Wh, short video 200 Wh, agentic coding 1 kWh per developer-day, on-site water 0.4 L/kWh plus 1.8 L/kWh at power plants, PUE 1.2. Is there newer (2026) evidence that moves any of them by more than ~30%?
4. **Communication.** Read it as a colleague seeing it for the first time, on a phone and a laptop. Does each section say what it claims at a glance? Anything that misleads through scale, colour, emphasis, labels or missing context (e.g. training not included, market-based CO₂)? Would a sceptic or an enthusiast find it biased? Is the opening line clear?
5. **Quick usability pass.** Try: 1 person, 10 short answers a day, for a year; Australia (mid-size country) chatting for a year; the world making a short video a day; one app MVP once. Note anything confusing, broken or inconsistent.

**Output:**
- Findings by severity (critical / important / minor): what, where, why it matters, concrete fix. Include a source link for every number you dispute.
- A short list of things you checked and found correct.
- Anything you could not verify.
Under 900 words. Don't rewrite the page or comment on code style. Don't change any project files.
