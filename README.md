# SongForYou

A custom AI-generated song platform with Supabase backend, Stripe subscriptions, and ElevenLabs music generation.

## Features

- **10 Artist Templates** — Pre-built styles: Adele, Beyonce, Billie Eilish, Bruno Mars, Drake, Ed Sheeran, Frank Sinatra, Johnny Cash, Taylor Swift, or fully Custom
- **AI Song Generation** — Songs generated via ElevenLabs Music API and delivered in minutes
- **Subscription Model** — 7-day free trial, then $9.99/week for up to 10 songs/month
- **Dashboard** — Track song history, see usage meter, play and download delivered songs
- **Account Management** — Manage subscription via Stripe billing portal
- **Branded Email System** — 10 email templates covering auth, song delivery, and billing lifecycle
- **Auth** — Email/password and Google OAuth sign-in via Supabase Auth
- **Song Examples** — 15-second audio samples on the landing page so visitors can hear before signing up

## Tech Stack

- **Frontend**: React 18 + Vite 5, React Router v7
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions, Storage, RLS)
- **Payments**: Stripe (subscriptions, $9.99/week with 7-day free trial)
- **Song Generation**: ElevenLabs Music API (via `generate-song` edge function)
- **Email**: Resend (branded dark-theme templates)
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
| `ELEVENLABS_API_KEY` | ElevenLabs API key for music generation |
| `RESEND_API_KEY` | Resend email API key |
| `FROM_EMAIL` | Sender email address (e.g., `hello@songforyou.app`) |
| `OWNER_EMAIL` | Owner notification email |
| `SITE_URL` | Your deployed site URL (e.g., `https://songforyou.app`) |

## How It Works

1. Customer signs up (email/password or Google OAuth) and starts a 7-day free trial ($9.99/week after)
2. Customer selects an artist template (or creates a custom style) and fills out the song form
3. Order is saved to Supabase and song generation is triggered automatically via ElevenLabs
4. Song is generated (~3 minutes) and delivered via branded email with a dashboard link
5. Customer can play and download songs from their dashboard
6. Subscription allows up to 10 songs per month, managed via Stripe billing portal

## Project Structure

```
src/
  App.jsx                       — Router (10 routes)
  main.jsx                      — Entry point (BrowserRouter + AuthProvider)
  styles.css                    — Global styles (Inter font, dark theme, responsive)
  lib/
    supabase.js                 — Supabase client initialization
  context/
    AuthContext.jsx              — Auth state provider (user, session, customer, Google OAuth)
  styles/
    shared.js                   — Shared color tokens, card styles, section layouts
  components/
    Header.jsx                  — Sticky nav, auth-aware (sign in/out, dashboard link)
    Hero.jsx                    — Landing hero (pricing, free trial CTA)
    Features.jsx                — Feature grid (5 cards)
    HowItWorks.jsx              — 3-step explainer
    SongExamples.jsx            — Audio player cards with 15s example songs
    Testimonials.jsx            — Customer reviews grid
    Pricing.jsx                 — Pricing section
    SongForm.jsx                — Song creation form (artist templates + custom, backend integration)
    FAQ.jsx                     — Questions & answers
    CTA.jsx                     — Final call-to-action section
    Footer.jsx                  — Site footer with legal links
    AuthModal.jsx               — Sign up / sign in modal (email + Google OAuth)
    ProtectedRoute.jsx          — Route guard for authenticated pages
    UsageMeter.jsx              — Shared progress bar (songs used this month)
    ErrorBoundary.jsx           — Global error boundary with reset option
  pages/
    LandingPage.jsx             — Public landing page (all sections composed)
    DashboardPage.jsx           — Song history, usage meter, audio playback (protected)
    AccountPage.jsx             — Subscription management, stats (protected)
    AuthCallbackPage.jsx        — OAuth & email confirmation redirect handler
    CheckoutSuccessPage.jsx     — Post-checkout success page
    CheckoutCancelPage.jsx      — Post-checkout cancel page
    TermsPage.jsx               — Terms of Service
    PrivacyPage.jsx             — Privacy Policy
    RefundPolicyPage.jsx        — Refund Policy
    NotFoundPage.jsx            — 404 page

scripts/
  generate-examples.ts          — One-time Deno script to generate 15s example songs

supabase/
  migrations/
    20260325000000_initial_schema.sql — Database schema + seed data
  functions/
    _shared/
      utils.ts                  — CORS, Supabase clients, auth helpers, response formatters
      email.ts                  — Resend email sender
      email-templates.ts        — 10 branded HTML email templates (auth, song, billing)
      music.ts                  — ElevenLabs prompt builder + artist style map
    create-subscription/        — Creates Stripe Checkout Session (7-day trial)
    create-song-request/        — Validates subscription, enforces limits, triggers generation
    generate-song/              — Calls ElevenLabs API, uploads MP3, emails customer
    get-portal-url/             — Returns Stripe billing portal URL
    stripe-webhook/             — Handles subscription lifecycle + billing emails
    send-auth-email/            — Supabase Auth "Send Email" hook (branded templates)
```

## Routes

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | LandingPage | Public | Hero, features, examples, pricing, song form |
| `/dashboard` | DashboardPage | Protected | Song history, usage meter, playback |
| `/account` | AccountPage | Protected | Subscription management, stats |
| `/auth/callback` | AuthCallbackPage | Public | OAuth & email confirmation handler |
| `/checkout/success` | CheckoutSuccessPage | Public | Post-checkout success |
| `/checkout/cancel` | CheckoutCancelPage | Public | Post-checkout cancel |
| `/terms` | TermsPage | Public | Terms of Service |
| `/privacy` | PrivacyPage | Public | Privacy Policy |
| `/refunds` | RefundPolicyPage | Public | Refund Policy |
| `*` | NotFoundPage | Public | 404 |

## Supabase Edge Functions

| Function | Auth | Description |
|----------|------|-------------|
| `create-subscription` | JWT | Creates Stripe Checkout Session (subscription + 7-day trial) |
| `create-song-request` | JWT | Validates subscription, enforces 10/month limit, inserts order, triggers generation |
| `generate-song` | JWT | Calls ElevenLabs API, uploads MP3 to Storage, sends delivery email |
| `get-portal-url` | JWT | Returns Stripe billing portal URL for subscription management |
| `stripe-webhook` | Stripe signature | Handles subscription lifecycle events + sends billing emails |
| `send-auth-email` | None (auth hook) | Branded email templates for signup confirmation and password reset |

## Database Tables

| Table | Description |
|-------|-------------|
| `customers` | User profiles linked to Supabase Auth + Stripe (subscription status, trial dates) |
| `song_requests` | Song orders with status tracking (pending → generating → delivered/failed) |
| `artist_templates` | 10 pre-built artist styles with genre, mood, voice, and reference presets |

## Storage

Songs are stored in a public Supabase Storage bucket called `songs`:

```
songs/
  {songRequestId}.mp3           — User-created songs (3 minutes)
  examples/
    birthday.mp3                — Landing page example (15 seconds)
    wedding.mp3
    anniversary.mp3
```

## Deployment

Deploy to Vercel — the `vercel.json` handles SPA routing and security headers (HSTS, X-Frame-Options, CSP). Set the frontend environment variables in Vercel project settings.
