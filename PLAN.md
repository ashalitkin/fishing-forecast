# Fishing forecast: Portugal coast (personal project)

Single-user personal project, owned by Andrey Shalitkin personally (not Dataprof, not Plotbird).
No other people's data: only my own catch log. Keep it in a personal git repo with a personal license.

## Goal
A map of my coast that answers: where and when is it worth fishing for species X in the next 3 days,
and am I allowed to fish there right now.

## MVP scope (2–3 weeks)
- Area: Póvoa de Varzim → Viana do Castelo (shore fishing).
- Species (5–6): sargo (Diplodus sargus), robalo (Dicentrarchus labrax), dourada (Sparus aurata),
  safia (Diplodus vulgaris), choco (Sepia officinalis), cavala (Scomber colias).
- Time: next 72 h, hourly.
- Output: map layer with a 0–100 score per spot per species, hour slider, "allowed now" filter,
  spot card explaining the score (tide, SST, waves, light, season, rules).
- My catch log (date, spot, species, size, bait) to check and tune the score.

## Stack (all TypeScript)
- Monorepo: pnpm workspaces.
- `packages/collectors`: Node 22 + TS, scheduled fetchers (cron / GitHub Actions), write to SQLite or Postgres+PostGIS.
- `packages/core`: scoring model (pure functions, unit-tested), species profiles, rules engine.
- `apps/api`: Fastify or Hono, JSON endpoints `/forecast?spot&species&from&to`, `/rules?point&time`, `/layers/*`.
- `apps/web`: Vite + React + MapLibre GL, OSM/OpenFreeMap tiles, deck.gl optional for heatmaps.
- Geo: turf.js for point-in-polygon and buffers; GeoJSON everywhere.
- Deploy: Cloudflare (Pages + Workers + D1) or a small VPS. Free tier is enough.

## Data sources
| Need | Source | Access | Status |
|---|---|---|---|
| Waves, SST (official) | IPMA open data `api.ipma.pt/open-data/forecast/oceanography/daily/hp-daily-sea-forecast-day{0..2}.json` | free, no key | verified 2026-10-29 |
| Hourly waves, SST, sea level | Open-Meteo Marine API | free, no key | verified 2026-10-29 |
| Wind, pressure, clouds, rain | Open-Meteo Weather API | free, no key | |
| SST history, chlorophyll, currents | Copernicus Marine (CMEMS) | free, account | |
| Tides | Instituto Hidrográfico (PDF tables; undocumented HMAPI) → fallback Open-Meteo sea level or harmonic calc | ask centrodados@hidrografico.pt | open question |
| Sun, moon | suncalc (local) | lib | |
| Bathymetry | EMODnet Bathymetry WCS/WMS, GEBCO | free | |
| Seabed type | EMODnet Seabed Habitats (ICNF data) WFS/shapefile | free | |
| Coastline, piers, beaches, access | OpenStreetMap (Overpass) | free | |
| Species preferences | FishBase (temperature, depth, habitat, spawning) | free | |
| Species sightings | OBIS / GBIF APIs | free | sparse (sargo: 35 records in PT) |
| Seasonality | INE / DGRM landings by port and month | free, CSV/PDF | |
| Commercial effort | Global Fishing Watch API | free non-commercial, token | optional |
| Closed seasons, min sizes | DGRM despachos/portarias (PDF) | manual + LLM-assisted extraction, my review | rules table |
| Protected areas | EMODnet / WDPA / ICNF & SNIG geoportals | WFS/shapefile | polygons to check against legal text |
| Ports, bathing season | rules (capitania editais) | manual | |

## Scoring model v1 (heuristic, explainable)
score(spot, species, hour) = season × Σ wᵢ·fᵢ, clipped 0–100, where fᵢ ∈ [0,1]:
- SST fit to species preference band (FishBase)
- tide phase window (e.g. ±2 h around high water for sargo on rocks)
- light: dawn/dusk bonus, night for robalo
- moon phase (small weight)
- waves: species- and spot-type-specific curve (some swell on rocks good, storm bad)
- wind direction vs coast, pressure trend (falling = small plus)
- turbidity proxy (chlorophyll / recent rain near river mouths)
- seabed match (rock / sand / mixed)
Then `allowed(spot, species, time)`: closed season, min size note, protected polygon, port/beach rules.
Weights per species in JSON; tuned against my catch log.

## Milestones
1. Repo, monorepo skeleton, spots GeoJSON for MVP area, map with spots.
2. Collectors: IPMA + Open-Meteo marine/weather + suncalc; store hourly.
3. Tides solution decided and implemented.
4. Species profiles + scoring in `core` with unit tests; API endpoint.
5. Rules: DGRM closed seasons/sizes table + protected-area polygons; "allowed now" filter.
6. Web: hour slider, species picker, heat layer, spot card with explanation.
7. Catch log + simple calibration report (score vs my catches).

## Open questions
- Tide data access from Instituto Hidrográfico.
- Exact protected-area polygons for the MVP stretch (Litoral Norte natural park).
