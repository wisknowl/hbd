import express from 'express';
import cors from 'cors';
import { mockPackages, mockReels, mockReminders, mockSurprisePackages } from './mockData.js';
import type { 
  CelebrationBookingRequest, 
  ReminderItem, 
  SurprisePackage, 
  SurpriseContribution, 
  SurpriseDiscussionMessage 
} from '../../shared/types.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory state for development API (mirrors PostgreSQL schema)
let reels = [...mockReels];
let reminders: ReminderItem[] = [...mockReminders];
const bookings: CelebrationBookingRequest[] = [];
let surprisePackages: SurprisePackage[] = [...mockSurprisePackages];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'HBD Foundation — Celebrate What Matters',
    service: 'Global Celebration API',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// User & Auth In-Memory Store (Mirrors PostgreSQL User table)
// -------------------------------------------------------------
interface ServerUser {
  id: string;
  handle: string;
  fullName: string;
  email?: string;
  avatarUrl: string;
  city: string;
  country: string;
  birthDay: number;
  birthMonth: number;
  birthYear?: number;
  bio: string;
  isVerified: boolean;
  token: string;
  preferences?: {
    interests?: string[];
    giftWishes?: string[];
    avoid?: string[];
    favoriteColor?: string;
    idols?: string[];
    musicGenres?: string[];
    animalTypes?: string[];
    hobbies?: string[];
    personalGoals?: string[];
    traditions?: string[];
    showTributes?: boolean;
  };
  privacy?: {
    birthdayVisibility?: string;
    showAge?: boolean;
    preferencesVisibleToFriends?: boolean;
  };
  traditions?: string[];
  showTributes?: boolean;
  createdAt: string;
}

