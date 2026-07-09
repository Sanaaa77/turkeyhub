# TurkeyHub Phase 1 Technical Audit

## Scope

This audit covers the current Next.js 14 App Router codebase, dependency installation, local development startup, TypeScript validation, and production build validation.

## Current Architecture

TurkeyHub follows the intended layered architecture in the active code paths:

1. Supabase clients in `src/lib/supabase`.
2. Domain services in `src/services/*`.
3. React Query integration through `src/hooks/useQueryProvider.tsx` and query keys in `src/lib/react-query/queryKeys.ts`.
4. Application hooks/context in `src/hooks`.
5. Feature and UI components in `src/components`.
6. App Router pages and routes in `src/app`.

## Prioritized Findings

### P0 — Build failures

- Production builds failed during static prerendering when Supabase environment variables were absent. The failure was triggered by eager Supabase browser client creation inside the root providers, which affected `/`, `/dashboard`, `/login`, and `/_not-found`.
- Middleware also assumed Supabase environment variables were always present, making local builds brittle in clean environments.

### P1 — TypeScript errors

- `tsc --noEmit` completed successfully before code changes. No TypeScript errors were found.

### P2 — Runtime errors

- `AuthProvider` recreated the Supabase client on each render, causing its auth initialization effect to have an unstable dependency and potentially repeat unnecessarily.
- Dashboard service calls can still fail without a configured Supabase project, but they are isolated behind runtime error handling and no longer break the production build.

### P3 — Broken imports

- No broken imports were found by TypeScript validation or the production compiler.

### P4 — Missing dependencies

- `npm install` completed with the existing dependency graph. No missing package dependency was found.

### P5 — Duplicate files

- Duplicate basenames exist across normal architecture boundaries, such as `page.tsx`, `index.ts`, `middleware.ts`, and `utils.ts`. These are expected conventions rather than duplicate implementations.
- No duplicate component, hook, service, or repository implementation requiring removal was found in this pass.

### P6 — Dead code

- A development-only `console.log` in `JourneyProvider.toggleBookmark` was identified and removed.

### P7 — Architecture cleanup

- ESLint configuration was missing, causing `npm run lint` to open an interactive setup prompt in non-interactive environments. A project ESLint config now extends `next/core-web-vitals`.
- Supabase environment resolution is now centralized in `src/lib/supabase/config.ts` instead of being duplicated across client, server, and middleware factories.
- Middleware now skips Supabase session refresh when credentials are not configured, keeping the app buildable in clean CI/local environments.

### P8 — Performance improvements

- The Supabase browser client is memoized inside `AuthProvider` to avoid repeated client creation and repeated auth effect churn.
- React Query Devtools are now rendered only in development.
- Existing image rendering warnings remain as follow-up performance work: several components still use raw `<img>` tags and should be migrated to `next/image` in a focused pass.

## Verification Status

- Dependency installation: completed.
- Local development server: starts successfully.
- TypeScript validation: passes.
- Production build: passes after stabilization changes.
- Lint: passes with warnings for existing raw `<img>` usage.

## Remaining Recommendations

1. Add CI scripts for `typecheck` and a supported lint command because `next lint` is deprecated in newer Next.js releases.
2. Add an environment template documenting `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add automated dependency-cycle detection as a dev dependency once the stabilization branch is merged.
4. Replace placeholder dashboard data with repository/service-backed data only after the stabilized build remains green.
