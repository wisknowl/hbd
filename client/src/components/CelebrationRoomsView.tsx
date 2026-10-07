import React, { useState } from 'react';
import { 
  Users, 
  Radio, 
  DollarSign, 
  Archive, 
  Plus 
} from 'lucide-react';
import type { CelebrationRoom } from '../../../shared/types';
import { mockCelebrationRooms } from '../mockData';

interface CelebrationRoomsViewProps {
  onPlanCelebration: () => void;
  onViewVault: () => void;
}

export const CelebrationRoomsView: React.FC<CelebrationRoomsViewProps> = ({
  onPlanCelebration,
  onViewVault,
}) => {
  const [rooms, setRooms] = useState<CelebrationRoom[]>(mockCelebrationRooms);
  const [selectedRoom, setSelectedRoom] = useState<CelebrationRoom | null>(null);

  // Group Contribution State
  const [contributionAmount, setContributionAmount] = useState<number>(25);
  const [contributorName, setContributorName] = useState('Amina');
  const [tributeText, setTributeText] = useState('');
  const [hasContributed, setHasContributed] = useState(false);

  // Create Room Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCelebrant, setNewCelebrant] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [newDate, setNewDate] = useState('2026-10-25');
  const [newGoal, setNewGoal] = useState<number>(500);

  const handleOpenRoomModal = (room: CelebrationRoom) => {
    setSelectedRoom(room);
    setHasContributed(false);
    setTributeText('');
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setRooms(prev => prev.map(r => {
      if (r.id === selectedRoom.id) {
        return {
          ...r,
          potRaised: r.potRaised + contributionAmount,
          tributesCount: tributeText ? r.tributesCount + 1 : r.tributesCount
        };
      }
      return r;
    }));

    setHasContributed(true);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCelebrant || !newTitle) return;

    const newRoom: CelebrationRoom = {
      id: `room-${Date.now()}`,
      celebrantName: newCelebrant,
      title: newTitle,
      occasion: newOccasion || 'Special Celebration',
      eventDate: newDate || '2026-10-25',
      status: 'UPCOMING',
      coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      guestCount: 1,
      potGoal: newGoal,
      potRaised: 0,
      potCurrency: 'USD',
      organizerName: 'You',
      organizerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      location: 'Hybrid Virtual Room',
      tributesCount: 0,
      memoryVaultUnlocked: true
    };

    setRooms(prev => [newRoom, ...prev]);
    setIsCreateOpen(false);
    setNewCelebrant('');
    setNewTitle('');
    setNewOccasion('');
  };

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      padding: '32px 28px'
    }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Banner — HBD Celebration Rooms & Collective */}
        <div style={{
          background: 'linear-gradient(135deg, #1A3B34 0%, #0E221E 100%)',
          borderRadius: '26px',
          padding: '34px 32px',
          color: 'var(--cream)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '28px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'rgba(244, 185, 66, 0.15)',
            filter: 'blur(35px)'
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
              marginBottom: '14px'
            }}>
              <Radio size={14} />
              HBD COLLECTIVE · VIRTUAL CELEBRATION ROOMS
            </div>

            <h1 style={{
              fontSize: '34px',
              fontWeight: 900,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '10px'
            }}>
              Gather From Anywhere. <span style={{ color: 'var(--gold)' }}>Pool Joy Together.</span>
            </h1>

            <p style={{
              fontSize: '15.5px',
              maxWidth: '680px',
              lineHeight: 1.5,
              opacity: 0.9,
              marginBottom: '20px'
            }}>
              Whether pooling funds for Grandma's 80th or entering the global shared room of 1,000 people born today, every Celebration Room brings people together—and archives forever in the Memory Vault.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsCreateOpen(true)}
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--char)',
                  fontWeight: 800,
                  fontSize: '14px',
                  padding: '11px 24px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 16px rgba(244, 185, 66, 0.3)'
                }}
              >
                <Plus size={16} />
                Create Celebration Room
              </button>

              <button
                onClick={onPlanCelebration}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'var(--cream)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '11px 22px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Plan In-Person Surprise
              </button>

              <button
                onClick={onViewVault}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--cream)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '11px 22px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Archive size={16} />
                Memory Vault
              </button>
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}>
          {rooms.map(room => {
            const percentRaised = Math.min(100, Math.round((room.potRaised / room.potGoal) * 100));
            return (
              <div
                key={room.id}
                style={{
                  backgroundColor: 'var(--card)',
                  borderRadius: '24px',
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Cover & Live/Status Badge */}
                <div style={{ position: 'relative', height: '170px' }}>
                  <img 
                    src={room.coverImage} 
                    alt={room.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: room.status === 'LIVE_NOW' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {room.status === 'LIVE_NOW' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                    {room.status === 'LIVE_NOW' ? 'LIVE NOW' : 'UPCOMING'}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '12px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Users size={12} />
                    {room.guestCount} guests
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {room.occasion}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--fg)', margin: '4px 0 10px', lineHeight: 1.3 }}>
                      {room.title}
                    </h3>

                    {/* Collective Pot Bar */}
                    <div style={{
                      backgroundColor: 'var(--bg)',
                      borderRadius: '14px',
                      padding: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                        <span>Collective Celebration Pot:</span>
                        <b style={{ color: 'var(--emerald)' }}>${room.potRaised} / ${room.potGoal} ({percentRaised}%)</b>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: 'var(--line)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentRaised}%`,
                          height: '100%',
                          backgroundColor: percentRaised >= 100 ? 'var(--emerald)' : 'var(--coral)',
                          borderRadius: '999px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '12px',
                      color: 'var(--muted)',
                      marginBottom: '16px'
                    }}>
                      <img 
                        src={room.organizerAvatar} 
                        alt={room.organizerName}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>Organized by <b>{room.organizerName}</b></span>
                      <span>·</span>
                      <span>{room.tributesCount} tributes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRoomModal(room)}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--purple)',
                      color: 'var(--cream)',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(91, 42, 134, 0.25)',
                      cursor: 'pointer'
                    }}
                  >
                    <Radio size={15} />
                    Enter Room & Contribute
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Memory Vault Transition Banner */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '22px',
          border: '1px solid var(--line)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'var(--purple-soft)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--purple)'
            }}>
              <Archive size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 4px' }}>
                Every Room Becomes a Memory in the Vault
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
                When a celebration concludes, photos, guest tribute recordings, and group pot contributions seal into a permanent digital legacy.
              </p>
            </div>
          </div>

          <button
            onClick={onViewVault}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg)',
              color: 'var(--fg)',
              border: '1px solid var(--line)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Browse Vault Archives →
          </button>
        </div>
      </div>

      {/* Enter Room Modal (Tributes + Group Pot Contribution) */}
      {selectedRoom && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
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
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase' }}>
                  {selectedRoom.occasion}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedRoom.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{ fontSize: '18px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {!hasContributed ? (
              <form onSubmit={handleContribute}>
                {/* Collective Pot Status */}
                <div style={{
                  backgroundColor: 'var(--bg)',
                  padding: '16px',
                  borderRadius: '16px',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>Group Celebration Pot:</span>
                    <b style={{ color: 'var(--emerald)', fontSize: '14px' }}>
                      ${selectedRoom.potRaised} of ${selectedRoom.potGoal} Goal
                    </b>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--line)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: `${Math.min(100, Math.round((selectedRoom.potRaised / selectedRoom.potGoal) * 100))}%`,
                      height: '100%',
                      backgroundColor: 'var(--emerald)'
                    }} />
                  </div>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    Contributions directly fund the grand surprise, live choir, designer cake, and local gifts.
                  </small>
                </div>

                {/* Amount buttons */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    Select Contribution (HBD Collective)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[10, 25, 50, 100].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setContributionAmount(amt)}
                        style={{
                          padding: '10px',
                          borderRadius: '12px',
                          border: contributionAmount === amt ? '2px solid var(--coral)' : '1px solid var(--line)',
                          backgroundColor: contributionAmount === amt ? 'var(--coral-soft)' : 'var(--bg)',
                          color: contributionAmount === amt ? 'var(--coral)' : 'var(--fg)',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contributor Name & Tribute Message */}
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Your Name
                    </label>
                    <input 
                      type="text"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Leave a Tribute Message or Memory
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Share a heartfelt story or memory for the room memory board..."
                      value={tributeText}
                      onChange={(e) => setTributeText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--coral)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(255, 107, 107, 0.35)',
                    cursor: 'pointer'
                  }}
                >
                  <DollarSign size={16} />
                  Contribute ${contributionAmount} & Sign Room
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px',
                  fontSize: '26px'
                }}>
                  🎉
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                  Thank you, {contributorName}!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>
                  Your contribution of <b>${contributionAmount}</b> has been pooled into {selectedRoom.celebrantName}'s celebration fund and your tribute has been posted to the room wall!
                </p>
                <button
                  onClick={() => setSelectedRoom(null)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--purple)',
                    color: 'var(--cream)',
                    fontWeight: 800,
                    fontSize: '13px'
                  }}
                >
                  Close Room
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
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
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Create an HBD Celebration Room
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginBottom: '18px' }}>
              Create a digital room for a family milestone, startup launch, or birthday with a group gift pot and memory wall.
            </p>

            <form onSubmit={handleCreateRoom} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Celebrant / Entity
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Grandma Sophie, PaySeed Team, Brother Sam"
                  value={newCelebrant}
                  onChange={(e) => setNewCelebrant(e.target.value)}
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

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Room Title
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Grandma's 80th Jubilation & Legacy Room"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Occasion
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 80th Birthday"
                    value={newOccasion}
                    onChange={(e) => setNewOccasion(e.target.value)}
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
                    Event Date
                  </label>
                  <input 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
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
                    Pot Goal ($)
                  </label>
                  <input 
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
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

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'transparent',
                    color: 'var(--muted)',
                    fontSize: '13px'
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
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
