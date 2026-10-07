import { ReelPost, Celebration, CelebrationPackage, ReminderItem } from '../../shared/types.js';

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
    celebrationBadge: '🏆 100,000 Milestone',
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
