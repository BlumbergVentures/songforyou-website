import Stripe from "https://esm.sh/stripe@14?target=deno";
import {
  corsHeaders,
  createSupabaseClientFromAuth,
  createSupabaseClient,
  jsonResponse,
  errorResponse,
} from "../_shared/utils.ts";

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

    // Fetch customer's Stripe ID
    const { data: customer, error: custError } = await supabaseAdmin
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (custError || !customer?.stripe_customer_id) {
      return errorResponse("No subscription found", 404);
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const siteUrl = Deno.env.get("SITE_URL") || "https://songforyou.app";

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${siteUrl}/account`,
    });

    return jsonResponse({ url: session.url });
  } catch (err) {
    return errorResponse(err.message || "Internal server error", 500);
  }
});