const initialUsers: ServerUser[] = [
  {
    id: 'u-1',
    handle: 'samuel_nd',
    fullName: 'Samuel Ndamukong',
    email: 'samuel@hbd.foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 24,
    birthMonth: 10,
    birthYear: 1995,
    bio: 'Product architect & celebration enthusiast. Always down for good coffee & heartfelt surprises ✨',
    isVerified: true,
    token: 'hbd_token_samuel_nd',
    preferences: {
      interests: ['Acoustic Music', 'Gourmet Treats', 'Tech'],
      giftWishes: ['Audio equipment', 'Bespoke cakes'],
      avoid: ['Lilies (allergic)'],
      favoriteColor: '#5B2A86',
      idols: ['Steve Jobs', 'Nelson Mandela'],
      musicGenres: ['Afrobeats', 'Jazz'],
      animalTypes: ['Dogs'],
      hobbies: ['Tech & Coding', 'Photography'],
      personalGoals: ['Scale HBD Globally'],
      traditions: ['Universal Secular', 'Christian Heritage', 'Pan-African & Diaspora'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
    traditions: ['Universal Secular', 'Christian Heritage', 'Pan-African & Diaspora'],
    showTributes: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'u-2',
    handle: 'aisha_tech',
    fullName: 'Aisha Bello',
    email: 'aisha@payseed.africa',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
    birthDay: 14,
    birthMonth: 5,
    birthYear: 1997,
    bio: 'Founder at PaySeed. Celebrating ventures, milestones, and brilliant minds across Africa 🚀',
    isVerified: true,
    token: 'hbd_token_aisha_tech',
    preferences: {
      interests: ['Smart Ring', 'Artisan Dark Chocolate', 'Mechanical Keyboard'],
      avoid: ['Peanuts (severe allergy)'],
      favoriteColor: '#10B981',
      idols: ['Wangari Maathai', 'Ada Lovelace'],
      musicGenres: ['Afrobeats', 'Soul'],
      animalTypes: ['Cats'],
      hobbies: ['Reading', 'Travel'],
      personalGoals: ['PaySeed Series A', 'Mentor 50 Female Founders'],
      traditions: ['Islamic Heritage', 'Pan-African & Diaspora'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
    traditions: ['Islamic Heritage', 'Pan-African & Diaspora'],
    showTributes: true,
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 'u-3',
    handle: 'amina_tariq',
    fullName: 'Amina & Tariq',
    email: 'amina.tariq@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'Toronto',
    country: 'Canada',
    birthDay: 18,
    birthMonth: 12,
    birthYear: 1990,
    bio: 'Two decades of journeys, family love, and celebrating every anniversary together 🥂',
    isVerified: true,
    token: 'hbd_token_amina_tariq',
    preferences: {
      interests: ['Vintage Red Wine', 'Scented Candle Set', 'Weekend Cabin Retreat'],
      avoid: ['Synthetic Perfumes', 'Seafood'],
      favoriteColor: '#E11D48',
      idols: ['Miles Davis', 'Maya Angelou'],
      musicGenres: ['Classical', 'Jazz'],
      animalTypes: ['Horses'],
      hobbies: ['Culinary & Baking', 'Gardening'],
      personalGoals: ['Silver Anniversary Journey'],
      traditions: ['Universal Secular', 'Islamic Heritage'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: false, preferencesVisibleToFriends: true },
    traditions: ['Universal Secular', 'Islamic Heritage'],
    showTributes: true,
    createdAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'u-sarah',
    handle: 'sarah.j',
    fullName: 'Sarah Johnson',
    email: 'sarah@designstudio.co.uk',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 24,
    birthMonth: 10,
    birthYear: 1995,
    bio: 'Product designer · coffee snob · always reading two books at once.',
    isVerified: true,
    token: 'hbd_token_sarah_j',
    preferences: {
      interests: ['Perfume', 'Jewelry', 'Books', 'Coffee'],
      giftWishes: ['Personalised gold pendant', 'Jo Malone candle'],
      avoid: ['Lilies (allergic)'],
      favoriteColor: '#FF6B6B',
      idols: ['Steve Jobs'],
      musicGenres: ['Indie', 'Jazz'],
      animalTypes: ['Dogs'],
      hobbies: ['Reading', 'Photography'],
      personalGoals: ['Lead Design System'],
      traditions: ['Universal Secular'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'EVERYONE', showAge: false, preferencesVisibleToFriends: true },
    traditions: ['Universal Secular'],
    showTributes: true,
    createdAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'u-david',
    handle: 'davidk',
    fullName: 'David Kouam',
    email: 'david@kouam.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    city: 'Toronto',
    country: 'Canada',
    birthDay: 4,
    birthMonth: 12,
    birthYear: 1999,
    bio: 'Software engineer. Gym at 6am, PlayStation at 10pm.',
    isVerified: true,
    token: 'hbd_token_davidk',
    preferences: {
      interests: ['Gaming', 'Tech', 'Sneakers', 'Fitness'],
      giftWishes: ['PlayStation Store credit', 'Noise-cancelling earbuds'],
      avoid: ['Alcohol'],
      favoriteColor: '#1A8F6B',
      idols: ['Nelson Mandela'],
      musicGenres: ['Afrobeats', 'Hip-Hop'],
      animalTypes: ['Dogs'],
      hobbies: ['Tech & Coding', 'Athletics & Running'],
      personalGoals: ['Launch OSS Library'],
      traditions: ['Universal Secular'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: true, preferencesVisibleToFriends: true },
    traditions: ['Universal Secular'],
    showTributes: true,
    createdAt: '2026-01-05T00:00:00Z'
  }
];

let users: ServerUser[] = [...initialUsers];

// Helper to authenticate request by Bearer token or query param
function authenticateRequest(req: express.Request): ServerUser | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }
  if (!token) return null;
  return users.find(u => u.token === token) || null;
}

// -------------------------------------------------------------
// Authentication Endpoints (Web Client & Mobile App)
// -------------------------------------------------------------

// Sign Up / Register
const handleRegister = (req: express.Request, res: express.Response) => {
  const {
    handle,
    fullName,
    email,
    city,
    country,
    birthDay,
    birthMonth,
    birthYear,
    bio,
    avatarUrl,
    preferences,
    privacy,
    traditions,
    showTributes
  } = req.body;

  if (!handle || !fullName) {
    return res.status(400).json({ success: false, error: 'Full name and handle are required.' });
  }

  const cleanHandle = handle.trim().toLowerCase().replace(/^@/, '');
  const existing = users.find(u => u.handle.toLowerCase() === cleanHandle);
  if (existing) {
    // Return existing user session for seamless development / idempotent onboarding
    return res.json({
      success: true,
      message: 'Account already exists. Logged in successfully.',
      token: existing.token,
      user: existing
    });
  }

  const newId = `u-${Date.now()}`;
  const newToken = `hbd_token_${cleanHandle}_${Date.now()}`;

  const newUser: ServerUser = {
    id: newId,
    handle: cleanHandle,
    fullName: fullName.trim(),
    email: email ? email.trim().toLowerCase() : `${cleanHandle}@hbd.me`,
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: city || 'London',
    country: country || 'United Kingdom',
    birthDay: Number(birthDay) || 24,
    birthMonth: Number(birthMonth) || 10,
    birthYear: birthYear ? Number(birthYear) : 1996,
    bio: bio || 'Celebration Passport Holder on HBD ✨',
    isVerified: true,
    token: newToken,
    preferences: preferences || {
      interests: ['Specialty Coffee', 'Books'],
      avoid: ['Lilies (allergic)'],
      favoriteColor: '#5B2A86',
      idols: ['Nelson Mandela'],
      musicGenres: ['Afrobeats'],
      animalTypes: ['Dogs'],
      hobbies: ['Tech & Coding'],
      personalGoals: ['Make Every Day Joyful'],
      traditions: traditions || ['Universal Secular'],
      showTributes: showTributes !== undefined ? showTributes : true
    },
    privacy: privacy || {
      birthdayVisibility: 'FRIENDS',
      showAge: false,
      preferencesVisibleToFriends: true
    },
    traditions: traditions || ['Universal Secular'],
    showTributes: showTributes !== undefined ? showTributes : true,
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);

  res.status(201).json({
    success: true,
    message: `Celebration Passport created for ${newUser.fullName}! 🎉`,
    token: newUser.token,
    user: newUser
  });
};

app.post('/api/auth/register', handleRegister);
app.post('/api/auth/signup', handleRegister);

// Sign In / Login
app.post('/api/auth/login', (req, res) => {
  const { identifier } = req.body;
  if (!identifier || typeof identifier !== 'string') {
    return res.status(400).json({ success: false, error: 'Identifier (handle, email, or full name) is required.' });
  }

  const clean = identifier.trim().toLowerCase().replace(/^@/, '');
  const matched = users.find(u => 
    u.handle.toLowerCase() === clean || 
    (u.email && u.email.toLowerCase() === clean) ||
    u.fullName.toLowerCase().includes(clean)
  );

  if (matched) {
    return res.json({
      success: true,
      message: `Welcome back, ${matched.fullName.split(' ')[0]}! 🎉`,
      token: matched.token,
      user: matched
    });
  }

  // Auto-generate session user if brand new handle provided in demo mode
  const newId = `u-${Date.now()}`;
  const newToken = `hbd_token_${clean}_${Date.now()}`;
  const autoUser: ServerUser = {
    id: newId,
    handle: clean,
    fullName: clean.charAt(0).toUpperCase() + clean.slice(1),
    email: `${clean}@hbd.me`,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 15,
    birthMonth: 10,
    birthYear: 1998,
    bio: 'Celebration Passport Holder on HBD ✨',
    isVerified: true,
    token: newToken,
    preferences: {
      interests: ['Coffee', 'Books'],
      avoid: ['Lilies (allergic)'],
      favoriteColor: '#5B2A86',
      idols: ['Nelson Mandela'],
      musicGenres: ['Afrobeats'],
      animalTypes: ['Dogs'],
      hobbies: ['Tech & Coding'],
      personalGoals: ['Make Every Day Joyful'],
      traditions: ['Universal Secular'],
      showTributes: true
    },
    privacy: { birthdayVisibility: 'FRIENDS', showAge: false, preferencesVisibleToFriends: true },
    traditions: ['Universal Secular'],
    showTributes: true,
    createdAt: new Date().toISOString()
  };

  users.unshift(autoUser);

  res.json({
    success: true,
    message: `Signed in as ${autoUser.fullName}! 🎉`,
    token: autoUser.token,
    user: autoUser
  });
});

// Current Authenticated User (Session Verification)
app.get('/api/auth/me', (req, res) => {
  const user = authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized: invalid or missing token.' });
  }
  res.json({ success: true, user });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Successfully logged out.' });
});

// Update Profile
app.put('/api/auth/profile', (req, res) => {
  const user = authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  const patch = req.body;
  if (patch.fullName) user.fullName = patch.fullName;
  if (patch.bio !== undefined) user.bio = patch.bio;
  if (patch.city) user.city = patch.city;
  if (patch.country) user.country = patch.country;
  if (patch.avatarUrl) user.avatarUrl = patch.avatarUrl;
  if (patch.preferences) user.preferences = { ...user.preferences, ...patch.preferences };
  if (patch.privacy) user.privacy = { ...user.privacy, ...patch.privacy };
  if (patch.traditions) user.traditions = patch.traditions;
  if (patch.showTributes !== undefined) user.showTributes = patch.showTributes;

  res.json({ success: true, message: 'Profile updated successfully.', user });
});

// User Directory (Search & Friends)
app.get('/api/auth/users', (req, res) => {
  const { query } = req.query;
  let list = users;
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    list = users.filter(u => u.handle.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q));
  }
  res.json({
    users: list.map(({ token, ...publicUser }) => publicUser),
    count: list.length
  });
});

// Universal Joy Engine Daily Toast Atomic Counter (Simulates Redis INCR celebration:toast:YYYY-MM-DD)
const dailyToastCounters: Record<string, number> = {
  '2026-10-12': 1428,
  '2026-10-13': 1894
};

app.get('/api/toast/today', (req, res) => {
  const dateKey = (req.query.date as string) || '2026-10-12';
  const count = dailyToastCounters[dateKey] || 1428;
  res.json({ date: dateKey, toastCount: count });
});

app.post('/api/toast/increment', (req, res) => {
  const dateKey = (req.body.date as string) || '2026-10-12';
  if (!dailyToastCounters[dateKey]) {
    dailyToastCounters[dateKey] = 1428;
  }
  dailyToastCounters[dateKey] += 1;
  res.json({
    success: true,
    date: dateKey,
    toastCount: dailyToastCounters[dateKey],
    message: 'Universal Joy Toast registered atomically (Redis key-value simulation)!'
  });
});

// TikTok-style Celebration Reel Feed
app.get('/api/feed', (req, res) => {
  const { category } = req.query;
  if (category && typeof category === 'string' && category !== 'ALL') {
    const filtered = reels.filter(r => r.category.toUpperCase() === category.toUpperCase());
    return res.json({ reels: filtered, count: filtered.length });
  }
  res.json({ reels, count: reels.length });
});

// Real-time Cheer / Confetti Reaction
app.post('/api/feed/:id/cheer', (req, res) => {
  const { id } = req.params;
  const reel = reels.find(r => r.id === id);
  if (!reel) {
    return res.status(404).json({ error: 'Reel not found' });
  }

  reel.cheerCount += 1;
  reel.isCheered = true;

  res.json({
    success: true,
    cheerCount: reel.cheerCount,
    sparkleEffect: true,
    message: 'Cheer and confetti sent!'
  });
});

// Celebration Packages
app.get('/api/packages', (req, res) => {
  res.json({ packages: mockPackages });
});

// Upcoming Reminders & Milestones
app.get('/api/reminders', (req, res) => {
  res.json({ reminders });
});

app.post('/api/reminders', (req, res) => {
  const { title, category, eventDate, celebrant } = req.body;
  if (!title || !eventDate || !celebrant) {
    return res.status(400).json({ error: 'Missing required reminder fields' });
  }

  const newReminder: ReminderItem = {
    id: `rem-${Date.now()}`,
    title,
    category: category || 'BIRTHDAY',
    eventDate,
    daysRemaining: Math.max(1, Math.ceil((new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    celebrant,
    icon: category === 'BEGINNING' ? '🚀' : category === 'MILESTONE' ? '🏆' : '🎂',
    hasCelebrationPlanned: false
  };

  reminders.unshift(newReminder);
  res.status(201).json({ success: true, reminder: newReminder });
});

// Celebration Planner & Booking Pipeline
app.post('/api/celebrations/plan', (req, res) => {
  const booking: CelebrationBookingRequest = {
    id: `hbd-req-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    ...req.body
  };

  bookings.push(booking);

  console.log(`[HBD Concierge] New celebration request received: ${booking.category} for ${booking.celebrantName} in ${booking.location}`);

  res.status(201).json({
    success: true,
    bookingId: booking.id,
    message: 'Your celebration request has been sent to our HBD Celebration Specialists. We will reach out within 2 hours.',
    details: booking
  });
});

// Brand Categories
app.get('/api/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'BIRTHDAY', label: 'People', icon: '🎂', description: 'Birthdays and lives worth honoring' },
      { id: 'BEGINNING', label: 'Beginnings', icon: '🚀', description: 'Startups, ideas, products and movements' },
      { id: 'MILESTONE', label: 'Milestones', icon: '🏆', description: 'Breakthroughs, graduations, 1M users' },
      { id: 'ANNIVERSARY', label: 'Anniversaries', icon: '📅', description: 'Years of existence, love and growth' },
      { id: 'COMMUNITY', label: 'Community', icon: '❤️', description: 'Teachers, leaders, unsung heroes' }
    ]
  });
});
// -------------------------------------------------------------
// Surprise Package API Endpoints (Stealth Security & Compilation)
// -------------------------------------------------------------

// List active surprise packages (enforces stealth security)
app.get('/api/surprise-packages', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';

  // Stealth Rule: The celebrant NEVER sees a package in 'PLANNING' or 'LOCKED'
  const accessible = surprisePackages.filter(pkg => {
    if (pkg.celebrantId === userId) {
      return pkg.status === 'DELIVERED';
    }
    if (pkg.organizerId === userId) return true;
    if (pkg.invitedCircleIds?.includes(userId)) return true;
    if (pkg.visibility === 'PUBLIC') return true;
    return false;
  });

  res.json({ surprisePackages: accessible, count: accessible.length });
});

// Get single package details
app.get('/api/surprise-packages/:id', (req, res) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'u-1';

  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) {
    return res.status(404).json({ error: 'Surprise Package not found' });
  }

  // Stealth check: return 404 to celebrant if not yet delivered
  if (pkg.celebrantId === userId && pkg.status !== 'DELIVERED') {
    return res.status(404).json({ error: 'Surprise Package not found' });
  }

  res.json({ surprisePackage: pkg });
});

// Create a new Surprise Package (from Dates / Circle)
app.post('/api/surprise-packages', (req, res) => {
  const {
    title,
    celebrantId,
    celebrantName,
    celebrantAvatar,
    celebrantBirthDate,
    celebrantRelationship,
    organizerId,
    organizerName,
    organizerAvatar,
    visibility,
    targetDeliveryDate,
    hasPooledGoal,
    pooledGoalAmount,
    currency
  } = req.body;

  if (!title || !celebrantName || !targetDeliveryDate) {
    return res.status(400).json({ error: 'Missing required Surprise Package fields' });
  }

  const newPackage: SurprisePackage = {
    id: `sp-${Date.now()}`,
    title,
    celebrantId: celebrantId || `u-target-${Date.now()}`,
    celebrantName,
    celebrantAvatar: celebrantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    celebrantBirthDate: celebrantBirthDate || targetDeliveryDate.split('T')[0],
    celebrantRelationship: celebrantRelationship || 'Friend',
    organizerId: organizerId || 'u-1',
    organizerName: organizerName || 'Samuel Ndamukong',
    organizerAvatar: organizerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'PLANNING',
    visibility: visibility || 'PRIVATE',
    targetDeliveryDate,
    invitedCircleIds: [organizerId || 'u-1'],
    contributions: [],
    discussionMessages: [
      {
        id: `m-init-${Date.now()}`,
        packageId: `sp-${Date.now()}`,
        senderId: organizerId || 'u-1',
        senderName: organizerName || 'Samuel Ndamukong',
        senderAvatar: organizerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: `Welcome to the secret Surprise Package for ${celebrantName}! Let's coordinate gifts, share video wishes, and make it unforgettable. 🔒 Hidden from ${celebrantName}.`,
        createdAt: new Date().toISOString()
      }
    ],
    hasPooledGoal: Boolean(hasPooledGoal),
    pooledGoalAmount: pooledGoalAmount ? Number(pooledGoalAmount) : undefined,
    currentPooledAmount: 0,
    currency: currency || 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  surprisePackages.unshift(newPackage);
  res.status(201).json({ success: true, surprisePackage: newPackage });
});

// Submit a Contribution (Money, Physical Gift, Digital Gift, Service, Video, Letter, Voice Note)
app.post('/api/surprise-packages/:id/contributions', (req, res) => {
  const { id } = req.params;
  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) {
    return res.status(404).json({ error: 'Surprise Package not found' });
  }

  const {
    contributorId,
    contributorName,
    contributorAvatar,
    type,
    mediaUrl,
    thumbnailUrl,
    messageText,
    durationSeconds,
    giftTitle,
    giftDescription,
    estimatedValue,
    amountContributed,
    currency,
    deliveryMethod,
    flagForCompilation
  } = req.body;

  const newContribution: SurpriseContribution = {
    id: `c-${Date.now()}`,
    packageId: id,
    contributorId: contributorId || 'u-1',
    contributorName: contributorName || 'Anonymous Friend',
    contributorAvatar: contributorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    type,
    mediaUrl,
    thumbnailUrl,
    messageText,
    durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
    giftTitle,
    giftDescription,
    estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
    amountContributed: amountContributed ? Number(amountContributed) : undefined,
    currency: currency || pkg.currency,
    deliveryMethod,
    isFlaggedForCompilation: Boolean(flagForCompilation),
    compilationOrder: flagForCompilation ? (pkg.contributions.filter(c => c.isFlaggedForCompilation).length + 1) : undefined,
    submittedAt: new Date().toISOString()
  };

  // If money, update group pot
  if (type === 'MONEY' && amountContributed) {
    pkg.currentPooledAmount += Number(amountContributed);
  }

  pkg.contributions.push(newContribution);
  pkg.updatedAt = new Date().toISOString();

  res.status(201).json({ success: true, contribution: newContribution, currentPooledAmount: pkg.currentPooledAmount });
});

// Post discussion message in the coordination war room
app.post('/api/surprise-packages/:id/messages', (req, res) => {
  const { id } = req.params;
  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) {
    return res.status(404).json({ error: 'Surprise Package not found' });
  }

  const { senderId, senderName, senderAvatar, text, mediaUrl } = req.body;
  if (!text && !mediaUrl) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const newMsg: SurpriseDiscussionMessage = {
    id: `m-${Date.now()}`,
    packageId: id,
    senderId: senderId || 'u-1',
    senderName: senderName || 'Samuel Ndamukong',
    senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: text || '',
    mediaUrl,
    createdAt: new Date().toISOString()
  };

  pkg.discussionMessages.push(newMsg);
  pkg.updatedAt = new Date().toISOString();

  res.status(201).json({ success: true, message: newMsg });
});

// Flag/unflag media for Compilation Reel (Coordinator tool)
app.post('/api/surprise-packages/:id/flag-compilation', (req, res) => {
  const { id } = req.params;
  const { contributionId, isFlagged, order, caption } = req.body;

  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) return res.status(404).json({ error: 'Surprise Package not found' });

  const contribution = pkg.contributions.find(c => c.id === contributionId);
  if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

  contribution.isFlaggedForCompilation = Boolean(isFlagged);
  if (order !== undefined) contribution.compilationOrder = order;
  if (caption !== undefined) contribution.compilationCaption = caption;

  // Re-compile reel index automatically
  const flagged = pkg.contributions
    .filter(c => c.isFlaggedForCompilation)
    .sort((a, b) => (a.compilationOrder || 0) - (b.compilationOrder || 0));

  pkg.compilationReel = {
    id: `cr-${pkg.id}`,
    packageId: pkg.id,
    title: `${pkg.celebrantName} — Celebration Highlights Reel`,
    totalDurationSeconds: flagged.reduce((acc, curr) => acc + (curr.durationSeconds || 15), 0),
    soundtrackTitle: 'Joyful Horns & Celebration Chimes',
    compiledItems: flagged.map((c, idx) => ({
      contributionId: c.id,
      mediaUrl: c.mediaUrl || c.thumbnailUrl || '',
      type: (c.type === 'VIDEO' ? 'VIDEO' : c.type === 'PHOTO' ? 'PHOTO' : 'LETTER') as any,
      senderName: c.contributorName,
      caption: c.compilationCaption || c.messageText || '',
      durationSeconds: c.durationSeconds || 15,
      order: idx + 1
    })),
    isReady: flagged.length > 0,
    compiledAt: new Date().toISOString()
  };

  pkg.updatedAt = new Date().toISOString();
  res.json({ success: true, compilationReel: pkg.compilationReel });
});

// Dispatch / Deliver Surprise Package to Celebrant
app.post('/api/surprise-packages/:id/deliver', (req, res) => {
  const { id } = req.params;
  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) return res.status(404).json({ error: 'Surprise Package not found' });

  pkg.status = 'DELIVERED';
  pkg.deliveredAt = new Date().toISOString();
  pkg.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Surprise Package delivered to ${pkg.celebrantName}! Now unsealed for unboxing ceremony.`,
    surprisePackage: pkg
  });
});

// Celebrant Thank You submission
app.post('/api/surprise-packages/:id/thank-you', (req, res) => {
  const { id } = req.params;
  const { thankYouText, thankYouMediaUrl, reactionEmoji } = req.body;

  const pkg = surprisePackages.find(p => p.id === id);
  if (!pkg) return res.status(404).json({ error: 'Surprise Package not found' });

  pkg.recipientReaction = {
    unboxedAt: new Date().toISOString(),
    thankYouText: thankYouText || 'Thank you all so much for this incredible surprise! I am so blessed to have you in my life. ❤️',
    thankYouMediaUrl,
    reactionEmoji: reactionEmoji || '🎉'
  };

  res.json({ success: true, message: 'Thank you sent to all contributors!', surprisePackage: pkg });
});

app.listen(PORT, () => {
  console.log(`✨ HBD Foundation API running at http://localhost:${PORT}`);
});
