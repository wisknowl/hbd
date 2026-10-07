import React, { useState } from 'react';
import { useSession } from '../session';
import { Search, UserPlus, Clock, Gift, Users, Check, Sparkles } from 'lucide-react';
import { mockPeople } from '../data/people';
import { Avatar } from './Avatar';

export const FriendsView: React.FC = () => {
  const { profile, acceptRequest, declineFriendRequest, sendRequest, statusOf } = useSession();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<typeof mockPeople[0] | null>(null);

  // Mock list of all community people
  const allPeople = mockPeople;
  
  // Filter for mutual friends
  const friends = allPeople.filter(p => statusOf(p.id) === 'FRIENDS');
  
  // Filter for incoming friend requests
  const requests = allPeople.filter(p => statusOf(p.id) === 'REQUEST_RECEIVED');
  
  // Filter for discoverable people (not already mutual friends, not current user)
  const discoverablePeople = allPeople.filter(
    p => 
      p.id !== profile?.id && 
      statusOf(p.id) !== 'FRIENDS' && 
      statusOf(p.id) !== 'REQUEST_RECEIVED' &&
      (p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      padding: '36px 32px'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'var(--purple-soft)',
              color: 'var(--purple)',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}>
              <Users size={14} /> My People & Circle
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, var(--purple), var(--coral))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}>
              Connections & Friends
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
              Your private celebration circle. Know when birthdays are near and see their gift wishes.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--card)',
            padding: '10px 18px',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>CIRCLE SIZE</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--purple)' }}>{friends.length} Friends</div>
            </div>
            {requests.length > 0 && (
              <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>REQUESTS</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--coral)' }}>{requests.length} Pending</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '16px',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => setActiveTab('friends')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'friends' ? 'var(--purple)' : 'var(--card)',
              color: activeTab === 'friends' ? 'var(--cream)' : 'var(--fg)',
              border: activeTab === 'friends' ? 'none' : '1px solid var(--line)',
              boxShadow: activeTab === 'friends' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            My Friends ({friends.length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'requests' ? 'var(--purple)' : 'var(--card)',
              color: activeTab === 'requests' ? 'var(--cream)' : 'var(--fg)',
              border: activeTab === 'requests' ? 'none' : '1px solid var(--line)',
              boxShadow: activeTab === 'requests' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Requests
            {requests.length > 0 && (
              <span style={{
                backgroundColor: 'var(--coral)',
                color: '#fff',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 800
              }}>
                {requests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('find')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'find' ? 'var(--purple)' : 'var(--card)',
              color: activeTab === 'find' ? 'var(--cream)' : 'var(--fg)',
              border: activeTab === 'find' ? 'none' : '1px solid var(--line)',
              boxShadow: activeTab === 'find' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Find People
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* TAB 1: FRIENDS */}
          {activeTab === 'friends' && (
            <div>
              {friends.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: 'var(--card)',
                  borderRadius: '24px',
                  border: '1px solid var(--line)'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--purple-soft)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <UserPlus size={28} color="var(--purple)" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No friends added yet</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '360px', margin: '0 auto 20px auto' }}>
                    Connect with friends to automatically keep track of their upcoming birthdays and preferred gifts.
                  </p>
                  <button
                    onClick={() => setActiveTab('find')}
                    className="hbd-btn hbd-btn-primary"
                  >
                    Find People to Add
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {friends.map(friend => (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedPerson(friend)}
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                    >
                      <Avatar name={friend.fullName} src={friend.avatarUrl} size={50} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {friend.fullName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          @{friend.handle} · {friend.city}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--purple)',
                          fontWeight: 700,
                          marginTop: '4px'
                        }}>
                          🎂 Birthday: {friend.birthMonth}/{friend.birthDay}
                        </div>
                      </div>
                      <button
                        title="View Gift Preferences"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--purple-soft)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--purple)',
                          border: 'none',
                          flexShrink: 0
                        }}
                      >
                        <Gift size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              {requests.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: 'var(--card)',
                  borderRadius: '24px',
                  border: '1px solid var(--line)'
                }}>
                  <Clock size={36} color="var(--muted)" style={{ margin: '0 auto 14px auto', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>No Pending Requests</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    When someone invites you into their circle, you'll see them right here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {requests.map(req => (
                    <div
                      key={req.id}
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Avatar name={req.fullName} src={req.avatarUrl} size={52} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '16px' }}>{req.fullName}</div>
                          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                            @{req.handle} · {req.city}, {req.country}
                          </div>
                          {req.bio && (
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', fontStyle: 'italic' }}>
                              "{req.bio}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => acceptRequest(req.id)}
                          className="hbd-btn hbd-btn-primary"
                          style={{ padding: '8px 18px', fontSize: '13px' }}
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => declineFriendRequest(req.id)}
                          className="hbd-btn hbd-btn-ghost"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FIND PEOPLE */}
          {activeTab === 'find' && (
            <div>
              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '22px' }}>
                <Search size={18} color="var(--muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="hbd-input"
                  style={{ paddingLeft: '46px', fontSize: '15px' }}
                  placeholder="Search by name, handle, or city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* People Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {discoverablePeople.map(person => {
                  const status = statusOf(person.id);
                  const isSent = status === 'REQUEST_SENT';

                  return (
                    <div
                      key={person.id}
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Avatar name={person.fullName} src={person.avatarUrl} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {person.fullName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            @{person.handle} · {person.city}
                          </div>
                        </div>
                      </div>

                      {/* Bio / Interests */}
                      {person.preferences?.interests && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {person.preferences.interests.slice(0, 3).map(interest => (
                            <span
                              key={interest}
                              style={{
                                fontSize: '11px',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--bg)',
                                color: 'var(--muted)',
                                border: '1px solid var(--line)'
                              }}
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                        {isSent ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--muted)',
                            padding: '6px 14px',
                            borderRadius: '999px',
                            backgroundColor: 'var(--bg)'
                          }}>
                            <Check size={14} color="var(--purple)" /> Request Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => sendRequest(person.id)}
                            className="hbd-btn hbd-btn-ghost"
                            style={{
                              padding: '7px 16px',
                              fontSize: '13px',
                              color: 'var(--purple)',
                              borderColor: 'var(--purple)',
                              fontWeight: 700
                            }}
                          >
                            <UserPlus size={14} /> Add to Circle
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {discoverablePeople.length === 0 && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    color: 'var(--muted)'
                  }}>
                    No people found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Friend Detail Modal (Gift wishes & preferences) */}
        {selectedPerson && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 14, 28, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '16px'
          }}>
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <Avatar name={selectedPerson.fullName} src={selectedPerson.avatarUrl} size={64} />
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedPerson.fullName}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    @{selectedPerson.handle} · {selectedPerson.city}, {selectedPerson.country}
                  </p>
                  <p style={{ color: 'var(--purple)', fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>
                    🎂 Birthday: {selectedPerson.birthMonth}/{selectedPerson.birthDay}
                  </p>
                </div>
              </div>

              {selectedPerson.bio && (
                <p style={{ fontSize: '13px', color: 'var(--fg)', marginBottom: '18px', fontStyle: 'italic' }}>
                  "{selectedPerson.bio}"
                </p>
              )}

              {/* Gift Wishes */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--purple)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> GIFT WISHES & FAVORITES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedPerson.preferences?.interests?.map(item => (
                    <span key={item} className="hbd-chip is-on" style={{ fontSize: '12px', padding: '5px 12px' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avoid */}
              {selectedPerson.preferences?.avoid && selectedPerson.preferences.avoid.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--coral)', marginBottom: '8px' }}>
                    THINGS TO AVOID
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPerson.preferences.avoid.map(item => (
                      <span key={item} className="hbd-chip is-avoid is-on" style={{ fontSize: '12px', padding: '5px 12px' }}>
                        ✕ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedPerson(null)}
                className="hbd-btn hbd-btn-primary"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
