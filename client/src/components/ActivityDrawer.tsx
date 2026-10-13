import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Gift, 
  Calendar, 
  Heart, 
  Archive, 
  Sparkles, 
  PlusSquare, 
  MessageSquare
} from 'lucide-react';
import { Avatar } from './Avatar';

export interface NotificationActivityItem {
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

const INITIAL_ACTIVITIES: NotificationActivityItem[] = [
  {
    id: 'act-1',
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
    id: 'act-2',
    type: 'INVITE',
    title: "Mama Chantal's 60th Doorstep Surprise",
    senderName: 'Samuel Ndamukong',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: '2h ago',
    message: 'You are invited to join the private celebration live stream & digital group video card in Douala.',
    unread: true,
    eventDate: 'Oct 19 · 16:00 GMT+1',
    location: 'Bonapriso, Douala & HBD Live Room',
  },
  {
    id: 'act-3',
    type: 'WISH',
    title: 'Heartfelt Pre-Birthday Cheer',
    senderName: 'Aisha Bello',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    timestamp: '5h ago',
    message: '“Counting down to your birthday next month! Already orchestrating the greatest surprise for you! 🥂✨”',
    unread: false,
  },
  {
    id: 'act-4',
    type: 'MEMORY',
    title: 'Memory Vault Contribution',
    senderName: 'Claire Touré',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    timestamp: '1d ago',
    message: 'Claire added 4 keepsake photos and an acoustic audio toast to your shared anniversary vault.',
    unread: false,
  },
  {
    id: 'act-5',
    type: 'REMINDER',
    title: 'HBD Concierge Milestone Alert',
    senderName: 'HBD Concierge Team',
    senderAvatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    timestamp: '2d ago',
    message: 'Company 10-Year milestone is in 29 days. Early booking guarantee for custom event coordination ends this Friday.',
    unread: false,
  }
];

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
  onOpenPlanner: (celebrant?: string) => void;
  onNavigateToGifts: () => void;
  onNavigateToMessages: () => void;
  onNavigateToVault: () => void;
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({
  isOpen,
  onClose,
  isSidebarCollapsed,
  onOpenPlanner,
  onNavigateToGifts,
  onNavigateToMessages,
  onNavigateToVault,
}) => {
  const [items, setItems] = useState<NotificationActivityItem[]>(INITIAL_ACTIVITIES);
  const [filter, setFilter] = useState<'ALL' | 'INVITES' | 'POTS' | 'WISHES'>('ALL');
  const [contributedMap, setContributedMap] = useState<Record<string, boolean>>({});
  const [rsvpMap, setRsvpMap] = useState<Record<string, 'ACCEPTED' | 'DECLINED'>>({});

  const unreadCount = items.filter(i => i.unread).length;

  const markAllAsRead = () => {
    setItems(prev => prev.map(i => ({ ...i, unread: false })));
  };

  const handleContribute = (id: string) => {
    setContributedMap(prev => ({ ...prev, [id]: true }));
    setItems(prev => prev.map(i => {
      if (i.id === id && i.currentAmount && i.targetAmount) {
        return {
          ...i,
          unread: false,
          currentAmount: Math.min(i.targetAmount, i.currentAmount + 25),
          potAmount: `$${Math.min(i.targetAmount, i.currentAmount + 25)} / $${i.targetAmount} collected`
        };
      }
      return i;
    }));
  };

  const handleRSVP = (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    setRsvpMap(prev => ({ ...prev, [id]: status }));
    setItems(prev => prev.map(i => i.id === id ? { ...i, unread: false } : i));
  };

  const filteredItems = items.filter(i => {
    if (filter === 'INVITES') return i.type === 'INVITE';
    if (filter === 'POTS') return i.type === 'GROUP_GIFT';
    if (filter === 'WISHES') return i.type === 'WISH' || i.type === 'MEMORY';
    return true;
  });

  const sidebarWidth = isSidebarCollapsed ? 76 : 290;

  return (
    <>
      {/* Semi-transparent Dimming Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 20, 28, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 94,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.24s ease',
        }}
      />

      {/* Rolled-out Left Block Panel */}
      <aside
        aria-label="Notifications & Activity drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: `${sidebarWidth}px`,
          width: 'min(420px, calc(100vw - 76px))',
          height: '100vh',
          backgroundColor: 'var(--card)',
          borderRight: '1px solid var(--line)',
          boxShadow: '16px 0 40px rgba(0, 0, 0, 0.16)',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-105%)',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), left 0.22s cubic-bezier(0.2, 0, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header: "Notifications" */}
        <div
          style={{
            padding: '20px 22px 16px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'linear-gradient(180deg, var(--card) 0%, var(--bg) 100%)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--purple-soft)',
                  color: 'var(--purple)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Bell size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: 'var(--coral)',
                        color: '#fff',
                        padding: '1px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, marginTop: '2px' }}>
                  Celebration invites, gift pots & circle updates
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--line)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--purple)';
                    e.currentTarget.style.borderColor = 'var(--purple)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                    e.currentTarget.style.borderColor = 'var(--line)';
                  }}
                >
                  <CheckCheck size={13} />
                  Read all
                </button>
              )}

              <button
                onClick={onClose}
                title="Close notifications"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--line)',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--fg)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted)';
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {(
              [
                { id: 'ALL', label: `All (${items.length})` },
                { id: 'POTS', label: 'Pots' },
                { id: 'INVITES', label: 'Invites' },
                { id: 'WISHES', label: 'Wishes' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: filter === tab.id ? 800 : 600,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: filter === tab.id ? 'var(--purple)' : 'var(--card)',
                  color: filter === tab.id ? '#FFF8EE' : 'var(--muted)',
                  border: '1px solid',
                  borderColor: filter === tab.id ? 'var(--purple)' : 'var(--line)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Notification Cards List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {filteredItems.map((item) => {
            const isContributed = contributedMap[item.id];
            const rsvpStatus = rsvpMap[item.id];

            return (
              <div
                key={item.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: item.unread ? 'rgba(91, 42, 134, 0.04)' : 'var(--bg)',
                  border: '1px solid',
                  borderColor: item.unread ? 'rgba(91, 42, 134, 0.22)' : 'var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  position: 'relative',
                  transition: 'all 0.18s ease',
                }}
              >
                {/* Card Top Row: Sender + Type Pill + Timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={item.senderAvatar} name={item.senderName} size={36} />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fg)', display: 'block' }}>
                        {item.senderName}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor:
                        item.type === 'GROUP_GIFT'
                          ? 'var(--gold)'
                          : item.type === 'INVITE'
                          ? 'var(--purple-soft)'
                          : item.type === 'WISH'
                          ? 'var(--coral-soft)'
                          : 'var(--card)',
                      color:
                        item.type === 'GROUP_GIFT'
                          ? '#202124'
                          : item.type === 'INVITE'
                          ? 'var(--purple)'
                          : item.type === 'WISH'
                          ? 'var(--coral)'
                          : 'var(--fg)',
                      letterSpacing: '0.02em',
                      border: '1px solid var(--line)',
                    }}
                  >
                    {item.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Content Message */}
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--purple)', margin: '0 0 4px 0' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--fg)', lineHeight: 1.45, margin: 0 }}>
                    {item.message}
                  </p>
                </div>

                {/* Pot Progress (For GROUP_GIFT) */}
                {item.type === 'GROUP_GIFT' && item.currentAmount && item.targetAmount && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700 }}>
                      <span style={{ color: 'var(--muted)' }}>Gift Pot Progress</span>
                      <span style={{ color: 'var(--purple)' }}>{item.potAmount}</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--line)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(item.currentAmount / item.targetAmount) * 100}%`,
                          backgroundColor: 'var(--gold)',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Event Location (For INVITE) */}
                {item.type === 'INVITE' && item.eventDate && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      color: 'var(--muted)',
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={13} color="var(--purple)" />
                    <span>{item.eventDate}</span>
                  </div>
                )}

                {/* CTAs SPECIFIC TO NOTIFICATION */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {item.type === 'GROUP_GIFT' && (
                    <>
                      <button
                        onClick={() => handleContribute(item.id)}
                        disabled={isContributed}
                        style={{
                          flex: 1,
                          padding: '7px 12px',
                          borderRadius: '10px',
                          backgroundColor: isContributed ? 'var(--emerald)' : 'var(--gold)',
                          color: '#202124',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: isContributed ? 'default' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: 'none',
                        }}
                      >
                        <Gift size={13} />
                        {isContributed ? 'Chipped in $25 ✓' : 'Chip in $25'}
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToMessages();
                        }}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--card)',
                          color: 'var(--purple)',
                          border: '1px solid var(--line)',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Details
                      </button>
                    </>
                  )}

                  {item.type === 'INVITE' && (
                    <>
                      <button
                        onClick={() => handleRSVP(item.id, 'ACCEPTED')}
                        style={{
                          flex: 1,
                          padding: '7px 12px',
                          borderRadius: '10px',
                          backgroundColor: rsvpStatus === 'ACCEPTED' ? 'var(--emerald)' : 'var(--purple)',
                          color: '#FFF8EE',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          border: 'none',
                        }}
                      >
                        {rsvpStatus === 'ACCEPTED' ? 'RSVP Confirmed 🎉' : 'Accept & RSVP'}
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPlanner(item.senderName);
                        }}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--card)',
                          color: 'var(--fg)',
                          border: '1px solid var(--line)',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Send Video Card
                      </button>
                    </>
                  )}

                  {item.type === 'WISH' && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMessages();
                      }}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--coral-soft)',
                        color: 'var(--coral)',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                      }}
                    >
                      <Heart size={13} />
                      Reply with Toast 🥂
                    </button>
                  )}

                  {item.type === 'MEMORY' && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToVault();
                      }}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--card)',
                        color: 'var(--purple)',
                        border: '1px solid var(--line)',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Archive size={13} />
                      View Memory Vault
                    </button>
                  )}

                  {item.type === 'REMINDER' && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlanner('Company 10-Year Milestone');
                      }}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--purple)',
                        color: '#FFF8EE',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                      }}
                    >
                      <Sparkles size={13} />
                      Book Early Guarantee
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DIFFERENT CTAs BELOW (Sticky Bottom Action Drawer) */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--line)',
            backgroundColor: 'var(--card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0,
            boxShadow: '0 -4px 18px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Primary CTA */}
          <button
            onClick={() => {
              onClose();
              onOpenPlanner();
            }}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '14px',
              backgroundColor: 'var(--purple)',
              color: '#FFF8EE',
              fontWeight: 800,
              fontSize: '13.5px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(91, 42, 134, 0.25)',
              border: 'none',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <PlusSquare size={16} color="var(--gold)" />
            Plan a New Celebration
          </button>

          {/* Secondary Action Row with Different CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                onNavigateToGifts();
              }}
              style={{
                padding: '9px 10px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                color: 'var(--fg)',
                fontWeight: 700,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Gift size={14} color="var(--purple)" />
              Universal Gifts
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToMessages();
              }}
              style={{
                padding: '9px 10px',
                borderRadius: '11px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                color: 'var(--fg)',
                fontWeight: 700,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={14} color="var(--coral)" />
              All Messages
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--muted)',
              fontWeight: 600,
              marginTop: '2px',
            }}
          >
            <Sparkles size={11} color="var(--gold)" />
            <span>HBD Foundation Concierge • Synchronized real-time</span>
          </div>
        </div>
      </aside>
    </>
  );
};
