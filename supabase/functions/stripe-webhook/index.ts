import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createSupabaseClient, jsonResponse, errorResponse } from "../_shared/utils.ts";
import { sendEmail } from "../_shared/email.ts";
import {
  trialStartedEmail,
  paymentReceiptEmail,
  paymentFailedEmail,
  subscriptionCancelledEmail,
  trialEndingEmail,
} from "../_shared/email-templates.ts";

const siteUrl = Deno.env.get("SITE_URL") || "https://songforyou.app";

async function getCustomerEmail(
  supabase: ReturnType<typeof createSupabaseClient>,
  stripeCustomerId: string
): Promise<string | null> {
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (!customer) return null;

  const { data: { user } } = await supabase.auth.admin.getUserById(customer.id);
  return user?.email || null;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "usd",
  }).format(amount / 100);
}

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

        // Send trial started email on new subscription with trial
        if (
          event.type === "customer.subscription.created" &&
          subscription.trial_end
        ) {
          const email = await getCustomerEmail(supabase, stripeCustomerId);
          if (email) {
            const template = trialStartedEmail({
              trialEndDate: formatDate(subscription.trial_end),
              dashboardUrl: `${siteUrl}/dashboard`,
            });
            await sendEmail({ to: email, ...template });
          }
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

        const email = await getCustomerEmail(supabase, stripeCustomerId);
        if (email) {
          const template = subscriptionCancelledEmail({
            resubscribeUrl: `${siteUrl}/#pricing`,
          });
          await sendEmail({ to: email, ...template });
        }
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        const email = await getCustomerEmail(supabase, stripeCustomerId);
        if (email && subscription.trial_end) {
          const template = trialEndingEmail({
            trialEndDate: formatDate(subscription.trial_end),
            dashboardUrl: `${siteUrl}/dashboard`,
          });
          await sendEmail({ to: email, ...template });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId = invoice.customer as string;

        // Skip $0 invoices (trial period)
        if (invoice.amount_paid > 0) {
          const email = await getCustomerEmail(supabase, stripeCustomerId);
          if (email) {
            const template = paymentReceiptEmail({
              amount: formatCurrency(invoice.amount_paid, invoice.currency),
              date: formatDate(invoice.created),
              invoiceUrl: invoice.hosted_invoice_url || `${siteUrl}/account`,
              dashboardUrl: `${siteUrl}/dashboard`,
            });
            await sendEmail({ to: email, ...template });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId = invoice.customer as string;

        await supabase
          .from("customers")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", stripeCustomerId);

        const email = await getCustomerEmail(supabase, stripeCustomerId);
        if (email) {
          const template = paymentFailedEmail({
            updatePaymentUrl: `${siteUrl}/account`,
          });
          await sendEmail({ to: email, ...template });
        }
        break;
      }

      default:
        break;
    }

    return jsonResponse({ received: true });
  } catch (err) {
    return errorResponse(err.message || "Webhook handler error", 500);
  }
});
