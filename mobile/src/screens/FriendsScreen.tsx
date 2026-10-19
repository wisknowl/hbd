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
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';
import { ScreenLayout } from '../components/ScreenLayout';

interface FriendsScreenProps {
  onOpenGiftsForFriend: (friendName: string) => void;
  onOpenPlannerForFriend: (friendName: string) => void;
}

interface FriendProfile {
  id: string;
  fullName: string;
  handle: string;
  avatarUrl: string;
  location: string;
  birthday: string;
  daysLeft: number;
  interests: string[];
  status: 'FRIEND' | 'REQUEST_RECEIVED' | 'DISCOVERABLE';
}

const INITIAL_PEOPLE: FriendProfile[] = [
  {
    id: 'u-sarah',
    fullName: 'Sarah Johnson',
    handle: 'sarah.j',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'London, UK',
    birthday: 'Oct 24',
    daysLeft: 16,
    interests: ['Perfume', 'Jewelry', 'Books', 'Coffee'],
    status: 'FRIEND'
  },
  {
    id: 'u-aisha',
    fullName: 'Aisha Bello',
    handle: 'aisha_tech',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    location: 'Lagos, Nigeria',
    birthday: 'Nov 2',
    daysLeft: 25,
    interests: ['Tech', 'Books', 'Skincare'],
    status: 'FRIEND'
  },
  {
    id: 'u-david',
    fullName: 'David Kouam',
    handle: 'davidk',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Toronto, Canada',
    birthday: 'Dec 4',
    daysLeft: 57,
    interests: ['Gaming', 'Tech', 'Fitness', 'Sneakers'],
    status: 'FRIEND'
  },
  {
    id: 'u-claire',
    fullName: 'Claire Touré',
    handle: 'claire_t',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location: 'Abidjan, Côte d’Ivoire',
    birthday: 'Oct 30',
    daysLeft: 22,
    interests: ['Art', 'Fashion', 'Music'],
    status: 'REQUEST_RECEIVED'
  },
  {
    id: 'u-marcus',
    fullName: 'Marcus Sterling',
    handle: 'marcus_s',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    location: 'New York, USA',
    birthday: 'Jan 15',
    daysLeft: 99,
    interests: ['Travel', 'Coffee', 'Photography'],
    status: 'DISCOVERABLE'
  }
];

