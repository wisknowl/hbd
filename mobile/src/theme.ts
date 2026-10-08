/**
 * HBD Foundation — Native Theme & Design Tokens
 * Harmonized with Web Client Design System (Light & Dark Mode)
 */

export interface ThemeColors {
  bg: string;
  background: string;
  fg: string;
  card: string;
  line: string;
  muted: string;
  purple: string;
  purpleLight: string;
  purpleSoft: string;
  gold: string;
  goldLight: string;
  goldSoft: string;
  coral: string;
  coralSoft: string;
  fabCoral: string; // The vibrant coral from screenshot #FF5E62
  cream: string;
  charcoal: string;
  border: string;
  surface: string;
  bottomNavBg: string;
  bottomNavBorder: string;
}

export const LIGHT_THEME_COLORS: ThemeColors = {
  bg: '#FFF8EE',
  background: '#FFF8EE',
  fg: '#202124',
  card: '#FFFFFF',
  line: '#E7DCCB',
  muted: '#6B6470',
  purple: '#5B2A86',
  purpleLight: '#7A43A8',
  purpleSoft: '#F4EBFA',
  gold: '#F4B942',
  goldLight: '#F7C866',
  goldSoft: '#FFF3D6',
  coral: '#FF6B6B',
  coralSoft: '#FFEBEB',
  fabCoral: '#FF5E62',
  cream: '#FFF8EE',
  charcoal: '#202124',
  border: '#E8DCCB',
  surface: '#FFFFFF',
  bottomNavBg: '#FFFFFF',
  bottomNavBorder: '#E8DCCB',
};

export const DARK_THEME_COLORS: ThemeColors = {
  bg: '#17141C',
  background: '#17141C',
  fg: '#FFF8EE',
  card: '#241F2D',
  line: '#3A3347',
  muted: '#B3AABD',
  purple: '#7A43A8',
  purpleLight: '#9C62CC',
  purpleSoft: '#2E233B',
  gold: '#F4B942',
  goldLight: '#F7C866',
  goldSoft: '#3E341F',
  coral: '#FF6B6B',
  coralSoft: '#3E2222',
  fabCoral: '#FF5E62',
  cream: '#FFF8EE',
  charcoal: '#FFF8EE',
  border: '#3A3347',
  surface: '#241F2D',
  bottomNavBg: '#1C1824',
  bottomNavBorder: '#3A3347',
};

export const HBD_THEME = {
  colors: LIGHT_THEME_COLORS,
  typography: {
    headingFont: 'Poppins-Bold',
    headingBold: 'Poppins-Bold',
    headingSemiBold: 'Poppins-SemiBold',
    headingMedium: 'Poppins-Medium',
    headingExtraBold: 'Poppins-ExtraBold',
    bodyFont: 'Inter-Regular',
    bodyRegular: 'Inter-Regular',
    bodyMedium: 'Inter-Medium',
    bodySemiBold: 'Inter-SemiBold',
    bodyBold: 'Inter-Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 12,
    md: 18,
    lg: 26,
    pill: 999,
  },
  shadows: {
    soft: {
      shadowColor: '#5B2A86',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    fab: {
      shadowColor: '#FF5E62',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 8,
    },
    glow: {
      shadowColor: '#F4B942',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    }
  }
};
