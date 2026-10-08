import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

interface InboxScreenProps {
  onOpenGifts: (recipient: string) => void;
  onOpenPlanner: (celebrant?: string) => void;
}

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
  eventDate?: string;
}

const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'inbox-1',
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
    id: 'inbox-2',
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
    id: 'inbox-3',
    type: 'WISH',
    title: 'Warm Cheer & Birthday Note',
    senderName: 'Aisha Bello',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    timestamp: '5h ago',
    message: '“Counting down to your birthday! Ready to send the greatest joy your way! 🥂✨”',
    unread: false,
  },
  {
    id: 'inbox-4',
    type: 'MEMORY',
    title: 'Memory Vault Contribution',
    senderName: 'Claire Touré',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    timestamp: '1d ago',
    message: 'Claire added 4 photos & an acoustic audio toast to your shared anniversary reel.',
    unread: false,
  },
  {
    id: 'inbox-5',
    type: 'REMINDER',
    title: 'HBD Concierge Milestone Alert',
    senderName: 'HBD Concierge',
    senderAvatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80',
    timestamp: '2d ago',
    message: 'Company 10-Year milestone is in 29 days. Early booking guarantee ends this Friday.',
    unread: false,
  }
];

export const InboxScreen: React.FC<InboxScreenProps> = ({ onOpenGifts, onOpenPlanner }) => {
  const { colors } = useAppTheme();
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(INITIAL_INBOX);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTION' | 'WISHES'>('ALL');

  const filteredItems = inboxItems.filter(item => {
    if (activeFilter === 'ACTION') return item.type === 'GROUP_GIFT' || item.type === 'INVITE';
    if (activeFilter === 'WISHES') return item.type === 'WISH' || item.type === 'MEMORY';
    return true;
  });

  const handleContribute = (item: InboxItem) => {
    Alert.alert(
      'Group Gift Pot',
      `Contribute $25 to ${item.title}? HBD will orchestrate the gift delivery to Sarah.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Contribute $25', 
          onPress: () => {
            Alert.alert('Contribution Confirmed! 🎁', 'You joined the group celebration pot.');
            setInboxItems(prev => prev.map(i => i.id === item.id ? { ...i, unread: false } : i));
          }
        }
      ]
    );
  };

  const handleRSVP = (item: InboxItem, accepted: boolean) => {
    Alert.alert(
      accepted ? 'RSVP Confirmed 🎉' : 'Declined',
      accepted ? 'You are confirmed for the celebration!' : 'Invitation updated.'
    );
    setInboxItems(prev => prev.map(i => i.id === item.id ? { ...i, unread: false } : i));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.kickerPill, { backgroundColor: colors.purpleSoft }]}>
            <Feather name="message-square" size={12} color={colors.purple} />
            <Text style={[styles.kickerText, { color: colors.purple }]}>Action & Communication</Text>
          </View>
          <Text style={[styles.title, { color: colors.purple }]}>Celebration Inbox</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Invites, group gift pots, wishes received & milestone actions.
          </Text>

          {/* Filter Pills */}
          <View style={[styles.filterRow, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'ALL' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveFilter('ALL')}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'ALL' ? styles.filterBtnTextActive : { color: colors.muted }]}>
                All ({inboxItems.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'ACTION' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveFilter('ACTION')}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'ACTION' ? styles.filterBtnTextActive : { color: colors.muted }]}>
                Pots & Invites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterBtn, activeFilter === 'WISHES' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveFilter('WISHES')}
            >
              <Text style={[styles.filterBtnText, activeFilter === 'WISHES' ? styles.filterBtnTextActive : { color: colors.muted }]}>
                Wishes & Memories
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List of Inbox Items */}
        <View style={styles.listCol}>
          {filteredItems.map(item => (
            <View 
              key={item.id} 
              style={[
                styles.card, 
                { backgroundColor: colors.card, borderColor: item.unread ? colors.purple : colors.line }
              ]}
            >
              <View style={styles.cardTopRow}>
                <Image source={{ uri: item.senderAvatar }} style={[styles.avatar, { borderColor: colors.gold }]} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.senderName, { color: colors.fg }]}>{item.senderName}</Text>
                    <Text style={[styles.timestamp, { color: colors.muted }]}>{item.timestamp}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.purple }]}>{item.title}</Text>
                </View>
              </View>

              <Text style={[styles.messageText, { color: colors.fg }]}>{item.message}</Text>

              {/* Extra Meta (Pot progress or Event Date) */}
              {item.potAmount && (
                <View style={[styles.potBanner, { backgroundColor: colors.purpleSoft }]}>
                  <Feather name="gift" size={14} color={colors.purple} />
                  <Text style={[styles.potText, { color: colors.purple }]}>{item.potAmount}</Text>
                </View>
              )}

              {item.eventDate && (
                <View style={[styles.potBanner, { backgroundColor: colors.goldSoft }]}>
                  <Feather name="calendar" size={14} color={colors.gold} />
                  <Text style={[styles.potText, { color: colors.fg }]}>{item.eventDate}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {item.type === 'GROUP_GIFT' && (
                  <TouchableOpacity 
                    style={[styles.actionBtnPrimary, { backgroundColor: colors.gold }]}
                    onPress={() => handleContribute(item)}
                  >
                    <Text style={[styles.actionBtnPrimaryText, { color: '#1A1A1A' }]}>Contribute $25</Text>
                  </TouchableOpacity>
                )}

                {item.type === 'INVITE' && (
                  <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
                    <TouchableOpacity 
                      style={[styles.actionBtnOutline, { borderColor: colors.line }]}
                      onPress={() => handleRSVP(item, false)}
                    >
                      <Text style={[styles.actionBtnOutlineText, { color: colors.muted }]}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtnPrimary, { backgroundColor: colors.purple, flex: 2 }]}
                      onPress={() => handleRSVP(item, true)}
                    >
                      <Text style={[styles.actionBtnPrimaryText, { color: '#FFFFFF' }]}>RSVP Yes 🎉</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.type === 'WISH' && (
                  <TouchableOpacity 
                    style={[styles.actionBtnPrimary, { backgroundColor: colors.purpleSoft }]}
                    onPress={() => Alert.alert('Sent!', 'Your thank you cheer was delivered.')}
                  >
                    <Text style={[styles.actionBtnPrimaryText, { color: colors.purple }]}>Send Thanks ❤️</Text>
                  </TouchableOpacity>
                )}

                {item.type === 'REMINDER' && (
                  <TouchableOpacity 
                    style={[styles.actionBtnPrimary, { backgroundColor: colors.purple }]}
                    onPress={() => onOpenPlanner('Kaba Technologies 10th')}
                  >
                    <Text style={[styles.actionBtnPrimaryText, { color: '#FFFFFF' }]}>Plan with Specialist</Text>
                  </TouchableOpacity>
                )}

                {item.type === 'MEMORY' && (
                  <TouchableOpacity 
                    style={[styles.actionBtnPrimary, { backgroundColor: colors.purpleSoft }]}
                    onPress={() => Alert.alert('Opening Memory Vault', 'Loading photos and audio toasts...')}
                  >
                    <Text style={[styles.actionBtnPrimaryText, { color: colors.purple }]}>Open Memory Reel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  kickerPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 8,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  listCol: {
    gap: 14,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#5B2A86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
  },
  senderName: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
  },
  messageText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 10,
  },
  potBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  potText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  actionBtnOutline: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});
