import express from 'express';
import cors from 'cors';
import { mockPackages, mockReels, mockReminders } from './mockData.js';
import { CelebrationBookingRequest, ReminderItem } from '../../shared/types.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory state for development API (mirrors PostgreSQL schema)
let reels = [...mockReels];
let reminders: ReminderItem[] = [...mockReminders];
const bookings: CelebrationBookingRequest[] = [];

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

app.listen(PORT, () => {
  console.log(`✨ HBD Foundation API running at http://localhost:${PORT}`);
});
