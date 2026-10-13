import type { ReelPost, CelebrationPackage, ReminderItem, SurprisePackage } from '../../shared/types';

export const mockPackages: CelebrationPackage[] = [
  {
    tier: 'MINI',
    title: 'HBD Mini',
    tagline: 'For simple moments that still deserve love.',
    priceLabel: 'From $45',
    items: [
      'Digital animation card & memory link',
      'Curated artisan cupcakes or treats',
      'Handwritten message & gift token',
      'Same-day local coordination & delivery'
    ]
  },
  {
    tier: 'CLASSIC',
    title: 'HBD Classic',
    tagline: 'Complete personal celebration with every detail handled.',
    priceLabel: 'From $150',
    badge: 'Most Loved',
    isFeatured: true,
    items: [
      'Custom designer cake & fresh floral bouquet',
      'Signature HBD gift box & celebratory balloons',
      'Personalized video message compilation',
      'On-site photo capture of the surprise',
      'Handled by an HBD Celebration Specialist'
    ]
  },
  {
    tier: 'PREMIUM',
    title: 'HBD Premium',
    tagline: 'For major milestones and extraordinary chapters.',
    priceLabel: 'From $490',
    badge: 'Extraordinary',
    items: [
      'Luxury celebration gift and custom memento',
      'Full thematic event setup & atmospheric decor',
      'Professional videography & highlight reel',
      'Live acoustic or musical surprise coordination',
      'HBD Memory Vault permanent digital archive'
    ]
  },
  {
    tier: 'SIGNATURE',
    title: 'HBD Signature',
    tagline: 'VIP bespoke celebration orchestrated end-to-end.',
    priceLabel: 'Custom Quote',
    badge: 'VIP Bespoke',
    items: [
      'Private venue curation, booking & styling',
      'Gourmet catering, private chef & mixologist',
      'Full production team (audio, lights, media)',
      'Global guest RSVP & digital tribute portal',
      'Executive celebration director on-site'
    ]
  },
  {
    tier: 'GLOBAL',
    title: 'HBD Global',
    tagline: 'Cross-border celebration orchestrator across continents.',
    priceLabel: 'Global Rates',
    badge: 'Cross-Border',
    items: [
      'Celebrate from UK/US/Diaspora directly to Africa/Worldwide',
      'Local premium bakeries, florists & artists in destination city',
      'Live streamed unboxing and surprise delivery reaction',
      'Multi-currency checkout (Card, Mobile Money, Wire)',
      'Dedicated international celebration concierge'
    ]
  }
];

export const mockReels: ReelPost[] = [
  {
    id: 'reel-1',
    category: 'BIRTHDAY',
    celebrationBadge: '🌍 Global Surprise · London → Douala',
    user: {
      id: 'u-1',
      handle: 'samuel_nd',
      fullName: 'Samuel Ndamukong',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'London, UK',
      followersCount: 1420,
      celebrationsCount: 8
    },
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Mum turns 60 today! Living in London made it hard to be there, but @hbdfoundation coordinated the cake, live acoustic choir and flowers right at her doorstep in Bonapriso! Her smile is everything. ❤️✨',
    audioTrack: 'Original Audio · Joyful African Horns & Strings',
    cheerCount: 3840,
    commentCount: 248,
    shareCount: 112,
    createdAt: '2 hours ago'
  },
  {
    id: 'reel-2',
    category: 'BEGINNING',
    celebrationBadge: '🚀 The Birth of a Startup',
    user: {
      id: 'u-2',
      handle: 'aisha_tech',
      fullName: 'Aisha Bello',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      location: 'Lagos, Nigeria',
      followersCount: 4200,
      celebrationsCount: 12
    },
    mediaUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Today we officially launched "PaySeed"! After 14 months of late nights, rejections and rewriting the core code, our first live transaction went through at 9:14 AM. Birthdays aren’t just for humans — celebrate every beginning! 🚀🌱',
    audioTrack: 'Triumphant Piano & Synths · HBD Launchpad',
    cheerCount: 5120,
    commentCount: 412,
    shareCount: 389,
    createdAt: '5 hours ago'
  },
  {
    id: 'reel-3',
    category: 'COMMUNITY',
    celebrationBadge: '❤️ Everyone Deserves To Be Celebrated',
    user: {
      id: 'u-3',
      handle: 'hbd_foundation',
      fullName: 'HBD Foundation Official',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      location: 'Global',
      isVerified: true,
      followersCount: 88400,
      celebrationsCount: 1540
    },
    mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Mme. Helene spent 41 years teaching 1st grade in public school. Today was her final lesson before retirement. 250 of her past students gathered in secret to give her the grandest standing ovation in school history. Recognition is a form of love.',
    audioTrack: 'Tears of Joy · HBD Signature Orchestra',
    cheerCount: 19420,
    commentCount: 1840,
    shareCount: 3100,
    createdAt: '1 day ago'
  },
  {
    id: 'reel-4',
    category: 'MILESTONE',
    celebrationBadge: '🏆 10,000 Milestone',
    user: {
      id: 'u-4',
      handle: 'david_k',
      fullName: 'David Kouam',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      location: 'Yaoundé, Cameroon',
      followersCount: 2300,
      celebrationsCount: 5
    },
    mediaUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Our community clinic just delivered its 10,000th healthy baby! Here is the team cutting our milestone cake with Mama Chantal and little baby Noah. Every breath is a victory worth celebrating.',
    audioTrack: 'Celebration Beats · Afrobeats Joy',
    cheerCount: 8320,
    commentCount: 620,
    shareCount: 410,
    createdAt: '2 days ago'
  }
];

