import {
  corsHeaders,
  createSupabaseClientFromAuth,
  createSupabaseClient,
  jsonResponse,
  errorResponse,
} from "../_shared/utils.ts";

const MONTHLY_LIMIT = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Missing authorization", 401);

    // Get user from auth token
    const supabaseUser = createSupabaseClientFromAuth(authHeader);
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) return errorResponse("Unauthorized", 401);

    const supabaseAdmin = createSupabaseClient(true);

    // Check subscription status
    const { data: customer, error: custError } = await supabaseAdmin
      .from("customers")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (custError || !customer) {
      return errorResponse("No subscription found. Please subscribe first.", 403);
    }

    const { subscription_status } = customer;
    if (subscription_status !== "active" && subscription_status !== "trialing") {
      return errorResponse(
        "Active subscription required. Please subscribe or reactivate.",
        403
      );
    }

    // Check monthly usage limit
    const billingMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { count, error: countError } = await supabaseAdmin
      .from("song_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("billing_month", billingMonth);

    if (countError) {
      return errorResponse("Failed to check usage", 500);
    }

    if ((count || 0) >= MONTHLY_LIMIT) {
      return errorResponse(
        `Monthly limit reached (${MONTHLY_LIMIT} songs). Your limit resets next month.`,
        429
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      occasion,
      recipientName,
      story,
      genres,
      moods,
      voiceType,
      artistReference,
      artistTemplateSlug,
    } = body;

    if (!story || story.trim().length < 10) {
      return errorResponse("Story must be at least 10 characters.", 400);
    }

    // Insert song request
    const { data: songRequest, error: insertError } = await supabaseAdmin
      .from("song_requests")
      .insert({
        user_id: user.id,
        status: "pending",
        occasion: occasion || null,
        recipient_name: recipientName || null,
        story: story.trim(),
        genres: genres || [],
        moods: moods || [],
        voice_type: voiceType || null,
        artist_reference: artistReference || null,
        artist_template_slug: artistTemplateSlug || null,
        billing_month: billingMonth,
      })
      .select("id")
      .single();

    if (insertError) {
      return errorResponse("Failed to create song request", 500);
    }

    // Trigger generate-song function asynchronously
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    fetch(`${supabaseUrl}/functions/v1/generate-song`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        songRequestId: songRequest.id,
        userEmail: user.email,
      }),
    }).catch(() => {
      // Fire-and-forget — errors handled in generate-song
    });

    return jsonResponse({ success: true, songId: songRequest.id });
  } catch (err) {
    return errorResponse(err.message || "Internal server error", 500);
  }
});
