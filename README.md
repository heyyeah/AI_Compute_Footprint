# AI Compute Footprint

An interactive page that shows what AI tasks take in physical terms, from one person to the whole world.

**Try it:** https://heyyeah.github.io/AI_Compute_Footprint/

- **16 tasks**, ordered by electricity per task: short answer → image → simple web page → song → document draft → maths → interactive web page → presentation → small program → short video → full web app → animation → full program → app MVP → music video → functional app.
- **Equation bar**: task × how often × how many people × period. Click any part to change it; it stays at the top while scrolling. Groups of 50 or more count only daily AI users by default.
- **Compute**: hardware needed (one 8-GPU server up to many data centres) and a clock for server time.
- **Footprint**: electricity, water, CO₂ and data-centre floor, with ranges; sources behind each (i).
- **Data-centre land**: floor and whole site, drawn to scale against a parking space, football pitch or city.
- **Power draw** on a ladder from an LED bulb to all electricity worldwide.
- **Comparisons** with what the same people already use: eating beef, burning coal, driving, flying, home electricity, home water, whole carbon footprint (Swiss, US or world averages), as a chart or icons.
- **Every task ordered by energy used**, example scenarios, and collapsed sections on confidence, assumptions, sources and related projects.

## Files

Every number, range, note and source is in **`data/model.js`**. The page recalculates from that file only.

```
index.html          page markup
assets/styles.css   design tokens and layout (light and dark)
assets/app.js       calculations, charts, hardware canvas
data/model.js       all data and sources
build.py            bundler
initial_prompts     for reference on how I started making this
```

## Approach

Tasks = people × share using AI × uses per day × days. Electricity = tasks × facility-level Wh per task. GPU time = electricity ÷ (1.5 kW per H100-class GPU, all-in, × 70% average draw); server time = GPU time ÷ 8. GPUs = GPU time ÷ hours; racks = GPUs ÷ 32; data centres = IT power ÷ 100 MW. Floor and site area = whole racks (at least one) × m² per MW from recent AI campuses. Water = electricity × (on-site cooling + power-plant water). CO₂ = electricity × grid intensity. Training and hardware manufacturing are not included. Made mostly with Claude with cross-checking done by Gemini and ChatGPT.

## Bundle

```sh
python3 build.py
```

- `dist/standalone.html`: a self-contained file
- `dist/artifact.html`: a body-only version

## Prior art

- [Andy Masley's AI footprint calculator](https://andymasley.com/visuals/ai-prompt-footprint/) (CC0): personal daily text and coding use vs your footprint.
- [EcoLogits](https://ecologits.ai/latest/) (open source): per-request estimator most calculators build on.
- [AI Footprint Calculator](https://calculateaifootprint.com/): per-person counts incl. images, audio, video.
- [Epoch AI data-centre data](https://epoch.ai/data/ai-data-centers) (CC BY).

Research cut-off: 11 October 2026. Estimates, not measurements.

## Licence

By Tim Plaisted. Code: MIT (`LICENSE`). Data, text and design: CC BY 4.0 (`LICENSE-DATA.md`).
Please credit "AI Compute Footprint by Tim Plaisted" with a link to https://github.com/heyyeah/AI_Compute_Footprint.
