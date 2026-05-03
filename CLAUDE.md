# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build + type-check
npm run lint     # ESLint
npx tsc --noEmit # type-check only
```

## Architecture

**Stack:** Next.js 16.2.4 (App Router), React 19, TypeScript, Tailwind CSS v4, MongoDB via Mongoose, `uuid` for user identity.

### Request flow

All pages live under the `(app)` route group. `src/app/(app)/layout.tsx` wraps every app page with `AppProvider` + `ExpenseSheetProvider` and redirects to `/onboarding` when `state.onboarded` is false. The onboarding page (`src/app/onboarding/page.tsx`) has its own `AppProvider` instance.

### Identity & API auth

Users are identified by a UUID stored in `localStorage` under `spendshift_uid`. Every client-side `fetch` to `/api/*` sends this value in the `X-User-Id` header. All API route handlers read it via `await headers()` — this is required to keep routes dynamic (not statically cached). There is no session or JWT.

### State management

`AppContext` (`src/contexts/AppContext.tsx`) is the single source of truth. It loads all user data (user profile, categories, expenses, budgets) in parallel on mount from the API, then exposes typed CRUD actions (`addExpense`, `saveBudget`, `saveCategory`, etc.) that optimistically update local state and persist to MongoDB. Tweaks (font pair, density, animation level) are stored in `localStorage` under `spendshift_tweaks`.

`ExpenseSheetContext` (`src/contexts/ExpenseSheetContext.tsx`) is a thin layer that lets any screen open the `AddExpenseSheet` without prop-drilling.

### Component hierarchy (atomic design)

- **atoms** — stateless primitives with no external dependencies: `Tap` (spring-animated pressable), `Card`, `Button`, `Progress`, `Toggle`, `Radio`, `AnimNum`, `Donut`, `Segmented`, `Icons`
- **molecules** — composed from atoms, no context access: `Sheet` (bottom drawer), `ExpenseRow`, `CurrencyPicker`, `PageHeader`, `SpendingBars`
- **organisms** — consume context, contain screen logic: `AppShell`, `AddExpenseSheet`, `Onboarding`, `*Screen` components

Screen components live in `organisms/` and are imported directly by `(app)/*/page.tsx` files. Pages are thin wrappers that just render the screen component.

### Design system

Styling uses CSS custom properties defined in `src/app/globals.css` — not Tailwind utilities. Use `var(--accent)`, `var(--bg)`, `var(--ink)`, `var(--surface)`, `var(--line)`, etc. for all colors. Border radii use `var(--r-sm)` / `var(--r)` / `var(--r-lg)` / `var(--r-xl)`. Dark mode is applied by setting `data-theme="dark"` on `<html>` — never use a CSS class for theming. Numeric values (amounts, monospace) use the `num` CSS class to switch to `var(--font-num)`.

### Database

`src/lib/db.ts` caches the Mongoose connection in `global._mongooseConn`. Models live in `src/lib/models/` and use a separate `*Id` field (e.g. `expenseId`, `categoryId`) as the app-level ID so MongoDB's `_id` is never exposed to the client. Always index on `{ userId: 1, *Id: 1 }` with `unique: true`.

### Environment

`MONGODB_URI` is required in `.env.local` (MongoDB Atlas connection string is already configured).
