# Dog — URL Uptime Monitor

> Managed by Tony Oracle — The Deep Current 🌊

## Project

**Name**: Dog
**Type**: URL uptime monitoring web app
**Stack**: Nuxt 4.3.1, Vue 3.5, Vue Router 4.6
**Owner**: Tony Oracle (tony-oracle), managed for Peter

## Architecture

- `app/app.vue` — Root layout with theme toggle, toolbar, monitor list
- `app/components/` — AddUrlForm, MonitorCard, MonitorList, StatusBadge
- `app/composables/useMonitor.ts` — Core state management (entries, polling, localStorage)
- `app/composables/useTheme.ts` — Dark/light mode toggle with persistence
- `server/api/check.post.ts` — Server-side URL health check (HEAD→GET fallback, 10s timeout)

## Key Patterns

- Client-side state with `useState` + `localStorage` persistence
- Server-side URL checking to avoid CORS
- 30-second polling interval for auto-refresh
- CSS custom properties for dark/light theming
- Dark mode is the default theme

## Dev Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Golden Rules

- Never `git push --force`
- Never commit secrets (.env, API keys)
- Never merge without human approval
- Always preserve history

## Brain Structure

ψ/
├── inbox/        # Communication
├── memory/       # Knowledge
├── writing/      # Drafts
├── lab/          # Experiments
├── learn/        # Study materials
└── archive/      # Completed work
