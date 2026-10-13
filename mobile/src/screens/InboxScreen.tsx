import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { ScreenLayout } from '../components/ScreenLayout';
import { AppIcon } from '../components/AppIcon';
import { mockSurprisePackages } from '../mockData';

interface InboxScreenProps {
  onOpenGifts: (recipient: string) => void;
  onOpenPlanner: (celebrant?: string) => void;
  onOpenSurprisePackage?: (celebrant?: string) => void;
}

// Conversation Chat Item definition
interface ChatThread {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  celebrationBadge?: string;
  isGroup?: boolean;
  isVendor?: boolean;
  messages: Array<{
    id: string;
    sender: 'me' | 'them';
    text: string;
    timestamp: string;
    isCelebrationAction?: boolean;
    actionBadge?: string;
  }>;
}

// Event Notification Activity Item definition
interface ActivityItem {
  id: string;
  type: 'GROUP_GIFT' | 'INVITE' | 'WISH' | 'MEMORY' | 'REMINDER';
  title: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  message: string;
  unread: boolean;
  potAmount?: string;
  eventDate?: string;
}

const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat-1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Can not wait for the birthday celebration dinner on Friday! 🥂✨',
    timestamp: '10m ago',
    unreadCount: 2,
    celebrationBadge: '🎂 30th Birthday in 14 days',
    messages: [
      { id: 'm-1', sender: 'them', text: 'Hey there! Are you coming to Douala for my 30th birthday dinner?', timestamp: '10:24 AM' },
      { id: 'm-2', sender: 'me', text: 'Yes! Already coordinated with Samuel. Getting something special ready for you.', timestamp: '10:28 AM' },
      { id: 'm-3', sender: 'them', text: 'Can not wait for the birthday celebration dinner on Friday! 🥂✨', timestamp: '10:30 AM' },
    ]
  },
  {
    id: 'chat-2',
    name: "Mama Chantal's 60th Circle",
    avatarUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Samuel: Choir confirmed for 4 PM! Doorstep surprise is on schedule.',
    timestamp: '45m ago',
    unreadCount: 1,
    isGroup: true,
    celebrationBadge: '🤫 Secret Family Circle (5 members)',
    messages: [
      { id: 'm-4', sender: 'them', text: 'Has everyone contributed to the doorstep surprise cake & choir?', timestamp: '9:15 AM' },
      { id: 'm-5', sender: 'me', text: 'Chipped in $25 to the pot earlier today! It looks wonderful.', timestamp: '9:40 AM' },
      { id: 'm-6', sender: 'them', text: 'Samuel: Choir confirmed for 4 PM! Doorstep surprise is on schedule.', timestamp: '10:12 AM' },
    ]
  },
  {
    id: 'chat-3',
    name: 'David Kouam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Did you see the custom cake options from Bonapriso bakery?',
    timestamp: '2h ago',
    unreadCount: 0,
    messages: [
      { id: 'm-7', sender: 'them', text: 'Did you see the custom cake options from Bonapriso bakery?', timestamp: '8:30 AM' }
    ]
  },
  {
    id: 'chat-4',
    name: 'Bonapriso Gourmet Baker',
    avatarUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Your custom vanilla passionfruit order is scheduled for delivery on Oct 19.',
    timestamp: '5h ago',
    unreadCount: 0,
    isVendor: true,
    celebrationBadge: '⭐ Verified HBD Vendor',
    messages: [
      { id: 'm-8', sender: 'them', text: 'Hello! Thank you for ordering with HBD Concierge.', timestamp: 'Yesterday' },
      { id: 'm-9', sender: 'them', text: 'Your custom vanilla passionfruit order is scheduled for delivery on Oct 19.', timestamp: '6:00 AM' }
    ]
  },
  {
    id: 'chat-5',
    name: 'Aisha Bello',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Counting down to your big day! Sending all good vibes.',
    timestamp: '1d ago',
    unreadCount: 0,
    messages: [
      { id: 'm-10', sender: 'them', text: 'Counting down to your big day! Sending all good vibes.', timestamp: 'Yesterday' }
    ]
  }
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'GROUP_GIFT',
    title: "Sarah's 30th Birthday Group Gift",
    senderName: 'David Kouam',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    timestamp: '20m ago',
    message: 'David started a joint gift pot for Sarah’s Jo Malone perfume & flower basket.',
    unread: true,
    potAmount: '$85 / $150 collected',
  },
  {
    id: 'act-2',
    type: 'INVITE',
    title: "Mama Chantal's 60th Doorstep Surprise",
    senderName: 'Samuel Ndamukong',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: '2h ago',
    message: 'You are invited to join the private celebration live stream & digital card.',
    unread: true,
    eventDate: 'Oct 19 · Douala, Cameroon',
  },
  {
    id: 'act-3',
    type: 'WISH',
    title: 'Warm Cheer & Birthday Note',
    senderName: 'Aisha Bello',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    timestamp: '5h ago',
    message: '“Counting down to your birthday! Ready to send the greatest joy your way! 🥂✨”',
    unread: false,
  },
  {
    id: 'act-4',
    type: 'MEMORY',
    title: 'Memory Vault Contribution',
    senderName: 'Claire Touré',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    timestamp: '1d ago',
    message: 'Claire added 4 photos & an acoustic audio toast to your shared anniversary reel.',
    unread: false,
  },
  {
    id: 'act-5',
    type: 'REMINDER',
    title: 'HBD Concierge Milestone Alert',
    senderName: 'HBD Concierge',
    senderAvatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    timestamp: '2d ago',
    message: 'Company 10-Year milestone is in 29 days. Early booking guarantee ends this Friday.',
    unread: false,
  }
];

