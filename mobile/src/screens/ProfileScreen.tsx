import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Image,
  Switch,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HBD_THEME } from '../theme';

interface ProfileScreenProps {
  onOpenPlanner: () => void;
  onNavigateToFriends: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onOpenPlanner,
  onNavigateToFriends
}) => {
  const [name, setName] = useState('Samuel Ndamukong');
  const [handle, setHandle] = useState('samuel_nd');
  const [bio, setBio] = useState('Product architect & celebration enthusiast. Always down for good coffee & heartfelt surprises ✨');
  const [city, setCity] = useState('London, UK');
  const [birthday, setBirthday] = useState('24 Oct 1995');
  const [daysUntil, setDaysUntil] = useState(16);

  // Wishlist & Avoidances
  const [wishlist, setWishlist] = useState<string[]>([
    'Specialty Coffee Beans', 
    'Noise Cancelling Headphones', 
    'Kindle Travel Books', 
    'Minimalist Gold Watch'
  ]);
  const [avoidList, setAvoidList] = useState<string[]>([
    'Lilies (allergic)', 
    'Extreme Sweet Fondant'
  ]);
  const [newWish, setNewWish] = useState('');
  const [newAvoid, setNewAvoid] = useState('');

  // Privacy toggles
  const [isFriendsOnly, setIsFriendsOnly] = useState(true);
  const [showAge, setShowAge] = useState(false);
  const [addressProtected, setAddressProtected] = useState(true);

  const handleAddWish = () => {
    if (newWish.trim()) {
      setWishlist(prev => [...prev, newWish.trim()]);
      setNewWish('');
    }
  };

  const handleRemoveWish = (item: string) => {
    setWishlist(prev => prev.filter(w => w !== item));
  };

  const handleAddAvoid = () => {
    if (newAvoid.trim()) {
      setAvoidList(prev => [...prev, newAvoid.trim()]);
      setNewAvoid('');
    }
  };

  const handleRemoveAvoid = (item: string) => {
    setAvoidList(prev => prev.filter(a => a !== item));
  };

  const handleSaveProfile = () => {
    Alert.alert('Profile Updated', 'Your celebration preferences and birthday countdown have been saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.cameraBtn}>
                <Feather name="camera" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.fullName}>{name}</Text>
              <Text style={styles.handleText}>@{handle}</Text>
              <View style={styles.locationPill}>
                <Feather name="map-pin" size={11} color={HBD_THEME.colors.purple} />
                <Text style={styles.locationText}>{city}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bioText}>{bio}</Text>

          {/* Birthday Countdown Banner */}
          <View style={styles.countdownBanner}>
            <View style={styles.countdownIconWrap}>
              <Text style={{ fontSize: 24 }}>🎂</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.countdownTag}>YOUR CELEBRATION IS COMING</Text>
              <Text style={styles.countdownTitle}>{birthday} (In {daysUntil} days!)</Text>
              <Text style={styles.countdownSub}>Your friends can see what you love to surprise you.</Text>
            </View>
          </View>
        </View>

        {/* Wishlist / Things I Love */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <Feather name="heart" size={14} color={HBD_THEME.colors.coral} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Things I Love (Wishlist)</Text>
              <Text style={styles.sectionSubtitle}>Guides your friends when choosing gifts for you.</Text>
            </View>
          </View>

          <View style={styles.tagWrap}>
            {wishlist.map((item, i) => (
              <View key={i} style={styles.wishChip}>
                <Text style={styles.wishChipText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveWish(item)}>
                  <Feather name="x" size={12} color={HBD_THEME.colors.purple} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addTagRow}>
            <TextInput 
              placeholder="Add item (e.g. Perfume, Airpods)..."
              placeholderTextColor={HBD_THEME.colors.muted}
              value={newWish}
              onChangeText={setNewWish}
              style={styles.tagInput}
              onSubmitEditing={handleAddWish}
            />
            <TouchableOpacity style={styles.addTagBtn} onPress={handleAddWish}>
              <Feather name="plus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Things to Avoid / Allergies */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: HBD_THEME.colors.coralSoft }]}>
              <Feather name="shield" size={14} color={HBD_THEME.colors.coral} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Things to Avoid / Allergies</Text>
              <Text style={styles.sectionSubtitle}>Prevents awkward or allergic gifts.</Text>
            </View>
          </View>

          <View style={styles.tagWrap}>
            {avoidList.map((item, i) => (
              <View key={i} style={styles.avoidChip}>
                <Text style={styles.avoidChipText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveAvoid(item)}>
                  <Feather name="x" size={12} color={HBD_THEME.colors.coral} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addTagRow}>
            <TextInput 
              placeholder="Add allergy/dislike (e.g. Lilies, Alcohol)..."
              placeholderTextColor={HBD_THEME.colors.muted}
              value={newAvoid}
              onChangeText={setNewAvoid}
              style={styles.tagInput}
              onSubmitEditing={handleAddAvoid}
            />
            <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: HBD_THEME.colors.coral }]} onPress={handleAddAvoid}>
              <Feather name="plus" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Surprise Protection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Delivery Security</Text>
          <Text style={styles.sectionSubtitle}>Control what circle members see.</Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Birthday Visible to Friends Only</Text>
              <Text style={styles.toggleDesc}>Keep celebration date within your verified circle.</Text>
            </View>
            <Switch 
              value={isFriendsOnly} 
              onValueChange={setIsFriendsOnly} 
              trackColor={{ false: '#ddd', true: HBD_THEME.colors.purple }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Display Age & Milestone</Text>
              <Text style={styles.toggleDesc}>Show "Turns 30" badge on celebration reel.</Text>
            </View>
            <Switch 
              value={showAge} 
              onValueChange={setShowAge} 
              trackColor={{ false: '#ddd', true: HBD_THEME.colors.purple }}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Encrypted Address for Surprise Gifts</Text>
              <Text style={styles.toggleDesc}>Friends can send gifts without seeing your private street address.</Text>
            </View>
            <Switch 
              value={addressProtected} 
              onValueChange={setAddressProtected} 
              trackColor={{ false: '#ddd', true: HBD_THEME.colors.purple }}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Feather name="check-circle" size={16} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 18,
    marginBottom: 16,
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: HBD_THEME.colors.gold,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: HBD_THEME.colors.purple,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 18,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.charcoal,
  },
  handleText: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyRegular,
    color: HBD_THEME.colors.muted,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: HBD_THEME.borderRadius.pill,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.purple,
  },
  bioText: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.charcoal,
    lineHeight: 18,
    marginBottom: 14,
  },
  countdownBanner: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.sm,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countdownIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownTag: {
    fontSize: 9,
    fontFamily: HBD_THEME.typography.headingExtraBold,
    color: HBD_THEME.colors.gold,
    letterSpacing: 0.8,
  },
  countdownTitle: {
    fontSize: 14,
    fontFamily: HBD_THEME.typography.headingFont,
    color: '#FFFFFF',
  },
  countdownSub: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.charcoal,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  wishChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  wishChipText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.purple,
  },
  avoidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.coralSoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  avoidChipText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.coral,
  },
  addTagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    borderRadius: HBD_THEME.borderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.charcoal,
  },
  addTagBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4ECE1',
  },
  toggleLabel: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.charcoal,
  },
  toggleDesc: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
    paddingRight: 10,
  },
  saveBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: HBD_THEME.typography.headingBold,
  },
});
