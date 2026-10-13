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
