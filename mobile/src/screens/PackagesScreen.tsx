import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

interface PackagesScreenProps {
  onSelectPackage: (name: string) => void;
  preselectedRecipient?: string;
}

interface GiftItem {
  id: string;
  title: string;
  provider: string;
  price: string;
  category: string;
  image: string;
  location: string;
  forRecipient?: string;
}

const CURATED_GIFTS: GiftItem[] = [
  {
    id: 'g-1',
    title: 'Jo Malone Peony & Blush Suede Scent',
    provider: 'Amazon UK / Luxury Store',
    price: '£55 (~$72)',
    category: 'Perfume & Beauty',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    location: 'London, UK',
    forRecipient: 'Sarah Johnson'
  },
  {
    id: 'g-2',
    title: 'Fresh Garden Rose Bouquet & Card',
    provider: 'Local Douala Florist',
    price: '$35',
    category: 'Flowers & Sweets',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
    location: 'Douala, Cameroon',
    forRecipient: 'Mama Chantal'
  },
  {
    id: 'g-3',
    title: 'Sony Noise-Cancelling Headphones',
    provider: 'Amazon Global Delivery',
    price: '$89',
    category: 'Tech & Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    location: 'Global',
    forRecipient: 'David Kouam'
  },
  {
    id: 'g-4',
    title: 'Custom Artisan Birthday Cake (2 Tier)',
    provider: 'Master Bakeries Lagos',
    price: '$60',
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80',
    location: 'Lagos, Nigeria',
    forRecipient: 'Aisha Bello'
  },
  {
    id: 'g-5',
    title: 'Amazon E-Gift Card with Custom Video',
    provider: 'Amazon Digital Commerce',
    price: '$50',
    category: 'Universal Gift Card',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
    location: 'Worldwide Instant',
  }
];

