/**
 * One-time script to generate 15-second example songs via ElevenLabs
 * and upload them to Supabase Storage.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx \
 *     deno run --allow-net --allow-env scripts/generate-examples.ts
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/music/compose";
const MUSIC_LENGTH_MS = 15000; // 15 seconds

const EXAMPLES = [
  {
    name: "birthday",
    prompt: `pop, funk, joyful, energetic
upbeat funk-pop with smooth, energetic male vocals, retro grooves, and a feel-good dance rhythm
mixed vocals

A joyful Birthday song for Sarah.

[Verse]
Sarah is turning 30 today and she loves adventure and travel. She's climbed mountains, explored new cities, and always lives life to the fullest. This is a celebration of her spirit.

[Chorus]
A joyful chorus capturing the heart of this Birthday moment for Sarah.`,
  },
  {
    name: "wedding",
    prompt: `acoustic, soul, romantic, emotional
acoustic folk-pop with warm, heartfelt male vocals, fingerpicked guitar, and intimate storytelling
mixed vocals

A romantic Wedding song for Emma & James.

[Verse]
Emma and James are getting married today. They met in college and have been inseparable ever since. Their love story is about growing old together, holding hands through every chapter of life.

[Chorus]
A romantic chorus capturing the heart of this Wedding moment for Emma & James.`,
  },
  {
    name: "anniversary",
    prompt: `folk, country, nostalgic, warm
deep country folk with rich, resonant male baritone vocals, acoustic guitar, and simple, honest storytelling
mixed vocals

A nostalgic Anniversary song for Mom & Dad.

[Verse]
Mom and Dad are celebrating 25 years together. From their first dance to raising a family, every moment has been a blessing. This song remembers their beautiful journey together.

[Chorus]
A nostalgic chorus capturing the heart of this Anniversary moment for Mom & Dad.`,
  },
];

async function main() {
  const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!elevenLabsKey || !supabaseUrl || !supabaseKey) {
    console.error(
      "Required env vars: ELEVENLABS_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    );
    Deno.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const example of EXAMPLES) {
    console.log(`\nGenerating ${example.name}...`);

    const res = await fetch(ELEVENLABS_API_URL, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: example.prompt,
        music_length_ms: MUSIC_LENGTH_MS,
        force_instrumental: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `ElevenLabs error for ${example.name} (${res.status}): ${errText}`
      );
      continue;
    }

    const audioData = await res.arrayBuffer();
    console.log(
      `  Generated ${(audioData.byteLength / 1024).toFixed(1)}KB audio`
    );

    const filePath = `examples/${example.name}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(filePath, audioData, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`  Upload failed for ${example.name}:`, uploadError.message);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("songs")
      .getPublicUrl(filePath);

    console.log(`  Uploaded: ${urlData.publicUrl}`);
  }

  console.log("\nDone!");
}

main();
