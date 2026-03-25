import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createSupabaseClient, jsonResponse, errorResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) return errorResponse("Missing Stripe signature", 400);

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      return errorResponse(`Webhook signature verification failed: ${err.message}`, 400);
    }

    const supabase = createSupabaseClient(true);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: customer } = await supabase
          .from("customers")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (customer) {
          await supabase
            .from("customers")
            .update({
              subscription_status: subscription.status,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
              current_period_end: subscription.current_period_end
                ? new Date(
                    subscription.current_period_end * 1000
                  ).toISOString()
                : null,
            })
            .eq("id", customer.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        await supabase
          .from("customers")
          .update({ subscription_status: "cancelled" })
          .eq("stripe_customer_id", stripeCustomerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId = invoice.customer as string;

        await supabase
          .from("customers")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", stripeCustomerId);
        break;
      }

      default:
        // Unhandled event types are ignored
        break;
    }

    return jsonResponse({ received: true });
  } catch (err) {
    return errorResponse(err.message || "Webhook handler error", 500);
  }
});
