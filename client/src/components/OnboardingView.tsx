import React, { useState } from 'react';
import { useSession } from '../session';
import { Sparkles, Calendar, Heart, Gift, ArrowRight, User, Plus, X, ShieldCheck, LogIn, KeyRound } from 'lucide-react';
import { mockPeople } from '../data/people';
import { Avatar } from './Avatar';

interface OnboardingProps {
  onComplete: () => void;
}

const PRESET_INTERESTS = ['Books', 'Perfume', 'Jewelry', 'Tech', 'Gaming', 'Coffee', 'Skincare', 'Music', 'Plants', 'Fashion'];
const PRESET_AVOIDS = ['Alcohol', 'Nuts', 'Gluten', 'Strong perfume', 'Lilies (allergic)'];

export const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { login, logIn } = useSession();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState(1);
  
  // Sign Up form state
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('United Kingdom');
  const [birthDate, setBirthDate] = useState('24');
  const [birthMonth, setBirthMonth] = useState('10');
  const [interests, setInterests] = useState<string[]>(['Coffee', 'Books', 'Perfume']);
  const [dislikes, setDislikes] = useState<string[]>(['Lilies (allergic)']);
  
  const [customInterest, setCustomInterest] = useState('');
  const [customDislike, setCustomDislike] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');

  const toggleInterest = (item: string) => {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const toggleDislike = (item: string) => {
    setDislikes(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addCustomDislike = () => {
    if (customDislike.trim() && !dislikes.includes(customDislike.trim())) {
      setDislikes(prev => [...prev, customDislike.trim()]);
      setCustomDislike('');
    }
  };

  const handleSignUpComplete = () => {
    const id = 'u-' + (handle || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    login({
      id,
      fullName: name || 'Celebration Lover',
      handle: (handle || 'celebrant').replace(/^@/, ''),
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      city: city || 'London',
      country: country || 'United Kingdom',
      birthDay: parseInt(birthDate) || 24,
      birthMonth: parseInt(birthMonth) || 10,
      birthYear: 1996,
      bio: 'Ready to celebrate and be celebrated on HBD ✨',
      preferences: {
        interests: interests.length > 0 ? interests : ['Coffee', 'Books'],
        giftWishes: [],
        avoid: dislikes,
        favoriteColor: '#5B2A86',
      },
      privacy: {
        birthdayVisibility: 'FRIENDS',
        showAge: false,
        preferencesVisibleToFriends: true,
      },
    });
    
    onComplete();
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your handle, name, or email.');
      return;
    }
    const success = logIn(loginIdentifier.trim());
    if (success) {
      onComplete();
    } else {
      setLoginError('Account not found. Select a demo profile or sign up below.');
    }
  };

  const handleQuickLogin = (demoHandle: string) => {
    const success = logIn(demoHandle);
    if (success) onComplete();
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Ambient background glow orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91, 42, 134, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '20%',
        width: '440px',
        height: '440px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Centered Glass Card */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--card)',
        borderRadius: '28px',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-lg)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10,
        margin: 'auto 0'
      }}>

        {/* Top Mode Switcher Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setMode('signup'); setStep(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: mode === 'signup' ? 'var(--purple)' : 'transparent',
                color: mode === 'signup' ? 'var(--cream)' : 'var(--muted)',
                transition: 'all 0.15s ease'
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('login'); setLoginError(''); }}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: mode === 'login' ? 'var(--purple)' : 'transparent',
                color: mode === 'login' ? 'var(--cream)' : 'var(--muted)',
                transition: 'all 0.15s ease'
              }}
            >
              Log In
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {mode === 'signup' ? (
              <span>Already have an account? <strong onClick={() => setMode('login')} style={{ color: 'var(--purple)', cursor: 'pointer' }}>Log In</strong></span>
            ) : (
              <span>New here? <strong onClick={() => setMode('signup')} style={{ color: 'var(--purple)', cursor: 'pointer' }}>Create Account</strong></span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* LOG IN VIEW */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <div className="hbd-fade-up">
            <div style={{ textAlign: 'center', marginBottom: '26px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, var(--purple), var(--coral))',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 20px rgba(91, 42, 134, 0.25)'
              }}>
                <KeyRound size={28} color="#fff" />
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
                Welcome Back to HBD
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                Enter your handle, full name, or pick a demo profile to continue.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label className="hbd-label">HANDLE, EMAIL, OR NAME</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="hbd-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="e.g. sarah.j or Sarah Johnson"
                    value={loginIdentifier}
                    onChange={e => { setLoginIdentifier(e.target.value); setLoginError(''); }}
                  />
                </div>
                {loginError && (
                  <p style={{ color: 'var(--coral)', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
                    {loginError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="hbd-btn hbd-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                Log In <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '18px',
              border: '1px solid var(--line)',
              padding: '18px',
              marginTop: '10px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>
                ⚡ Quick Demo One-Click Sign In
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mockPeople.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleQuickLogin(p.handle)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar name={p.fullName} src={p.avatarUrl} size={32} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.fullName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>@{p.handle} · {p.city}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--purple)', fontWeight: 700 }}>Log In →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SIGN UP VIEW */}
        {/* ======================================================== */}
        {mode === 'signup' && (
          <div>
            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: '5px',
                    flex: 1,
                    borderRadius: '999px',
                    backgroundColor: i <= step ? 'var(--purple)' : 'var(--line)',
                    transition: 'background-color 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* STEP 1: Basic Profile */}
            {step === 1 && (
              <div className="hbd-fade-up">
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, var(--purple), var(--coral))',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 8px 20px rgba(91, 42, 134, 0.25)'
                  }}>
                    <Sparkles size={28} color="#fff" />
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
                    Welcome to HBD
                  </h1>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    Create your celebration passport to connect with friends & loved ones.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                  <div>
                    <label className="hbd-label">YOUR FULL NAME</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        className="hbd-input"
                        style={{ paddingLeft: '42px' }}
                        placeholder="e.g. Sarah Johnson"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="hbd-label">CHOOSE YOUR HANDLE</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--purple)' }}>@</span>
                      <input
                        type="text"
                        className="hbd-input"
                        style={{ paddingLeft: '38px' }}
                        placeholder="sarah.j"
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="hbd-label">CITY</label>
                      <input
                        type="text"
                        className="hbd-input"
                        placeholder="London"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="hbd-label">COUNTRY</label>
                      <input
                        type="text"
                        className="hbd-input"
                        placeholder="UK"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!name.trim() || !handle.trim()}
                  className="hbd-btn hbd-btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  Continue to Birthday <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Birthday */}
            {step === 2 && (
              <div className="hbd-fade-up">
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '18px',
                    background: 'var(--purple-soft)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px auto',
                    border: '1px solid rgba(91, 42, 134, 0.2)'
                  }}>
                    <Calendar size={28} color="var(--purple)" />
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
                    When do we celebrate you?
                  </h1>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    Your special day is the heart of HBD. We'll make sure you're loved.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ flex: 2 }}>
                    <label className="hbd-label">BIRTH MONTH</label>
                    <select
                      className="hbd-input"
                      style={{ cursor: 'pointer' }}
                      value={birthMonth}
                      onChange={e => setBirthMonth(e.target.value)}
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="hbd-label">DAY</label>
                    <input
                      type="number"
                      className="hbd-input"
                      min="1"
                      max="31"
                      placeholder="24"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--purple-soft)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '28px',
                  border: '1px solid rgba(91, 42, 134, 0.15)'
                }}>
                  <ShieldCheck size={20} color="var(--purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--fg)' }}>
                    <strong>Privacy Guaranteed:</strong> Your exact year is optional and your delivery address is never exposed publicly. Friends only receive gift-routing options.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep(1)}
                    className="hbd-btn hbd-btn-ghost"
                    style={{ padding: '14px 24px' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!birthMonth || !birthDate}
                    className="hbd-btn hbd-btn-primary"
                    style={{ flex: 1, padding: '14px' }}
                  >
                    Preferences <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Celebration Wishes & Avoids */}
            {step === 3 && (
              <div className="hbd-fade-up">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 8px 20px rgba(244, 185, 66, 0.3)'
                  }}>
                    <Gift size={28} color="#fff" />
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
                    How do you like to be celebrated?
                  </h1>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    Helps your friends and the HBD Gift Engine pick what makes you smile.
                  </p>
                </div>

                {/* Things you love */}
                <div style={{ marginBottom: '22px' }}>
                  <label className="hbd-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--purple)' }}>
                    <Heart size={14} fill="var(--purple)" /> THINGS YOU LOVE
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {PRESET_INTERESTS.map(item => {
                      const active = interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          className={`hbd-chip ${active ? 'is-on' : ''}`}
                        >
                          {active ? '✓ ' : '+ '}{item}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="hbd-input"
                      placeholder="Add custom interest (e.g. Scented Candles)..."
                      value={customInterest}
                      onChange={e => setCustomInterest(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomInterest()}
                    />
                    <button
                      type="button"
                      onClick={addCustomInterest}
                      className="hbd-btn hbd-btn-ghost"
                      style={{ padding: '0 16px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Things to avoid */}
                <div style={{ marginBottom: '28px' }}>
                  <label className="hbd-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--coral)' }}>
                    <X size={14} /> THINGS TO AVOID (ALLERGIES / DISLIKES)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {PRESET_AVOIDS.map(item => {
                      const active = dislikes.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleDislike(item)}
                          className={`hbd-chip is-avoid ${active ? 'is-on' : ''}`}
                        >
                          {active ? '✕ ' : '+ '}{item}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="hbd-input"
                      placeholder="Add allergy or dislike..."
                      value={customDislike}
                      onChange={e => setCustomDislike(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomDislike()}
                    />
                    <button
                      type="button"
                      onClick={addCustomDislike}
                      className="hbd-btn hbd-btn-ghost"
                      style={{ padding: '0 16px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep(2)}
                    className="hbd-btn hbd-btn-ghost"
                    style={{ padding: '14px 24px' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSignUpComplete}
                    className="hbd-btn hbd-btn-primary"
                    style={{ flex: 1, padding: '14px', fontSize: '15px' }}
                  >
                    Complete Profile 🎉
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
