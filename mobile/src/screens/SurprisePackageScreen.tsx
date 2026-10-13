import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { ScreenLayout } from '../components/ScreenLayout';
import { mockSurprisePackages } from '../mockData';
import type { 
  SurprisePackage, 
  SurpriseContribution, 
  ContributionType 
} from '../../../shared/types';

interface SurprisePackageScreenProps {
  onBack: () => void;
  preselectedCelebrant?: string;
  onNavigateToGifts?: (recipient: string) => void;
}

const { width } = Dimensions.get('window');

export const SurprisePackageScreen: React.FC<SurprisePackageScreenProps> = ({
  onBack,
  preselectedCelebrant
}) => {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const [packages, setPackages] = useState<SurprisePackage[]>(mockSurprisePackages);
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    if (preselectedCelebrant) {
      const match = mockSurprisePackages.find(p => 
        p.celebrantName.toLowerCase().includes(preselectedCelebrant.toLowerCase())
      );
      if (match) return match.id;
    }
    return mockSurprisePackages[0].id;
  });

  const activePackage = packages.find(p => p.id === selectedPackageId) || packages[0];
  const [activeTab, setActiveTab] = useState<'WAR_ROOM' | 'MEDIA' | 'GIFTS' | 'REEL'>('WAR_ROOM');

  // Chat state
  const [chatInput, setChatInput] = useState('');

  // Contribution modal state
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contribType, setContribType] = useState<ContributionType>('VIDEO');
  const [contribText, setContribText] = useState('');
  const [contribAmount, setContribAmount] = useState('50');
  const [contribTitle, setContribTitle] = useState('');
  const [contribDesc, setContribDesc] = useState('');
  const [contribFlagReel, setContribFlagReel] = useState(true);

  // Unboxing Modal state
  const [isUnboxingModalOpen, setIsUnboxingModalOpen] = useState(false);
  const [unboxingStep, setUnboxingStep] = useState<'UNWRAP' | 'REEL' | 'GIFTS'>('UNWRAP');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [thankYouNote, setThankYouNote] = useState('');
  const [hasSentThankYou, setHasSentThankYou] = useState(false);

  // Send message in war room
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      packageId: activePackage.id,
      senderId: 'u-1',
      senderName: 'Samuel Ndamukong',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: chatInput.trim(),
      createdAt: new Date().toISOString()
    };

    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        return {
          ...p,
          discussionMessages: [...p.discussionMessages, newMsg]
        };
      }
      return p;
    }));

    setChatInput('');
  };

  // Toggle flag for compilation reel
  const handleToggleCompilationFlag = (contributionId: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        const updatedContribs = p.contributions.map(c => {
          if (c.id === contributionId) {
            const nextFlagged = !c.isFlaggedForCompilation;
            return {
              ...c,
              isFlaggedForCompilation: nextFlagged,
              compilationOrder: nextFlagged ? (c.compilationOrder || p.contributions.filter(x => x.isFlaggedForCompilation).length + 1) : undefined
            };
          }
          return c;
        });

        // Recompute compilation reel items
        const flagged = updatedContribs
          .filter(c => c.isFlaggedForCompilation)
          .sort((a, b) => (a.compilationOrder || 0) - (b.compilationOrder || 0));

        return {
          ...p,
          contributions: updatedContribs,
          compilationReel: {
            id: p.compilationReel?.id || `cr-${Date.now()}`,
            packageId: p.id,
            title: `${p.celebrantName} Compilation Reel`,
            totalDurationSeconds: flagged.reduce((acc, curr) => acc + (curr.durationSeconds || 15), 0),
            soundtrackTitle: p.compilationReel?.soundtrackTitle || 'Acoustic Joy Strings & Chimes',
            compiledItems: flagged.map((c, idx) => ({
              contributionId: c.id,
              mediaUrl: c.mediaUrl || c.thumbnailUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
              type: c.type === 'VIDEO' ? 'VIDEO' as const : c.type === 'PHOTO' ? 'PHOTO' as const : 'LETTER' as const,
              senderName: c.contributorName,
              caption: c.compilationCaption || c.messageText?.slice(0, 50) || `${c.contributorName}'s contribution`,
              durationSeconds: c.durationSeconds || 15,
              order: idx + 1
            })),
            isReady: flagged.length > 0,
            compiledAt: new Date().toISOString()
          }
        };
      }
      return p;
    }));
  };

  // Add contribution
  const handleAddContribution = () => {
    let parsedAmount = 0;
    if (contribType === 'MONEY') {
      parsedAmount = parseFloat(contribAmount) || 0;
      if (parsedAmount <= 0) {
        Alert.alert('Invalid Amount', 'Please specify a valid contribution amount.');
        return;
      }
    } else if (contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') {
      if (!contribTitle.trim()) {
        Alert.alert('Required Title', 'Please give this gift or service a name.');
        return;
      }
    } else {
      if (!contribText.trim()) {
        Alert.alert('Required Message', 'Please enter your message or wish.');
        return;
      }
    }

    const newContrib: SurpriseContribution = {
      id: `c-${Date.now()}`,
      packageId: activePackage.id,
      contributorId: 'u-1',
      contributorName: 'Samuel Ndamukong',
      contributorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      type: contribType,
      messageText: contribText.trim() || undefined,
      amountContributed: contribType === 'MONEY' ? parsedAmount : undefined,
      currency: activePackage.currency,
      giftTitle: (contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') ? contribTitle.trim() : undefined,
      giftDescription: (contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') ? contribDesc.trim() : undefined,
      estimatedValue: (contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') ? 50 : undefined,
      deliveryMethod: contribType === 'SERVICE' ? 'PERFORMED_ON_DAY' : contribType === 'PHYSICAL_GIFT' ? 'IN_PERSON' : undefined,
      mediaUrl: contribType === 'VIDEO' 
        ? 'https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-his-hand-in-a-video-call-42861-large.mp4' 
        : contribType === 'PHOTO' 
        ? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80' 
        : undefined,
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      durationSeconds: contribType === 'VIDEO' ? 30 : contribType === 'VOICE_NOTE' ? 20 : 15,
      isFlaggedForCompilation: contribFlagReel && (contribType === 'VIDEO' || contribType === 'PHOTO' || contribType === 'LETTER'),
      compilationOrder: contribFlagReel ? activePackage.contributions.length + 1 : undefined,
      compilationCaption: contribText ? contribText.slice(0, 45) : `${contribType} wish`,
      submittedAt: new Date().toISOString()
    };

    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        const nextAmount = p.currentPooledAmount + parsedAmount;
        const nextContribs = [...p.contributions, newContrib];
        return {
          ...p,
          contributions: nextContribs,
          currentPooledAmount: nextAmount
        };
      }
      return p;
    }));

    setIsContributeModalOpen(false);
    setContribText('');
    setContribTitle('');
    setContribDesc('');
    Alert.alert('Pledged!', 'Your contribution has been added to the secret package.');
  };

  // Deliver package
  const handleDeliverPackage = () => {
    Alert.alert(
      'Deliver Surprise Package?',
      `This will unlock the secret package for ${activePackage.celebrantName} and launch the celebration unboxing!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deliver Now 🎁',
          onPress: () => {
            setPackages(prev => prev.map(p => {
              if (p.id === activePackage.id) {
                return {
                  ...p,
                  status: 'DELIVERED',
                  deliveredAt: new Date().toISOString()
                };
              }
              return p;
            }));
            setIsUnboxingModalOpen(true);
            setUnboxingStep('UNWRAP');
            setCurrentReelIndex(0);
          }
        }
      ]
    );
  };

  const flaggedItems = activePackage.contributions.filter(c => c.isFlaggedForCompilation);
  const moneyContributions = activePackage.contributions.filter(c => c.type === 'MONEY');
  const physicalContributions = activePackage.contributions.filter(c => c.type === 'PHYSICAL_GIFT');
  const serviceContributions = activePackage.contributions.filter(c => c.type === 'SERVICE');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top App Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.line, paddingTop: topInset + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={[styles.backBtn, { backgroundColor: colors.purpleSoft }]} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={18} color={colors.purple} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="package" size={16} color={colors.coral} />
              <Text style={[styles.headerTitle, { color: colors.fg }]} numberOfLines={1}>
                {activePackage.title}
              </Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
              Celebrant: {activePackage.celebrantName} • {activePackage.celebrantRelationship}
            </Text>
          </View>

          {/* Deliver CTA Button */}
          <TouchableOpacity 
            style={[
              styles.deliverBtn, 
              { backgroundColor: activePackage.status === 'DELIVERED' ? '#16a34a' : colors.coral }
            ]}
            onPress={handleDeliverPackage}
            activeOpacity={0.8}
          >
            <Feather name={activePackage.status === 'DELIVERED' ? 'eye' : 'send'} size={14} color="#FFFFFF" />
            <Text style={styles.deliverBtnText}>
              {activePackage.status === 'DELIVERED' ? 'Unboxed' : 'Deliver'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stealth Banner */}
        <View style={[styles.stealthBanner, { backgroundColor: isDark ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.1)' }]}>
          <Feather name="shield" size={14} color={colors.coral} />
          <Text style={[styles.stealthText, { color: colors.coral }]}>
            STEALTH MODE ACTIVE: Hidden completely from {activePackage.celebrantName}
          </Text>
        </View>

        {/* Package Switcher if multiple */}
        {packages.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.switcherScroll}>
            {packages.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.switcherChip,
                  {
                    backgroundColor: p.id === activePackage.id ? colors.purple : colors.bg,
                    borderColor: colors.line
                  }
                ]}
                onPress={() => setSelectedPackageId(p.id)}
              >
                <Text style={[
                  styles.switcherChipText,
                  { color: p.id === activePackage.id ? '#FFFFFF' : colors.fg }
                ]}>
                  {p.celebrantName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Main Content Area */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 }]} showsVerticalScrollIndicator={false}>
          {/* Quick Metrics Bar: Money Pool + Gifts + Services + Reel Scenes */}
          <View style={[styles.metricsCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Group Pool</Text>
              <Text style={[styles.metricValue, { color: colors.purple }]}>
                ${activePackage.currentPooledAmount}
              </Text>
              <Text style={[styles.metricSub, { color: colors.muted }]}>
                {activePackage.hasPooledGoal ? `Goal: $${activePackage.pooledGoalAmount}` : 'Fluid Pot'}
              </Text>
            </View>

            <View style={[styles.metricDivider, { backgroundColor: colors.line }]} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Gifts & Services</Text>
              <Text style={[styles.metricValue, { color: colors.gold }]}>
                {physicalContributions.length + serviceContributions.length}
              </Text>
              <Text style={[styles.metricSub, { color: colors.muted }]}>
                Pledged
              </Text>
            </View>

            <View style={[styles.metricDivider, { backgroundColor: colors.line }]} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>Reel Scenes</Text>
              <Text style={[styles.metricValue, { color: colors.coral }]}>
                {flaggedItems.length}
              </Text>
              <Text style={[styles.metricSub, { color: colors.muted }]}>
                Compiled
              </Text>
            </View>
          </View>

          {/* Segmented Navigation Bar */}
          <View style={[styles.tabsRow, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'WAR_ROOM' && { borderBottomColor: colors.purple, borderBottomWidth: 2 }
              ]}
              onPress={() => setActiveTab('WAR_ROOM')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'WAR_ROOM' ? colors.purple : colors.muted }
              ]}>
                War Room
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'MEDIA' && { borderBottomColor: colors.purple, borderBottomWidth: 2 }
              ]}
              onPress={() => setActiveTab('MEDIA')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'MEDIA' ? colors.purple : colors.muted }
              ]}>
                Tributes ({activePackage.contributions.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'GIFTS' && { borderBottomColor: colors.purple, borderBottomWidth: 2 }
              ]}
              onPress={() => setActiveTab('GIFTS')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'GIFTS' ? colors.purple : colors.muted }
              ]}>
                Registry
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'REEL' && { borderBottomColor: colors.purple, borderBottomWidth: 2 }
              ]}
              onPress={() => setActiveTab('REEL')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'REEL' ? colors.purple : colors.muted }
              ]}>
                🎬 Reel ({flaggedItems.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: WAR ROOM CHAT */}
          {activeTab === 'WAR_ROOM' && (
            <View style={styles.tabSection}>
              <View style={styles.chatMessageList}>
                {activePackage.discussionMessages.map(msg => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.chatMessageCard, 
                      { 
                        backgroundColor: msg.senderId === 'u-1' ? (isDark ? '#2D1B4E' : '#F6EFFE') : colors.card,
                        borderColor: colors.line 
                      }
                    ]}
                  >
                    <View style={styles.chatHeader}>
                      <Image source={{ uri: msg.senderAvatar }} style={styles.senderAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.senderName, { color: colors.fg }]}>{msg.senderName}</Text>
                        <Text style={[styles.chatTimestamp, { color: colors.muted }]}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.chatBodyText, { color: colors.fg }]}>{msg.text}</Text>
                  </View>
                ))}
              </View>

              {/* Chat Input Box */}
              <View style={[styles.chatInputWrap, { backgroundColor: colors.card, borderColor: colors.line }]}>
                <TextInput
                  style={[styles.chatInputField, { color: colors.fg }]}
                  placeholder={`Secret coordinate with circle...`}
                  placeholderTextColor={colors.muted}
                  value={chatInput}
                  onChangeText={setChatInput}
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity 
                  style={[styles.chatSendBtn, { backgroundColor: chatInput.trim() ? colors.purple : colors.line }]}
                  onPress={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  <Feather name="send" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 2: TRIBUTES & MEDIA (WITH COORDINATOR COMPILATION TOOL) */}
          {activeTab === 'MEDIA' && (
            <View style={styles.tabSection}>
              {/* Add Tribute CTA */}
              <TouchableOpacity 
                style={[styles.addTributeBtn, { backgroundColor: colors.purple }]}
                onPress={() => setIsContributeModalOpen(true)}
              >
                <Feather name="plus-circle" size={16} color="#FFFFFF" />
                <Text style={styles.addTributeBtnText}>Add Tribute, Media or Gift</Text>
              </TouchableOpacity>

              <Text style={[styles.subSectionTitle, { color: colors.muted }]}>
                CIRCLE CONTRIBUTIONS & REEL INDEXING
              </Text>

              {activePackage.contributions.map(c => {
                const isFlagged = !!c.isFlaggedForCompilation;
                return (
                  <View 
                    key={c.id} 
                    style={[
                      styles.tributeCard, 
                      { backgroundColor: colors.card, borderColor: isFlagged ? colors.coral : colors.line }
                    ]}
                  >
                    <View style={styles.tributeTopRow}>
                      <Image source={{ uri: c.contributorAvatar }} style={styles.tributeAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.tributeName, { color: colors.fg }]}>{c.contributorName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={[styles.typePill, { backgroundColor: colors.purpleSoft }]}>
                            <Text style={[styles.typePillText, { color: colors.purple }]}>
                              {c.type.replace('_', ' ')}
                            </Text>
                          </View>
                          {c.durationSeconds && (
                            <Text style={[styles.durationText, { color: colors.muted }]}>
                              ⏱ {c.durationSeconds}s
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Coordinator Compilation Flag Toggle */}
                      <TouchableOpacity
                        style={[
                          styles.flagReelBtn,
                          {
                            backgroundColor: isFlagged ? colors.coral : colors.bg,
                            borderColor: isFlagged ? colors.coral : colors.line
                          }
                        ]}
                        onPress={() => handleToggleCompilationFlag(c.id)}
                        activeOpacity={0.8}
                      >
                        <Feather name="film" size={12} color={isFlagged ? '#FFFFFF' : colors.muted} />
                        <Text style={[
                          styles.flagReelBtnText,
                          { color: isFlagged ? '#FFFFFF' : colors.muted }
                        ]}>
                          {isFlagged ? `Scene #${c.compilationOrder || 1}` : 'Flag for Reel'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Content text or preview */}
                    {c.messageText && (
                      <Text style={[styles.tributeMessage, { color: colors.fg }]}>
                        "{c.messageText}"
                      </Text>
                    )}

                    {c.giftTitle && (
                      <View style={[styles.giftHighlightBox, { backgroundColor: colors.purpleSoft }]}>
                        <Feather name="gift" size={14} color={colors.purple} />
                        <Text style={[styles.giftHighlightTitle, { color: colors.purple }]}>
                          {c.giftTitle} {c.estimatedValue ? `($${c.estimatedValue})` : ''}
                        </Text>
                      </View>
                    )}

                    {c.mediaUrl && (
                      <View style={styles.mediaPreviewThumb}>
                        <Image source={{ uri: c.thumbnailUrl || c.mediaUrl }} style={styles.thumbImage} />
                        <View style={styles.playIconOverlay}>
                          <Feather name="play" size={20} color="#FFFFFF" />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* TAB 3: REGISTRY & PLEDGES */}
          {activeTab === 'GIFTS' && (
            <View style={styles.tabSection}>
              {/* Money Pool Card */}
              <View style={[styles.registryCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Feather name="dollar-sign" size={18} color={colors.purple} />
                    <Text style={[styles.registryCardTitle, { color: colors.fg }]}>Group Money Pot</Text>
                  </View>
                  <Text style={[styles.potTotal, { color: colors.purple }]}>
                    ${activePackage.currentPooledAmount} USD
                  </Text>
                </View>
                <Text style={[styles.registrySub, { color: colors.muted, marginTop: 4 }]}>
                  {moneyContributions.length} circle members pooled towards the group celebration.
                </Text>
              </View>

              {/* Physical Gifts Card */}
              <Text style={[styles.subSectionTitle, { color: colors.muted, marginTop: 14 }]}>
                PHYSICAL GIFTS PLEDGED
              </Text>
              {physicalContributions.length === 0 ? (
                <Text style={{ color: colors.muted, fontSize: 13, marginVertical: 8 }}>
                  No physical gifts pledged yet.
                </Text>
              ) : (
                physicalContributions.map(g => (
                  <View key={g.id} style={[styles.registryItemCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                    <Feather name="package" size={16} color={colors.gold} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.registryItemName, { color: colors.fg }]}>{g.giftTitle}</Text>
                      <Text style={[styles.registryItemDesc, { color: colors.muted }]}>{g.giftDescription}</Text>
                      <Text style={[styles.registryItemPledger, { color: colors.purple }]}>
                        Pledged by {g.contributorName} • Delivery: {g.deliveryMethod || 'Courier'}
                      </Text>
                    </View>
                  </View>
                ))
              )}

              {/* Service Pledges Card */}
              <Text style={[styles.subSectionTitle, { color: colors.muted, marginTop: 14 }]}>
                SERVICES & EXPERIENCES PLEDGED
              </Text>
              {serviceContributions.length === 0 ? (
                <Text style={{ color: colors.muted, fontSize: 13, marginVertical: 8 }}>
                  No services pledged yet.
                </Text>
              ) : (
                serviceContributions.map(s => (
                  <View key={s.id} style={[styles.registryItemCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                    <Feather name="award" size={16} color={colors.coral} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.registryItemName, { color: colors.fg }]}>{s.giftTitle}</Text>
                      <Text style={[styles.registryItemDesc, { color: colors.muted }]}>{s.giftDescription}</Text>
                      <Text style={[styles.registryItemPledger, { color: colors.coral }]}>
                        Pledged by {s.contributorName} • Performed on Birthday
                      </Text>
                    </View>
                  </View>
                ))
              )}

              <TouchableOpacity 
                style={[styles.addTributeBtn, { backgroundColor: colors.coral, marginTop: 16 }]}
                onPress={() => setIsContributeModalOpen(true)}
              >
                <Feather name="plus-circle" size={16} color="#FFFFFF" />
                <Text style={styles.addTributeBtnText}>Pledge Gift or Service</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 4: COMPILATION REEL TIMELINE */}
          {activeTab === 'REEL' && (
            <View style={styles.tabSection}>
              <View style={[styles.reelHeaderCard, { backgroundColor: colors.purple }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Feather name="film" size={24} color={colors.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reelHeaderTitle}>
                      {activePackage.compilationReel?.title || 'Celebration Compilation Reel'}
                    </Text>
                    <Text style={styles.reelHeaderMeta}>
                      🎵 Soundtrack: {activePackage.compilationReel?.soundtrackTitle || 'Acoustic Joy Strings'}
                    </Text>
                    <Text style={styles.reelHeaderMeta}>
                      ⏱ {activePackage.compilationReel?.totalDurationSeconds || 0} seconds total length
                    </Text>
                  </View>
                </View>

                {/* Preview Reel Modal Button */}
                <TouchableOpacity 
                  style={[styles.previewReelBtn, { backgroundColor: colors.gold }]}
                  onPress={() => {
                    setIsUnboxingModalOpen(true);
                    setUnboxingStep('REEL');
                  }}
                  activeOpacity={0.8}
                >
                  <Feather name="play" size={14} color="#1A1A1A" />
                  <Text style={styles.previewReelBtnText}>Play Full Unboxing Reel</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.subSectionTitle, { color: colors.muted, marginTop: 16 }]}>
                INDEXED TIMELINE SCENES ({flaggedItems.length})
              </Text>

              {flaggedItems.length === 0 ? (
                <View style={[styles.emptyReelBox, { backgroundColor: colors.card, borderColor: colors.line }]}>
                  <Text style={[styles.emptyReelText, { color: colors.muted }]}>
                    No items flagged for the reel yet. Go to the "Tributes" tab and tap "Flag for Reel" on any video, photo or letter.
                  </Text>
                </View>
              ) : (
                flaggedItems.map((item, idx) => (
                  <View key={item.id} style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                    <View style={[styles.timelineBadge, { backgroundColor: colors.coral }]}>
                      <Text style={styles.timelineBadgeText}>Scene {idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.timelineTitle, { color: colors.fg }]}>
                        {item.contributorName} ({item.type.replace('_', ' ')})
                      </Text>
                      <Text style={[styles.timelineCaption, { color: colors.muted }]}>
                        {item.compilationCaption || item.messageText || item.giftTitle}
                      </Text>
                      <Text style={[styles.timelineDuration, { color: colors.purple }]}>
                        ⏱ {item.durationSeconds || 15}s scene
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL 1: ADD CONTRIBUTION / PLEDGE */}
      <Modal
        visible={isContributeModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsContributeModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.fg }]}>Add Surprise Contribution</Text>
              <TouchableOpacity onPress={() => setIsContributeModalOpen(false)}>
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Selector */}
              <Text style={[styles.inputLabel, { color: colors.muted }]}>Contribution Type</Text>
              <View style={styles.typeGrid}>
                {(['VIDEO', 'PHOTO', 'MONEY', 'PHYSICAL_GIFT', 'SERVICE', 'LETTER'] as ContributionType[]).map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeSelectorBtn,
                      {
                        backgroundColor: contribType === t ? colors.purple : colors.bg,
                        borderColor: colors.line
                      }
                    ]}
                    onPress={() => setContribType(t)}
                  >
                    <Text style={[
                      styles.typeSelectorText,
                      { color: contribType === t ? '#FFFFFF' : colors.fg }
                    ]}>
                      {t.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {contribType === 'MONEY' && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.inputLabel, { color: colors.muted }]}>Amount ($ USD)</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor={colors.muted}
                    value={contribAmount}
                    onChangeText={setContribAmount}
                  />
                </View>
              )}

              {(contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.inputLabel, { color: colors.muted }]}>Gift or Service Title</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                    placeholder={contribType === 'SERVICE' ? 'e.g. Acoustic choir singing at door' : 'e.g. Silk Scarf & Brooch'}
                    placeholderTextColor={colors.muted}
                    value={contribTitle}
                    onChangeText={setContribTitle}
                  />

                  <Text style={[styles.inputLabel, { color: colors.muted, marginTop: 8 }]}>Description & Delivery Details</Text>
                  <TextInput
                    style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line, height: 60 }]}
                    multiline
                    placeholder="Tell the group how this will be presented..."
                    placeholderTextColor={colors.muted}
                    value={contribDesc}
                    onChangeText={setContribDesc}
                  />
                </View>
              )}

              <Text style={[styles.inputLabel, { color: colors.muted, marginTop: 12 }]}>
                {contribType === 'MONEY' ? 'Accompanying Note' : 'Message / Tribute Wish'}
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line, height: 80 }]}
                multiline
                placeholder="Write your personal wish or tribute..."
                placeholderTextColor={colors.muted}
                value={contribText}
                onChangeText={setContribText}
              />

              {/* Flag for Reel Toggle */}
              {(contribType === 'VIDEO' || contribType === 'PHOTO' || contribType === 'LETTER') && (
                <TouchableOpacity 
                  style={styles.flagCheckboxRow}
                  onPress={() => setContribFlagReel(prev => !prev)}
                >
                  <Feather 
                    name={contribFlagReel ? "check-square" : "square"} 
                    size={18} 
                    color={contribFlagReel ? colors.coral : colors.muted} 
                  />
                  <Text style={[styles.flagCheckboxLabel, { color: colors.fg }]}>
                    Flag to automatically index into the final compilation reel
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.modalSubmitBtn, { backgroundColor: colors.purple }]}
                onPress={handleAddContribution}
              >
                <Text style={styles.modalSubmitBtnText}>Submit Contribution</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: UNBOXING CEREMONY (CELEBRANT VIEW) */}
      <Modal
        visible={isUnboxingModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsUnboxingModalOpen(false)}
      >
        <View style={styles.unboxingOverlay}>
          <View style={[styles.unboxingModalCard, { backgroundColor: colors.card }]}>
            {/* Step 1: Unwrap ribbon */}
            {unboxingStep === 'UNWRAP' && (
              <View style={styles.unwrapContainer}>
                <Text style={styles.unwrapIcon}>🎁</Text>
                <Text style={[styles.unwrapTitle, { color: colors.fg }]}>
                  A Surprise Package has arrived!
                </Text>
                <Text style={[styles.unwrapSub, { color: colors.muted }]}>
                  Organized in stealth by Samuel and your circle for your special celebration!
                </Text>
                <TouchableOpacity 
                  style={[styles.unwrapActionBtn, { backgroundColor: colors.coral }]}
                  onPress={() => setUnboxingStep('REEL')}
                >
                  <Text style={styles.unwrapActionBtnText}>✨ Unwrap & Watch Compilation</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Play Compilation Reel Slides */}
            {unboxingStep === 'REEL' && (
              <View style={styles.reelPlaybackContainer}>
                <View style={styles.reelPlaybackHeader}>
                  <Text style={[styles.reelPlaybackTitle, { color: colors.fg }]}>
                    {activePackage.compilationReel?.title}
                  </Text>
                  <Text style={[styles.reelPlaybackMusic, { color: colors.gold }]}>
                    🎵 {activePackage.compilationReel?.soundtrackTitle}
                  </Text>
                </View>

                {/* Simulated Reel Slide Viewer */}
                <View style={styles.slidePlayerBox}>
                  {flaggedItems.length > 0 ? (
                    <View style={styles.slideContent}>
                      <Image 
                        source={{ 
                          uri: flaggedItems[currentReelIndex]?.thumbnailUrl || 
                               flaggedItems[currentReelIndex]?.mediaUrl || 
                               'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' 
                        }} 
                        style={styles.slideImage} 
                      />
                      <View style={styles.slideOverlayInfo}>
                        <Text style={styles.slideSender}>
                          {flaggedItems[currentReelIndex]?.contributorName}
                        </Text>
                        <Text style={styles.slideCaption}>
                          "{flaggedItems[currentReelIndex]?.compilationCaption || flaggedItems[currentReelIndex]?.messageText}"
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.emptySlide}>
                      <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                        Compilation reel is being assembled!
                      </Text>
                    </View>
                  )}
                </View>

                {/* Slide Nav buttons */}
                {flaggedItems.length > 1 && (
                  <View style={styles.slideNavRow}>
                    <TouchableOpacity
                      disabled={currentReelIndex === 0}
                      onPress={() => setCurrentReelIndex(prev => Math.max(0, prev - 1))}
                      style={[styles.slideNavBtn, { opacity: currentReelIndex === 0 ? 0.4 : 1 }]}
                    >
                      <Feather name="chevron-left" size={20} color={colors.fg} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.fg, fontWeight: '700' }}>
                      {currentReelIndex + 1} / {flaggedItems.length}
                    </Text>
                    <TouchableOpacity
                      disabled={currentReelIndex === flaggedItems.length - 1}
                      onPress={() => setCurrentReelIndex(prev => Math.min(flaggedItems.length - 1, prev + 1))}
                      style={[styles.slideNavBtn, { opacity: currentReelIndex === flaggedItems.length - 1 ? 0.4 : 1 }]}
                    >
                      <Feather name="chevron-right" size={20} color={colors.fg} />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.unwrapActionBtn, { backgroundColor: colors.purple, marginTop: 14 }]}
                  onPress={() => setUnboxingStep('GIFTS')}
                >
                  <Text style={styles.unwrapActionBtnText}>View Gifts & Messages Registry →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Browse Gifts & Send Thank You */}
            {unboxingStep === 'GIFTS' && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
                <Text style={[styles.unwrapTitle, { color: colors.fg, fontSize: 18 }]}>
                  🎁 Gifts & Messages From Your Circle
                </Text>
                <Text style={[styles.unwrapSub, { color: colors.muted, marginBottom: 12 }]}>
                  ${activePackage.currentPooledAmount} in group funds and individual tributes pledged.
                </Text>

                {/* Thank you box */}
                {!hasSentThankYou ? (
                  <View style={[styles.thankYouBox, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                    <Text style={[styles.thankYouLabel, { color: colors.purple }]}>
                      Broadcast a Thank You back to all contributors:
                    </Text>
                    <TextInput
                      style={[styles.thankYouInput, { backgroundColor: colors.card, color: colors.fg, borderColor: colors.line }]}
                      placeholder="Thank you so much everyone! I love you all! ❤️"
                      placeholderTextColor={colors.muted}
                      value={thankYouNote}
                      onChangeText={setThankYouNote}
                    />
                    <TouchableOpacity 
                      style={[styles.thankYouSendBtn, { backgroundColor: colors.coral }]}
                      onPress={() => {
                        setHasSentThankYou(true);
                        Alert.alert('Sent!', 'Your thank you message has been broadcast to all contributors and saved to Memory Vault.');
                      }}
                    >
                      <Text style={styles.thankYouSendBtnText}>Broadcast Thank You</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.thankYouSuccess}>
                    <Text style={styles.thankYouSuccessText}>
                      ✓ Thank you broadcast sent! Saved to Memory Vault.
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.unwrapActionBtn, { backgroundColor: colors.purple, marginTop: 14 }]}
                  onPress={() => setIsUnboxingModalOpen(false)}
                >
                  <Text style={styles.unwrapActionBtnText}>Close & Return</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  deliverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  deliverBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  stealthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
  },
  stealthText: {
    fontSize: 10.5,
    fontFamily: 'Inter-Bold',
  },
  switcherScroll: {
    marginTop: 8,
  },
  switcherChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  switcherChipText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  metricValue: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    marginVertical: 1,
  },
  metricSub: {
    fontSize: 9.5,
    fontFamily: 'Inter-Regular',
  },
  metricDivider: {
    width: 1,
    height: 30,
  },
  tabsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  tabSection: {
    marginTop: 4,
  },
  chatMessageList: {
    gap: 10,
    marginBottom: 14,
  },
  chatMessageCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  chatTimestamp: {
    fontSize: 9.5,
    fontFamily: 'Inter-Regular',
  },
  chatBodyText: {
    fontSize: 12.5,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  chatInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chatInputField: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 6,
  },
  chatSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    marginBottom: 14,
  },
  addTributeBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontFamily: 'Inter-Bold',
  },
  subSectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tributeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  tributeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tributeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tributeName: {
    fontSize: 12.5,
    fontFamily: 'Inter-Bold',
  },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typePillText: {
    fontSize: 9.5,
    fontFamily: 'Inter-Bold',
  },
  durationText: {
    fontSize: 9.5,
    fontFamily: 'Inter-Medium',
  },
  flagReelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  flagReelBtnText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  tributeMessage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    fontStyle: 'italic',
  },
  giftHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  giftHighlightTitle: {
    fontSize: 11.5,
    fontFamily: 'Inter-SemiBold',
  },
  mediaPreviewThumb: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  registryCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  potTotal: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  registrySub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  registryItemCard: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  registryItemName: {
    fontSize: 12.5,
    fontFamily: 'Inter-Bold',
  },
  registryItemDesc: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginVertical: 2,
  },
  registryItemPledger: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  reelHeaderCard: {
    borderRadius: 16,
    padding: 14,
  },
  reelHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  reelHeaderMeta: {
    color: '#F0E6FF',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  previewReelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
    marginTop: 12,
  },
  previewReelBtnText: {
    color: '#1A1A1A',
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
  },
  emptyReelBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyReelText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  timelineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timelineBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  timelineTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  timelineCaption: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  timelineDuration: {
    fontSize: 9.5,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeSelectorBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeSelectorText: {
    fontSize: 10.5,
    fontFamily: 'Inter-Bold',
  },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  flagCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  flagCheckboxLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  modalSubmitBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  unboxingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  unboxingModalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  unwrapContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  unwrapIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  unwrapTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  unwrapSub: {
    fontSize: 12.5,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  unwrapActionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  unwrapActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  reelPlaybackContainer: {
    paddingVertical: 6,
  },
  reelPlaybackHeader: {
    marginBottom: 10,
  },
  reelPlaybackTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  reelPlaybackMusic: {
    fontSize: 11.5,
    fontFamily: 'Inter-SemiBold',
  },
  slidePlayerBox: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  slideContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlayInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  slideSender: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  slideCaption: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  emptySlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  slideNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  slideNavBtn: {
    padding: 6,
  },
  thankYouBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  thankYouLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  thankYouInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 12,
    marginBottom: 8,
  },
  thankYouSendBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  thankYouSendBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
  },
  thankYouSuccess: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    marginBottom: 10,
  },
  thankYouSuccessText: {
    color: '#16a34a',
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});
