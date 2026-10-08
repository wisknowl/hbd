import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { FloatingCelebrateButton } from '../components/FloatingCelebrateButton';
import { CelebrationReelScreen } from './CelebrationReelScreen';
import type { ReelPost, ReminderItem } from '../../../shared/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  reels: ReelPost[];
  onCheerReel: (id: string) => void;
  onOpenPlanner: (celebrant?: string) => void;
  onOpenGifts: (celebrant: string) => void;
  onNavigateToInbox: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reels,
  onCheerReel,
  onOpenPlanner,
  onOpenGifts,
  onNavigateToInbox,
}) => {
  const { colors, typography, borderRadius, isDark, toggleTheme } = useAppTheme();
  const [viewMode, setViewMode] = useState<'deck' | 'feed'>('deck');

  // Coming up milestones matching user's design reference
  const comingUpItems = [
    {
      id: 'mama-60',
      title: "Mama's 60th",
      icon: '🎂',
      timeText: '12 days',
      celebrant: 'Mama Chantal',
    },
    {
      id: 'anniv-20',
      title: '20 years together',
      icon: '💍',
      timeText: '41 days',
      celebrant: 'Amina & Tariq',
    },
    {
      id: 'grad-amina',
      title: "Amina's graduation",
      icon: '🎓',
      timeText: '3 months',
      celebrant: 'Amina',
    },
    {
      id: 'sarah-bday',
      title: "Sarah's 30th",
      icon: '✨',
      timeText: '16 days',
      celebrant: 'Sarah Johnson',
    }
  ];

  if (viewMode === 'feed') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <CelebrationReelScreen
          reels={reels}
          onCheer={onCheerReel}
          onOpenPlanner={(reel) => onOpenPlanner(reel.user.fullName)}
          onOpenGifts={onOpenGifts}
        />
        {/* Switch back button */}
        <SafeAreaView style={styles.feedSwitchOverlay}>
          <TouchableOpacity 
            style={styles.backToDeckBtn}
            onPress={() => setViewMode('deck')}
          >
            <Feather name="arrow-left" size={16} color="#FFFFFF" />
            <Text style={styles.backToDeckText}>Home Deck</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={[styles.greetingText, { color: colors.purple }]}>Hello</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={[styles.questionText, { color: colors.purple }]}>
              What's worth{'\n'}celebrating?
            </Text>
          </View>

          <View style={styles.topActionsRow}>
            {/* View Mode Toggle (Feed vs Deck) */}
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.purpleSoft }]}
              onPress={() => setViewMode('feed')}
            >
              <Feather name="film" size={18} color={colors.purple} />
            </TouchableOpacity>

            {/* Dark/Light Mode Toggle */}
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.purpleSoft }]}
              onPress={toggleTheme}
            >
              <Feather name={isDark ? "sun" : "moon"} size={18} color={colors.purple} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Milestone Card (from Screenshot) */}
        <View style={[styles.heroCard, { backgroundColor: colors.purple }]}>
          <Text style={styles.heroTimeLabel}>In 30 days</Text>
          <Text style={styles.heroMilestoneTitle}>Your company turns 10</Text>
          
          <TouchableOpacity 
            style={[styles.heroActionBtn, { backgroundColor: colors.gold }]}
            onPress={() => onOpenPlanner('Kaba Technologies 10th Anniversary')}
            activeOpacity={0.88}
          >
            <Text style={styles.heroActionBtnText}>Create the celebration</Text>
          </TouchableOpacity>
        </View>

        {/* Coming Up Section (from Screenshot) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Coming up</Text>
          <TouchableOpacity onPress={() => setViewMode('feed')} style={styles.seeFeedLink}>
            <Feather name="play-circle" size={13} color={colors.purple} />
            <Text style={[styles.seeFeedLinkText, { color: colors.purple }]}>Watch Reels</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsCol}>
          {comingUpItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.itemCard, 
                { backgroundColor: colors.card, borderColor: colors.line }
              ]}
              onPress={() => onOpenGifts(item.celebrant)}
              activeOpacity={0.8}
            >
              <View style={styles.itemLeft}>
                <View style={[styles.iconBadge, { backgroundColor: colors.gold }]}>
                  <Text style={styles.iconEmoji}>{item.icon}</Text>
                </View>
                <Text style={[styles.itemTitle, { color: colors.fg }]}>{item.title}</Text>
              </View>

              <Text style={[styles.itemTime, { color: colors.coral }]}>{item.timeText}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Prompt Card */}
        <View style={[styles.promptCard, { backgroundColor: colors.purpleSoft, borderColor: colors.line }]}>
          <View style={styles.promptLeft}>
            <Feather name="gift" size={24} color={colors.purple} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.promptTitle, { color: colors.purple }]}>
                Send a surprise across borders
              </Text>
              <Text style={[styles.promptSub, { color: colors.muted }]}>
                Amazon gifts, fresh cakes, or diaspora surprises in Africa & worldwide.
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.promptBtn, { backgroundColor: colors.purple }]}
            onPress={() => onOpenGifts('Mama Chantal')}
          >
            <Text style={styles.promptBtnText}>Gift Ideas</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Floating Celebrate Action Button at Bottom Right Corner */}
      <FloatingCelebrateButton onPress={() => onOpenPlanner('')} />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    lineHeight: 30,
  },
  waveEmoji: {
    fontSize: 24,
  },
  questionText: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    lineHeight: 32,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginBottom: 24,
    shadowColor: '#5B2A86',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  heroTimeLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 4,
  },
  heroMilestoneTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  heroActionBtn: {
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionBtnText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'none',
  },
  seeFeedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeFeedLinkText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  cardsCol: {
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#5B2A86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  itemTime: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  promptCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  promptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  promptTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  promptSub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    lineHeight: 15,
  },
  promptBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  promptBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  feedSwitchOverlay: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 99,
  },
  backToDeckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 20, 28, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backToDeckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});
