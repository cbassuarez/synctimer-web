# SyncTimer QR Generator

Single-page generator for SyncTimer join links and QR codes. Built with Vite + React + TypeScript.

## Features
- Paste Host Share Link(s) to build a host list; de-dupes by UUID.
- Paste a join link to round-trip all fields.
- Generates join URLs that force `transport_hint=bonjour` in Wi-Fi mode.
- Live QR preview with SVG + PNG export, quiet zone of 4 modules.
- Display mode overlay and print-friendly label layout.
- LocalStorage persistence and shareable generator links via `location.hash`.

## Getting started
```bash
npm install
npm run dev
```
Open the printed local URL (defaults to http://localhost:5173).

## Testing
```bash
npm test
```

## Build for production
```bash
npm run build
```
The static assets land in `dist/`.

## Deploying to GitHub Pages
1. Build the project: `npm run build`.
2. Deploy the `dist/` folder to Pages. If using the `gh-pages` branch, copy the contents of `dist/` there.
3. If you publish under a subpath, update `base` in `vite.config.ts` to that path (e.g., `/synctimer-web/`).

## Manual test checklist
- Parse 2 host share links and confirm both hosts appear.
- Reorder hosts and confirm the `device_names` ordering changes in the join URL.
- Paste a join link and confirm all fields populate.
- Wi-Fi always emits `transport_hint=bonjour` in the join URL.
- Download SVG and PNG then scan to verify correctness.
- Print mode prints only the label block.
