# Verification record

Date: 2026-10-05 · release: 1.0.0

## Automated rules

**24 tests passed** locally with Node.js 25.3.0 using npm test. npm run build completed and produced the static dist directory. GitHub Actions is configured to repeat the checks on Node.js 22 and 24; the repository Actions tab shows the actual run results.

Pinned-card inclusion, whole-card budget packing, Unicode counting, explicit omissions, draft extraction, invalid backup rejection and schema limits.

Eight shared helper checks cover HTML escaping, URL schemes and credentials, import file size, backup identity/version and full-schema validation. Veil Paste includes these helper checks although the app intentionally has no workspace backup/import controls.

## Browser acceptance

Chromium driven with the Playwright CLI, served over local HTTP. Full workflows were exercised at a 1280 × 900 viewport, with a 390 × 844 mobile viewport checked for horizontal overflow. Screenshots show explicitly fictional sample content.

Created a card containing HTML-like text and verified it rendered as text. Increased pinned content beyond the budget and verified export was blocked. Downloaded Markdown and a JSON backup, reloaded, imported the backup and rejected a wrong-app backup without replacing state.

Turkish/English switching, reload persistence where applicable, service-worker readiness, offline reopening after an online load and the absence of uncaught page errors were checked. Offline checks ran after the worker had taken control; they do not claim first-ever offline installation.

[Desktop screenshot](preview.png) · [Mobile screenshot](mobile.png)

## Limits of this record

Safari, Firefox, real phones and assistive technologies were not exercised. No representative user study, productivity measurement, adoption metric or security audit was performed. Browser storage and clipboard permissions depend on user settings. Shared GitHub Pages origins do not isolate applications from each other; see DECISIONS.md.
