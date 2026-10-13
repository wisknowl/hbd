import React, { useState, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  PanResponder,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { FloatingCelebrateButton } from '../components/FloatingCelebrateButton';
import type { ReminderItem, InspirationDomain } from '../../../shared/types';

interface DatesScreenProps {
  onPlanCelebration: (item?: ReminderItem) => void;
  onOpenGifts?: (personName: string) => void;
  onOpenSurprisePackage?: (celebrant: string) => void;
}

export type CalendarGranularity = '12months' | '1month' | 'weekly' | '3days' | '1day' | 'list';

interface MobileCalendarItem extends ReminderItem {
  avatar?: string;
  location?: string;
  month: number;
  day: number;
  monogram: string;
  color: string;
  isVerifiedCivil: boolean;
  relativeText: string;
  scope: 'ALL' | 'CIRCLE' | 'LOCAL' | 'COUNTRY' | 'CONTINENT' | 'GLOBAL';
  wants?: string[];
  dontWants?: string[];
  domain?: InspirationDomain;
  tone?: 'FESTIVE' | 'TRIBUTE';
  commercialIntent?: 'GIFT' | 'POT' | 'TOAST' | 'EXPERIENCE';
  heritageTradition?: string;
}

export interface CelebrationColorMeta {
  color: string;
  bg: string;
  border: string;
  lightText: string;
  badgeBg: string;
  label: string;
  iconName: keyof typeof Feather.glyphMap;
}

export const CELEBRATION_THEMES: Record<string, CelebrationColorMeta> = {
  BIRTHDAY: {
    color: '#2563EB',      // Electric Royal Blue
    bg: '#EFF6FF',         // Ice Blue
    border: '#BFDBFE',     // Light Blue
    lightText: '#1D4ED8',
    badgeBg: '#DBEAFE',
    label: 'People & Birthdays',
    iconName: 'gift',
  },
  BEGINNING: {
    color: '#10B981',      // Vibrant Emerald Green
    bg: '#ECFDF5',         // Mint Tint
    border: '#A7F3D0',     // Light Green
    lightText: '#047857',
    badgeBg: '#D1FAE5',
    label: 'Beginnings & Startups',
    iconName: 'briefcase',
  },
  MILESTONE: {
    color: '#F59E0B',      // Regal Amber / Gold
    bg: '#FFFBEB',         // Warm Gold Tint
    border: '#FDE68A',     // Light Amber
    lightText: '#B45309',
    badgeBg: '#FEF3C7',
    label: 'Milestones & Triumphs',
    iconName: 'award',
  },
  ANNIVERSARY: {
    color: '#E11D48',      // Rose / Coral Red
    bg: '#FFF1F2',         // Petal Rose Tint
    border: '#FECDD3',     // Light Rose
    lightText: '#BE123C',
    badgeBg: '#FFE4E6',
    label: 'Anniversaries & Weddings',
    iconName: 'heart',
  },
  COMMUNITY: {
    color: '#7C3AED',      // Deep Amethyst Violet
    bg: '#F5F3FF',         // Soft Violet Tint
    border: '#DDD6FE',     // Light Purple
    lightText: '#6D28D9',
    badgeBg: '#EDE9FE',
    label: 'Global Observances',
    iconName: 'globe',
  },
  ICONS: {
    color: '#7C3AED',      // Deep Amethyst Violet
    bg: '#F5F3FF',         // Soft Violet Tint
    border: '#DDD6FE',     // Light Purple
    lightText: '#6D28D9',
    badgeBg: '#EDE9FE',
    label: 'Community Heroes & Idols',
    iconName: 'star',
  },
  FAITH: {
    color: '#6366F1',      // Celestial Indigo / Sacred Gold
    bg: '#EEF2FF',         // Soft Indigo
    border: '#C7D2FE',     // Light Indigo
    lightText: '#4338CA',
    badgeBg: '#E0E7FF',
    label: 'Faith & Sacred Heritage',
    iconName: 'sun',
  },
  TRIBUTE: {
    color: '#475569',      // Platinum Pearl / Deep Slate
    bg: '#F8FAFC',         // Pure Soft Slate
    border: '#CBD5E1',     // Slate Outline
    lightText: '#334155',
    badgeBg: '#F1F5F9',
    label: 'Tributes & Remembrance',
    iconName: 'shield',
  },
};

export const getCelebrationTheme = (cat?: string): CelebrationColorMeta => {
  return CELEBRATION_THEMES[cat || 'BIRTHDAY'] || CELEBRATION_THEMES.BIRTHDAY;
};

export const resolveInspirationDomain = (item: {
  domain?: string;
  category?: string;
  title?: string;
  celebrant?: string;
}): InspirationDomain => {
  if (item.domain && item.domain !== 'ALL_DOMAINS') return item.domain as InspirationDomain;
  const text = `${item.title || ''} ${item.celebrant || ''}`.toLowerCase();
  
  if (item.category === 'FAITH' || text.includes('faith') || text.includes('sacred') || text.includes('diwali') || text.includes('eid') || text.includes('easter') || text.includes('christmas') || text.includes('hanukkah') || text.includes('muertos') || text.includes('spiritual') || text.includes('prayer') || text.includes('temple') || text.includes('mosque') || text.includes('church')) {
    return 'FAITH_PHILOSOPHY';
  }
  if (text.includes('tech') || text.includes('startup') || text.includes('innovation') || text.includes('payseed') || text.includes('afrotech') || text.includes('code') || text.includes('business') || text.includes('architect') || text.includes('seed')) {
    return 'TECH_BUSINESS';
  }
  if (text.includes('music') || text.includes('jazz') || text.includes('art') || text.includes('creative') || text.includes('design') || text.includes('studio') || text.includes('vinyl') || text.includes('producer') || text.includes('dance')) {
    return 'MUSIC_ARTS';
  }
  if (text.includes('sport') || text.includes('marathon') || text.includes('pioneer') || text.includes('athlete') || text.includes('champion') || text.includes('tennis') || text.includes('runner') || text.includes('olympic') || text.includes('athletics')) {
    return 'SPORTS_PIONEERS';
  }
  if (text.includes('justice') || text.includes('peace') || text.includes('human') || text.includes('king') || text.includes('mandela') || text.includes('courage') || text.includes('leader') || text.includes('hope') || text.includes('mentor') || text.includes('elder') || text.includes('health') || text.includes('clinic')) {
    return 'HUMANITARIAN_LEADERS';
  }
  if (text.includes('science') || text.includes('space') || text.includes('curie') || text.includes('discovery') || text.includes('degree') || text.includes('academic') || text.includes('university') || text.includes('astronomy')) {
    return 'SCIENCE_DISCOVERY';
  }
  if (text.includes('earth') || text.includes('wildlife') || text.includes('nature') || text.includes('conservation') || text.includes('environment') || text.includes('ocean')) {
    return 'EARTH_NATURE';
  }
  if (item.category === 'BEGINNING') return 'TECH_BUSINESS';
  if (item.category === 'ICONS' || item.category === 'COMMUNITY') return 'HUMANITARIAN_LEADERS';
  if (item.category === 'MILESTONE') return 'SCIENCE_DISCOVERY';
  return 'ALL_DOMAINS';
};

interface CalendarDaySlot {
  day: number;
  dateStr: string;
  isToday: boolean;
  hasCelebration: boolean;
  celebrationColor?: string;
  celebrations: MobileCalendarItem[];
}

interface CalendarWeek {
  days: (CalendarDaySlot | null)[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_NAMES_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const VIEW_OPTIONS: { id: CalendarGranularity; label: string; iconName: keyof typeof Feather.glyphMap }[] = [
  { id: '12months', label: '12 Months View', iconName: 'grid' },
  { id: '1month', label: '1 Month View', iconName: 'calendar' },
  { id: 'weekly', label: 'Weekly View (7D)', iconName: 'clock' },
  { id: '3days', label: '3 Days View', iconName: 'sliders' },
  { id: '1day', label: '1 Day View', iconName: 'sun' },
  { id: 'list', label: 'Celebrations List', iconName: 'list' },
];

// 23 Celebrations matching user specifications and screenshots across all 12 months
const INITIAL_REMINDERS: MobileCalendarItem[] = [
  // January
  {
    id: 'rem-jan-1',
    title: 'New Year Global Hope Observance',
    category: 'COMMUNITY',
    eventDate: '2026-01-01',
    daysRemaining: -284,
    month: 1,
    day: 1,
    celebrant: 'Worldwide Celebration of New Horizons',
    icon: '🌍',
    location: 'Worldwide',
    hasCelebrationPlanned: false,
    monogram: 'NY',
    color: '#4F46E5',
    isVerifiedCivil: true,
    relativeText: '284 days ago',
    scope: 'GLOBAL'
  },
  {
    id: 'rem-jan-2',
    title: 'Dr. Martin Luther King Jr. Commemoration',
    category: 'COMMUNITY',
    eventDate: '2026-01-19',
    daysRemaining: -269,
    month: 1,
    day: 19,
    celebrant: 'Champion of Justice and Equality',
    icon: '🌟',
    location: 'Atlanta, USA & Global',
    hasCelebrationPlanned: false,
    monogram: 'ML',
    color: '#7C3AED',
    isVerifiedCivil: true,
    relativeText: '269 days ago',
    scope: 'GLOBAL'
  },
  {
    id: 'rem-jan-3',
    title: "Dad's 65th Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-01-25',
    daysRemaining: -260,
    month: 1,
    day: 25,
    celebrant: 'Family Pillar & Mentor',
    icon: '🎂',
    location: 'Douala, Cameroon',
    hasCelebrationPlanned: true,
    monogram: 'D',
    color: '#2563EB',
    isVerifiedCivil: true,
    relativeText: '260 days ago',
    scope: 'CIRCLE',
    wants: ['Vintage Watch', 'Single Origin Coffee'],
    dontWants: ['No plastic gadgets']
  },
  {
    id: 'rem-jan-4',
    title: "Fredy's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-01-27',
    daysRemaining: -258,
    month: 1,
    day: 27,
    celebrant: 'Close Friend & Tech Architect',
    icon: '🎂',
    location: 'Paris, France',
    hasCelebrationPlanned: false,
    monogram: 'F',
    color: '#059669',
    isVerifiedCivil: true,
    relativeText: '258 days ago',
    scope: 'CIRCLE'
  },

  // February
  {
    id: 'rem-feb-1',
    title: 'AfroTech Labs 3rd Anniversary',
    category: 'BEGINNING',
    eventDate: '2026-02-12',
    daysRemaining: -242,
    month: 2,
    day: 12,
    celebrant: 'Pan-African Innovation Startup',
    icon: '🚀',
    location: 'Nairobi & Kigali',
    hasCelebrationPlanned: false,
    monogram: 'AT',
    color: '#10B981',
    isVerifiedCivil: true,
    relativeText: '242 days ago',
    scope: 'CONTINENT'
  },
  {
    id: 'rem-feb-2',
    title: "Maya's Creative Studio Launch",
    category: 'BEGINNING',
    eventDate: '2026-02-24',
    daysRemaining: -230,
    month: 2,
    day: 24,
    celebrant: 'Design Agency Founded',
    icon: '🚀',
    location: 'London, UK',
    hasCelebrationPlanned: false,
    monogram: 'MS',
    color: '#EC4899',
    isVerifiedCivil: true,
    relativeText: '230 days ago',
    scope: 'LOCAL'
  },

  // March
  {
    id: 'rem-mar-1',
    title: 'International Women of Courage Day',
    category: 'COMMUNITY',
    eventDate: '2026-03-08',
    daysRemaining: -218,
    month: 3,
    day: 8,
    celebrant: 'Trailblazers Across Africa & Diaspora',
    icon: '🌟',
    location: 'Global Observance',
    hasCelebrationPlanned: false,
    monogram: 'WC',
    color: '#F59E0B',
    isVerifiedCivil: true,
    relativeText: '218 days ago',
    scope: 'GLOBAL'
  },
  {
    id: 'rem-mar-2',
    title: 'Prof. Wangari Maathai Tribute Day',
    category: 'COMMUNITY',
    eventDate: '2026-03-24',
    daysRemaining: -202,
    month: 3,
    day: 24,
    celebrant: 'Nobel Laureate & Environmental Pioneer',
    icon: '🌟',
    location: 'Nairobi, Kenya & World',
    hasCelebrationPlanned: false,
    monogram: 'WM',
    color: '#16A34A',
    isVerifiedCivil: true,
    relativeText: '202 days ago',
    scope: 'GLOBAL'
  },

  // April
  {
    id: 'rem-apr-1',
    title: 'David & Chantal Wedding Anniversary',
    category: 'ANNIVERSARY',
    eventDate: '2026-04-18',
    daysRemaining: -177,
    month: 4,
    day: 18,
    celebrant: '10th Bronze Milestone Anniversary',
    icon: '💍',
    location: 'Yaoundé, Cameroon',
    hasCelebrationPlanned: false,
    monogram: 'DC',
    color: '#E11D48',
    isVerifiedCivil: true,
    relativeText: '177 days ago',
    scope: 'CIRCLE'
  },

  // May
  {
    id: 'rem-may-1',
    title: 'Dr. Amina Diallo PhD Defense Anniversary',
    category: 'MILESTONE',
    eventDate: '2026-05-15',
    daysRemaining: -150,
    month: 5,
    day: 15,
    celebrant: 'Doctorate in Renewable Energy Triumphs',
    icon: '🎓',
    location: 'Dakar, Senegal',
    hasCelebrationPlanned: false,
    monogram: 'AD',
    color: '#3B82F6',
    isVerifiedCivil: true,
    relativeText: '150 days ago',
    scope: 'COUNTRY'
  },

  // June
  {
    id: 'rem-jun-1',
    title: 'Kaba Cloud 1M Users Milestone',
    category: 'MILESTONE',
    eventDate: '2026-06-20',
    daysRemaining: -114,
    month: 6,
    day: 20,
    celebrant: 'SaaS Platform Scaled to One Million People',
    icon: '🎓',
    location: 'Abidjan & Lagos',
    hasCelebrationPlanned: false,
    monogram: 'KC',
    color: '#8B5CF6',
    isVerifiedCivil: true,
    relativeText: '114 days ago',
    scope: 'CONTINENT'
  },

  // July
  {
    id: 'rem-jul-1',
    title: 'Nelson Mandela International Day',
    category: 'COMMUNITY',
    eventDate: '2026-07-18',
    daysRemaining: -86,
    month: 7,
    day: 18,
    celebrant: '67 Minutes of Compassion & Public Action',
    icon: '🌟',
    location: 'Johannesburg & United Nations',
    hasCelebrationPlanned: false,
    monogram: 'NM',
    color: '#D97706',
    isVerifiedCivil: true,
    relativeText: '86 days ago',
    scope: 'GLOBAL'
  },

  // August
  {
    id: 'rem-aug-1',
    title: "Auntie Rose's 50th Golden Jubilee",
    category: 'BIRTHDAY',
    eventDate: '2026-08-12',
    daysRemaining: -61,
    month: 8,
    day: 12,
    celebrant: 'Family Matriarch & Community Educator',
    icon: '🎂',
    location: 'Bamenda, Cameroon',
    hasCelebrationPlanned: false,
    monogram: 'AR',
    color: '#9333EA',
    isVerifiedCivil: true,
    relativeText: '61 days ago',
    scope: 'CIRCLE'
  },

  // September
  {
    id: 'rem-sep-1',
    title: "Brother's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-09-05',
    daysRemaining: -37,
    month: 9,
    day: 5,
    celebrant: 'Older Brother & Lifelong Confidant',
    icon: '🎂',
    location: 'Toronto, Canada',
    hasCelebrationPlanned: true,
    monogram: 'B',
    color: '#991B1B',
    isVerifiedCivil: true,
    relativeText: '37 days ago',
    scope: 'CIRCLE'
  },
  {
    id: 'rem-sep-2',
    title: "Patience Ebude's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-09-14',
    daysRemaining: -28,
    month: 9,
    day: 14,
    celebrant: 'Beloved Friend & Co-creator',
    icon: '🎂',
    location: 'Buea, Cameroon',
    hasCelebrationPlanned: false,
    monogram: 'P',
    color: '#15803D',
    isVerifiedCivil: true,
    relativeText: '28 days ago',
    scope: 'CIRCLE'
  },
  {
    id: 'rem-sep-3',
    title: "Mama Success' Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-09-14',
    daysRemaining: -28,
    month: 9,
    day: 14,
    celebrant: 'Community Elder & Blessing',
    icon: '🎂',
    location: 'Lagos, Nigeria',
    hasCelebrationPlanned: false,
    monogram: 'S',
    color: '#A855F7',
    isVerifiedCivil: true,
    relativeText: '28 days ago',
    scope: 'CIRCLE'
  },

  // October (Upcoming)
  {
    id: 'rem-oct-1',
    title: "Christina's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-10-15',
    daysRemaining: 3,
    month: 10,
    day: 15,
    celebrant: 'Colleague & Lead Designer',
    icon: '🎈',
    location: 'London, UK',
    hasCelebrationPlanned: false,
    monogram: 'C',
    color: '#EAB308',
    isVerifiedCivil: true,
    relativeText: 'in 3 days',
    scope: 'CIRCLE',
    wants: ['Architectural Sketchbook', 'Ceremonial Matcha Set', 'Noise Canceling Headphones'],
    dontWants: ['No decorative mugs']
  },
  {
    id: 'rem-oct-2',
    title: "Laira's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-10-17',
    daysRemaining: 5,
    month: 10,
    day: 17,
    celebrant: 'Close Friend & Music Producer',
    icon: '✨',
    location: 'Berlin, Germany',
    hasCelebrationPlanned: false,
    monogram: 'M',
    color: '#D946EF',
    isVerifiedCivil: true,
    relativeText: 'in 5 days',
    scope: 'CIRCLE',
    wants: ['Vinyl Records', 'Studio Microphone Pop Filter']
  },
  {
    id: 'rem-oct-3',
    title: 'HBD Global Community Health Initiative',
    category: 'COMMUNITY',
    eventDate: '2026-10-24',
    daysRemaining: 12,
    month: 10,
    day: 24,
    celebrant: 'Celebration Giving & Free Clinics in 3 Cities',
    icon: '🌟',
    location: 'Douala, Nairobi & Accra',
    hasCelebrationPlanned: false,
    monogram: 'HBD',
    color: '#0284C7',
    isVerifiedCivil: true,
    relativeText: 'in 12 days',
    scope: 'GLOBAL'
  },

  // November
  {
    id: 'rem-nov-1',
    title: "Cyndy Love's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-11-12',
    daysRemaining: 31,
    month: 11,
    day: 12,
    celebrant: 'Best Friend & Event Planner',
    icon: '💖',
    location: 'Atlanta, USA',
    hasCelebrationPlanned: false,
    monogram: 'C',
    color: '#BE123C',
    isVerifiedCivil: true,
    relativeText: 'in 31 days',
    scope: 'CIRCLE'
  },
  {
    id: 'rem-nov-2',
    title: 'Kaba Technologies 10th Corporate Anniversary',
    category: 'BEGINNING',
    eventDate: '2026-11-18',
    daysRemaining: 37,
    month: 11,
    day: 18,
    celebrant: 'A Decade of Digital Excellence',
    icon: '🚀',
    location: 'Paris & Abidjan',
    hasCelebrationPlanned: false,
    monogram: 'KT',
    color: '#10B981',
    isVerifiedCivil: true,
    relativeText: 'in 37 days',
    scope: 'COUNTRY'
  },

  // December
  {
    id: 'rem-dec-1',
    title: "David Kouam's Birthday",
    category: 'BIRTHDAY',
    eventDate: '2026-12-04',
    daysRemaining: 53,
    month: 12,
    day: 4,
    celebrant: 'Brother & Software Engineer',
    icon: '🎂',
    location: 'Toronto, Canada',
    hasCelebrationPlanned: false,
    monogram: 'DK',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: 'in 53 days',
    scope: 'CIRCLE'
  },
  {
    id: 'rem-dec-2',
    title: "Sarah & Michael's 5th Wedding Anniversary",
    category: 'ANNIVERSARY',
    eventDate: '2026-12-19',
    daysRemaining: 68,
    month: 12,
    day: 19,
    celebrant: 'Wood Anniversary Celebration',
    icon: '💍',
    location: 'London, UK',
    hasCelebrationPlanned: false,
    monogram: 'SM',
    color: '#F43F5E',
    isVerifiedCivil: true,
    relativeText: 'in 68 days',
    scope: 'CIRCLE'
  },
  // Global Faith, Tributes & Milestones Additions
  {
    id: 'rem-mar-eid',
    title: 'Eid al-Fitr (Festival of Breaking the Fast)',
    category: 'FAITH',
    eventDate: '2026-03-20',
    daysRemaining: -206,
    month: 3,
    day: 20,
    celebrant: 'Sacred Celebration of Gratitude & Community',
    icon: '🌙',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'EF',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: '206 days ago',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'GIFT',
    heritageTradition: 'MUSLIM',
    wants: ['Artisan Eid Sweet Boxes', 'Charity Sadaqah Hampers', 'Luxury Perfume']
  },
  {
    id: 'rem-apr-easter',
    title: 'Easter Sunday Global Observance',
    category: 'FAITH',
    eventDate: '2026-04-05',
    daysRemaining: -190,
    month: 4,
    day: 5,
    celebrant: 'Resurrection Celebration of Renewal & Spring',
    icon: '✨',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'ES',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: '190 days ago',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'GIFT',
    heritageTradition: 'CHRISTIAN',
    wants: ['Spring Flower Bouquets', 'Gourmet Chocolates', 'Family Brunch Feast']
  },
  {
    id: 'rem-may-africa',
    title: 'Africa Day Continental Heritage Jubilee',
    category: 'COMMUNITY',
    eventDate: '2026-05-25',
    daysRemaining: -140,
    month: 5,
    day: 25,
    celebrant: 'African Unity, Culture, Music & Innovation',
    icon: '🌍',
    location: 'Pan-Continental & Global Diaspora',
    hasCelebrationPlanned: false,
    monogram: 'AD',
    color: '#10B981',
    isVerifiedCivil: true,
    relativeText: '140 days ago',
    scope: 'CONTINENT',
    tone: 'FESTIVE',
    commercialIntent: 'TOAST'
  },
  {
    id: 'rem-jun-cancer',
    title: 'National Cancer Survivors Day (Triumph of Life)',
    category: 'MILESTONE',
    eventDate: '2026-06-07',
    daysRemaining: -127,
    month: 6,
    day: 7,
    celebrant: 'Celebrating Courage, Remission & Healing Milestones',
    icon: '🎗️',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'CS',
    color: '#F59E0B',
    isVerifiedCivil: true,
    relativeText: '127 days ago',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'POT',
    wants: ['Wellness Retreat Day', 'Engraved Survivor Bracelet']
  },
  {
    id: 'rem-jul-mandela',
    title: 'Nelson Mandela International Day',
    category: 'COMMUNITY',
    eventDate: '2026-07-18',
    daysRemaining: -86,
    month: 7,
    day: 18,
    celebrant: '67 Minutes of Action for Equality, Peace & Freedom',
    icon: '🕊️',
    location: 'Johannesburg & Worldwide',
    hasCelebrationPlanned: false,
    monogram: 'NM',
    color: '#7C3AED',
    isVerifiedCivil: true,
    relativeText: '86 days ago',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'POT'
  },
  {
    id: 'rem-aug-chadwick',
    title: 'Chadwick Boseman Legacy Tribute (In Memoriam)',
    category: 'TRIBUTE',
    eventDate: '2026-08-28',
    daysRemaining: -45,
    month: 8,
    day: 28,
    celebrant: 'Celebration of Life: Purpose, Dignity & Art',
    icon: '🕯️',
    location: 'Worldwide Celebration of Life',
    hasCelebrationPlanned: false,
    monogram: 'CB',
    color: '#475569',
    isVerifiedCivil: true,
    relativeText: '45 days ago',
    scope: 'GLOBAL',
    tone: 'TRIBUTE',
    commercialIntent: 'TOAST',
    wants: ['Youth Theatre Scholarships', 'Cancer Research Donations']
  },
  {
    id: 'rem-sep-recovery',
    title: 'Global Recovery & Sobriety Milestones Day',
    category: 'MILESTONE',
    eventDate: '2026-09-20',
    daysRemaining: -22,
    month: 9,
    day: 20,
    celebrant: 'Honoring Strength & New Beginnings in Health',
    icon: '🏆',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'RS',
    color: '#F59E0B',
    isVerifiedCivil: true,
    relativeText: '22 days ago',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'TOAST',
    wants: ['Sobriety Milestone Medallion', 'Mindfulness Journal']
  },
  {
    id: 'rem-oct-jobs',
    title: 'Steve Jobs Legacy Memorial (In Memoriam)',
    category: 'TRIBUTE',
    eventDate: '2026-10-05',
    daysRemaining: -7,
    month: 10,
    day: 5,
    celebrant: 'Remembering the Visionary at Art & Tech Intersection',
    icon: '🕯️',
    location: 'Cupertino & Worldwide',
    hasCelebrationPlanned: false,
    monogram: 'SJ',
    color: '#475569',
    isVerifiedCivil: true,
    relativeText: '7 days ago',
    scope: 'GLOBAL',
    tone: 'TRIBUTE',
    commercialIntent: 'TOAST'
  },
  {
    id: 'rem-nov-muertos',
    title: 'Día de los Muertos (Celebration of Life)',
    category: 'TRIBUTE',
    eventDate: '2026-11-02',
    daysRemaining: 21,
    month: 11,
    day: 2,
    celebrant: 'Sacred Ancestral Remembrance & Enduring Love',
    icon: '🕯️',
    location: 'Mexico & Global Diaspora',
    hasCelebrationPlanned: false,
    monogram: 'DM',
    color: '#475569',
    isVerifiedCivil: true,
    relativeText: 'in 21 days',
    scope: 'GLOBAL',
    tone: 'TRIBUTE',
    commercialIntent: 'TOAST',
    heritageTradition: 'CULTURAL',
    wants: ['Memorial Marigold Flowers', 'Handmade Incense', 'Artisan Sugar Skulls']
  },
  {
    id: 'rem-nov-diwali',
    title: 'Diwali (Festival of Lights & New Beginnings)',
    category: 'FAITH',
    eventDate: '2026-11-08',
    daysRemaining: 27,
    month: 11,
    day: 8,
    celebrant: 'Triumph of Light Over Darkness & Knowledge',
    icon: '🪔',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'DW',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: 'in 27 days',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'GIFT',
    heritageTradition: 'HINDU',
    wants: ['Traditional Silver Coin', 'Luxury Mithai Sweet Boxes', 'Handmade Clay Diyas']
  },
  {
    id: 'rem-dec-hanukkah',
    title: 'Hanukkah (Festival of Dedication & Lights)',
    category: 'FAITH',
    eventDate: '2026-12-04',
    daysRemaining: 53,
    month: 12,
    day: 4,
    celebrant: 'Eight Nights of Miracles & Family Gatherings',
    icon: '🕎',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'HN',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: 'in 53 days',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'GIFT',
    heritageTradition: 'JEWISH',
    wants: ['Artisan Menorah', 'Gourmet Chocolate Gelt', 'Hand-painted Dreidel']
  },
  {
    id: 'rem-dec-xmas',
    title: 'Christmas Day Worldwide Observance',
    category: 'FAITH',
    eventDate: '2026-12-25',
    daysRemaining: 74,
    month: 12,
    day: 25,
    celebrant: 'Universal Season of Peace, Giving & Family Reunion',
    icon: '🎄',
    location: 'Worldwide Observance',
    hasCelebrationPlanned: false,
    monogram: 'XM',
    color: '#6366F1',
    isVerifiedCivil: true,
    relativeText: 'in 74 days',
    scope: 'GLOBAL',
    tone: 'FESTIVE',
    commercialIntent: 'GIFT',
    heritageTradition: 'CHRISTIAN',
    wants: ['Luxury Holiday Hamper', 'Handcrafted Pine Wreath', 'Artisan Spiced Cider Set']
  }
];

function getRealMonthWeeks(
  year: number,
  monthNum: number,
  monthEvents: MobileCalendarItem[]
): CalendarWeek[] {
  const monthIndex = monthNum - 1;
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const weeks: CalendarWeek[] = [];
  let currentWeek: (CalendarDaySlot | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday = (year === currentYear && monthNum === currentMonth && d === currentDay);
    const dayEvents = monthEvents.filter(e => e.day === d);
    const hasCelebration = dayEvents.length > 0;
    const celebrationColor = hasCelebration ? dayEvents[0].color : undefined;
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    currentWeek.push({
      day: d,
      dateStr,
      isToday,
      hasCelebration,
      celebrationColor,
      celebrations: dayEvents
    });

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push({ days: currentWeek });
  }

  return weeks;
}

function getDayMilestones(month: number, day: number) {
  const milestones: Record<string, { title: string; subtitle: string; iconName: keyof typeof Feather.glyphMap; luminary: string; category: string }> = {
    '10-12': {
      title: "World Innovation & Space Exploration Landmark",
      subtitle: "Commemorating humanity's bold breakthroughs in aerospace, computer science & global networks.",
      iconName: 'globe',
      luminary: 'Ada Lovelace & Katherine Johnson',
      category: 'GLOBAL INNOVATION'
    },
    '10-15': {
      title: "Global Handwashing & Rural Health Triumph",
      subtitle: "Universal community healthcare impact reaching over 120 nations.",
      iconName: 'heart',
      luminary: 'Dr. Denis Mukwege',
      category: 'COMMUNITY HEALTH'
    },
    '10-17': {
      title: "International Solidarity for Human Dignity",
      subtitle: "Celebrating grassroots champions lifting communities out of adversity.",
      iconName: 'award',
      luminary: 'Wangari Maathai',
      category: 'HUMAN DIGNITY'
    },
    '10-24': {
      title: "United Nations & Global Peace Charter Day",
      subtitle: "Universal collaboration and pan-continental goodwill observance.",
      iconName: 'flag',
      luminary: 'Kofi Annan',
      category: 'GLOBAL COOPERATION'
    }
  };

  const key = `${month}-${day}`;
  if (milestones[key]) {
    return milestones[key];
  }

  const seasons = ['Pioneering Discovery', 'Cultural Renaissance', 'Human Ingenuity', 'Community Solidarity'];
  const season = seasons[(month + day) % seasons.length];
  const iconsList: (keyof typeof Feather.glyphMap)[] = ['compass', 'sun', 'award', 'globe', 'star'];
  const luminaries = ['Nelson Mandela', 'Marie Curie', 'Miles Davis', 'Serena Williams', 'Leonardo da Vinci', 'Maya Angelou'];

  return {
    title: `${season} Observance`,
    subtitle: `Honoring human resilience, scientific evolution, and shared cultural heritage worldwide.`,
    iconName: iconsList[(day) % iconsList.length] || 'globe',
    luminary: luminaries[(month + day) % luminaries.length],
    category: 'HUMAN ACHIEVEMENT'
  };
}

export const DatesScreen: React.FC<DatesScreenProps> = ({ 
  onPlanCelebration, 
  onOpenGifts, 
  onOpenSurprisePackage 
}) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44);
  const [reminders, setReminders] = useState<MobileCalendarItem[]>(INITIAL_REMINDERS);
  
  // Active Calendar Granularity Dropdown state (Defaults to 1-Day View)
  const [viewGranularity, setViewGranularity] = useState<CalendarGranularity>('1day');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Search Query state
  const [searchQuery, setSearchQuery] = useState('');

  // Universal Joy Engine Toast state
  const [dailyToastCount, setDailyToastCount] = useState(1428);
  const [hasToastedToday, setHasToastedToday] = useState(false);

  // Current anchor date (default: Oct 12, 2026)
  const [anchorDate, setAnchorDate] = useState<Date>(new Date(2026, 9, 12));

  // Inline filter dropdown state (Strictly non-modal)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGeoScope, setSelectedGeoScope] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<InspirationDomain>('ALL_DOMAINS');

  // Active year & month helpers
  const selectedYear = anchorDate.getFullYear();
  const selectedMonthNum = anchorDate.getMonth() + 1; // 1-12

  // Navigation handlers for next and previous across granularities
  const handlePrev = () => {
    setAnchorDate(curr => {
      const d = new Date(curr);
      if (viewGranularity === '12months' || viewGranularity === 'list') {
        d.setFullYear(d.getFullYear() - 1);
      } else if (viewGranularity === '1month') {
        d.setMonth(d.getMonth() - 1);
      } else if (viewGranularity === 'weekly') {
        d.setDate(d.getDate() - 7);
      } else if (viewGranularity === '3days') {
        d.setDate(d.getDate() - 3);
      } else if (viewGranularity === '1day') {
        d.setDate(d.getDate() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setAnchorDate(curr => {
      const d = new Date(curr);
      if (viewGranularity === '12months' || viewGranularity === 'list') {
        d.setFullYear(d.getFullYear() + 1);
      } else if (viewGranularity === '1month') {
        d.setMonth(d.getMonth() + 1);
      } else if (viewGranularity === 'weekly') {
        d.setDate(d.getDate() + 7);
      } else if (viewGranularity === '3days') {
        d.setDate(d.getDate() + 3);
      } else if (viewGranularity === '1day') {
        d.setDate(d.getDate() + 1);
      }
      return d;
    });
  };

  // PanResponder to handle horizontal swipe gestures to slide next/previous
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          handleNext();
        } else if (gestureState.dx > 40) {
          handlePrev();
        }
      }
    })
  ).current;

  // Filtered celebrations
  const filteredReminders = reminders.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedDomain !== 'ALL_DOMAINS') {
      const domain = resolveInspirationDomain(item);
      if (domain !== selectedDomain) {
        return false;
      }
    }
    if (selectedGeoScope !== 'ALL' && item.scope !== selectedGeoScope) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCelebrant = item.celebrant.toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCelebrant && !matchLoc && !matchCat) {
        return false;
      }
    }
    return true;
  });

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedGeoScope !== 'ALL' || selectedDomain !== 'ALL_DOMAINS' || searchQuery.trim().length > 0;

  // Group filtered items by month
  const itemsByMonth = useMemo(() => {
    const grouped: Record<number, MobileCalendarItem[]> = {};
    for (let m = 1; m <= 12; m++) {
      grouped[m] = [];
    }
    filteredReminders.forEach(item => {
      if (grouped[item.month]) {
        grouped[item.month].push(item);
      }
    });
    return grouped;
  }, [filteredReminders]);

  // Derived periods for Weekly, 3 Days, and 1 Day views
  const weekDays = useMemo(() => {
    const start = new Date(anchorDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day); // Sunday of the week
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(start);
      next.setDate(start.getDate() + i);
      days.push(next);
    }
    return days;
  }, [anchorDate]);

  const threeDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const next = new Date(anchorDate);
      next.setDate(anchorDate.getDate() + i);
      days.push(next);
    }
    return days;
  }, [anchorDate]);

  // Upcoming celebration radar items for the next 1-4 days
  const upcomingRadarItems = useMemo(() => {
    const curMonth = anchorDate.getMonth() + 1;
    const curDay = anchorDate.getDate();
    return reminders.filter(r => {
      if (r.month === curMonth && r.day > curDay && r.day <= curDay + 4) return true;
      if (r.month === curMonth + 1 && curDay >= 28 && r.day <= 3) return true;
      return false;
    });
  }, [anchorDate, reminders]);

  // Header display label for active period
  const headerPeriodTitle = useMemo(() => {
    if (viewGranularity === '12months') {
      return `${selectedYear}`;
    }
    if (viewGranularity === 'list') {
      return `All ${selectedYear}`;
    }
    if (viewGranularity === '1month') {
      return `${MONTH_SHORT_NAMES[selectedMonthNum - 1]} ${selectedYear}`;
    }
    if (viewGranularity === 'weekly') {
      const first = weekDays[0];
      const last = weekDays[6];
      return `${MONTH_SHORT_NAMES[first.getMonth()]} ${first.getDate()} - ${MONTH_SHORT_NAMES[last.getMonth()]} ${last.getDate()}`;
    }
    if (viewGranularity === '3days') {
      const first = threeDays[0];
      const last = threeDays[2];
      return `${MONTH_SHORT_NAMES[first.getMonth()]} ${first.getDate()} - ${last.getDate()}`;
    }
    if (viewGranularity === '1day') {
      return `${WEEKDAY_NAMES_FULL[anchorDate.getDay()]}, ${MONTH_SHORT_NAMES[anchorDate.getMonth()]} ${anchorDate.getDate()}`;
    }
    return `${selectedYear}`;
  }, [viewGranularity, selectedYear, selectedMonthNum, weekDays, threeDays, anchorDate]);

  const activeOption = VIEW_OPTIONS.find(o => o.id === viewGranularity) || VIEW_OPTIONS[0];

  const handleAddCelebration = (targetMonth?: number) => {
    const m = targetMonth || selectedMonthNum;
    Alert.alert(
      'Add Celebration',
      `Add a birthday, startup founding, wedding, or idol tribute for ${MONTH_NAMES[m - 1]} ${selectedYear}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quick Add',
          onPress: () => {
            const newItem: MobileCalendarItem = {
              id: `rem-${Date.now()}`,
              title: `New Loved One Birthday`,
              category: 'BIRTHDAY',
              eventDate: `${selectedYear}-${String(m).padStart(2, '0')}-20`,
              daysRemaining: 8,
              month: m,
              day: 20,
              celebrant: 'New Contact',
              icon: '🎂',
              location: 'Global',
              hasCelebrationPlanned: false,
              monogram: 'NB',
              color: '#F59E0B',
              isVerifiedCivil: false,
              relativeText: 'in 8 days',
              scope: 'CIRCLE'
            };
            setReminders(prev => [newItem, ...prev]);
            Alert.alert('Saved!', 'Added to your celebration calendar.');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.screenRoot, { paddingTop: topInset + 6, backgroundColor: colors.bg }]}>
      {/* TOP APP BAR: View Granularity Dropdown Trigger, Period Navigator, Filter & Add Buttons */}
      <View style={[styles.topBar, { backgroundColor: '#1E1B4B' }]}>
        <View style={styles.topBarLeft}>
          {/* View Granularity Dropdown Trigger (NOT a modal) */}
          <TouchableOpacity 
            style={styles.granularityDropdownBtn}
            onPress={() => setIsDropdownOpen(prev => !prev)}
            activeOpacity={0.8}
            accessibilityLabel="Switch Calendar View"
          >
            <Feather name={activeOption.iconName} size={14} color="#A5B4FC" />
            <Text style={styles.granularityLabel} numberOfLines={1}>
              {activeOption.label.replace(' View', '')}
            </Text>
            <Feather name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={13} color="#A5B4FC" />
          </TouchableOpacity>

          {/* Period Navigator with Left/Right Arrows */}
          <View style={styles.periodNavContainer}>
            <TouchableOpacity 
              onPress={handlePrev}
              style={styles.periodArrowBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="chevron-left" size={17} color="#A5B4FC" />
            </TouchableOpacity>

            <Text style={styles.periodTitleText} numberOfLines={1}>
              {headerPeriodTitle}
            </Text>

            <TouchableOpacity 
              onPress={handleNext}
              style={styles.periodArrowBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="chevron-right" size={17} color="#A5B4FC" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.topBarRight}>
          {/* Filter Dropdown Toggle Button (Strictly non-modal) */}
          <TouchableOpacity 
            style={[
              styles.filterNavBtn, 
              hasActiveFilters && styles.filterNavBtnActive
            ]}
            onPress={() => setIsFilterDropdownOpen(prev => !prev)}
            accessibilityLabel="Filter Celebrations"
          >
            <Feather name="filter" size={15} color={hasActiveFilters ? '#FFF' : '#A5B4FC'} />
            {hasActiveFilters && <View style={styles.filterDotBadge} />}
          </TouchableOpacity>

          {/* Add Celebration (+) Button */}
          <TouchableOpacity 
            style={styles.addBtnCircle}
            onPress={() => handleAddCelebration()}
            accessibilityLabel="Add Celebration"
          >
            <Feather name="plus" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MOBILE SEARCH BAR */}
      <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <Feather name="search" size={15} color={colors.muted} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.fg }]}
          placeholder="Search celebrations, people, milestones..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="x" size={15} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* INLINE VIEW SWITCHER DROPDOWN (Not a modal, anchored below navbar) */}
      {isDropdownOpen && (
        <View style={styles.inlineDropdownWrapper}>
          <TouchableOpacity 
            style={styles.dropdownDismissTouch} 
            activeOpacity={1} 
            onPress={() => setIsDropdownOpen(false)} 
          />
          <View style={[styles.inlineDropdownMenu, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[styles.dropdownHeaderLabel, { color: colors.muted }]}>
              CALENDAR VIEW GRANULARITY
            </Text>
            {VIEW_OPTIONS.map(opt => {
              const isSelected = viewGranularity === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.dropdownItemRow,
                    isSelected && { backgroundColor: colors.purpleSoft }
                  ]}
                  onPress={() => {
                    setViewGranularity(opt.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Feather 
                    name={opt.iconName} 
                    size={15} 
                    color={isSelected ? colors.purple : colors.muted} 
                  />
                  <Text 
                    style={[
                      styles.dropdownItemText,
                      { color: isSelected ? colors.purple : colors.fg, fontWeight: isSelected ? '700' : '500' }
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={15} color={colors.purple} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* INLINE FILTER DROPDOWN (Not a modal, anchored below top bar) */}
      {isFilterDropdownOpen && (
        <View style={styles.inlineFilterDropdownWrapper}>
          <TouchableOpacity 
            style={styles.dropdownDismissTouch} 
            activeOpacity={1} 
            onPress={() => setIsFilterDropdownOpen(false)} 
          />
          <View style={[styles.inlineFilterDropdownMenu, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="filter" size={14} color={colors.purple} />
                <Text style={[styles.filterDropdownTitle, { color: colors.fg }]}>Filter Joy & Scopes</Text>
              </View>
              <TouchableOpacity onPress={() => setIsFilterDropdownOpen(false)}>
                <Feather name="x" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Pillar 1: Celebration Type with signature UX color mapping */}
            <Text style={[styles.filterSectionTitle, { color: colors.muted, marginBottom: 6 }]}>
              Celebration Type:
            </Text>
            <View style={styles.filterChipGrid}>
              {[
                { id: 'ALL', label: 'All Joy', iconName: 'sparkles', color: '#7C3AED', softBg: '#F5F3FF' },
                { id: 'BIRTHDAY', label: 'People & Birthdays', iconName: 'gift', color: '#2563EB', softBg: '#EFF6FF' },
                { id: 'BEGINNING', label: 'Beginnings & Startups', iconName: 'briefcase', color: '#10B981', softBg: '#ECFDF5' },
                { id: 'MILESTONE', label: 'Milestones & Triumphs', iconName: 'award', color: '#F59E0B', softBg: '#FFFBEB' },
                { id: 'ANNIVERSARY', label: 'Anniversaries & Weddings', iconName: 'heart', color: '#E11D48', softBg: '#FFF1F2' },
                { id: 'COMMUNITY', label: 'Community Heroes & Idols', iconName: 'globe', color: '#7C3AED', softBg: '#F5F3FF' },
                { id: 'FAITH', label: 'Faith & Sacred Heritage', iconName: 'sun', color: '#6366F1', softBg: '#EEF2FF' },
                { id: 'TRIBUTE', label: 'Tributes & Remembrance', iconName: 'shield', color: '#475569', softBg: '#F8FAFC' }
              ].map(opt => {
                const isSelected = selectedCategory === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.filterModalChip,
                      {
                        backgroundColor: isSelected ? opt.color : opt.softBg,
                        borderColor: isSelected ? opt.color : `${opt.color}40`
                      }
                    ]}
                    onPress={() => setSelectedCategory(opt.id)}
                  >
                    <Feather 
                      name={opt.iconName === 'sparkles' ? 'star' : (opt.iconName as any)} 
                      size={11} 
                      color={isSelected ? '#FFF' : opt.color} 
                    />
                    <Text
                      style={[
                        styles.filterModalChipText,
                        { color: isSelected ? '#FFF' : opt.color, fontWeight: isSelected ? '800' : '600' }
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pillar 2: Inspiration Field / Domain */}
            <Text style={[styles.filterSectionTitle, { color: colors.muted, marginTop: 10, marginBottom: 6 }]}>
              Inspiration Field:
            </Text>
            <View style={styles.filterChipGrid}>
              {[
                { id: 'ALL_DOMAINS', label: 'All Fields', iconName: 'star' },
                { id: 'TECH_BUSINESS', label: 'Tech & Business', iconName: 'briefcase' },
                { id: 'MUSIC_ARTS', label: 'Music & Arts', iconName: 'music' },
                { id: 'SPORTS_PIONEERS', label: 'Sports & Pioneers', iconName: 'award' },
                { id: 'HUMANITARIAN_LEADERS', label: 'Humanitarians & Leaders', iconName: 'heart' },
                { id: 'SCIENCE_DISCOVERY', label: 'Science & Space', iconName: 'compass' },
                { id: 'EARTH_NATURE', label: 'Earth & Wildlife', iconName: 'globe' },
                { id: 'FAITH_PHILOSOPHY', label: 'Faith & Philosophy', iconName: 'book-open' }
              ].map(dom => {
                const isSelected = selectedDomain === dom.id;
                return (
                  <TouchableOpacity
                    key={dom.id}
                    style={[
                      styles.filterModalChip,
                      {
                        backgroundColor: isSelected ? colors.purple : colors.bg,
                        borderColor: isSelected ? colors.purple : colors.line
                      }
                    ]}
                    onPress={() => setSelectedDomain(dom.id as InspirationDomain)}
                  >
                    <Feather name={dom.iconName as any} size={11} color={isSelected ? '#FFF' : colors.purple} />
                    <Text
                      style={[
                        styles.filterModalChipText,
                        { color: isSelected ? '#FFF' : colors.fg, fontWeight: isSelected ? '700' : '500' }
                      ]}
                    >
                      {dom.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pillar 3: Scope & Circle */}
            <Text style={[styles.filterSectionTitle, { color: colors.muted, marginTop: 10, marginBottom: 6 }]}>
              Scope & Circle:
            </Text>
            <View style={styles.filterChipGrid}>
              {[
                { id: 'ALL', label: 'All Scopes', iconName: 'globe' },
                { id: 'CIRCLE', label: 'Family & Friends', iconName: 'users' },
                { id: 'LOCAL', label: 'Local City', iconName: 'map-pin' },
                { id: 'COUNTRY', label: 'Country Level', iconName: 'flag' },
                { id: 'CONTINENT', label: 'Pan-Continental', iconName: 'compass' },
                { id: 'GLOBAL', label: 'Worldwide Observance', iconName: 'globe' }
              ].map(scope => {
                const isSelected = selectedGeoScope === scope.id;
                return (
                  <TouchableOpacity
                    key={scope.id}
                    style={[
                      styles.filterModalChip,
                      {
                        backgroundColor: isSelected ? colors.coral : `${colors.coral}10`,
                        borderColor: isSelected ? colors.coral : colors.line
                      }
                    ]}
                    onPress={() => setSelectedGeoScope(scope.id)}
                  >
                    <Feather name={scope.iconName as any} size={11} color={isSelected ? '#FFF' : colors.coral} />
                    <Text
                      style={[
                        styles.filterModalChipText,
                        { color: isSelected ? '#FFF' : colors.coral, fontWeight: isSelected ? '700' : '500' }
                      ]}
                    >
                      {scope.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dropdown Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory('ALL');
                  setSelectedGeoScope('ALL');
                  setSelectedDomain('ALL_DOMAINS');
                }}
                style={{ paddingVertical: 6, paddingHorizontal: 12 }}
              >
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: colors.muted }}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsFilterDropdownOpen(false)}
                style={{ backgroundColor: colors.purple, paddingVertical: 7, paddingHorizontal: 16, borderRadius: 8 }}
              >
                <Text style={{ color: '#FFF', fontSize: 12, fontFamily: 'Poppins-Bold' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ACTIVE FILTER BANNER (If filters are active) */}
      {hasActiveFilters && (
        <View style={[styles.activeFilterBanner, { backgroundColor: colors.purpleSoft, borderColor: colors.line }]}>
          <Text style={[styles.activeFilterText, { color: colors.purple }]}>
            Filtered: {selectedCategory !== 'ALL' ? selectedCategory : 'All Joy'} · {selectedGeoScope !== 'ALL' ? selectedGeoScope : 'All Scopes'}{searchQuery.trim() ? ` · "${searchQuery}"` : ''}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedCategory('ALL');
              setSelectedGeoScope('ALL');
              setSearchQuery('');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={[styles.clearFilterText, { color: colors.coral }]}>Clear</Text>
            <Feather name="x" size={12} color={colors.coral} />
          </TouchableOpacity>
        </View>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: 12-MONTHS 2-PER-ROW VERTICAL SCROLL GRID               */}
      {/* ============================================================== */}
      {viewGranularity === '12months' && (
        <ScrollView 
          style={styles.twelveMonthsScrollView} 
          contentContainerStyle={styles.twelveMonthsScrollContent}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers}
        >
          {[0, 1, 2, 3, 4, 5].map(rowIndex => (
            <View key={`row-${rowIndex}`} style={styles.gridRowTwoColumns}>
              {[0, 1].map(colIndex => {
                const monthIndex = rowIndex * 2 + colIndex;
                const monthNum = monthIndex + 1;
                const monthName = MONTH_NAMES[monthIndex];
                const monthItems = itemsByMonth[monthNum] || [];
                const monthWeeks = getRealMonthWeeks(selectedYear, monthNum, monthItems);

                return (
                  <TouchableOpacity
                    key={monthName}
                    style={[
                      styles.twoColMonthCard,
                      { backgroundColor: colors.card, borderColor: colors.line }
                    ]}
                    onPress={() => {
                      setAnchorDate(new Date(selectedYear, monthIndex, 12));
                      setViewGranularity('1month');
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.twoColMonthHeader}>
                      <Text style={[styles.twoColMonthTitle, { color: colors.fg }]}>
                        {monthName}
                      </Text>
                      {monthItems.length > 0 && (
                        <View style={[styles.twoColCountPill, { backgroundColor: colors.purpleSoft }]}>
                          <Text style={[styles.twoColCountText, { color: colors.purple }]}>
                            {monthItems.length} {monthItems.length === 1 ? 'event' : 'events'}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.twoColWeekdayRow}>
                      {WEEKDAY_HEADERS.map((w, idx) => (
                        <Text key={idx} style={[styles.twoColWeekdayText, { color: colors.muted }]}>
                          {w}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.twoColWeeksContainer}>
                      {monthWeeks.map((week, wIdx) => (
                        <View key={`w-${wIdx}`} style={styles.compactWeekRow}>
                          {week.days.map((slot, dIdx) => (
                            <View key={`d-${dIdx}`} style={styles.compactDaySlot}>
                              {slot ? (
                                <View
                                  style={[
                                    styles.twoColDayBubble,
                                    slot.isToday && styles.twoColDayToday
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.twoColDayNum,
                                      { color: slot.isToday ? '#FFF' : colors.fg },
                                      slot.hasCelebration && !slot.isToday && { fontWeight: '800' }
                                    ]}
                                  >
                                    {slot.day}
                                  </Text>
                                  {slot.hasCelebration && !slot.isToday && (
                                    <View style={styles.twoColDotsRow}>
                                      {slot.celebrations.slice(0, 3).map((cel, cIdx) => (
                                        <View 
                                          key={cIdx}
                                          style={[
                                            styles.twoColEventDot, 
                                            { backgroundColor: getCelebrationTheme(cel.category).color }
                                          ]} 
                                        />
                                      ))}
                                    </View>
                                  )}
                                </View>
                              ) : (
                                <View style={styles.compactEmptyDay} />
                              )}
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <View style={styles.swipeHintRow}>
            <Feather name="info" size={12} color={colors.muted} />
            <Text style={[styles.swipeHintText, { color: colors.muted }]}>
              Swipe left / right to change year · Tap any month for 1-Month view
            </Text>
          </View>
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: 1-MONTH DETAILED VIEW ONLY (Slidable)                  */}
      {/* ============================================================== */}
      {viewGranularity === '1month' && (
        <View style={styles.singleMonthContainer} {...panResponder.panHandlers}>
          {/* Weekday Full Headers */}
          <View style={[styles.fullWeekdayRow, { borderBottomColor: colors.line }]}>
            {WEEKDAY_NAMES_FULL.map((w, idx) => (
              <Text key={idx} style={[styles.fullWeekdayHeader, { color: colors.muted }]}>
                {w}
              </Text>
            ))}
          </View>

          {/* Month Calendar Grid with Detailed Event Pills */}
          <ScrollView 
            style={styles.fullMonthScrollView} 
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            {getRealMonthWeeks(selectedYear, selectedMonthNum, itemsByMonth[selectedMonthNum] || []).map((week, wIdx) => (
              <View key={`week-${wIdx}`} style={[styles.fullMonthWeekRow, { borderBottomColor: colors.line }]}>
                {week.days.map((slot, dIdx) => (
                  <TouchableOpacity
                    key={`slot-${dIdx}`}
                    style={[
                      styles.fullMonthDayCell,
                      { borderColor: colors.line },
                      slot?.isToday && { backgroundColor: `${colors.coral}10` }
                    ]}
                    onPress={() => {
                      if (slot) {
                        setAnchorDate(new Date(selectedYear, selectedMonthNum - 1, slot.day));
                        setViewGranularity('1day');
                      }
                    }}
                    activeOpacity={slot ? 0.7 : 1}
                  >
                    {slot ? (
                      <View style={{ flex: 1, padding: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text
                            style={[
                              styles.fullMonthDayNumber,
                              { color: slot.isToday ? colors.coral : colors.fg },
                              slot.isToday && { fontWeight: '900' }
                            ]}
                          >
                            {slot.day}
                          </Text>
                          {slot.hasCelebration && (
                            <View style={[styles.microEventDot, { backgroundColor: slot.celebrationColor || colors.purple }]} />
                          )}
                        </View>

                        {/* Event tags in cell */}
                        <View style={{ marginTop: 2, gap: 2 }}>
                          {slot.celebrations.slice(0, 2).map(c => {
                            const cTheme = getCelebrationTheme(c.category);
                            return (
                              <View 
                                key={c.id} 
                                style={[
                                  styles.fullMonthEventPill, 
                                  { 
                                    backgroundColor: cTheme.bg,
                                    borderColor: cTheme.border,
                                    borderWidth: 0.5,
                                  }
                                ]}
                              >
                                <Text 
                                  style={[styles.fullMonthEventText, { color: cTheme.color }]} 
                                  numberOfLines={1}
                                >
                                  {c.monogram} {c.title.split(' ')[0]}
                                </Text>
                              </View>
                            );
                          })}
                          {slot.celebrations.length > 2 && (
                            <Text style={{ fontSize: 7, color: colors.muted, fontWeight: '700' }}>
                              +{slot.celebrations.length - 2} more
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.swipeHintRow}>
              <Text style={[styles.swipeHintText, { color: colors.muted }]}>
                Swipe ◄ ► for previous/next month · Tap day for 1-Day View
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: WEEKLY VIEW (7 Days Across / Slidable)                 */}
      {/* ============================================================== */}
      {viewGranularity === 'weekly' && (
        <ScrollView 
          style={styles.flexScroll} 
          contentContainerStyle={styles.agendaScroll}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers}
        >
          {weekDays.map(date => {
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const isToday = (
              date.getFullYear() === 2026 &&
              m === 10 &&
              d === 12
            );
            const dayEvents = reminders.filter(r => r.month === m && r.day === d);

            return (
              <View 
                key={date.toISOString()}
                style={[
                  styles.dayCardSection,
                  { backgroundColor: colors.card, borderColor: isToday ? colors.coral : colors.line }
                ]}
              >
                {/* Day Header */}
                <View style={[styles.dayCardHeader, { borderBottomColor: colors.line }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.weekdayPill, isToday && { backgroundColor: colors.coral }]}>
                      <Text style={[styles.weekdayPillText, isToday && { color: '#FFF' }]}>
                        {WEEKDAY_NAMES_FULL[date.getDay()]}
                      </Text>
                    </View>
                    <Text style={[styles.dayDateTitle, { color: colors.fg }]}>
                      {MONTH_NAMES[m - 1]} {d}, {date.getFullYear()}
                    </Text>
                  </View>
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>TODAY</Text>
                    </View>
                  )}
                </View>

                {/* Celebrations for this day */}
                {dayEvents.length === 0 ? (
                  <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11.5, color: colors.muted }}>
                      No celebrations scheduled for this day
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 8, marginTop: 8 }}>
                    {dayEvents.map(event => {
                      const evTheme = getCelebrationTheme(event.category);
                      return (
                      <View 
                        key={event.id}
                        style={[
                          styles.detailedCelebrationRow, 
                          { 
                            backgroundColor: colors.bg, 
                            borderColor: colors.line,
                            borderLeftWidth: 3.5,
                            borderLeftColor: evTheme.color
                          }
                        ]}
                      >
                        <View style={[styles.monogramCircle, { backgroundColor: evTheme.color }]}>
                          <Text style={styles.monogramText}>{event.monogram}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.celebrationRowTitle, { color: colors.fg }]}>
                              {event.title}
                            </Text>
                            {event.isVerifiedCivil && (
                              <Feather name="check-circle" size={12} color="#34D399" />
                            )}
                          </View>
                          <Text style={[styles.celebrationRowSub, { color: colors.muted }]}>
                            {event.celebrant} · {event.location}
                          </Text>
                          {event.wants && event.wants.length > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <Feather name="gift" size={11} color={colors.purple} />
                              <Text style={[styles.wishlistSnippet, { color: colors.purple }]}>
                                Wants: {event.wants.join(', ')}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[styles.relativeDaysText, { color: colors.coral }]}>
                            {event.relativeText}
                          </Text>
                          <TouchableOpacity 
                            style={[
                              styles.quickPlanBtn, 
                              { backgroundColor: event.tone === 'TRIBUTE' ? '#475569' : colors.purple }
                            ]}
                            onPress={() => onPlanCelebration(event)}
                          >
                            <Text style={styles.quickPlanBtnText}>
                              {event.tone === 'TRIBUTE' ? 'Honor' : 'Plan'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: 3-DAYS VIEW (Deep visibility side-by-side / Slidable)   */}
      {/* ============================================================== */}
      {viewGranularity === '3days' && (
        <ScrollView 
          style={styles.flexScroll} 
          contentContainerStyle={styles.agendaScroll}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers}
        >
          {threeDays.map(date => {
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const isToday = (
              date.getFullYear() === 2026 &&
              m === 10 &&
              d === 12
            );
            const dayEvents = reminders.filter(r => r.month === m && r.day === d);

            return (
              <View 
                key={date.toISOString()}
                style={[
                  styles.threeDayCard,
                  { backgroundColor: colors.card, borderColor: isToday ? colors.coral : colors.line }
                ]}
              >
                <View style={[styles.threeDayHeader, { borderBottomColor: colors.line }]}>
                  <View>
                    <Text style={[styles.threeDayWeekday, { color: isToday ? colors.coral : colors.muted }]}>
                      {WEEKDAY_NAMES_FULL[date.getDay()]}
                    </Text>
                    <Text style={[styles.threeDayDateNum, { color: colors.fg }]}>
                      {MONTH_NAMES[m - 1]} {d}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 11, color: colors.muted, fontFamily: 'Inter-Medium' }}>
                      {dayEvents.length} Celebration{dayEvents.length !== 1 ? 's' : ''}
                    </Text>
                    {isToday && (
                      <View style={styles.todayPillSmall}>
                        <Text style={styles.todayPillText}>TODAY</Text>
                      </View>
                    )}
                  </View>
                </View>

                {dayEvents.length === 0 ? (
                  <View style={{ paddingVertical: 14, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      No events registered for this date.
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 10, marginTop: 8 }}>
                    {dayEvents.map(item => {
                      const itemTheme = getCelebrationTheme(item.category);
                      return (
                      <View 
                        key={item.id}
                        style={[
                          styles.threeDayEventBox, 
                          { 
                            backgroundColor: colors.bg, 
                            borderColor: colors.line,
                            borderLeftWidth: 3.5,
                            borderLeftColor: itemTheme.color,
                          }
                        ]}
                      >
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                          <View style={[styles.monogramCircle, { backgroundColor: itemTheme.color }]}>
                            <Text style={styles.monogramText}>{item.monogram}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.celebrationRowTitle, { color: colors.fg }]}>
                              {item.title}
                            </Text>
                            <Text style={[styles.celebrationRowSub, { color: colors.muted }]}>
                              {item.celebrant} · {item.location}
                            </Text>
                          </View>
                        </View>

                        {/* Wishlist and Avoid tags */}
                        {item.wants && item.wants.length > 0 && (
                          <View style={styles.wantsChipRow}>
                            <Feather name="gift" size={11} color={colors.purple} />
                            <Text style={{ fontSize: 10.5, color: colors.purple, fontFamily: 'Inter-Bold' }}>
                              Desired Gifts: {item.wants.join(' · ')}
                            </Text>
                          </View>
                        )}
                        {item.dontWants && item.dontWants.length > 0 && (
                          <View style={styles.dontWantsChipRow}>
                            <Feather name="slash" size={11} color="#EF4444" />
                            <Text style={{ fontSize: 10.5, color: '#EF4444', fontFamily: 'Inter-SemiBold' }}>
                              Avoid: {item.dontWants.join(' · ')}
                            </Text>
                          </View>
                        )}

                        <View style={styles.cardActionRow}>
                          <Text style={[styles.relativeDaysText, { color: colors.coral }]}>
                            {item.relativeText}
                          </Text>
                          <TouchableOpacity 
                            style={[
                              styles.quickPlanBtn, 
                              { backgroundColor: item.tone === 'TRIBUTE' ? '#475569' : colors.purple }
                            ]}
                            onPress={() => onPlanCelebration(item)}
                          >
                            <Text style={styles.quickPlanBtnText}>
                              {item.tone === 'TRIBUTE' ? 'Honor Legacy' : 'Plan Surprise'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* VIEW 5: 1-DAY VIEW (Comprehensive Single Day Dossier)          */}
      {/* ============================================================== */}
      {viewGranularity === '1day' && (
        <ScrollView 
          style={styles.flexScroll} 
          contentContainerStyle={styles.agendaScroll}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers}
        >
          {(() => {
            const m = anchorDate.getMonth() + 1;
            const d = anchorDate.getDate();
            const isToday = (
              anchorDate.getFullYear() === 2026 &&
              m === 10 &&
              d === 12
            );
            const dayEvents = reminders.filter(r => r.month === m && r.day === d);

            return (
              <View>
                {/* 1-Day Hero Header */}
                <View style={[styles.singleDayHeroCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={[styles.singleDayHeroWeekday, { color: isToday ? colors.coral : colors.muted }]}>
                        {WEEKDAY_NAMES_FULL[anchorDate.getDay()]}
                      </Text>
                      <Text style={[styles.singleDayHeroDate, { color: colors.fg }]}>
                        {MONTH_NAMES[m - 1]} {d}, {anchorDate.getFullYear()}
                      </Text>
                    </View>
                    {isToday && (
                      <View style={styles.todayPillLarge}>
                        <Text style={styles.todayPillLargeText}>TODAY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.singleDaySubtext, { color: colors.muted }]}>
                    {dayEvents.length} total event{dayEvents.length !== 1 ? 's' : ''} planned for this day
                  </Text>
                </View>

                {/* UNIVERSAL DAILY TOAST 🥂 BANNER */}
                <View style={[styles.toastBannerCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Feather name="award" size={15} color={colors.purple} />
                        <Text style={[styles.toastBannerTitle, { color: colors.fg }]}>
                          Universal Toast of the Day
                        </Text>
                      </View>
                      <Text style={[styles.toastBannerSub, { color: colors.muted }]}>
                        {dailyToastCount.toLocaleString()} people lifted a celebration toast today
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.toastActionBtn,
                        { backgroundColor: hasToastedToday ? '#059669' : colors.purple }
                      ]}
                      onPress={() => {
                        setDailyToastCount(c => c + (hasToastedToday ? -1 : 1));
                        setHasToastedToday(t => !t);
                      }}
                      activeOpacity={0.8}
                    >
                      <Feather name={hasToastedToday ? 'check' : 'heart'} size={14} color="#FFF" />
                      <Text style={styles.toastActionBtnText}>
                        {hasToastedToday ? 'Toasted! 🥂' : 'Raise Toast'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Celebrations Dossier (if private celebrants exist) */}
                {dayEvents.length > 0 && (
                  <View style={{ gap: 12, marginTop: 12 }}>
                    <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
                      Personal & Circle Celebrations ({dayEvents.length})
                    </Text>
                    {dayEvents.map(event => {
                      const theme = getCelebrationTheme(event.category);
                      return (
                        <View 
                          key={event.id}
                          style={[
                            styles.fullDayCelebrationDossier, 
                            { 
                              backgroundColor: colors.card, 
                              borderColor: colors.line,
                              borderLeftWidth: 5,
                              borderLeftColor: theme.color
                            }
                          ]}
                        >
                          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                            <View style={[styles.monogramCircleLarge, { backgroundColor: theme.color }]}>
                              <Text style={styles.monogramTextLarge}>{event.monogram}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[styles.dossierTitle, { color: colors.fg }]}>
                                  {event.title}
                                </Text>
                                {event.isVerifiedCivil && (
                                  <Feather name="check-circle" size={14} color="#34D399" />
                                )}
                              </View>
                              <Text style={[styles.dossierSubtitle, { color: colors.muted }]}>
                                {event.celebrant} · {event.location}
                              </Text>
                              <View style={[
                                styles.categoryTagPill, 
                                { 
                                  backgroundColor: theme.bg, 
                                  borderColor: theme.border, 
                                  borderWidth: 1, 
                                  alignSelf: 'flex-start',
                                  marginTop: 4 
                                }
                              ]}>
                                <Text style={[styles.categoryTagText, { color: theme.color, fontWeight: '700' }]}>
                                  {theme.label}
                                </Text>
                              </View>
                            </View>
                          </View>

                        {/* Wishlist */}
                        {event.wants && event.wants.length > 0 && (
                          <View style={[styles.dossierInfoBox, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Feather name="gift" size={13} color={colors.purple} />
                              <Text style={[styles.dossierBoxHeader, { color: colors.purple }]}>
                                Wishlist & Desired Gifts:
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                              {event.wants.map((w, idx) => (
                                <View key={idx} style={[styles.wishChip, { backgroundColor: colors.card, borderColor: colors.line }]}>
                                  <Text style={[styles.wishChipText, { color: colors.fg }]}>{w}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Dislikes */}
                        {event.dontWants && event.dontWants.length > 0 && (
                          <View style={[styles.dossierInfoBox, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Feather name="slash" size={13} color="#EF4444" />
                              <Text style={[styles.dossierBoxHeader, { color: '#EF4444' }]}>
                                Dislikes & Things to Avoid:
                              </Text>
                            </View>
                            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}>
                              {event.dontWants.join(' · ')}
                            </Text>
                          </View>
                        )}

                        <View style={styles.dossierFooterRow}>
                          <Text style={[styles.dossierRelativeText, { color: colors.coral }]}>
                            {event.relativeText}
                          </Text>
                          <TouchableOpacity 
                            style={[
                              styles.dossierPlanBtn, 
                              { backgroundColor: event.tone === 'TRIBUTE' ? '#475569' : colors.purple }
                            ]}
                            onPress={() => onPlanCelebration(event)}
                          >
                            <Feather name={event.tone === 'TRIBUTE' ? "shield" : "gift"} size={14} color="#FFF" />
                            <Text style={styles.dossierPlanBtnText}>
                              {event.tone === 'TRIBUTE' ? 'Honor & Light Candle' : 'Plan Surprise Package'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                    })}
                  </View>
                )}

                {/* UNIVERSAL JOY ENGINE (When 0 private events, or as daily inspiration: NO DAY IS EVER EMPTY) */}
                {(() => {
                  const landmark = getDayMilestones(m, d);
                  return (
                    <View style={{ gap: 12, marginTop: 12 }}>
                      {/* World Landmark / Evolution Achievement */}
                      <View style={[styles.universalJoyCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <View style={[styles.joyIconBadge, { backgroundColor: `${colors.purple}20` }]}>
                            <Feather name={landmark.iconName} size={15} color={colors.purple} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.joyCategoryTag, { color: colors.purple }]}>
                              {landmark.category}
                            </Text>
                            <Text style={[styles.joyCardTitle, { color: colors.fg }]}>
                              {landmark.title}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.joyCardSubtext, { color: colors.muted }]}>
                          {landmark.subtitle}
                        </Text>
                      </View>

                      {/* Luminary & Role Model Spotlight */}
                      <View style={[styles.universalJoyCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <View style={[styles.joyIconBadge, { backgroundColor: `${colors.coral}20` }]}>
                            <Feather name="star" size={15} color={colors.coral} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.joyCategoryTag, { color: colors.coral }]}>
                              LUMINARY INSPIRATION
                            </Text>
                            <Text style={[styles.joyCardTitle, { color: colors.fg }]}>
                              {landmark.luminary}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.joyCardSubtext, { color: colors.muted }]}>
                          Celebrating visionary impact, resilience, and groundbreaking contributions to human progress.
                        </Text>
                      </View>

                      {/* Your Milestone & Goal Radar */}
                      <View style={[styles.universalJoyCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <View style={[styles.joyIconBadge, { backgroundColor: '#10B98120' }]}>
                            <Feather name="compass" size={15} color="#10B981" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.joyCategoryTag, { color: '#10B981' }]}>
                              YOUR MILESTONE RADAR
                            </Text>
                            <Text style={[styles.joyCardTitle, { color: colors.fg }]}>
                              AfroTech Labs 3rd Year Runway
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.joyCardSubtext, { color: colors.muted }]}>
                          Day 242 of relentless creation. Stay grounded and celebrate every milestone along the journey.
                        </Text>
                      </View>

                      {/* Add Celebration Contextual CTA */}
                      <TouchableOpacity 
                        style={[styles.addEventCTA, { backgroundColor: colors.purple }]}
                        onPress={() => handleAddCelebration(m)}
                      >
                        <Feather name="plus" size={16} color="#FFF" />
                        <Text style={styles.addEventCTAText}>Add Birthday or Celebration for this Day</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })()}

                {/* UPCOMING CELEBRATION RADAR (Next 72 Hours) */}
                {upcomingRadarItems.length > 0 && (
                  <View style={[styles.upcomingRadarSection, { backgroundColor: colors.card, borderColor: colors.line, marginTop: 14 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <Feather name="clock" size={14} color={colors.purple} />
                      <Text style={[styles.upcomingRadarTitle, { color: colors.fg }]}>
                        Upcoming Radar (Next 72 Hours)
                      </Text>
                    </View>
                    <View style={{ gap: 8 }}>
                      {upcomingRadarItems.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.upcomingRadarCard, { backgroundColor: colors.bg, borderColor: colors.line }]}
                          onPress={() => {
                            setAnchorDate(new Date(item.eventDate));
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.monogramCircleSmall, { backgroundColor: item.color }]}>
                            <Text style={styles.monogramTextSmall}>{item.monogram}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.upcomingItemTitle, { color: colors.fg }]} numberOfLines={1}>
                              {item.title}
                            </Text>
                            <Text style={[styles.upcomingItemSub, { color: colors.muted }]} numberOfLines={1}>
                              {MONTH_SHORT_NAMES[item.month - 1]} {item.day} · {item.celebrant}
                            </Text>
                          </View>
                          <View style={styles.upcomingBadgePill}>
                            <Text style={[styles.upcomingBadgeText, { color: colors.coral }]}>
                              {item.relativeText}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })()}
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* VIEW 6: CELEBRATIONS LIST VIEW (Agenda / Full Chronological)   */}
      {/* ============================================================== */}
      {viewGranularity === 'list' && (
        <ScrollView 
          style={styles.flexScroll} 
          contentContainerStyle={[styles.agendaScroll, { paddingBottom: 130 }]}
          showsVerticalScrollIndicator={false}
          {...panResponder.panHandlers}
        >
          <View style={[styles.listSummaryBar, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="list" size={16} color={colors.purple} />
              <Text style={[styles.listSummaryTitle, { color: colors.fg }]}>
                {selectedYear} Celebrations ({filteredReminders.length})
              </Text>
            </View>
            <Text style={[styles.listSummarySubtitle, { color: colors.muted }]}>
              Chronological View
            </Text>
          </View>

          {filteredReminders.length === 0 ? (
            <View style={[styles.emptyDayNotice, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Feather name="calendar" size={32} color={colors.muted} />
              <Text style={[styles.emptyDayTitle, { color: colors.fg }]}>
                No celebrations found
              </Text>
              <Text style={[styles.emptyDayDesc, { color: colors.muted }]}>
                No events match your current filter settings for {selectedYear}.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {filteredReminders.map(item => {
                const theme = getCelebrationTheme(item.category);
                const domain = resolveInspirationDomain(item);
                return (
                <View 
                  key={item.id}
                  style={[
                    styles.listCelebrationCard, 
                    { 
                      backgroundColor: colors.card, 
                      borderColor: colors.line,
                      borderLeftWidth: 4,
                      borderLeftColor: theme.color,
                    }
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.monogramCircleMedium, { backgroundColor: theme.color }]}>
                      <Text style={styles.monogramTextMedium}>{item.monogram}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.listCardTitle, { color: colors.fg }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {item.isVerifiedCivil && (
                          <Feather name="check-circle" size={13} color="#34D399" />
                        )}
                      </View>
                      <Text style={[styles.listCardSub, { color: colors.muted }]} numberOfLines={1}>
                        {item.celebrant} · {item.location}
                      </Text>
                    </View>
                    <View style={[styles.listCountdownPill, { backgroundColor: item.daysRemaining >= 0 && item.daysRemaining <= 7 ? `${colors.coral}20` : `${colors.purple}15` }]}>
                      <Text style={[styles.listCountdownText, { color: item.daysRemaining >= 0 && item.daysRemaining <= 7 ? colors.coral : colors.purple }]}>
                        {item.relativeText}
                      </Text>
                    </View>
                  </View>

                  {/* Meta chips: Category, Domain, Date, Location */}
                  <View style={styles.listCardMetaRow}>
                    <View style={[styles.categoryPillSmall, { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }]}>
                      <Feather 
                        name={theme.iconName} 
                        size={11} 
                        color={theme.color} 
                      />
                      <Text style={[styles.categoryPillSmallText, { color: theme.color }]}>
                        {theme.label}
                      </Text>
                    </View>

                    <View style={[styles.categoryPillSmall, { backgroundColor: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.25)', borderWidth: 1 }]}>
                      <Feather name="compass" size={10} color="#6366F1" />
                      <Text style={[styles.categoryPillSmallText, { color: '#6366F1' }]}>
                        {domain.replace('_', ' ')}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Feather name="calendar" size={12} color={colors.muted} />
                      <Text style={[styles.listCardDateText, { color: colors.muted }]}>
                        {MONTH_SHORT_NAMES[item.month - 1]} {item.day}, {selectedYear}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Feather name="map-pin" size={11} color={colors.muted} />
                      <Text style={[styles.listCardDateText, { color: colors.muted }]} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  </View>

                  {/* Wishes & Avoid tags with modern Feather icons */}
                  {item.wants && item.wants.length > 0 && (
                    <View style={[styles.listTagRow, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                      <Feather name="gift" size={12} color={colors.purple} />
                      <Text style={[styles.listTagLabel, { color: colors.purple }]}>Wishes:</Text>
                      <Text style={[styles.listTagValue, { color: colors.fg }]} numberOfLines={1}>
                        {item.wants.join(', ')}
                      </Text>
                    </View>
                  )}

                  {item.dontWants && item.dontWants.length > 0 && (
                    <View style={[styles.listTagRow, { backgroundColor: colors.bg, borderColor: colors.line }]}>
                      <Feather name="slash" size={12} color={colors.coral} />
                      <Text style={[styles.listTagLabel, { color: colors.coral }]}>Avoid:</Text>
                      <Text style={[styles.listTagValue, { color: colors.fg }]} numberOfLines={1}>
                        {item.dontWants.join(', ')}
                      </Text>
                    </View>
                  )}

                  <View style={styles.listCardFooter}>
                    <TouchableOpacity 
                      style={[
                        styles.listPlanBtn, 
                        { backgroundColor: item.tone === 'TRIBUTE' ? '#475569' : colors.purple }
                      ]}
                      onPress={() => onPlanCelebration(item)}
                    >
                      <Feather name={item.tone === 'TRIBUTE' ? "shield" : "gift"} size={13} color="#FFF" />
                      <Text style={styles.listPlanBtnText}>
                        {item.tone === 'TRIBUTE' ? 'Honor Legacy & Candle' : 'Plan Celebration'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
              })}
            </View>
          )}
        </ScrollView>
      )}



      <FloatingCelebrateButton onPress={() => onPlanCelebration()} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  granularityDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3730A3',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 11,
    minWidth: 128,
  },
  granularityIcon: {
    fontSize: 12,
  },
  granularityLabel: {
    color: '#FFF',
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
  },
  periodNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  periodArrowBtn: {
    padding: 3,
  },
  periodTitleText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    marginHorizontal: 2,
    flexShrink: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterNavBtnActive: {
    backgroundColor: '#7C3AED',
  },
  filterDotBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B6B',
  },
  addBtnCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* INLINE DROPDOWN (NOT A MODAL) */
  inlineDropdownWrapper: {
    position: 'absolute',
    top: 58,
    left: 12,
    right: 12,
    bottom: 0,
    zIndex: 9999,
  },
  dropdownDismissTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inlineDropdownMenu: {
    width: 220,
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  dropdownHeaderLabel: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dropdownItemEmoji: {
    fontSize: 14,
  },
  dropdownItemText: {
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
  },

  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  activeFilterText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  clearFilterText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },

  /* VIEW 1: 12-MONTH 2-COLUMNS SCROLLABLE GRID */
  twelveMonthsScrollView: {
    flex: 1,
  },
  twelveMonthsScrollContent: {
    paddingBottom: 130, // Bottom clearance so navbar never covers content
    paddingTop: 4,
  },
  gridRowTwoColumns: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  twoColMonthCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
  },
  twoColMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  twoColMonthTitle: {
    fontSize: 13.5,
    fontFamily: 'Poppins-Bold',
  },
  twoColCountPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  twoColCountText: {
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },
  twoColWeekdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  twoColWeekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9.5,
    fontFamily: 'Inter-Bold',
  },
  twoColWeeksContainer: {
    gap: 3,
  },
  twoColDayBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColDayToday: {
    backgroundColor: '#FF6B6B',
  },
  twoColDayNum: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  twoColDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: 1,
  },
  twoColEventDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  compactWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
  },
  compactDaySlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactEmptyDay: {
    width: 22,
    height: 22,
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  swipeHintText: {
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
  },

  /* VIEW 6: CELEBRATIONS LIST */
  listSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  listSummaryTitle: {
    fontSize: 13.5,
    fontFamily: 'Poppins-Bold',
  },
  listSummarySubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  listCelebrationCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  monogramCircleMedium: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramTextMedium: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  listCardTitle: {
    fontSize: 13.5,
    fontFamily: 'Poppins-Bold',
  },
  listCardSub: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  listCountdownPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  listCountdownText: {
    fontSize: 10.5,
    fontFamily: 'Poppins-Bold',
  },
  listCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  categoryPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  categoryPillSmallText: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
  },
  listCardDateText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  listTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  listTagLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  listTagValue: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  listCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  listPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  listPlanBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
  },

  /* VIEW 2: 1-MONTH VIEW ONLY */
  singleMonthContainer: {
    flex: 1,
  },
  fullWeekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  fullWeekdayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  fullMonthScrollView: {
    flex: 1,
  },
  fullMonthWeekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minHeight: 68,
  },
  fullMonthDayCell: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  fullMonthDayNumber: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  microEventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  fullMonthEventPill: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  fullMonthEventText: {
    fontSize: 7.5,
    fontFamily: 'Inter-Bold',
  },

  /* VIEW 3: WEEKLY VIEW */
  flexScroll: {
    flex: 1,
  },
  agendaScroll: {
    paddingBottom: 130, // Clears floating bottom navigation bar
  },
  dayCardSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 4,
  },
  weekdayPill: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  weekdayPillText: {
    color: '#FFF',
    fontSize: 10.5,
    fontFamily: 'Poppins-Bold',
  },
  dayDateTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  todayBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  todayBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter-Bold',
  },
  detailedCelebrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  monogramCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  celebrationRowTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  celebrationRowSub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  wishlistSnippet: {
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  relativeDaysText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  quickPlanBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 4,
  },
  quickPlanBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },

  /* VIEW 4: 3-DAYS VIEW */
  threeDayCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  threeDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  threeDayWeekday: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  threeDayDateNum: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  todayPillSmall: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
    marginTop: 2,
  },
  todayPillText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter-Bold',
  },
  threeDayEventBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  wantsChipRow: {
    backgroundColor: 'rgba(91, 42, 134, 0.08)',
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
  },
  dontWantsChipRow: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  /* VIEW 5: 1-DAY VIEW */
  singleDayHeroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  singleDayHeroWeekday: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  singleDayHeroDate: {
    fontSize: 19,
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
  },
  todayPillLarge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  todayPillLargeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  singleDaySubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
  },
  emptyDayNotice: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyDayTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
  },
  emptyDayDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  addEventCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 14,
  },
  addEventCTAText: {
    color: '#FFF',
    fontSize: 12.5,
    fontFamily: 'Inter-Bold',
  },
  fullDayCelebrationDossier: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  monogramCircleLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramTextLarge: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  dossierTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  dossierSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  categoryTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  categoryTagText: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
  },
  dossierInfoBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  dossierBoxHeader: {
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
  },
  wishChip: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  wishChipText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  dossierFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  dossierRelativeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  dossierPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dossierPlanBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontFamily: 'Inter-Bold',
  },

  /* SEARCH BAR */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
    padding: 0,
  },

  /* INLINE FILTER DROPDOWN */
  inlineFilterDropdownWrapper: {
    position: 'absolute',
    top: 58,
    left: 12,
    right: 12,
    bottom: 0,
    zIndex: 9999,
  },
  inlineFilterDropdownMenu: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },
  filterDropdownTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  filterSectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterModalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterModalChipText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },

  /* TOAST BANNER & UNIVERSAL JOY ENGINE */
  toastBannerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  toastBannerTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  toastBannerSub: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  toastActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  toastActionBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  universalJoyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  joyIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joyCategoryTag: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  joyCardTitle: {
    fontSize: 13.5,
    fontFamily: 'Poppins-Bold',
  },
  joyCardSubtext: {
    fontSize: 11.5,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
    marginTop: 2,
  },
  upcomingRadarSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  upcomingRadarTitle: {
    fontSize: 12.5,
    fontFamily: 'Poppins-Bold',
  },
  upcomingRadarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  upcomingItemTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  upcomingItemSub: {
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
  },
  upcomingBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  monogramCircleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramTextSmall: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
});
