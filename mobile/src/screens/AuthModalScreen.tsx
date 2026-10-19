import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Platform,
  StatusBar,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth, DEMO_MOBILE_USERS } from '../context/AuthContext';

const PRESET_MUSIC = ['Afrobeats', 'Jazz', 'Classical', 'R&B', 'Hip-Hop', 'Electronic', 'Indie', 'Soul'];
const PRESET_ANIMALS = ['Dogs', 'Cats', 'Wildlife', 'Birds', 'Horses', 'Dolphins'];
const PRESET_HOBBIES = ['Photography', 'Reading', 'Culinary & Baking', 'Tech & Coding', 'Athletics & Running', 'Travel'];
const PRESET_IDOLS = ['Nelson Mandela', 'Steve Jobs', 'Serena Williams', 'Maya Angelou', 'Miles Davis', 'Wangari Maathai'];
const PRESET_GOALS = ['Launch Startup', 'Master a New Craft', 'Run a Marathon', 'Academic Degree', 'Release Creative Album', 'Wedding Milestone'];
const PRESET_WISHES = ['Specialty Coffee Beans', 'Books', 'Minimalist Watch', 'Perfume', 'Wireless Headphones'];
const PRESET_AVOIDS = ['Lilies (allergic)', 'Peanuts', 'Gluten', 'Excessive Sweets'];
const PRESET_TRADITIONS = [
  'Universal Secular',
  'Christian Heritage',
  'Islamic Heritage',
  'Hindu Heritage',
  'Jewish Heritage',
  'Pan-African & Diaspora',
  'East Asian Heritage',
  'Indigenous & Traditional'
];