export const InboxScreen: React.FC<InboxScreenProps> = ({ onOpenGifts, onOpenPlanner, onOpenSurprisePackage }) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  
  // Navigation mode: 'CHATS' (default list) | 'CHATBOX' (active conversation) | 'ACTIVITY' (invites & pots) | 'SURPRISES' (stealth packages)
  const [viewMode, setViewMode] = useState<'CHATS' | 'CHATBOX' | 'ACTIVITY' | 'SURPRISES'>('CHATS');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const unreadActivityCount = activities.filter(a => a.unread).length;

  const handleOpenChat = (chatId: string) => {
    setActiveChatId(chatId);
    setViewMode('CHATBOX');
    // Clear unread for this chat
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatId) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: messageInput.trim(),
      timestamp: 'Just now'
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
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

  const handleSendCelebrationToast = () => {
    if (!activeChatId) return;
    const toastMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: '🥂 Sent a Celebration Confetti Toast!',
      timestamp: 'Just now',
      isCelebrationAction: true,
      actionBadge: '🎉 Confetti Toast'
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: '🥂 Sent a Celebration Confetti Toast!',
          timestamp: 'Just now',
          messages: [...c.messages, toastMsg]
        };
      }
      return c;
    }));
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE CHATBOX (Individual Chat Room)
  // -------------------------------------------------------------
  if (viewMode === 'CHATBOX' && activeChat) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <KeyboardAvoidingView 
          style={[styles.container, { backgroundColor: colors.bg }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={20}
        >
          {/* Top Chat Header */}
          <View style={[styles.chatHeader, { backgroundColor: colors.card, borderBottomColor: colors.line, paddingTop: topInset + 8 }]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setViewMode('CHATS')}
              activeOpacity={0.7}
            >
              <AppIcon name="arrow-left" size={20} color={colors.purple} />
              <Text style={[styles.backText, { color: colors.purple }]}>Inbox</Text>
            </TouchableOpacity>

            <View style={styles.chatHeaderProfile}>
              <Image source={{ uri: activeChat.avatarUrl }} style={styles.chatHeaderAvatar} />
              <View>
                <Text style={[styles.chatHeaderName, { color: colors.fg }]} numberOfLines={1}>
                  {activeChat.name}
                </Text>
                {activeChat.celebrationBadge ? (
                  <Text style={[styles.chatHeaderBadge, { color: colors.coral }]}>
                    {activeChat.celebrationBadge}
                  </Text>
                ) : (
                  <Text style={[styles.chatHeaderStatus, { color: colors.muted }]}>Active now</Text>
                )}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.giftShortcutBtn, { backgroundColor: colors.goldSoft }]}
              onPress={() => onOpenGifts(activeChat.name)}
              activeOpacity={0.7}
            >
              <AppIcon name="gift" size={17} color="#202124" />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView 
            contentContainerStyle={styles.messagesScroll} 
            showsVerticalScrollIndicator={false}
          >
            {/* Celebration Greeting Banner */}
            <View style={[styles.chatIntroCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <AppIcon name="sparkles" size={20} color={colors.gold} />
              <Text style={[styles.chatIntroTitle, { color: colors.purple }]}>
                {activeChat.isGroup ? 'Group Celebration Room' : `Chat with ${activeChat.name}`}
              </Text>
              <Text style={[styles.chatIntroSub, { color: colors.muted }]}>
                Messages, shared memories & doorstep coordination are protected by HBD Foundation.
              </Text>
            </View>

            {activeChat.messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageRow, 
                    isMe ? styles.messageRowMe : styles.messageRowThem
                  ]}
                >
                  <View style={[
                    styles.messageBubble,
                    isMe ? [styles.messageBubbleMe, { backgroundColor: colors.purple }] : [styles.messageBubbleThem, { backgroundColor: colors.card, borderColor: colors.line }],
                    msg.isCelebrationAction && { backgroundColor: colors.goldSoft, borderColor: colors.gold }
                  ]}>
                    <Text style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : { color: colors.fg },
                      msg.isCelebrationAction && { color: '#202124', fontWeight: '700' }
                    ]}>
                      {msg.text}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      isMe ? styles.messageTimeMe : { color: colors.muted }
                    ]}>
                      {msg.timestamp}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Quick Celebration Actions Bar */}
          <View style={[styles.quickActionsBar, { backgroundColor: colors.card, borderTopColor: colors.line }]}>
            <TouchableOpacity 
              style={[styles.quickActionChip, { backgroundColor: colors.purpleSoft }]}
              onPress={handleSendCelebrationToast}
              activeOpacity={0.7}
            >
              <Text style={[styles.quickActionText, { color: colors.purple }]}>🥂 Send Confetti</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionChip, { backgroundColor: colors.goldSoft }]}
              onPress={() => onOpenGifts(activeChat.name)}
              activeOpacity={0.7}
            >
              <Text style={[styles.quickActionText, { color: '#202124' }]}>🎁 Send Gift Token</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionChip, { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1 }]}
              onPress={() => onOpenPlanner(activeChat.name)}
              activeOpacity={0.7}
            >
              <Text style={[styles.quickActionText, { color: colors.fg }]}>✨ Plan Event</Text>
            </TouchableOpacity>
          </View>

          {/* Message Input Toolbar */}
          <View style={[styles.inputToolbar, { backgroundColor: colors.card, borderTopColor: colors.line }]}>
            <TextInput
              style={[styles.inputField, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
              placeholder="Type a celebration message..."
              placeholderTextColor={colors.muted}
              value={messageInput}
              onChangeText={setMessageInput}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: messageInput.trim() ? colors.purple : colors.line }]}
              onPress={handleSendMessage}
              disabled={!messageInput.trim()}
              activeOpacity={0.7}
            >
              <AppIcon name="send" size={17} color={messageInput.trim() ? '#FFF8EE' : colors.muted} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVITY PAGE (Invites, Pots, Milestone Alerts)
  // -------------------------------------------------------------
  if (viewMode === 'ACTIVITY') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView 
          contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: 120 }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.activityBackRow}
              onPress={() => setViewMode('CHATS')}
              activeOpacity={0.7}
            >
              <AppIcon name="arrow-left" size={18} color={colors.purple} />
              <Text style={[styles.backText, { color: colors.purple }]}>Back to Chats</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 8 }}>
              <Text style={[styles.title, { color: colors.purple }]}>Celebration Activity</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Invitations, group gift pots, milestone alerts & received wishes.
              </Text>
            </View>
          </View>

          {/* Activity Cards List */}
          <View style={styles.activityList}>
            {activities.map((item) => (
              <View 
                key={item.id} 
                style={[styles.activityCard, { backgroundColor: colors.card, borderColor: item.unread ? colors.purple : colors.line }]}
              >
                <View style={styles.activityCardTop}>
                  <Image source={{ uri: item.senderAvatar }} style={styles.activityAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activitySender, { color: colors.fg }]}>{item.senderName}</Text>
                    <Text style={[styles.activityTime, { color: colors.muted }]}>{item.timestamp}</Text>
                  </View>
                  <View style={[styles.activityTypePill, { backgroundColor: colors.purpleSoft }]}>
                    <Text style={[styles.activityTypeText, { color: colors.purple }]}>
                      {item.type.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.activityTitle, { color: colors.purple }]}>{item.title}</Text>
                <Text style={[styles.activityMessage, { color: colors.fg }]}>{item.message}</Text>

                {item.potAmount && (
                  <View style={[styles.potAmountPill, { backgroundColor: colors.goldSoft }]}>
                    <Text style={styles.potAmountText}>💰 {item.potAmount}</Text>
                  </View>
                )}

                {item.eventDate && (
                  <View style={styles.eventDateRow}>
                    <AppIcon name="calendar" size={13} color={colors.purple} />
                    <Text style={[styles.eventDateText, { color: colors.muted }]}>{item.eventDate}</Text>
                  </View>
                )}

                {/* CTAs on Activity Card */}
                <View style={styles.activityCardCtas}>
                  {item.type === 'GROUP_GIFT' && (
                    <TouchableOpacity 
                      style={[styles.ctaButtonPrimary, { backgroundColor: colors.gold }]}
                      onPress={() => Alert.alert('Contributed!', 'Thank you for chipping into the gift pot! 🎁')}
                    >
                      <Text style={[styles.ctaButtonTextPrimary, { color: '#202124' }]}>Chip in $25</Text>
                    </TouchableOpacity>
                  )}

                  {item.type === 'INVITE' && (
                    <TouchableOpacity 
                      style={[styles.ctaButtonPrimary, { backgroundColor: colors.purple }]}
                      onPress={() => Alert.alert('Confirmed!', 'You are RSVPed for this celebration! 🎉')}
                    >
                      <Text style={styles.ctaButtonTextPrimary}>Accept & RSVP</Text>
                    </TouchableOpacity>
                  )}

                  {item.type === 'WISH' && (
                    <TouchableOpacity 
                      style={[styles.ctaButtonPrimary, { backgroundColor: colors.coral }]}
                      onPress={() => Alert.alert('Warm Toast Sent!', 'Your warm toast was sent back! 🥂')}
                    >
                      <Text style={styles.ctaButtonTextPrimary}>Reply with Toast 🥂</Text>
                    </TouchableOpacity>
                  )}

                  {item.type === 'MEMORY' && (
                    <TouchableOpacity 
                      style={[styles.ctaButtonSecondary, { backgroundColor: colors.bg, borderColor: colors.line }]}
                      onPress={() => Alert.alert('Memory Vault', 'Opening media vault...')}
                    >
                      <Text style={[styles.ctaButtonTextSecondary, { color: colors.purple }]}>View Vault 📸</Text>
                    </TouchableOpacity>
                  )}

                  {item.type === 'REMINDER' && (
                    <TouchableOpacity 
                      style={[styles.ctaButtonPrimary, { backgroundColor: colors.purple }]}
                      onPress={() => onOpenPlanner(item.title)}
                    >
                      <Text style={styles.ctaButtonTextPrimary}>Plan Celebration ✨</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // VIEW: SURPRISES (Stealth Packages, War Rooms & Reels)
  // -------------------------------------------------------------
  if (viewMode === 'SURPRISES') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView 
          contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: 120 }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.activityBackRow}
              onPress={() => setViewMode('CHATS')}
              activeOpacity={0.7}
            >
              <AppIcon name="arrow-left" size={18} color={colors.purple} />
              <Text style={[styles.backText, { color: colors.purple }]}>Back to Chats</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.title, { color: colors.purple }]}>Surprise Packages</Text>
                <View style={[styles.stealthPill, { backgroundColor: colors.coralSoft }]}>
                  <Text style={[styles.stealthPillText, { color: colors.coral }]}>🔒 Stealth Active</Text>
                </View>
              </View>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Secret planning rooms, group registries, and tribute compilation reels. Hidden from celebrants until delivery.
              </Text>
            </View>
          </View>

          {/* Surprise Packages Cards List */}
          <View style={styles.activityList}>
            {mockSurprisePackages.map((pkg) => (
              <View 
                key={pkg.id} 
                style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.line }]}
              >
                <View style={styles.activityCardTop}>
                  <Image source={{ uri: pkg.celebrantAvatar }} style={styles.activityAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activitySender, { color: colors.fg }]}>{pkg.title}</Text>
                    <Text style={[styles.activityTime, { color: colors.muted }]}>
                      Celebrant: {pkg.celebrantName} • Due: {pkg.celebrantBirthDate}
                    </Text>
                  </View>
                  <View style={[styles.activityTypePill, { backgroundColor: colors.coralSoft }]}>
                    <Text style={[styles.activityTypeText, { color: colors.coral }]}>
                      {pkg.status}
                    </Text>
                  </View>
                </View>

                <View style={[styles.stealthBadgeBox, { backgroundColor: colors.purpleSoft }]}>
                  <Text style={[styles.stealthBadgeText, { color: colors.purple }]}>
                    💰 ${pkg.currentPooledAmount} pooled • {pkg.contributions.length} tributes & gifts • {pkg.compilationReel?.compiledItems.length || 0} reel scenes
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[styles.openSurpriseRoomBtn, { backgroundColor: colors.coral }]}
                  onPress={() => onOpenSurprisePackage && onOpenSurprisePackage(pkg.celebrantName)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openSurpriseRoomBtnText}>
                    Enter Secret War Room & Reel 🎁
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: CHATS LIST (Default Inbox Screen)
  // -------------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView 
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: 120 }]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Top Header with Surprises & Activity Buttons */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={[styles.title, { color: colors.purple }]}>Inbox</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Chats, circles & celebration coordination.
              </Text>
            </View>

            {/* Header Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <TouchableOpacity 
                style={[styles.activityHeaderBtn, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}
                onPress={() => setViewMode('SURPRISES')}
                activeOpacity={0.7}
              >
                <View style={styles.activityIconWrap}>
                  <AppIcon name="gift" size={15} color={colors.coral} />
                </View>
                <Text style={[styles.activityBtnLabel, { color: colors.coral }]}>
                  Surprises
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.activityHeaderBtn, { backgroundColor: colors.card, borderColor: colors.line }]}
                onPress={() => setViewMode('ACTIVITY')}
                activeOpacity={0.7}
              >
                <View style={styles.activityIconWrap}>
                  <AppIcon name="bell" size={16} color={colors.purple} />
                  {unreadActivityCount > 0 && (
                    <View style={[styles.unreadBadgeDot, { backgroundColor: colors.coral }]} />
                  )}
                </View>
                <Text style={[styles.activityBtnLabel, { color: colors.purple }]}>
                  Activity
                </Text>
                {unreadActivityCount > 0 && (
                  <View style={[styles.unreadCountPill, { backgroundColor: colors.coral }]}>
                    <Text style={styles.unreadCountText}>{unreadActivityCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Box */}
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <AppIcon name="search" size={16} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.fg }]}
              placeholder="Search conversations, friends, circles..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Chats Section */}
        <View style={styles.chatListSection}>
          <Text style={[styles.sectionHeading, { color: colors.muted }]}>
            RECENT CONVERSATIONS ({filteredChats.length})
          </Text>

          {filteredChats.map((chat) => (
            <TouchableOpacity 
              key={chat.id}
              style={[
                styles.chatItemCard, 
                { backgroundColor: colors.card, borderColor: chat.unreadCount > 0 ? colors.purple : colors.line }
              ]}
              onPress={() => handleOpenChat(chat.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chatAvatarWrap}>
                <Image source={{ uri: chat.avatarUrl }} style={styles.chatAvatar} />
                {chat.unreadCount > 0 && (
                  <View style={[styles.chatAvatarDot, { backgroundColor: colors.coral }]} />
                )}
              </View>

              <View style={styles.chatItemInfo}>
                <View style={styles.chatItemTop}>
                  <Text style={[styles.chatName, { color: colors.fg }]} numberOfLines={1}>
                    {chat.name}
                  </Text>
                  <Text style={[styles.chatTimestamp, { color: colors.muted }]}>
                    {chat.timestamp}
                  </Text>
                </View>

                {chat.celebrationBadge && (
                  <Text style={[styles.chatBadgeText, { color: colors.coral }]} numberOfLines={1}>
                    {chat.celebrationBadge}
                  </Text>
                )}

                <Text 
                  style={[
                    styles.chatLastMessage, 
                    { color: chat.unreadCount > 0 ? colors.fg : colors.muted },
                    chat.unreadCount > 0 && styles.chatLastMessageUnread
                  ]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>

              {chat.unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.coral }]}>
                  <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  activityHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  activityIconWrap: {
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activityBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  unreadCountPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  stealthPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  stealthPillText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  stealthBadgeBox: {
    padding: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  stealthBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  openSurpriseRoomBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  openSurpriseRoomBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  chatListSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  chatItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chatAvatarWrap: {
    position: 'relative',
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatAvatarDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatItemInfo: {
    flex: 1,
  },
  chatItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  chatName: {
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
  },
  chatTimestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  chatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  chatLastMessage: {
    fontSize: 12.5,
    fontFamily: 'Inter-Regular',
  },
  chatLastMessageUnread: {
    fontWeight: '700',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  // Chatbox styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chatHeaderProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginLeft: 6,
  },
  chatHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatHeaderName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
  },
  chatHeaderBadge: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  chatHeaderStatus: {
    fontSize: 11,
  },
  giftShortcutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesScroll: {
    padding: 16,
    gap: 12,
  },
  chatIntroCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
  },
  chatIntroTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  chatIntroSub: {
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleMe: {
    borderBottomRightRadius: 4,
  },
  messageBubbleThem: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  messageTextMe: {
    color: '#FFF8EE',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255, 248, 238, 0.7)',
  },
  quickActionsBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  quickActionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quickActionText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13,
    borderWidth: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Activity View styles
  activityBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  activityCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  activitySender: {
    fontSize: 13,
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 10.5,
  },
  activityTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activityTypeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  activityMessage: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  potAmountPill: {
    padding: 8,
    borderRadius: 8,
  },
  potAmountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#202124',
  },
  eventDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDateText: {
    fontSize: 11.5,
  },
  activityCardCtas: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  ctaButtonPrimary: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonTextPrimary: {
    color: '#FFF8EE',
    fontSize: 12,
    fontWeight: '800',
  },
  ctaButtonSecondary: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  ctaButtonTextSecondary: {
    fontSize: 12,
    fontWeight: '800',
  },
});
