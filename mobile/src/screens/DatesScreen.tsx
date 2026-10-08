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
import { useAppTheme } from '../context/ThemeContext';
import { FloatingCelebrateButton } from '../components/FloatingCelebrateButton';
import { ScreenLayout } from '../components/ScreenLayout';
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
    title: 'Sarah Johnson’s 30th Birthday',
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
  const { colors } = useAppTheme();
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
    <ScreenLayout safeTop safeBottom={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Hero */}
        <View style={styles.header}>
          <View style={styles.kickerRow}>
            <View style={[styles.kickerPill, { backgroundColor: colors.purpleSoft }]}>
              <Feather name="calendar" size={12} color={colors.purple} />
              <Text style={[styles.kickerText, { color: colors.purple }]}>HBDays & Calendar</Text>
            </View>
            <TouchableOpacity 
              style={[styles.syncBtn, { backgroundColor: colors.card, borderColor: colors.line }]} 
              onPress={handleSyncContacts}
            >
              <Feather name="user-plus" size={13} color={colors.purple} />
              <Text style={[styles.syncBtnText, { color: colors.purple }]}>Sync Contacts</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.heading, { color: colors.purple }]}>Never Miss an HBDay</Text>
          <Text style={[styles.subheading, { color: colors.muted }]}>
            Upcoming birthdays, milestones, and shared anniversaries in your circle.
          </Text>

          {/* Quick Highlight Milestone Card */}
          <View style={[styles.milestoneCard, { backgroundColor: colors.purple }]}>
            <View style={styles.milestoneLeft}>
              <Text style={styles.milestoneIcon}>🎂</Text>
              <View>
                <Text style={[styles.milestoneNext, { color: colors.gold }]}>NEXT UP IN 11 DAYS</Text>
                <Text style={styles.milestoneName}>Mama Chantal turns 60</Text>
                <Text style={styles.milestoneLocation}>Douala, Cameroon · Milestone Year</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.milestoneAction, { backgroundColor: colors.gold }]}
              onPress={() => onPlanCelebration(reminders[0])}
            >
              <Text style={styles.milestoneActionText}>Plan</Text>
              <Feather name="arrow-right" size={14} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[
              styles.tabBtn, 
              { backgroundColor: activeTab === 'ALL' ? colors.purple : colors.card, borderColor: colors.line }
            ]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'ALL' ? '#FFFFFF' : colors.muted }]}>
              All ({reminders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.tabBtn, 
              { backgroundColor: activeTab === 'THIS_MONTH' ? colors.purple : colors.card, borderColor: colors.line }
            ]}
            onPress={() => setActiveTab('THIS_MONTH')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'THIS_MONTH' ? '#FFFFFF' : colors.muted }]}>
              Next 30 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.tabBtn, 
              { backgroundColor: activeTab === 'MILESTONES' ? colors.purple : colors.card, borderColor: colors.line }
            ]}
            onPress={() => setActiveTab('MILESTONES')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'MILESTONES' ? '#FFFFFF' : colors.muted }]}>
              Milestones
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        <View style={styles.list}>
          {filteredReminders.map(item => {
            const isUrgent = item.daysRemaining <= 14;
            return (
              <View 
                key={item.id} 
                style={[
                  styles.card, 
                  { backgroundColor: colors.card, borderColor: colors.line }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.userRow}>
                    {item.avatar ? (
                      <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: colors.gold }]} />
                    ) : (
                      <View style={[styles.avatarFallback, { backgroundColor: colors.purpleSoft }]}>
                        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, { color: colors.fg }]}>{item.title}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Feather name="map-pin" size={11} color={colors.muted} />
                        <Text style={[styles.cardMeta, { color: colors.muted }]}>{item.location || 'Global'}</Text>
                        <Text style={[styles.cardMeta, { color: colors.muted }]}>•</Text>
                        <Text style={[styles.cardMeta, { color: colors.muted }]}>{item.eventDate}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.daysPill, { backgroundColor: isUrgent ? colors.coralSoft : colors.purpleSoft }]}>
                    <Text style={[styles.daysNumber, { color: isUrgent ? colors.coral : colors.purple }]}>
                      {item.daysRemaining}
                    </Text>
                    <Text style={[styles.daysLabel, { color: isUrgent ? colors.coral : colors.purple }]}>
                      days left
                    </Text>
                  </View>
                </View>

                {/* Bottom Actions */}
                <View style={[styles.cardActions, { borderTopColor: colors.line }]}>
                  <TouchableOpacity 
                    style={[styles.cardBtnSecondary, { backgroundColor: colors.purpleSoft }]}
                    onPress={() => onOpenGifts && onOpenGifts(item.celebrant)}
                  >
                    <Feather name="gift" size={14} color={colors.purple} />
                    <Text style={[styles.cardBtnSecondaryText, { color: colors.purple }]}>Gift Ideas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.cardBtnPrimary, { backgroundColor: colors.purple }]}
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

      {/* Floating Action Button (+) */}
      <FloatingCelebrateButton onPress={() => onPlanCelebration()} />
    </ScreenLayout>
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
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  syncBtnText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  milestoneCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#5B2A86',
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
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.8,
  },
  milestoneName: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  milestoneLocation: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  milestoneAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  milestoneActionText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  list: {
    gap: 12,
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
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  cardMeta: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  daysPill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 54,
  },
  daysNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    lineHeight: 18,
  },
  daysLabel: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  cardBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
  },
  cardBtnSecondaryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  cardBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
  },
  cardBtnPrimaryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