export const mockReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Mama’s 60th Birthday',
    category: 'BIRTHDAY',
    eventDate: '2026-10-19',
    daysRemaining: 12,
    celebrant: 'Mama Chantal',
    icon: '🎂',
    hasCelebrationPlanned: true
  },
  {
    id: 'rem-2',
    title: 'Company 10-Year Anniversary',
    category: 'ANNIVERSARY',
    eventDate: '2026-11-06',
    daysRemaining: 30,
    celebrant: 'Kaba Technologies',
    icon: '🏢',
    hasCelebrationPlanned: false
  },
  {
    id: 'rem-3',
    title: 'Amina & Tariq 20th Wedding Milestone',
    category: 'MILESTONE',
    eventDate: '2026-11-17',
    daysRemaining: 41,
    celebrant: 'Amina & Tariq',
    icon: '💍',
    hasCelebrationPlanned: false
  },
  {
    id: 'rem-4',
    title: 'Amina’s Master’s Degree Graduation',
    category: 'ACHIEVEMENT',
    eventDate: '2027-01-15',
    daysRemaining: 100,
    celebrant: 'Amina',
    icon: '🎓',
    hasCelebrationPlanned: false
  }
];

// ============================================================
// "My People" — Private Relationship Circle Mock Data
// ============================================================
import type { 
  PersonCircleMember, 
  HBDayEvent, 
  UniversalGiftItem, 
  CelebrationRoom, 
  HBDGivesCause 
} from '../../shared/types';

export const mockCircleMembers: PersonCircleMember[] = [
  {
    id: 'p-1',
    fullName: 'Mama Chantal',
    relationship: 'Mother',
    birthDate: '1966-10-19',
    location: 'Douala, Cameroon',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    favoriteColor: '#5B2A86', // Royal Purple
    interests: ['Fresh Lilies', 'Dark Chocolate', 'Gospel Music', 'Cooking'],
    giftPreferences: ['Artisan Fruit & Butter Cake', 'Silk Scarf', 'Handcrafted Floral Basket'],
    daysUntilCelebration: 12,
    notes: 'Prefers deliveries in the afternoon. Loves purple ribbons.'
  },
  {
    id: 'p-2',
    fullName: 'Sarah Johnson',
    relationship: 'Sister',
    birthDate: '1995-10-24',
    location: 'London, UK',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    favoriteColor: '#FF6B6B', // Coral
    interests: ['French Perfumes', 'Minimalist Jewelry', 'Fiction Books', 'Specialty Coffee'],
    giftPreferences: ['Jo Malone Candle Set', 'Personalized Gold Pendant', 'London High Tea Voucher'],
    daysUntilCelebration: 17,
    notes: 'Lives in Shoreditch, loves surprise flower drop-offs!'
  },
  {
    id: 'p-3',
    fullName: 'David Kouam',
    relationship: 'Brother',
    birthDate: '1999-12-04',
    location: 'Toronto, Canada',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    favoriteColor: '#1A6B54', // Forest Green
    interests: ['PlayStation Gaming', 'Tech Hardware', 'Sneakers', 'Gym & Fitness'],
    giftPreferences: ['PlayStation Store Gift Card', 'Noise-Cancelling Earbuds', 'Streetwear Hoodie'],
    daysUntilCelebration: 58,
    notes: 'Working in tech, always busy on weekdays.'
  },
  {
    id: 'p-4',
    fullName: 'Aisha Bello',
    relationship: 'Colleague',
    birthDate: '1992-11-02',
    location: 'Lagos, Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    favoriteColor: '#F4B942', // Warm Gold
    interests: ['Fintech & Startups', 'Smart Home Gadgets', 'African Literature'],
    giftPreferences: ['Kindle Paperwhite', 'Executive Leather Notebook', 'Gourmet Chocolate Box'],
    daysUntilCelebration: 26,
    notes: 'CEO of PaySeed. Loves thoughtful milestones recognition.'
  }
];

