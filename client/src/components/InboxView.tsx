import React, { useState } from 'react';
import { 
  MessageSquare, 
  Gift, 
  Calendar, 
  Heart, 
  Archive, 
  CheckCircle, 
  Clock, 
  Users, 
  Sparkles
} from 'lucide-react';
import { Avatar } from './Avatar';

interface InboxItem {
  id: string;
  type: 'GROUP_GIFT' | 'INVITE' | 'WISH' | 'MEMORY' | 'REMINDER';
  title: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  message: string;
  unread: boolean;
  potAmount?: string;
  currentAmount?: number;
  targetAmount?: number;
  eventDate?: string;
  location?: string;
}

const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'inbox-1',
    type: 'GROUP_GIFT',
    title: "Sarah's 30th Birthday Group Gift Pot",
    senderName: 'David Kouam',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    timestamp: '20m ago',
    message: 'David started a joint gift pot for Sarah’s Jo Malone perfume & curated flower basket. 4 friends have chipped in so far!',
    unread: true,
    potAmount: '$85 / $150 collected',
    currentAmount: 85,
    targetAmount: 150,
  },
  {
    id: 'inbox-2',
    type: 'INVITE',
    title: "Mama Chantal's 60th Doorstep Surprise",
    senderName: 'Samuel Ndamukong',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: '2h ago',
    message: 'You are invited to join the private celebration live stream & digital group video card.',
    unread: true,
    eventDate: 'Oct 19 · 16:00 GMT+1',
    location: 'Bonapriso, Douala & HBD Live Room',
  },
  {
    id: 'inbox-3',
    type: 'WISH',
    title: 'Heartfelt Pre-Birthday Cheer',
    senderName: 'Aisha Bello',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    timestamp: '5h ago',
    message: '“Counting down to your birthday next month! Already orchestrating the greatest surprise for you! 🥂✨”',
    unread: false,
  },
  {
    id: 'inbox-4',
    type: 'MEMORY',
    title: 'Memory Vault Contribution',
    senderName: 'Claire Touré',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    timestamp: '1d ago',
    message: 'Claire added 4 keepsake photos and an acoustic audio toast to your shared anniversary vault.',
    unread: false,
  },
  {
    id: 'inbox-5',
    type: 'REMINDER',
    title: 'HBD Concierge Milestone Alert',
    senderName: 'HBD Concierge Team',
    senderAvatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    timestamp: '2d ago',
    message: 'Company 10-Year milestone is in 29 days. Early booking guarantee for custom event coordination ends this Friday.',
    unread: false,
  }
];