export const FriendsScreen: React.FC<FriendsScreenProps> = ({ 
  onOpenGiftsForFriend,
  onOpenPlannerForFriend
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const [people, setPeople] = useState<FriendProfile[]>(INITIAL_PEOPLE);
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'REQUESTS' | 'FIND'>('FRIENDS');
  const [searchQuery, setSearchQuery] = useState('');

  const friendsList = people.filter(p => p.status === 'FRIEND');
  const requestsList = people.filter(p => p.status === 'REQUEST_RECEIVED');
  const discoverList = people.filter(p => 
    p.status === 'DISCOVERABLE' && 
    (p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAcceptRequest = (id: string, name: string) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, status: 'FRIEND' } : p));
    Alert.alert('Connected!', `${name} is now part of your Celebration Circle.`);
  };

  const handleDeclineRequest = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const handleAddFriend = (id: string, name: string) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, status: 'FRIEND' } : p));
    Alert.alert('Request Sent', `You added ${name} to your Circle.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: HBD_THEME.colors.background }}>
      <ScrollView 
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 10, paddingBottom: 120 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.kickerPill}>
            <Feather name="users" size={12} color={HBD_THEME.colors.purple} />
            <Text style={styles.kickerText}>Connections & Circle</Text>
          </View>
          <Text style={styles.title}>Your Celebration Circle</Text>
          <Text style={styles.subtitle}>
            Friends who exchange birthday dates, wishlists, and milestone surprises.
          </Text>

          {/* Tab Navigation */}
          <View style={styles.tabToggle}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'FRIENDS' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('FRIENDS')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'FRIENDS' && styles.toggleBtnTextActive]}>
                My Circle ({friendsList.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'REQUESTS' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('REQUESTS')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'REQUESTS' && styles.toggleBtnTextActive]}>
                Requests ({requestsList.length})
              </Text>
              {requestsList.length > 0 && <View style={styles.badgeDot} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'FIND' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('FIND')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'FIND' && styles.toggleBtnTextActive]}>
                Find People
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab 1: My Circle */}
        {activeTab === 'FRIENDS' && (
          <View style={styles.listCol}>
            {friendsList.map(friend => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendTopRow}>
                  <Image source={{ uri: friend.avatarUrl }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>{friend.fullName}</Text>
                    <Text style={styles.friendHandle}>@{friend.handle}</Text>
                    <View style={styles.locationRow}>
                      <Feather name="map-pin" size={11} color={HBD_THEME.colors.muted} />
                      <Text style={styles.locationText}>{friend.location}</Text>
                    </View>
                  </View>

                  {/* Birthday Pill */}
                  <View style={styles.birthdayPill}>
                    <Text style={styles.birthdayDate}>{friend.birthday}</Text>
                    <Text style={styles.birthdayDays}>In {friend.daysLeft}d</Text>
                  </View>
                </View>

                {/* Wishlist / Interests Chips */}
                <View style={styles.interestsSection}>
                  <Text style={styles.interestsLabel}>Loves:</Text>
                  <View style={styles.chipsRow}>
                    {friend.interests.map((tag, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.giftActionBtn}
                    onPress={() => onOpenGiftsForFriend(friend.fullName)}
                  >
                    <Feather name="gift" size={14} color={HBD_THEME.colors.purple} />
                    <Text style={styles.giftActionText}>Gift Ideas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.planActionBtn}
                    onPress={() => onOpenPlannerForFriend(friend.fullName)}
                  >
                    <Feather name="star" size={14} color="#FFFFFF" />
                    <Text style={styles.planActionText}>Plan Surprise</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 2: Requests */}
        {activeTab === 'REQUESTS' && (
          <View style={styles.listCol}>
            {requestsList.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={40} color={HBD_THEME.colors.gold} />
                <Text style={styles.emptyTitle}>All Caught Up</Text>
                <Text style={styles.emptySubtitle}>No pending friend requests right now.</Text>
              </View>
            ) : (
              requestsList.map(req => (
                <View key={req.id} style={styles.requestCard}>
                  <View style={styles.friendTopRow}>
                    <Image source={{ uri: req.avatarUrl }} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.friendName}>{req.fullName}</Text>
                      <Text style={styles.friendHandle}>@{req.handle}</Text>
                      <Text style={styles.locationText}>{req.location} • Birthday: {req.birthday}</Text>
                    </View>
                  </View>

                  <View style={styles.requestActions}>
                    <TouchableOpacity 
                      style={styles.declineBtn}
                      onPress={() => handleDeclineRequest(req.id)}
                    >
                      <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.acceptBtn}
                      onPress={() => handleAcceptRequest(req.id, req.fullName)}
                    >
                      <Feather name="check" size={14} color="#FFFFFF" />
                      <Text style={styles.acceptBtnText}>Accept into Circle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Tab 3: Find People */}
        {activeTab === 'FIND' && (
          <View style={styles.listCol}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Feather name="search" size={16} color={HBD_THEME.colors.muted} />
              <TextInput 
                placeholder="Search by name or @handle..."
                placeholderTextColor={HBD_THEME.colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {discoverList.map(person => (
              <View key={person.id} style={styles.discoverCard}>
                <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{person.fullName}</Text>
                  <Text style={styles.friendHandle}>@{person.handle}</Text>
                  <Text style={styles.locationText}>{person.location}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addBtn}
                  onPress={() => handleAddFriend(person.id, person.fullName)}
                >
                  <Feather name="user-plus" size={14} color={HBD_THEME.colors.charcoal} />
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HBD_THEME.colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  kickerPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
    marginBottom: 10,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
    lineHeight: 19,
    marginBottom: 16,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: HBD_THEME.borderRadius.pill,
    position: 'relative',
  },
  toggleBtnActive: {
    backgroundColor: HBD_THEME.colors.purple,
  },
  toggleBtnText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: HBD_THEME.colors.muted,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: HBD_THEME.typography.headingBold,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: HBD_THEME.colors.coral,
    marginLeft: 4,
  },
  listCol: {
    gap: 14,
  },
  friendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 16,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  friendTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: HBD_THEME.colors.gold,
  },
  friendName: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.charcoal,
  },
  friendHandle: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyRegular,
    color: HBD_THEME.colors.muted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  birthdayPill: {
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: HBD_THEME.borderRadius.sm,
    alignItems: 'center',
  },
  birthdayDate: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.purple,
  },
  birthdayDays: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.purple,
  },
  interestsSection: {
    backgroundColor: '#FAF5ED',
    padding: 10,
    borderRadius: HBD_THEME.borderRadius.sm,
    marginBottom: 12,
  },
  interestsLabel: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  chipText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.charcoal,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4ECE1',
    paddingTop: 12,
  },
  giftActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 9,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  giftActionText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: HBD_THEME.colors.purple,
  },
  planActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purple,
    paddingVertical: 9,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  planActionText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: '#FFFFFF',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 16,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.muted,
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purple,
    paddingVertical: 8,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  acceptBtnText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.charcoal,
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.charcoal,
  },
  discoverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: HBD_THEME.colors.gold,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.charcoal,
  },
});
