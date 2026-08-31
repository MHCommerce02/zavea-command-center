# Deploying ZAVÉA Command Center to Vercel

This project is a standard Next.js 14 App Router application — Vercel
detects and builds it natively, no `vercel.json` required.

## Environment variables (set in Vercel, never in the repo)

In the Vercel project's **Settings → Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xvvrrprigmhayyeglizg.supabase.co` | Public — safe client-side |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the `sb_publishable_...` key from Supabase → Project Settings → API | Public — safe client-side, protected entirely by RLS |

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` here or anywhere in this project.
It is not used by this app and must never be exposed client-side.

See `.env.local.example` for local development — copy it to `.env.local`
(gitignored) and fill in the same two values to run `npm run dev` locally.

## Build

Vercel runs `npm install` then `npm run build` automatically on push/deploy.
Both have been verified to pass in this environment:

```
npm run typecheck   # tsc --noEmit
npm run build       # next build
```

## What this deploys

Mission Control, My Day, and Ask ZAVÉA, reading and writing the live
Supabase project (`Zavea-Command-Center`) via the anon key + RLS. No
Shopify, Meta, Google Calendar, or real AI provider connected yet.