export const AuthModalScreen: React.FC = () => {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const {
    isAuthModalVisible,
    closeAuthModal,
    authModalMode,
    login,
    signUp,
    switchUser,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [step, setStep] = useState(1);

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Sign up form
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('United Kingdom');
  const [birthDay, setBirthDay] = useState('24');
  const [birthMonth, setBirthMonth] = useState('10');

  // Skippable interest states
  const [selectedMusic, setSelectedMusic] = useState<string[]>(['Afrobeats', 'Jazz']);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>(['Dogs']);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(['Photography', 'Reading']);
  const [selectedIdols, setSelectedIdols] = useState<string[]>(['Nelson Mandela']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Launch Startup']);
  const [selectedWishes, setSelectedWishes] = useState<string[]>(['Specialty Coffee Beans', 'Books']);
  const [selectedAvoids, setSelectedAvoids] = useState<string[]>(['Lilies (allergic)']);
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>(['Universal Secular']);
  const [showTributes, setShowTributes] = useState<boolean>(true);

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleLoginSubmit = async () => {
    if (!loginIdentifier.trim()) {
      Alert.alert('Required', 'Please enter your handle or full name.');
      return;
    }
    const success = await login(loginIdentifier);
    if (!success) {
      Alert.alert('Error', 'Could not sign in with this handle. Please check your credentials.');
    }
  };

  const handleSignUpComplete = async () => {
    if (!name.trim() || !handle.trim()) {
      Alert.alert('Required', 'Please complete your civil full name and handle.');
      setStep(1);
      return;
    }
    await signUp({
      fullName: name.trim(),
      handle: handle.trim(),
      city: city.trim() || 'London',
      country: country.trim() || 'United Kingdom',
      birthDay: parseInt(birthDay) || 24,
      birthMonth: parseInt(birthMonth) || 10,
      isVerifiedCivil: true,
      musicGenres: selectedMusic,
      animalTypes: selectedAnimals,
      hobbies: selectedHobbies,
      idols: selectedIdols,
      personalGoals: selectedGoals,
      wishlist: selectedWishes,
      avoidList: selectedAvoids,
      traditions: selectedTraditions,
      showTributes: showTributes,
    });
    Alert.alert('Celebration Passport Created! 🎉', `Welcome to HBD, ${name}! Your global toast calendar is ready.`);
  };

  return (
    <Modal
      visible={isAuthModalVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={closeAuthModal}
    >
      <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: topPadding }]}>
        {/* Top Header Bar */}
        <View style={[styles.headerBar, { borderBottomColor: colors.line }]}>
          <TouchableOpacity onPress={closeAuthModal} style={styles.closeBtn}>
            <Feather name="x" size={20} color={colors.fg} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.fg }]}>
            {mode === 'login' ? 'Sign In to HBD' : 'Create Celebration Passport'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Mode Switch Tabs */}
        <View style={[styles.tabToggleRow, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <TouchableOpacity
            style={[styles.tabToggleBtn, mode === 'login' && { backgroundColor: colors.purple }]}
            onPress={() => { setMode('login'); setStep(1); }}
          >
            <Text style={[styles.tabToggleText, { color: mode === 'login' ? '#FFF' : colors.muted }]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabToggleBtn, mode === 'signup' && { backgroundColor: colors.purple }]}
            onPress={() => { setMode('signup'); setStep(1); }}
          >
            <Text style={[styles.tabToggleText, { color: mode === 'signup' ? '#FFF' : colors.muted }]}>
              Register Passport
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ========================================================== */}
          {/* LOGIN VIEW                                                 */}
          {/* ========================================================== */}
          {mode === 'login' ? (
            <View style={styles.loginContainer}>
              <View style={[styles.heroIconBadge, { backgroundColor: colors.purpleSoft }]}>
                <Feather name="log-in" size={28} color={colors.purple} />
              </View>
              <Text style={[styles.heroTitle, { color: colors.fg }]}>Welcome Back</Text>
              <Text style={[styles.heroSub, { color: colors.muted }]}>
                Sign in to manage your celebratory circle, toasts & milestone radar.
              </Text>

              {/* Handle input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>HANDLE OR FULL NAME</Text>
                <View style={[styles.inputBox, { borderColor: colors.line, backgroundColor: colors.card }]}>
                  <Text style={{ fontWeight: '700', color: colors.purple, marginRight: 6 }}>@</Text>
                  <TextInput
                    style={[styles.textInput, { color: colors.fg }]}
                    placeholder="e.g. samuel_nd or aisha_tech"
                    placeholderTextColor={colors.muted}
                    value={loginIdentifier}
                    onChangeText={setLoginIdentifier}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: colors.purple }]}
                onPress={handleLoginSubmit}
              >
                <Text style={styles.primaryActionText}>Continue to Passport</Text>
                <Feather name="arrow-right" size={16} color="#FFF" />
              </TouchableOpacity>

              {/* Demo Profiles 1-Tap Login */}
              <View style={styles.demoSection}>
                <Text style={[styles.demoSectionTitle, { color: colors.muted }]}>
                  OR QUICK 1-TAP DEMO SIGN IN
                </Text>
                <View style={styles.demoList}>
                  {DEMO_MOBILE_USERS.map(demo => (
                    <TouchableOpacity
                      key={demo.id}
                      style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.line }]}
                      onPress={() => switchUser(demo)}
                    >
                      <Image source={{ uri: demo.avatarUrl }} style={styles.demoAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.demoName, { color: colors.fg }]}>{demo.fullName}</Text>
                        <Text style={[styles.demoHandle, { color: colors.muted }]}>@{demo.handle} · {demo.city}</Text>
                      </View>
                      <Feather name="arrow-right-circle" size={18} color={colors.purple} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            /* ========================================================== */
            /* SIGN UP VIEW (6 Steps with verified civil identity)       */
            /* ========================================================== */
            <View style={styles.signupContainer}>
              {/* Step indicator bar */}
              <View style={styles.stepProgressBar}>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.stepSegment,
                      { backgroundColor: i <= step ? colors.purple : colors.line }
                    ]}
                  />
                ))}
              </View>
              <View style={styles.stepHeaderRow}>
                <Text style={[styles.stepNumber, { color: colors.muted }]}>STEP {step} OF 7</Text>
                <Text style={[styles.stepTitle, { color: colors.purple }]}>
                  {step === 1 && 'Civil Identity'}
                  {step === 2 && 'Celebration Date'}
                  {step === 3 && 'Passions & Favorites'}
                  {step === 4 && 'Idols & Role Models'}
                  {step === 5 && 'Milestone Radar'}
                  {step === 6 && 'Sacred & Cultural Heritage'}
                  {step === 7 && 'Celebration Wishes'}
                </Text>
              </View>

              {/* STEP 1: Civil Identity */}
              {step === 1 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>Official Civil Identity</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    HBD uses real names from official documents so no celebrant is ever duplicated or celebrated twice.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.muted }]}>LEGAL FULL NAME</Text>
                    <TextInput
                      style={[styles.fullTextInput, { borderColor: colors.line, backgroundColor: colors.card, color: colors.fg }]}
                      placeholder="e.g. Sarah Chinwe Johnson"
                      placeholderTextColor={colors.muted}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.muted }]}>UNIQUE HANDLE</Text>
                    <View style={[styles.inputBox, { borderColor: colors.line, backgroundColor: colors.card }]}>
                      <Text style={{ fontWeight: '700', color: colors.purple, marginRight: 6 }}>@</Text>
                      <TextInput
                        style={[styles.textInput, { color: colors.fg }]}
                        placeholder="sarah.johnson"
                        placeholderTextColor={colors.muted}
                        value={handle}
                        onChangeText={setHandle}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: colors.muted }]}>CITY</Text>
                      <TextInput
                        style={[styles.fullTextInput, { borderColor: colors.line, backgroundColor: colors.card, color: colors.fg }]}
                        placeholder="London"
                        placeholderTextColor={colors.muted}
                        value={city}
                        onChangeText={setCity}
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: colors.muted }]}>COUNTRY</Text>
                      <TextInput
                        style={[styles.fullTextInput, { borderColor: colors.line, backgroundColor: colors.card, color: colors.fg }]}
                        placeholder="United Kingdom"
                        placeholderTextColor={colors.muted}
                        value={country}
                        onChangeText={setCountry}
                      />
                    </View>
                  </View>

                  <View style={[styles.noticeBanner, { backgroundColor: colors.purpleSoft, borderColor: `${colors.purple}30` }]}>
                    <Feather name="shield" size={16} color={colors.purple} style={{ marginTop: 2 }} />
                    <Text style={[styles.noticeText, { color: colors.fg }]}>
                      <Text style={{ fontWeight: '700' }}>Verifiable Passport: </Text>Unverified accounts have limited public accessibility until official document verification is confirmed.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryActionBtn, { backgroundColor: colors.purple }]}
                    onPress={() => {
                      if (!name.trim() || !handle.trim()) {
                        Alert.alert('Required', 'Please enter your legal name and handle.');
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    <Text style={styles.primaryActionText}>Continue to Birthday</Text>
                    <Feather name="arrow-right" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: Celebration Date */}
              {step === 2 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>When do we celebrate you?</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Your primary celebration date anchors your global community toast calendar.
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <View style={[styles.inputGroup, { flex: 2 }]}>
                      <Text style={[styles.inputLabel, { color: colors.muted }]}>BIRTH MONTH (1-12)</Text>
                      <TextInput
                        style={[styles.fullTextInput, { borderColor: colors.line, backgroundColor: colors.card, color: colors.fg }]}
                        placeholder="10"
                        keyboardType="number-pad"
                        placeholderTextColor={colors.muted}
                        value={birthMonth}
                        onChangeText={setBirthMonth}
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={[styles.inputLabel, { color: colors.muted }]}>DAY (1-31)</Text>
                      <TextInput
                        style={[styles.fullTextInput, { borderColor: colors.line, backgroundColor: colors.card, color: colors.fg }]}
                        placeholder="24"
                        keyboardType="number-pad"
                        placeholderTextColor={colors.muted}
                        value={birthDay}
                        onChangeText={setBirthDay}
                      />
                    </View>
                  </View>

                  <View style={[styles.noticeBanner, { backgroundColor: colors.purpleSoft, borderColor: `${colors.purple}30` }]}>
                    <Feather name="lock" size={16} color={colors.purple} style={{ marginTop: 2 }} />
                    <Text style={[styles.noticeText, { color: colors.fg }]}>
                      <Text style={{ fontWeight: '700' }}>Privacy by Design: </Text>Your birth year is confidential. Your address remains private; friends and well-wishers only access secure gift-routing options.
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(1)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={() => setStep(3)}>
                      <Text style={styles.primaryActionText}>Next: Passions</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: Passions & Favorites (Skippable) */}
              {step === 3 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>What fuels your everyday joy?</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Helps tailor your 1-Day View inspiration radar. (Optional & skippable)
                  </Text>

                  {/* Music */}
                  <Text style={[styles.chipGroupTitle, { color: colors.purple }]}>MUSIC GENRES</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_MUSIC.map(m => {
                      const active = selectedMusic.includes(m);
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[styles.chip, active && { backgroundColor: colors.purpleSoft, borderColor: colors.purple }]}
                          onPress={() => toggleItem(selectedMusic, setSelectedMusic, m)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.purple : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{m}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Animals */}
                  <Text style={[styles.chipGroupTitle, { color: colors.coral }]}>FAVORITE ANIMALS & WILDLIFE</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_ANIMALS.map(a => {
                      const active = selectedAnimals.includes(a);
                      return (
                        <TouchableOpacity
                          key={a}
                          style={[styles.chip, active && { backgroundColor: `${colors.coral}15`, borderColor: colors.coral }]}
                          onPress={() => toggleItem(selectedAnimals, setSelectedAnimals, a)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.coral : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{a}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Hobbies */}
                  <Text style={[styles.chipGroupTitle, { color: colors.purple }]}>HOBBIES & CRAFTS</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_HOBBIES.map(h => {
                      const active = selectedHobbies.includes(h);
                      return (
                        <TouchableOpacity
                          key={h}
                          style={[styles.chip, active && { backgroundColor: colors.purpleSoft, borderColor: colors.purple }]}
                          onPress={() => toggleItem(selectedHobbies, setSelectedHobbies, h)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.purple : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{h}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(2)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.skipActionBtn]} onPress={() => setStep(4)}>
                      <Text style={[styles.skipActionText, { color: colors.muted }]}>Skip for now →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={() => setStep(4)}>
                      <Text style={styles.primaryActionText}>Next: Idols</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 4: Idols & Role Models (Skippable) */}
              {step === 4 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>Who are your role models & idols?</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Pioneers and visionaries who inspire your life. (Optional & skippable)
                  </Text>

                  <View style={styles.chipWrap}>
                    {PRESET_IDOLS.map(idol => {
                      const active = selectedIdols.includes(idol);
                      return (
                        <TouchableOpacity
                          key={idol}
                          style={[styles.chip, active && { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}
                          onPress={() => toggleItem(selectedIdols, setSelectedIdols, idol)}
                        >
                          <Text style={[styles.chipText, { color: active ? '#B45309' : colors.fg }]}>
                            {active ? '★ ' : '+ '}{idol}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={[styles.noticeBanner, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', marginTop: 16 }]}>
                    <Feather name="star" size={16} color="#D97706" style={{ marginTop: 2 }} />
                    <Text style={[styles.noticeText, { color: '#92400E' }]}>
                      <Text style={{ fontWeight: '700' }}>Luminary Spotlights: </Text>On their historic milestones and anniversaries, HBD spotlights them on your 1-Day View to inspire you.
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(3)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.skipActionBtn]} onPress={() => setStep(5)}>
                      <Text style={[styles.skipActionText, { color: colors.muted }]}>Skip for now →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={() => setStep(5)}>
                      <Text style={styles.primaryActionText}>Next: Goals</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 5: Milestone Radar (Skippable) */}
              {step === 5 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>What milestones are you pursuing?</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Track startups, creative debuts, academic runs, and life milestones. (Optional & skippable)
                  </Text>

                  <View style={styles.chipWrap}>
                    {PRESET_GOALS.map(goal => {
                      const active = selectedGoals.includes(goal);
                      return (
                        <TouchableOpacity
                          key={goal}
                          style={[styles.chip, active && { backgroundColor: colors.purpleSoft, borderColor: colors.purple }]}
                          onPress={() => toggleItem(selectedGoals, setSelectedGoals, goal)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.purple : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{goal}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={[styles.noticeBanner, { backgroundColor: colors.purpleSoft, borderColor: `${colors.purple}30`, marginTop: 16 }]}>
                    <Feather name="award" size={16} color={colors.purple} style={{ marginTop: 2 }} />
                    <Text style={[styles.noticeText, { color: colors.fg }]}>
                      <Text style={{ fontWeight: '700' }}>Venture Objects: </Text>You can create dedicated startup or wedding objects attached to your passport anytime to commemorate their founding dates.
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(4)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.skipActionBtn]} onPress={() => setStep(6)}>
                      <Text style={[styles.skipActionText, { color: colors.muted }]}>Skip for now →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={() => setStep(6)}>
                      <Text style={styles.primaryActionText}>Next: Heritage</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 6: Sacred & Cultural Heritage (Skippable) */}
              {step === 6 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>Sacred & Cultural Heritage</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Choose cultural or spiritual traditions you observe to tailor your calendar and avoid unneeded noise. (Optional)
                  </Text>

                  <Text style={[styles.chipGroupTitle, { color: '#6366F1' }]}>TRADITIONS & OBSERVANCES</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_TRADITIONS.map(t => {
                      const active = selectedTraditions.includes(t);
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.chip, active && { backgroundColor: '#EEF2FF', borderColor: '#6366F1' }]}
                          onPress={() => toggleItem(selectedTraditions, setSelectedTraditions, t)}
                        >
                          <Text style={[styles.chipText, { color: active ? '#4338CA' : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Memorial & In Memoriam Toggle */}
                  <View style={[styles.noticeBanner, { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1', marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
                        Celebration of Life & Memorial Tributes
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        Include dignified In Memoriam anniversaries, legacy tributes, and remembrance days on your calendar.
                      </Text>
                    </View>
                    <Switch
                      value={showTributes}
                      onValueChange={setShowTributes}
                      trackColor={{ false: '#CBD5E1', true: '#475569' }}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(5)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.skipActionBtn]} onPress={() => setStep(7)}>
                      <Text style={[styles.skipActionText, { color: colors.muted }]}>Skip for now →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={() => setStep(7)}>
                      <Text style={styles.primaryActionText}>Next: Wishes</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 7: Celebration Wishes & Avoids */}
              {step === 7 && (
                <View>
                  <Text style={[styles.stepHeading, { color: colors.fg }]}>How do you like to be celebrated?</Text>
                  <Text style={[styles.stepSubheading, { color: colors.muted }]}>
                    Helps your circle and the HBD Gift Engine choose what brings you genuine joy.
                  </Text>

                  {/* Wishes */}
                  <Text style={[styles.chipGroupTitle, { color: colors.purple }]}>THINGS YOU LOVE (WISHLIST)</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_WISHES.map(w => {
                      const active = selectedWishes.includes(w);
                      return (
                        <TouchableOpacity
                          key={w}
                          style={[styles.chip, active && { backgroundColor: colors.purpleSoft, borderColor: colors.purple }]}
                          onPress={() => toggleItem(selectedWishes, setSelectedWishes, w)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.purple : colors.fg }]}>
                            {active ? '✓ ' : '+ '}{w}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Avoids */}
                  <Text style={[styles.chipGroupTitle, { color: colors.coral }]}>THINGS TO AVOID (ALLERGIES / DISLIKES)</Text>
                  <View style={styles.chipWrap}>
                    {PRESET_AVOIDS.map(a => {
                      const active = selectedAvoids.includes(a);
                      return (
                        <TouchableOpacity
                          key={a}
                          style={[styles.chip, active && { backgroundColor: `${colors.coral}15`, borderColor: colors.coral }]}
                          onPress={() => toggleItem(selectedAvoids, setSelectedAvoids, a)}
                        >
                          <Text style={[styles.chipText, { color: active ? colors.coral : colors.fg }]}>
                            {active ? '✕ ' : '+ '}{a}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                    <TouchableOpacity style={[styles.secondaryActionBtn, { borderColor: colors.line }]} onPress={() => setStep(6)}>
                      <Text style={[styles.secondaryActionText, { color: colors.fg }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryActionBtn, { flex: 1, backgroundColor: colors.purple }]} onPress={handleSignUpComplete}>
                      <Text style={styles.primaryActionText}>Complete Passport 🎉</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
  },
  tabToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  tabToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loginContainer: {
    alignItems: 'center',
  },
  heroIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  fullTextInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  primaryActionBtn: {
    width: '100%',
    height: 50,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  primaryActionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    paddingHorizontal: 18,
    height: 50,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skipActionBtn: {
    paddingHorizontal: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  demoSection: {
    width: '100%',
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  demoSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginBottom: 14,
  },
  demoList: {
    gap: 10,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  demoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  demoName: {
    fontSize: 14,
    fontWeight: '700',
  },
  demoHandle: {
    fontSize: 12,
  },
  signupContainer: {},
  stepProgressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  stepSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  stepSubheading: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  chipGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
