import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';
import type { ReelPost } from '../../../shared/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  reels: ReelPost[];
  onCheer: (id: string) => void;
  onOpenPlanner: (reel: ReelPost) => void;
}

export const CelebrationReelScreen: React.FC<Props> = ({ reels, onCheer, onOpenPlanner }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const renderReelItem = ({ item }: { item: ReelPost }) => (
    <View style={styles.reelContainer}>
      <Image source={{ uri: item.mediaUrl }} style={styles.backgroundMedia} />
      
      {/* Top Header Badge */}
      <SafeAreaView style={styles.topBar}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{item.celebrationBadge || '✨ Celebration'}</Text>
        </View>
      </SafeAreaView>

      {/* Right Action Rail */}
      <View style={styles.actionRail}>
        {/* Cheer / Heart Button */}
        <TouchableOpacity 
          style={[styles.actionBtn, item.isCheered && styles.actionBtnActive]} 
          onPress={() => onCheer(item.id)}
        >
          <Feather 
            name="heart" 
            size={20} 
            color={item.isCheered ? '#fff' : HBD_THEME.colors.gold} 
          />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.cheerCount}</Text>
        <Text style={styles.actionLabel}>Cheers</Text>

        {/* Comment */}
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="message-circle" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.actionCount}>{item.commentCount}</Text>

        {/* Surprise Gift */}
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: HBD_THEME.colors.gold }]} 
          onPress={() => onOpenPlanner(item)}
        >
          <Feather name="gift" size={20} color={HBD_THEME.colors.charcoal} />
        </TouchableOpacity>
        <Text style={[styles.actionLabel, { color: HBD_THEME.colors.gold }]}>Gift</Text>
      </View>

      {/* Bottom Creator Info & Caption */}
      <View style={styles.bottomOverlay}>
        <View style={styles.creatorRow}>
          <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
          <Text style={styles.handle}>@{item.user.handle}</Text>
          {item.user.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
        </View>
        <Text style={styles.caption} numberOfLines={3}>{item.caption}</Text>
        <View style={styles.audioPill}>
          <Feather name="music" size={12} color={HBD_THEME.colors.gold} />
          <Text style={styles.audioTitle} numberOfLines={1}>{item.audioTrack}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
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
    backgroundColor: '#000',
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(91, 42, 134, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.4)',
  },
  badgeText: {
    color: HBD_THEME.colors.cream,
    fontSize: 12,
    fontWeight: '700',
  },
  actionRail: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: HBD_THEME.colors.coral,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    marginTop: -8,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 4,
  },
  bottomOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: '82%',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.gold,
  },
  handle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  verifiedBadge: {
    color: HBD_THEME.colors.charcoal,
    backgroundColor: HBD_THEME.colors.gold,
    fontSize: 10,
    fontWeight: '900',
    borderRadius: 7,
    width: 14,
    height: 14,
    textAlign: 'center',
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  audioIcon: {
    fontSize: 12,
  },
  audioTitle: {
    color: HBD_THEME.colors.gold,
    fontSize: 11,
    fontWeight: '600',
  },
});
