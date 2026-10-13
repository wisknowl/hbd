import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface AppIconProps {
  name: keyof typeof Feather.glyphMap | 'home' | 'gift' | 'calendar' | 'message-square' | 'user' | 'bell' | 'search' | 'arrow-left' | 'send' | 'check' | 'sparkles' | 'heart' | 'archive' | 'plus' | 'x' | 'grid' | 'list' | 'clock' | 'sun' | 'slash' | 'alert-circle' | 'award' | 'globe' | 'map-pin' | 'filter' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'tag';
  size?: number;
  color?: string;
}

// Fallback Unicode / Geometric Glyphs if Vector Icons font is ever loading
const FALLBACK_GLYPHS: Record<string, string> = {
  home: '⌂',
  gift: '◆',
  calendar: '▦',
  'message-square': '✉',
  user: '●',
  bell: '▲',
  search: '⚲',
  'arrow-left': '←',
  send: '➤',
  check: '✓',
  sparkles: '✦',
  heart: '♥',
  archive: '■',
  plus: '+',
  x: '✕',
  grid: '⊞',
  list: '☰',
  clock: '◷',
  sun: '☼',
  slash: '⊘',
  'alert-circle': '!',
  award: '★',
  globe: '⊕',
  'map-pin': '▲'
};

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 20, color = '#202124' }) => {
  try {
    return <Feather name={name as any} size={size} color={color} />;
  } catch (err) {
    // Graceful fallback to crisp readable glyph
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size }]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.75, color }]}>
          {FALLBACK_GLYPHS[name] || '•'}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
