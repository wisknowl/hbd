/**
 * HBD Foundation — Global Celebration Brand
 * Shared Domain Types & Contracts
 */

export type CelebrationCategory = 
  | 'BIRTHDAY'     // Personal birthdays
  | 'BEGINNING'    // Startups, products, ideas, projects, movements, graduations, new chapters
  | 'MILESTONE'    // Sobriety, health recovery, 1M users, promotions, breakthroughs
  | 'ANNIVERSARY'  // Company anniversaries, weddings, historical
  | 'ACHIEVEMENT'  // Personal and community triumphs
  | 'COMMUNITY'    // Causes, teachers, unsung heroes
  | 'ICONS'        // Idols, mentors, inspirational cultural legends
  | 'FAITH'        // Sacred holy days, rites of passage, Eid, Diwali, Easter, Yom Kippur, Hanukkah
  | 'TRIBUTE';     // In Memoriam, legacy remembrances, celebration of life

export type CelebrationTone = 'FESTIVE' | 'TRIBUTE';

export type CommercialIntent = 'GIFT' | 'POT' | 'TOAST' | 'EXPERIENCE';

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
  idols?: string[];           // Role models / icons
  musicGenres?: string[];     // Passions & music
  animalTypes?: string[];     // Passions & pets/animals
  hobbies?: string[];         // Passions & hobbies
  personalGoals?: string[];   // Milestones & aspirations
  traditions?: string[];      // Cultural & sacred traditions: 'SECULAR', 'CHRISTIAN', 'MUSLIM', 'HINDU', 'JEWISH', 'PAN_AFRICAN'
  showTributes?: boolean;     // Opt-in for In Memoriam & legacy remembrances
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
  // Official Document Verifiable Identity (Anti-Duplication)
  officialIdentity?: OfficialIdentityRecord;
  civilIdentityHash?: string; // SHA-256 hash of verified document to prevent duplicate person registrations
  isOfficialVerified?: boolean;
  createdAt?: string;
}

// -------------------------------------------------------------
// Official Document Identity Verification & Anti-Duplication Engine
// -------------------------------------------------------------
export type VerificationDocumentType = 
  | 'PASSPORT' 
  | 'NATIONAL_ID' 
  | 'DRIVERS_LICENSE' 
  | 'BIRTH_CERTIFICATE';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'PENDING_DOCUMENT_REVIEW' 
  | 'VERIFIED_OFFICIAL' 
  | 'REJECTED';

export interface OfficialIdentityRecord {
  legalFirstName: string;
  legalLastName: string;
  legalMiddleName?: string;
  documentType: VerificationDocumentType;
  civilIdentityHash: string; // Unique cryptographic fingerprint ensuring a human is never registered twice
  birthDate: string;        // YYYY-MM-DD from official civil document
  countryOfIssuance: string;
  status: VerificationStatus;
  verifiedAt?: string;
  verificationBadgeLevel?: 'CIVIL_VERIFIED' | 'GOVERNMENT_ID' | 'DIPLOMATIC_PUBLIC_FIGURE';
}

// -------------------------------------------------------------
// Managed Celebratory Objects (Spawned by Verified Individual)
// -------------------------------------------------------------
export type ManagedObjectType = 'STARTUP' | 'WEDDING' | 'MILESTONE' | 'IDOL';

export interface StartupObject {
  id: string;
  ownerProfileId: string;
  type: 'STARTUP';
  name: string;
  foundingDate: string; // YYYY-MM-DD
  industry: string;
  tagline?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isVerifiedVenture?: boolean;
  teamMemberIds?: string[];
  annualMilestones?: { year: number; title: string }[];
}

export interface WeddingObject {
  id: string;
  ownerProfileId: string;
  type: 'WEDDING';
  title: string; // e.g. "Sarah & Michael"
  partnerOneName: string;
  partnerTwoName: string;
  partnerTwoProfileId?: string;
  weddingDate: string; // YYYY-MM-DD
  anniversaryTier?: string; // e.g. "5th Anniversary (Wood)"
  venueOrCity?: string;
  registryUrl?: string;
  coverImage?: string;
}