// ============================================================
// HBDays — Global Calendar of Joy Mock Data
// ============================================================
export const mockHBDays: HBDayEvent[] = [
  {
    id: 'hbd-today-1',
    title: "Mama Chantal's 60th Birthday Countdown",
    subtitle: "Turning 60 in 12 days · Douala, Cameroon",
    type: 'PERSONAL',
    date: '2026-10-19',
    location: 'Douala, Cameroon',
    icon: '🎂',
    featuredImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    toastCount: 248,
    participantCount: 14,
    actionCta: 'Plan Surprise with HBD'
  },
  {
    id: 'hbd-today-2',
    title: 'World Smile & Joy Observance',
    subtitle: 'Over 140,000 toasts raised across 84 countries today',
    type: 'GLOBAL',
    date: 'Today · Oct 7',
    icon: '🌍',
    featuredImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
    toastCount: 14280,
    participantCount: 52000,
    actionCta: 'Raise a Global Toast'
  },
  {
    id: 'hbd-today-3',
    title: 'PaySeed Reaches 10,000 African SME Milestones',
    subtitle: 'From a dorm room idea in Lagos to economic engine',
    type: 'MILESTONE',
    date: 'Today · Oct 7',
    location: 'Lagos, Nigeria',
    icon: '🏆',
    featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
    toastCount: 890,
    participantCount: 310,
    actionCta: 'Send Founder Congratulations'
  },
  {
    id: 'hbd-today-4',
    title: 'Launch of "Aura Clean Energy" Microgrid',
    subtitle: 'Bringing reliable clean power to 12 rural health centers',
    type: 'BEGINNING',
    date: 'Today · Oct 7',
    location: 'Nairobi, Kenya',
    icon: '🚀',
    featuredImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80',
    toastCount: 612,
    participantCount: 180,
    actionCta: 'Cheer Beginning'
  },
  {
    id: 'hbd-today-5',
    title: 'Mme. Helene: 41 Years of Teaching Triumph',
    subtitle: 'Celebrating 41 classes of public school children transformed',
    type: 'COMMUNITY',
    date: 'Today · Oct 7',
    location: 'Yaoundé, Cameroon',
    icon: '❤️',
    featuredImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    toastCount: 3410,
    participantCount: 420,
    actionCta: 'Sign Community Tribute'
  }
];

