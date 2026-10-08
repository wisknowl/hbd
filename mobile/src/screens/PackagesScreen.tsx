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
import { HBD_THEME } from '../theme';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <View style={styles.kickerPill}>
            <Feather name="gift" size={12} color={HBD_THEME.colors.purple} />
            <Text style={styles.kickerText}>HBD Universal Gift Engine</Text>
          </View>
          <Text style={styles.title}>The Celebration Layer Above E-Commerce</Text>
          <Text style={styles.subtitle}>
            From connected Amazon & local artisan gifts to fully orchestrated celebration surprise packages.
          </Text>

          {/* Tab Selector: Gifts vs Packages */}
          <View style={styles.tabToggle}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'GIFTS' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('GIFTS')}
            >
              <Feather 
                name="shopping-bag" 
                size={14} 
                color={activeTab === 'GIFTS' ? '#FFFFFF' : HBD_THEME.colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'GIFTS' && styles.toggleBtnTextActive]}>
                Gift Ideas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleBtn, activeTab === 'PACKAGES' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('PACKAGES')}
            >
              <Feather 
                name="award" 
                size={14} 
                color={activeTab === 'PACKAGES' ? '#FFFFFF' : HBD_THEME.colors.muted} 
              />
              <Text style={[styles.toggleBtnText, activeTab === 'PACKAGES' && styles.toggleBtnTextActive]}>
                Celebration Packages
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'GIFTS' ? (
          <>
            {/* Person Filter Pills */}
            <View style={styles.recipientFilterSection}>
              <Text style={styles.filterSectionLabel}>Tailored for your people:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipientScroll}>
                {recipients.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.recipientChip,
                      selectedRecipient === r && styles.recipientChipActive
                    ]}
                    onPress={() => setSelectedRecipient(r)}
                  >
                    <Text style={[
                      styles.recipientChipText,
                      selectedRecipient === r && styles.recipientChipTextActive
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
                <View key={gift.id} style={styles.giftCard}>
                  <Image source={{ uri: gift.image }} style={styles.giftImage} />
                  <View style={styles.giftContent}>
                    <View style={styles.giftTopMeta}>
                      <View style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{gift.category}</Text>
                      </View>
                      <Text style={styles.giftPrice}>{gift.price}</Text>
                    </View>

                    <Text style={styles.giftTitle}>{gift.title}</Text>

                    <View style={styles.providerRow}>
                      <Feather name="truck" size={12} color={HBD_THEME.colors.purple} />
                      <Text style={styles.providerText}>{gift.provider}</Text>
                      <Text style={styles.providerDot}>•</Text>
                      <Text style={styles.locationText}>{gift.location}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.orderBtn}
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
                style={[styles.packageCard, pkg.featured && styles.packageCardFeatured]}
              >
                {pkg.badge && (
                  <View style={[styles.badge, pkg.featured && styles.badgeFeatured]}>
                    <Text style={[styles.badgeText, pkg.featured && styles.badgeTextFeatured]}>
                      {pkg.badge}
                    </Text>
                  </View>
                )}
                
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                <Text style={styles.packagePrice}>{pkg.price}</Text>
                <Text style={styles.packageTagline}>{pkg.tagline}</Text>

                <View style={styles.featureList}>
                  {pkg.features.map((feat, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color={HBD_THEME.colors.gold} />
                      <Text style={styles.featureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.bookBtn, pkg.featured && styles.bookBtnFeatured]}
                  onPress={() => onSelectPackage(pkg.title)}
                >
                  <Text style={[styles.bookBtnText, pkg.featured && styles.bookBtnTextFeatured]}>
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
    backgroundColor: HBD_THEME.colors.background,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  kickerPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
    marginBottom: 10,
  },
  kickerText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
    lineHeight: 19,
    marginBottom: 16,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  toggleBtnActive: {
    backgroundColor: HBD_THEME.colors.purple,
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodySemiBold,
    color: HBD_THEME.colors.muted,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: HBD_THEME.typography.headingBold,
  },
  recipientFilterSection: {
    marginBottom: 16,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.charcoal,
    marginBottom: 8,
  },
  recipientScroll: {
    gap: 8,
  },
  recipientChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: HBD_THEME.borderRadius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  recipientChipActive: {
    backgroundColor: HBD_THEME.colors.gold,
    borderColor: HBD_THEME.colors.gold,
  },
  recipientChipText: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.charcoal,
  },
  recipientChipTextActive: {
    fontFamily: HBD_THEME.typography.headingBold,
    color: HBD_THEME.colors.charcoal,
  },
  giftsCol: {
    gap: 16,
  },
  giftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    overflow: 'hidden',
    shadowColor: HBD_THEME.colors.purple,
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
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.purple,
    textTransform: 'uppercase',
  },
  giftPrice: {
    fontSize: 16,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
  },
  giftTitle: {
    fontSize: 15,
    fontFamily: HBD_THEME.typography.headingSemiBold,
    color: HBD_THEME.colors.charcoal,
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
    fontFamily: HBD_THEME.typography.bodyMedium,
    color: HBD_THEME.colors.purple,
  },
  providerDot: {
    fontSize: 11,
    color: HBD_THEME.colors.muted,
  },
  locationText: {
    fontSize: 11,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: HBD_THEME.colors.purple,
    paddingVertical: 10,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: HBD_THEME.typography.headingSemiBold,
  },
  packagesCol: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: HBD_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    padding: 20,
    position: 'relative',
    shadowColor: HBD_THEME.colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  packageCardFeatured: {
    borderColor: HBD_THEME.colors.gold,
    borderWidth: 2,
    backgroundColor: '#FFFCF7',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  badgeFeatured: {
    backgroundColor: HBD_THEME.colors.gold,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: HBD_THEME.typography.headingExtraBold,
    color: HBD_THEME.colors.purple,
    textTransform: 'uppercase',
  },
  badgeTextFeatured: {
    color: HBD_THEME.colors.charcoal,
  },
  packageTitle: {
    fontSize: 18,
    fontFamily: HBD_THEME.typography.headingFont,
    color: HBD_THEME.colors.purple,
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontFamily: HBD_THEME.typography.headingExtraBold,
    color: HBD_THEME.colors.charcoal,
    marginBottom: 6,
  },
  packageTagline: {
    fontSize: 12,
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.muted,
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
    fontFamily: HBD_THEME.typography.bodyFont,
    color: HBD_THEME.colors.charcoal,
    flex: 1,
  },
  bookBtn: {
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingVertical: 12,
    borderRadius: HBD_THEME.borderRadius.pill,
    alignItems: 'center',
  },
  bookBtnFeatured: {
    backgroundColor: HBD_THEME.colors.purple,
  },
  bookBtnText: {
    color: HBD_THEME.colors.purple,
    fontSize: 13,
    fontFamily: HBD_THEME.typography.headingBold,
  },
  bookBtnTextFeatured: {
    color: '#FFFFFF',
  },
});