export interface AcademicMilestoneObject {
  id: string;
  ownerProfileId: string;
  type: 'MILESTONE';
  title: string; // e.g. "Ph.D. in Artificial Intelligence"
  milestoneType: 'GRADUATION' | 'CERTIFICATION' | 'HONOR' | 'DISCOVERY' | 'SOBRIETY' | 'RETIREMENT';
  institution: string;
  achievementDate: string; // YYYY-MM-DD
  honors?: string;
  credentialUrl?: string;
}

export interface IdolHeroObject {
  id: string;
  createdById: string;
  type: 'IDOL';
  name: string; // e.g. "Nelson Mandela", "Prof. Wangari Maathai"
  domain: 'SCIENCE' | 'SPORTS' | 'ARTS_MUSIC' | 'CIVIL_RIGHTS' | 'TECH' | 'COMMUNITY' | 'LITERATURE';
  celebrationDate: string; // YYYY-MM-DD (Birthdate or Commemoration Day)
  tributeBio: string;
  avatarUrl?: string;
  isClaimedByPerson: boolean;
  claimedProfileId?: string;
  followersCount: number;
}

export type ManagedCelebrationObject = 
  | StartupObject 
  | WeddingObject 
  | AcademicMilestoneObject 
  | IdolHeroObject;

// -------------------------------------------------------------
// Placeholder Contact & Reconciliation Protocol
// -------------------------------------------------------------
export interface PlaceholderContact {
  id: string;
  createdById: string;
  fullName: string;
  tentativeBirthDate: string;
  relationship: string;
  whatTheyWant: string[];
  whatTheyDontWant: string[];
  privateNotes?: string;
  claimedProfileId?: string;
  isClaimed: boolean;
  reconciliationStatus: 'UNCLAIMED' | 'MATCH_DETECTED' | 'LINKED_VERIFIED';
}

// -------------------------------------------------------------
// Universal 12-Month Global Calendar Domain Models
// -------------------------------------------------------------
export type CalendarGeographicScope = 'LOCAL' | 'COUNTRY' | 'CONTINENT' | 'GLOBAL' | 'CIRCLE';

export type InspirationDomain = 
  | 'ALL_DOMAINS'
  | 'TECH_BUSINESS'
  | 'MUSIC_ARTS'
  | 'SPORTS_PIONEERS'
  | 'HUMANITARIAN_LEADERS'
  | 'SCIENCE_DISCOVERY'
  | 'EARTH_NATURE'
  | 'FAITH_PHILOSOPHY';

export interface GlobalCalendarEntry {
  id: string;
  title: string;
  subtitle?: string;
  category: CelebrationCategory;
  domain?: InspirationDomain;
  objectType: ManagedObjectType | 'PERSON';
  date: string; // YYYY-MM-DD
  day: number;
  month: number; // 1-12
  year?: number;
  avatarUrl?: string;
  monogram: string;
  color: string;
  geoScope: CalendarGeographicScope;
  location?: string;
  isVerifiedIdentity: boolean;
  daysRemaining: number;
  relativeLabel: string; // "in 3 days", "28 days ago"
  wants?: string[];
  dontWants?: string[];
  managedObjectId?: string;
  tone?: CelebrationTone;
  commercialIntent?: CommercialIntent;
  countryCode?: string;
  heritageTradition?: string;
}

// -------------------------------------------------------------
// Friends (Follow = one-way, Friend = mutual)
// -------------------------------------------------------------
export type FriendshipStatus = 'NONE' | 'REQUEST_SENT' | 'REQUEST_RECEIVED' | 'FRIENDS';

