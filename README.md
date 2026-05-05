# Flowmetric — A/B Testing Platform

A full-stack A/B testing and feature flag demo built with Next.js App Router, PostHog, and Postgres. Built to demonstrate real growth engineering concepts: experiment design, statistical significance testing, and conversion tracking.

![Dashboard](/.github/images/dashboard.jpeg)


## What it does

**Landing page** — a fake SaaS product page (Flowmetric) with two hero section variants controlled by a PostHog feature flag. Each visitor is randomly assigned to either the control or treatment variant and stays in that variant for every subsequent visit (sticky bucketing).

**Conversion tracking** — clicking the "Start for free" CTA fires an event to both PostHog (for experiment analysis) and a Postgres database (for the custom dashboard).

**A/B Test Dashboard** (`/dashboard`) — a live dashboard showing:
- Impressions and conversions per variant
- Conversion rate per variant with a bar chart
- Statistical significance using a two-proportion z-test (p-value, confidence level)
- Auto-refreshes every 30 seconds

## How the experiment works

```
User visits /
    ↓
PostHog assigns distinct_id + evaluates hero-variant flag
    ↓
HeroWrapper (Client Component) reads flag → renders HeroA or HeroB
    ↓
Impression event → POST /api/track → Postgres (ab_events table)
    ↓
User clicks CTA
    ↓
Conversion event → PostHog.capture() + POST /api/track → Postgres
    ↓
/dashboard queries Postgres → calculates conversion rate + p-value
```

## Statistical significance

The dashboard runs a **two-proportion z-test** on the conversion rates. This is the standard test used in production A/B testing platforms.

- Requires a minimum of 30 impressions per variant before showing results
- Shows p-value and confidence level (90%, 95%, 99%)
- A result is considered significant at **p < 0.05** (95% confidence)

The significance banner transitions through states as data accumulates:

| State | Meaning |
|---|---|
| Collecting data | < 30 impressions on either variant |
| Experiment running | ≥ 30 samples, p ≥ 0.10 |
| Trending | p < 0.10, not yet significant |
| Significant at 95% | p < 0.05 — safe to call a winner |

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Feature flags / A/B | PostHog |
| Database | Postgres (Neon) |
| Charts | Recharts |
| Deployment | Vercel |

## Project structure

```
app/
  page.tsx              # Landing page (Server Component)
  dashboard/page.tsx    # A/B dashboard (Server Component, force-dynamic)
  api/
    track/route.ts      # POST: record impression or conversion
    stats/route.ts      # GET: aggregated stats per variant
components/
  HeroA.tsx             # Variant A — control hero section
  HeroB.tsx             # Variant B — treatment hero section
  HeroWrapper.tsx       # Client Component: reads PostHog flag, picks variant
  CTAButton.tsx         # Client Component: tracks clicks to PostHog + Postgres
  FeaturesSection.tsx   # Server Component: static marketing copy (zero JS)
  ConversionChart.tsx   # Client Component: Recharts bar chart
  SignificanceBanner.tsx # Significance status indicator
  AutoRefresh.tsx       # Client Component: calls router.refresh() every 30s
lib/
  db.ts                 # Postgres connection pool (server-only)
  stats.ts              # Two-proportion z-test implementation
providers/
  PostHogProvider.tsx   # Client Component: wraps PostHog init
```

## Local setup

**1. Clone and install**

```bash
git clone <repo>
cd ab-testing
npm install
```

**2. Environment variables**

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...       # PostHog project API key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
DATABASE_URL=postgresql://...          # Postgres connection string (Neon recommended)
```

**3. Create the database table**

Run this SQL in your Postgres instance (Neon SQL Editor, psql, etc.):

```sql
CREATE TABLE IF NOT EXISTS ab_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT        NOT NULL CHECK (event_type IN ('impression', 'conversion')),
  variant     TEXT        NOT NULL CHECK (variant IN ('control', 'treatment')),
  distinct_id TEXT        NOT NULL DEFAULT 'anonymous',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ab_events_variant_idx ON ab_events (variant);
CREATE INDEX IF NOT EXISTS ab_events_event_type_idx ON ab_events (event_type);
```

**4. Set up PostHog feature flag**

1. Create a free account at [posthog.com](https://posthog.com)
2. Go to **Feature Flags** → **New feature flag**
3. Set the key to `hero-variant` and type to **Multivariate**
4. Add variants: `control` (50%) and `treatment` (50%)
5. Set release conditions to **All users, 100% rollout**
6. Save and enable the flag

**5. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the dashboard.

## Generating test data

Each browser session gets a unique PostHog `distinct_id` and is sticky-bucketed into a variant. To test both variants:

- Normal browser window → one variant
- Incognito window → likely a different variant (fresh `distinct_id`)

Click the CTA in some sessions to generate conversions. The dashboard updates every 30 seconds automatically.

## Deployment

Deploy to Vercel with one command:

```bash
npx vercel
```

Add the three environment variables (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `DATABASE_URL`) in the Vercel dashboard under **Settings → Environment Variables**.