// ============================================================
// Universal Gift Engine — Connected Commerce Mock Items
// ============================================================
export const mockUniversalGifts: UniversalGiftItem[] = [
  {
    id: 'gift-1',
    title: 'Artisan Vanilla Bean & Fresh Berry Cake',
    description: 'Triple-layered, moist sponge topped with fresh raspberries, gold leaf and custom inscription.',
    category: 'FLOWERS_CAKE',
    price: 45,
    currency: 'USD',
    providerName: 'Douala Pâtisserie & Bakeries Network',
    providerType: 'bakery',
    locationScope: 'Douala, Cameroon',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewsCount: 142,
    estimatedDeliveryDays: 0, // Same-day local
    isCrossBorderReady: true
  },
  {
    id: 'gift-2',
    title: 'Luxury Imperial Rose & Lily Bouquet',
    description: 'Freshly cut long-stem equatorial roses and oriental lilies tied with signature satin ribbon.',
    category: 'FLOWERS_CAKE',
    price: 38,
    currency: 'USD',
    providerName: 'AfriFlora & Local Florists Alliance',
    providerType: 'florist',
    locationScope: 'Douala, Cameroon',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    reviewsCount: 98,
    estimatedDeliveryDays: 0,
    isCrossBorderReady: true
  },
  {
    id: 'gift-3',
    title: 'English Pear & Freesia Cologne (50ml)',
    description: 'Sensuous freshness of just-ripe pears wrapped in a bouquet of white freesias.',
    category: 'FASHION',
    price: 75,
    currency: 'USD',
    providerName: 'Amazon UK Prime Connect',
    providerType: 'amazon',
    locationScope: 'London, UK',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewsCount: 840,
    estimatedDeliveryDays: 1,
    isCrossBorderReady: false
  },
  {
    id: 'gift-4',
    title: 'Handcrafted Personalized Name Pendant in 18k Vermeil',
    description: 'Custom Arabic, French, or English script cut in heavy recycled vermeil gold.',
    category: 'PERSONALIZED',
    price: 68,
    currency: 'USD',
    providerName: 'Etsy Global Artisan Network',
    providerType: 'shopify',
    locationScope: 'London, UK / Worldwide',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
    rating: 4.95,
    reviewsCount: 312,
    estimatedDeliveryDays: 3,
    isCrossBorderReady: true
  },
  {
    id: 'gift-5',
    title: 'Sky Garden High Tea for Two — London Landmark',
    description: 'Panoramic views across the Thames with artisan pastries, scones, and champagne.',
    category: 'EXPERIENCE',
    price: 90,
    currency: 'USD',
    providerName: 'Virgin Experience Days API',
    providerType: 'experience',
    locationScope: 'London, UK',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    reviewsCount: 520,
    estimatedDeliveryDays: 0, // Instant digital voucher
    isCrossBorderReady: true
  },
  {
    id: 'gift-6',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation, crystal clear hands-free calls, 30hr battery.',
    category: 'TECH',
    price: 320,
    currency: 'USD',
    providerName: 'BestBuy / Amazon North America',
    providerType: 'amazon',
    locationScope: 'Toronto, Canada',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    rating: 4.85,
    reviewsCount: 1420,
    estimatedDeliveryDays: 1,
    isCrossBorderReady: false
  },
  {
    id: 'gift-7',
    title: '$50 Universal Digital Gift Card (Multi-Store)',
    description: 'Instantly delivered via WhatsApp/Email. Redeemable across Amazon, Uber Eats, Netflix, Spotify.',
    category: 'DIGITAL',
    price: 50,
    currency: 'USD',
    providerName: 'HBD Universal Card Hub',
    providerType: 'gift_card',
    locationScope: 'Global / Multi-Currency',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=500&q=80',
    rating: 5.0,
    reviewsCount: 2300,
    estimatedDeliveryDays: 0,
    isCrossBorderReady: true
  }
];

// ============================================================
// HBD Collective & Celebration Rooms Mock Data
// ============================================================
export const mockCelebrationRooms: CelebrationRoom[] = [
  {
    id: 'room-1',
    celebrantName: 'Grandma Sophie',
    title: "Grandma Sophie's 80th Milestone Jubilation",
    occasion: '80th Birthday Celebration',
    eventDate: '2026-10-22',
    status: 'UPCOMING',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    guestCount: 38,
    potGoal: 1000,
    potRaised: 840,
    potCurrency: 'USD',
    organizerName: 'Claire & Samuel',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Montreal & Yaoundé (Hybrid)',
    tributesCount: 24,
    memoryVaultUnlocked: true
  },
  {
    id: 'room-2',
    celebrantName: 'PaySeed Fintech Team',
    title: 'PaySeed 1-Year Anniversary & Series A Celebration',
    occasion: 'Company Founding & Traction Milestone',
    eventDate: 'Today · Oct 7',
    status: 'LIVE_NOW',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    guestCount: 142,
    potGoal: 5000,
    potRaised: 4200,
    potCurrency: 'USD',
    organizerName: 'Aisha Bello (Founder)',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    location: 'Lagos, Nigeria & Global Remote',
    tributesCount: 68,
    memoryVaultUnlocked: true
  },
  {
    id: 'room-3',
    celebrantName: 'The Oct 7 Borns',
    title: 'Global October 7 Birthday Collective',
    occasion: 'Shared Birthday Room for People Born Today',
    eventDate: 'Today · Oct 7',
    status: 'LIVE_NOW',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    guestCount: 1820,
    potGoal: 2500,
    potRaised: 2500,
    potCurrency: 'USD',
    organizerName: 'HBD Global Community',
    organizerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    location: 'Worldwide Virtual Lounge',
    tributesCount: 450,
    memoryVaultUnlocked: true
  }
];

