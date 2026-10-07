import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { HBD_THEME } from '../theme';

export const MemoryVaultScreen: React.FC = () => {
  const archives = [
    {
      id: 'mv-1',
      title: 'Mama Chantal’s 60th Golden Jubilee',
      date: 'Oct 2026 · Douala',
      cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      mediaCount: '34 photos · 4 videos',
      quote: '“I felt the love from three continents in one room.”'
    },
    {
      id: 'mv-2',
      title: 'The Birth of PaySeed Tech',
      date: 'Launch Day · Lagos',
      cover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
      mediaCount: '12 photos · 1 tribute film',
      quote: '“Our first transaction processed at 9:14 AM. The dream became real.”'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Dark Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>ARCHIVE & PRESERVE</Text>
          <Text style={styles.heroTitle}>HBD Memory Vault</Text>
          <Text style={styles.heroSubtitle}>
            Important moments deserve to be remembered forever. A digital sanctuary for milestone photos, video tributes, and letters.
          </Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              “Birth is the beginning. Life is the journey. Milestones are the memories. Celebration is how we remember that it mattered.”
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Preserved Chapters</Text>

        <View style={styles.cardsCol}>
          {archives.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.cover }} style={styles.cardCover} />
              <View style={styles.cardBody}>
                <Text style={styles.cardDate}>{item.date} · {item.mediaCount}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardQuote}>{item.quote}</Text>
                <TouchableOpacity style={styles.openBtn}>
                  <Text style={styles.openBtnText}>Open Memory Vault →</Text>
                </TouchableOpacity>
              </View>
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
  heroCard: {
    backgroundColor: '#1d1226',
    borderRadius: HBD_THEME.borderRadius.lg,
    padding: 22,
    marginBottom: 24,
  },
  heroKicker: {
    color: HBD_THEME.colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: HBD_THEME.colors.cream,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 248, 238, 0.8)',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 6,
  },
  quoteBox: {
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: HBD_THEME.colors.gold,
    paddingLeft: 12,
  },
  quoteText: {
    color: HBD_THEME.colors.gold,
    fontSize: 11.5,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
    marginBottom: 12,
  },
  cardsCol: {
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: HBD_THEME.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: HBD_THEME.colors.border,
  },
  cardCover: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 16,
  },
  cardDate: {
    fontSize: 10.5,
    fontWeight: '700',
    color: HBD_THEME.colors.muted,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: HBD_THEME.colors.charcoal,
    marginTop: 4,
  },
  cardQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: HBD_THEME.colors.muted,
    marginTop: 6,
    lineHeight: 16,
  },
  openBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  openBtnText: {
    color: HBD_THEME.colors.purple,
    fontSize: 12,
    fontWeight: '800',
  },
});
