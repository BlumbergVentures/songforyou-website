# SongForYou

A custom AI-generated song platform with Supabase backend, Stripe subscriptions, and automated Suno integration.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Payments**: Stripe (subscriptions, $9.99/week with 7-day free trial)
- **Song Generation**: Suno API (automated via edge function)
- **Email**: Resend
- **Hosting**: Vercel

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. `npm install`
4. `npm run dev`

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Edge Function Secrets

Set these in your Supabase project dashboard:
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `STRIPE_PRICE_ID` — Price ID for the weekly subscription
- `RESEND_API_KEY` — Resend email API key
- `FROM_EMAIL` — Sender email address
- `OWNER_EMAIL` — Owner notification email
- `SITE_URL` — Your deployed site URL
- `SUNO_API_URL` — Suno API provider URL
- `SUNO_API_KEY` — Suno API key

## How It Works

1. Customer signs up and starts a 7-day free trial ($9.99/week after)
2. Customer fills out the song creation form (occasion, story, genre, mood, voice, artist style)
3. Order is saved to Supabase and song generation is triggered automatically via Suno
4. Customer receives the finished song via email and in their dashboard
5. Subscription allows up to 10 songs per month

## Project Structure

```
src/
  App.jsx              — Router (/, /dashboard, /account)
  main.jsx             — Entry point with BrowserRouter + AuthProvider
  styles.css           — Global styles
  lib/supabase.js      — Supabase client
  context/AuthContext.jsx — Auth state provider
  components/          — UI components (Header, Hero, SongForm, etc.)
  pages/               — Full page layouts (Landing, Dashboard, Account)
```

## Deployment

Deploy to Vercel — the `vercel.json` handles SPA routing.
