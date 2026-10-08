import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator 
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

import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { DatesScreen } from './src/screens/DatesScreen';
import { InboxScreen } from './src/screens/InboxScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PlannerModalScreen } from './src/screens/PlannerModalScreen';
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

type BottomTab = 'home' | 'gifts' | 'hbdays' | 'inbox' | 'profile';

function MainApp() {
  const { colors, isDark } = useAppTheme();
  const [currentTab, setCurrentTab] = useState<BottomTab>('home');
  const [reels, setReels] = useState<ReelPost[]>(INITIAL_REELS);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerCelebrant, setPlannerCelebrant] = useState('');
  const [selectedRecipientForGifts, setSelectedRecipientForGifts] = useState<string | undefined>(undefined);

  const handleCheer = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, cheerCount: r.cheerCount + 1, isCheered: true } : r));
  };

  const handleOpenPlanner = (celebrant: string = '') => {
    setPlannerCelebrant(celebrant);
    setIsPlannerOpen(true);
  };

  const handleOpenGiftsForPerson = (personName: string) => {
    setSelectedRecipientForGifts(personName);
    setCurrentTab('gifts');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Active Screen View */}
      <View style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomeScreen
            reels={reels}
            onCheerReel={handleCheer}
            onOpenPlanner={handleOpenPlanner}
            onOpenGifts={handleOpenGiftsForPerson}
            onNavigateToInbox={() => setCurrentTab('inbox')}
          />
        )}

        {currentTab === 'gifts' && (
          <PackagesScreen 
            preselectedRecipient={selectedRecipientForGifts}
            onSelectPackage={(title) => handleOpenPlanner(title)}
          />
        )}

        {currentTab === 'hbdays' && (
          <DatesScreen 
            onPlanCelebration={(item) => handleOpenPlanner(item ? item.celebrant : '')}
            onOpenGifts={handleOpenGiftsForPerson}
          />
        )}

        {currentTab === 'inbox' && (
          <InboxScreen
            onOpenGifts={handleOpenGiftsForPerson}
            onOpenPlanner={handleOpenPlanner}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen 
            onOpenPlanner={() => handleOpenPlanner('')}
          />
        )}
      </View>

      {/* 5-Tab Bottom Navigation: Home | Gifts | HBDays | Inbox | Profile */}
      <SafeAreaView style={[
        styles.bottomNav, 
        { 
          backgroundColor: colors.bottomNavBg, 
          borderTopColor: colors.bottomNavBorder 
        }
      ]}>
        {/* Tab 1: Home */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('home')}
          activeOpacity={0.7}
        >
          <Feather 
            name="home" 
            size={21} 
            color={currentTab === 'home' ? colors.purple : colors.muted} 
          />
          <Text style={[
            styles.navText, 
            { color: currentTab === 'home' ? colors.purple : colors.muted },
            currentTab === 'home' && styles.navTextActive
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Gifts */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('gifts')}
          activeOpacity={0.7}
        >
          <Feather 
            name="gift" 
            size={21} 
            color={currentTab === 'gifts' ? colors.purple : colors.muted} 
          />
          <Text style={[
            styles.navText, 
            { color: currentTab === 'gifts' ? colors.purple : colors.muted },
            currentTab === 'gifts' && styles.navTextActive
          ]}>
            Gifts
          </Text>
        </TouchableOpacity>

        {/* Tab 3: HBDays */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('hbdays')}
          activeOpacity={0.7}
        >
          <Feather 
            name="calendar" 
            size={21} 
            color={currentTab === 'hbdays' ? colors.purple : colors.muted} 
          />
          <Text style={[
            styles.navText, 
            { color: currentTab === 'hbdays' ? colors.purple : colors.muted },
            currentTab === 'hbdays' && styles.navTextActive
          ]}>
            HBDays
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Inbox */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('inbox')}
          activeOpacity={0.7}
        >
          <View style={styles.inboxIconWrap}>
            <Feather 
              name="message-square" 
              size={21} 
              color={currentTab === 'inbox' ? colors.purple : colors.muted} 
            />
            {/* Unread activity dot */}
            <View style={[styles.unreadDot, { backgroundColor: colors.coral }]} />
          </View>
          <Text style={[
            styles.navText, 
            { color: currentTab === 'inbox' ? colors.purple : colors.muted },
            currentTab === 'inbox' && styles.navTextActive
          ]}>
            Inbox
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setCurrentTab('profile')}
          activeOpacity={0.7}
        >
          <Feather 
            name="user" 
            size={21} 
            color={currentTab === 'profile' ? colors.purple : colors.muted} 
          />
          <Text style={[
            styles.navText, 
            { color: currentTab === 'profile' ? colors.purple : colors.muted },
            currentTab === 'profile' && styles.navTextActive
          ]}>
            Profile
          </Text>
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

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B942" />
        <Text style={styles.loadingText}>HBD Foundation</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#5B2A86',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#F4B942',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomNav: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 54,
  },
  inboxIconWrap: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  navText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  navTextActive: {
    fontFamily: 'Inter-Bold',
  },
});
