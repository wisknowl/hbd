import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth, DEMO_MOBILE_USERS, fetchFromBackend } from '../context/AuthContext';
import type { GiftCatalogItem, MerchantPartner, GiftOrder } from '../../../shared/types';

interface PackagesScreenProps {
  onSelectPackage: (name: string) => void;
  preselectedRecipient?: string;
}

export const PackagesScreen: React.FC<PackagesScreenProps> = ({ 
  onSelectPackage,
  preselectedRecipient
}) => {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);

  // Screen Tabs
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'MY_VOUCHERS' | 'PACKAGES'>('CATALOG');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Backend Data State
  const [catalogItems, setCatalogItems] = useState<GiftCatalogItem[]>([]);
  const [merchants, setMerchants] = useState<MerchantPartner[]>([]);
  const [myReceivedGifts, setMyReceivedGifts] = useState<GiftOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Send Gift Modal State
  const [giftModalVisible, setGiftModalVisible] = useState<boolean>(false);
  const [selectedGiftItem, setSelectedGiftItem] = useState<GiftCatalogItem | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('u-2');
  const [greetingMessage, setGreetingMessage] = useState<string>('');
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Claim Address Modal State (Zero-Knowledge delivery confirmation)
  const [claimModalVisible, setClaimModalVisible] = useState<boolean>(false);
  const [selectedOrderForClaim, setSelectedOrderForClaim] = useState<GiftOrder | null>(null);
  const [claimStreet, setClaimStreet] = useState<string>('');
  const [claimCity, setClaimCity] = useState<string>('');
  const [claimCountry, setClaimCountry] = useState<string>('');
  const [claimInstructions, setClaimInstructions] = useState<string>('');
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Dynamic QR Voucher View Modal State
  const [voucherModalVisible, setVoucherModalVisible] = useState<boolean>(false);
  const [activeVoucherOrder, setActiveVoucherOrder] = useState<GiftOrder | null>(null);

  // Thank You Tribute Modal State
  const [thankYouModalVisible, setThankYouModalVisible] = useState<boolean>(false);
  const [thankYouNote, setThankYouNote] = useState<string>('');
  const [thankYouEmoji, setThankYouEmoji] = useState<string>('❤️');
  const [isSendingThankYou, setIsSendingThankYou] = useState<boolean>(false);

  // Load live catalog and merchants from backend
  const loadGiftingData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, merRes] = await Promise.all([
        fetchFromBackend('/gifting/catalog'),
        fetchFromBackend('/gifting/merchants')
      ]);

      const catData = await catRes.json();
      const merData = await merRes.json();

      if (catData?.items) setCatalogItems(catData.items);
      if (merData?.merchants) setMerchants(merData.merchants);

      // Load user's received gifts/vouchers
      const currentUserId = user?.id || 'u-1';
      const recRes = await fetchFromBackend(`/gifting/orders/received?userId=${currentUserId}`);
      const recData = await recRes.json();
      if (recData?.orders) setMyReceivedGifts(recData.orders);
    } catch (err) {
      console.warn('[Gifting] Backend sync deferred:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadGiftingData();
  }, [loadGiftingData]);

  // Filter Catalog
  const categories = ['ALL', 'TECH', 'CAKE', 'FLOWERS', 'FRAGRANCE', 'FASHION'];
  const filteredCatalog = catalogItems.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  // Handle Initiating Gift Order
  const handleOpenGiftModal = (item: GiftCatalogItem) => {
    setSelectedGiftItem(item);
    setGreetingMessage(`Happy Birthday! Celebrating you today and always! 🎉✨`);
    setGiftModalVisible(true);
  };

  // Submit In-App Escrow Gift Order
  const handleConfirmOrder = async () => {
    if (!selectedGiftItem) return;
    try {
      setIsOrdering(true);
      const res = await fetchFromBackend('/gifting/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giverId: user?.id || 'u-1',
          recipientId: selectedRecipientId,
          itemId: selectedGiftItem.id,
          greetingMessage
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        setGiftModalVisible(false);
        Alert.alert(
          'Gift Sent!',
          `Order #${data.order.orderNumber} placed via ${selectedGiftItem.merchantName}.\n\nTotal: $${data.order.totalAmount} ${data.order.currency}\nStatus: Secured & Dispatched.\n\nCelebrant has been notified to confirm delivery or claim voucher pass!`,
          [{ text: 'Great!', onPress: () => loadGiftingData() }]
        );
      } else {
        Alert.alert('Order Failed', data.error || 'Could not place order');
      }
    } catch (err: any) {
      Alert.alert('Network Error', err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  // Submit Zero-Knowledge Address Claim
  const handleConfirmClaim = async () => {
    if (!selectedOrderForClaim) return;
    if (!claimStreet || !claimCity || !claimCountry) {
      Alert.alert('Missing Details', 'Please enter your street address, city, and country.');
      return;
    }

    try {
      setIsClaiming(true);
      const res = await fetchFromBackend(`/gifting/orders/${selectedOrderForClaim.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giverId: user?.id || 'u-1',
          streetAddress: claimStreet,
          city: claimCity,
          country: claimCountry,
          deliveryInstructions: claimInstructions
        })
      });

      const data = await res.json();
      if (data.success) {
        setClaimModalVisible(false);
        Alert.alert(
          '🚚 Delivery Confirmed!',
          'Your address has been saved privately. Order dispatched to carrier!',
          [{ text: 'OK', onPress: () => loadGiftingData() }]
        );
      } else {
        Alert.alert('Claim Failed', data.error || 'Could not confirm delivery');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsClaiming(false);
    }
  };

  // Submit Thank You Note
  const handleSendThankYou = async () => {
    if (!activeVoucherOrder && !selectedOrderForClaim) return;
    const orderId = (activeVoucherOrder || selectedOrderForClaim)?.id;
    try {
      setIsSendingThankYou(true);
      const res = await fetchFromBackend(`/gifting/orders/${orderId}/thank-you`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giverId: user?.id || 'u-1',
          thankYouNote,
          thankYouEmoji
        })
      });
      const data = await res.json();
      if (data.success) {
        setThankYouModalVisible(false);
        Alert.alert('Sent! ❤️', 'Your thank you tribute was sent to the giver!');
        loadGiftingData();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSendingThankYou(false);
    }
  };

  // Full Experiences Packages
  const packages = [
    {
      id: 'mini',
      title: '🎂 HBD Mini',
      price: 'From $45',
      tagline: 'Simple, heartfelt, personal touch',
      features: ['Digital celebration memory card', 'Artisan cupcakes & treats', 'Surprise local delivery']
    },
    {
      id: 'classic',
      title: '🎁 HBD Classic',
      price: 'From $150',
      badge: 'Most Loved',
      featured: true,
      tagline: 'Complete personal celebration in one click',
      features: ['Custom designer birthday cake', 'Fresh floral hand-tied bouquet', 'Signature gift box & celebratory balloons', 'Photo capture of surprise reaction']
    },
    {
      id: 'premium',
      title: '💎 HBD Premium',
      price: 'From $490',
      badge: 'Extraordinary',
      tagline: 'For major milestones & anniversaries',
      features: ['Luxury celebration keepsake memento', 'Full atmospheric venue decor & lighting', 'Professional videographer cinematic reel', 'Live acoustic singer or choir surprise']
    },
    {
      id: 'global',
      title: '🌍 HBD Global Cross-Border',
      price: 'Bespoke',
      badge: 'Diaspora Favorite',
      tagline: 'Celebrate someone across oceans and continents',
      features: ['Diaspora (UK / US / Canada / Europe) to Africa & Worldwide', 'Vetted local master florists & gourmet bakers', 'Live streamed surprise reaction to family', 'Multi-currency checkout & tracking']
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView 
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 10, paddingBottom: 120 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <View style={[styles.kickerPill, { backgroundColor: colors.purpleSoft }]}>
            <Feather name="gift" size={12} color={colors.purple} />
            <Text style={[styles.kickerText, { color: colors.purple }]}>Universal Gifting Engine</Text>
          </View>
          <Text style={[styles.title, { color: colors.purple }]}>The Celebration Layer Above E-Commerce</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Connected Amazon gifts, Jumia Africa, luxury boutiques & dynamic QR vouchers.
          </Text>

          {/* 3-Way Tab Selector */}
          <View style={[styles.tabToggle, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'CATALOG' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveTab('CATALOG')}
            >
              <Feather 
                name="shopping-bag" 
                size={14} 
                color={activeTab === 'CATALOG' ? '#FFFFFF' : colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'CATALOG' ? styles.toggleBtnTextActive : { color: colors.muted }]}>
                Live Store
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'MY_VOUCHERS' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveTab('MY_VOUCHERS')}
            >
              <Feather 
                name="credit-card" 
                size={14} 
                color={activeTab === 'MY_VOUCHERS' ? '#FFFFFF' : colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'MY_VOUCHERS' ? styles.toggleBtnTextActive : { color: colors.muted }]}>
                My Passes ({myReceivedGifts.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'PACKAGES' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveTab('PACKAGES')}
            >
              <Feather 
                name="package" 
                size={14} 
                color={activeTab === 'PACKAGES' ? '#FFFFFF' : colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'PACKAGES' ? styles.toggleBtnTextActive : { color: colors.muted }]}>
                Experiences
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Spinner */}
        {isLoading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.purple} />
            <Text style={{ marginTop: 12, color: colors.muted, fontSize: 13, fontFamily: 'Inter-Medium' }}>
              Connecting to Global & Local Merchants...
            </Text>
          </View>
        )}

        {/* TAB 1: LIVE CATALOG */}
        {!isLoading && activeTab === 'CATALOG' && (
          <View style={styles.contentSection}>
            {/* Connected Merchants Bar */}
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.sectionSubtitle, { color: colors.muted, marginBottom: 8 }]}>
                AFFILIATED PLATFORMS & PARTNERS
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {merchants.map(m => (
                  <View 
                    key={m.id} 
                    style={[styles.merchantPill, { backgroundColor: colors.card, borderColor: colors.line }]}
                  >
                    <Feather 
                      name={m.category === 'PHYSICAL_PARTNER' ? 'map-pin' : 'globe'} 
                      size={12} 
                      color={colors.purple} 
                    />
                    <Text style={[styles.merchantPillText, { color: colors.fg }]}>{m.name}</Text>
                    {m.isVerified && (
                      <Feather name="check-circle" size={10} color="#10B981" />
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.catPill,
                    { 
                      backgroundColor: selectedCategory === cat ? colors.purple : colors.card,
                      borderColor: selectedCategory === cat ? colors.purple : colors.line
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.catPillText, 
                      { color: selectedCategory === cat ? '#FFFFFF' : colors.muted }
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Gift Items Grid */}
            <View style={styles.giftGrid}>
              {filteredCatalog.map(item => (
                <View 
                  key={item.id} 
                  style={[styles.giftCard, { backgroundColor: colors.card, borderColor: colors.line }]}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.giftImage} resizeMode="cover" />
                  
                  {/* Partner Badge */}
                  <View style={[styles.partnerBadge, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
                    <Text style={styles.partnerBadgeText}>{item.merchantName}</Text>
                  </View>

                  <View style={styles.giftDetails}>
                    <Text style={[styles.giftCategory, { color: colors.purple }]}>{item.category}</Text>
                    <Text style={[styles.giftTitle, { color: colors.fg }]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={[styles.giftDesc, { color: colors.muted }]} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={[styles.giftPrice, { color: colors.purple }]}>
                        ${Number(item.price).toFixed(2)} {item.currency}
                      </Text>
                      <View style={styles.deliveryBadge}>
                        <Feather name={item.isPhysicalStore ? "map-pin" : "truck"} size={11} color={colors.muted} />
                        <Text style={[styles.deliveryText, { color: colors.muted }]}>
                          {item.deliveryScope}
                        </Text>
                      </View>
                    </View>

                    {/* Send Gift Button */}
                    <TouchableOpacity 
                      style={[styles.orderBtn, { backgroundColor: colors.purple }]}
                      onPress={() => handleOpenGiftModal(item)}
                      activeOpacity={0.8}
                    >
                      <Feather name="gift" size={13} color="#FFFFFF" />
                      <Text style={styles.orderBtnText}>Send Gift</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: MY VOUCHERS & PASSES WALLET */}
        {!isLoading && activeTab === 'MY_VOUCHERS' && (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionSubtitle, { color: colors.muted, marginBottom: 12 }]}>
              GIFTS & VOUCHERS SENT TO YOU
            </Text>

            {myReceivedGifts.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.line }]}>
                <Feather name="gift" size={32} color={colors.muted} />
                <Text style={[styles.emptyTitle, { color: colors.fg }]}>No Received Gifts Yet</Text>
                <Text style={[styles.emptyDesc, { color: colors.muted }]}>
                  When friends or family send you a surprise from Amazon, Jumia, or affiliated physical boutiques, your digital pass will appear here!
                </Text>
              </View>
            ) : (
              myReceivedGifts.map(order => (
                <View 
                  key={order.id} 
                  style={[styles.voucherCard, { backgroundColor: colors.card, borderColor: colors.line }]}
                >
                  {/* Card Header with Status */}
                  <View style={styles.voucherHeader}>
                    <View style={styles.voucherGiver}>
                      <Feather name="heart" size={14} color="#EF4444" />
                      <Text style={[styles.voucherGiverText, { color: colors.fg }]}>
                        From {order.giverName || 'A Generous Friend'}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusPill, 
                      { backgroundColor: order.status === 'REDEEMED' ? '#10B98120' : colors.purpleSoft }
                    ]}>
                      <Text style={[
                        styles.statusPillText, 
                        { color: order.status === 'REDEEMED' ? '#10B981' : colors.purple }
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Item Summary */}
                  <View style={styles.voucherItemRow}>
                    <Image source={{ uri: order.itemImageUrl }} style={styles.voucherThumb} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.voucherTitle, { color: colors.fg }]}>
                        {order.itemTitle}
                      </Text>
                      <Text style={[styles.voucherMerchant, { color: colors.purple }]}>
                        Fulfillment: {order.merchantName}
                      </Text>
                      <Text style={[styles.voucherAmount, { color: colors.fg }]}>
                        Valued at ${Number(order.totalAmount).toFixed(2)} {order.currency}
                      </Text>
                    </View>
                  </View>

                  {/* Personal Tribute Message */}
                  {order.greetingMessage && (
                    <View style={[styles.tributeQuote, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                      <Text style={[styles.tributeQuoteText, { color: colors.muted }]}>
                        "{order.greetingMessage}"
                      </Text>
                    </View>
                  )}

                  {/* Actions depending on delivery type */}
                  <View style={styles.voucherActionsRow}>
                    {/* If Physical Store Voucher -> Show Dynamic QR Pass */}
                    {order.voucherCode && (
                      <TouchableOpacity
                        style={[styles.actionBtnPrimary, { backgroundColor: '#F59E0B' }]}
                        onPress={() => {
                          setActiveVoucherOrder(order);
                          setVoucherModalVisible(true);
                        }}
                      >
                        <Feather name="maximize" size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Show Dynamic QR Pass</Text>
                      </TouchableOpacity>
                    )}

                    {/* If Home Shipping and pending address confirmation */}
                    {order.deliveryType === 'SHIPPING' && !order.hasShippingAddress && order.status === 'ESCROWED' && (
                      <TouchableOpacity
                        style={[styles.actionBtnPrimary, { backgroundColor: colors.purple }]}
                        onPress={() => {
                          setSelectedOrderForClaim(order);
                          setClaimModalVisible(true);
                        }}
                      >
                        <Feather name="shield" size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Enter Secret Address</Text>
                      </TouchableOpacity>
                    )}

                    {/* Thank You Button */}
                    <TouchableOpacity
                      style={[styles.actionBtnOutline, { borderColor: colors.line }]}
                      onPress={() => {
                        setSelectedOrderForClaim(order);
                        setThankYouModalVisible(true);
                      }}
                    >
                      <Feather name="smile" size={14} color={colors.fg} />
                      <Text style={[styles.actionBtnOutlineText, { color: colors.fg }]}>
                        {order.thankYouNote ? 'Sent ❤️' : 'Say Thanks'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 3: CELEBRATION PACKAGES */}
        {!isLoading && activeTab === 'PACKAGES' && (
          <View style={styles.packagesCol}>
            {packages.map((pkg) => (
              <View 
                key={pkg.id} 
                style={[
                  styles.packageCard, 
                  { 
                    backgroundColor: colors.card, 
                    borderColor: pkg.featured ? colors.purple : colors.line 
                  }
                ]}
              >
                {pkg.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.purple }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{pkg.badge}</Text>
                  </View>
                )}
                <Text style={[styles.packageTitle, { color: colors.fg }]}>{pkg.title}</Text>
                <Text style={[styles.packagePrice, { color: colors.purple }]}>{pkg.price}</Text>
                <Text style={[styles.packageTagline, { color: colors.muted }]}>{pkg.tagline}</Text>
                
                <View style={styles.featureList}>
                  {pkg.features.map((feat, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color={colors.purple} />
                      <Text style={[styles.featureText, { color: colors.fg }]}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.bookBtn, { backgroundColor: colors.purple }]}
                  onPress={() => onSelectPackage(pkg.title)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.bookBtnText, { color: '#FFFFFF' }]}>Book Celebration</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ============================================================ */}
      {/* MODAL 1: SEND GIFT WITH ESCROW */}
      {/* ============================================================ */}
      <Modal visible={giftModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.fg }]}>Send Gift</Text>
              <TouchableOpacity onPress={() => setGiftModalVisible(false)}>
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {selectedGiftItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Item Summary Card */}
                <View style={[styles.modalItemPreview, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                  <Image source={{ uri: selectedGiftItem.imageUrl }} style={styles.modalItemImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.modalItemTitle, { color: colors.fg }]}>{selectedGiftItem.title}</Text>
                    <Text style={[styles.modalItemPrice, { color: colors.purple }]}>
                      ${Number(selectedGiftItem.price).toFixed(2)} {selectedGiftItem.currency}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                      Supplied by {selectedGiftItem.merchantName}
                    </Text>
                  </View>
                </View>

                {/* Select Celebrant Friend */}
                <Text style={[styles.fieldLabel, { color: colors.fg }]}>Choose Celebrant</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {DEMO_MOBILE_USERS.map(friend => (
                    <TouchableOpacity
                      key={friend.id}
                      onPress={() => setSelectedRecipientId(friend.id)}
                      style={[
                        styles.friendChip,
                        {
                          backgroundColor: selectedRecipientId === friend.id ? colors.purpleSoft : colors.bg,
                          borderColor: selectedRecipientId === friend.id ? colors.purple : colors.line
                        }
                      ]}
                    >
                      <Image source={{ uri: friend.avatarUrl }} style={styles.friendChipAvatar} />
                      <Text style={[styles.friendChipName, { color: colors.fg }]}>{friend.fullName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Personal Greeting Message */}
                <Text style={[styles.fieldLabel, { color: colors.fg }]}>Personal Greeting / Tribute Note</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                  value={greetingMessage}
                  onChangeText={setGreetingMessage}
                  multiline
                  numberOfLines={3}
                  placeholder="Leave a heartfelt celebration note..."
                  placeholderTextColor={colors.muted}
                />

                {/* Zero-Knowledge Privacy Notice */}
                <View style={[styles.privacyNotice, { backgroundColor: colors.purpleSoft }]}>
                  <Feather name="shield" size={14} color={colors.purple} />
                  <Text style={[styles.privacyNoticeText, { color: colors.purple }]}>
                    Zero-Knowledge Privacy: You don't need Sarah's home address. HBD holds funds in escrow and confirms delivery privately with the celebrant!
                  </Text>
                </View>

                {/* Pay / Send Gift Button */}
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: colors.purple }]}
                  onPress={handleConfirmOrder}
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Feather name="gift" size={16} color="#FFFFFF" />
                      <Text style={styles.confirmBtnText}>
                        Send Gift · ${Number(selectedGiftItem.price).toFixed(2)}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: ZERO-KNOWLEDGE ADDRESS CONFIRMATION */}
      {/* ============================================================ */}
      <Modal visible={claimModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.fg }]}>Confirm Private Delivery Address</Text>
              <TouchableOpacity onPress={() => setClaimModalVisible(false)}>
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 14 }}>
                Your address will be kept in HBD's encrypted delivery vault and will NEVER be shared with the gift sender.
              </Text>

              <Text style={[styles.fieldLabel, { color: colors.fg }]}>Street Address</Text>
              <TextInput
                style={[styles.modalInputSingle, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                value={claimStreet}
                onChangeText={setClaimStreet}
                placeholder="15 Admiralty Way, Apt 4B"
                placeholderTextColor={colors.muted}
              />

              <Text style={[styles.fieldLabel, { color: colors.fg }]}>City</Text>
              <TextInput
                style={[styles.modalInputSingle, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                value={claimCity}
                onChangeText={setClaimCity}
                placeholder="Lagos / London / Douala"
                placeholderTextColor={colors.muted}
              />

              <Text style={[styles.fieldLabel, { color: colors.fg }]}>Country</Text>
              <TextInput
                style={[styles.modalInputSingle, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                value={claimCountry}
                onChangeText={setClaimCountry}
                placeholder="Nigeria / United Kingdom"
                placeholderTextColor={colors.muted}
              />

              <Text style={[styles.fieldLabel, { color: colors.fg }]}>Delivery Instructions (Optional)</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
                value={claimInstructions}
                onChangeText={setClaimInstructions}
                placeholder="Leave with concierge or ring gate bell..."
                placeholderTextColor={colors.muted}
              />

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.purple, marginTop: 12 }]}
                onPress={handleConfirmClaim}
                disabled={isClaiming}
              >
                {isClaiming ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmBtnText}>Save Address & Dispatch</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 3: DYNAMIC QR VOUCHER PASS */}
      {/* ============================================================ */}
      <Modal visible={voucherModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.voucherModalCard, { backgroundColor: colors.card, borderColor: '#F59E0B' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="award" size={16} color="#F59E0B" />
                <Text style={[styles.modalTitle, { color: colors.fg }]}>Digital Partner Pass</Text>
              </View>
              <TouchableOpacity onPress={() => setVoucherModalVisible(false)}>
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {activeVoucherOrder && (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                {/* Visual Luxury QR / Security Pass */}
                <View style={styles.qrPassBox}>
                  <View style={styles.qrGridVisual}>
                    <Feather name="maximize-2" size={48} color="#5B2A86" />
                    <Text style={styles.qrCodeString}>{activeVoucherOrder.voucherCode}</Text>
                  </View>
                  <Text style={styles.qrScanInstruction}>Show this pass to cashier at store counter</Text>
                </View>

                <Text style={[styles.voucherPassTitle, { color: colors.fg }]}>
                  {activeVoucherOrder.itemTitle}
                </Text>
                <Text style={{ fontSize: 13, color: colors.purple, fontFamily: 'Poppins-Bold', marginTop: 4 }}>
                  {activeVoucherOrder.merchantName}
                </Text>
                <Text style={{ fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 4 }}>
                  {activeVoucherOrder.merchantPhysicalAddress || 'Marylebone Storefront'}, {activeVoucherOrder.merchantCity || 'London'}
                </Text>

                <View style={[styles.statusPill, { backgroundColor: '#10B98120', marginTop: 16 }]}>
                  <Text style={{ color: '#10B981', fontSize: 12, fontFamily: 'Poppins-Bold' }}>
                    Status: {activeVoucherOrder.status}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 4: SEND THANK YOU TRIBUTE */}
      {/* ============================================================ */}
      <Modal visible={thankYouModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.fg }]}>Send Thank-You Tribute</Text>
              <TouchableOpacity onPress={() => setThankYouModalVisible(false)}>
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
              Let the giver know how much their celebration surprise meant to you!
            </Text>

            {/* Reaction Emoji Picker */}
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 12 }}>
              {['❤️', '🎉', '🎧', '🎂', '🥂', '✨'].map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setThankYouEmoji(emoji)}
                  style={[
                    styles.emojiBtn,
                    { backgroundColor: thankYouEmoji === emoji ? colors.purpleSoft : colors.bg }
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.bg, color: colors.fg, borderColor: colors.line }]}
              value={thankYouNote}
              onChangeText={setThankYouNote}
              multiline
              numberOfLines={3}
              placeholder="Write a heartfelt thank-you message..."
              placeholderTextColor={colors.muted}
            />

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: colors.purple, marginTop: 14 }]}
              onPress={handleSendThankYou}
              disabled={isSendingThankYou}
            >
              {isSendingThankYou ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Send Tribute {thankYouEmoji}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  kickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 8,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  tabToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.8,
  },
  merchantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  merchantPillText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  catPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  giftGrid: {
    gap: 16,
  },
  giftCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  giftImage: {
    width: '100%',
    height: 180,
  },
  partnerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  partnerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  giftDetails: {
    padding: 16,
  },
  giftCategory: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  giftTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    lineHeight: 22,
    marginBottom: 4,
  },
  giftDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  giftPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  voucherCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voucherGiver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voucherGiverText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  voucherItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  voucherThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  voucherTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  voucherMerchant: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  voucherAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  tributeQuote: {
    borderLeftWidth: 3,
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  tributeQuoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  voucherActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  packagesCol: {
    gap: 16,
  },
  packageCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  packageTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  packageTagline: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
    marginBottom: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  bookBtn: {
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  bookBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  modalItemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  modalItemTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  modalItemPrice: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  friendChipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  friendChipName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  modalInputSingle: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  privacyNotice: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  privacyNoticeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    lineHeight: 15,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  voucherModalCard: {
    margin: 20,
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
  },
  qrPassBox: {
    backgroundColor: '#FAF5FF',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  qrGridVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    width: 140,
    height: 140,
  },
  qrCodeString: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#5B2A86',
    letterSpacing: 2,
    marginTop: 8,
  },
  qrScanInstruction: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 8,
    fontFamily: 'Inter-Medium',
  },
  voucherPassTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 10,
  },
  emojiBtn: {
    padding: 10,
    borderRadius: 14,
  },
});
