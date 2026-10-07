import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { HBD_THEME } from '../theme';
import type { ReminderItem } from '../../../shared/types';

interface DatesScreenProps {
  onPlanCelebration: (item?: ReminderItem) => void;
}

const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Mama’s 60th Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-10-19',
    daysRemaining: 12,
    celebrant: 'Mama Chantal',
    icon: '🎂',
    hasCelebrationPlanned: true
  },
  {
    id: 'rem-2',
    title: 'Company 10-Year Anniversary',
    category: 'ANNIVERSARY',
    eventDate: '2026-11-06',
    daysRemaining: 30,
    celebrant: 'Kaba Technologies',
    icon: '🏢',
    hasCelebrationPlanned: false
  },
  {
    id: 'rem-3',
    title: 'Amina & Tariq 20th Wedding Milestone',
    category: 'MILESTONE',
    eventDate: '2026-11-17',
    daysRemaining: 41,
    celebrant: 'Amina & Tariq',
    icon: '💍',
    hasCelebrationPlanned: false
  },
  {
    id: 'rem-4',
    title: 'Amina’s Master’s Degree Graduation',
    category: 'ACHIEVEMENT',
    eventDate: '2027-01-15',
    daysRemaining: 100,
    celebrant: 'Amina',
    icon: '🎓',
    hasCelebrationPlanned: false
  }
];

export const DatesScreen: React.FC<DatesScreenProps> = ({ onPlanCelebration }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);

  const handleSyncContacts = () => {
    Alert.alert(
      'Sync Phone Contacts',
      'HBD will read birthdays from your contacts to automatically build your celebration circle.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow Sync', 
          onPress: () => {
            const syncedItem: ReminderItem = {
              id: `rem-sync-${Date.now()}`,
              title: 'Papa Samuel Birthday (Synced)',
              category: 'BIRTHDAY',
              eventDate: '2026-12-05',
              daysRemaining: 59,
              celebrant: 'Papa Samuel',
              icon: '🎂',
              hasCelebrationPlanned: false
            };
            setReminders(prev => [syncedItem, ...prev]);
            Alert.alert('Synced!', 'Found 1 upcoming birthday in your contacts.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <Text style={styles.greetingKicker}>GOOD MORNING, AMINA 👋</Text>
          <Text style={styles.headerTitle}>What’s worth celebrating?</Text>
          <Text style={styles.headerSubtitle}>
            Never let a beginning, birthday, or milestone slip away quietly.
          </Text>
        </View>

        {/* Featured Big Anniversary Banner */}
        <View style={styles.anniversaryCard}>
          <View style={styles.anniversaryBadge}>
            <Text style={styles.anniversaryBadgeText}>IN 30 DAYS · MAJOR CHAPTER</Text>
          </View>
          <Text style={styles.anniversaryTitle}>Your company turns 10 years old</Text>
          <Text style={styles.anniversaryBody}>
            A decade of survival, growth, and team milestones. Would you like HBD to design the celebration?
          </Text>
          <TouchableOpacity 
            style={styles.anniversaryBtn}
            onPress={() => onPlanCelebration(reminders[1])}
          >
            <Text style={styles.anniversaryBtnText}>Plan Anniversary Celebration ✨</Text>
          </TouchableOpacity>
        </View>

        {/* Sync Contacts Action Banner */}
        <TouchableOpacity style={styles.syncCard} onPress={handleSyncContacts}>
          <Text style={styles.syncIcon}>📱</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.syncTitle}>Sync Contacts Birthdays</Text>
            <Text style={styles.syncSubtitle}>Automatically populate your celebration calendar</Text>
          </View>
          <Text style={styles.syncArrow}>→</Text>
        </TouchableOpacity>

        {/* Coming Up Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming Up in Your Circle</Text>
          <TouchableOpacity onPress={() => onPlanCelebration()}>
            <Text style={styles.addBtnText}>+ Add Date</Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        <View style={styles.list}>
          {reminders.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIconContainer}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDate}>{item.celebrant} · {item.eventDate}</Text>
              </View>

              <View style={styles.itemActionCol}>
                <View style={styles.daysBadge}>
                  <Text style={styles.daysBadgeText}>{item.daysRemaining}d left</Text>
                </View>
                <TouchableOpacity 
                  style={styles.planSmallBtn}
                  onPress={() => onPlanCelebration(item)}
                >
                  <Text style={styles.planSmallBtnText}>Celebrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HBD_THEME.colors.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 20,
  },
  greetingKicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: HBD_THEME.colors.muted,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: HBD_THEME.colors.purple,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: HBD_THEME.colors.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  anniversaryCard: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.lg,
    padding: 22,
    marginBottom: 18,
  },
  anniversaryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244, 185, 66, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: HBD_THEME.borderRadius.pill,
    marginBottom: 10,
  },
  anniversaryBadgeText: {
    color: HBD_THEME.colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  anniversaryTitle: {
    color: HBD_THEME.colors.cream,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  anniversaryBody: {
    color: 'rgba(255, 248, 238, 0.85)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 16,
  },
  anniversaryBtn: {
    backgroundColor: HBD_THEME.colors.gold,
    borderRadius: HBD_THEME.borderRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  anniversaryBtnText: {
    color: HBD_THEME.colors.charcoal,
    fontSize: 13,
    fontWeight: '800',
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    borderRadius: HBD_THEME.borderRadius.md,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  syncIcon: {
    fontSize: 22,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: HBD_THEME.colors.charcoal,
  },
  syncSubtitle: {
    fontSize: 11,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
  },
  syncArrow: {
    fontSize: 16,
    fontWeight: '800',
    color: HBD_THEME.colors.purple,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: HBD_THEME.colors.purple,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: HBD_THEME.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    gap: 12,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 18,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: HBD_THEME.colors.charcoal,
  },
  itemDate: {
    fontSize: 11,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
  },
  itemActionCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  daysBadge: {
    backgroundColor: HBD_THEME.colors.coralSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  daysBadgeText: {
    color: HBD_THEME.colors.coral,
    fontSize: 10,
    fontWeight: '800',
  },
  planSmallBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  planSmallBtnText: {
    color: HBD_THEME.colors.cream,
    fontSize: 10.5,
    fontWeight: '700',
  },
});
