// SongForYou Branded Email Templates
// All emails use a consistent dark theme with purple-to-pink gradient accents

const SITE_URL = Deno.env.get("SITE_URL") || "https://songforyou.app";

const COLORS = {
  bgDark: "#0a0a0f",
  cardBg: "#1a1a2e",
  purple: "#8b5cf6",
  pink: "#ec4899",
  textPrimary: "#ffffff",
  textMuted: "#9ca3af",
  textLight: "#d1d5db",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#fbbf24",
};

function baseLayout(options: { preheader?: string; content: string }): string {
  const preheader = options.preheader
    ? `<span style="display:none;font-size:1px;color:#0a0a0f;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${options.preheader}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SongForYou</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDark};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bgDark};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${COLORS.purple} 0%,${COLORS.pink} 100%);padding:24px 32px;border-radius:16px 16px 0 0;text-align:center;">
              <!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:560px;height:68px;"><v:fill type="solid" color="${COLORS.purple}"/><v:textbox inset="0,0,0,0"><![endif]-->
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SongForYou</h1>
              <!--[if mso]></v:textbox></v:rect><![endif]-->
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${COLORS.cardBg};padding:32px;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);">
              ${options.content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${COLORS.cardBg};padding:24px 32px;border-top:1px solid rgba(255,255,255,0.08);border-radius:0 0 16px 16px;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;color:${COLORS.textMuted};font-size:12px;text-align:center;line-height:1.6;">
                &copy; ${new Date().getFullYear()} SongForYou. All rights reserved.<br>
                <a href="${SITE_URL}" style="color:${COLORS.purple};text-decoration:none;">songforyou.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
  <tr>
    <td style="border-radius:12px;background:linear-gradient(135deg,${COLORS.purple} 0%,${COLORS.pink} 100%);">
      <!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:240px;height:48px;"><v:fill type="solid" color="${COLORS.purple}"/><v:textbox inset="0,0,0,0"><center><![endif]-->
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:12px;">
        ${text}
      </a>
      <!--[if mso]></center></v:textbox></v:rect><![endif]-->
    </td>
  </tr>
</table>`;
}

// ─── Auth Emails ─────────────────────────────────────────────

export function confirmationEmail(confirmUrl: string): {
  subject: string;
  html: string;
} {
  return {
    subject: "Confirm your email — SongForYou",
    html: baseLayout({
      preheader: "One click to start creating custom songs",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Welcome to SongForYou!</h2>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Thanks for signing up. Confirm your email address to start creating personalized songs for any occasion.
        </p>
        ${ctaButton("Confirm Email", confirmUrl)}
        <p style="margin:0;color:${COLORS.textMuted};font-size:13px;line-height:1.5;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      `,
    }),
  };
}

export function passwordResetEmail(resetUrl: string): {
  subject: string;
  html: string;
} {
  return {
    subject: "Reset your password — SongForYou",
    html: baseLayout({
      preheader: "Reset your SongForYou password",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Reset your password</h2>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          We received a request to reset the password for your SongForYou account. Click the button below to set a new password.
        </p>
        ${ctaButton("Reset Password", resetUrl)}
        <p style="margin:0;color:${COLORS.textMuted};font-size:13px;line-height:1.5;">
          If you didn't request a password reset, you can safely ignore this email. The link expires in 1 hour.
        </p>
      `,
    }),
  };
}

// ─── Song Emails ─────────────────────────────────────────────

export function songDeliveryEmail(options: {
  occasion: string;
  recipientName?: string;
  genres?: string[];
  dashboardUrl: string;
}): { subject: string; html: string } {
  const occasionLabel =
    options.occasion.charAt(0).toUpperCase() + options.occasion.slice(1);
  const recipientStr = options.recipientName
    ? ` for ${options.recipientName}`
    : "";
  const genreStr = (options.genres || []).join(", ") || "Custom";

  return {
    subject: `Your custom ${occasionLabel.toLowerCase()} song is ready!`,
    html: baseLayout({
      preheader: `Your ${occasionLabel.toLowerCase()} song${recipientStr} is ready to play`,
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Your song is ready!</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Your custom <strong style="color:${COLORS.textPrimary};">${occasionLabel}</strong> song${recipientStr} has been generated and is ready to play.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;background-color:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:12px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Occasion</p>
              <p style="margin:0 0 12px;color:${COLORS.textPrimary};font-size:15px;font-weight:600;">${occasionLabel}</p>
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Style</p>
              <p style="margin:0;color:${COLORS.textPrimary};font-size:15px;font-weight:600;">${genreStr}</p>
            </td>
          </tr>
        </table>
        ${ctaButton("Play & Download Your Song", options.dashboardUrl)}
        <p style="margin:0;color:${COLORS.textMuted};font-size:13px;line-height:1.5;">
          Listen, download, and share your one-of-a-kind song from your dashboard.
        </p>
      `,
    }),
  };
}

