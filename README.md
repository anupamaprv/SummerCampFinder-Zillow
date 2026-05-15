# Camp Hero

The Zillow for summer programs. Help parents discover the perfect summer camp or program for their kid in seconds.

## What it does

Search thousands of summer programs by ZIP code, child's age, and interests, then compare them across the dimensions parents actually care about.

## Core Features

- **Smart search** — ZIP code, child's age (required), and interests (optional)
- **Powerful filters** — Program type, schedule, cost slider, distance slider
- **Multiple sort options** — Relevance, cost, distance, uniqueness, fun factor, college impact
- **Favorites** — Save programs to revisit later (stored locally)
- **Detailed program pages** — Full info, photos, and a visual score breakdown

## Scoring System

Every program is scored on three signals so families can compare apples to apples:

- **Uniqueness factor** — How distinctive the program is
- **Fun factor** — Engagement level kids will actually love
- **College impact score** — Surfaced only for ages 13+

## Tech Stack

- TanStack Start (React 19 + Vite 7) with file-based routing
- Tailwind CSS v4 with a custom Navy + Electric Coral design system
- TypeScript, Zod-validated search params
- LocalStorage-backed favorites

## Development

```bash
bun install
bun run dev
```

Open the preview URL printed in the terminal.

## Project Structure

- `src/routes/` — Pages: home, search, program detail, favorites
- `src/components/` — `SearchForm`, `Filters`, `ProgramCard`, `Header`
- `src/lib/` — `programs.ts` (mock data), `scoring.ts`, `favorites.ts`, `types.ts`
- `src/styles.css` — Design tokens and theme