// -------------------------------------------------------------
// Surprise Package Domain Models & Compilation Types
// -------------------------------------------------------------
export type SurprisePackageStatus = 'PLANNING' | 'LOCKED' | 'DELIVERED';
export type SurpriseVisibility = 'PRIVATE' | 'PUBLIC';

export type ContributionType = 
  | 'VIDEO'           // 15-60s video tribute/wish
  | 'PHOTO'           // Throwback photo or celebration visual
  | 'VOICE_NOTE'      // Spoken heartfelt voice note
  | 'LETTER'          // Written letter or digital card message
  | 'MONEY'           // Cash contribution to pooled fund
  | 'PHYSICAL_GIFT'   // Physical item (e.g. perfume, watch, flowers, custom cake)
  | 'DIGITAL_GIFT'    // Digital item (e.g. playlist, artwork, voucher, subscription)
  | 'SERVICE';        // Service contribution (e.g. "I'll bake cake", "I will DJ", "Airport pickup")

export interface SurpriseContribution {
  id: string;
  packageId: string;
  contributorId: string;
  contributorName: string;
  contributorAvatar: string;
  type: ContributionType;
  // Media / Tribute attributes
  mediaUrl?: string;
  thumbnailUrl?: string;
  messageText?: string;
  durationSeconds?: number;
  // Gift & Service attributes
  giftTitle?: string;            // e.g. "Vintage Leather Watch" or "Doorstep Acoustic Serenade"
  giftDescription?: string;
  estimatedValue?: number;
  amountContributed?: number;    // for MONEY pool
  currency?: string;
  deliveryMethod?: 'IN_PERSON' | 'COURIER' | 'DIGITAL_TRANSFER' | 'PERFORMED_ON_DAY';
  // Compilation Reel Indexing Flag (set by Coordinator)
  isFlaggedForCompilation: boolean;
  compilationOrder?: number;     // 1, 2, 3...
  compilationCaption?: string;
  submittedAt: string;
}

export interface SurpriseDiscussionMessage {
  id: string;
  packageId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VOICE';
  reactions?: Record<string, number>;
  createdAt: string;
}

export interface SurpriseCompilationItem {
  contributionId: string;
  mediaUrl: string;
  type: 'VIDEO' | 'PHOTO' | 'LETTER' | 'VOICE_NOTE';
  senderName: string;
  caption?: string;
  durationSeconds: number;
  order: number;
}

export interface SurpriseCompilationReel {
  id: string;
  packageId: string;
  title: string;
  totalDurationSeconds: number;
  soundtrackTitle?: string;
  soundtrackUrl?: string;
  compiledItems: SurpriseCompilationItem[];
  isReady: boolean;
  compiledAt?: string;
}

export interface SurprisePackage {
  id: string;
  title: string;
  celebrantId: string;
  celebrantName: string;
  celebrantAvatar: string;
  celebrantBirthDate: string;
  celebrantRelationship?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  status: SurprisePackageStatus;
  visibility: SurpriseVisibility;    // PRIVATE (circle only) or PUBLIC (open community milestone)
  targetDeliveryDate: string;        // ISO timestamp of celebration unlock
  deliveredAt?: string;
  invitedCircleIds: string[];
  contributions: SurpriseContribution[];
  discussionMessages: SurpriseDiscussionMessage[];
  compilationReel?: SurpriseCompilationReel;
  // Dynamic Pooled Goals & Registries
  hasPooledGoal: boolean;
  pooledGoalAmount?: number;
  currentPooledAmount: number;
  currency: string;
  linkedVendorServices?: {
    serviceId: string;
    vendorName: string;
    title: string;
    cost: number;
    status: 'PROPOSED' | 'CONFIRMED' | 'DELIVERED';
  }[];
  // Post-delivery Recipient Response
  recipientReaction?: {
    unboxedAt: string;
    thankYouText?: string;
    thankYouMediaUrl?: string;
    reactionEmoji: string;
  };
  createdAt: string;
  updatedAt: string;
}
