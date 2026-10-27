/* All figures and sources. Energy is facility-level (incl. PUE).
   [low, central, high] = range. DER = derived from cited sources. Cut-off 2026-10-11. */
window.MODEL = {
  version: "2026-10-17",

  /* ------------------------------------------------------------------ TASKS
     Ordered by central electricity per task (ascending). */
  tasks: [
    {
      id: "query", name: "Short answer",
      desc: "A chatbot answer without long reasoning: about 500 tokens in, 300 out.",
      tokens: 800, dur: 8, time: "2–15 s", wh: [0.1, 0.3, 2], conf: "good", basis: "measured",
      note: "Google measured 0.24 Wh for its median Gemini text prompt (0.10 Wh counting only the chips). Epoch AI estimates ~0.3 Wh, OpenAI's CEO 0.34 Wh. Larger or older models measure up to ~1–2 Wh. A lower bound for a chat turn: chats routed to a reasoning model use more (see Maths solution).",
      src: ["google", "epoch", "altman", "jegham"]
    },
    {
      id: "image", media: true, name: "Image",
      desc: "One 1024 × 1024 px image from a modern image model.",
      tokens: 100, dur: 20, time: "3–60 s", wh: [0.1, 1.2, 4], conf: "rough", basis: "measured (open models)",
      note: "Only open models have been measured: Stable Diffusion 3 ~0.6–1.2 Wh with overhead, a 2024 benchmark averaged 2.9 Wh. No numbers exist for Nano Banana, GPT-image or Imagen.",
      src: ["mittr", "luccioni", "bertazzini"]
    },
    {
      id: "webpage", name: "Simple web page",
      desc: "One-shot static HTML page, roughly 3,000 output tokens.",
      tokens: 4000, dur: 45, time: "15–90 s", wh: [0.8, 3, 20], conf: "rough", basis: "derived",
      note: "DER: tokens × per-token energy (0.5–2.5 Wh per 1,000 output tokens).",
      src: ["oviedo", "couch", "jegham"]
    },
    {
      id: "song", media: true, name: "Song",
      desc: "A ~3-minute track from a Suno/Udio-class model, including a few rerolls.",
      tokens: 1000, dur: 900, time: "1–45 min", wh: [0.5, 5, 30], conf: "guess", basis: "derived, no measurement exists",
      note: "No music service has published energy figures. Open audio models make 3 minutes of audio for ~0.1–0.5 Wh of GPU energy; Suno-class models are larger and return two versions per request. Central value includes a few rerolls and server overhead.",
      src: ["audio"]
    },
    {
      id: "doc", name: "Document draft",
      desc: "A ~2,000-word draft with some reasoning (about 5,000 thinking tokens).",
      tokens: 8000, dur: 180, time: "1–5 min", wh: [1.5, 8, 40], conf: "rough", basis: "derived",
      note: "DER from per-token energy. A 5,000-token reasoning answer measures ~3.9 Wh in Oviedo et al.",
      src: ["oviedo", "jegham"]
    },
    {
      id: "maths", name: "Maths solution",
      desc: "A reasoning model working through a non-trivial problem, ~12,000 tokens of thinking.",
      tokens: 12000, dur: 180, time: "20 s–10 min", wh: [1.5, 10, 60], conf: "rough", basis: "measured (some models)",
      note: "Reasoning models use ~30× more energy than direct answers on average (AI Energy Score). DeepSeek-R1 median 10.6 Wh; o3 5–12 Wh; GPT-5 at high effort 17–34 Wh.",
      src: ["oviedo", "jegham", "hfscore"]
    },
    {
      id: "interactive", name: "Interactive web page",
      desc: "HTML + JavaScript built over 3–8 rounds: ~20k output tokens, ~80k mostly cached input.",
      tokens: 100000, dur: 900, time: "5–30 min", wh: [6, 25, 120], conf: "rough", basis: "derived",
      note: "DER from per-token energy; cached input costs ~1/10 of fresh input.",
      src: ["couch", "oviedo"]
    },
    {
      id: "slides", name: "Presentation",
      desc: "10–15 slides: outline and text plus 4–10 generated images, or one agent session.",
      tokens: 300000, dur: 3600, time: "10 min–3 h", wh: [8, 35, 150], conf: "rough", basis: "derived",
      note: "DER: text (~2 Wh) + images (4–10 × 1.2 Wh), or one agentic session (~40 Wh) plus images.",
      src: ["couch", "mittr"]
    },
    {
      id: "program", name: "Small program",
      desc: "One agentic coding session (Claude Code / Codex class): ~600k tokens, ~96% read from cache.",
      tokens: 600000, dur: 1800, time: "15–60 min", wh: [10, 40, 600], conf: "rough", basis: "estimated from real sessions",
      note: "Two careful estimates disagree 15×: Couch finds a median session of 41 Wh (592k tokens); Hausfather finds 600 Wh (~10M tokens, longer sessions).",
      src: ["couch", "hausfather", "ccosts", "bai"]
    },
    {
      id: "video", media: true, name: "Short video",
      desc: "One 5–10 s clip from a modern video model.",
      tokens: 300, dur: 120, time: "0.5–5 min", wh: [10, 200, 1300], conf: "guess", basis: "measured (open models) + estimates",
      note: "Varies hugely by model: open models measure from ~9 Wh (LTX-2, 5 s, GPU only) and 25 Wh (CogVideoX-5B) to 415 Wh (Wan2.1-14B 720p); MIT TR measured CogVideoX at 944 Wh in a different setup. A 5 s standard workload across models: 58–115 Wh. Sora-2-Pro 12 s 1080p estimated ~1.3 kWh. Energy grows roughly with the square of length × resolution.",
      src: ["delavande", "lcc", "mittr"]
    },
    {
      id: "webapp", name: "Full web app",
      desc: "Agentic coding over 1–3 developer-days, ~40M tokens.",
      tokens: 40e6, dur: 172800, time: "1–3 days", wh: [450, 2000, 18000], conf: "guess", basis: "derived (developer-day basis)",
      note: "DER: 0.45 / 1.0 / 3.0 kWh per developer-day of agentic coding (Anthropic's ~$13 average daily spend × ~75 Wh per $ from Couch; heavy use 3 kWh/day, up to 5.9, from Hausfather). Couch assumes price ratios approximate energy ratios.",
      src: ["ccosts", "couch", "hausfather"]
    },
    {
      id: "animation", media: true, name: "Animation",
      desc: "~30 s of generated animation: about 4 clips × 3 attempts.",
      tokens: 1000, dur: 7200, time: "20 min–4 h", wh: [60, 2400, 16000], conf: "guess", basis: "derived",
      note: "DER: 4 clips × (25 / 200 / 1,300 Wh) × retries (1.5 / 3 / 4). Retry counts are our assumption.",
      src: ["delavande", "lcc"]
    },
    {
      id: "program-full", name: "Full program",
      desc: "3–10 developer-days of agentic coding, ~95M tokens.",
      tokens: 95e6, dur: 518400, time: "3–10 days", wh: [1400, 5000, 59000], conf: "guess", basis: "derived (developer-day basis)",
      note: "DER from the developer-day basis (see Full web app).",
      src: ["ccosts", "couch", "hausfather"]
    },
    {
      id: "mvp", name: "App MVP",
      desc: "5–15 developer-days of agentic coding, ~150M tokens.",
      tokens: 150e6, dur: 864000, time: "5–15 days", wh: [2300, 10000, 89000], conf: "guess", basis: "derived (developer-day basis)",
      note: "DER from the developer-day basis (see Full web app).",
      src: ["ccosts", "couch", "hausfather"]
    },
    {
      id: "musicvideo", media: true, name: "Music video",
      desc: "~3 minutes of generated video (~25 clips × ~3 attempts) plus the song.",
      tokens: 3000, dur: 21600, time: "2–12 h", wh: [450, 14000, 79000], conf: "guess", basis: "derived",
      note: "DER: clips × energy per clip × retries, plus one song. The widest range on the page.",
      src: ["delavande", "lcc", "audio"]
    },
    {
      id: "prodapp", name: "Functional app",
      desc: "A production-grade app: 20–60 developer-days of agentic coding, ~760M tokens.",
      tokens: 760e6, dur: 3888000, time: "1–3 months", wh: [9000, 40000, 354000], conf: "guess", basis: "derived (developer-day basis)",
      note: "DER from the developer-day basis. For scale: Anthropic's 16-agent C-compiler build used ~2.1B tokens over two weeks.",
      src: ["ccosts", "couch", "hausfather", "ccompiler"]
    }
  ],

  /* ------------------------------------------------------- INFRASTRUCTURE */
  factors: {
    gpuKW: { v: 1.5, unit: "kW per GPU", label: "Power per H100-class GPU, all-in",
      note: "Includes the GPU's share of CPUs, memory, networking and cooling (Epoch AI). DGX H100: 10.2 kW for 8 GPUs = 1.28 kW IT per GPU × PUE 1.2 ≈ 1.5.",
      src: ["epoch", "dgx"] },
    pue: { v: 1.2, range: [1.1, 1.4], unit: "×", label: "Data-centre overhead (PUE)",
      note: "Hyperscalers 1.08–1.17; global average 1.54 (Uptime). 1.2 for a modern AI facility.",
      src: ["uptime", "googlepue"] },
    draw: { v: 0.7, range: [0.6, 0.8], unit: "", label: "Average GPU power vs. peak",
      note: "Inference GPUs draw 60–80% of peak power on average, so an hour of GPU time uses ~0.7 × 1.5 kW. Spare capacity kept idle is not counted, so GPU numbers are a minimum.",
      src: ["epoch"] },
    serverGPUs: { v: 8, unit: "GPUs", label: "GPUs per server",
      note: "A DGX/HGX H100 server holds 8 GPUs. One copy of a large model usually runs on one server; the biggest models span several servers or a 72-GPU rack.",
      src: ["dgx", "nvl72"] },
    gpusPerRack: { v: 32, unit: "GPUs", label: "GPUs per rack",
      note: "4 × DGX H100 per rack ≈ 41 kW (NVIDIA SuperPOD design guide). A newer GB200 NVL72 rack holds 72 GPUs at ~120 kW.",
      src: ["superpod", "nvl72"] },
    dcMW: { v: 100, unit: "MW IT", label: "One reference data centre",
      note: "100 MW of IT load (~120 MW at the meter). Today's largest AI campuses: Stargate Abilene ~421 MW IT, xAI Colossus 2 ~946 MW.",
      src: ["epochdc"] },
    buildingM2perMW: { v: [200, 330, 450], unit: "m² per MW IT", label: "Building floor area (racks, aisles, cabling, power and cooling rooms, walls)",
      note: "DER per MW of IT power (supply ÷ PUE 1.2 where only supply is given): Meta Hyperion ~230 m², Microsoft Fairwater ~150–300, Nebius Independence ~310–350, Stargate Abilene ~370–440.",
      src: ["nebius", "stargate", "fairwater", "hyperion", "epochdcdata"] },
    landM2perMW: { v: [1700, 2800, 5600], unit: "m² per MW IT", label: "Site land (adds roads, substations and space between buildings)",
      note: "DER per MW of IT power: Abilene first phase ~1,800 m², Fairwater ~1,700–3,500, Nebius ~2,400, Hyperion ~5,600. Campuses hold land for later phases; acreage reports conflict.",
      src: ["nebius", "stargate", "fairwater", "hyperion", "epochdcdata", "stargatesites"] },
    onsiteWater: { v: [0.003, 0.4, 1.1], unit: "L per kWh", label: "Cooling water used on site (consumed)",
      note: "Operators report 0.12 (Amazon) to ~1.0 (Google, implied 0.26 mL per 0.24 Wh prompt). LBNL US average 0.36 rising to ~0.45. Closed-loop sites (Microsoft Fairwater, Nebius Independence) use almost none after the first fill: ~0.003 L/kWh or less (DER).",
      src: ["lbnl", "google", "msftfacts", "msftzero", "fairwater", "nebius"] }
  },

  /* Where the electricity comes from (sets CO2 and power-plant water). */
  grids: {
    au: { label: "Australian grid", co2: 0.525, water: 0.8, waterRange: [0.6, 1.8],
      note: "525 g CO₂e/kWh, 2025 (Ember, lifecycle, incl. rooftop solar). The official location-based factor is higher: 590 g (NGA 2026, FY2024–25, combustion only, excl. rooftop solar), from 210 g in SA and Tasmania to 740 g in Victoria. Water DER: 2025 mix × Australian consumption per fuel (coal 1.5, gas 0.56 L/kWh, 2004–05); 1.8 if tower-cooled coal and hydro-reservoir evaporation are counted.",
      src: ["auember", "aunga", "aunwc", "macknick"] },
    eu: { label: "European grid", co2: 0.210, water: 1.8, waterRange: [0.8, 4.5],
      note: "210 g CO₂e/kWh, EU 2025 (Ember, lifecycle; IEA combustion-only: 170 g). No European water factor found; the US value is used as a stand-in.",
      src: ["embereu", "ieaelec26"] },
    ch: { label: "Swiss grid", co2: 0.090, water: 0.7, waterRange: [0.3, 10],
      note: "90 g CO₂e/kWh consumption mix incl. imports (VSE, 2025 provisional; 57 g for 2024, up to 128 g in BAFU's lifecycle method). Water DER: nuclear share only; counting hydro-reservoir evaporation could raise it many times.",
      src: ["vse", "bafumix"] },
    us: { label: "US grid", co2: 0.384, water: 1.8, waterRange: [0.8, 4.5],
      note: "384 g CO₂e/kWh (Ember, 2025, lifecycle, as for the other grids; EPA eGRID 2023, combustion only: 350 g). Power-plant water 1.8 L/kWh (thermoelectric only; 4.5 if hydro-reservoir evaporation is counted).",
      src: ["emberus", "egrid", "lbnl", "macknick"] },
    world: { label: "World average grid", say: "world average grid", co2: 0.458, water: 1.8, waterRange: [0.8, 4.5],
      note: "458 g CO₂e/kWh (Ember, 2025). No global water factor exists; US value used as a stand-in.",
      src: ["ember"] },
    market: { label: "Renewable contracts (market-based)", say: "grid, counted with renewable contracts", co2: 0.009, water: 1.8, waterRange: [0.8, 4.5],
      note: "~9 g/kWh, how hyperscalers report after buying renewable certificates (Microsoft FY24: 0.26 Mt over 29.8 TWh). The physical grid's emissions are unchanged; their location-based figure is ~334 g.",
      src: ["msftfacts"] }
  },

  /* ----------------------------------------------- PEOPLE & BASELINES */
  bases: {
    AU: {
      label: "Australia", short: "AU",
      adoption: { v: 0.15, label: "About 15% of Australians use generative AI daily (18% of those aged 16+)",
        note: "DER: 18% of people 16+ (range 13–23%) × 81% of the population aged 16+ (ABS, June 2025). ANU/Google survey, Oct 2025: 48.6% have used it; 13% daily or most days. Telsyte, Apr–May 2026: 5.2 million daily users, ~23% of people 16+, but this counts AI built into devices.", src: ["auanu", "autelsyte", "auage"] },
      work: { v: 0.18, label: "18% of Australian workers use generative AI daily at work",
        note: "PwC Hopes and Fears 2026 (1,250 Australian workers, May–Jun 2026); 59% have used AI at work.", src: ["aupwc26", "auanu"] },
      homeKWhPerDay: 7.4
    },
    CH: {
      label: "Switzerland", short: "CH",
      adoption: { v: 0.126, label: "About 13% of people in Switzerland use generative AI daily",
        note: "DER: BFS survey, spring 2025: 3.2 million people aged 15–88 used it in the previous 3 months, 36% of them daily ≈ 1.15 million, or 12.6% of everyone. 43% have used it at all. WIP-CH 2025: 17% daily. Likely higher by now.", src: ["bfspress", "bfsai", "wip"] },
      work: { v: 0.28, label: "28% of employees in Switzerland use generative AI daily at work",
        note: "PwC Hopes and Fears 2026 (996 Swiss employees, May–Jun 2026). Accenture Pulse of Change 2026 found 49% (100 Swiss employees).", src: ["pwc26", "accenture26"] },
      homeKWhPerDay: 6.0
    },
    US: {
      label: "USA", short: "US",
      adoption: { v: 0.19, label: "About 19% of Americans use an AI chatbot daily (24% of adults)",
        note: "DER: 24% of adults (Pew Research, survey Feb 2026, report Jun 2026) × 79% of the population aged 18+ (Census, July 2025).", src: ["pew", "censusage"] },
      work: { v: 0.16, label: "16% of US workers use AI daily at work",
        note: "Gallup, Q2 2026 (30% weekly or more).", src: ["gallup"] },
      homeKWhPerDay: 12.1
    },
    World: {
      label: "World", short: "world",
      adoption: { v: 0.08, label: "About 8% of people worldwide use generative AI daily",
        note: "DER, range 5–12%: ChatGPT ~1 billion weekly users (Aug 2026), Gemini ~1 billion monthly; WIN World AI Index 2026: 15% daily (12% personal use) across 44 countries.", src: ["win26", "msdiffusion"] },
      homeKWhPerDay: 2.4
    }
  },

  /* Population presets. Sorted by size on the page for the chosen basis. */
  presets: [
    { id: "person", label: "1 person", CH: { n: 1 }, US: { n: 1 }, AU: { n: 1 } },
    { id: "team", work: true, label: "A team", CH: { n: 8, note: "assumed 8 people" }, US: { n: 8, note: "assumed 8 people" }, AU: { n: 8, note: "assumed 8 people" } },
    { id: "smallco", work: true, label: "Small company", CH: { n: 50, note: "upper limit, EU small: under 50 staff" }, US: { n: 50, note: "upper limit, EU small: under 50 staff" }, AU: { n: 20, note: "upper limit, ABS small: under 20 staff" }, src: ["eusme", "ausize"] },
    { id: "medco", work: true, label: "Medium company", CH: { n: 250, note: "upper limit, EU medium: under 250 staff" }, US: { n: 250, note: "upper limit, EU medium: under 250 staff" }, AU: { n: 200, note: "upper limit, ABS medium: under 200 staff" }, src: ["eusme", "ausize"] },
    { id: "town", label: "Small town", CH: { n: 5000, note: "assumed 5,000 people" }, US: { n: 5000, note: "assumed 5,000 people" }, AU: { n: 5000, note: "assumed 5,000 people" } },
    { id: "bigco", work: true, label: "Big company", CH: { n: 75883, note: "Example Swiss company: Novartis (75,883 staff, 2024)" }, US: { n: 61000, note: "Example US company: Fortune 500 average (~61,000 staff)" }, AU: { n: 41463, note: "Example Australian company: BHP (41,463 employees, June 2025)" }, src: ["bigco", "aubhp"] },
    { id: "smallcity", label: "Small city", CH: { n: 100000, note: "assumed 100,000 people" }, US: { n: 100000, note: "assumed 100,000 people" }, AU: { n: 100000, note: "assumed 100,000 people" } },
    { id: "bigcity", label: "Big city", CH: { n: 452421, note: "City of Zurich (end 2025)" }, US: { n: 8584629, note: "New York City (2025)" }, AU: { n: 5638830, note: "Greater Sydney (June 2025)" }, src: ["popzh", "popnyc", "ausyd"] },
    { id: "state", label: "State", CH: { n: 1628081, note: "Canton of Zurich, the largest (end 2025)" }, US: { n: 39355309, note: "California, the largest (July 2025)" }, AU: { n: 8670100, note: "New South Wales, the largest (March 2026)" }, src: ["popkzh", "census25", "aurp"] },
    { id: "smallcountry", label: "Small country", CH: { n: 9127100, note: "Switzerland (end 2025)" }, US: { n: 9127100, note: "Switzerland (end 2025)" }, AU: { n: 9127100, note: "Switzerland (end 2025)" }, src: ["popch"] },
    { id: "midcountry", label: "Mid-size country", CH: { n: 27921150, note: "Australia (March 2026)" }, US: { n: 27921150, note: "Australia (March 2026)" }, AU: { n: 27921150, note: "Australia (March 2026)" }, src: ["aurp"] },
    { id: "bigcountry", label: "Big country", CH: { n: 341800000, note: "USA (2025)" }, US: { n: 341800000, note: "USA (2025)" }, AU: { n: 341800000, note: "USA (2025)" }, src: ["popus"] },
    { id: "world", label: "The world", CH: { n: 8300678395, note: "UN estimate for 2026" }, US: { n: 8300678395, note: "UN estimate for 2026" }, AU: { n: 8300678395, note: "UN estimate for 2026" }, src: ["popworld"] }
  ],

  /* Per person per year, for the same population over the same period.
     kwh = energy, co2 = kg CO2e, water = litres (blue / consumptive). null = not meaningful. */
  comparisons: [
    { id: "beef", label: "Eating beef", phrase: "eat in beef",
      CH: { qty: "10.98 kg", kwh: 110, co2: 659, water: 7137, waterTotal: 169092 },
      US: { qty: "26.8 kg", kwh: 268, co2: 1608, water: 17420, waterTotal: 412720 },
      AU: { qty: "22.4 kg", kwh: 224, co2: 1344, water: 14560, waterTotal: 344960 },
      World: { qty: "6.5 kg", kwh: 65, co2: 393, water: 4254 },
      note: "Supply per person, retail weight (Proviande / USDA, 2024; world: FAO 2023 carcass weight × 0.70, the USDA conversion). 60 kg CO₂e per kg (Poore & Nemecek; range 14–100 by study). Blue water 650 L/kg (550–750); counting rainwater it is ~15,400 L/kg. Farm energy ~10 kWh/kg. Australia: MLA, 2024; MLA reports lower emissions for Australian beef, but 60 kg is kept for comparability.",
      src: ["agrar", "usda", "owidmeat", "poore", "agridea", "mekonnen", "mla", "aubeef", "aupop", "usdaconv"] },
    { id: "coal", label: "Burning coal", phrase: "burn in coal",
      CH: { qty: "11.8 kg", kwh: 78, co2: 25, water: 4 },
      US: { qty: "1,096 kg", kwh: 6795, co2: 2192, water: 6505 },
      AU: { qty: "3,135 kg", kwh: 14778, co2: 4858, water: 7460 },
      World: { qty: "1,074 kg", kwh: 5604, co2: 1936, water: 2200 },
      note: "National coal use ÷ population, 2024 (BFE / EIA). ~2 kg CO₂ and ~6.2–6.6 kWh of heat per kg. Water: mining ~0.05 L per kWh of coal (median, Mekonnen et al.); in the US also power-plant cooling ~5.6 L per kg. World: IEA demand 2025, Energy Institute energy, Global Carbon Project CO₂, power-plant water only. Switzerland burns almost no coal for electricity. Australia: domestic use ÷ population, 2024–25 (AES), exports excluded; ~30% is brown coal, so ~1.55 kg CO₂ and ~4.7 kWh per kg. Water DER: mining plus 1.5 L per kWh of coal power.",
      src: ["bfeges", "eiacoal", "eiaco2", "macknick", "mekonnen15", "ieacoal26", "eicoal", "gcp25", "auaes", "aunga", "aupop", "aunwc"] },
    { id: "car", label: "Driving", phrase: "drive",
      CH: { qty: "5,515 car-km", kwh: 2702, co2: 629, water: 943 },
      US: { qty: "13,837 car-km", kwh: 13007, co2: 3445, water: 4540 },
      AU: { qty: "8,614 vehicle-km", kwh: 9036, co2: 2210, water: 3163 },
      World: { qty: "car fuel ÷ people", kwh: 1770, co2: 442, water: 620 },
      note: "Vehicle-km per person, 2024 (BFS / FHWA). US 400 g CO₂ per mile (EPA). Swiss figure uses 114 g/km for new cars, so it is a lower bound; real fleet emissions are higher. Water: oil extraction and refining, ~0.35 L per kWh of fuel (US crude, Argonne; the global median is ~5× lower). World: 3.5 Gt CO₂ from cars and vans (2022); energy derived at 0.25 kg CO₂ per kWh of fuel. Australia: BITRE 2024–25, cars plus utes and vans (incl. trade use), as US light-duty vehicles: 237.8 billion km, 61 Mt CO₂e, ~257 g/km real-world.",
      src: ["bfscar", "fhwa", "epacar", "chcarco2", "argonne", "npc", "carsco2", "aubitre", "aupop"] },
    { id: "flight", label: "Flying", phrase: "fly",
      CH: { qty: "jet fuel sold ÷ people", kwh: 2385, co2: 610, water: 832 },
      US: { qty: "US airline fuel ÷ people", kwh: 2140, co2: 530, water: 747 },
      AU: { qty: "jet fuel sold ÷ people", kwh: 3530, co2: 885, water: 1236 },
      World: { qty: "1,115 passenger-km", kwh: 444, co2: 115, water: 155 },
      note: "CO₂ only. Contrails and other non-CO₂ effects roughly ×1.7 the warming. Swiss figure is fuel sold in Switzerland (includes visitors and cargo). Water: oil extraction and refining, ~0.35 L per kWh of fuel (US crude, Argonne). World: 942 Mt aviation CO₂ (IATA, 2024), 9.1 trillion passenger-km (ICAO, 2024). Australian figure is aviation fuel supplied in Australia, domestic and international departures, 2024–25 (AES).",
      src: ["bafughg", "bfeges", "bts", "defra", "argonne", "npc", "iata24", "icao24", "auaes", "aunga", "aupop"] },
    { id: "power", label: "Home electricity", phrase: "use at home in electricity",
      CH: { qty: "2,190 kWh", kwh: 2190, co2: 197, water: 1533 },
      US: { qty: "4,418 kWh", kwh: 4418, co2: 1697, water: 7952 },
      AU: { qty: "2,690 kWh", kwh: 2690, co2: 1412, water: 2152 },
      World: { qty: "881 kWh", kwh: 881, co2: 403, water: 1586 },
      note: "Residential electricity ÷ population (BFE 2024 / EIA 2025; world ~7,250 TWh, 2025 estimate from IEA data), on each country's or the world grid. Australia: residential use incl. self-consumed rooftop solar, 2024–25 (AES).",
      src: ["bfeges", "eiaelec", "egrid", "globalelec", "ieaelec26", "auaes", "aupop"] },
    { id: "water", label: "Home water", phrase: "use at home in water",
      CH: { qty: "142 L a day", kwh: null, co2: null, water: 51830 },
      US: { qty: "310 L a day", kwh: null, co2: null, water: 113150 },
      AU: { qty: "187 L a day", kwh: null, co2: null, water: 68407 },
      World: { qty: "175 L a day", kwh: null, co2: null, water: 63875 },
      note: "Household tap water per person (SVGW via SRF / USGS via EPA). World: municipal withdrawal (AQUASTAT, 2022). This is water supplied, most of which returns to rivers; AI water here is water consumed (evaporated), so the two are not like for like. Australia: household distributed water ÷ population, 2023–24 (ABS); excludes rainwater tanks and bores.",
      src: ["chwater", "epawater", "wbwater", "auwater", "aupop24"] },
    { id: "total", label: "Total CO₂ footprint", phrase: "emit in total",
      CH: { qty: "13.3 t CO₂", kwh: null, co2: 13340, water: null },
      US: { qty: "15.8 t CO₂", kwh: null, co2: 15810, water: null },
      AU: { qty: "14.1 t CO₂", kwh: null, co2: 14069, water: null },
      World: { qty: "4.6 t CO₂", kwh: null, co2: 4630, water: null },
      note: "Fossil CO₂ only, excluding other greenhouse gases. Consumption-based CO₂ per person (Australia: 2023), including imported goods (Our World in Data). World: 38.1 Gt fossil CO₂ in 2025 (Global Carbon Project).",
      src: ["owidco2", "gcp25"] }
  ],

  /* One-off things for small-scale equivalents. */
  equivalents: [
    { id: "burger", per: "co2", value: 3, label: "beef burgers", src: ["masley"] },
    { id: "carkm", basis: ["CH", "US"], per: "co2", value: 0.249, label: "km in an average US car", note: "About 400 g CO₂ per mile", src: ["epacar"] },
    { id: "aucarkm", basis: "AU", per: "co2", value: 0.257, label: "km in an average Australian car, ute or van", note: "About 257 g CO₂e per km, real-world fleet 2024–25 (DER)", src: ["aubitre"] },
    { id: "zrhlon", basis: "CH", per: "co2", value: 117, label: "Zurich–London return flights", note: "1,587 km at DEFRA short-haul economy, CO₂ only", src: ["defra", "zhawlon"] },
    { id: "sydmel", basis: "AU", per: "co2", value: 104, label: "Sydney–Melbourne return flights", note: "1,411 km at DEFRA short-haul economy, CO₂ only", src: ["defra"] },
    { id: "nycchi", basis: "US", per: "co2", value: 173, label: "New York–Chicago return flights", note: "2,354 km at DEFRA short-haul economy, CO₂ only", src: ["defra"] },
    { id: "shower", per: "water", value: 80, label: "10-minute showers", src: ["masley"] },
    { id: "pool", per: "water", value: 2500000, label: "Olympic pools", note: "50 × 25 × 2 m" }
  ],

  /* Power ladder, average watts. "home" uses the chosen country's per-person figure. */
  rungs: [
    { id: "bulb", icon: "bulb", label: "LED bulb", w: 8, src: ["nea"] },
    { id: "kettle", icon: "kettle", label: "Kettle", w: 2500, src: ["nea"] },
    { id: "home", icon: "house", label: "One person's home electricity", w: null, src: ["bfeges", "eiaelec", "auaes"] },
    { id: "charger", icon: "charger", label: "Electric-car fast charger", w: 250e3, note: "250 kW peak (Tesla V3 Supercharger)", src: ["tesla"] },
    { id: "wind", icon: "wind", label: "Wind turbine at full output", w: 4.6e6, note: "4.6 MW, the average new onshore turbine in Europe in 2024; it averages far less", src: ["windeu"] },
    { id: "chdc", basis: "CH", icon: "campus", label: "All Swiss data centres", w: 240e6, note: "2.1 TWh in 2024", src: ["bfedc"] },
    { id: "goesgen", basis: "CH", icon: "tower", label: "Gösgen nuclear plant", w: 1010e6, note: "1,010 MW net", src: ["ensi"] },
    { id: "ch", basis: "CH", icon: "pin", label: "All of Switzerland", w: 6.56e9, note: "57.5 TWh in 2024", src: ["bfestat"] },
    { id: "audc", basis: "AU", icon: "campus", label: "Australian data centres (east-coast grid)", w: 570e6, note: "~5 TWh in 2025–26 on the NEM, about 3% of its demand", src: ["aemodc"] },
    { id: "eraring", basis: "AU", icon: "tower", label: "Eraring power station", w: 2880e6, note: "2,880 MW, Australia's largest coal plant", src: ["eraring"] },
    { id: "au", basis: "AU", icon: "pin", label: "All of Australia", w: 32.2e9, note: "282.5 TWh generated in 2024–25", src: ["auaes"] },
    { id: "usdc", basis: "US", icon: "campus", label: "All US data centres", w: 20.1e9, note: "176 TWh in 2023", src: ["lbnl"] },
    { id: "hoover", basis: "US", icon: "tower", label: "Hoover Dam at full output", w: 2080e6, note: "2,080 MW capacity; it averages far less", src: ["hoover"] },
    { id: "us", basis: "US", icon: "pin", label: "All of the USA", w: 479e9, note: "4,195 TWh used in 2025", src: ["eiamer"] },
    { id: "dcworld", icon: "campus", label: "All data centres worldwide", w: 55.4e9, note: "485 TWh in 2025", src: ["iea2026"] },
    { id: "world", icon: "globe", label: "All electricity worldwide", w: 3.62e12, note: "~31,700 TWh in 2025", src: ["ember"] }
  ],

  /* Land references, m². */
  landRefs: [
    { id: "parking", label: "Parking space", m2: 12.5, note: "typical 2.5 × 5 m" },
    { id: "tennis", label: "Tennis court", m2: 260.8, note: "23.77 × 10.97 m", src: ["tennis"] },
    { id: "pitch", label: "Football pitch", m2: 7140, note: "105 × 68 m" },
    { id: "central", label: "Central Park, New York", m2: 3.41e6, note: "843 acres", src: ["centralpark"] },
    { id: "manhattan", label: "Manhattan", m2: 58.68e6, note: "58.7 km² of land", src: ["censusgaz", "nycboro"] },
    { id: "la", label: "Los Angeles", m2: 1215.98e6, note: "1,216 km² of land", src: ["censusgaz", "tigerweb"] },
    { id: "ch", label: "Switzerland", m2: 41285e6, note: "41,285 km²", src: ["myswitzerland", "bfsgeo"] },
    { id: "tx", label: "Texas", m2: 676681e6, note: "676,681 km² of land", src: ["censusgaz", "usatlas"] }
  ],

  frequencies: [
    { id: "once", label: "Once", perDay: null },
    { id: "y1", label: "1 a year", perDay: 1 / 365 },
    { id: "m1", label: "1 a month", perDay: 12 / 365 },
    { id: "w1", label: "1 a week", perDay: 1 / 7 },
    { id: "d1", label: "1 a day", perDay: 1 },
    { id: "d3", label: "3 a day", perDay: 3 },
    { id: "d10", label: "10 a day", perDay: 10 },
    { id: "d30", label: "30 a day", perDay: 30 },
    { id: "d100", label: "100 a day", perDay: 100 }
  ],

  periods: [
    { id: "day", label: "Day", days: 1 },
    { id: "week", label: "Week", days: 7 },
    { id: "month", label: "Month", days: 30.44 },
    { id: "year", label: "Year", days: 365 }
  ],

  scenarios: [
    { label: "My year of questions", anyFreq: true, s: { task: "query", freq: "d10", people: "person", period: "year" } },
    { label: "Every company coder, daily", s: { task: "program", freq: "d1", people: "medco", period: "year", adoption: false } },
    { label: "Switzerland chatting for a year", s: { task: "query", freq: "d10", people: "smallcountry", period: "year", basis: "CH" } },
    { label: "The world chatting for a year", s: { task: "query", freq: "d10", people: "world", period: "year" } },
    { label: "Everyone makes a video a day", s: { task: "video", freq: "d1", people: "world", period: "year", adoption: false } }
  ],

  /* ------------------------------------------------------- UNCERTAINTY */
  uncertainty: [
    { what: "Text answers", level: "good", why: "Google published measured numbers; independent estimates agree within ~2×. Long reasoning answers vary 10–100×.", src: ["google", "epoch", "altman", "jegham", "hfscore"] },
    { what: "Images", level: "rough", why: "Only open models have been measured. Commercial models publish nothing.", src: ["mittr", "luccioni", "bertazzini"] },
    { what: "Video, animation, music video", level: "guess", why: "Measured only on open models; energy grows with the square of length × resolution; retries multiply it. Spans 50× or more.", src: ["delavande", "lcc", "mittr"] },
    { what: "Songs", level: "guess", why: "No measurement of any music generator exists. Derived from lab timings of open audio models.", src: ["audio"] },
    { what: "Coding agents and apps", level: "rough", why: "Two estimates of a session differ ~15×, mostly because their sessions differ in size. Energy per developer-day is derived from API prices, and days per app are assumptions.", src: ["couch", "hausfather", "ccosts", "ccompiler"] },
    { what: "Tokens and time per task", level: "rough", why: "Our assumptions, anchored to typical model speeds and published session data.", src: ["ccosts", "couch", "oviedo"] },
    { what: "GPU time", level: "rough", why: "An energy equivalent. A real request is batched across 8+ GPUs shared with hundreds of others for a few seconds.", src: ["epoch", "dgx"] },
    { what: "Racks and data centres", level: "rough", why: "Assumes H100-class GPUs drawing 70% of peak on average, 8 per server, 32 per rack, 100 MW sites. Idle spare capacity is not counted. Newer racks pack 2× more.", src: ["superpod", "nvl72", "epochdc", "uptime"] },
    { what: "Floor area and land", level: "guess", why: "Counted in whole 8-GPU servers, at least one. Area per MW from five or six flagship campuses with conflicting acreage. Land is capacity, not something a single prompt uses up.", src: ["stargate", "nebius", "stargatesites"] },
    { what: "Water", level: "guess", why: "On-site cooling varies ~10× by operator and climate; power-plant water depends on whether hydro-reservoir evaporation counts. Local scarcity matters more than litres.", src: ["lbnl", "google", "msftfacts", "macknick", "argonne"] },
    { what: "CO₂", level: "rough", why: "Mostly a choice of grid: 9 g/kWh market-based vs 458 g world average, a 50× spread.", src: ["egrid", "vse", "embereu", "ember", "msftfacts"] },
    { what: "Training the models", level: "missing", why: "Not included. There is no agreed way to spread a training run over future prompts; estimates suggest it adds little per prompt.", src: ["masley"] },
    { what: "Making the chips and buildings", level: "missing", why: "Not included: making the chips, building the data centres and shipping the equipment. Embodied emissions are real but rarely disclosed per GPU." },
    { what: "Which data centre serves you", level: "missing", why: "Unknown for any given request. Use the grid selector to see the effect." },
    { what: "What the AI replaces", level: "missing", why: "If AI saves a trip or hours of work, the net effect can be smaller. Not modelled." },
    { what: "Beef, coal, driving, flying", level: "rough", why: "World averages mix data years 2022–2025 and some secondary sources. Beef CO₂ ranges 14–100 kg per kg by study; beef water is 650 L (blue) or 15,400 L (incl. rain). Swiss car figures are a lower bound. Fuel water uses a US crude factor; global estimates are ~5× lower. Australian power-plant water is derived from 2004–05 per-fuel figures.", src: ["poore", "mekonnen", "agridea", "owidmeat", "ieacoal26", "carsco2", "iata24", "argonne"] }
  ],

  priorArt: [
    { name: "Andy Masley's AI footprint calculator", url: "https://andymasley.com/visuals/ai-prompt-footprint/", what: "Your daily text and coding-agent use vs your own footprint." },
    { name: "EcoLogits", url: "https://ecologits.ai/latest/", what: "Open-source per-request estimator for many models." },
    { name: "AI Footprint Calculator", url: "https://calculateaifootprint.com/", what: "Per-person counts of text, search, coding, images, audio and video." },
    { name: "Epoch AI data-centre data", url: "https://epoch.ai/data/ai-data-centers", what: "Power, chips and location of frontier AI data centres." },
    { name: "MIT Technology Review: We did the math", url: "https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/", what: "Measured text, image and video energy on open models, with a day-of-use scenario." }
  ],

  /* ------------------------------------------------------------ SOURCES */
  sources: {
    google: { t: "Elsworth et al., Measuring the environmental impact of AI inference at Google", u: "https://arxiv.org/abs/2508.15734", d: "Aug 2025" },
    epoch: { t: "Epoch AI, How much energy does ChatGPT use?", u: "https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use", d: "Feb 2025" },
    altman: { t: "Altman, The Gentle Singularity (0.34 Wh per query)", u: "https://blog.samaltman.com/the-gentle-singularity", d: "Jun 2025" },
    oviedo: { t: "Oviedo et al., Energy Use of AI Inference, Efficiency Pathways and Test-Time Scaling", u: "https://arxiv.org/abs/2509.20241", d: "Jun 2026 (v2)" },
    jegham: { t: "Jegham et al., How Hungry is AI?", u: "https://arxiv.org/abs/2505.09598", d: "Nov 2025 (v6)" },
    hfscore: { t: "Hugging Face, AI Energy Score v2", u: "https://huggingface.co/blog/sasha/ai-energy-score-v2", d: "Dec 2025" },
    mittr: { t: "MIT Technology Review, We did the math on AI's energy footprint", u: "https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/", d: "May 2025" },
    luccioni: { t: "Luccioni et al., Power Hungry Processing", u: "https://arxiv.org/abs/2311.16863", d: "Oct 2024" },
    bertazzini: { t: "Bertazzini et al., The Hidden Cost of an Image", u: "https://arxiv.org/abs/2506.17016", d: "Jun 2025" },
    delavande: { t: "Delavande et al., energy use of text-to-video models", u: "https://arxiv.org/abs/2509.19222", d: "Sep 2025" },
    lcc: { t: "Lights, Camera, Carbon (video generation energy)", u: "https://arxiv.org/abs/2607.04553", d: "Jul 2026" },
    audio: { t: "Diffused Responsibility: energy of audio generation", u: "https://arxiv.org/abs/2505.07615", d: "Jul 2025" },
    couch: { t: "Simon P. Couch, energy use of Claude Code sessions", u: "https://simonpcouch.com/blog/2026-01-20-cc-impact/", d: "Jan 2026" },
    hausfather: { t: "Zeke Hausfather, The real energy use of agentic AI", u: "https://www.theclimatebrink.com/p/the-real-energy-use-of-agentic-ai", d: "Aug 2026" },
    ccosts: { t: "Anthropic, Claude Code costs (~$13 per developer per active day)", u: "https://code.claude.com/docs/en/costs", d: "2026" },
    ccompiler: { t: "Anthropic, Building a C compiler with parallel agents", u: "https://www.anthropic.com/engineering/building-c-compiler", d: "Feb 2026" },
    masley: { t: "Andy Masley, AI prompt footprint calculator (methodology)", u: "https://andymasley.com/visuals/ai-prompt-footprint/", d: "Jun 2026" },
    dgx: { t: "NVIDIA DGX H100 user guide (10.2 kW max)", u: "https://docs.nvidia.com/dgx/dgxh100-user-guide/introduction-to-dgxh100.html", d: "2026" },
    superpod: { t: "NVIDIA DGX SuperPOD data-centre design (H100)", u: "https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/infrastructure.html", d: "2026" },
    nvl72: { t: "NVIDIA DGX GB200 hardware (NVL72 rack)", u: "https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html", d: "2026" },
    epochdc: { t: "Epoch AI, AI data centres database", u: "https://epoch.ai/data/ai-data-centers", d: "Oct 2026" },
    uptime: { t: "Uptime Institute, Global Data Center Survey 2025", u: "https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf", d: "2025" },
    googlepue: { t: "Google data centre efficiency (PUE)", u: "https://datacenters.google/efficiency", d: "2025" },
    stargate: { t: "Glenn Lockwood, notes on Stargate Abilene", u: "https://glennklockwood.com/garden/stargate", d: "2026" },
    nebius: { t: "City of Independence, Nebius data centre FAQ", u: "https://www.independencemo.gov/community-faqs/nebius-data-center-faqs", d: "2026" },
    stargatesites: { t: "Epoch AI, OpenAI Stargate: where the US sites stand", u: "https://epoch.ai/blog/openai-stargate-where-the-us-sites-stand", d: "2026" },
    lbnl: { t: "LBNL, 2024 United States Data Center Energy Usage Report", u: "https://escholarship.org/content/qt32d6m0d1/qt32d6m0d1.pdf", d: "Dec 2024" },
    msftfacts: { t: "Microsoft 2025 Environmental Data Fact Sheet", u: "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/2025-Microsoft-Environmental-Data-Fact-Sheet-PDF.pdf", d: "2025" },
    macknick: { t: "Macknick et al., water use factors for electricity generation", u: "https://openei.org/datasets/files/969/pub/1748-9326_7_4_045802.pdf", d: "2012" },
    egrid: { t: "US EPA eGRID summary data", u: "https://www.epa.gov/egrid/summary-data", d: "2023 data" },
    vse: { t: "VSE, CO₂ content of the Swiss electricity mix", u: "https://www.strom.ch/system/files/media/documents/20260115-fd-co2-gehalt-des-strommix-schweiz.pdf", d: "Jan 2026" },
    bafumix: { t: "BAFU/treeze, Umweltbilanz Strommix Schweiz 2018", u: "https://www.bafu.admin.ch/dam/bafu/de/dokumente/klima/fachinfo-daten/Umweltbilanz-Strommix-Schweiz-2018-v2.01.pdf", d: "2020" },
    ember: { t: "Ember, Global Electricity Review 2026", u: "https://ember-energy.org/latest-insights/global-electricity-review-2026/2025-in-review/", d: "2026" },
    iea: { t: "IEA, Energy and AI", u: "https://www.iea.org/reports/energy-and-ai/executive-summary", d: "Apr 2025" },
    iea2026: { t: "IEA, Data centre electricity use surged in 2025", u: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions", d: "2026" },
    owiddc: { t: "Our World in Data, How much energy do data centers and AI use?", u: "https://ourworldindata.org/how-much-energy-do-data-centers-and-artificial-intelligence-use", d: "2026" },
    bfedc: { t: "BFE / EnergieSchweiz, Swiss data-centre electricity", u: "https://www.admin.ch/de/newnsb/GV-_d7OgIlqjfQDGZqbkN", d: "May 2026" },
    bfestat: { t: "BFE, Schweizerische Elektrizitätsstatistik 2024", u: "https://pubdb.bfe.admin.ch/de/publication/download/12681", d: "2025" },
    bfsai: { t: "BFS survey on generative AI use (reported by Netzwoche)", u: "https://www.netzwoche.ch/news/2025-12-08/breite-ki-nutzung-und-steigende-desinformation-praegen-2025-die-schweiz", d: "Dec 2025" },
    wip: { t: "WIP-CH 2025, internet use in Switzerland", u: "https://www.mediachange.ch/media/medialibrary/2025/11/20251106_MM_WIP_DE_final.pdf", d: "Nov 2025" },
    pew: { t: "Pew Research Center, Americans and AI 2026 (24% use chatbots daily)", u: "https://alpha.pewresearch.org/pewresearch-org/wp-content/uploads/sites/20/2026/06/PI_2026.06.17_Americans-and-AI_REPORT.pdf", d: "Jun 2026" },
    bai: { t: "Bai et al., tokens and cost of agentic coding tasks", u: "https://arxiv.org/abs/2604.22750", d: "Apr 2026" },
    eusme: { t: "European Commission, SME definition", u: "https://single-market-economy.ec.europa.eu/smes/sme-fundamentals/sme-definition_en", d: "2025" },
    bigco: { t: "Fortune 500 employment 2026; Novartis headcount (macrotrends)", u: "https://fortune.com/2026/06/19/fortune-500-employment-profits-revenue-hiring-jobs-ai/", d: "2026" },
    popzh: { t: "Stadt Zürich, population 2025", u: "https://www.stadt-zuerich.ch/de/aktuell/medienmitteilungen/2026/02/bevoelkerungswachstum-weniger-vorschulkinder.html", d: "Feb 2026" },
    popkzh: { t: "Kanton Zürich, population 2025", u: "https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2026/02/bevoelkerung-im-kanton-zuerich-waechst-weiter-jedoch-langsamer.html", d: "Feb 2026" },
    popch: { t: "Swiss Federal Council, population end 2025", u: "https://www.admin.ch/de/newnsb/eHho7S2A2revQdhyPSYmt", d: "2026" },
    popnyc: { t: "NYC Planning, population estimates (Mar 2026)", u: "https://s-media.nyc.gov/agencies/dcp/assets/files/pdf/data-tools/population/population-estimates/new-york-city-population-estimates-and-trends-march-2026.pdf", d: "Mar 2026" },
    popus: { t: "US Census Vintage 2025 (via WorldAtlas)", u: "https://www.worldatlas.com/society/how-many-people-are-in-the-us-2026.html", d: "2026" },
    popworld: { t: "UN World Population Prospects 2024 (via PopulationPyramid)", u: "https://www.populationpyramid.net/world/2026/", d: "2026" },
    agrar: { t: "Agrarbericht 2025, meat supply per person", u: "https://www.agrarbericht.ch/de/markt/tierische-produkte/fleisch-und-eier", d: "2025" },
    usda: { t: "USDA ERS, cattle and beef statistics", u: "https://www.ers.usda.gov/topics/animal-products/cattle-beef/statistics-information", d: "2025" },
    poore: { t: "Poore & Nemecek 2018 via Our World in Data", u: "https://ourworldindata.org/grapher/ghg-per-kg-poore", d: "2018" },
    agridea: { t: "Agridea, footprint of Swiss beef production", u: "https://www.sbv-usp.ch/fileadmin/sbvuspch/05_Themen/Oekobilanz/Agridea_2021_Fakten_zum_oekologischen_Fussabdruck_der_Rindfleischproduktion.pdf", d: "2021" },
    mekonnen: { t: "Mekonnen & Hoekstra, water footprint of farm animal products", u: "https://link.springer.com/article/10.1007/s10021-011-9517-8", d: "2012" },
    mla: { t: "MLA, Australian beef footprint (energy per kg)", u: "https://www.mla.com.au/contentassets/92b275844c0340a48f98646e2b9b8e6d/b.cch.2072_beef_final_report.pdf", d: "2015" },
    bfeges: { t: "BFE, Schweizerische Gesamtenergiestatistik 2024", u: "https://pubdb.bfe.admin.ch/en/publication/download/12195", d: "2025" },
    eiacoal: { t: "EIA, Annual Coal Report", u: "https://www.eia.gov/coal/annual/", d: "2025" },
    eiaco2: { t: "EIA, CO₂ emissions by fuel", u: "https://www.eia.gov/environment/emissions/co2_vol_mass.php", d: "2024" },
    bfscar: { t: "BFS, Swiss passenger transport performance 2024", u: "https://dam-api.bfs.admin.ch/hub/api/dam/assets/36147221/master", d: "2025" },
    fhwa: { t: "FHWA, Highway Statistics VM-1 (2024)", u: "https://www.fhwa.dot.gov/policyinformation/statistics/2024/vm1.cfm", d: "2025" },
    epacar: { t: "US EPA, emissions of a typical passenger vehicle", u: "https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle", d: "2024" },
    chcarco2: { t: "Swiss Federal Council, CO₂ of new cars 2024", u: "https://www.admin.ch/de/newnsb/p5nP6uoDBmDrlQW0WdX7h", d: "2025" },
    bafughg: { t: "BAFU, Swiss greenhouse gas inventory 2024", u: "https://www.bafu.admin.ch/de/newnsb/0x0fdVaborNCilTCosvky", d: "2026" },
    bts: { t: "BTS, US airline fuel consumption", u: "https://www.bts.gov/newsroom/us-airlines-november-2024-fuel-cost-gallon-09-october-2024-aviation-fuel-consumption-33", d: "2025" },
    defra: { t: "UK DESNZ/DEFRA 2025 flight factors (via Green Calculus)", u: "https://greencalculus.com/data/business-travel-freight-logistics-emission-factors/", d: "2025" },
    zhawlon: { t: "ZHAW, Zurich–London distance", u: "https://www.zhaw.ch/storage/lsfm/institute-zentren/iunr/geography-of-food/oekobeichtstuhl-suenden-pdfs/14-london.pdf", d: "" },
    eiaelec: { t: "EIA, use of electricity", u: "https://www.eia.gov/energyexplained/electricity/use-of-electricity.php", d: "2026" },
    chwater: { t: "SRF, Swiss household water use", u: "https://www.srf.ch/news/wirtschaft/trinkwasser-in-der-schweiz-der-lange-weg-zum-wasserhahn-und-was-er-kostet", d: "2026" },
    epawater: { t: "US EPA WaterSense, statistics and facts", u: "https://19january2025snapshot.epa.gov/watersense/statistics-and-facts", d: "2025" },
    nea: { t: "National Energy Action, How much do my appliances cost to use?", u: "https://www.nea.org.uk/wp-content/uploads/2023/06/How-much-do-my-appliances-cost-to-use-2022.pdf", d: "2023" },
    ensi: { t: "ENSI, Gösgen nuclear power plant", u: "https://ensi.admin.ch/en/topic/goesgen-nuclear-power-plant/", d: "2026" },
    argonne: { t: "Wu et al., Argonne, Consumptive water use in the production of ethanol and petroleum gasoline", u: "https://digital.library.unt.edu/ark:/67531/metadc894394/m2/1/high_res_d/947085.pdf", d: "2009" },
    npc: { t: "National Petroleum Council, Water usage considerations (27 gal per MMBtu for US crude)", u: "https://www.energy.gov/sites/default/files/2022-10/31-Water_Usage.pdf", d: "2012" },
    mekonnen15: { t: "Mekonnen et al., The consumptive water footprint of electricity and heat", u: "https://pubs.rsc.org/en/content/articlehtml/2015/ew/c5ew00026b", d: "2015" },
    tennis: { t: "WA Government, sports dimensions guide: tennis", u: "https://dlgsc.wa.gov.au/sport-and-recreation/sports-dimensions-guide/tennis", d: "" },
    centralpark: { t: "Central Park (843 acres)", u: "https://en.wikipedia.org/wiki/Central_Park", d: "" },
    censusgaz: { t: "US Census Bureau, 2020 Gazetteer files (land area)", u: "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2020.html", d: "2020" },
    nycboro: { t: "NYC Department of City Planning, borough boundaries (outline, simplified)", u: "https://www.nyc.gov/site/planning/data-maps/open-data/districts-download-metadata.page", d: "" },
    tigerweb: { t: "US Census TIGERweb, 2020 place boundaries (outline, simplified)", u: "https://tigerweb.geo.census.gov/", d: "2020" },
    usatlas: { t: "US Census cartographic boundaries, via us-atlas (outlines, simplified)", u: "https://github.com/topojson/us-atlas", d: "2017" },
    bfsgeo: { t: "FSO generalised boundaries 2024, via swiss-maps (outlines, simplified)", u: "https://www.bfs.admin.ch/bfs/en/home/services/geostat/swiss-federal-statistics-geodata/administrative-boundaries/generalized-boundaries-local-regional-authorities.html", d: "2024" },
    myswitzerland: { t: "Switzerland Tourism, geography (41,285 km²)", u: "https://www.myswitzerland.com/en/planning/about-switzerland/general-facts/facts-about-switzerland/geography/", d: "" },
    pwc26: { t: "PwC, Global Workforce Hopes and Fears Survey 2026: Switzerland", u: "https://www.pwc.ch/en/insights/transformation/global-workforce-hopes-and-fears-survey-2026-switzerland.html", d: "Sep 2026" },
    accenture26: { t: "Accenture Pulse of Change 2026 (via inside-it.ch)", u: "https://www.inside-it.ch/haelfte-der-schweizer-beschaeftigten-nutzt-taeglich-ki-20260728", d: "Jul 2026" },
    gallup: { t: "Gallup, AI use at work indicator", u: "https://www.gallup.com/699797/indicator-artificial-intelligence.aspx", d: "Q2 2026" },
    owidmeat: { t: "Our World in Data, per-capita meat supply by type (FAO)", u: "https://ourworldindata.org/grapher/per-capita-meat-type", d: "2023 data" },
    ieacoal26: { t: "IEA, Coal Mid-Year Update 2026: demand", u: "https://www.iea.org/reports/coal-mid-year-update-2026/demand", d: "2026" },
    eicoal: { t: "Energy Institute via Our World in Data, coal consumption by region", u: "https://ourworldindata.org/grapher/coal-consumption-by-region", d: "Jun 2026" },
    gcp25: { t: "Global Carbon Project 2025 (via Carbon Brief)", u: "https://www.carbonbrief.org/analysis-fossil-fuel-co2-emissions-to-set-new-record-in-2025-as-land-sink-recovers/", d: "Nov 2025" },
    carsco2: { t: "Statista, CO₂ emissions from cars and vans worldwide", u: "https://statista.com/statistics/1388092/carbon-dioxide-emissions-cars-vans-transport", d: "2022 data" },
    iata24: { t: "IATA, Aviation emissions 2024", u: "https://www.iata.org/en/iata-repository/publications/economic-reports/2024-aviation-emissions-efficiency-gains-vs.-rising-totals", d: "2025" },
    icao24: { t: "ICAO Annual Report 2024, world air transport", u: "https://www.icao.int/about-icao/AnnualReport2024/world-air-transport-2024", d: "2025" },
    globalelec: { t: "Global Electricity, consumption by type (residential ~27%)", u: "https://www.globalelectricity.org/electricity-consumption-by-type/", d: "2023 data" },
    ieaelec26: { t: "IEA, Electricity 2026", u: "https://www.iea.org/reports/electricity-2026/demand", d: "2026" },
    wbwater: { t: "World Bank / AQUASTAT, freshwater withdrawals (municipal share)", u: "https://data.worldbank.org/indicator/ER.H2O.FWDM.ZS", d: "2022 data" },
    win26: { t: "WIN World AI Index 2026", u: "https://demoskop.se/wp-content/uploads/2026/05/WIN-World-AI-Index-2026-Report.pdf", d: "May 2026" },
    msdiffusion: { t: "Microsoft, The state of global AI diffusion in 2026", u: "https://blogs.microsoft.com/on-the-issues/2026/09/21/the-continued-state-of-global-ai-diffusion-in-2026/", d: "Sep 2026" },
    embereu: { t: "Ember via Our World in Data, carbon intensity of electricity (EU)", u: "https://ourworldindata.org/grapher/carbon-intensity-electricity", d: "Jun 2026" },
    aurp: { t: "ABS, National, state and territory population, March 2026", u: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release", d: "Sep 2026" },
    aupop: { t: "ABS, National, state and territory population, June 2025", u: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/jun-2025", d: "Dec 2025" },
    aupop24: { t: "ABS, National, state and territory population, June 2024", u: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/jun-2024", d: "Dec 2024" },
    ausyd: { t: "ABS, Regional population, 2024-25", u: "https://www.abs.gov.au/statistics/people/population/regional-population/latest-release", d: "Mar 2026" },
    ausize: { t: "ABS, Australian Industry 2007-08, Glossary (business size)", u: "https://www.abs.gov.au/ausstats/abs@.nsf/Products/8155.0~2007-08~Glossary~Glossary", d: "2009" },
    aubhp: { t: "BHP, Annual Report 2025 (Form 20-F), workforce data", u: "https://www.sec.gov/Archives/edgar/data/811809/000119312525185641/d941636d20f.htm", d: "Aug 2025" },
    auember: { t: "Ember via Our World in Data, carbon intensity of electricity (Australia)", u: "https://ourworldindata.org/grapher/carbon-intensity-electricity?country=~AUS", d: "2026" },
    aunga: { t: "DCCEEW, National Greenhouse Accounts Factors 2026", u: "https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2026", d: "Aug 2026" },
    aunwc: { t: "Smart & Aspinall, Water and the electricity generation industry (National Water Commission, Waterlines 18; NLA web archive)", u: "https://webarchive.nla.gov.au/awa/20120301000000/http://www.nwc.gov.au/__data/assets/pdf_file/0010/10432/Waterlines_electricity_generation_industry_replace_final_280709.pdf", d: "Aug 2009" },
    auanu: { t: "ANU and Google, AI Adoption in Australia", u: "https://cybernetics.anu.edu.au/assets/ANU_AIAdoptionInAustralia_APartnershipbetweenGoogleandANU.pdf", d: "Jul 2026" },
    autelsyte: { t: "Telsyte, Australian Artificial Intelligence Study 2026", u: "https://www.telsyte.com.au/announcements/2026/6/2/four-in-five-ai-users-now-engage-monthly-as-australias-user-base-surges-past-17-million", d: "Jun 2026" },
    aupwc26: { t: "PwC Australia, Hopes and Fears 2026: Australian workers split by AI opportunity", u: "https://www.pwc.com.au/media/2026/pwc-survey-finds-australian-workers-split-by-AI-opportunity-as-adoption-remains-uneven.html", d: "Sep 2026" },
    aubeef: { t: "MLA, Beef fast facts 2025", u: "https://www.mla.com.au/globalassets/mla-corporate/prices--markets/documents/trends--analysis/fast-facts--maps/mla_beef-fast-facts-2025_301025.pdf", d: "Oct 2025" },
    auaes: { t: "DCCEEW, Australian Energy Statistics 2026", u: "https://www.energy.gov.au/publications/australian-energy-update-2026", d: "Sep 2026" },
    aubitre: { t: "BITRE, Australian Infrastructure and Transport Statistics Yearbook 2025", u: "https://www.bitre.gov.au/sites/default/files/documents/bitre-yearbook-2025.pdf", d: "Dec 2025" },
    auage: { t: "ABS, population by single year of age (Table 59), June 2025", u: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/mar-2026/3101059.xlsx", d: "Sep 2026" },
    bfspress: { t: "BFS, Omnibus ICT survey 2025 press release (generative AI use)", u: "https://dam-api.bfs.admin.ch/hub/api/dam/assets/36304417/master", d: "Dec 2025" },
    censusage: { t: "US Census Bureau, Vintage 2025 population by age (NC-EST2025-AGESEX-RES)", u: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/national/asrh/nc-est2025-agesex-res.csv", d: "2026" },
    census25: { t: "US Census Bureau, Vintage 2025 state population totals", u: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/state/totals/NST-EST2025-ALLDATA.csv", d: "2026" },
    emberus: { t: "Ember via Our World in Data, carbon intensity of electricity (US 2025)", u: "https://ourworldindata.org/grapher/carbon-intensity-electricity", d: "2026" },
    fairwater: { t: "Microsoft, Inside the world's most powerful AI datacenter (Fairwater)", u: "https://blogs.microsoft.com/blog/2025/09/18/inside-the-worlds-most-powerful-ai-datacenter/", d: "Sep 2025" },
    hyperion: { t: "Meta, Richland Parish (Hyperion) data center", u: "https://datacenters.atmeta.com/richland-parish-data-center/", d: "2026" },
    epochdcdata: { t: "Epoch AI, data centre timelines (power and floor area by building)", u: "https://epoch.ai/data/data_centers/data_center_timelines.csv", d: "Oct 2026" },
    msftzero: { t: "Microsoft, next-generation datacenters consume zero water for cooling", u: "https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/", d: "Dec 2024" },
    aemodc: { t: "AEMO, 2026 ESOO data centre forecasting overview", u: "https://www.aemo.com.au/-/media/files/electricity/nem/planning_and_forecasting/nem_esoo/2026/2026-esoo-data-centre-forecasting-overview.pdf", d: "Aug 2026" },
    eraring: { t: "Eraring Power Station (Wikipedia)", u: "https://en.wikipedia.org/wiki/Eraring_Power_Station", d: "2026" },
    tesla: { t: "Tesla, Introducing V3 Supercharging (250 kW peak)", u: "https://www.tesla.com/blog/introducing-v3-supercharging", d: "2019" },
    windeu: { t: "WindEurope, Wind energy in Europe: 2024 statistics (average new onshore turbine 4.6 MW)", u: "https://windeurope.org/data/products/wind-energy-in-europe-2024-statistics-and-the-outlook-for-2025-2030", d: "Feb 2025" },
    hoover: { t: "US Bureau of Reclamation, Hoover Dam power FAQ", u: "https://usbr.gov/lc/hooverdam/faqs/powerfaq.html", d: "2026" },
    eiamer: { t: "US EIA, Monthly Energy Review Table 7.1, electricity end use 2025", u: "https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.01", d: "2026" },
    usdaconv: { t: "USDA ERS, red meat supply and disappearance (carcass-to-retail factors)", u: "https://www.ers.usda.gov/media/5360/red-meat-beef-veal-pork-lamb-and-mutton.xlsx", d: "Oct 2022" },
    auwater: { t: "ABS, Water Account, Australia 2023-24", u: "https://www.abs.gov.au/statistics/environment/environmental-accounts/water-account-australia/latest-release", d: "Dec 2025" },
    owidco2: { t: "Our World in Data, consumption-based CO₂ per capita", u: "https://ourworldindata.org/grapher/consumption-co2-per-capita", d: "2023 data" }
  }
};
