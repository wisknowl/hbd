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
  Alert
} from 'react-native';
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
  const [category, setCategory] = useState<CelebrationCategory>(initialCategory);
  const [celebrant, setCelebrant] = useState(initialCelebrant);
  const [city, setCity] = useState('Douala');
  const [date, setDate] = useState('14 Nov 2026');
  const [tier, setTier] = useState<PackageTier>('CLASSIC');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Cake', 'Flowers']);

  const categories: { key: CelebrationCategory; label: string; icon: string }[] = [
    { key: 'BIRTHDAY', label: 'Person', icon: '🎂' },
    { key: 'BEGINNING', label: 'Company', icon: '🚀' },
    { key: 'MILESTONE', label: 'Milestone', icon: '🏆' },
    { key: 'ANNIVERSARY', label: 'Anniversary', icon: '📅' },
    { key: 'COMMUNITY', label: 'Community', icon: '❤️' }
  ];

  const addons = ['Cake', 'Flowers', 'Photos', 'Video', 'Catering', 'Surprise'];

  const toggleAddon = (item: string) => {
    setSelectedAddons(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSendToWhatsApp = () => {
    const text = `Hello HBD Foundation Concierge! I want to plan a celebration:
- Type: ${category}
- Who/What: ${celebrant || 'My Loved One'}
- Date & City: ${date} in ${city}
- Package: ${tier}
- Special Touches: ${selectedAddons.join(', ')}`;

    const url = `https://wa.me/237699000000?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Celebration Request Sent', 'Our specialist will reach out to you shortly!');
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalSafe}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HBD Celebration Planner</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
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
            placeholder="e.g. Mama Chantal, My Startup, 20 Years Marriage..."
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
              <Text style={styles.fieldLabel}>CITY / COUNTRY</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholderTextColor={HBD_THEME.colors.muted}
              />
            </View>
          </View>

          {/* Section 4: Scale & Packages */}
          <Text style={styles.fieldLabel}>CHOOSE PACKAGE SCALE</Text>
          <View style={styles.packagesCol}>
            {[
              { id: 'MINI', name: 'HBD Mini', desc: 'Digital card, treats, message, delivery' },
              { id: 'CLASSIC', name: 'HBD Classic', desc: 'Custom cake, flowers, balloons, photo capture' },
              { id: 'PREMIUM', name: 'HBD Premium', desc: 'Decor, video reel, live acoustic choir' },
              { id: 'GLOBAL', name: 'HBD Global', desc: 'Celebrate cross-border across continents' },
            ].map((p) => {
              const isSel = tier === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pkgCard, isSel && styles.pkgCardSelected]}
                  onPress={() => setTier(p.id as PackageTier)}
                >
                  <View>
                    <Text style={[styles.pkgName, isSel && styles.pkgNameSelected]}>{p.name}</Text>
                    <Text style={styles.pkgDesc}>{p.desc}</Text>
                  </View>
                  <Text style={[styles.pkgRadio, isSel && styles.pkgRadioSelected]}>
                    {isSel ? '●' : '○'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 5: Special Touches */}
          <Text style={styles.fieldLabel}>WHAT DO YOU WANT?</Text>
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
            <Text style={styles.submitBtnText}>Create My Celebration ✨</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: HBD_THEME.colors.cream,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: HBD_THEME.colors.border,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: HBD_THEME.colors.purple,
    letterSpacing: -0.3,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
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
    fontSize: 12.5,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: HBD_THEME.colors.cream,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    borderRadius: HBD_THEME.borderRadius.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
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
    backgroundColor: '#fff',
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
    fontSize: 14,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
  },
  pkgNameSelected: {
    color: HBD_THEME.colors.purple,
  },
  pkgDesc: {
    fontSize: 11,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
  },
  pkgRadio: {
    fontSize: 16,
    color: HBD_THEME.colors.muted,
  },
  pkgRadioSelected: {
    color: HBD_THEME.colors.purple,
    fontWeight: '900',
  },
  chipGold: {
    borderWidth: 1.5,
    borderColor: HBD_THEME.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: HBD_THEME.borderRadius.pill,
    backgroundColor: '#fff',
  },
  chipGoldSelected: {
    borderColor: HBD_THEME.colors.gold,
    backgroundColor: HBD_THEME.colors.gold,
  },
  chipGoldText: {
    color: HBD_THEME.colors.charcoal,
    fontSize: 12,
    fontWeight: '700',
  },
  chipGoldTextSelected: {
    color: HBD_THEME.colors.charcoal,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 26,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: HBD_THEME.colors.cream,
    fontSize: 15,
    fontWeight: '800',
  },
});
