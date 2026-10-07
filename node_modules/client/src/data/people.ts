import type { HBDProfile, FriendshipStatus } from '../../../shared/types';

/**
 * Mock HBD users for the Friends system.
 * Today in the demo is Oct 7 — several birthdays are deliberately close
 * so the "upcoming birthdays → send a gift" flow can be exercised.
 */
export const mockPeople: HBDProfile[] = [
  {
    id: 'u-sarah',
    handle: 'sarah.j',
    fullName: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 24,
    birthMonth: 10,
    birthYear: 1995,
    bio: 'Product designer · coffee snob · always reading two books at once.',
    preferences: {
      interests: ['Perfume', 'Jewelry', 'Books', 'Coffee'],
      giftWishes: ['Personalised gold pendant', 'Jo Malone candle', 'Afternoon tea voucher'],
      avoid: ['Lilies (allergic)'],
      favoriteColor: '#FF6B6B',
      clothingSize: 'S',
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-david',
    handle: 'davidk',
    fullName: 'David Kouam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    city: 'Toronto',
    country: 'Canada',
    birthDay: 4,
    birthMonth: 12,
    birthYear: 1999,
    bio: 'Software engineer. Gym at 6am, PlayStation at 10pm.',
    preferences: {
      interests: ['Gaming', 'Tech', 'Sneakers', 'Fitness'],
      giftWishes: ['PlayStation Store credit', 'Noise-cancelling earbuds', 'Streetwear hoodie'],
      avoid: ['Alcohol'],
      favoriteColor: '#1A8F6B',
      clothingSize: 'L',
      shoeSize: '44',
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: true, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-aisha',
    handle: 'aisha_tech',
    fullName: 'Aisha Bello',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    city: 'Lagos',
    country: 'Nigeria',
    birthDay: 2,
    birthMonth: 11,
    isVerified: true,
    bio: 'Founder @PaySeed. Celebrating every beginning.',
    preferences: {
      interests: ['Startups', 'Books', 'Gadgets', 'African literature'],
      giftWishes: ['Kindle Paperwhite', 'Leather notebook', 'Gourmet chocolate'],
      avoid: [],
      favoriteColor: '#F4B942',
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-kwame',
    handle: 'kwame.m',
    fullName: 'Kwame Mensah',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    city: 'Accra',
    country: 'Ghana',
    birthDay: 9,
    birthMonth: 10,
    birthYear: 1993,
    bio: 'Architect. Highlife music. Jollof debates — Ghana wins.',
    preferences: {
      interests: ['Music', 'Architecture', 'Football', 'Cooking'],
      giftWishes: ['Vinyl records', 'Bluetooth speaker', 'Chelsea jersey'],
      avoid: ['Nuts (allergic)'],
      favoriteColor: '#5B2A86',
      clothingSize: 'M',
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: true, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-fatou',
    handle: 'fatou.d',
    fullName: 'Fatou Diallo',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
    city: 'Dakar',
    country: 'Senegal',
    birthDay: 15,
    birthMonth: 1,
    bio: 'Nurse. Plant mum. Thiéboudienne evangelist.',
    preferences: {
      interests: ['Plants', 'Skincare', 'Fashion', 'Travel'],
      giftWishes: ['Shea skincare set', 'Monstera plant', 'Wax-print tote bag'],
      avoid: ['Strong perfume'],
      favoriteColor: '#1A8F6B',
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-yannick',
    handle: 'yannick.e',
    fullName: 'Yannick Ebode',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    city: 'Douala',
    country: 'Cameroon',
    birthDay: 12,
    birthMonth: 10,
    bio: 'Photographer in Bonapriso. I capture your best days.',
    preferences: {
      interests: ['Photography', 'Art', 'Football', 'Makossa'],
      giftWishes: ['Camera strap', 'Photo book', 'Concert tickets'],
      avoid: [],
      favoriteColor: '#F4B942',
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: false, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-lena',
    handle: 'lena.o',
    fullName: 'Lena Okafor',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    city: 'Berlin',
    country: 'Germany',
    birthDay: 30,
    birthMonth: 10,
    bio: 'Data scientist. Diaspora kid. Loves a surprise party.',
    preferences: {
      interests: ['Books', 'Board games', 'Baking', 'Tech'],
      giftWishes: ['Board game', 'Baking class', 'E-reader cover'],
      avoid: ['Alcohol'],
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
  },
  {
    id: 'u-maya',
    handle: 'maya.c',
    fullName: 'Maya Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    city: 'Vancouver',
    country: 'Canada',
    birthDay: 18,
    birthMonth: 11,
    bio: 'Keeps birthdays private but loves celebrating others.',
    preferences: {
      interests: ['Hiking', 'Tea', 'Ceramics'],
      giftWishes: ['Handmade mug', 'Tea sampler'],
      avoid: [],
    },
    privacy: { birthdayVisibility: 'ONLY_ME', showAge: false, preferencesVisibleToFriends: true },
  },
];

/** Viewer-relative mutual friend counts (would come from the API). */
export const mockMutualFriends: Record<string, number> = {
  'u-sarah': 6,
  'u-david': 4,
  'u-aisha': 9,
  'u-kwame': 3,
  'u-fatou': 2,
  'u-yannick': 5,
  'u-lena': 1,
  'u-maya': 0,
};

/** People from the new user's phone contacts who are already on HBD. */
export const contactMatchIds = ['u-sarah', 'u-david', 'u-aisha', 'u-yannick'];

/** Friendship state a brand-new account starts with: two incoming requests. */
export const initialFriendships: Record<string, FriendshipStatus> = {
  'u-kwame': 'REQUEST_RECEIVED',
  'u-fatou': 'REQUEST_RECEIVED',
};

export const INTEREST_OPTIONS = [
  'Books', 'Perfume', 'Fashion', 'Jewelry', 'Tech', 'Gaming', 'Music', 'Art',
  'Flowers', 'Chocolate', 'Cakes', 'Coffee', 'Tea', 'Skincare', 'Fitness',
  'Football', 'Travel', 'Cooking', 'Plants', 'Photography', 'Experiences', 'Gift cards',
];

export const AVOID_OPTIONS = [
  'Alcohol', 'Nuts', 'Gluten', 'Dairy', 'Flowers / pollen', 'Strong perfume', 'Pork', 'Clutter (prefer experiences)',
];

export const COLOR_OPTIONS = ['#5B2A86', '#FF6B6B', '#F4B942', '#1A8F6B', '#2563EB', '#EC4899', '#202124', '#F97316'];

export const people = mockPeople;
