import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { CelebrationReelScreen } from './src/screens/CelebrationReelScreen';
import { DatesScreen } from './src/screens/DatesScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { MemoryVaultScreen } from './src/screens/MemoryVaultScreen';
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
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'reel' | 'dates' | 'packages' | 'vault'>('reel');
  const [reels, setReels] = useState<ReelPost[]>(INITIAL_REELS);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerCelebrant, setPlannerCelebrant] = useState('');

  const handleCheer = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, cheerCount: r.cheerCount + 1, isCheered: true } : r));
  };

  const handleOpenPlanner = (celebrant: string = '') => {
    setPlannerCelebrant(celebrant);
    setIsPlannerOpen(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={currentTab === 'reel' ? 'light' : 'dark'} />
      
      {/* Active Screen View */}
      <View style={{ flex: 1 }}>
        {currentTab === 'reel' && (
          <CelebrationReelScreen 
            reels={reels} 
            onCheer={handleCheer}
            onOpenPlanner={(reel) => handleOpenPlanner(reel.user.fullName)}
          />
        )}

        {currentTab === 'dates' && (
          <DatesScreen 
            onPlanCelebration={(item) => handleOpenPlanner(item ? item.celebrant : '')}
          />
        )}

        {currentTab === 'packages' && (
          <PackagesScreen 
            onSelectPackage={(title) => handleOpenPlanner(title)}
          />
        )}

        {currentTab === 'vault' && (
          <MemoryVaultScreen />
        )}
      </View>

      {/* Bottom Tab Navigation matching Brand Guide Mobile View */}
      <SafeAreaView style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('reel')}>
          <Feather 
            name="home" 
            size={20} 
            color={currentTab === 'reel' ? HBD_THEME.colors.purple : '#8a8294'} 
          />
          <Text style={[styles.navText, currentTab === 'reel' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('dates')}>
          <Feather 
            name="calendar" 
            size={20} 
            color={currentTab === 'dates' ? HBD_THEME.colors.purple : '#8a8294'} 
          />
          <Text style={[styles.navText, currentTab === 'dates' && styles.navTextActive]}>Dates</Text>
        </TouchableOpacity>

        {/* Center Floating Action Button (+) */}
        <TouchableOpacity 
          style={styles.floatingCenterBtn}
          onPress={() => handleOpenPlanner('')}
        >
          <Feather name="plus" size={26} color={HBD_THEME.colors.charcoal} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('packages')}>
          <Feather 
            name="gift" 
            size={20} 
            color={currentTab === 'packages' ? HBD_THEME.colors.purple : '#8a8294'} 
          />
          <Text style={[styles.navText, currentTab === 'packages' && styles.navTextActive]}>Gifts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('vault')}>
          <Feather 
            name="archive" 
            size={20} 
            color={currentTab === 'vault' ? HBD_THEME.colors.purple : '#8a8294'} 
          />
          <Text style={[styles.navText, currentTab === 'vault' && styles.navTextActive]}>Memories</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Full-Screen Planner Modal */}
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
    backgroundColor: '#000',
  },
  bottomNav: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8dccb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8a8294',
  },
  navTextActive: {
    color: HBD_THEME.colors.purple,
    fontWeight: '800',
  },
  floatingCenterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: HBD_THEME.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -24,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  plusIcon: {
    fontSize: 26,
    fontWeight: '900',
    color: HBD_THEME.colors.charcoal,
    lineHeight: 28,
  },
});
