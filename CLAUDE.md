# CLAUDE.md

Context for AI assistants working in this repo. Read this before touching code.

## What this repo is right now

A trimmed-down version of the ReVamp Next.js starter, kept specifically for **live coding interviews** on the interviewer's own-machine/screen-share format. It's not the full production template anymore — the multi-day AI-agent build pipeline (`dev-resources/`, architecture/implementation/bug/test prompt chains) and the unused demo pages/mock API routes have been deleted. What's left is a working dev server, a proven pattern library, and test tooling — meant to be read from and extended quickly under a clock, not toured.

If a doc under `lib/*/README.md` mentions `components/examples/` or a `/swr-demo`, `/motion-demo` route — those are gone. The doc's inline code samples are still accurate; just copy from the doc/source file directly.

## Stack

Next.js 16 (App Router) · React 19.2 · TypeScript 5 (strict) · Tailwind CSS 4 · shadcn-ui · Redux + Redux Persist · SWR · NextAuth v4 · React Hook Form + Zod · Jest + Testing Library · Playwright

## Where the working patterns live

- **Auth**: `lib/auth/SessionProvider.tsx`, `app/api/auth/[...nextauth]/route.ts`, `app/login/page.tsx` (real working login form, RHF + Zod)
- **Forms**: `lib/forms/schemas/`, `lib/forms/README.md` — RHF + Zod pattern, see `app/login/page.tsx` for a real usage example
- **Data fetching**: `lib/swr/fetcher.ts`, `lib/swr/hooks.ts`, `lib/swr/types.ts` — copy-paste hook patterns (some target `/api/*` routes that no longer exist since the mock backends were removed; point them at whatever endpoint the task needs)
- **Global state**: `lib/redux/` (store, rootReducer, `features/auth`, `features/counter`) — wired up and working. `features/auth`/`features/counter` are also the template to copy the shape from (types, actions, reducer) when a task needs a new slice
- **UI components**: `components/ui/` (shadcn-ui primitives: button, card, input)
- **Animation**: `lib/motion/` (Framer Motion variants)
- **Coding conventions**: `.github/copilot-instructions.md` is the detailed rulebook (TypeScript rules, React rules, import order, testing philosophy). This file doesn't repeat it — follow it.

## Guardrails for interview use

- **No new dependencies.** Everything needed is already in `package.json`. If a task seems to need something that isn't there, say so instead of running `pnpm add`.
- **Don't touch files outside the task.** No drive-by refactors, no "while I'm here" cleanups in unrelated files.
- **Local state for anything scoped to one component.** Use `useState`/`useReducer` for a single component's own state (an input value, a toggle, a form). The moment state needs to be read or written from more than one place, use Redux — the store is already wired (`lib/redux/store.ts`), and it's the pattern this developer knows cold. Don't suggest Context, Zustand, or any other state library as an alternative; Redux is the deliberate choice here, not a default to avoid.
- **Working code over exhaustive polish.** Under a clock, a correct, readable solution beats defensive handling for cases the prompt didn't ask about. Still keep it typed (no `any` without reason) and accessible (semantic HTML, labeled inputs, keyboard support) — those are usually part of what's being evaluated.
- **Move fast.** This is a practice/interview flow, not a production PR — don't pause for confirmation on routine edits within the task; keep going and narrate briefly instead.

## Commands

`pnpm dev` · `pnpm test:unit` · `pnpm test:unit:watch` · `pnpm type-check` · `pnpm lint` · `pnpm validate` (type-check + lint)
