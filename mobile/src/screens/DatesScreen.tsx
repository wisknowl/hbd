import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';
import type { ReminderItem } from '../../../shared/types';

interface DatesScreenProps {
  onPlanCelebration: (item?: ReminderItem) => void;
  onOpenGifts?: (personName: string) => void;
}

const INITIAL_REMINDERS: (ReminderItem & { avatar?: string; location?: string })[] = [
  {
    id: 'rem-1',
    title: 'Mama Chantal’s 60th Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-10-19',
    daysRemaining: 11,
    celebrant: 'Mama Chantal',
    icon: '🎂',
    location: 'Douala, Cameroon',
    hasCelebrationPlanned: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rem-sarah',
    title: 'Sarah Johnson’s Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-10-24',
    daysRemaining: 16,
    celebrant: 'Sarah Johnson',
    icon: '✨',
    location: 'London, UK',
    hasCelebrationPlanned: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rem-aisha',
    title: 'Aisha Bello’s Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-11-02',
    daysRemaining: 25,
    celebrant: 'Aisha Bello',
    icon: '🎈',
    location: 'Lagos, Nigeria',
    hasCelebrationPlanned: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rem-2',
    title: 'Company 10-Year Anniversary',
    category: 'ANNIVERSARY',
    eventDate: '2026-11-06',
    daysRemaining: 29,
    celebrant: 'Kaba Technologies',
    icon: '🏢',
    location: 'Paris & Abidjan',
    hasCelebrationPlanned: false,
    avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rem-david',
    title: 'David Kouam’s Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-12-04',
    daysRemaining: 57,
    celebrant: 'David Kouam',
    icon: '🎮',
    location: 'Toronto, Canada',
    hasCelebrationPlanned: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const DatesScreen: React.FC<DatesScreenProps> = ({ onPlanCelebration, onOpenGifts }) => {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'THIS_MONTH' | 'MILESTONES'>('ALL');

  const handleSyncContacts = () => {
    Alert.alert(
      'Sync Phone Contacts',
      'HBD will match birthdays from your contact list to help you build your celebration calendar automatically.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow Sync', 
          onPress: () => {
            const syncedItem = {
              id: `rem-sync-${Date.now()}`,
              title: 'Papa Samuel Birthday (Synced)',
              category: 'BIRTHDAY' as const,
              eventDate: '2026-11-18',
              daysRemaining: 41,
              celebrant: 'Papa Samuel',
              icon: '🎂',
              location: 'London, UK',
              hasCelebrationPlanned: false,
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
            };
            setReminders(prev => [syncedItem, ...prev]);
            Alert.alert('Synced!', 'Added Papa Samuel from your contacts.');
          }
        }
      ]
    );
  };

  const filteredReminders = reminders.filter(item => {
    if (activeTab === 'THIS_MONTH') return item.daysRemaining <= 30;
    if (activeTab === 'MILESTONES') return item.category !== 'BIRTHDAY';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Hero */}
        <View style={styles.header}>
          <View style={styles.kickerRow}>
            <View style={styles.kickerPill}>
              <Feather name="calendar" size={12} color={HBD_THEME.colors.purple} />
              <Text style={styles.kickerText}>HBD Calendar of Joy</Text>
            </View>
            <TouchableOpacity style={styles.syncBtn} onPress={handleSyncContacts}>
              <Feather name="user-plus" size={13} color={HBD_THEME.colors.purple} />
              <Text style={styles.syncBtnText}>Sync Contacts</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading}>Never Miss a Birthday</Text>
          <Text style={styles.subheading}>
            Upcoming celebrations in your circle. Plan in advance, orchestrate gifts, and deliver memories.
          </Text>

          {/* Quick Highlight Milestone Card */}
          <View style={styles.milestoneCard}>
            <View style={styles.milestoneLeft}>
              <Text style={styles.milestoneIcon}>🎂</Text>
              <View>
                <Text style={styles.milestoneNext}>NEXT UP IN 11 DAYS</Text>
                <Text style={styles.milestoneName}>Mama Chantal turns 60</Text>
                <Text style={styles.milestoneLocation}>Douala, Cameroon · Milestone Year</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.milestoneAction}
              onPress={() => onPlanCelebration(reminders[0])}
            >
              <Text style={styles.milestoneActionText}>Plan</Text>
              <Feather name="arrow-right" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ALL' && styles.tabBtnActive]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
              All ({reminders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'THIS_MONTH' && styles.tabBtnActive]}
            onPress={() => setActiveTab('THIS_MONTH')}
          >
            <Text style={[styles.tabText, activeTab === 'THIS_MONTH' && styles.tabTextActive]}>
              Next 30 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'MILESTONES' && styles.tabBtnActive]}
            onPress={() => setActiveTab('MILESTONES')}
          >
            <Text style={[styles.tabText, activeTab === 'MILESTONES' && styles.tabTextActive]}>
              Milestones
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        <View style={styles.list}>
          {filteredReminders.map(item => {
            const isUrgent = item.daysRemaining <= 14;
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.userRow}>
                    {item.avatar ? (
                      <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Feather name="map-pin" size={11} color={HBD_THEME.colors.muted} />
                        <Text style={styles.cardMeta}>{item.location || 'Global'}</Text>
                        <Text style={styles.cardMeta}>•</Text>
                        <Text style={styles.cardMeta}>{item.eventDate}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.daysPill, isUrgent && styles.daysPillUrgent]}>
                    <Text style={[styles.daysNumber, isUrgent && styles.daysNumberUrgent]}>
                      {item.daysRemaining}
                    </Text>
                    <Text style={[styles.daysLabel, isUrgent && styles.daysLabelUrgent]}>
                      days left
                    </Text>
                  </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.cardBtnSecondary}
                    onPress={() => onOpenGifts && onOpenGifts(item.celebrant)}
                  >
                    <Feather name="gift" size={14} color={HBD_THEME.colors.purple} />
                    <Text style={styles.cardBtnSecondaryText}>Gift Ideas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.cardBtnPrimary}
                    onPress={() => onPlanCelebration(item)}
                  >
                    <Feather name="star" size={14} color="#FFFFFF" />
                    <Text style={styles.cardBtnPrimaryText}>
                      {item.hasCelebrationPlanned ? 'View Plan' : 'Plan Surprise'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  kickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  syncBtnText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: HBD_THEME.colors.purple,
  },
  heading: {
    fontSize: 26,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
    lineHeight: 19,
    marginBottom: 16,
  },
  milestoneCard: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  milestoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  milestoneIcon: {
    fontSize: 28,
  },
  milestoneNext: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.headingExtraBold,
    color: HBD_THEME.colors.gold,
    letterSpacing: 0.8,
  },
  milestoneName: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingFont,
    color: '#FFFFFF',
  },
  milestoneLocation: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  milestoneAction: {
    backgroundColor: HBD_THEME.colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  milestoneActionText: {
    color: HBD_THEME.colors.charcoal,
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingBold,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  tabBtnActive: {
    backgroundColor: HBD_THEME.colors.purple,
    borderColor: HBD_THEME.colors.purple,
  },
  tabText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.muted,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: HBD_THEME.typography.bodyBold,
  },
  list: {
    gap: 12,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.gold,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.charcoal,
  },
  cardMeta: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  daysPill: {
    backgroundColor: HBD_THEME.colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: HBD_THEME.borderRadius.sm,
    minWidth: 54,
  },
  daysPillUrgent: {
    backgroundColor: HBD_THEME.colors.coralSoft,
  },
  daysNumber: {
    fontSize: 16,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    lineHeight: 18,
  },
  daysNumberUrgent: {
    color: HBD_THEME.colors.coral,
  },
  daysLabel: {
    fontSize: 9,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.purple,
  },
  daysLabelUrgent: {
    color: HBD_THEME.colors.coral,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4ECE1',
    paddingTop: 12,
  },
  cardBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 9,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  cardBtnSecondaryText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: HBD_THEME.colors.purple,
  },
  cardBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purple,
    paddingVertical: 9,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  cardBtnPrimaryText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: '#FFFFFF',
  },
});