// ============================================================
// HBD Gives (Celebration Philanthropy) Mock Data
// ============================================================
export const mockHBDGivesCauses: HBDGivesCause[] = [
  {
    id: 'cause-1',
    title: 'Birthday Meals & Celebration for 200 Children',
    beneficiary: 'Hope Haven Children’s Home, Bonabéri',
    goalAmount: 800,
    raisedAmount: 640,
    currency: 'USD',
    mealsOrGiftsProvided: 160,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80',
    description: 'Ensure every child without family receives a memorable birthday feast, singing celebration, and school backpack.'
  },
  {
    id: 'cause-2',
    title: 'Sponsor Birthday Cakes for Sick Children in Pediatrics',
    beneficiary: 'General Hospital Pediatric Ward',
    goalAmount: 500,
    raisedAmount: 375,
    currency: 'USD',
    mealsOrGiftsProvided: 25,
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500&q=80',
    description: 'Surprise courageous young hospital fighters with personalized allergen-free birthday cakes and clown visits on their birthdays.'
  }
];

// ============================================================
// Surprise Packages Mock Data
// ============================================================
export const mockSurprisePackages: SurprisePackage[] = [
  {
    id: 'sp-chantal-60',
    title: 'Mama Chantal’s 60th Jubilee Surprise Package',
    celebrantId: 'u-chantal',
    celebrantName: 'Mama Chantal',
    celebrantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    celebrantBirthDate: '2026-10-19',
    celebrantRelationship: 'Mother',
    organizerId: 'u-1',
    organizerName: 'Samuel Ndamukong',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'PLANNING',
    visibility: 'PRIVATE',
    targetDeliveryDate: '2026-10-19T08:00:00Z',
    invitedCircleIds: ['u-1', 'u-sarah', 'u-franck', 'u-amina', 'u-tariq'],
    hasPooledGoal: true,
    pooledGoalAmount: 350,
    currentPooledAmount: 215,
    currency: 'USD',
    contributions: [
      {
        id: 'c-1',
        packageId: 'sp-chantal-60',
        contributorId: 'u-1',
        contributorName: 'Samuel Ndamukong',
        contributorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        type: 'VIDEO',
        mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-his-hand-in-a-video-call-42861-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        messageText: 'Mum, you gave us everything. Happy 60th birthday from London! Love you with all my heart.',
        durationSeconds: 28,
        isFlaggedForCompilation: true,
        compilationOrder: 1,
        compilationCaption: 'A son’s tribute from across the ocean ❤️',
        submittedAt: '2026-10-09T14:20:00Z'
      },
      {
        id: 'c-2',
        packageId: 'sp-chantal-60',
        contributorId: 'u-sarah',
        contributorName: 'Sarah Johnson',
        contributorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        type: 'PHYSICAL_GIFT',
        giftTitle: 'Vintage Gold Brooch & Silk Scarf',
        giftDescription: 'Hand-crafted artisan silk scarf brought from Paris for her church outfits.',
        estimatedValue: 75,
        deliveryMethod: 'COURIER',
        isFlaggedForCompilation: true,
        compilationOrder: 2,
        compilationCaption: 'Sarah’s Silk Scarf & Blessing ✨',
        submittedAt: '2026-10-09T16:45:00Z'
      },
      {
        id: 'c-3',
        packageId: 'sp-chantal-60',
        contributorId: 'u-franck',
        contributorName: 'Franck Kaba',
        contributorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        type: 'SERVICE',
        giftTitle: 'Doorstep Acoustic Choir Coordination',
        giftDescription: 'I will pick up the youth choir in Douala and arrive at her house at 7:45 AM with live acoustic guitars.',
        estimatedValue: 120,
        deliveryMethod: 'PERFORMED_ON_DAY',
        isFlaggedForCompilation: false,
        submittedAt: '2026-10-09T18:10:00Z'
      },
      {
        id: 'c-4',
        packageId: 'sp-chantal-60',
        contributorId: 'u-amina',
        contributorName: 'Amina Bello',
        contributorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        type: 'MONEY',
        amountContributed: 100,
        currency: 'USD',
        messageText: 'Towards the master cake and floral arch! Much love Mama Chantal!',
        isFlaggedForCompilation: false,
        submittedAt: '2026-10-10T09:30:00Z'
      },
      {
        id: 'c-5',
        packageId: 'sp-chantal-60',
        contributorId: 'u-tariq',
        contributorName: 'Tariq Al-Mansoor',
        contributorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        type: 'LETTER',
        messageText: 'To Mama Chantal: Your hospitality when we visited Cameroon made us feel like family. Wishing you 60 more years of vibrant joy and blessings.',
        isFlaggedForCompilation: true,
        compilationOrder: 3,
        compilationCaption: 'A letter of deep gratitude from Tariq 💌',
        submittedAt: '2026-10-10T11:00:00Z'
      }
    ],
    discussionMessages: [
      {
        id: 'm-1',
        packageId: 'sp-chantal-60',
        senderId: 'u-1',
        senderName: 'Samuel Ndamukong',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'Hey everyone! Welcome to the secret planning room for Mum’s 60th. Remember she CANNOT see this room! What cake flavor do you think she’d prefer: Vanilla Bean or Passionfruit Coconut?',
        createdAt: '2026-10-09T12:00:00Z'
      },
      {
        id: 'm-2',
        packageId: 'sp-chantal-60',
        senderId: 'u-franck',
        senderName: 'Franck Kaba',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'Definitely Passionfruit Coconut! She loves tropical fruits. Also I arranged the live choir for 7:45 AM, they know her favorite hymn.',
        createdAt: '2026-10-09T12:25:00Z'
      },
      {
        id: 'm-3',
        packageId: 'sp-chantal-60',
        senderId: 'u-sarah',
        senderName: 'Sarah Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        text: 'That will be so emotional! I just contributed the silk scarf, and Samuel I love that you flagged the video wish for the compilation reel.',
        createdAt: '2026-10-09T17:00:00Z'
      }
    ],
    compilationReel: {
      id: 'cr-1',
      packageId: 'sp-chantal-60',
      title: 'Mama Chantal: 60 Years of Grace & Light',
      totalDurationSeconds: 78,
      soundtrackTitle: 'Acoustic Joy Strings & Chimes',
      compiledItems: [
        {
          contributionId: 'c-1',
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-his-hand-in-a-video-call-42861-large.mp4',
          type: 'VIDEO',
          senderName: 'Samuel Ndamukong',
          caption: 'A son’s tribute from across the ocean ❤️',
          durationSeconds: 28,
          order: 1
        },
        {
          contributionId: 'c-2',
          mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          type: 'PHOTO',
          senderName: 'Sarah Johnson',
          caption: 'Sarah’s Silk Scarf & Blessing ✨',
          durationSeconds: 15,
          order: 2
        },
        {
          contributionId: 'c-5',
          mediaUrl: '',
          type: 'LETTER',
          senderName: 'Tariq Al-Mansoor',
          caption: 'A letter of deep gratitude from Tariq 💌',
          durationSeconds: 20,
          order: 3
        }
      ],
      isReady: true,
      compiledAt: '2026-10-10T12:00:00Z'
    },
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'sp-sarah-30',
    title: 'Sarah’s 30th Creative Journey Surprise Package',
    celebrantId: 'u-sarah',
    celebrantName: 'Sarah Johnson',
    celebrantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    celebrantBirthDate: '2026-10-24',
    celebrantRelationship: 'Friend',
    organizerId: 'u-1',
    organizerName: 'Samuel Ndamukong',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'PLANNING',
    visibility: 'PRIVATE',
    targetDeliveryDate: '2026-10-24T00:00:00Z',
    invitedCircleIds: ['u-1', 'u-franck', 'u-amina'],
    hasPooledGoal: false,
    currentPooledAmount: 0,
    currency: 'GBP',
    contributions: [],
    discussionMessages: [
      {
        id: 'm-s1',
        packageId: 'sp-sarah-30',
        senderId: 'u-1',
        senderName: 'Samuel Ndamukong',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'Sarah is turning 30! Let’s assemble a compilation reel of our design sprints and drop in gift ideas.',
        createdAt: '2026-10-10T08:00:00Z'
      }
    ],
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z'
  }
];
