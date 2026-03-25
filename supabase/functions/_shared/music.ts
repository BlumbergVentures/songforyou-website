// Artist template style descriptions for ElevenLabs prompts.
// ElevenLabs blocks artist names in prompts, so we describe styles instead.

export const artistStyleMap: Record<string, string> = {
  adele:
    "powerful soul-pop ballad with dramatic, emotive female vocals, piano-driven arrangement, and sweeping orchestral builds",
  beyonce:
    "dynamic R&B pop anthem with confident, commanding female vocals, bold beats, and a polished production style",
  "billie-eilish":
    "dark, minimalist alt-pop with breathy, intimate female vocals, sparse beats, and atmospheric production",
  "bruno-mars":
    "upbeat funk-pop with smooth, energetic male vocals, retro grooves, and a feel-good dance rhythm",
  drake:
    "moody hip-hop and R&B blend with melodic male vocals, atmospheric 808 beats, and introspective lyrics",
  "ed-sheeran":
    "acoustic folk-pop with warm, heartfelt male vocals, fingerpicked guitar, and intimate storytelling",
  "frank-sinatra":
    "classic jazz-pop standard with smooth, sophisticated male vocals, big band arrangement, and timeless swing feel",
  "johnny-cash":
    "deep country folk with rich, resonant male baritone vocals, acoustic guitar, and simple, honest storytelling",
  "taylor-swift":
    "catchy pop anthem with bright, expressive female vocals, polished production, and emotionally vivid songwriting",
  custom: "", // Custom uses user-provided genres/moods/references directly
};

export function buildMusicPrompt(songRequest: {
  occasion: string | null;
  recipient_name: string | null;
  story: string;
  genres: string[];
  moods: string[];
  voice_type: string | null;
  artist_reference: string | null;
  artist_template_slug: string | null;
}): string {
  const {
    occasion,
    recipient_name,
    story,
    genres,
    moods,
    voice_type,
    artist_reference,
    artist_template_slug,
  } = songRequest;

  // Build style description
  const templateStyle =
    artist_template_slug && artistStyleMap[artist_template_slug]
      ? artistStyleMap[artist_template_slug]
      : "";

  const genreStr = genres?.length ? genres.join(", ") : "pop";
  const moodStr = moods?.length ? moods.join(", ") : "emotional";
  const voiceStr = voice_type || "mixed vocals";

  // Build the prompt
  const parts: string[] = [];

  // Style tags at the start (ElevenLabs best practice)
  parts.push(`${genreStr}, ${moodStr}`);

  if (templateStyle) {
    parts.push(templateStyle);
  } else if (artist_reference) {
    // For custom templates, use the user's style description
    parts.push(`Style: ${artist_reference}`);
  }

  parts.push(`${voiceStr} vocals`);

  // Song context
  const forWhom = recipient_name ? `for ${recipient_name}` : "";
  const occasionStr = occasion ? `${occasion} song` : "song";
  parts.push(`\nA ${moodStr} ${occasionStr} ${forWhom}.`);

  // Structured lyrics from story
  parts.push(`\n[Verse]\n${story}`);
  parts.push(
    `\n[Chorus]\nA ${moodStr} chorus capturing the heart of this ${occasion || "special"} moment ${forWhom}.`
  );

  return parts.join("\n");
}
