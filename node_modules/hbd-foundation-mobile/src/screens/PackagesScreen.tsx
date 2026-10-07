import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { HBD_THEME } from '../theme';

interface PackagesScreenProps {
  onSelectPackage: (name: string) => void;
}

export const PackagesScreen: React.FC<PackagesScreenProps> = ({ onSelectPackage }) => {
  const packages = [
    {
      id: 'mini',
      title: '🎂 HBD Mini',
      price: 'From $45',
      tagline: 'Simple, personal, meaningful',
      features: ['Digital animation card', 'Artisan cupcakes/treats', 'Surprise local delivery']
    },
    {
      id: 'classic',
      title: '🎁 HBD Classic',
      price: 'From $150',
      badge: 'Most Loved',
      featured: true,
      tagline: 'Complete personal celebration',
      features: ['Custom designer cake', 'Fresh floral bouquet', 'Signature gift box & balloons', 'Photo capture of surprise']
    },
    {
      id: 'premium',
      title: '💎 HBD Premium',
      price: 'From $490',
      badge: 'Extraordinary',
      tagline: 'Major milestones & anniversaries',
      features: ['Luxury celebration memento', 'Atmospheric venue decor', 'Professional videographer reel', 'Live acoustic singer choir']
    },
    {
      id: 'global',
      title: '🌍 HBD Global',
      price: 'Cross-Border',
      badge: 'International',
      tagline: 'Celebrate someone across continents',
      features: ['Diaspora (UK/US/FR) to Africa/Worldwide', 'Vetted local florists & bakers', 'Live streamed surprise reaction', 'Multi-currency checkout']
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>CELEBRATION PACKAGES</Text>
          <Text style={styles.title}>From small surprises to grand stages.</Text>
          <Text style={styles.subtitle}>
            One brand orchestrating bakers, florists, videographers, and musicians behind the scenes.
          </Text>
        </View>

        <View style={styles.cardsCol}>
          {packages.map((pkg) => (
            <View 
              key={pkg.id} 
              style={[styles.card, pkg.featured && styles.cardFeatured]}
            >
              {pkg.badge && (
                <View style={[styles.badge, pkg.featured && styles.badgeFeatured]}>
                  <Text style={[styles.badgeText, pkg.featured && styles.badgeTextFeatured]}>
                    {pkg.badge}
                  </Text>
                </View>
              )}

              <Text style={[styles.pkgTitle, pkg.featured && styles.pkgTitleFeatured]}>
                {pkg.title}
              </Text>
              <Text style={[styles.pkgTagline, pkg.featured && styles.pkgTaglineFeatured]}>
                {pkg.tagline}
              </Text>
              <Text style={[styles.pkgPrice, pkg.featured && styles.pkgPriceFeatured]}>
                {pkg.price}
              </Text>

              <View style={styles.featuresCol}>
                {pkg.features.map((f, i) => (
                  <Text key={i} style={[styles.featureLine, pkg.featured && styles.featureLineFeatured]}>
                    ✓ {f}
                  </Text>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.bookBtn, pkg.featured && styles.bookBtnFeatured]}
                onPress={() => onSelectPackage(pkg.title)}
              >
                <Text style={[styles.bookBtnText, pkg.featured && styles.bookBtnTextFeatured]}>
                  Continue with {pkg.title}
                </Text>
              </TouchableOpacity>
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
  scroll: {
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    color: HBD_THEME.colors.muted,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: HBD_THEME.colors.purple,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12.5,
    color: HBD_THEME.colors.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  cardsCol: {
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: HBD_THEME.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
    position: 'relative',
  },
  cardFeatured: {
    backgroundColor: HBD_THEME.colors.purple,
    borderColor: HBD_THEME.colors.purple,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: HBD_THEME.colors.purpleSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: HBD_THEME.borderRadius.pill,
  },
  badgeFeatured: {
    backgroundColor: HBD_THEME.colors.gold,
  },
  badgeText: {
    color: HBD_THEME.colors.purple,
    fontSize: 9.5,
    fontWeight: '800',
  },
  badgeTextFeatured: {
    color: HBD_THEME.colors.charcoal,
  },
  pkgTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
  },
  pkgTitleFeatured: {
    color: HBD_THEME.colors.cream,
  },
  pkgTagline: {
    fontSize: 12,
    color: HBD_THEME.colors.muted,
    marginTop: 2,
    marginBottom: 10,
  },
  pkgTaglineFeatured: {
    color: 'rgba(255, 248, 238, 0.85)',
  },
  pkgPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: HBD_THEME.colors.purple,
    marginBottom: 14,
  },
  pkgPriceFeatured: {
    color: HBD_THEME.colors.gold,
  },
  featuresCol: {
    gap: 6,
    marginBottom: 18,
  },
  featureLine: {
    fontSize: 12,
    color: HBD_THEME.colors.charcoal,
  },
  featureLineFeatured: {
    color: HBD_THEME.colors.cream,
  },
  bookBtn: {
    backgroundColor: HBD_THEME.colors.purple,
    borderRadius: HBD_THEME.borderRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookBtnFeatured: {
    backgroundColor: HBD_THEME.colors.gold,
  },
  bookBtnText: {
    color: HBD_THEME.colors.cream,
    fontSize: 12.5,
    fontWeight: '800',
  },
  bookBtnTextFeatured: {
    color: HBD_THEME.colors.charcoal,
  },
});
