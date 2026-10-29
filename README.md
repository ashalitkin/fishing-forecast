# Fishing forecast · Portugal

A personal map for shore fishing on the Portuguese coast: where and when it is worth
fishing for each species in the next 72 hours, and whether fishing is allowed at that
spot right now (closed seasons, minimum sizes, protected areas).

Personal, single-user project. All data comes from open sources (IPMA, Open-Meteo,
Copernicus Marine, EMODnet, OpenStreetMap, FishBase, DGRM rules).
The score is an explainable heuristic, tuned against my own catch log.

> Not legal advice. Always check current DGRM rules and local notices before fishing.

## Structure

```
packages/core        species profiles, scoring model, rules engine (pure TS)
packages/collectors  fetchers for marine, weather, tide and geo data
apps/api             HTTP API: /forecast, /rules, /layers
apps/web             map UI: React + MapLibre GL
data/spots           spots GeoJSON for the MVP stretch
```

## MVP

Póvoa de Varzim → Viana do Castelo; sargo, robalo, dourada, safia, choco, cavala;
hourly for 72 h. Full plan, data sources and scoring model: [PLAN.md](PLAN.md).

## Development

Node 22 (`.nvmrc`), npm workspaces.

```
npm install
npm run typecheck
```

Secrets go to `.env` (see `.env.example`) and are never committed.

## License

MIT © Andrey Shalitkin
