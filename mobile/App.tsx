import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { 
  useFonts, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold, 
  Poppins_800ExtraBold 
} from '@expo-google-fonts/poppins';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';

import { CelebrationReelScreen } from './src/screens/CelebrationReelScreen';
import { DatesScreen } from './src/screens/DatesScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PlannerModalScreen } from './src/screens/PlannerModalScreen';
import { HBD_THEME } from './src/theme';
import type { ReelPost } from '../shared/types';

const INITIAL_REELS: ReelPost[] = [
  {
    id: 'm-reel-1',
    category: 'BIRTHDAY',
    celebrationBadge: '🌍 London → Douala Surprise',
    user: {
      id: 'u-1',
      handle: 'samuel_nd',
      fullName: 'Samuel Ndamukong',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'London, UK',
      followersCount: 1420,
      celebrationsCount: 8
    },
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Mum turns 60 today! Coordinated the cake and live acoustic choir right at her doorstep in Bonapriso! Her smile is everything. ❤️✨',
    audioTrack: 'Original Joyful African Horns',
    cheerCount: 3840,
    commentCount: 248,
    shareCount: 112,
    createdAt: '2h ago'
  },
  {
    id: 'm-reel-2',
    category: 'BEGINNING',
    celebrationBadge: '🚀 Startup Launch Day',
    user: {
      id: 'u-2',
      handle: 'aisha_tech',
      fullName: 'Aisha Bello',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      location: 'Lagos, Nigeria',
      followersCount: 4200,
      celebrationsCount: 12
    },
    mediaUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Today we launched PaySeed! After 14 months of writing code, our 1st transaction processed at 9:14 AM. Birthdays aren’t just for humans — celebrate every beginning! 🚀🌱',
    audioTrack: 'Triumphant Piano & Synths',
    cheerCount: 5120,
    commentCount: 412,
    shareCount: 389,
    createdAt: '5h ago'
  },
  {
    id: 'm-reel-3',
    category: 'MILESTONE',
    celebrationBadge: '💍 20th Wedding Milestone',
    user: {
      id: 'u-3',
      handle: 'amina_tariq',
      fullName: 'Amina & Tariq',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      location: 'Toronto, Canada',
      followersCount: 890,
      celebrationsCount: 5
    },
    mediaUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Two decades, three cities, five children and countless smiles. Love grows stronger with every chapter celebrated together. 🥂✨',
    audioTrack: 'Acoustic Guitar Romance',
    cheerCount: 2980,
    commentCount: 180,
    shareCount: 94,
    createdAt: '1d ago'
  }
];

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const [currentTab, setCurrentTab] = useState<'reel' | 'dates' | 'packages' | 'friends' | 'profile'>('reel');
  const [reels, setReels] = useState<ReelPost[]>(INITIAL_REELS);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerCelebrant, setPlannerCelebrant] = useState('');
  const [selectedFriendForGifts, setSelectedFriendForGifts] = useState<string | undefined>(undefined);

  const handleCheer = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, cheerCount: r.cheerCount + 1, isCheered: true } : r));
  };

  const handleOpenPlanner = (celebrant: string = '') => {
    setPlannerCelebrant(celebrant);
    setIsPlannerOpen(true);
  };

  const handleOpenGiftsForPerson = (personName: string) => {
    setSelectedFriendForGifts(personName);
    setCurrentTab('packages');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={HBD_THEME.colors.gold} />
        <Text style={styles.loadingText}>HBD Foundation</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={currentTab === 'reel' ? 'light' : 'dark'} />
      
      {/* Top Header Bar (when not in full immersion reel) */}
      {currentTab !== 'reel' && (
        <SafeAreaView style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>HBD</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>HBD Foundation</Text>
              <Text style={styles.brandSlogan}>Celebrate What Matters</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.profileAvatarBtn, currentTab === 'profile' && styles.profileAvatarBtnActive]}
            onPress={() => setCurrentTab('profile')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.headerAvatar}
            />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* Screen Views */}
      <View style={{ flex: 1 }}>
        {currentTab === 'reel' && (
          <CelebrationReelScreen 
            reels={reels} 
            onCheer={handleCheer}
            onOpenPlanner={(reel) => handleOpenPlanner(reel.user.fullName)}
            onOpenGifts={handleOpenGiftsForPerson}
          />
        )}

        {currentTab === 'dates' && (
          <DatesScreen 
            onPlanCelebration={(item) => handleOpenPlanner(item ? item.celebrant : '')}
            onOpenGifts={handleOpenGiftsForPerson}
          />
        )}

        {currentTab === 'packages' && (
          <PackagesScreen 
            preselectedRecipient={selectedFriendForGifts}
            onSelectPackage={(title) => handleOpenPlanner(title)}
          />
        )}

        {currentTab === 'friends' && (
          <FriendsScreen 
            onOpenGiftsForFriend={handleOpenGiftsForPerson}
            onOpenPlannerForFriend={(name) => handleOpenPlanner(name)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen 
            onOpenPlanner={() => handleOpenPlanner('')}
            onNavigateToFriends={() => setCurrentTab('friends')}
          />
        )}
      </View>

      {/* Bottom Tab Navigation */}
      <SafeAreaView style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('reel')}>
          <Feather 
            name="film" 
            size={20} 
            color={currentTab === 'reel' ? HBD_THEME.colors.purple : '#8A8294'} 
          />
          <Text style={[styles.navText, currentTab === 'reel' && styles.navTextActive]}>Moments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('dates')}>
          <Feather 
            name="calendar" 
            size={20} 
            color={currentTab === 'dates' ? HBD_THEME.colors.purple : '#8A8294'} 
          />
          <Text style={[styles.navText, currentTab === 'dates' && styles.navTextActive]}>HBDays</Text>
        </TouchableOpacity>

        {/* Center Floating Action Button (+) */}
        <TouchableOpacity 
          style={styles.floatingCenterBtn}
          onPress={() => handleOpenPlanner('')}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={24} color={HBD_THEME.colors.charcoal} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('packages')}>
          <Feather 
            name="gift" 
            size={20} 
            color={currentTab === 'packages' ? HBD_THEME.colors.purple : '#8A8294'} 
          />
          <Text style={[styles.navText, currentTab === 'packages' && styles.navTextActive]}>Gifts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('friends')}>
          <Feather 
            name="users" 
            size={20} 
            color={currentTab === 'friends' ? HBD_THEME.colors.purple : '#8A8294'} 
          />
          <Text style={[styles.navText, currentTab === 'friends' && styles.navTextActive]}>Circle</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Celebration Concierge Planner Modal */}
      <PlannerModalScreen
        visible={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        initialCelebrant={plannerCelebrant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A080C',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: HBD_THEME.colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: HBD_THEME.colors.gold,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: HBD_THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    backgroundColor: HBD_THEME.colors.purple,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: HBD_THEME.colors.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    lineHeight: 18,
  },
  brandSlogan: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  profileAvatarBtn: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileAvatarBtnActive: {
    borderColor: HBD_THEME.colors.purple,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: HBD_THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  navText: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: '#8A8294',
    marginTop: 2,
  },
  navTextActive: {
    color: HBD_THEME.colors.purple,
    fontFamily: HBD_THEME.typography.bodyBold,
  },
  floatingCenterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: HBD_THEME.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -22,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
