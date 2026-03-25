import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors, sectionStyle } from '../styles/shared';

export default function TermsPage() {
  const h2 = { fontSize: '22px', fontWeight: 700, color: colors.textPrimary, marginTop: '36px', marginBottom: '12px' };
  const p = { color: colors.textSecondary, fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      <Header />
      <div style={{ ...sectionStyle, paddingTop: '120px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: colors.textPrimary, marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ ...p, color: colors.textMuted, marginBottom: '36px' }}>Last updated: March 24, 2026</p>

        <h2 style={h2}>1. Agreement to Terms</h2>
        <p style={p}>
          By accessing or using SongForYou ("Service"), operated by Blumberg Ventures, you agree to be bound by these
          Terms of Service. If you do not agree, do not use the Service.
        </p>

        <h2 style={h2}>2. Description of Service</h2>
        <p style={p}>
          SongForYou is an AI-powered music generation platform that creates custom songs based on user-provided stories
          and preferences. Songs are generated using artificial intelligence technology and delivered as downloadable MP3
          files.
        </p>

        <h2 style={h2}>3. Account Registration</h2>
        <p style={p}>
          You must create an account to use the Service. You are responsible for maintaining the confidentiality of your
          account credentials and for all activities under your account. You must provide accurate and complete
          information during registration.
        </p>

        <h2 style={h2}>4. Subscription & Billing</h2>
        <p style={p}>
          The Service operates on a weekly subscription model at the current rate displayed on our pricing page. New
          subscribers receive a 7-day free trial. After the trial period, your payment method will be charged
          automatically each week until you cancel. You may cancel at any time through your account settings. Usage is
          limited to 10 songs per calendar month.
        </p>

        <h2 style={h2}>5. AI-Generated Content</h2>
        <p style={p}>
          All songs are generated using AI technology. While we strive for high quality, results may vary. AI-generated
          songs are produced algorithmically and may not perfectly match your expectations. Songs are inspired by musical
          styles and do not contain actual performances by any named artist. Artist template names are used solely to
          describe a musical style.
        </p>

        <h2 style={h2}>6. Intellectual Property</h2>
        <p style={p}>
          Upon delivery and full payment, you receive a personal, non-exclusive license to use your generated songs for
          personal, non-commercial purposes including gifts, events, and social media sharing. You may not resell,
          sublicense, or claim authorship of generated songs. SongForYou and Blumberg Ventures retain all rights to the
          Service, platform, and underlying technology.
        </p>

        <h2 style={h2}>7. Acceptable Use</h2>
        <p style={p}>
          You agree not to: submit content that is illegal, hateful, or violates third-party rights; attempt to
          reverse-engineer the Service; use the Service for commercial music production or resale; abuse the song
          generation system to circumvent usage limits; or impersonate others.
        </p>

        <h2 style={h2}>8. Disclaimers</h2>
        <p style={p}>
          The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that
          songs will meet your specific expectations, that the Service will be uninterrupted or error-free, or that
          generated content will be free of all similarity to existing works.
        </p>

        <h2 style={h2}>9. Limitation of Liability</h2>
        <p style={p}>
          To the maximum extent permitted by law, SongForYou and Blumberg Ventures shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from your use of the Service. Our total
          liability shall not exceed the amount you paid in the 30 days preceding the claim.
        </p>

        <h2 style={h2}>10. Termination</h2>
        <p style={p}>
          We may suspend or terminate your account if you violate these Terms. You may cancel your subscription and
          close your account at any time. Upon termination, your access to the Service will cease, but previously
          delivered songs remain accessible.
        </p>

        <h2 style={h2}>11. Changes to Terms</h2>
        <p style={p}>
          We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance
          of the updated Terms. Material changes will be communicated via email or in-app notification.
        </p>

        <h2 style={h2}>12. Contact</h2>
        <p style={p}>
          For questions about these Terms, contact us at support@songforyou.app.
        </p>
      </div>
      <Footer />
    </div>
  );
}
