import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Gift, 
  Sparkles, 
  Plus
} from 'lucide-react';
import { Avatar } from './Avatar';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'me' | 'them';
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isAction?: boolean;
  actionType?: 'GIFT' | 'CONFETTI' | 'POT';
}

interface Conversation {
  id: string;
  name: string;
  avatarUrl: string;
  celebrationStatus?: string;
  isGroup?: boolean;
  isVendor?: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  category: 'FRIENDS' | 'CIRCLES' | 'VENDORS';
  pinnedEvent?: {
    title: string;
    date: string;
    progress?: string;
    actionLabel: string;
  };
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    celebrationStatus: '🎂 30th Birthday in 14 days',
    lastMessage: 'Can not wait for the birthday celebration dinner on Friday! 🥂✨',
    timestamp: '10m ago',
    unreadCount: 2,
    category: 'FRIENDS',
    pinnedEvent: {
      title: "Sarah's 30th Birthday Joint Gift Pot",
      date: 'Oct 24 · Douala & London',
      progress: '$85 / $150 collected (4 friends chipped in)',
      actionLabel: 'Chip in $25'
    },
    messages: [
      {
        id: 'm-1',
        sender: 'them',
        senderName: 'Sarah Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'Hey Samuel! Are you arriving in Douala ahead of Friday evening?',
        timestamp: '10:24 AM'
      },
      {
        id: 'm-2',
        sender: 'me',
        senderName: 'Samuel Ndamukong',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Yes! Flight lands on Thursday afternoon. Already got the acoustic choir coordinated for your doorstep greeting.',
        timestamp: '10:28 AM'
      },
      {
        id: 'm-3',
        sender: 'them',
        senderName: 'Sarah Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'Can not wait for the birthday celebration dinner on Friday! 🥂✨',
        timestamp: '10:30 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    name: "Mama Chantal's 60th Circle",
    avatarUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    celebrationStatus: '🤫 Secret Family Circle (5 members)',
    isGroup: true,
    lastMessage: 'Choir confirmed for 4 PM! Doorstep surprise is on schedule.',
    timestamp: '45m ago',
    unreadCount: 1,
    category: 'CIRCLES',
    pinnedEvent: {
      title: "Mama Chantal's 60th Live Room & Stream",
      date: 'Oct 19 · 16:00 GMT+1',
      actionLabel: 'View Live Room'
    },
    messages: [
      {
        id: 'm-4',
        sender: 'them',
        senderName: 'David Kouam',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Has everyone recorded their video memory tribute for the vault?',
        timestamp: '9:15 AM'
      },
      {
        id: 'm-5',
        sender: 'me',
        senderName: 'Samuel Ndamukong',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Uploaded mine yesterday. 4 minutes of childhood toasts with acoustic backing.',
        timestamp: '9:40 AM'
      },
      {
        id: 'm-6',
        sender: 'them',
        senderName: 'Claire Touré',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        text: 'Choir confirmed for 4 PM! Doorstep surprise is on schedule.',
        timestamp: '10:12 AM'
      }
    ]
  },
  {
    id: 'conv-3',
    name: 'Bonapriso Gourmet Baker',
    avatarUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
    celebrationStatus: '⭐ Verified HBD Vendor · Douala, CM',
    isVendor: true,
    lastMessage: 'Your custom vanilla passionfruit cake is scheduled for delivery on Oct 19.',
    timestamp: '2h ago',
    unreadCount: 0,
    category: 'VENDORS',
    messages: [
      {
        id: 'm-7',
        sender: 'them',
        senderName: 'Bonapriso Baker',
        senderAvatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
        text: 'Bonjour Samuel! Thank you for ordering the 3-tier anniversary design via HBD Concierge.',
        timestamp: 'Yesterday'
      },
      {
        id: 'm-8',
        sender: 'them',
        senderName: 'Bonapriso Baker',
        senderAvatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
        text: 'Your custom vanilla passionfruit cake is scheduled for delivery on Oct 19.',
        timestamp: '8:45 AM'
      }
    ]
  },
  {
    id: 'conv-4',
    name: 'David Kouam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    celebrationStatus: 'Friend · Toronto, CA',
    lastMessage: 'Did you see the latest celebration reel from Mama Chantal choir?',
    timestamp: '1d ago',
    unreadCount: 0,
    category: 'FRIENDS',
    messages: [
      {
        id: 'm-9',
        sender: 'them',
        senderName: 'David Kouam',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Did you see the latest celebration reel from Mama Chantal choir?',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'conv-5',
    name: 'Aisha Bello',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    celebrationStatus: 'Founder @PaySeed · Lagos, NG',
    lastMessage: 'Counting down to your big day! Ready to send cheer!',
    timestamp: '2d ago',
    unreadCount: 0,
    category: 'FRIENDS',
    messages: [
      {
        id: 'm-10',
        sender: 'them',
        senderName: 'Aisha Bello',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        text: 'Counting down to your big day! Ready to send cheer!',
        timestamp: '2d ago'
      }
    ]
  }
];

interface MessagesViewProps {
  onOpenPlanner: (celebrant?: string) => void;
  onOpenGifts: (recipient?: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onOpenPlanner, onOpenGifts }) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FRIENDS' | 'CIRCLES' | 'VENDORS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const currentConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      senderName: 'Samuel Ndamukong',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: messageInput.trim(),
      timestamp: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConvId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          timestamp: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setMessageInput('');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#5B2A86', '#F4B942', '#FF6B6B', '#1A8F6B']
    });

