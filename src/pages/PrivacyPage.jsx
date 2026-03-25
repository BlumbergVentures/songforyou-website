import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors, sectionStyle } from '../styles/shared';

export default function PrivacyPage() {
  const h2 = { fontSize: '22px', fontWeight: 700, color: colors.textPrimary, marginTop: '36px', marginBottom: '12px' };
  const p = { color: colors.textSecondary, fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      <Header />
      <div style={{ ...sectionStyle, paddingTop: '120px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ ...p, color: colors.textMuted, marginBottom: '36px' }}>Last updated: March 24, 2026</p>

        <h2 style={h2}>1. Introduction</h2>
        <p style={p}>
          SongForYou, operated by Blumberg Ventures ("we", "us", "our"), is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your information when you use our Service at
          songforyou.app.
        </p>

        <h2 style={h2}>2. Information We Collect</h2>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Account Information:</strong> Email address and password (hashed)
          when you create an account.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Song Request Data:</strong> Occasion, recipient name, your
          story, genre/mood preferences, and artist style selections you provide when creating a song.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Payment Information:</strong> Payment details are processed
          directly by Stripe. We do not store credit card numbers. We receive your Stripe customer ID and subscription
          status.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Usage Data:</strong> Song creation counts, subscription status,
          and basic usage analytics.
        </p>

        <h2 style={h2}>3. How We Use Your Information</h2>
        <p style={p}>
          We use your information to: provide and deliver the Service (generate and deliver custom songs); process
          payments and manage subscriptions; send song delivery emails and account notifications; improve the Service and
          user experience; and comply with legal obligations.
        </p>

        <h2 style={h2}>4. Third-Party Services</h2>
        <p style={p}>
          We share data with the following services, each governed by their own privacy policies:
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Supabase:</strong> Authentication and database hosting.
          Your account data and song requests are stored securely on Supabase infrastructure.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Stripe:</strong> Payment processing. Stripe receives your
          payment details directly and is PCI DSS compliant.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Suno AI:</strong> Song generation. Your song request details
          (story, preferences) are sent to generate your custom song. Personal identifying information (your email,
          name) is not shared with Suno.
        </p>
        <p style={p}>
          <strong style={{ color: colors.textPrimary }}>Resend:</strong> Email delivery for order confirmations and song
          delivery notifications.
        </p>

        <h2 style={h2}>5. Data Retention</h2>
        <p style={p}>
          We retain your account data and song history for as long as your account is active. If you delete your
          account, we will remove your personal data within 30 days, except where retention is required by law. Generated
          songs and associated metadata may be retained in anonymized form.
        </p>

        <h2 style={h2}>6. Data Security</h2>
        <p style={p}>
          We use industry-standard security measures including encrypted connections (HTTPS/TLS), hashed passwords,
          row-level security on database tables, and secure API authentication. However, no method of electronic
          transmission or storage is 100% secure.
        </p>

        <h2 style={h2}>7. Your Rights</h2>
        <p style={p}>
          You have the right to: access and download your personal data; correct inaccurate information; request
          deletion of your account and data; cancel your subscription at any time; and opt out of non-essential
          communications.
        </p>

        <h2 style={h2}>8. Cookies & Analytics</h2>
        <p style={p}>
          We use essential cookies for authentication and session management. We use privacy-friendly analytics that do
          not track individual users or use cookies for advertising purposes.
        </p>

        <h2 style={h2}>9. Children's Privacy</h2>
        <p style={p}>
          The Service is not intended for children under 13. We do not knowingly collect personal information from
          children under 13. If we become aware of such collection, we will promptly delete the information.
        </p>

        <h2 style={h2}>10. Changes to This Policy</h2>
        <p style={p}>
          We may update this Privacy Policy from time to time. We will notify you of material changes via email or
          in-app notification. Continued use after changes constitutes acceptance.
        </p>

        <h2 style={h2}>11. Contact</h2>
        <p style={p}>
          For privacy-related questions or data requests, contact us at support@songforyou.app.
        </p>
      </div>
      <Footer />
    </div>
  );
}
