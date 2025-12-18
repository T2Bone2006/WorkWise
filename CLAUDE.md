# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

WorkWise is a property maintenance platform connecting B2B clients (property managers) with tradespeople. Built with Next.js 16 (App Router), Supabase, and Anthropic Claude API.

### Two User Types

1. **B2B Clients** (Property Managers)
   - Auth routes: `/login`, `/register`
   - Dashboard routes: `/jobs`, `/workers`, `/settings` (route group: `(dashboard)`)
   - Create jobs, view worker matches, manage properties

2. **Workers** (Tradespeople)
   - Auth routes: `/worker/login`, `/worker/register`
   - Dashboard routes: `/worker/dashboard`, etc. (route group: `worker/(dashboard)`)
   - Complete AI onboarding interview, receive job matches

### Core Flow

1. B2B client creates a job via `createJob()` in `src/lib/supabase/job-actions.ts`
2. AI matching triggers automatically (`matchJobToWorkers()` in `src/lib/ai/matching.ts`)
3. Claude API detects trade type, then scores and quotes top 3 workers in parallel
4. Matches saved to `worker_matches` table

### Key Directories

- `src/app/(auth)/` - Client auth pages
- `src/app/(dashboard)/` - Client dashboard (jobs, workers, matches)
- `src/app/worker/` - Worker auth and dashboard
- `src/lib/supabase/` - Server actions and Supabase clients
- `src/lib/ai/` - Claude API integration for matching and caching
- `src/components/ui/` - shadcn/ui components

### Supabase Setup

- **Server client**: `createClient()` from `src/lib/supabase/server.ts` (uses cookies)
- **Browser client**: `createClient()` from `src/lib/supabase/client.ts`
- **Middleware**: `src/middleware.ts` handles session refresh and route protection

### Database Tables

- `b2b_clients` - Property managers (ID = auth user ID)
- `workers` - Tradespeople (linked via `user_id` to auth)
- `jobs` - Job listings (linked via `client_id`)
- `worker_matches` - AI-generated job-worker matches
- `worker_ai_profiles` - Worker interview data for AI matching

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Auth/DB**: Supabase (SSR with `@supabase/ssr`)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui with Radix primitives
- **Forms**: react-hook-form + zod
- **Toasts**: sonner

## Path Alias

`@/*` maps to `./src/*`
