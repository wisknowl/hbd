import type { SurprisePackage } from '../../shared/types';

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