interface InboxViewProps {
  onOpenPlanner?: (celebrant: string) => void;
  onNavigateToVault?: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ 
  onOpenPlanner,
  onNavigateToVault 
}) => {
  const [items, setItems] = useState<InboxItem[]>(INITIAL_INBOX);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTION' | 'WISHES' | 'MEMORIES'>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    if (activeFilter === 'ACTION') return item.type === 'GROUP_GIFT' || item.type === 'INVITE';
    if (activeFilter === 'WISHES') return item.type === 'WISH' || item.type === 'REMINDER';
    if (activeFilter === 'MEMORIES') return item.type === 'MEMORY';
    return true;
  });

  const handleContributePot = (id: string, amount: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id && item.currentAmount !== undefined) {
        const newCurr = item.currentAmount + amount;
        return {
          ...item,
          currentAmount: newCurr,
          potAmount: `$${newCurr} / $${item.targetAmount} collected`,
          unread: false
        };
      }
      return item;
    }));
    setActionNotice(`Successfully contributed $${amount} to the group gift pot! 🎁`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRSVP = (id: string, accepted: boolean) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, unread: false } : item));
    setActionNotice(accepted ? 'RSVP Confirmed! You are on the celebration guest list. 🎉' : 'Invitation updated.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const unreadCount = items.filter(i => i.unread).length;

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toast Notice */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#5B2A86',
          color: '#FFF8EE',
          padding: '14px 22px',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={18} color="#F4B942" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div style={{
        padding: '32px 40px 24px',
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--card)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--purple-soft, rgba(91,42,134,0.1))',
            color: '#5B2A86',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <MessageSquare size={13} color="#5B2A86" />
            <span>Action & Communication Center</span>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#FF6B6B',
                color: '#FFF',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 800,
                marginLeft: '4px'
              }}>
                {unreadCount} NEW
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.8px',
            color: 'var(--fg)',
            margin: '0 0 8px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Celebration Inbox
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: '15px',
            margin: 0,
            maxWidth: '650px',
            lineHeight: 1.5
          }}>
            Group gift pots, doorstep surprise invitations, incoming birthday cards & concierge alerts.
          </p>

          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'ALL', label: `All Activity (${items.length})` },
              { id: 'ACTION', label: 'Action Required (2)' },
              { id: 'WISHES', label: 'Wishes & Cards (2)' },
              { id: 'MEMORIES', label: 'Memory Keepsakes (1)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: activeFilter === tab.id ? 700 : 500,
                  border: activeFilter === tab.id ? '1px solid #5B2A86' : '1px solid var(--line)',
                  backgroundColor: activeFilter === tab.id ? '#5B2A86' : 'var(--card)',
                  color: activeFilter === tab.id ? '#FFF8EE' : 'var(--fg)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Feed */}
      <div style={{
        padding: '32px 40px',
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        flex: 1
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredItems.map(item => {
            const isGroupGift = item.type === 'GROUP_GIFT';
            const isInvite = item.type === 'INVITE';
            const isWish = item.type === 'WISH';
            const isMemory = item.type === 'MEMORY';
            const isReminder = item.type === 'REMINDER';

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: 'var(--card)',
                  border: item.unread ? '1.5px solid #F4B942' : '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: item.unread ? '0 8px 24px rgba(244,185,66,0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '20px',
                  position: 'relative',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Sender Avatar */}
                <div style={{ flexShrink: 0 }}>
                  <Avatar 
                    name={item.senderName} 
                    src={item.senderAvatar} 
                    size={46} 
                  />
                </div>

                {/* Content Column */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: 'var(--fg)'
                      }}>
                        {item.senderName}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        backgroundColor: isGroupGift ? 'rgba(244,185,66,0.15)' : isInvite ? 'rgba(91,42,134,0.12)' : 'rgba(255,107,107,0.12)',
                        color: isGroupGift ? '#B8820B' : isInvite ? '#5B2A86' : '#FF6B6B'
                      }}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px' }}>
                      <Clock size={12} />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    margin: '0 0 8px 0',
                    color: 'var(--fg)'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--fg)',
                    opacity: 0.88,
                    lineHeight: 1.5,
                    margin: '0 0 16px 0'
                  }}>
                    {item.message}
                  </p>

                  {/* Group Gift Pot Meter */}
                  {isGroupGift && item.currentAmount !== undefined && item.targetAmount !== undefined && (
                    <div style={{
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--line)',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        fontWeight: 700,
                        marginBottom: '8px'
                      }}>
                        <span style={{ color: '#5B2A86', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Gift size={14} color="#5B2A86" />
                          <span>Collective Pot</span>
                        </span>
                        <span style={{ color: '#B8820B' }}>
                          ${item.currentAmount} / ${item.targetAmount} ({(item.currentAmount / item.targetAmount * 100).toFixed(0)}%)
                        </span>
                      </div>

                      {/* Bar */}
                      <div style={{
                        height: '8px',
                        backgroundColor: 'var(--line)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (item.currentAmount / item.targetAmount) * 100)}%`,
                          backgroundColor: '#F4B942',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Invitation Metadata */}
                  {isInvite && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '16px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg)',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: 'var(--fg)'
                    }}>
                      {item.eventDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#5B2A86" />
                          <span><strong>When:</strong> {item.eventDate}</span>
                        </div>
                      )}
                      {item.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={14} color="#5B2A86" />
                          <span><strong>Where:</strong> {item.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {isGroupGift && (
                      <>
                        <button
                          onClick={() => handleContributePot(item.id, 25)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '12px',
                            backgroundColor: '#F4B942',
                            color: '#202124',
                            fontWeight: 700,
                            fontSize: '13px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Gift size={14} />
                          <span>Contribute $25</span>
                        </button>
                        <button
                          onClick={() => handleContributePot(item.id, 50)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            color: 'var(--fg)',
                            fontWeight: 600,
                            fontSize: '13px',
                            border: '1px solid var(--line)',
                            cursor: 'pointer'
                          }}
                        >
                          Contribute $50
                        </button>
                      </>
                    )}

                    {isInvite && (
                      <>
                        <button
                          onClick={() => handleRSVP(item.id, true)}
                          style={{
                            padding: '9px 20px',
                            borderRadius: '12px',
                            backgroundColor: '#5B2A86',
                            color: '#FFF8EE',
                            fontWeight: 700,
                            fontSize: '13px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <CheckCircle size={14} color="#F4B942" />
                          <span>RSVP Going 🎉</span>
                        </button>
                        <button
                          onClick={() => handleRSVP(item.id, false)}
                          style={{
                            padding: '9px 16px',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            color: 'var(--muted)',
                            fontWeight: 500,
                            fontSize: '13px',
                            border: '1px solid var(--line)',
                            cursor: 'pointer'
                          }}
                        >
                          Can't Make It
                        </button>
                      </>
                    )}

                    {isWish && (
                      <button
                        onClick={() => {
                          setActionNotice('Cheer & thank you note sent back! ❤️');
                          setTimeout(() => setActionNotice(null), 3000);
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '12px',
                          backgroundColor: '#FF6B6B',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Heart size={14} fill="#FFF" />
                        <span>Send Heart & Thanks</span>
                      </button>
                    )}

                    {isMemory && (
                      <button
                        onClick={() => {
                          if (onNavigateToVault) onNavigateToVault();
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--purple-soft, rgba(91,42,134,0.12))',
                          color: '#5B2A86',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Archive size={14} />
                        <span>Open Memory Keepsake</span>
                      </button>
                    )}

                    {isReminder && (
                      <button
                        onClick={() => {
                          if (onOpenPlanner) onOpenPlanner('Kaba Technologies 10th');
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '12px',
                          backgroundColor: '#5B2A86',
                          color: '#FFF8EE',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={14} color="#F4B942" />
                        <span>Coordinate with Concierge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
