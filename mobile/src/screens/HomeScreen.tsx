import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  StatusBar,
  Platform,
  LayoutChangeEvent
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { FloatingCelebrateButton } from '../components/FloatingCelebrateButton';
import type { ReelPost, CelebrationCategory } from '../../../shared/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeFeedTab = 'moments' | 'friends' | 'celebrations';

interface HomeScreenProps {
  reels: ReelPost[];
  onCheerReel: (id: string) => void;
  onOpenPlanner: (celebrant?: string) => void;
  onOpenGifts: (celebrant: string) => void;
  onNavigateToInbox?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reels,
  onCheerReel,
  onOpenPlanner,
  onOpenGifts,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography, borderRadius } = useAppTheme();
  
  // Top Feed Tabs: Moments | Friends | Celebrations
  const [activeTab, setActiveTab] = useState<HomeFeedTab>('moments');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [containerHeight, setContainerHeight] = useState<number>(Dimensions.get('window').height - 70);

  const categories = [
    { key: 'ALL', label: 'All Joy' },
    { key: 'BIRTHDAY', label: '🎂 Birthdays' },
    { key: 'BEGINNING', label: '🚀 Beginnings' },
    { key: 'MILESTONE', label: '🏆 Milestones' },
    { key: 'ANNIVERSARY', label: '💍 Anniversaries' }
  ];

  // Dynamic filtering based on top tab + category
  const filteredReels = useMemo(() => {
    return reels.filter(r => {
      // Category filter
      if (activeCategory !== 'ALL' && r.category !== activeCategory) {
        return false;
      }
      // Top tab filter
      if (activeTab === 'friends') {
        // Friends / Circle: posts with personal connection / circle badge
        return r.user.celebrationsCount >= 8 || r.id === 'm-reel-1';
      }
      if (activeTab === 'celebrations') {
        // Grand public milestones & beginning celebrations
        return r.category === 'MILESTONE' || r.category === 'BEGINNING';
      }
      // Moments: default comprehensive joyful feed
      return true;
    });
  }, [reels, activeTab, activeCategory]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0 && Math.abs(height - containerHeight) > 2) {
      setContainerHeight(height);
    }
  };

  const topInset = Math.max(
    insets.top, 
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44
  );

  const renderReelItem = ({ item }: { item: ReelPost }) => (
    <View style={[styles.reelContainer, { height: containerHeight }]}>
      {/* Background Media */}
      <Image 
        source={{ uri: item.mediaUrl }} 
        style={styles.backgroundMedia} 
        resizeMode="cover"
      />
      
      {/* Gradient overlays */}
      <View style={styles.topVignette} />
      <View style={styles.bottomVignette} />

      {/* Celebration Badge Banner */}
      <View style={[styles.badgeBanner, { top: topInset + 88 }]}>
        <View style={styles.badgePill}>
          <Feather name="star" size={12} color="#F4B942" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>{item.celebrationBadge || '✨ Celebration Moment'}</Text>
        </View>
      </View>

      {/* Right Interaction Rail */}
      <View style={styles.actionRail}>
        {/* Cheer (Heart / Confetti) */}
        <TouchableOpacity 
          style={[styles.actionBtn, item.isCheered && styles.actionBtnCheered]} 
          onPress={() => onCheerReel(item.id)}
          activeOpacity={0.8}
        >
          <Feather 
            name="heart" 
            size={22} 
            color={item.isCheered ? '#FFFFFF' : '#FFFFFF'} 
          />
        </TouchableOpacity>
        <Text style={styles.actionCount}>
          {item.cheerCount > 1000 ? `${(item.cheerCount / 1000).toFixed(1)}k` : item.cheerCount}
        </Text>
        <Text style={styles.actionLabel}>Cheers</Text>

        {/* Gift Button */}
        <TouchableOpacity 
          style={[styles.actionBtn, styles.giftBtn]}
          onPress={() => onOpenGifts(item.user.fullName)}
          activeOpacity={0.8}
        >
          <Feather name="gift" size={20} color="#202124" />
        </TouchableOpacity>
        <Text style={[styles.actionCount, { color: '#F4B942' }]}>Gift</Text>
        <Text style={styles.actionLabel}>Presents</Text>

        {/* Celebrate / Plan Button */}
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#5B2A86' }]}
          onPress={() => onOpenPlanner(item.user.fullName)}
          activeOpacity={0.8}
        >
          <Feather name="calendar" size={19} color="#FFF8EE" />
        </TouchableOpacity>
        <Text style={styles.actionCount}>Plan</Text>
        <Text style={styles.actionLabel}>Drop</Text>

        {/* Share Button */}
        <TouchableOpacity 
          style={styles.actionBtn}
          activeOpacity={0.8}
        >
          <Feather name="share-2" size={19} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.shareCount || 94}</Text>
        <Text style={styles.actionLabel}>Share</Text>
      </View>

      {/* Bottom Creator Info & Caption */}
      <View style={styles.bottomOverlay}>
        <View style={styles.creatorRow}>
          <Image 
            source={{ uri: item.user.avatarUrl }} 
            style={styles.avatar} 
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.creatorName}>{item.user.fullName}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.handle}>@{item.user.handle}</Text>
              {item.user.location && (
                <>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.locationText}>{item.user.location}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.caption} numberOfLines={3}>
          {item.caption}
        </Text>

        {item.audioTrack && (
          <View style={styles.audioPill}>
            <Feather name="music" size={12} color="#F4B942" />
            <Text style={styles.audioTitle} numberOfLines={1}>
              {item.audioTrack}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed Vertical Scroll Feed */}
      <FlatList
        data={filteredReels}
        renderItem={renderReelItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={containerHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={(_, index) => ({
          length: containerHeight,
          offset: containerHeight * index,
          index,
        })}
      />

      {/* Top Header Overlay: Safe Area Aware */}
      <View 
        style={[
          styles.topHeaderOverlay, 
          { paddingTop: topInset + 6 }
        ]} 
        pointerEvents="box-none"
      >
        {/* Top 3 Navigation Links: Moments | Friends | Celebrations */}
        <View style={styles.topTabsBar}>
          {/* Tab 1: Moments */}
          <TouchableOpacity 
            onPress={() => setActiveTab('moments')}
            style={styles.topTabBtn}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.topTabText, 
              activeTab === 'moments' && styles.topTabTextActive
            ]}>
              Moments
            </Text>
            {activeTab === 'moments' && <View style={styles.topTabUnderline} />}
          </TouchableOpacity>

          <View style={styles.tabDividerDot} />

          {/* Tab 2: Friends */}
          <TouchableOpacity 
            onPress={() => setActiveTab('friends')}
            style={styles.topTabBtn}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.topTabText, 
              activeTab === 'friends' && styles.topTabTextActive
            ]}>
              Friends
            </Text>
            {activeTab === 'friends' && <View style={styles.topTabUnderline} />}
          </TouchableOpacity>

          <View style={styles.tabDividerDot} />

          {/* Tab 3: Celebrations */}
          <TouchableOpacity 
            onPress={() => setActiveTab('celebrations')}
            style={styles.topTabBtn}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.topTabText, 
              activeTab === 'celebrations' && styles.topTabTextActive
            ]}>
              Celebrations
            </Text>
            {activeTab === 'celebrations' && <View style={styles.topTabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Micro Category Pills Strip */}
        <View style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              style={[
                styles.categoryChip,
                activeCategory === cat.key && styles.categoryChipActive
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.categoryChipText,
                activeCategory === cat.key && styles.categoryChipTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Floating Celebrate Action Button */}
      <FloatingCelebrateButton 
        onPress={() => onOpenPlanner()} 
        bottomOffset={18}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0814',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
    justifyContent: 'flex-end',
    backgroundColor: '#0D0814',
  },
  backgroundMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'rgba(10, 6, 16, 0.72)',
  },
  topHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  topTabsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  topTabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
  },
  topTabText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  topTabTextActive: {
    color: '#FFF8EE',
    fontWeight: '800',
    fontSize: 17,
  },
  topTabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F4B942',
  },
  tabDividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryScroll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 14, 30, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  categoryChipActive: {
    backgroundColor: '#5B2A86',
    borderColor: '#F4B942',
  },
  categoryChipText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFF8EE',
    fontWeight: '700',
  },
  badgeBanner: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 10, 25, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.4)',
  },
  badgeText: {
    color: '#FFF8EE',
    fontSize: 12,
    fontWeight: '700',
  },
  actionRail: {
    position: 'absolute',
    right: 12,
    bottom: 40,
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(25, 18, 35, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnCheered: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FFFFFF',
  },
  giftBtn: {
    backgroundColor: '#F4B942',
    borderColor: '#FFE39B',
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: -4,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: -6,
    marginBottom: 4,
  },
  bottomOverlay: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    width: '80%',
    zIndex: 15,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#F4B942',
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  handle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  dotSeparator: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: '#F4B942',
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    color: '#202124',
    fontSize: 9,
    fontWeight: '900',
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 10, 25, 0.65)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.3)',
  },
  audioTitle: {
    color: '#F4B942',
    fontSize: 11,
    fontWeight: '600',
  },
});
