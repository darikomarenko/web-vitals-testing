# Web Vitals lab (CLS, INP, TTFB)

Interactive React + TypeScript demo of [Web Vitals](https://web.dev/vitals/).
It intentionally makes Core Web Vitals worse so you can see the metric move.

| Metric | What the lab does | Fix in the “good” path |
| --- | --- | --- |
| **CLS** | Injects a banner and hero image after 1–2s with no reserved space | Slot + `aspect-ratio` |
| **INP** | `onClick` busy-loop on the main thread | Update UI without blocking |
| **TTFB** | Vite middleware delays `index.html` when `?ttfb=2000` | Reload without the query |

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

1. **CLS** — Start late injection, watch the article jump and CLS climb past 0.1.
2. **INP** — Click the button in Bad mode; INP should go into needs-improvement / poor.
3. **TTFB** — Reload with slow TTFB; the HUD TTFB value is the HTML wait, not the React fetch.

LCP and FCP are shown as supporting metrics only.