export const PackagesScreen: React.FC<PackagesScreenProps> = ({ 
  onSelectPackage,
  preselectedRecipient
}) => {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'GIFTS' | 'PACKAGES'>('GIFTS');
  const [selectedRecipient, setSelectedRecipient] = useState<string>(preselectedRecipient || 'All');

  const recipients = ['All', 'Mama Chantal', 'Sarah Johnson', 'Aisha Bello', 'David Kouam'];

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

  const filteredGifts = CURATED_GIFTS.filter(g => {
    if (selectedRecipient === 'All') return true;
    return g.forRecipient === selectedRecipient;
  });

  const handleOrderGift = (gift: GiftItem) => {
    Alert.alert(
      'Order with HBD Concierge',
      `Would you like HBD to coordinate "${gift.title}" (${gift.price}) via ${gift.provider} with surprise delivery to ${gift.location}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed to Book', 
          onPress: () => onSelectPackage(`Gift: ${gift.title}`) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <View style={[styles.kickerPill, { backgroundColor: colors.purpleSoft }]}>
            <Feather name="gift" size={12} color={colors.purple} />
            <Text style={[styles.kickerText, { color: colors.purple }]}>Universal Gift Engine</Text>
          </View>
          <Text style={[styles.title, { color: colors.purple }]}>The Celebration Layer Above E-Commerce</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Connected Amazon gifts, local florists & bakers, and full surprise packages.
          </Text>

          {/* Tab Selector: Gifts vs Packages */}
          <View style={[styles.tabToggle, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'GIFTS' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveTab('GIFTS')}
            >
              <Feather 
                name="shopping-bag" 
                size={14} 
                color={activeTab === 'GIFTS' ? '#FFFFFF' : colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'GIFTS' ? styles.toggleBtnTextActive : { color: colors.muted }]}>
                Gift Ideas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'PACKAGES' && { backgroundColor: colors.purple }]}
              onPress={() => setActiveTab('PACKAGES')}
            >
              <Feather 
                name="award" 
                size={14} 
                color={activeTab === 'PACKAGES' ? '#FFFFFF' : colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'PACKAGES' ? styles.toggleBtnTextActive : { color: colors.muted }]}>
                Celebration Packages
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'GIFTS' ? (
          <>
            {/* Person Filter Pills */}
            <View style={styles.recipientFilterSection}>
              <Text style={[styles.filterSectionLabel, { color: colors.fg }]}>Tailored for your people:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipientScroll}>
                {recipients.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.recipientChip,
                      { backgroundColor: selectedRecipient === r ? colors.gold : colors.card, borderColor: colors.line }
                    ]}
                    onPress={() => setSelectedRecipient(r)}
                  >
                    <Text style={[
                      styles.recipientChipText,
                      { color: '#1A1A1A', fontFamily: selectedRecipient === r ? 'Poppins-Bold' : 'Inter-Medium' }
                    ]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Gifts Grid */}
            <View style={styles.giftsCol}>
              {filteredGifts.map(gift => (
                <View 
                  key={gift.id} 
                  style={[styles.giftCard, { backgroundColor: colors.card, borderColor: colors.line }]}
                >
                  <Image source={{ uri: gift.image }} style={styles.giftImage} />
                  <View style={styles.giftContent}>
                    <View style={styles.giftTopMeta}>
                      <View style={[styles.categoryPill, { backgroundColor: colors.purpleSoft }]}>
                        <Text style={[styles.categoryPillText, { color: colors.purple }]}>{gift.category}</Text>
                      </View>
                      <Text style={[styles.giftPrice, { color: colors.purple }]}>{gift.price}</Text>
                    </View>

                    <Text style={[styles.giftTitle, { color: colors.fg }]}>{gift.title}</Text>

                    <View style={styles.providerRow}>
                      <Feather name="truck" size={12} color={colors.purple} />
                      <Text style={[styles.providerText, { color: colors.purple }]}>{gift.provider}</Text>
                      <Text style={[styles.providerDot, { color: colors.muted }]}>•</Text>
                      <Text style={[styles.locationText, { color: colors.muted }]}>{gift.location}</Text>
                    </View>

                    <TouchableOpacity 
                      style={[styles.orderBtn, { backgroundColor: colors.purple }]}
                      onPress={() => handleOrderGift(gift)}
                    >
                      <Feather name="gift" size={14} color="#FFFFFF" />
                      <Text style={styles.orderBtnText}>Send with HBD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Packages Column */
          <View style={styles.packagesCol}>
            {packages.map((pkg) => (
              <View 
                key={pkg.id} 
                style={[
                  styles.packageCard, 
                  { backgroundColor: colors.card, borderColor: pkg.featured ? colors.gold : colors.line }
                ]}
              >
                {pkg.badge && (
                  <View style={[styles.badge, { backgroundColor: pkg.featured ? colors.gold : colors.purpleSoft }]}>
                    <Text style={[styles.badgeText, { color: pkg.featured ? '#1A1A1A' : colors.purple }]}>
                      {pkg.badge}
                    </Text>
                  </View>
                )}
                
                <Text style={[styles.packageTitle, { color: colors.purple }]}>{pkg.title}</Text>
                <Text style={[styles.packagePrice, { color: colors.fg }]}>{pkg.price}</Text>
                <Text style={[styles.packageTagline, { color: colors.muted }]}>{pkg.tagline}</Text>

                <View style={styles.featureList}>
                  {pkg.features.map((feat, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color={colors.gold} />
                      <Text style={[styles.featureText, { color: colors.fg }]}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.bookBtn, { backgroundColor: pkg.featured ? colors.purple : colors.purpleSoft }]}
                  onPress={() => onSelectPackage(pkg.title)}
                >
                  <Text style={[styles.bookBtnText, { color: pkg.featured ? '#FFFFFF' : colors.purple }]}>
                    Book This Experience
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  kickerPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 10,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  tabToggle: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  recipientFilterSection: {
    marginBottom: 16,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  recipientScroll: {
    gap: 8,
  },
  recipientChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  recipientChipText: {
    fontSize: 12,
  },
  giftsCol: {
    gap: 16,
  },
  giftCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#5B2A86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  giftImage: {
    width: '100%',
    height: 150,
  },
  giftContent: {
    padding: 16,
  },
  giftTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  giftPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  giftTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  providerText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  providerDot: {
    fontSize: 11,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 999,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
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
    shadowColor: '#5B2A86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
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
    marginBottom: 6,
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
});
