# Thrive Daily

A modern, installable PWA for daily protocols, classical virtues, touchstones, healthy habits, science-backed guidance, and live accountability coaching.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and local storage for offline-friendly progress.

## Features

- **Home / Dashboard** — Welcome, Daily Score (150+ = Thriving), streak, badges, virtue & touchstone of the day
- **Daily Protocols** — Wake-Up → Bedtime stacks with checkboxes, points, live total, midnight reset
- **Virtues** — Cardinal, theological, and eudaimonia virtues + reflection notes
- **Daily Touchstones** & **Healthy Habits** trackers
- **Science** — How-to, why it matters, detailed science, external links
- **Accountability Coaching** — Live human coaching offer with pricing tiers
- **Gamification** — Points, streaks, levels, badges
- **PWA** — Install to home screen; light service worker
- **Dark / light mode**

## Local development

```bash
cd thrive-daily
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
cd thrive-daily
vercel
# then for production:
vercel --prod
```

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import the repo (Framework Preset: Next.js)
4. Deploy

### After deploy

- Open the site on mobile Safari / Chrome → **Add to Home Screen** / **Install app**
- Completions, scores, and streaks store in the browser’s **localStorage** (per device)

## Data & reset

- Protocol completions reset at **local midnight**
- Lifetime points, streaks, and badges persist until storage is cleared
- Use **Reset today** on Protocols to clear the current day’s checks

## Project structure

```
src/
  app/           # Routes (App Router)
  components/    # Shell, UI, theme, PWA
  data/          # Habits, virtues, badges, touchstones
  lib/           # Store, storage, scoring, types
public/
  icons/         # PWA icons
  sw.js          # Service worker
  manifest.webmanifest
```

## Score guide

| Score   | Tier              |
|---------|-------------------|
| 200+    | Peak Performance  |
| 150+    | **Thriving**      |
| 100+    | Strong Day        |
| 50+     | Building          |
| 1+      | Started           |

Max daily protocol points: **263** (27 habits from your protocol export).

## License

Private — Thrive Daily.
