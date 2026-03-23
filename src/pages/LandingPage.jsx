import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SongForm from '../components/SongForm';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      // Small delay to ensure DOM is ready after navigation
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // Clean up the query param
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSignIn = () => { setAuthMode('signin'); setAuthModalOpen(true); };
  const handleSignUp = () => { setAuthMode('signup'); setAuthModalOpen(true); };
  const handleGetStarted = () => {
    if (user) {
      document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleSignUp();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed', top: '10%', left: '20%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)',
      }} />

      <Header onSignIn={handleSignIn} onSignUp={handleSignUp} />
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <SongForm onAuthRequired={handleSignUp} />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA onGetStarted={handleGetStarted} />
      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  );
}