    const celebrationMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      senderName: 'Samuel Ndamukong',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: '🎉 Sent a Confetti Toast & Celebration Sparkle!',
      timestamp: 'Just now',
      isAction: true,
      actionType: 'CONFETTI'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConvId) {
        return {
          ...c,
          lastMessage: '🎉 Sent a Confetti Toast!',
          timestamp: 'Just now',
          messages: [...c.messages, celebrationMsg]
        };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => {
    const matchesCategory = activeCategory === 'ALL' || c.category === activeCategory;
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      backgroundColor: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* ---------------- Left Pane: Conversations List (360px) ---------------- */}
      <aside style={{
        width: '360px',
        height: '100vh',
        borderRight: '1px solid var(--line)',
        backgroundColor: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 14px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'var(--purple-soft)',
                color: 'var(--purple)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <MessageSquare size={17} />
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--purple)' }}>
                Messages
              </h1>
            </div>

            <button
              onClick={() => onOpenPlanner()}
              title="New celebration thread"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--purple)',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg)',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            padding: '0 12px',
            height: '38px'
          }}>
            <Search size={15} color="var(--muted)" />
            <input
              type="text"
              placeholder="Search chats, circles, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: 'var(--fg)',
                width: '100%'
              }}
            />
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'FRIENDS', label: 'Friends' },
              { id: 'CIRCLES', label: 'Circles' },
              { id: 'VENDORS', label: 'Vendors' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: activeCategory === tab.id ? 800 : 600,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: activeCategory === tab.id ? 'var(--purple)' : 'var(--bg)',
                  color: activeCategory === tab.id ? '#FFF8EE' : 'var(--muted)',
                  border: '1px solid',
                  borderColor: activeCategory === tab.id ? 'var(--purple)' : 'var(--line)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredConversations.map(conv => {
            const isSelected = conv.id === selectedConvId;
            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? 'var(--purple-soft)' : 'transparent',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Avatar src={conv.avatarUrl} name={conv.name} size={44} />
                  {conv.unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--coral)',
                      border: '2px solid var(--card)'
                    }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: isSelected ? 'var(--purple)' : 'var(--fg)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {conv.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0, marginLeft: '6px' }}>
                      {conv.timestamp}
                    </span>
                  </div>

                  {conv.celebrationStatus && (
                    <span style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--coral)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '2px'
                    }}>
                      {conv.celebrationStatus}
                    </span>
                  )}

                  <span style={{
                    display: 'block',
                    fontSize: '12px',
                    color: conv.unreadCount > 0 ? 'var(--fg)' : 'var(--muted)',
                    fontWeight: conv.unreadCount > 0 ? 700 : 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {conv.lastMessage}
                  </span>
                </div>

                {conv.unreadCount > 0 && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'var(--coral)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    flexShrink: 0
                  }}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ---------------- Right Pane: Active Conversation ---------------- */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--bg)'
      }}>
        {/* Conversation Header */}
        <div style={{
          height: '68px',
          padding: '0 28px',
          borderBottom: '1px solid var(--line)',
          backgroundColor: 'var(--card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Avatar src={currentConv.avatarUrl} name={currentConv.name} size={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>
                  {currentConv.name}
                </h2>
                {currentConv.isGroup && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'var(--purple-soft)',
                    color: 'var(--purple)',
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}>
                    Circle
                  </span>
                )}
                {currentConv.isVendor && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'var(--gold-soft)',
                    color: '#202124',
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}>
                    Verified Baker
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                {currentConv.celebrationStatus || 'Active Celebration Partner'}
              </span>
            </div>
          </div>

          {/* Quick Header CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onOpenGifts(currentConv.name)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--gold-soft)',
                color: '#202124',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Gift size={14} />
              Send Universal Gift
            </button>

            <button
              onClick={() => onOpenPlanner(currentConv.name)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--purple)',
                color: '#FFF8EE',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} color="var(--gold)" />
              Plan Event
            </button>
          </div>
        </div>

        {/* Pinned Celebration Highlight Card (If active) */}
        {currentConv.pinnedEvent && (
          <div style={{
            margin: '14px 28px 0',
            padding: '12px 18px',
            borderRadius: '14px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--gold-soft)',
                display: 'grid',
                placeItems: 'center',
                color: '#202124'
              }}>
                <Gift size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: 0, color: 'var(--purple)' }}>
                  {currentConv.pinnedEvent.title}
                </h4>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  {currentConv.pinnedEvent.date} {currentConv.pinnedEvent.progress ? `· ${currentConv.pinnedEvent.progress}` : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenGifts(currentConv.name)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--gold)',
                color: '#202124',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {currentConv.pinnedEvent.actionLabel}
            </button>
          </div>
        )}

        {/* Message Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {currentConv.messages.map(msg => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}
              >
                {!isMe && <Avatar src={msg.senderAvatar} name={msg.senderName} size={30} />}

                <div style={{
                  maxWidth: '560px',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  borderBottomRightRadius: isMe ? '4px' : '18px',
                  borderBottomLeftRadius: !isMe ? '4px' : '18px',
                  backgroundColor: isMe ? 'var(--purple)' : 'var(--card)',
                  color: isMe ? '#FFF8EE' : 'var(--fg)',
                  border: isMe ? 'none' : '1px solid var(--line)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {!isMe && currentConv.isGroup && (
                    <span style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: 'var(--purple)',
                      marginBottom: '4px'
                    }}>
                      {msg.senderName}
                    </span>
                  )}

                  <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>
                    {msg.text}
                  </p>

                  <span style={{
                    display: 'block',
                    fontSize: '10.5px',
                    color: isMe ? 'rgba(255, 248, 238, 0.7)' : 'var(--muted)',
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Celebration Reaction Bar */}
        <div style={{
          padding: '8px 28px',
          display: 'flex',
          gap: '8px',
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--line)'
        }}>
          <button
            onClick={triggerConfetti}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--purple)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            🎉 Confetti Burst
          </button>

          <button
            onClick={() => onOpenGifts(currentConv.name)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#202124',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            🎁 Attach Gift
          </button>

          <button
            onClick={() => onOpenPlanner(currentConv.name)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--coral)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            🥂 Toast Moment
          </button>
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '16px 28px',
            backgroundColor: 'var(--card)',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            type="text"
            placeholder={`Message ${currentConv.name}...`}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            style={{
              flex: 1,
              height: '44px',
              padding: '0 18px',
              borderRadius: '999px',
              border: '1px solid var(--line)',
              backgroundColor: 'var(--bg)',
              fontSize: '13.5px',
              color: 'var(--fg)',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: messageInput.trim() ? 'var(--purple)' : 'var(--line)',
              color: '#FFF8EE',
              display: 'grid',
              placeItems: 'center',
              cursor: messageInput.trim() ? 'pointer' : 'default',
              border: 'none',
              transition: 'background 0.15s ease'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </main>
    </div>
  );
};
