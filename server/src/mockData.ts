import type { ReelPost, Celebration, CelebrationPackage, ReminderItem, SurprisePackage } from '../../shared/types.js';

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
  },
  {
    id: 'rem-faith-1',
    title: 'Eid al-Fitr (Festival of Breaking Fast)',
    category: 'FAITH',
    eventDate: '2026-03-20',
    daysRemaining: 159,
    celebrant: 'Global Ummah & Community',
    icon: '🌙',
    hasCelebrationPlanned: true
  },
  {
    id: 'rem-faith-2',
    title: 'Easter Sunday & Resurrection Feast',
    category: 'FAITH',
    eventDate: '2026-04-05',
    daysRemaining: 175,
    celebrant: 'Christian Heritage Community',
    icon: '✝️',
    hasCelebrationPlanned: true
  },
  {
    id: 'rem-tribute-1',
    title: 'Chadwick Boseman Legacy Day',
    category: 'TRIBUTE',
    eventDate: '2026-08-28',
    daysRemaining: 320,
    celebrant: 'Chadwick Boseman (In Memoriam)',
    icon: '🕯️',
    hasCelebrationPlanned: false
  },
  {
    id: 'rem-tribute-2',
    title: 'Steve Jobs — Celebration of Vision & Life',
    category: 'TRIBUTE',
    eventDate: '2026-10-05',
    daysRemaining: 358,
    celebrant: 'Steve Jobs (Legacy)',
    icon: '🕯️',
    hasCelebrationPlanned: false
  }
];

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
    title: 'Sarah’s 30th Creative Journey Surprise',
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

