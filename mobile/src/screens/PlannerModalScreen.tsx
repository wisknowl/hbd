import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal, 
  SafeAreaView, 
  Linking, 
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';
import type { CelebrationCategory, PackageTier } from '../../../shared/types';

interface PlannerModalScreenProps {
  visible: boolean;
  onClose: () => void;
  initialCelebrant?: string;
  initialCategory?: CelebrationCategory;
}

export const PlannerModalScreen: React.FC<PlannerModalScreenProps> = ({
  visible,
  onClose,
  initialCelebrant = '',
  initialCategory = 'BIRTHDAY',
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const [category, setCategory] = useState<CelebrationCategory>(initialCategory);
  const [celebrant, setCelebrant] = useState(initialCelebrant);
  const [city, setCity] = useState('Douala');
  const [date, setDate] = useState('19 Oct 2026');
  const [tier, setTier] = useState<PackageTier>('CLASSIC');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Custom Cake', 'Fresh Flowers']);

  const categories: { key: CelebrationCategory; label: string; icon: string }[] = [
    { key: 'BIRTHDAY', label: 'Person / Birthday', icon: '🎂' },
    { key: 'BEGINNING', label: 'Company / Startup', icon: '🚀' },
    { key: 'MILESTONE', label: 'Milestone', icon: '🏆' },
    { key: 'ANNIVERSARY', label: 'Anniversary', icon: '💍' },
    { key: 'COMMUNITY', label: 'Cause / Hero', icon: '❤️' }
  ];

  const addons = ['Custom Cake', 'Fresh Flowers', 'Pro Photos', 'Video Reel', 'Live Choir', 'Surprise Box'];

  const toggleAddon = (item: string) => {
    setSelectedAddons(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSendToWhatsApp = () => {
    const text = `Hello HBD Foundation Concierge! I want to coordinate a celebration:
- Category: ${category}
- Who/What: ${celebrant || 'My Loved One'}
- Date & City: ${date} in ${city}
- Package Scale: ${tier}
- Special Touches: ${selectedAddons.join(', ')}`;

    const url = `https://wa.me/237699000000?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Celebration Dispatched', 'An HBD celebration specialist will coordinate your experience shortly!');
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalSafe}>
        <View style={[styles.headerBar, { paddingTop: topInset + 6 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={18} color={HBD_THEME.colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HBD Celebration Concierge</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={[styles.scrollBody, { paddingBottom: Math.max(insets.bottom, 20) + 40 }]} showsVerticalScrollIndicator={false}>
          {/* Section 1: What are you celebrating? */}
          <Text style={styles.fieldLabel}>WHAT ARE YOU CELEBRATING?</Text>
          <View style={styles.chipsRow}>
            {categories.map((c) => {
              const isSelected = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setCategory(c.key)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {c.icon} {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 2: Who or What */}
          <Text style={styles.fieldLabel}>WHO OR WHAT ARE WE CELEBRATING?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mama Chantal, PaySeed Launch, Amina & Tariq..."
            value={celebrant}
            onChangeText={setCelebrant}
            placeholderTextColor={HBD_THEME.colors.muted}
          />

          {/* Section 3: Date & City */}
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>DATE</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholderTextColor={HBD_THEME.colors.muted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>CITY / REGION</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholderTextColor={HBD_THEME.colors.muted}
              />
            </View>
          </View>

          {/* Section 4: Scale & Packages */}
          <Text style={styles.fieldLabel}>SELECT PACKAGE SCALE</Text>
          <View style={styles.packagesCol}>
            {[
              { id: 'MINI', name: '🎂 HBD Mini (From $45)', desc: 'Digital animation card, treats, local delivery' },
              { id: 'CLASSIC', name: '🎁 HBD Classic (From $150)', desc: 'Custom cake, flowers, balloons, photo capture' },
              { id: 'PREMIUM', name: '💎 HBD Premium (From $490)', desc: 'Venue decor, highlight video, acoustic singer choir' },
              { id: 'GLOBAL', name: '🌍 HBD Global (Cross-Border)', desc: 'Coordinate surprise across continents & currencies' },
            ].map((p) => {
              const isSel = tier === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pkgCard, isSel && styles.pkgCardSelected]}
                  onPress={() => setTier(p.id as PackageTier)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pkgName, isSel && styles.pkgNameSelected]}>{p.name}</Text>
                    <Text style={styles.pkgDesc}>{p.desc}</Text>
                  </View>
                  <Feather 
                    name={isSel ? "check-circle" : "circle"} 
                    size={20} 
                    color={isSel ? HBD_THEME.colors.purple : HBD_THEME.colors.muted} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 5: Special Touches */}
          <Text style={styles.fieldLabel}>CURATE SPECIAL TOUCHES</Text>
          <View style={styles.chipsRow}>
            {addons.map((addon) => {
              const isSel = selectedAddons.includes(addon);
              return (
                <TouchableOpacity
                  key={addon}
                  style={[styles.chipGold, isSel && styles.chipGoldSelected]}
                  onPress={() => toggleAddon(addon)}
                >
                  <Text style={[styles.chipGoldText, isSel && styles.chipGoldTextSelected]}>
                    {isSel ? '✓ ' : '+ '} {addon}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit Action */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSendToWhatsApp}>
            <Feather name="star" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.submitBtnText}>Orchestrate This Celebration</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: HBD_THEME.colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: HBD_THEME.colors.border,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    letterSpacing: -0.3,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    letterSpacing: 0.8,
    color: HBD_THEME.colors.muted,
    marginBottom: 8,
    marginTop: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: HBD_THEME.borderRadius.pill,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: HBD_THEME.colors.purple,
  },
  chipText: {
    color: HBD_THEME.colors.purple,
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingSemiBold,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    borderRadius: HBD_THEME.borderRadius.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.charcoal,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  packagesCol: {
    gap: 8,
  },
  pkgCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.border,
    borderRadius: HBD_THEME.borderRadius.md,
    padding: 14,
  },
  pkgCardSelected: {
    borderColor: HBD_THEME.colors.purple,
    backgroundColor: HBD_THEME.colors.purpleSoft,
  },
  pkgName: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.charcoal,
  },
  pkgNameSelected: {
    color: HBD_THEME.colors.purple,
  },
  pkgDesc: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
  },
  chipGold: {
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: HBD_THEME.borderRadius.pill,
    backgroundColor: '#FFFFFF',
  },
  chipGoldSelected: {
    borderColor: HBD_THEME.colors.gold,
    backgroundColor: HBD_THEME.colors.gold,
  },
  chipGoldText: {
    color: HBD_THEME.colors.charcoal,
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
  },
  chipGoldTextSelected: {
    color: HBD_THEME.colors.charcoal,
    fontFamily: HBD_THEME.typography.headingBold,
  },
  submitBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.pill,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: HBD_THEME.typography.headingBold,
  },
});
