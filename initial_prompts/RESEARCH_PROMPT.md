# Deep research prompt (ChatGPT Deep Research or Gemini Deep Research)

Paste everything below the line.

---

I am checking the numbers behind an interactive page about the physical footprint of generative AI. Today is October 2026. Please do a deep, source-first review and report back in tables. Prefer primary sources (peer-reviewed papers, company disclosures, IEA, LBNL, Uptime Institute, NVIDIA documentation, EIA/EPA, Swiss BFE/BAFU/BFS). Give every number a URL and a date, mark anything you derived yourself, and say plainly where no measurement exists.

1. **Prior art.** Has anyone already built an interactive tool that combines (a) generative-AI tasks from a single question up to building a production app, a song or a music video, (b) scaling from one person to the whole world, (c) physical infrastructure (GPU-hours, racks, data centres, floor area, land) and (d) comparisons with beef, coal, driving and flying for the same population? List the closest matches and what each lacks.

2. **Energy per task (Wh, facility level incl. PUE), low/central/high, plus tokens and wall-clock time.** Check or improve these central values: simple chatbot answer 0.3; one 1024px image 1.2; one-shot static web page 3; 2,000-word draft 8; maths solution with a reasoning model 10; interactive web page over several iterations 25; 3-minute song (Suno/Udio class) 25; 10–15 slide presentation 35; one agentic coding session 40; one 5–10 s video clip 200; full web app (1–3 developer-days of agentic coding) 2,000; 30 s animation 2,400; full program 5,000; app MVP 8,000; 3-minute music video 14,000; production app 40,000. In particular find: any measured or disclosed energy for closed image, video or music models (Veo, Sora, Kling, Nano Banana, GPT-image, Suno); the per-model table in "Lights, Camera, Carbon" (arXiv 2607.04553); and the best current estimate of energy per agentic coding session or developer-day (Couch Jan 2026 says median 41 Wh; Hausfather Aug 2026 says 600 Wh; explain the gap).

3. **Infrastructure conversions.** All-in facility kW per H100-equivalent GPU (I use 1.5 kW); GPUs per rack (I use 32; NVL72 is 72); average utilisation of inference fleets (I use 70%); a sensible "typical" AI data centre size (I use 100 MW IT); building m² per MW (I use 280) and site land m² per MW (I use 2,800). Look for JLL, CBRE, Cushman & Wakefield or permit filings.

4. **Water and carbon per kWh.** On-site consumptive WUE (I use 0.4 L/kWh); power-plant water for US, Swiss and world grids (I use 1.8 / 0.7 / 1.8 L/kWh) and how hydro-reservoir evaporation should be treated; grid carbon intensity (US 350, Switzerland 90, world 458, hyperscaler market-based ~9 g CO₂e/kWh). Which data centres actually serve users in Switzerland, and on which grids?

5. **Per-person baselines, Switzerland and USA, per year.** Beef supply (kg), its CO₂e per kg (I use 60) and blue water per kg (I use 650 L); coal use per person; car vehicle-km per person and real-world CO₂ per km (my Swiss value uses 114 g/km for new cars and is a lower bound; find the real fleet value); air travel energy and CO₂ per person; household electricity; household water; consumption-based CO₂ per person.

6. **Adoption.** Latest share of people in Switzerland and the USA who use generative AI daily, and the latest total daily prompts/tokens across major providers, so I can model "average daily use" for a city or country.

Finish with: the five numbers in my list most likely to be wrong, by how much, and why.
