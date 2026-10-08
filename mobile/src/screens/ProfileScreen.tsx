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
import { useAppTheme } from '../context/ThemeContext';
import { ScreenLayout } from '../components/ScreenLayout';

interface ProfileScreenProps {
  onOpenPlanner: () => void;
  onNavigateToFriends?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onOpenPlanner,
  onNavigateToFriends
}) => {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'PREFERENCES' | 'MEMORIES'>('PREFERENCES');

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

  // Memory Vault items accumulated from past celebrations
  const pastMemories = [
    {
      id: 'mem-1',
      title: 'London 29th Rooftop Birthday',
      date: '24 Oct 2025',
      cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
      itemsCount: '18 Photos · 1 Video Reel · 6 Audio Wishes',
      curator: 'Circle of 12 Friends',
    },
    {
      id: 'mem-2',
      title: 'PaySeed Startup Launch Day',
      date: '14 May 2025',
      cover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80',
      itemsCount: '1 Highlight Video · 42 Celebration Cards',
      curator: 'Aisha Bello & Team',
    },
    {
      id: 'mem-3',
      title: 'Family Douala Milestone Gathering',
      date: '18 Dec 2024',
      cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
      itemsCount: '24 Keepsake Photos · Acoustic Choir Audio',
      curator: 'Mama Chantal & Family',
    }
  ];

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
    Alert.alert('Profile Saved', 'Your celebration preferences and birthday countdown have been updated.');
  };

  return (
    <ScreenLayout safeTop safeBottom={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Card */}
        <View style={[styles.profileHeaderCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }} 
                style={[styles.avatar, { borderColor: colors.gold }]} 
              />
              <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.purple }]}>
                <Feather name="camera" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.fullName, { color: colors.fg }]}>{name}</Text>
              <Text style={[styles.handleText, { color: colors.muted }]}>@{handle}</Text>
              <View style={[styles.locationPill, { backgroundColor: colors.purpleSoft }]}>
                <Feather name="map-pin" size={11} color={colors.purple} />
                <Text style={[styles.locationText, { color: colors.purple }]}>{city}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bioText, { color: colors.fg }]}>{bio}</Text>

          {/* Birthday Countdown Banner */}
          <View style={[styles.countdownBanner, { backgroundColor: colors.purple }]}>
            <View style={styles.countdownIconWrap}>
              <Text style={{ fontSize: 24 }}>🎂</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.countdownTag, { color: colors.gold }]}>YOUR CELEBRATION IS COMING</Text>
              <Text style={styles.countdownTitle}>{birthday} (In {daysUntil} days!)</Text>
              <Text style={styles.countdownSub}>Friends in your circle can view your wishlist to surprise you.</Text>
            </View>
          </View>
        </View>

        {/* Tab Switcher: Preferences vs My Memories Vault */}
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'PREFERENCES' && { backgroundColor: colors.purple }]}
            onPress={() => setActiveTab('PREFERENCES')}
          >
            <Feather 
              name="heart" 
              size={13} 
              color={activeTab === 'PREFERENCES' ? '#FFFFFF' : colors.muted} 
            />
            <Text style={[styles.tabBtnText, activeTab === 'PREFERENCES' ? styles.tabBtnTextActive : { color: colors.muted }]}>
              Wishlist & Privacy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'MEMORIES' && { backgroundColor: colors.purple }]}
            onPress={() => setActiveTab('MEMORIES')}
          >
            <Feather 
              name="archive" 
              size={13} 
              color={activeTab === 'MEMORIES' ? '#FFFFFF' : colors.muted} 
            />
            <Text style={[styles.tabBtnText, activeTab === 'MEMORIES' ? styles.tabBtnTextActive : { color: colors.muted }]}>
              My Memories ({pastMemories.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'PREFERENCES' ? (
          <>
            {/* Wishlist / Things I Love */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: colors.purpleSoft }]}>
                  <Feather name="heart" size={14} color={colors.coral} />
                </View>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.fg }]}>Things I Love (Wishlist)</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>Guides your friends when choosing gifts for you.</Text>
                </View>
              </View>

              <View style={styles.tagWrap}>
                {wishlist.map((item, i) => (
                  <View key={i} style={[styles.wishChip, { backgroundColor: colors.purpleSoft }]}>
                    <Text style={[styles.wishChipText, { color: colors.purple }]}>{item}</Text>
                    <TouchableOpacity onPress={() => handleRemoveWish(item)}>
                      <Feather name="x" size={12} color={colors.purple} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.addTagRow}>
                <TextInput 
                  placeholder="Add item (e.g. Perfume, Airpods)..."
                  placeholderTextColor={colors.muted}
                  value={newWish}
                  onChangeText={setNewWish}
                  style={[styles.tagInput, { borderColor: colors.line, color: colors.fg }]}
                  onSubmitEditing={handleAddWish}
                />
                <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: colors.purple }]} onPress={handleAddWish}>
                  <Feather name="plus" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Things to Avoid / Allergies */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: colors.coralSoft }]}>
                  <Feather name="shield" size={14} color={colors.coral} />
                </View>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.fg }]}>Things to Avoid / Allergies</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>Prevents awkward or allergic gifts.</Text>
                </View>
              </View>

              <View style={styles.tagWrap}>
                {avoidList.map((item, i) => (
                  <View key={i} style={[styles.avoidChip, { backgroundColor: colors.coralSoft }]}>
                    <Text style={[styles.avoidChipText, { color: colors.coral }]}>{item}</Text>
                    <TouchableOpacity onPress={() => handleRemoveAvoid(item)}>
                      <Feather name="x" size={12} color={colors.coral} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.addTagRow}>
                <TextInput 
                  placeholder="Add allergy/dislike (e.g. Lilies, Alcohol)..."
                  placeholderTextColor={colors.muted}
                  value={newAvoid}
                  onChangeText={setNewAvoid}
                  style={[styles.tagInput, { borderColor: colors.line, color: colors.fg }]}
                  onSubmitEditing={handleAddAvoid}
                />
                <TouchableOpacity style={[styles.addTagBtn, { backgroundColor: colors.coral }]} onPress={handleAddAvoid}>
                  <Feather name="plus" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Privacy & Appearance Settings */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Text style={[styles.sectionTitle, { color: colors.fg }]}>Appearance & Privacy</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>Customize app theme and delivery encryption.</Text>

              {/* Theme Toggle Row */}
              <View style={[styles.toggleRow, { borderBottomColor: colors.line }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { color: colors.fg }]}>Dark Mode</Text>
                  <Text style={[styles.toggleDesc, { color: colors.muted }]}>Harmonized with client dark theme.</Text>
                </View>
                <Switch 
                  value={isDark} 
                  onValueChange={toggleTheme} 
                  trackColor={{ false: '#ccc', true: colors.purple }}
                />
              </View>

              <View style={[styles.toggleRow, { borderBottomColor: colors.line }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { color: colors.fg }]}>Birthday Visible to Friends Only</Text>
                  <Text style={[styles.toggleDesc, { color: colors.muted }]}>Keep celebration date within your verified circle.</Text>
                </View>
                <Switch 
                  value={isFriendsOnly} 
                  onValueChange={setIsFriendsOnly} 
                  trackColor={{ false: '#ccc', true: colors.purple }}
                />
              </View>

              <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { color: colors.fg }]}>Encrypted Address for Surprise Gifts</Text>
                  <Text style={[styles.toggleDesc, { color: colors.muted }]}>Friends can send gifts without seeing your private street address.</Text>
                </View>
                <Switch 
                  value={addressProtected} 
                  onValueChange={setAddressProtected} 
                  trackColor={{ false: '#ccc', true: colors.purple }}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.purple }]} onPress={handleSaveProfile}>
              <Feather name="check-circle" size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* My Memories Archive */
          <View style={styles.memoriesCol}>
            <Text style={[styles.memoryVaultHeading, { color: colors.purple }]}>
              Celebration Vault
            </Text>
            <Text style={[styles.memoryVaultSub, { color: colors.muted }]}>
              Memories automatically created and archived from your past celebrations.
            </Text>

            {pastMemories.map(mem => (
              <View 
                key={mem.id} 
                style={[styles.memoryCard, { backgroundColor: colors.card, borderColor: colors.line }]}
              >
                <Image source={{ uri: mem.cover }} style={styles.memoryCover} />
                <View style={styles.memoryContent}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.memoryTitle, { color: colors.fg }]}>{mem.title}</Text>
                    <Text style={[styles.memoryDate, { color: colors.muted }]}>{mem.date}</Text>
                  </View>
                  <Text style={[styles.memoryMeta, { color: colors.purple }]}>{mem.itemsCount}</Text>
                  <Text style={[styles.memoryCurator, { color: colors.muted }]}>Preserved by {mem.curator}</Text>
                  
                  <TouchableOpacity 
                    style={[styles.memoryReplayBtn, { backgroundColor: colors.purpleSoft }]}
                    onPress={() => Alert.alert('Celebration Memory', `Reliving ${mem.title}...`)}
                  >
                    <Feather name="play-circle" size={14} color={colors.purple} />
                    <Text style={[styles.memoryReplayText, { color: colors.purple }]}>Relive Celebration</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  profileHeaderCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#5B2A86',
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
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  handleText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  bioText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 14,
  },
  countdownBanner: {
    borderRadius: 14,
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
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.8,
  },
  countdownTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  countdownSub: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  wishChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  avoidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  avoidChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  addTagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  addTagBtn: {
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
  },
  toggleLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  toggleDesc: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    paddingRight: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  memoriesCol: {
    gap: 14,
  },
  memoryVaultHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  memoryVaultSub: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  memoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  memoryCover: {
    width: '100%',
    height: 140,
  },
  memoryContent: {
    padding: 16,
  },
  memoryTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  memoryDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  memoryMeta: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginVertical: 4,
  },
  memoryCurator: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
  },
  memoryReplayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 999,
  },
  memoryReplayText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});
