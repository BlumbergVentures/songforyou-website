# SongForYou

Custom AI-generated song platform. Users sign up, pick an artist style or go custom, describe their occasion/story, and receive a 3-minute song via ElevenLabs Music API.

## Tech Stack

- **Frontend**: React 18 + Vite 5 (JSX, no TypeScript). Inline styles throughout, shared tokens in `src/styles/shared.js`. Dark theme with purple (#8b5cf6) and pink (#ec4899) gradient accents.
- **Backend**: Supabase Edge Functions (Deno/TypeScript). 6 functions in `supabase/functions/`.
- **Database**: Supabase PostgreSQL with RLS. 3 tables: `customers`, `song_requests`, `artist_templates`.
- **Auth**: Supabase Auth (email/password + Google OAuth). Auth state in `src/context/AuthContext.jsx`.
- **Payments**: Stripe subscriptions ($9.99/week, 7-day trial). Webhook lifecycle in `stripe-webhook`.
- **Music**: ElevenLabs Music API (`/v1/music/compose`). Prompt builder in `supabase/functions/_shared/music.ts`.
- **Email**: Resend API. 10 branded HTML templates in `supabase/functions/_shared/email-templates.ts`.
- **Storage**: Supabase Storage `songs` bucket (public). MP3s stored as `{songRequestId}.mp3`.
- **Hosting**: Vercel with SPA routing (`vercel.json`).

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (output: `dist/`)
- `npm run preview` — Preview built output

## Supabase Project

- Project ref: `bourfjayfmyjzofmgkzm`
- Migration: `supabase/migrations/20260325000000_initial_schema.sql`

## Key Patterns

- All components use inline styles (no CSS framework)
- Shared style tokens exported from `src/styles/shared.js` (colors, cardBase, sectionStyle, etc.)
- Edge functions share code via `supabase/functions/_shared/` (email, templates, music, utils)
- Song generation is async: `create-song-request` fires and forgets to `generate-song`
- Dashboard polls `song_requests` every 10s while songs are pending/generating
- Auth callback page (`/auth/callback`) handles both OAuth redirects and email confirmation tokens