export function ownerNotificationEmail(options: {
  songRequestId: string;
  userEmail: string;
  songUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `New song delivered to ${options.userEmail}`,
    html: baseLayout({
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Song Delivered</h2>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Song <code style="background:rgba(139,92,246,0.2);padding:2px 6px;border-radius:4px;color:${COLORS.purple};font-size:13px;">${options.songRequestId}</code> was delivered to <strong>${options.userEmail}</strong>.
        </p>
        ${ctaButton("Download MP3", options.songUrl)}
      `,
    }),
  };
}

export function ownerErrorEmail(options: {
  songRequestId: string;
  errorMessage: string;
}): { subject: string; html: string } {
  return {
    subject: `Song generation FAILED: ${options.songRequestId}`,
    html: baseLayout({
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.red};font-size:22px;font-weight:700;">Song Generation Failed</h2>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Song <code style="background:rgba(239,68,68,0.2);padding:2px 6px;border-radius:4px;color:${COLORS.red};font-size:13px;">${options.songRequestId}</code> failed to generate.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;background-color:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:12px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Error</p>
              <p style="margin:0;color:${COLORS.red};font-size:14px;font-family:monospace;word-break:break-all;">${options.errorMessage}</p>
            </td>
          </tr>
        </table>
      `,
    }),
  };
}

// ─── Billing Emails ──────────────────────────────────────────

export function trialStartedEmail(options: {
  trialEndDate: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  return {
    subject: "Welcome to SongForYou — your free trial has started!",
    html: baseLayout({
      preheader: "You have 7 days to create up to 10 custom songs, free",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Your free trial has started!</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Welcome to SongForYou! You now have <strong style="color:${COLORS.textPrimary};">7 days</strong> to create up to 10 custom AI-generated songs, completely free.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;background-color:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:12px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Trial ends</p>
              <p style="margin:0;color:${COLORS.green};font-size:15px;font-weight:600;">${options.trialEndDate}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          After your trial, your subscription continues at <strong style="color:${COLORS.textPrimary};">$9.99/week</strong>. You can cancel anytime from your account page.
        </p>
        ${ctaButton("Create Your First Song", options.dashboardUrl)}
      `,
    }),
  };
}

export function paymentReceiptEmail(options: {
  amount: string;
  date: string;
  invoiceUrl: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Payment received — ${options.amount}`,
    html: baseLayout({
      preheader: `We received your payment of ${options.amount}`,
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Payment received</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Thank you! Your payment has been processed successfully.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px;background-color:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:12px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Amount</p>
              <p style="margin:0 0 12px;color:${COLORS.textPrimary};font-size:20px;font-weight:700;">${options.amount}</p>
              <p style="margin:0 0 4px;color:${COLORS.textMuted};font-size:13px;">Date</p>
              <p style="margin:0;color:${COLORS.textPrimary};font-size:15px;">${options.date}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 8px;color:${COLORS.textMuted};font-size:13px;line-height:1.5;">
          <a href="${options.invoiceUrl}" style="color:${COLORS.purple};text-decoration:none;">View invoice</a>
        </p>
        ${ctaButton("Go to Dashboard", options.dashboardUrl)}
      `,
    }),
  };
}

export function paymentFailedEmail(options: {
  updatePaymentUrl: string;
}): { subject: string; html: string } {
  return {
    subject: "Payment failed — please update your card",
    html: baseLayout({
      preheader: "Your latest payment didn't go through. Update your card to keep your subscription active.",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.yellow};font-size:22px;font-weight:700;">Payment failed</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Your latest payment didn't go through. Please update your payment method to keep your SongForYou subscription active.
        </p>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          If your payment method isn't updated, your subscription may be cancelled and you'll lose access to song creation.
        </p>
        ${ctaButton("Update Payment Method", options.updatePaymentUrl)}
      `,
    }),
  };
}

export function subscriptionCancelledEmail(options: {
  resubscribeUrl: string;
}): { subject: string; html: string } {
  return {
    subject: "Your SongForYou subscription has been cancelled",
    html: baseLayout({
      preheader: "We're sorry to see you go. You can re-subscribe anytime.",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Subscription cancelled</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Your SongForYou subscription has been cancelled. You'll still have access to your existing songs on the dashboard.
        </p>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Changed your mind? You can re-subscribe anytime to start creating custom songs again.
        </p>
        ${ctaButton("Re-subscribe", options.resubscribeUrl)}
      `,
    }),
  };
}

export function trialEndingEmail(options: {
  trialEndDate: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  return {
    subject: "Your SongForYou free trial ends soon",
    html: baseLayout({
      preheader: "Your trial ends in 3 days — make the most of your remaining songs",
      content: `
        <h2 style="margin:0 0 16px;color:${COLORS.textPrimary};font-size:22px;font-weight:700;">Your trial ends soon</h2>
        <p style="margin:0 0 16px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Your SongForYou free trial ends on <strong style="color:${COLORS.textPrimary};">${options.trialEndDate}</strong>. After that, your subscription will automatically continue at <strong style="color:${COLORS.textPrimary};">$9.99/week</strong>.
        </p>
        <p style="margin:0 0 8px;color:${COLORS.textLight};font-size:15px;line-height:1.6;">
          Make the most of your remaining trial days — create songs for upcoming occasions!
        </p>
        ${ctaButton("Create a Song", options.dashboardUrl)}
        <p style="margin:0;color:${COLORS.textMuted};font-size:13px;line-height:1.5;">
          You can cancel anytime from your <a href="${SITE_URL}/account" style="color:${COLORS.purple};text-decoration:none;">account page</a>.
        </p>
      `,
    }),
  };
}
