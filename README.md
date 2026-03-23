# SongForYou

A custom AI-generated song platform with Supabase backend, Stripe subscriptions, and automated Suno integration.

## Features

- **10 Artist Templates** — Pre-built styles: Adele, Beyonce, Billie Eilish, Bruno Mars, Drake, Ed Sheeran, Frank Sinatra, Johnny Cash, Taylor Swift, or fully Custom
- **Automated Song Generation** — Songs generated via Suno AI and delivered in minutes
- **Subscription Model** — 7-day free trial, then $9.99/week for up to 10 songs/month
- **Dashboard** — Track song history, see usage meter, play and download delivered songs
- **Account Management** — Manage subscription via Stripe billing portal
- **Email Notifications** — Confirmation on order, delivery email with MP3 download link
- **Auth** — Email + password sign up/sign in via Supabase Auth

## Tech Stack

- **Frontend**: React 18 + Vite 5, React Router v7
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions, RLS)
- **Payments**: Stripe (subscriptions, $9.99/week with 7-day free trial)
- **Song Generation**: Suno API (automated via `generate-song` edge function)
- **Email**: Resend
- **Hosting**: Vercel

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

## Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Edge Function Secrets

Set these in **Supabase Dashboard > Project Settings > Edge Functions > Secrets**:

| Secret | Description |
|--------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Price ID for the weekly subscription |
| `RESEND_API_KEY` | Resend email API key |
| `FROM_EMAIL` | Sender email address (e.g., `songs@yourdomain.com`) |
| `OWNER_EMAIL` | Owner notification email |
| `SITE_URL` | Your deployed site URL (e.g., `https://songforyou.com`) |
| `SUNO_API_URL` | Suno API provider URL (e.g., `https://api.sunoapi.org`) |
| `SUNO_API_KEY` | Suno API key from your provider |

## How It Works

1. Customer signs up and starts a 7-day free trial ($9.99/week after)
2. Customer selects an artist template (or creates a custom style) and fills out the song form
3. Order is saved to Supabase and song generation is triggered automatically via Suno AI
4. Song is generated in minutes and delivered via email with an MP3 download link
5. Customer can also play and download songs from their dashboard
6. Subscription allows up to 10 songs per month, managed via Stripe billing portal

## Project Structure

```
src/
  App.jsx                       — Router (/, /dashboard, /account)
  main.jsx                      — Entry point (BrowserRouter + AuthProvider)
  styles.css                    — Global styles (Inter font, dark theme, responsive)
  lib/
    supabase.js                 — Supabase client initialization
  context/
    AuthContext.jsx              — Auth state provider (user, session, customer)
  components/
    Header.jsx                  — Sticky nav, auth-aware (sign in/out, dashboard link)
    Hero.jsx                    — Landing hero (pricing, free trial CTA)
    Features.jsx                — Feature grid (5 cards)
    SongForm.jsx                — Song creation form (artist templates + custom, backend integration)
    HowItWorks.jsx              — 3-step explainer
    Testimonials.jsx            — Customer reviews grid
    FAQ.jsx                     — Questions & answers
    CTA.jsx                     — Final call-to-action section
    Footer.jsx                  — Site footer
    AuthModal.jsx               — Sign up / sign in modal
    ProtectedRoute.jsx          — Route guard for authenticated pages
    UsageMeter.jsx              — Shared progress bar (songs used this month)
  pages/
    LandingPage.jsx             — Public landing page (all sections composed)
    DashboardPage.jsx           — Song history, usage meter, audio playback (protected)
    AccountPage.jsx             — Subscription management, stats (protected)
```

## Supabase Edge Functions

| Function | Auth | Description |
|----------|------|-------------|
| `create-subscription` | JWT | Creates Stripe Checkout Session (subscription + 7-day trial) |
| `create-song-request` | JWT | Validates subscription, enforces 10/month limit, inserts order, triggers generation |
| `generate-song` | None (internal) | Calls Suno API, polls for completion, updates DB, emails customer MP3 |
| `get-portal-url` | JWT | Returns Stripe billing portal URL for subscription management |
| `stripe-webhook` | Stripe signature | Handles subscription lifecycle events (created, updated, deleted, payment failed, trial ending) |

## Database Tables

| Table | Description |
|-------|-------------|
| `customers` | User profiles linked to Supabase Auth + Stripe (subscription status, trial dates) |
| `song_requests` | Song orders with status tracking (pending → generating → delivered/failed) |
| `artist_templates` | 10 pre-built artist styles with genre, mood, voice, and reference presets |

## Deployment

Deploy to Vercel — the `vercel.json` handles SPA routing. Set the environment variables in Vercel project settings.
