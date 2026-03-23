import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UsageMeter from '../components/UsageMeter';

const MONTHLY_LIMIT = 10;

function StatusBadge({ status }) {
  const configs = {
    trialing: {
      bg: 'rgba(139,92,246,0.15)',
      border: 'rgba(139,92,246,0.3)',
      color: '#8b5cf6',
      label: 'Trialing',
    },
    active: {
      bg: 'rgba(34,197,94,0.15)',
      border: 'rgba(34,197,94,0.3)',
      color: '#22c55e',
      label: 'Active',
    },
    past_due: {
      bg: 'rgba(239,68,68,0.15)',
      border: 'rgba(239,68,68,0.3)',
      color: '#ef4444',
      label: 'Past Due',
    },
  };

  const cfg = configs[status] || {
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.5)',
    label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Inactive',
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 14px',
      borderRadius: '20px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontSize: '13px',
      fontWeight: '600',
    }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      padding: '20px 24px',
      textAlign: 'center',
      flex: '1 1 140px',
      minWidth: '140px',
    }}>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: color || '#fff',
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, session, customer } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching songs:', error);
      } else {
        setSongs(data || []);
      }
      setLoading(false);
    }

    fetchSongs();
  }, []);

  const subscriptionStatus = customer?.subscription_status || 'none';
  const songsThisMonth = songs.filter((s) => s.billing_month === currentMonth);
  const totalSongs = songs.length;
  const deliveredSongs = songs.filter((s) => s.status === 'delivered').length;
  const pendingSongs = songs.filter((s) => s.status === 'pending' || s.status === 'generating').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const memberSince = user?.created_at ? formatDate(user.created_at) : '';

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-portal-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('No portal URL returned');
      }
    } catch (err) {
      console.error('Error fetching portal URL:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onSignIn={() => {}} onSignUp={() => {}} />

      <main style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '32px',
        }}>
          Account
        </h1>

        {/* Account Info */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
            Account Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Email</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{user?.email}</span>
            </div>
            {memberSince && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Member since</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{memberSince}</span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Details */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Subscription
            </h2>
            <StatusBadge status={subscriptionStatus} />
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: '0 0 6px 0', fontWeight: '600' }}>
            SongForYou — Unlimited Creativity
          </p>

          {subscriptionStatus === 'trialing' && customer?.trial_end && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '8px 0 0 0' }}>
              Your free trial ends on {formatDate(customer.trial_end)}. After that, $9.99/week.
            </p>
          )}

          {subscriptionStatus === 'active' && customer?.current_period_end && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '8px 0 0 0' }}>
              Next billing date: {formatDate(customer.current_period_end)}. $9.99/week.
            </p>
          )}

          {subscriptionStatus === 'past_due' && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '8px 0 0 0' }}>
              Your payment is past due. Please update your payment method to continue using SongForYou.
            </p>
          )}

          {(subscriptionStatus === 'cancelled' || subscriptionStatus === 'none') && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '8px 0 0 0' }}>
              Your subscription has ended. Resubscribe to continue creating songs.
            </p>
          )}

          <button
            onClick={handleManageSubscription}
            disabled={portalLoading}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              background: portalLoading
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: portalLoading ? 'not-allowed' : 'pointer',
              opacity: portalLoading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {portalLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>

        {/* Usage This Month */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '24px',
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '18px' }}>
            Usage This Month
          </h2>
          {loading ? (
            <div style={{
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
            }} />
          ) : (
            <UsageMeter used={songsThisMonth.length} limit={MONTHLY_LIMIT} />
          )}
        </div>

        {/* Song Statistics */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
            Song Statistics
          </h2>
          {loading ? (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  flex: '1 1 140px',
                  minWidth: '140px',
                  height: '80px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)',
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <StatCard label="Total Songs" value={totalSongs} color="#8b5cf6" />
              <StatCard label="This Month" value={songsThisMonth.length} color="#ec4899" />
              <StatCard label="Delivered" value={deliveredSongs} color="#22c55e" />
              <StatCard label="Pending" value={pendingSongs} color="#fbbf24" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
