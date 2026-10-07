/**
 * HBD Foundation — Global Celebration Brand
 * Shared Domain Types & Contracts
 */

export type CelebrationCategory = 
  | 'BIRTHDAY'     // Personal birthdays
  | 'BEGINNING'    // Startups, products, ideas, projects, movements
  | 'MILESTONE'    // Graduations, 1M users, promotions, breakthroughs
  | 'ANNIVERSARY'  // Company anniversaries, weddings, historical
  | 'ACHIEVEMENT'  // Personal and community triumphs
  | 'COMMUNITY';   // Causes, teachers, unsung heroes

export type PackageTier = 
  | 'MINI'         // Digital card, small gift, cake, delivery
  | 'CLASSIC'      // Cake, gift, flowers, balloons, photos, delivery
  | 'PREMIUM'      // Decor, photo/video, entertainment, surprise
  | 'SIGNATURE'    // Fully customized VIP production
  | 'GLOBAL';      // Cross-border celebration orchestrator

export type ReactionType = 
  | 'CONFETTI' 
  | 'HEART' 
  | 'TOAST' 
  | 'SPARK' 
  | 'CROWN';

export interface User {
  id: string;
  handle: string;
  fullName: string;
  avatarUrl: string;
  location: string;
  bio?: string;
  isVerified?: boolean;
  birthDate?: string;
  followersCount: number;
  celebrationsCount: number;
}

export interface Celebration {
  id: string;
  creatorId: string;
  creator: User;
  title: string;
  category: CelebrationCategory;
  eventDate: string;
  location: string;
  description: string;
  coverImage?: string;
  packageTier?: PackageTier;
  cheerCount: number;
  daysRemaining?: number;
  isMilestone?: boolean;
}

export interface ReelPost {
  id: string;
  celebrationId?: string;
  category: CelebrationCategory;
  user: User;
  videoUrl?: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  caption: string;
  audioTrack: string;
  cheerCount: number;
  commentCount: number;
  shareCount: number;
  isCheered?: boolean;
  isSaved?: boolean;
  celebrationBadge?: string;
  createdAt: string;
}

export interface CelebrationPackage {
  tier: PackageTier;
  title: string;
  tagline: string;
  priceLabel: string;
  badge?: string;
  isFeatured?: boolean;
  items: string[];
}

export interface CelebrationBookingRequest {
  id?: string;
  category: CelebrationCategory;
  celebrantName: string;
  celebrantRole?: string;
  date: string;
  location: string;
  guestCount?: number;
  tier: PackageTier;
  selectedAddons: string[];
  notes?: string;
  contactEmail: string;
  contactPhone: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'COMPLETED';
  createdAt?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: CelebrationCategory;
  eventDate: string;
  daysRemaining: number;
  celebrant: string;
  icon: string;
  hasCelebrationPlanned: boolean;
}

// -------------------------------------------------------------
// Universal Gift Engine & Connected Commerce Types
// -------------------------------------------------------------
export type GiftProviderType = 
  | 'amazon' 
  | 'shopify' 
  | 'local_artisan' 
  | 'florist' 
  | 'bakery' 
  | 'experience' 
  | 'gift_card';

export interface UniversalGiftItem {
  id: string;
  title: string;
  description: string;
  category: 'FLOWERS_CAKE' | 'FASHION' | 'TECH' | 'EXPERIENCE' | 'PERSONALIZED' | 'DIGITAL';
  price: number;
  currency: string;
  providerName: string;
  providerType: GiftProviderType;
  providerLogo?: string;
  locationScope: string; // e.g., 'London, UK', 'Douala, Cameroon', 'Global'
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  estimatedDeliveryDays: number;
  isCrossBorderReady: boolean;
  externalProductUrl?: string;
}

// -------------------------------------------------------------
// HBDays & "My People" Relationship Circle Types
// -------------------------------------------------------------
export interface PersonCircleMember {
  id: string;
  fullName: string;
  relationship: 'Mother' | 'Father' | 'Sister' | 'Brother' | 'Partner' | 'Friend' | 'Colleague' | 'Mentor';
  birthDate: string;
  location: string;
  avatarUrl: string;
  favoriteColor?: string;
  interests: string[];
  giftPreferences: string[];
  daysUntilCelebration: number;
  notes?: string;
}

export type HBDayType = 
  | 'PERSONAL'     // Friends, family in My People
  | 'GLOBAL'       // World cultural/historic observance
  | 'MILESTONE'    // Network milestones
  | 'BEGINNING'    // Startup launches, product debuts
  | 'COMMUNITY';   // Unsung heroes, teachers, community triumphs

export interface HBDayEvent {
  id: string;
  title: string;
  subtitle: string;
  type: HBDayType;
  date: string;
  location?: string;
  icon: string;
  featuredImage?: string;
  toastCount: number;
  isToasted?: boolean;
  participantCount?: number;
  actionCta?: string;
}

// -------------------------------------------------------------
// HBD Collective & Celebration Rooms Types
// -------------------------------------------------------------
export interface CelebrationRoom {
  id: string;
  celebrantName: string;
  title: string;
  occasion: string;
  eventDate: string;
  status: 'UPCOMING' | 'LIVE_NOW' | 'ARCHIVED_VAULT';
  coverImage: string;
  guestCount: number;
  potGoal: number;
  potRaised: number;
  potCurrency: string;
  organizerName: string;
  organizerAvatar: string;
  location: string;
  tributesCount: number;
  memoryVaultUnlocked: boolean;
}

// -------------------------------------------------------------
// HBD Gives (Celebration Philanthropy) Types
// -------------------------------------------------------------
export interface HBDGivesCause {
  id: string;
  title: string;
  beneficiary: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  mealsOrGiftsProvided: number;
  imageUrl: string;
  description: string;
}

// -------------------------------------------------------------
// Accounts, Onboarding & Celebration Preferences
// -------------------------------------------------------------
export type AuthMethod = 'PHONE' | 'EMAIL' | 'GOOGLE' | 'APPLE';

/** Who may see a user's birthday. The shipping address is NEVER shown to other users. */
export type BirthdayVisibility = 'EVERYONE' | 'FRIENDS' | 'ONLY_ME';

export interface CelebrationPreferences {
  interests: string[];        // e.g. 'Books', 'Perfume', 'Gaming'
  giftWishes: string[];       // things they'd love to receive
  avoid: string[];            // allergies, no alcohol, no flowers, etc.
  favoriteColor?: string;     // hex
  clothingSize?: string;
  shoeSize?: string;
}

export interface PrivacySettings {
  birthdayVisibility: BirthdayVisibility;
  showAge: boolean;
  preferencesVisibleToFriends: boolean;
}

export interface HBDProfile {
  id: string;
  handle: string;
  fullName: string;
  avatarUrl?: string;
  city: string;
  country: string;
  birthDay: number;           // 1-31
  birthMonth: number;         // 1-12
  birthYear?: number;         // optional — many users won't share it
  bio?: string;
  isVerified?: boolean;
  preferences: CelebrationPreferences;
  privacy: PrivacySettings;
  authMethod?: AuthMethod;
  contact?: string;           // phone or email (private, never shown to others)
  createdAt?: string;
}

// -------------------------------------------------------------
// Friends (Follow = one-way, Friend = mutual)
// -------------------------------------------------------------
export type FriendshipStatus = 'NONE' | 'REQUEST_SENT' | 'REQUEST_RECEIVED' | 'FRIENDS';
