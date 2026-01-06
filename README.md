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
To preview a production build locally, run `npm run build && npm run preview`.

## Testing
```bash
npm test
```

## Build for production
```bash
npm run build
```
The static assets land in `dist/` (with `.nojekyll` and `CNAME` copied from `public/`). Do not host the repository root; host the generated `dist/` folder instead.

## Deploying to GitHub Pages
**Important:** Publish the built `dist/` output, not the raw source. Serving `src/main.tsx` directly will fail MIME checks in browsers.

### One-click with GitHub Actions
1. Ensure Pages source is set to **GitHub Actions** in repository settings (recommended).
2. Keep the included workflow at `.github/workflows/deploy.yml`. It installs deps, runs `npm run build`, uploads `dist/`, and deploys to Pages.
3. The workflow uses `base: './'` from `vite.config.ts`, so assets resolve correctly at `https://<user>.github.io/<repo>/`.

### Manual publishing
1. Build the project: `npm run build`.
2. Publish the contents of `dist/` to your Pages host (e.g., copy to a `gh-pages` branch or set “Deploy from branch” to `/dist` on GitHub Pages).
3. Include the `.nojekyll` file in the published root to bypass the default Jekyll build (prevents missing `docs` errors). If you keep the provided `public/` files, it is added automatically during the build.
4. If you override `base`, ensure it matches your publish path.

## AASA (Universal Links + App Clip)
- Static files live under `public/`:
  - `public/apple-app-site-association`
  - `public/.well-known/apple-app-site-association`
  - `public/.nojekyll`
  - `public/CNAME`
- Replace the Apple Team ID or App/Clip bundle IDs in the AASA JSON if they change.
- Verify the published Pages output returns the raw JSON (no redirects, no HTML):
  ```bash
  curl -i https://synctimerapp.com/.well-known/apple-app-site-association
  curl -i https://synctimerapp.com/apple-app-site-association
  ```
  Expect: HTTP 200, JSON body, no redirects, not HTML.

## Manual test checklist
- Parse 2 host share links and confirm both hosts appear.
- Reorder hosts and confirm the `device_names` ordering changes in the join URL.
- Paste a join link and confirm all fields populate.
- Wi-Fi always emits `transport_hint=bonjour` in the join URL.
- Download SVG and PNG then scan to verify correctness.
- Print mode prints only the label block.
