import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Globe, 
  Users, 
  Plus, 
  MapPin, 
  Gift, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import type { HBDayEvent, PersonCircleMember, CelebrationCategory } from '../../../shared/types';
import { mockHBDays, mockCircleMembers } from '../mockData';

interface HBDaysViewProps {
  onPlanCelebration: (category: CelebrationCategory, name: string) => void;
  onOpenGiftsForPerson?: (person: PersonCircleMember) => void;
}

export const HBDaysView: React.FC<HBDaysViewProps> = ({
  onPlanCelebration,
  onOpenGiftsForPerson,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'mypeople'>('today');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [events, setEvents] = useState<HBDayEvent[]>(mockHBDays);
  const [myPeople, setMyPeople] = useState<PersonCircleMember[]>(mockCircleMembers);
  const [globalToasts, setGlobalToasts] = useState(14820);
  const [hasRaisedGlobalToast, setHasRaisedGlobalToast] = useState(false);

  // Modal for adding a new person to "My People"
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState<PersonCircleMember['relationship']>('Friend');
  const [newPersonDate, setNewPersonDate] = useState('');
  const [newPersonLocation, setNewPersonLocation] = useState('');
  const [newPersonInterests, setNewPersonInterests] = useState('');

  const handleToastEvent = (id: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        return {
          ...ev,
          toastCount: ev.isToasted ? ev.toastCount - 1 : ev.toastCount + 1,
          isToasted: !ev.isToasted
        };
      }
      return ev;
    }));
  };

  const handleGlobalToast = () => {
    if (!hasRaisedGlobalToast) {
      setGlobalToasts(prev => prev + 1);
      setHasRaisedGlobalToast(true);
    }
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName || !newPersonDate) return;

    const newPerson: PersonCircleMember = {
      id: `p-${Date.now()}`,
      fullName: newPersonName,
      relationship: newPersonRelation,
      birthDate: newPersonDate,
      location: newPersonLocation || 'Global',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      interests: newPersonInterests.split(',').map(s => s.trim()).filter(Boolean),
      giftPreferences: ['Curated Surprise Box', 'Handwritten Card'],
      daysUntilCelebration: 30
    };

    setMyPeople(prev => [newPerson, ...prev]);
    setShowAddPersonModal(false);
    setNewPersonName('');
    setNewPersonLocation('');
    setNewPersonInterests('');
  };

  const filteredEvents = filterType === 'ALL' 
    ? events 
    : events.filter(e => e.type === filterType);

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      padding: '32px 28px'
    }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Hero Section — Global Calendar of Joy Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4A1A70 0%, #290E40 60%, #150522 100%)',
          borderRadius: '26px',
          padding: '36px 32px',
          color: 'var(--cream)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '28px'
        }}>
          {/* Subtle decorative glow circles */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 185, 66, 0.15)',
            filter: 'blur(30px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '30%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 107, 107, 0.18)',
            filter: 'blur(40px)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(244, 185, 66, 0.2)',
              color: 'var(--gold)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              <CalendarIcon size={14} />
              TODAY · OCTOBER 7, 2026
            </div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: 900,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '12px'
            }}>
              Every Day, Something Is <span style={{ color: 'var(--gold)' }}>Worth Celebrating.</span>
            </h1>

            <p style={{
              fontSize: '16px',
              maxWidth: '640px',
              lineHeight: 1.5,
              opacity: 0.9,
              marginBottom: '24px'
            }}>
              HBD transforms mere dates into living celebrations. Track your loved ones in <i>My People</i>, toast global observances, cheer groundbreaking beginnings, and let HBD execute the joy.
            </p>

            {/* Interactive Global Toast CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleGlobalToast}
                style={{
                  backgroundColor: hasRaisedGlobalToast ? 'var(--gold)' : 'var(--coral)',
                  color: hasRaisedGlobalToast ? 'var(--char)' : '#fff',
                  fontWeight: 800,
                  fontSize: '14.5px',
                  padding: '12px 26px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(255, 107, 107, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                <span>🥂</span>
                {hasRaisedGlobalToast ? 'You Raised a Global Toast!' : 'Raise a Toast for Today'}
                <span style={{
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {globalToasts.toLocaleString()} toasts
                </span>
              </button>

              <button
                onClick={() => onPlanCelebration('BIRTHDAY', '')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--cream)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} color="var(--gold)" />
                What will you celebrate today?
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher: "Today's Joy" vs "My People (Relationship Circle)" */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px'
        }}>
          {/* Main Tab Pills */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--card)',
            padding: '5px',
            borderRadius: '16px',
            border: '1px solid var(--line)'
          }}>
            <button
              onClick={() => setActiveTab('today')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '12px',
                fontWeight: activeTab === 'today' ? 800 : 600,
                fontSize: '14px',
                backgroundColor: activeTab === 'today' ? 'var(--purple)' : 'transparent',
                color: activeTab === 'today' ? 'var(--cream)' : 'var(--muted)',
                transition: 'all 0.15s'
              }}
            >
              <Globe size={16} />
              Today’s Joy & Observances
            </button>

            <button
              onClick={() => setActiveTab('mypeople')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '12px',
                fontWeight: activeTab === 'mypeople' ? 800 : 600,
                fontSize: '14px',
                backgroundColor: activeTab === 'mypeople' ? 'var(--purple)' : 'transparent',
                color: activeTab === 'mypeople' ? 'var(--cream)' : 'var(--muted)',
                transition: 'all 0.15s'
              }}
            >
              <Users size={16} />
              My People ({myPeople.length})
            </button>
          </div>

          {/* Action button on right */}
          {activeTab === 'mypeople' ? (
            <button
              onClick={() => setShowAddPersonModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--coral)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.25)'
              }}
            >
              <Plus size={16} />
              Add to My People
            </button>
          ) : (
            /* Sub-filters for Today */
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'ALL', label: 'All Joy' },
                { id: 'PERSONAL', label: '🎂 Personal' },
                { id: 'GLOBAL', label: '🌍 Global' },
                { id: 'MILESTONE', label: '🏆 Milestones' },
                { id: 'BEGINNING', label: '🚀 Beginnings' },
                { id: 'COMMUNITY', label: '❤️ Community' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: filterType === f.id ? 700 : 500,
                    backgroundColor: filterType === f.id ? 'var(--purple-soft)' : 'var(--card)',
                    color: filterType === f.id ? 'var(--purple)' : 'var(--muted)',
                    border: '1px solid var(--line)'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: TODAY'S CELEBRATIONS */}
        {activeTab === 'today' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredEvents.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'var(--card)',
                  borderRadius: '20px',
                  border: '1px solid var(--line)',
                  padding: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.18s, box-shadow 0.18s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  {/* Event Icon / Thumbnail */}
                  {event.featuredImage ? (
                    <img 
                      src={event.featuredImage} 
                      alt={event.title}
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--purple-soft)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '28px',
                      flexShrink: 0
                    }}>
                      {event.icon}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                        backgroundColor: 
                          event.type === 'PERSONAL' ? 'var(--coral-soft)' :
                          event.type === 'GLOBAL' ? 'var(--purple-soft)' :
                          event.type === 'BEGINNING' ? 'rgba(244, 185, 66, 0.2)' : 'var(--bg)',
                        color: 
                          event.type === 'PERSONAL' ? 'var(--coral)' :
                          event.type === 'GLOBAL' ? 'var(--purple)' :
                          event.type === 'BEGINNING' ? 'var(--gold)' : 'var(--muted)'
                      }}>
                        {event.type}
                      </span>
                      <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                        {event.date} {event.location ? `· ${event.location}` : ''}
                      </small>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--fg)', marginBottom: '4px' }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: 0 }}>
                      {event.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right side interaction buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToastEvent(event.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      border: '1px solid var(--line)',
                      backgroundColor: event.isToasted ? 'var(--coral-soft)' : 'var(--bg)',
                      color: event.isToasted ? 'var(--coral)' : 'var(--fg)',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Heart size={14} fill={event.isToasted ? 'var(--coral)' : 'none'} color="var(--coral)" />
                    {event.toastCount}
                  </button>

                  <button
                    onClick={() => onPlanCelebration(
                      event.type === 'BEGINNING' ? 'BEGINNING' :
                      event.type === 'MILESTONE' ? 'MILESTONE' : 'BIRTHDAY',
                      event.title
                    )}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--purple)',
                      color: 'var(--cream)',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {event.actionCta || 'Celebrate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MY PEOPLE (PRIVATE RELATIONSHIP CIRCLE) */}
        {activeTab === 'mypeople' && (
          <div>
            <div style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>
                  Smart Celebration Concierge
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: 0 }}>
                  HBD watches your circle and alerts you 14 days and 7 days in advance with curated local gift options matching their tastes.
                </p>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--purple)',
                backgroundColor: 'var(--purple-soft)',
                padding: '6px 14px',
                borderRadius: '999px',
                whiteSpace: 'nowrap'
              }}>
                Concierge Active ⚡
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {myPeople.map(person => (
                <div
                  key={person.id}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderRadius: '24px',
                    border: '1px solid var(--line)',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Color Accent Stripe */}
                  {person.favoriteColor && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      backgroundColor: person.favoriteColor
                    }} />
                  )}

                  <div>
                    {/* Header: Avatar, Name, Relationship, Days remaining */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={person.avatarUrl} 
                          alt={person.fullName}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--card)'
                          }}
                        />
                        <div>
                          <b style={{ fontSize: '16px', display: 'block', color: 'var(--fg)' }}>
                            {person.fullName}
                          </b>
                          <small style={{ color: 'var(--muted)', fontSize: '12.5px' }}>
                            {person.relationship}
                          </small>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          backgroundColor: person.daysUntilCelebration <= 14 ? 'var(--coral-soft)' : 'var(--bg)',
                          color: person.daysUntilCelebration <= 14 ? 'var(--coral)' : 'var(--muted)',
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '5px 10px',
                          borderRadius: '999px',
                          display: 'inline-block'
                        }}>
                          In {person.daysUntilCelebration} days
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--muted)',
                      fontSize: '12.5px',
                      marginBottom: '12px'
                    }}>
                      <MapPin size={13} color="var(--purple)" />
                      <span>{person.location}</span>
                    </div>

                    {/* Interests tags */}
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                        What they love
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {person.interests.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: 'var(--bg)',
                              border: '1px solid var(--line)',
                              padding: '3px 9px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: 'var(--fg)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Gift preferences / Hints */}
                    {person.giftPreferences && person.giftPreferences.length > 0 && (
                      <div style={{
                        backgroundColor: 'var(--bg)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        marginBottom: '16px'
                      }}>
                        <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--purple)', display: 'block', marginBottom: '4px' }}>
                          💡 Gift Clues & Hints:
                        </small>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--fg)', lineHeight: 1.4 }}>
                          {person.giftPreferences.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions: "Find Gifts" and "Plan Surprise" */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {onOpenGiftsForPerson && (
                      <button
                        onClick={() => onOpenGiftsForPerson(person)}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--line)',
                          backgroundColor: 'var(--card)',
                          color: 'var(--purple)',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Gift size={14} />
                        Find Gifts
                      </button>
                    )}

                    <button
                      onClick={() => onPlanCelebration('BIRTHDAY', person.fullName)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--purple)',
                        color: 'var(--cream)',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sparkles size={14} />
                      Plan Celebration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Person Modal */}
      {showAddPersonModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '24px',
            border: '1px solid var(--line)',
            padding: '28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Add to My People
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginBottom: '18px' }}>
              Add family, friends, and colleagues to let HBD orchestrate timely celebrations and personalized gifts.
            </p>

            <form onSubmit={handleAddPerson} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Mama Sophie, Sister Amanda"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Relationship
                  </label>
                  <select
                    value={newPersonRelation}
                    onChange={(e) => setNewPersonRelation(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Partner">Partner</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Birthday / Date
                  </label>
                  <input 
                    type="date"
                    value={newPersonDate}
                    onChange={(e) => setNewPersonDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  City & Country (For local gifting)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Douala, Cameroon or London, UK"
                  value={newPersonLocation}
                  onChange={(e) => setNewPersonLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Interests & Likes (Comma separated)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Flowers, Dark Chocolate, Perfumes, Fiction"
                  value={newPersonInterests}
                  onChange={(e) => setNewPersonInterests(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPersonModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'transparent',
                    color: 'var(--muted)',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--purple)',
                    color: 'var(--cream)',
                    fontSize: '13.5px',
                    fontWeight: 800
                  }}
                >
                  Save to Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
