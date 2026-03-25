import {
  corsHeaders,
  createSupabaseClient,
  jsonResponse,
  errorResponse,
} from "../_shared/utils.ts";
import { buildMusicPrompt } from "../_shared/music.ts";
import { sendEmail } from "../_shared/email.ts";
import {
  songDeliveryEmail,
  ownerNotificationEmail,
  ownerErrorEmail,
} from "../_shared/email-templates.ts";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/music/compose";
const SONG_DURATION_MS = 180000; // 3 minutes

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(true);

  let songRequestId: string | undefined;

  try {
    const body = await req.json();
    songRequestId = body.songRequestId;
    const userEmail = body.userEmail;

    if (!songRequestId) return errorResponse("Missing songRequestId", 400);

    // Fetch song request
    const { data: songRequest, error: fetchError } = await supabase
      .from("song_requests")
      .select("*")
      .eq("id", songRequestId)
      .single();

    if (fetchError || !songRequest) {
      return errorResponse("Song request not found", 404);
    }

    // Update status to generating
    await supabase
      .from("song_requests")
      .update({ status: "generating" })
      .eq("id", songRequestId);

    // Build prompt for ElevenLabs
    const prompt = buildMusicPrompt(songRequest);
    const isInstrumental = songRequest.voice_type === "Instrumental Only";

    // Call ElevenLabs Music API
    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsKey) throw new Error("ELEVENLABS_API_KEY not configured");

    const musicResponse = await fetch(ELEVENLABS_API_URL, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: SONG_DURATION_MS,
        force_instrumental: isInstrumental,
      }),
    });

    if (!musicResponse.ok) {
      const errBody = await musicResponse.text();
      throw new Error(`ElevenLabs API error (${musicResponse.status}): ${errBody}`);
    }

    // Get audio data as ArrayBuffer
    const audioData = await musicResponse.arrayBuffer();
    const fileName = `${songRequestId}.mp3`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(fileName, audioData, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("songs")
      .getPublicUrl(fileName);

    const songUrl = urlData.publicUrl;

    // Update song request as delivered
    await supabase
      .from("song_requests")
      .update({ status: "delivered", song_url: songUrl })
      .eq("id", songRequestId);

    // Send delivery email
    const siteUrl = Deno.env.get("SITE_URL") || "https://songforyou.app";

    if (userEmail) {
      const template = songDeliveryEmail({
        occasion: songRequest.occasion || "Custom",
        recipientName: songRequest.recipient_name,
        genres: songRequest.genres,
        dashboardUrl: `${siteUrl}/dashboard`,
      });
      await sendEmail({ to: userEmail, ...template });
    }

    // Notify owner
    const ownerEmail = Deno.env.get("OWNER_EMAIL");
    if (ownerEmail) {
      const template = ownerNotificationEmail({
        songRequestId: songRequestId!,
        userEmail: userEmail || "unknown",
        songUrl,
      });
      await sendEmail({ to: ownerEmail, ...template });
    }

    return jsonResponse({ success: true, songUrl });
  } catch (err) {
    // Mark as failed
    if (songRequestId) {
      await supabase
        .from("song_requests")
        .update({ status: "failed" })
        .eq("id", songRequestId);
    }

    // Notify owner of failure
    const ownerEmail = Deno.env.get("OWNER_EMAIL");
    if (ownerEmail && songRequestId) {
      const template = ownerErrorEmail({
        songRequestId,
        errorMessage: err.message || "Unknown error",
      });
      await sendEmail({ to: ownerEmail, ...template });
    }

    return errorResponse(err.message || "Song generation failed", 500);
  }
});
