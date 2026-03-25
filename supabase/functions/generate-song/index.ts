import {
  corsHeaders,
  createSupabaseClient,
  jsonResponse,
  errorResponse,
} from "../_shared/utils.ts";
import { buildMusicPrompt } from "../_shared/music.ts";

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

    // Send delivery email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "hello@songforyou.app";
    const siteUrl = Deno.env.get("SITE_URL") || "https://songforyou.app";

    if (resendKey && userEmail) {
      const occasionLabel = songRequest.occasion
        ? songRequest.occasion.charAt(0).toUpperCase() +
          songRequest.occasion.slice(1)
        : "Custom";
      const recipientStr = songRequest.recipient_name
        ? ` for ${songRequest.recipient_name}`
        : "";

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `SongForYou <${fromEmail}>`,
          to: [userEmail],
          subject: `Your custom ${occasionLabel.toLowerCase()} song is ready! 🎵`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
              <h1 style="color: #8b5cf6;">Your song is ready!</h1>
              <p>Your custom <strong>${occasionLabel}</strong> song${recipientStr} has been generated and is ready to play.</p>
              <p style="margin: 24px 0;">
                <a href="${siteUrl}/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600;">
                  Play & Download Your Song
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                Song Details:<br/>
                Occasion: ${occasionLabel}<br/>
                Style: ${(songRequest.genres || []).join(", ") || "Custom"}<br/>
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 24px;">
                Listen, download, and share your one-of-a-kind song from your dashboard.
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">
                — The SongForYou Team<br/>
                <a href="${siteUrl}" style="color: #8b5cf6;">songforyou.app</a>
              </p>
            </div>
          `,
        }),
      });
    }

    // Notify owner
    const ownerEmail = Deno.env.get("OWNER_EMAIL");
    if (resendKey && ownerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `SongForYou <${fromEmail}>`,
          to: [ownerEmail],
          subject: `New song delivered: ${songRequest.occasion || "Custom"} for ${songRequest.recipient_name || "someone"}`,
          html: `<p>Song ${songRequestId} delivered to ${userEmail}.</p><p><a href="${songUrl}">Download MP3</a></p>`,
        }),
      });
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
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const ownerEmail = Deno.env.get("OWNER_EMAIL");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "hello@songforyou.app";
    if (resendKey && ownerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `SongForYou <${fromEmail}>`,
          to: [ownerEmail],
          subject: `Song generation FAILED: ${songRequestId}`,
          html: `<p>Error: ${err.message}</p>`,
        }),
      });
    }

    return errorResponse(err.message || "Song generation failed", 500);
  }
});
