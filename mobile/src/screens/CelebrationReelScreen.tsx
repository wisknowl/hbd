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
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';
import type { ReelPost, CelebrationCategory } from '../../../shared/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  reels: ReelPost[];
  onCheer: (id: string) => void;
  onOpenPlanner: (reel: ReelPost) => void;
  onOpenGifts?: (personName: string) => void;
}

export const CelebrationReelScreen: React.FC<Props> = ({ 
  reels, 
  onCheer, 
  onOpenPlanner,
  onOpenGifts
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const [feedMode, setFeedMode] = useState<'foryou' | 'circle'>('foryou');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: 'All Joy' },
    { key: 'BIRTHDAY', label: '🎂 Birthdays' },
    { key: 'BEGINNING', label: '🚀 Beginnings' },
    { key: 'MILESTONE', label: '🏆 Milestones' },
    { key: 'ANNIVERSARY', label: '💍 Anniversaries' }
  ];

  const filteredReels = useMemo(() => {
    return reels.filter(r => {
      const matchCat = activeCategory === 'ALL' || r.category === activeCategory;
      if (!matchCat) return false;
      if (feedMode === 'circle') {
        // Circle filter demo: show reels with follower or celebration count > 5
        return r.user.celebrationsCount >= 8;
      }
      return true;
    });
  }, [reels, activeCategory, feedMode]);

  const renderReelItem = ({ item }: { item: ReelPost }) => (
    <View style={styles.reelContainer}>
      <Image 
        source={{ uri: item.mediaUrl }} 
        style={styles.backgroundMedia} 
        resizeMode="cover"
      />
      <View style={styles.darkGradientOverlay} />

      {/* Top Overlay: Feed Switcher & Categories */}
      <View style={[styles.topSafeArea, { paddingTop: topInset + 6 }]}>
        <View style={styles.feedModeRow}>
          <TouchableOpacity 
            onPress={() => setFeedMode('circle')}
            style={styles.modeTab}
          >
            <Text style={[
              styles.modeTabText, 
              feedMode === 'circle' && styles.modeTabTextActive
            ]}>
              My Circle
            </Text>
            {feedMode === 'circle' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <View style={styles.modeDivider} />

          <TouchableOpacity 
            onPress={() => setFeedMode('foryou')}
            style={styles.modeTab}
          >
            <Text style={[
              styles.modeTabText, 
              feedMode === 'foryou' && styles.modeTabTextActive
            ]}>
              For You
            </Text>
            {feedMode === 'foryou' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>

        {/* Category Pills Strip */}
        <View style={styles.categoryStrip}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              style={[
                styles.categoryChip,
                activeCategory === cat.key && styles.categoryChipActive
              ]}
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

      {/* Celebration Badge Banner */}
      <View style={styles.badgeBanner}>
        <View style={styles.badgePill}>
          <Feather name="star" size={12} color={HBD_THEME.colors.gold} style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>{item.celebrationBadge || '✨ Celebration Moment'}</Text>
        </View>
      </View>

      {/* Right Interaction Rail */}
      <View style={styles.actionRail}>
        {/* Cheer (Heart / Confetti) */}
        <TouchableOpacity 
          style={[styles.actionBtn, item.isCheered && styles.actionBtnCheered]} 
          onPress={() => onCheer(item.id)}
          activeOpacity={0.8}
        >
          <Feather 
            name="heart" 
            size={22} 
            color={item.isCheered ? '#FFFFFF' : HBD_THEME.colors.gold} 
          />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.cheerCount.toLocaleString()}</Text>
        <Text style={styles.actionLabel}>Cheers</Text>

        {/* Gift / Surprise Concierge */}
        <TouchableOpacity 
          style={[styles.actionBtn, styles.giftBtn]} 
          onPress={() => {
            if (onOpenGifts) {
              onOpenGifts(item.user.fullName);
            } else {
              onOpenPlanner(item);
            }
          }}
          activeOpacity={0.8}
        >
          <Feather name="gift" size={22} color={HBD_THEME.colors.charcoal} />
        </TouchableOpacity>
        <Text style={[styles.actionLabel, { color: HBD_THEME.colors.gold, fontWeight: '700' }]}>Send Gift</Text>

        {/* Comments */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <Feather name="message-circle" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.commentCount}</Text>
        <Text style={styles.actionLabel}>Wishes</Text>

        {/* Share */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <Feather name="share-2" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.shareCount}</Text>
        <Text style={styles.actionLabel}>Share</Text>
      </View>

      {/* Bottom Creator Info & Details */}
      <View style={[styles.bottomOverlay, { paddingBottom: Math.max(insets.bottom, 12) + 40 }]}>
        <View style={styles.creatorRow}>
          <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.creatorName}>{item.user.fullName}</Text>
              {item.user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>✓</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.handle}>@{item.user.handle}</Text>
              {item.user.location ? (
                <>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.locationText}>{item.user.location}</Text>
                </>
              ) : null}
            </View>
          </View>
        </View>

        <Text style={styles.caption} numberOfLines={3}>{item.caption}</Text>

        <View style={styles.audioPill}>
          <Feather name="music" size={12} color={HBD_THEME.colors.gold} />
          <Text style={styles.audioTitle} numberOfLines={1}>
            {item.audioTrack || 'Original Celebration Sound'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={filteredReels}
        renderItem={renderReelItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A080C',
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    justifyContent: 'space-between',
  },
  backgroundMedia: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  topSafeArea: {
    paddingTop: 12,
    zIndex: 10,
  },
  feedModeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  modeTab: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modeTabText: {
    fontSize: 16,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontFamily: HBD_THEME.typography.headingFont,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: HBD_THEME.colors.gold,
    marginTop: 4,
  },
  modeDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
  },
  categoryChip: {
    backgroundColor: 'rgba(23, 20, 28, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryChipActive: {
    backgroundColor: HBD_THEME.colors.purple,
    borderColor: HBD_THEME.colors.gold,
  },
  categoryChipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyMedium,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontFamily: HBD_THEME.typography.bodyBold,
  },
  badgeBanner: {
    position: 'absolute',
    top: 110,
    left: 16,
    zIndex: 9,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 42, 134, 0.88)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.5)',
  },
  badgeText: {
    color: HBD_THEME.colors.cream,
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingSemiBold,
  },
  actionRail: {
    position: 'absolute',
    right: 14,
    bottom: 120,
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 26, 38, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnCheered: {
    backgroundColor: HBD_THEME.colors.coral,
    borderColor: '#FFFFFF',
  },
  giftBtn: {
    backgroundColor: HBD_THEME.colors.gold,
    borderColor: '#FFE39B',
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    marginTop: -6,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontFamily: HBD_THEME.typography.bodyMedium,
    marginTop: -8,
    marginBottom: 4,
  },
  bottomOverlay: {
    paddingHorizontal: 18,
    paddingBottom: 44,
    width: '82%',
    zIndex: 10,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: HBD_THEME.colors.gold,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingBold,
    letterSpacing: -0.2,
  },
  handle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyRegular,
  },
  dotSeparator: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyMedium,
  },
  verifiedBadge: {
    backgroundColor: HBD_THEME.colors.gold,
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    color: HBD_THEME.colors.charcoal,
    fontSize: 9,
    fontFamily: HBD_THEME.typography.headingExtraBold,
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: HBD_THEME.typography.bodyRegular,
    marginBottom: 10,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 12, 20, 0.65)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.3)',
  },
  audioTitle: {
    color: HBD_THEME.colors.gold,
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyMedium,
  },
});
