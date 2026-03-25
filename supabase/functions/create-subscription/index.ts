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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const supabaseAdmin = createSupabaseClient(true);

    // Check for existing customer record with stripe_customer_id
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let stripeCustomerId = customer?.stripe_customer_id;

    // Create Stripe customer if none exists
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      stripeCustomerId = stripeCustomer.id;

      // Upsert customer record
      await supabaseAdmin.from("customers").upsert({
        id: user.id,
        stripe_customer_id: stripeCustomerId,
        subscription_status: "none",
      });
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://songforyou.app";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: Deno.env.get("STRIPE_PRICE_ID")!,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: { user_id: user.id },
    });

    return jsonResponse({ url: session.url });
  } catch (err) {
    return errorResponse(err.message || "Internal server error", 500);
  }
});
