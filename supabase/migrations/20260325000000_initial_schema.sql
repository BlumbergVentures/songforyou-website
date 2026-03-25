-- SongForYou Database Schema

-- Customers table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT NOT NULL DEFAULT 'none',
  trial_end TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Song requests table
CREATE TABLE IF NOT EXISTS song_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'generating', 'delivered', 'failed')),
  occasion TEXT,
  recipient_name TEXT,
  story TEXT NOT NULL,
  genres TEXT[] DEFAULT '{}',
  moods TEXT[] DEFAULT '{}',
  voice_type TEXT,
  artist_reference TEXT,
  artist_template_slug TEXT,
  song_url TEXT,
  billing_month TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artist templates table
CREATE TABLE IF NOT EXISTS artist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  moods TEXT[] DEFAULT '{}',
  voice_type TEXT,
  artist_reference TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_song_requests_user_id ON song_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_song_requests_billing_month ON song_requests(user_id, billing_month);
CREATE INDEX IF NOT EXISTS idx_song_requests_status ON song_requests(status);
CREATE INDEX IF NOT EXISTS idx_customers_stripe ON customers(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can read own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = id);

-- RLS Policies for song_requests
CREATE POLICY "Users can read own songs"
  ON song_requests FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for artist_templates (public read)
CREATE POLICY "Anyone can read active templates"
  ON artist_templates FOR SELECT
  USING (active = true);

-- Service role has full access (for edge functions)
-- Service role bypasses RLS by default in Supabase

-- Create storage bucket for songs
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read access for songs bucket
CREATE POLICY "Public read access for songs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'songs');

-- Storage policy: service role can upload
CREATE POLICY "Service role upload songs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'songs');

-- Seed artist templates
INSERT INTO artist_templates (slug, name, description, genres, moods, voice_type, artist_reference) VALUES
  ('adele', 'Adele', 'Powerful soul-pop ballads with dramatic vocals', ARRAY['Pop', 'Soul'], ARRAY['Romantic', 'Melancholic', 'Dramatic'], 'Female', 'Powerful soul-pop ballad with dramatic, emotive female vocals and piano-driven arrangement'),
  ('beyonce', 'Beyoncé', 'Dynamic R&B pop anthems with commanding vocals', ARRAY['Pop', 'R&B'], ARRAY['Energetic', 'Uplifting'], 'Female', 'Dynamic R&B pop anthem with confident, commanding female vocals and bold beats'),
  ('billie-eilish', 'Billie Eilish', 'Dark, minimalist alt-pop with intimate vocals', ARRAY['Pop', 'Indie', 'Electronic'], ARRAY['Melancholic', 'Chill'], 'Female', 'Dark, minimalist alt-pop with breathy, intimate female vocals and atmospheric production'),
  ('bruno-mars', 'Bruno Mars', 'Upbeat funk-pop with smooth vocals', ARRAY['Pop', 'Funk', 'R&B'], ARRAY['Happy', 'Energetic', 'Playful'], 'Male', 'Upbeat funk-pop with smooth, energetic male vocals and retro grooves'),
  ('drake', 'Drake', 'Moody hip-hop and R&B blend', ARRAY['Hip-Hop', 'R&B'], ARRAY['Melancholic', 'Chill', 'Intense'], 'Male', 'Moody hip-hop and R&B blend with melodic male vocals and atmospheric 808 beats'),
  ('ed-sheeran', 'Ed Sheeran', 'Acoustic folk-pop with heartfelt storytelling', ARRAY['Pop', 'Folk', 'Acoustic'], ARRAY['Romantic', 'Happy', 'Nostalgic'], 'Male', 'Acoustic folk-pop with warm, heartfelt male vocals and fingerpicked guitar'),
  ('frank-sinatra', 'Frank Sinatra', 'Classic jazz-pop standards with swing', ARRAY['Jazz', 'Pop'], ARRAY['Romantic', 'Nostalgic', 'Peaceful'], 'Male', 'Classic jazz-pop standard with smooth, sophisticated male vocals and big band arrangement'),
  ('johnny-cash', 'Johnny Cash', 'Deep country folk with resonant vocals', ARRAY['Country', 'Folk'], ARRAY['Nostalgic', 'Melancholic', 'Peaceful'], 'Male', 'Deep country folk with rich, resonant male baritone vocals and acoustic guitar'),
  ('taylor-swift', 'Taylor Swift', 'Catchy pop anthems with vivid songwriting', ARRAY['Pop', 'Country'], ARRAY['Happy', 'Romantic', 'Uplifting'], 'Female', 'Catchy pop anthem with bright, expressive female vocals and emotionally vivid songwriting'),
  ('custom', 'Custom', 'Create your own style', ARRAY[]::TEXT[], ARRAY[]::TEXT[], NULL, NULL)
ON CONFLICT (slug) DO NOTHING;
