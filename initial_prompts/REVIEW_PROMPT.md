# Review prompt (Argon, ChatGPT or a person)

Paste everything below the line into Argon or ChatGPT, with access to the project folder.

---

Please review a small interactive web page, "AI Compute Footprint", which is in the project folder you have access to.
- Open `index.html` in a browser if you can; it runs from the file with no build step.
- Every number, range, note and source is in `data/model.js`. The calculations are in `assets/app.js` (function `compute()` and the render functions), the layout in `index.html` and `assets/styles.css`.
- If you can't run the page, review it from these files.

What it does: the visitor builds an equation, "How much compute, energy, time and space does it take to generate a: [task] × [how often] × [how many people] × [time period]". There are 16 tasks, from a short answer to a production app, a song or a music video, and groups from 1 person to the whole world. The page shows the compute (hardware from a share of one GPU up to many data centres, and GPU time on a clock), electricity, water, CO₂, average power draw on a ladder from an LED bulb to all electricity worldwide, data-centre land drawn to scale, and comparisons with what the same people already use (beef, coal, driving, flying, home electricity, home water, whole carbon footprint). Audience: curious non-experts and colleagues in higher education. It aims to be neutral, neither alarmist nor dismissive. Research cut-off: October 2026.

Key assumptions to cross-check:
- Electricity per task, facility level (Wh, central): short answer 0.3; image 1.2; simple web page 3; song 5; document draft 8; maths solution 10; interactive web page 25; presentation 35; small program (one agentic coding session) 40; short 5–10 s video 200; full web app 2,000; 30 s animation 2,400; full program 5,000; app MVP 8,000 (about 10 developer-days); music video 14,000; functional app 40,000. Video, song, animation, music video and all agentic-coding numbers are derived, not measured. Agentic coding uses about 1 kWh per developer-day.
- Hardware: 1.5 kW per H100-class GPU all-in; 70% average utilisation; 32 GPUs per rack; 100 MW reference data centre; 2,800 m² of site land per MW of IT power (range 800–3,500).
- Water: 0.4 L/kWh on-site cooling plus power-plant water (US 1.8, Swiss 0.7, European and world use the US value as a stand-in). Fuel water for driving and flying: 0.35 L per kWh of fuel (US crude, Argonne).
- Grid CO₂: European grid 210 g/kWh is the default; also US 350, Swiss 90, world 458, renewable contracts (market-based) 9.
- Daily AI use: Swiss population 15% (BFS, spring 2025); US adults 24% (Pew, Feb 2026); Swiss employees 28% (PwC, 2026); US workers 15% (Gallup, 2026); world about 8% (own estimate, 5–12%).
- Per-person baselines: Swiss or US averages; the "Switzerland", "USA" and "world" groups use their own averages. World figures mix data years 2022–2025.
- Not included: model training, making chips and buildings, which data centre serves a request, and what AI replaces.

A previous review (another AI) led to these changes, so don't repeat them unless they are still wrong: water and land ranges now include their factor ranges; with "only daily AI users" on, the comparisons count the same users; log-scale charts use dots instead of bars; the song estimate was lowered from 25 to 5 Wh; Swiss home electricity uses the Swiss grid factor; Pew, Delavande and Bai sources were corrected or added; hardware, power and land follow the rate of use (they don't grow with a longer period) by design. Confidence levels are "measured", "estimate" and "rough estimate".

Please review:

1. Data and assumptions. Check the numbers above against their sources and newer evidence. Which are outdated, wrong or misleading, by roughly how much, and what is a better source? Pay most attention to video, songs, agentic coding, the land per MW, water per kWh, and the daily-use shares. Say where the page should show a wider range or a lower confidence.

2. Usability. Can a first-time visitor understand the equation and change each part without help? Try at least: one person, 10 short answers a day, for a year; a medium company (250 people, only daily AI users) building a small program a day; Switzerland chatting for a year; the whole world making a short video a day; building one app MVP once. Check the popovers, the bar that slides in when scrolling, the country and grid choices, Bars vs Icons, the task list, the (i) buttons and their links to "How sure is this?" and "Assumptions and sources", phone width, dark mode, keyboard and screen-reader use.

3. Visual communication. Does each visual say what it claims at a glance: the hardware zoom, the GPU-time clock, the power ladder, the land squares, the comparison bars and icons, the log-scale task chart? Flag anything that misleads through scale, colour or emphasis, or that a non-expert would misread.

Output:
- Findings ordered by severity (critical / important / minor). For each: what you saw, where, why it matters, and a concrete fix.
- The five numbers most likely to be wrong, each with a better value and a source link.
- Anything the page claims that you could not verify.
Keep it under 1,200 words. Don't rewrite the page and don't comment on code style.
Don't change any files. Save your review as `reviews/<your name>.md` in the project folder.
