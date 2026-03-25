import { sendEmail } from "../_shared/email.ts";
import {
  confirmationEmail,
  passwordResetEmail,
} from "../_shared/email-templates.ts";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { user, email_data } = payload;

    if (!user?.email || !email_data) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      token_hash,
      redirect_to,
      email_action_type,
      site_url,
    } = email_data;

    // Build the confirmation/reset URL
    const baseRedirect =
      redirect_to || `${site_url || "https://songforyou.app"}/auth/callback`;
    const actionUrl = `${baseRedirect}?token_hash=${token_hash}&type=${email_action_type}`;

    // Select template based on action type
    let template: { subject: string; html: string };

    switch (email_action_type) {
      case "signup":
      case "email_change":
        template = confirmationEmail(actionUrl);
        break;
      case "recovery":
        template = passwordResetEmail(actionUrl);
        break;
      case "magiclink":
        template = confirmationEmail(actionUrl);
        break;
      default:
        // Fallback: send a generic confirmation-style email
        template = confirmationEmail(actionUrl);
        break;
    }

    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send auth email hook error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
