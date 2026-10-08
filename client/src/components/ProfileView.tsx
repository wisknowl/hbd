import React, { useState } from 'react';
import { useSession } from '../session';
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Gift, 
  Shield, 
  Sparkles, 
  Edit3, 
  LogOut, 
  Check, 
  Plus, 
  X, 
  Camera,
  Users
} from 'lucide-react';
import { Avatar } from './Avatar';
import { formatBirthday, daysUntilBirthday, countdownLabel } from '../lib/social';
import type { BirthdayVisibility } from '../../../shared/types';

interface ProfileViewProps {
  onOpenPlanner: () => void;
  onNavigateToFriends: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenPlanner, onNavigateToFriends }) => {
  const { profile, updateProfile, logOut, friendships } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.fullName || '');
  const [handle, setHandle] = useState(profile?.handle || '');
  const [bio, setBio] = useState(profile?.bio || 'Ready to celebrate and be celebrated ✨');
  const [city, setCity] = useState(profile?.city || 'London');
  const [country, setCountry] = useState(profile?.country || 'United Kingdom');
  const [birthDay, setBirthDay] = useState(profile?.birthDay || 24);
  const [birthMonth, setBirthMonth] = useState(profile?.birthMonth || 10);
  const [interests, setInterests] = useState<string[]>(profile?.preferences?.interests || ['Coffee', 'Books']);
  const [giftWishes, setGiftWishes] = useState<string[]>(profile?.preferences?.giftWishes || ['Specialty Coffee Beans', 'Kindle Book']);
  const [avoid, setAvoid] = useState<string[]>(profile?.preferences?.avoid || []);
  const [newInterest, setNewInterest] = useState('');
  const [newWish, setNewWish] = useState('');
  const [newAvoid, setNewAvoid] = useState('');
  const [visibility, setVisibility] = useState<BirthdayVisibility>(profile?.privacy?.birthdayVisibility || 'FRIENDS');
  const [showAge, setShowAge] = useState(profile?.privacy?.showAge || false);
  const [saveToast, setSaveToast] = useState(false);

  if (!profile) {
    return (
      <div style={{ flex: 1, height: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
        No profile active. Please reload or sign up.
      </div>
    );
  }

  const friendsCount = Object.values(friendships).filter(s => s === 'FRIENDS').length;
  const daysLeft = daysUntilBirthday(profile.birthDay, profile.birthMonth);

  const handleSave = () => {
    updateProfile({
      fullName: name,
      handle: handle.replace(/^@/, ''),
      bio,
      city,
      country,
      birthDay: Number(birthDay),
      birthMonth: Number(birthMonth),
      preferences: {
        ...profile.preferences,
        interests,
        giftWishes,
        avoid
      },
      privacy: {
        ...profile.privacy,
        birthdayVisibility: visibility,
        showAge
      }
    });

    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2600);
  };

  const toggleInterest = (item: string) => {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests(prev => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const addWish = () => {
    if (newWish.trim() && !giftWishes.includes(newWish.trim())) {
      setGiftWishes(prev => [...prev, newWish.trim()]);
      setNewWish('');
    }
  };

  const addAvoid = () => {
    if (newAvoid.trim() && !avoid.includes(newAvoid.trim())) {
      setAvoid(prev => [...prev, newAvoid.trim()]);
      setNewAvoid('');
    }
  };

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      padding: '36px 32px'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Toast notification */}
        {saveToast && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: 'var(--purple)',
            color: 'var(--cream)',
            padding: '12px 24px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={16} /> Profile changes saved!
          </div>
        )}

        {/* Profile Header Hero Card */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '28px',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-md)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative gradient ribbon */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, var(--purple), var(--gold), var(--coral))'
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={profile.fullName} src={profile.avatarUrl} size={88} verified={profile.isVerified} />
                <button
                  title="Update photo"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--purple)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    border: '2px solid var(--card)'
                  }}
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{profile.fullName}</h1>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--purple-soft)',
                    color: 'var(--purple)',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    CELEBRANT
                  </span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px' }}>
                  @{profile.handle}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: 'var(--muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--purple)" /> {profile.city}, {profile.country}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--gold)" /> {formatBirthday(profile.birthDay, profile.birthMonth)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Plan, Edit & Logout */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onOpenPlanner}
                className="hbd-btn hbd-btn-primary"
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                <Sparkles size={15} /> Plan Celebration
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`hbd-btn ${isEditing ? 'hbd-btn-primary' : 'hbd-btn-ghost'}`}
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                <Edit3 size={15} /> {isEditing ? 'Done' : 'Edit Profile'}
              </button>
              <button
                onClick={logOut}
                className="hbd-btn hbd-btn-ghost"
                title="Log out"
                style={{ padding: '9px 14px', color: 'var(--coral)', borderColor: 'var(--line)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Bio statement */}
          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
            {isEditing ? (
              <div>
                <label className="hbd-label">ABOUT YOU / BIO</label>
                <textarea
                  className="hbd-input"
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell friends what brings you joy..."
                  style={{ resize: 'none' }}
                />
              </div>
            ) : (
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--fg)', fontStyle: 'italic' }}>
                "{profile.bio || bio}"
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px'
        }}>
          <div 
            onClick={onNavigateToFriends}
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: '20px',
              border: '1px solid var(--line)',
              padding: '18px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>MY CIRCLE</span>
              <Users size={16} color="var(--purple)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--purple)' }}>{friendsCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Friends connected</div>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            padding: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>NEXT BIRTHDAY</span>
              <Calendar size={16} color="var(--gold)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)' }}>
              {daysLeft === 0 ? 'Today 🎉' : `${daysLeft}d`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{countdownLabel(daysLeft)}</div>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            padding: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>WISH LIST</span>
              <Gift size={16} color="var(--coral)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--coral)' }}>{giftWishes.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Gift ideas saved</div>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            padding: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>CHEERS GIVEN</span>
              <Sparkles size={16} color="var(--purple)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--fg)' }}>14</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Moments supported</div>
          </div>
        </div>

        {/* Edit Form Fields (When Editing) */}
        {isEditing && (
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '24px',
            border: '1px solid var(--line)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Account Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="hbd-label">FULL NAME</label>
                <input
                  type="text"
                  className="hbd-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="hbd-label">HANDLE</label>
                <input
                  type="text"
                  className="hbd-input"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                />
              </div>
              <div>
                <label className="hbd-label">CITY</label>
                <input
                  type="text"
                  className="hbd-input"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="hbd-label">COUNTRY</label>
                <input
                  type="text"
                  className="hbd-input"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                />
              </div>
              <div>
                <label className="hbd-label">BIRTH MONTH (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="hbd-input"
                  value={birthMonth}
                  onChange={e => setBirthMonth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="hbd-label">BIRTH DAY (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="hbd-input"
                  value={birthDay}
                  onChange={e => setBirthDay(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                onClick={handleSave}
                className="hbd-btn hbd-btn-primary"
                style={{ padding: '10px 24px' }}
              >
                Save Details
              </button>
            </div>
          </div>
        )}

        {/* Celebration Preferences: Things You Love */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} color="var(--purple)" fill="var(--purple)" /> Celebration Wishes & Interests
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                Your friends consult these to know what you appreciate most.
              </p>
            </div>
          </div>

          {/* Preset / Current chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {interests.map(item => (
              <span
                key={item}
                className="hbd-chip is-on"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {item}
                <button
                  onClick={() => toggleInterest(item)}
                  style={{ color: 'rgba(255,255,255,0.7)', padding: '0 2px' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Quick add custom */}
          <div style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
            <input
              type="text"
              className="hbd-input"
              placeholder="Add another passion (e.g. Vinyl Records)..."
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addInterest()}
            />
            <button
              onClick={addInterest}
              className="hbd-btn hbd-btn-ghost"
              style={{ padding: '0 16px' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Specific Gift Registry / Wishlist */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift size={18} color="var(--coral)" /> Specific Gift Wishes
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Particular items or vouchers you have your eye on.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {giftWishes.map((wish, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  fontSize: '14px'
                }}
              >
                <span>🎁 {wish}</span>
                <button
                  onClick={() => setGiftWishes(prev => prev.filter((_, i) => i !== idx))}
                  style={{ color: 'var(--muted)', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
            <input
              type="text"
              className="hbd-input"
              placeholder="Add specific gift wish (e.g. Afternoon Tea)..."
              value={newWish}
              onChange={e => setNewWish(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWish()}
            />
            <button
              onClick={addWish}
              className="hbd-btn hbd-btn-ghost"
              style={{ padding: '0 16px' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Things to Avoid */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--coral)' }}>
              <X size={18} /> Things to Avoid (Allergies & Dislikes)
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Ensures you never receive gifts that cause discomfort or allergic reactions.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {avoid.length === 0 ? (
              <span style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                No restrictions listed.
              </span>
            ) : (
              avoid.map((item, idx) => (
                <span
                  key={idx}
                  className="hbd-chip is-avoid is-on"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ✕ {item}
                  <button
                    onClick={() => setAvoid(prev => prev.filter((_, i) => i !== idx))}
                    style={{ color: 'rgba(255,255,255,0.8)', padding: '0 2px' }}
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
            <input
              type="text"
              className="hbd-input"
              placeholder="Add allergy or dislike..."
              value={newAvoid}
              onChange={e => setNewAvoid(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAvoid()}
            />
            <button
              onClick={addAvoid}
              className="hbd-btn hbd-btn-ghost"
              style={{ padding: '0 16px' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Privacy Controls */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--purple)" /> Birthday Privacy Controls
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              You control who gets to celebrate your day.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="hbd-label">WHO CAN SEE YOUR BIRTHDAY</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'EVERYONE', label: 'Everyone (Global) 🌍' },
                  { id: 'FRIENDS', label: 'Friends in Circle 👥' },
                  { id: 'ONLY_ME', label: 'Only Me (Private) 🔒' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setVisibility(opt.id as BirthdayVisibility);
                      updateProfile({ privacy: { ...profile.privacy, birthdayVisibility: opt.id as BirthdayVisibility } });
                    }}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 700,
                      backgroundColor: visibility === opt.id ? 'var(--purple)' : 'var(--bg)',
                      color: visibility === opt.id ? 'var(--cream)' : 'var(--fg)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'var(--bg)',
              borderRadius: '14px',
              marginTop: '6px'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Display Turning Age</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Shows how old you are turning on your birthday cards</div>
              </div>
              <input
                type="checkbox"
                checked={showAge}
                onChange={e => {
                  setShowAge(e.target.checked);
                  updateProfile({ privacy: { ...profile.privacy, showAge: e.target.checked } });
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '32px' }}>
          <button
            onClick={handleSave}
            className="hbd-btn hbd-btn-primary"
            style={{ padding: '14px 32px', fontSize: '15px' }}
          >
            <Check size={18} /> Save All Profile Changes
          </button>
        </div>

      </div>
    </div>
  );
};
