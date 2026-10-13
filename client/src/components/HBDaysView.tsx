import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon,
  Search,
  Plus,
  ShieldCheck,
  Sparkles,
  Gift,
  Building2,
  Heart,
  GraduationCap,
  Award,
  Users,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Clock,
  Sliders,
  Sun,
  List,
  MapPin,
  Globe,
  Ban,
  Check,
  Compass,
  Flag,
  Star,
  Music,
  Filter,
  Flame,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { 
  CelebrationCategory, 
  PersonCircleMember, 
  GlobalCalendarEntry, 
  ManagedObjectType,
  InspirationDomain
} from '../../../shared/types';
import { 
  mockCalendarEntries, 
  MONTH_NAMES, 
  MONTH_SHORT_DAYS 
} from '../data/calendarData';

export interface CelebrationColorMeta {
  color: string;
  bg: string;
  border: string;
  lightText: string;
  badgeBg: string;
  label: string;
}

export const CELEBRATION_THEMES: Record<string, CelebrationColorMeta> = {
  BIRTHDAY: {
    color: '#2563EB',      // Electric Royal Blue
    bg: '#EFF6FF',         // Ice Blue
    border: '#BFDBFE',     // Light Blue
    lightText: '#1D4ED8',
    badgeBg: '#DBEAFE',
    label: 'People & Birthdays',
  },
  BEGINNING: {
    color: '#10B981',      // Vibrant Emerald Green
    bg: '#ECFDF5',         // Mint Tint
    border: '#A7F3D0',     // Light Green
    lightText: '#047857',
    badgeBg: '#D1FAE5',
    label: 'Beginnings & Startups',
  },
  MILESTONE: {
    color: '#F59E0B',      // Regal Amber / Gold
    bg: '#FFFBEB',         // Warm Gold Tint
    border: '#FDE68A',     // Light Amber
    lightText: '#B45309',
    badgeBg: '#FEF3C7',
    label: 'Milestones & Triumphs',
  },
  ANNIVERSARY: {
    color: '#E11D48',      // Rose / Coral Red
    bg: '#FFF1F2',         // Petal Rose Tint
    border: '#FECDD3',     // Light Rose
    lightText: '#BE123C',
    badgeBg: '#FFE4E6',
    label: 'Anniversaries & Weddings',
  },
  COMMUNITY: {
    color: '#7C3AED',      // Deep Amethyst Violet
    bg: '#F5F3FF',         // Soft Violet Tint
    border: '#DDD6FE',     // Light Purple
    lightText: '#6D28D9',
    badgeBg: '#EDE9FE',
    label: 'Global Observances',
  },
  ICONS: {
    color: '#7C3AED',      // Deep Amethyst Violet
    bg: '#F5F3FF',         // Soft Violet Tint
    border: '#DDD6FE',     // Light Purple
    lightText: '#6D28D9',
    badgeBg: '#EDE9FE',
    label: 'Community Heroes & Idols',
  },
  FAITH: {
    color: '#6366F1',      // Celestial Indigo / Sacred Gold
    bg: '#EEF2FF',         // Soft Indigo
    border: '#C7D2FE',     // Light Indigo
    lightText: '#4338CA',
    badgeBg: '#E0E7FF',
    label: 'Faith & Sacred Heritage',
  },
  TRIBUTE: {
    color: '#475569',      // Platinum Pearl / Deep Slate
    bg: '#F8FAFC',         // Pure Soft Slate
    border: '#CBD5E1',     // Slate Outline
    lightText: '#334155',
    badgeBg: '#F1F5F9',
    label: 'Tributes & Remembrance',
  },
};

export const getCelebrationTheme = (cat?: string): CelebrationColorMeta => {
  return CELEBRATION_THEMES[cat || 'BIRTHDAY'] || CELEBRATION_THEMES.BIRTHDAY;
};

export const resolveInspirationDomain = (item: {
  domain?: string;
  category?: string;
  title?: string;
  subtitle?: string;
  objectType?: string;
}): InspirationDomain => {
  if (item.domain && item.domain !== 'ALL_DOMAINS') return item.domain as InspirationDomain;
  const text = `${item.title || ''} ${item.subtitle || ''} ${item.objectType || ''}`.toLowerCase();
  
  if (item.category === 'FAITH' || text.includes('faith') || text.includes('sacred') || text.includes('diwali') || text.includes('eid') || text.includes('easter') || text.includes('christmas') || text.includes('hanukkah') || text.includes('muertos') || text.includes('spiritual') || text.includes('prayer') || text.includes('temple') || text.includes('mosque') || text.includes('church')) {
    return 'FAITH_PHILOSOPHY';
  }
  if (text.includes('tech') || text.includes('startup') || text.includes('innovation') || text.includes('payseed') || text.includes('afrotech') || text.includes('code') || text.includes('business') || text.includes('architect') || text.includes('seed')) {
    return 'TECH_BUSINESS';
  }
  if (text.includes('music') || text.includes('jazz') || text.includes('art') || text.includes('creative') || text.includes('design') || text.includes('studio') || text.includes('vinyl') || text.includes('producer') || text.includes('dance')) {
    return 'MUSIC_ARTS';
  }
  if (text.includes('sport') || text.includes('marathon') || text.includes('pioneer') || text.includes('athlete') || text.includes('champion') || text.includes('tennis') || text.includes('runner') || text.includes('olympic') || text.includes('athletics')) {
    return 'SPORTS_PIONEERS';
  }
  if (text.includes('justice') || text.includes('peace') || text.includes('human') || text.includes('king') || text.includes('mandela') || text.includes('courage') || text.includes('leader') || text.includes('hope') || text.includes('mentor') || text.includes('elder') || text.includes('health') || text.includes('clinic')) {
    return 'HUMANITARIAN_LEADERS';
  }
  if (text.includes('science') || text.includes('space') || text.includes('curie') || text.includes('discovery') || text.includes('degree') || text.includes('academic') || text.includes('university') || text.includes('astronomy')) {
    return 'SCIENCE_DISCOVERY';
  }
  if (text.includes('earth') || text.includes('wildlife') || text.includes('nature') || text.includes('conservation') || text.includes('environment') || text.includes('ocean')) {
    return 'EARTH_NATURE';
  }
  if (item.category === 'BEGINNING') return 'TECH_BUSINESS';
  if (item.category === 'ICONS' || item.category === 'COMMUNITY') return 'HUMANITARIAN_LEADERS';
  if (item.category === 'MILESTONE') return 'SCIENCE_DISCOVERY';
  return 'ALL_DOMAINS';
};

export type CalendarGranularity = '12months' | '1month' | 'weekly' | '3days' | '1day' | 'agenda';

type GranularityIconType = 'grid' | 'calendar' | 'clock' | 'sliders' | 'sun' | 'list';

const VIEW_OPTIONS: { id: CalendarGranularity; label: string; iconType: GranularityIconType }[] = [
  { id: '12months', label: '12 Months View', iconType: 'grid' },
  { id: '1month', label: '1 Month View', iconType: 'calendar' },
  { id: 'weekly', label: 'Weekly View (7D)', iconType: 'clock' },
  { id: '3days', label: '3 Days View', iconType: 'sliders' },
  { id: '1day', label: '1 Day View', iconType: 'sun' },
  { id: 'agenda', label: 'Timeline Agenda', iconType: 'list' }
];

function renderGranularityIcon(type: GranularityIconType, size = 15) {
  switch (type) {
    case 'grid': return <LayoutGrid size={size} />;
    case 'calendar': return <CalendarIcon size={size} />;
    case 'clock': return <Clock size={size} />;
    case 'sliders': return <Sliders size={size} />;
    case 'sun': return <Sun size={size} />;
    case 'list': return <List size={size} />;
  }
}

interface HBDaysViewProps {
  onPlanCelebration: (category: CelebrationCategory, name: string) => void;
  onOpenGiftsForPerson?: (person: PersonCircleMember) => void;
  onOpenSurprisePackage?: (personName: string) => void;
}

function getDayMilestones(month: number, day: number) {
  const milestones: Record<string, { title: string; subtitle: string; luminary: string; category: string }> = {
    '10-12': {
      title: "World Innovation & Space Exploration Landmark",
      subtitle: "Commemorating humanity's bold breakthroughs in aerospace, computer science & global networks.",
      luminary: 'Ada Lovelace & Katherine Johnson',
      category: 'GLOBAL INNOVATION'
    },
    '10-15': {
      title: "Global Handwashing & Rural Health Triumph",
      subtitle: "Universal community healthcare impact reaching over 120 nations.",
      luminary: 'Dr. Denis Mukwege',
      category: 'COMMUNITY HEALTH'
    },
    '10-17': {
      title: "International Solidarity for Human Dignity",
      subtitle: "Celebrating grassroots champions lifting communities out of adversity.",
      luminary: 'Wangari Maathai',
      category: 'HUMAN DIGNITY'
    },
    '10-24': {
      title: "United Nations & Global Peace Charter Day",
      subtitle: "Universal collaboration and pan-continental goodwill observance.",
      luminary: 'Kofi Annan',
      category: 'GLOBAL COOPERATION'
    }
  };

  const key = `${month}-${day}`;
  if (milestones[key]) {
    return milestones[key];
  }

  const seasons = ['Pioneering Discovery', 'Cultural Renaissance', 'Human Ingenuity', 'Community Solidarity'];
  const season = seasons[(month + day) % seasons.length];
  const luminaries = ['Nelson Mandela', 'Marie Curie', 'Miles Davis', 'Serena Williams', 'Leonardo da Vinci', 'Maya Angelou'];

  return {
    title: `${season} Observance`,
    subtitle: `Honoring human resilience, scientific evolution, and shared cultural heritage worldwide.`,
    luminary: luminaries[(month + day) % luminaries.length],
    category: 'HUMAN ACHIEVEMENT'
  };
}

export const HBDaysView: React.FC<HBDaysViewProps> = ({
  onPlanCelebration,
  onOpenGiftsForPerson,
  onOpenSurprisePackage,
}) => {
  // Calendar Granularity Dropdown state (Defaults to 1-Day View)
  const [viewGranularity, setViewGranularity] = useState<CalendarGranularity>('1day');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorDate, setAnchorDate] = useState<Date>(new Date(2026, 9, 12)); // Oct 12, 2026
  const [searchQuery, setSearchQuery] = useState('');
  
  // Universal Daily Toast state
  const [dailyToastCount, setDailyToastCount] = useState(1428);
  const [hasToastedToday, setHasToastedToday] = useState(false);

  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGeoScope, setSelectedGeoScope] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<InspirationDomain>('ALL_DOMAINS');
  const [openFilterMenu, setOpenFilterMenu] = useState<'type' | 'field' | 'scope' | null>(null);

  // Interactive Month Modal (Screenshot 2: Clicking month opens list of birthdays in that month)
  const [activeMonthModal, setActiveMonthModal] = useState<number | null>(null);

  // New Creation Modal state (Unified Object Creator)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createObjectType, setCreateObjectType] = useState<ManagedObjectType | 'PERSON'>('PERSON');
  const [prefilledMonth, setPrefilledMonth] = useState<number>(10);


  // Detail Drawer for an entry
  const [inspectedEntry, setInspectedEntry] = useState<GlobalCalendarEntry | null>(null);

  // Live state of calendar entries
  const [calendarEntries, setCalendarEntries] = useState<GlobalCalendarEntry[]>(mockCalendarEntries);

  // Creation Form State
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('2026-10-15');
  const [formLocation, setFormLocation] = useState('');
  const [formRelationship, setFormRelationship] = useState('Friend');
  const [formWants, setFormWants] = useState('');
  const [formDontWants, setFormDontWants] = useState('');
  const [formPrivateNotes, setFormPrivateNotes] = useState('');
  // Object specific fields
  const [formIndustry, setFormIndustry] = useState('');
  const [formPartnerName, setFormPartnerName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formTributeBio, setFormTributeBio] = useState('');
  const [formHeroDomain, setFormHeroDomain] = useState('COMMUNITY');

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return calendarEntries.filter(entry => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesSub = entry.subtitle?.toLowerCase().includes(q) ?? false;
        const matchesLoc = entry.location?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesSub && !matchesLoc) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'BIRTHDAY' && entry.category !== 'BIRTHDAY') return false;
        if (selectedCategory === 'BEGINNING' && entry.category !== 'BEGINNING') return false;
        if (selectedCategory === 'MILESTONE' && entry.category !== 'MILESTONE') return false;
        if (selectedCategory === 'ANNIVERSARY' && entry.category !== 'ANNIVERSARY') return false;
        if (selectedCategory === 'COMMUNITY_ICONS' && entry.category !== 'COMMUNITY' && entry.category !== 'ICONS') return false;
        if (selectedCategory === 'FAITH' && entry.category !== 'FAITH') return false;
        if (selectedCategory === 'TRIBUTE' && entry.category !== 'TRIBUTE') return false;
      }

      // Inspiration Domain filter
      if (selectedDomain !== 'ALL_DOMAINS') {
        const domain = resolveInspirationDomain(entry);
        if (domain !== selectedDomain) return false;
      }

      // Geo Scope filter
      if (selectedGeoScope !== 'ALL') {
        if (entry.geoScope !== selectedGeoScope) return false;
      }

      return true;
    });
  }, [calendarEntries, searchQuery, selectedCategory, selectedGeoScope, selectedDomain]);

  // Group entries by month for the 12-Month Grid
  const entriesByMonth = useMemo(() => {
    const map: Record<number, GlobalCalendarEntry[]> = {};
    for (let m = 1; m <= 12; m++) {
      map[m] = [];
    }
    filteredEntries.forEach(e => {
      if (map[e.month]) {
        map[e.month].push(e);
      }
    });
    return map;
  }, [filteredEntries]);

  // Handle Add Celebration Form Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDate) return;

    const parsedDate = new Date(formDate);
    const day = parsedDate.getUTCDate();
    const month = parsedDate.getUTCMonth() + 1;
    const year = parsedDate.getUTCFullYear();

    // Calculate relative day count from October 12, 2026
    const today = new Date('2026-10-12');
    const diffTime = parsedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const relativeLabel = diffDays === 0 ? 'Today' : diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;

    const monogram = formName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'HB';

    // Color assignment by category
    let color = '#EAB308';
    let cat: CelebrationCategory = 'BIRTHDAY';
    if (createObjectType === 'STARTUP') {
      color = '#10B981';
      cat = 'BEGINNING';
    } else if (createObjectType === 'WEDDING') {
      color = '#F43F5E';
      cat = 'ANNIVERSARY';
    } else if (createObjectType === 'MILESTONE') {
      color = '#3B82F6';
      cat = 'MILESTONE';
    } else if (createObjectType === 'IDOL') {
      color = '#A855F7';
      cat = 'ICONS';
    }

    const newEntry: GlobalCalendarEntry = {
      id: `cal-custom-${Date.now()}`,
      title: createObjectType === 'PERSON' ? `${formName}'s Birthday` : formName,
      subtitle: createObjectType === 'PERSON' 
        ? `${formRelationship} · Personal Circle` 
        : createObjectType === 'STARTUP' 
        ? `${formIndustry || 'Venture'} Founding Anniversary` 
        : createObjectType === 'WEDDING' 
        ? `Wedding Anniversary with ${formPartnerName || 'Partner'}` 
        : createObjectType === 'MILESTONE' 
        ? `Academic Milestone at ${formInstitution || 'Institution'}` 
        : `Tribute to ${formName}`,
      category: cat,
      objectType: createObjectType,
      date: formDate,
      day,
      month,
      year,
      monogram,
      color,
      geoScope: createObjectType === 'PERSON' ? 'CIRCLE' : 'COUNTRY',
      location: formLocation || 'Global',
      isVerifiedIdentity: false, // will turn true upon document verification
      daysRemaining: diffDays,
      relativeLabel,
      wants: formWants ? formWants.split(',').map(s => s.trim()) : undefined,
      dontWants: formDontWants ? formDontWants.split(',').map(s => s.trim()) : undefined,
    };

    setCalendarEntries(prev => [newEntry, ...prev]);
    setShowCreateModal(false);

    // Reset fields
    setFormName('');
    setFormWants('');
    setFormDontWants('');
    setFormLocation('');
    setFormPrivateNotes('');
    setFormPartnerName('');
    setFormIndustry('');
    setFormInstitution('');
    setFormTributeBio('');
  };

  // Days in month helper
  const getDaysInMonth = (year: number, monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Day offset for 1st of month (0 = Sun, 1 = Mon, etc.)
  const getFirstDayOffset = (year: number, monthIndex: number) => {
    return new Date(year, monthIndex, 1).getDay();
  };

  const selectedYear = anchorDate.getFullYear();
  const selectedMonthNum = anchorDate.getMonth() + 1; // 1-12

  // Navigation handlers
  const handlePrev = () => {
    setAnchorDate(curr => {
      const d = new Date(curr);
      if (viewGranularity === '12months') d.setFullYear(d.getFullYear() - 1);
      else if (viewGranularity === '1month') d.setMonth(d.getMonth() - 1);
      else if (viewGranularity === 'weekly') d.setDate(d.getDate() - 7);
      else if (viewGranularity === '3days') d.setDate(d.getDate() - 3);
      else if (viewGranularity === '1day') d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setAnchorDate(curr => {
      const d = new Date(curr);
      if (viewGranularity === '12months') d.setFullYear(d.getFullYear() + 1);
      else if (viewGranularity === '1month') d.setMonth(d.getMonth() + 1);
      else if (viewGranularity === 'weekly') d.setDate(d.getDate() + 7);
      else if (viewGranularity === '3days') d.setDate(d.getDate() + 3);
      else if (viewGranularity === '1day') d.setDate(d.getDate() + 1);
      return d;
    });
  };

  // Week days (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const start = new Date(anchorDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(start);
      next.setDate(start.getDate() + i);
      days.push(next);
    }
    return days;
  }, [anchorDate]);

  // 3 days window
  const threeDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const next = new Date(anchorDate);
      next.setDate(anchorDate.getDate() + i);
      days.push(next);
    }
    return days;
  }, [anchorDate]);

  // Upcoming celebration radar entries for the next 1-4 days
  const upcomingRadarEntries = useMemo(() => {
    const curMonth = anchorDate.getMonth() + 1;
    const curDay = anchorDate.getDate();
    return calendarEntries.filter(entry => {
      const parts = entry.date.split('-');
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (m === curMonth && d > curDay && d <= curDay + 4) return true;
      if (m === curMonth + 1 && curDay >= 28 && d <= 3) return true;
      return false;
    });
  }, [anchorDate, calendarEntries]);

  const headerPeriodTitle = useMemo(() => {
    if (viewGranularity === '12months') {
      return `${selectedYear}`;
    }
    if (viewGranularity === '1month') {
      return `${MONTH_NAMES[selectedMonthNum - 1]} ${selectedYear}`;
    }
    if (viewGranularity === 'weekly') {
      const first = weekDays[0];
      const last = weekDays[6];
      return `${MONTH_SHORT_DAYS[first.getDay()]} ${first.getDate()} ${MONTH_NAMES[first.getMonth()].slice(0, 3)} – ${MONTH_SHORT_DAYS[last.getDay()]} ${last.getDate()} ${MONTH_NAMES[last.getMonth()].slice(0, 3)}, ${last.getFullYear()}`;
    }
    if (viewGranularity === '3days') {
      const first = threeDays[0];
      const last = threeDays[2];
      return `${MONTH_NAMES[first.getMonth()].slice(0, 3)} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
    }
    if (viewGranularity === '1day') {
      return `${MONTH_NAMES[anchorDate.getMonth()]} ${anchorDate.getDate()}, ${anchorDate.getFullYear()}`;
    }
    return `${selectedYear}`;
  }, [viewGranularity, selectedYear, selectedMonthNum, weekDays, threeDays, anchorDate]);

  const activeOption = VIEW_OPTIONS.find(o => o.id === viewGranularity) || VIEW_OPTIONS[0];

  const getCelebrationsForDate = (date: Date) => {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return filteredEntries.filter(e => e.month === m && e.day === d);
  };

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg, #121217)',
      color: 'var(--fg, #F4F4F6)',
      padding: '24px 28px'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

        {/* TOP BRAND APP BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: '#1E1B4B',
          borderRadius: '20px',
          padding: '16px 22px',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Left: View Mode Dropdown + Period Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* View Granularity Dropdown Trigger (NOT a modal) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                title="Switch Calendar View"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFF',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'background 0.15s ease'
                }}
              >
                {renderGranularityIcon(activeOption.iconType, 15)}
                <span>{activeOption.label}</span>
                <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Inline Dropdown Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  backgroundColor: 'var(--card)',
                  borderRadius: '14px',
                  border: '1px solid var(--line)',
                  padding: '6px',
                  minWidth: '220px',
                  zIndex: 200,
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', padding: '6px 10px', letterSpacing: '0.05em' }}>
                    CALENDAR VIEW MODES
                  </div>
                  {VIEW_OPTIONS.map(opt => {
                    const isSelected = viewGranularity === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setViewGranularity(opt.id);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--purple-soft)' : 'transparent',
                          color: isSelected ? 'var(--purple)' : 'var(--fg)',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          border: 'none'
                        }}
                      >
                        {renderGranularityIcon(opt.iconType, 15)}
                        <span>{opt.label}</span>
                        {isSelected && <Check size={14} style={{ marginLeft: 'auto', color: 'var(--purple)' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Period Navigator: Prev < [Title] > Next */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '4px 10px'
            }}>
              <button
                onClick={handlePrev}
                title="Previous"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '6px',
                  color: '#A5B4FC',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <span style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#FFF',
                fontFamily: 'Poppins, sans-serif',
                padding: '0 4px',
                whiteSpace: 'nowrap'
              }}>
                {headerPeriodTitle}
              </span>

              <button
                onClick={handleNext}
                title="Next"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '6px',
                  color: '#A5B4FC',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right: Search, Anti-Duplication Badge & Add Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input - Unified with Sidebar.tsx */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              padding: '0 12px',
              height: '38px',
              width: '260px',
              boxSizing: 'border-box',
              transition: 'border 0.15s'
            }}>
              <Search size={15} color="var(--muted)" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search birthdays, startups, idols..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '13px',
                  color: 'var(--fg)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>


            {/* Primary Action Button */}
            <button
              onClick={() => {
                setPrefilledMonth(10);
                setShowCreateModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                backgroundColor: '#EC4899',
                color: '#FFF',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)'
              }}
            >
              <Plus size={16} />
              <span>Add Celebration</span>
            </button>
          </div>
        </div>

        {/* ORGANIZED CATEGORY FILTER DROPDOWNS (NOT A MODAL) */}
        {(() => {
          const typeOptions = [
            { id: 'ALL', label: 'All Joy', icon: <Sparkles size={13} />, color: '#7C3AED', softBg: '#F5F3FF', border: '#DDD6FE' },
            { id: 'BIRTHDAY', label: 'People & Birthdays', icon: <Gift size={13} />, color: '#2563EB', softBg: '#EFF6FF', border: '#BFDBFE' },
            { id: 'BEGINNING', label: 'Beginnings & Startups', icon: <Building2 size={13} />, color: '#10B981', softBg: '#ECFDF5', border: '#A7F3D0' },
            { id: 'MILESTONE', label: 'Milestones & Triumphs', icon: <Award size={13} />, color: '#F59E0B', softBg: '#FFFBEB', border: '#FDE68A' },
            { id: 'ANNIVERSARY', label: 'Anniversaries & Weddings', icon: <Heart size={13} />, color: '#E11D48', softBg: '#FFF1F2', border: '#FECDD3' },
            { id: 'COMMUNITY_ICONS', label: 'Community Heroes & Idols', icon: <Globe size={13} />, color: '#7C3AED', softBg: '#F5F3FF', border: '#DDD6FE' },
            { id: 'FAITH', label: 'Faith & Sacred Heritage', icon: <Sparkles size={13} />, color: '#6366F1', softBg: '#EEF2FF', border: '#C7D2FE' },
            { id: 'TRIBUTE', label: 'Tributes & Remembrance', icon: <Flame size={13} />, color: '#475569', softBg: '#F8FAFC', border: '#CBD5E1' },
          ];

          const fieldOptions = [
            { id: 'ALL_DOMAINS', label: 'All Fields', icon: <Sparkles size={13} />, color: '#6366F1' },
            { id: 'TECH_BUSINESS', label: 'Tech & Business', icon: <Building2 size={13} />, color: '#3B82F6' },
            { id: 'MUSIC_ARTS', label: 'Music & Arts', icon: <Music size={13} />, color: '#EC4899' },
            { id: 'SPORTS_PIONEERS', label: 'Sports & Pioneers', icon: <Award size={13} />, color: '#F97316' },
            { id: 'HUMANITARIAN_LEADERS', label: 'Humanitarians & Leaders', icon: <Heart size={13} />, color: '#8B5CF6' },
            { id: 'SCIENCE_DISCOVERY', label: 'Science & Space', icon: <Compass size={13} />, color: '#06B6D4' },
            { id: 'EARTH_NATURE', label: 'Earth & Wildlife', icon: <Globe size={13} />, color: '#10B981' },
            { id: 'FAITH_PHILOSOPHY', label: 'Faith & Philosophy', icon: <BookOpen size={13} />, color: '#8B5CF6' },
          ];

          const scopeOptions = [
            { id: 'ALL', label: 'All Scopes', icon: <Globe size={13} /> },
            { id: 'CIRCLE', label: 'Family & Friends', icon: <Users size={13} /> },
            { id: 'LOCAL', label: 'Local City', icon: <MapPin size={13} /> },
            { id: 'COUNTRY', label: 'Country Level', icon: <Flag size={13} /> },
            { id: 'CONTINENT', label: 'Pan-Continental', icon: <Compass size={13} /> },
            { id: 'GLOBAL', label: 'Worldwide Observance', icon: <Globe size={13} /> },
          ];

          const activeType = typeOptions.find(o => o.id === selectedCategory) || typeOptions[0];
          const activeField = fieldOptions.find(o => o.id === selectedDomain) || fieldOptions[0];
          const activeScope = scopeOptions.find(o => o.id === selectedGeoScope) || scopeOptions[0];
          const hasActiveFilters = selectedCategory !== 'ALL' || selectedDomain !== 'ALL_DOMAINS' || selectedGeoScope !== 'ALL';

          return (
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '10px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              zIndex: 60
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
                  <Filter size={15} color="var(--purple)" />
                  <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                    Filter By:
                  </span>
                </div>

                {/* Dropdown 1: Celebration Type */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenFilterMenu(prev => prev === 'type' ? null : 'type')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: selectedCategory !== 'ALL' ? 800 : 600,
                      border: '1px solid',
                      borderColor: selectedCategory !== 'ALL' ? activeType.color : 'var(--line)',
                      backgroundColor: selectedCategory !== 'ALL' ? activeType.softBg : 'var(--bg)',
                      color: selectedCategory !== 'ALL' ? activeType.color : 'var(--fg)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {activeType.icon}
                    <span>Type: <b>{activeType.label}</b></span>
                    <ChevronDown size={13} style={{ transform: openFilterMenu === 'type' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Inline Type Dropdown Menu (NOT modal) */}
                  {openFilterMenu === 'type' && (
                    <div style={{
                      position: 'absolute',
                      top: '118%',
                      left: 0,
                      backgroundColor: 'var(--card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      padding: '6px',
                      minWidth: '250px',
                      zIndex: 100,
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', padding: '6px 10px', letterSpacing: '0.05em' }}>
                        CELEBRATION TYPE
                      </div>
                      {typeOptions.map(opt => {
                        const isSelected = selectedCategory === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedCategory(opt.id);
                              setOpenFilterMenu(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? opt.softBg : 'transparent',
                              color: isSelected ? opt.color : 'var(--fg)',
                              fontWeight: isSelected ? 800 : 500,
                              fontSize: '13px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                              border: isSelected ? `1px solid ${opt.border}` : '1px solid transparent',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <span style={{ color: opt.color }}>{opt.icon}</span>
                            <span style={{ flex: 1 }}>{opt.label}</span>
                            {isSelected && <Check size={14} style={{ color: opt.color }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown 2: Inspiration Field */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenFilterMenu(prev => prev === 'field' ? null : 'field')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: selectedDomain !== 'ALL_DOMAINS' ? 800 : 600,
                      border: '1px solid',
                      borderColor: selectedDomain !== 'ALL_DOMAINS' ? 'var(--purple)' : 'var(--line)',
                      backgroundColor: selectedDomain !== 'ALL_DOMAINS' ? 'var(--purple-soft)' : 'var(--bg)',
                      color: selectedDomain !== 'ALL_DOMAINS' ? 'var(--purple)' : 'var(--fg)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {activeField.icon}
                    <span>Field: <b>{activeField.label}</b></span>
                    <ChevronDown size={13} style={{ transform: openFilterMenu === 'field' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Inline Field Dropdown Menu (NOT modal) */}
                  {openFilterMenu === 'field' && (
                    <div style={{
                      position: 'absolute',
                      top: '118%',
                      left: 0,
                      backgroundColor: 'var(--card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      padding: '6px',
                      minWidth: '240px',
                      zIndex: 100,
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', padding: '6px 10px', letterSpacing: '0.05em' }}>
                        INSPIRATION FIELD
                      </div>
                      {fieldOptions.map(opt => {
                        const isSelected = selectedDomain === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedDomain(opt.id as InspirationDomain);
                              setOpenFilterMenu(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'var(--purple-soft)' : 'transparent',
                              color: isSelected ? 'var(--purple)' : 'var(--fg)',
                              fontWeight: isSelected ? 800 : 500,
                              fontSize: '13px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                              border: isSelected ? '1px solid var(--purple)' : '1px solid transparent',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <span style={{ color: opt.color }}>{opt.icon}</span>
                            <span style={{ flex: 1 }}>{opt.label}</span>
                            {isSelected && <Check size={14} style={{ color: 'var(--purple)' }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown 3: Scope & Circle */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setOpenFilterMenu(prev => prev === 'scope' ? null : 'scope')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: selectedGeoScope !== 'ALL' ? 800 : 600,
                      border: '1px solid',
                      borderColor: selectedGeoScope !== 'ALL' ? 'var(--coral)' : 'var(--line)',
                      backgroundColor: selectedGeoScope !== 'ALL' ? 'var(--coral-soft)' : 'var(--bg)',
                      color: selectedGeoScope !== 'ALL' ? 'var(--coral)' : 'var(--fg)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {activeScope.icon}
                    <span>Scope: <b>{activeScope.label}</b></span>
                    <ChevronDown size={13} style={{ transform: openFilterMenu === 'scope' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {/* Inline Scope Dropdown Menu (NOT modal) */}
                  {openFilterMenu === 'scope' && (
                    <div style={{
                      position: 'absolute',
                      top: '118%',
                      left: 0,
                      backgroundColor: 'var(--card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      padding: '6px',
                      minWidth: '240px',
                      zIndex: 100,
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--muted)', padding: '6px 10px', letterSpacing: '0.05em' }}>
                        SCOPE & CIRCLE
                      </div>
                      {scopeOptions.map(opt => {
                        const isSelected = selectedGeoScope === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedGeoScope(opt.id);
                              setOpenFilterMenu(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'var(--coral-soft)' : 'transparent',
                              color: isSelected ? 'var(--coral)' : 'var(--fg)',
                              fontWeight: isSelected ? 800 : 500,
                              fontSize: '13px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                              border: isSelected ? '1px solid var(--coral)' : '1px solid transparent',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <span style={{ color: 'var(--coral)' }}>{opt.icon}</span>
                            <span style={{ flex: 1 }}>{opt.label}</span>
                            {isSelected && <Check size={14} style={{ color: 'var(--coral)' }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Reset Filters CTA */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedDomain('ALL_DOMAINS');
                    setSelectedGeoScope('ALL');
                    setOpenFilterMenu(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--line)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* VIEW 1: 12-MONTH YEAR-AT-A-GLANCE GRID */}
        {viewGranularity === '12months' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              {MONTH_NAMES.map((monthName, monthIndex) => {
                const monthNum = monthIndex + 1;
                const daysInMonth = getDaysInMonth(selectedYear, monthIndex);
                const firstDayOffset = getFirstDayOffset(selectedYear, monthIndex);
                const monthCelebrations = entriesByMonth[monthNum] || [];

                return (
                  <div
                    key={monthName}
                    onClick={() => {
                      setAnchorDate(new Date(selectedYear, monthIndex, 12));
                      setViewGranularity('1month');
                    }}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '16px',
                      border: '1px solid var(--line)',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--purple)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'var(--line)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    {/* Month Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fg)' }}>
                        {monthName}
                      </span>
                      {monthCelebrations.length > 0 && (
                        <span style={{
                          backgroundColor: 'var(--purple-soft)',
                          color: 'var(--purple)',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          {monthCelebrations.length} celebration{monthCelebrations.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Day of Week Headers */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      textAlign: 'center',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      marginBottom: '6px'
                    }}>
                      {MONTH_SHORT_DAYS.map(day => (
                        <div key={day}>{day}</div>
                      ))}
                    </div>

                    {/* Mini Calendar Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: '2px',
                      textAlign: 'center',
                      fontSize: '11px',
                      rowGap: '6px'
                    }}>
                      {/* Empty cells before 1st */}
                      {Array.from({ length: firstDayOffset }).map((_, idx) => (
                        <div key={`empty-${idx}`} style={{ height: '28px' }} />
                      ))}

                      {/* Day cells */}
                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const celebrationsOnDay = monthCelebrations.filter(e => e.day === dayNum);
                        const hasCelebrations = celebrationsOnDay.length > 0;
                        const isToday = monthNum === 10 && dayNum === 12;

                        return (
                          <div
                            key={`day-${dayNum}`}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '28px',
                              borderRadius: '6px',
                              position: 'relative',
                              backgroundColor: isToday ? 'var(--coral)' : 'transparent',
                              color: isToday ? '#FFF' : 'var(--fg)',
                              fontWeight: isToday ? 900 : hasCelebrations ? 800 : 500
                            }}
                          >
                            <span>{dayNum}</span>

                            {hasCelebrations && (
                              <div style={{
                                display: 'flex',
                                gap: '2px',
                                marginTop: '1px'
                              }}>
                                  {celebrationsOnDay.slice(0, 3).map((item) => {
                                    const theme = getCelebrationTheme(item.category);
                                    return (
                                      <span
                                        key={item.id}
                                        title={`${item.title} (${theme.label})`}
                                        style={{
                                          width: '6.5px',
                                          height: '6.5px',
                                          borderRadius: '50%',
                                          backgroundColor: theme.color,
                                          display: 'inline-block',
                                          boxShadow: `0 0 4px ${theme.color}60`
                                        }}
                                      />
                                    );
                                  })}
                                {celebrationsOnDay.length > 2 && (
                                  <span style={{ fontSize: '7px', color: 'var(--gold)', lineHeight: 1 }}>+</span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Tap Prompt */}
                    <div style={{
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: 'var(--muted)'
                    }}>
                      <span>Click for 1-Month view</span>
                      <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Open Month →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: 1-MONTH FULL EXPANDED CALENDAR VIEW */}
        {viewGranularity === '1month' && (
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '28px'
          }}>
            {/* Weekday Column Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--muted)',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--line)',
              marginBottom: '4px'
            }}>
              {MONTH_SHORT_DAYS.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Large 7-Column Days Matrix */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
              marginTop: '6px'
            }}>
              {/* Offset days before 1st */}
              {Array.from({ length: getFirstDayOffset(selectedYear, selectedMonthNum - 1) }).map((_, idx) => (
                <div key={`empty-full-${idx}`} style={{ minHeight: '110px', backgroundColor: 'transparent' }} />
              ))}

              {/* Day cells 1..daysInMonth */}
              {Array.from({ length: getDaysInMonth(selectedYear, selectedMonthNum - 1) }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateObj = new Date(selectedYear, selectedMonthNum - 1, dayNum);
                const dayCelebrations = getCelebrationsForDate(dateObj);
                const isToday = selectedYear === 2026 && selectedMonthNum === 10 && dayNum === 12;

                return (
                  <div
                    key={`full-day-${dayNum}`}
                    style={{
                      minHeight: '110px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: isToday ? 'var(--coral-soft)' : 'var(--bg)',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setAnchorDate(dateObj);
                      setViewGranularity('1day');
                    }}
                  >
                    {/* Header: Day number + Today Tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isToday ? 'var(--coral)' : 'transparent',
                        color: isToday ? '#FFF' : 'var(--fg)'
                      }}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--coral)', textTransform: 'uppercase' }}>
                          Today
                        </span>
                      )}
                    </div>

                    {/* Celebration Chips inside the Day Cell */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', flex: 1 }}>
                      {dayCelebrations.slice(0, 2).map(item => (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedEntry(item);
                          }}
                          style={{
                            backgroundColor: 'var(--card)',
                            border: `1px solid ${item.color}44`,
                            borderLeft: `3px solid ${item.color}`,
                            borderRadius: '6px',
                            padding: '3px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            color: '#FFF',
                            fontSize: '8px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.monogram}
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                      {dayCelebrations.length > 2 && (
                        <span style={{ fontSize: '10px', color: 'var(--purple)', fontWeight: 800, paddingLeft: '4px' }}>
                          +{dayCelebrations.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Bottom count badge if events exist */}
                    {dayCelebrations.length > 0 && (
                      <div style={{ fontSize: '9.5px', color: 'var(--muted)', textAlign: 'right', marginTop: '2px' }}>
                        {dayCelebrations.length} event{dayCelebrations.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: WEEKLY VIEW (7 Days Across) */}
        {viewGranularity === 'weekly' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {weekDays.map(date => {
              const dayCelebrations = getCelebrationsForDate(date);
              const isToday = date.getFullYear() === 2026 && (date.getMonth() + 1) === 10 && date.getDate() === 12;

              return (
                <div
                  key={date.toISOString()}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isToday ? 'var(--coral)' : 'var(--line)',
                    padding: '14px',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Column Header */}
                  <div style={{
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--line)',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isToday ? 'var(--coral)' : 'var(--muted)', textTransform: 'uppercase' }}>
                        {MONTH_SHORT_DAYS[date.getDay()]}
                      </span>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--fg)' }}>
                        {MONTH_NAMES[date.getMonth()].slice(0, 3)} {date.getDate()}
                      </div>
                    </div>
                    {isToday && (
                      <span style={{
                        backgroundColor: 'var(--coral)',
                        color: '#FFF',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '999px'
                      }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Celebrations on this day */}
                  {dayCelebrations.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '12px' }}>
                      No events
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      {dayCelebrations.map(c => (
                        <div
                          key={c.id}
                          onClick={() => setInspectedEntry(c)}
                          style={{
                            backgroundColor: 'var(--bg)',
                            borderRadius: '10px',
                            border: '1px solid var(--line)',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: c.color,
                              color: '#FFF',
                              fontSize: '9px',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {c.monogram}
                            </span>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.title}
                            </span>
                          </div>
                          <small style={{ color: 'var(--muted)', fontSize: '11px' }}>
                            {c.location}
                          </small>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '10.5px', color: 'var(--coral)', fontWeight: 700 }}>
                              {c.relativeLabel}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlanCelebration(c.category, c.title);
                              }}
                              style={{
                                backgroundColor: 'var(--purple-soft)',
                                color: 'var(--purple)',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              Plan
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 4: 3-DAYS DETAILED VIEW */}
        {viewGranularity === '3days' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {threeDays.map(date => {
              const dayCelebrations = getCelebrationsForDate(date);
              const isToday = date.getFullYear() === 2026 && (date.getMonth() + 1) === 10 && date.getDate() === 12;

              return (
                <div
                  key={date.toISOString()}
                  style={{
                    backgroundColor: 'var(--card)',
                    borderRadius: '18px',
                    border: '1px solid',
                    borderColor: isToday ? 'var(--coral)' : 'var(--line)',
                    padding: '18px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Column Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '12px',
                    marginBottom: '14px'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: isToday ? 'var(--coral)' : 'var(--muted)', textTransform: 'uppercase' }}>
                        {MONTH_SHORT_DAYS[date.getDay()]}
                      </span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--fg)' }}>
                        {MONTH_NAMES[date.getMonth()]} {date.getDate()}
                      </div>
                    </div>
                    {isToday && (
                      <span style={{
                        backgroundColor: 'var(--coral)',
                        color: '#FFF',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px'
                      }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Celebrations Dossiers */}
                  {dayCelebrations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--muted)', fontSize: '13px' }}>
                      No celebrations scheduled for this day.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dayCelebrations.map(c => (
                        <div
                          key={c.id}
                          onClick={() => setInspectedEntry(c)}
                          style={{
                            backgroundColor: 'var(--bg)',
                            borderRadius: '14px',
                            border: '1px solid var(--line)',
                            padding: '12px 14px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: c.color,
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 900
                            }}>
                              {c.monogram}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fg)' }}>
                                {c.title}
                              </div>
                              <small style={{ color: 'var(--muted)', fontSize: '11.5px' }}>
                                {c.location}
                              </small>
                            </div>
                          </div>

                          {c.wants && c.wants.length > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: 'var(--purple-soft)',
                              borderRadius: '8px',
                              padding: '6px 8px',
                              fontSize: '11px',
                              color: 'var(--purple)',
                              fontWeight: 700,
                              marginBottom: '6px'
                            }}>
                              <Gift size={13} color="var(--purple)" />
                              <span>Desired Gifts: {c.wants.join(', ')}</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--coral)', fontWeight: 800 }}>
                              {c.relativeLabel}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (c.tone === 'TRIBUTE') {
                                  alert(`Honoring ${c.title}. A virtual memorial candle has been lit in remembrance.`);
                                } else {
                                  onPlanCelebration(c.category, c.title);
                                }
                              }}
                              style={{
                                backgroundColor: c.tone === 'TRIBUTE' ? '#475569' : 'var(--purple)',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '999px',
                                padding: '4px 12px',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              {c.tone === 'TRIBUTE' ? 'Honor & Candle' : 'Plan Surprise'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 5: 1-DAY COMPREHENSIVE DOSSIER VIEW */}
        {viewGranularity === '1day' && (
          <div style={{ marginBottom: '28px' }}>
            {(() => {
              const dayCelebrations = getCelebrationsForDate(anchorDate);
              const isToday = anchorDate.getFullYear() === 2026 && (anchorDate.getMonth() + 1) === 10 && anchorDate.getDate() === 12;

              return (
                <div style={{
                  backgroundColor: 'var(--card)',
                  borderRadius: '20px',
                  border: '1px solid var(--line)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Hero Date Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '16px',
                    marginBottom: '18px'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: isToday ? 'var(--coral)' : 'var(--muted)', textTransform: 'uppercase' }}>
                        {MONTH_SHORT_DAYS[anchorDate.getDay()]} Day Overview
                      </span>
                      <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--fg)', margin: '4px 0 0 0' }}>
                        {MONTH_NAMES[anchorDate.getMonth()]} {anchorDate.getDate()}, {anchorDate.getFullYear()}
                      </h2>
                    </div>
                    {isToday && (
                      <span style={{
                        backgroundColor: 'var(--coral)',
                        color: '#FFF',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '4px 14px',
                        borderRadius: '999px'
                      }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* UNIVERSAL DAILY TOAST 🥂 BANNER */}
                  <div style={{
                    backgroundColor: 'var(--bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    padding: '16px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--purple-soft)',
                        color: 'var(--purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fg)' }}>
                          Universal Toast of the Day
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                          {dailyToastCount.toLocaleString()} people lifted a celebration toast today across the globe
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!hasToastedToday) {
                          confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
                        }
                        setDailyToastCount(c => c + (hasToastedToday ? -1 : 1));
                        setHasToastedToday(t => !t);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: hasToastedToday ? '#059669' : 'var(--purple)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 22px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(91, 42, 134, 0.25)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {hasToastedToday ? <Check size={16} /> : <Sparkles size={16} />}
                      <span>{hasToastedToday ? 'Toasted! 🥂' : 'Raise a Toast 🥂'}</span>
                    </button>
                  </div>

                  {/* Personal & Circle Celebrations (if any) */}
                  {dayCelebrations.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                        Personal & Circle Celebrations ({dayCelebrations.length})
                      </div>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {dayCelebrations.map(event => {
                          const theme = getCelebrationTheme(event.category);
                          return (
                            <div
                              key={event.id}
                              style={{
                                backgroundColor: 'var(--bg)',
                                borderRadius: '16px',
                                border: '1px solid var(--line)',
                                borderLeft: `5px solid ${theme.color}`,
                                padding: '18px 22px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                  <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.color,
                                    color: '#FFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '17px',
                                    fontWeight: 900
                                  }}>
                                    {event.monogram}
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--fg)' }}>
                                        {event.title}
                                      </h3>
                                      <span style={{
                                        fontSize: '10.5px',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        backgroundColor: theme.bg,
                                        border: `1px solid ${theme.border}`,
                                        color: theme.color,
                                        fontWeight: 800
                                      }}>
                                        {theme.label}
                                      </span>
                                    </div>
                                    <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
                                      {event.subtitle || `on ${event.date}`} · {event.location}
                                    </div>
                                  </div>
                              </div>

                              <span style={{ fontSize: '13.5px', color: 'var(--coral)', fontWeight: 800 }}>
                                {event.relativeLabel}
                              </span>
                            </div>

                            {/* Wishlist Chips */}
                            {event.wants && event.wants.length > 0 && (
                              <div style={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--line)',
                                borderRadius: '12px',
                                padding: '12px',
                                marginTop: '14px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                  <Gift size={13} color="var(--purple)" />
                                  <b style={{ fontSize: '12px', color: 'var(--purple)' }}>
                                    Wishlist & Desired Gifts:
                                  </b>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {event.wants.map((w, idx) => (
                                    <span key={idx} style={{
                                      backgroundColor: 'var(--purple-soft)',
                                      color: 'var(--purple)',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      padding: '3px 10px',
                                      borderRadius: '999px'
                                    }}>
                                      {w}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Avoid info */}
                            {event.dontWants && event.dontWants.length > 0 && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                marginTop: '10px',
                                fontSize: '12px',
                                color: '#EF4444',
                                fontWeight: 600
                              }}>
                                <Ban size={13} color="#EF4444" />
                                <span>Things to Avoid: {event.dontWants.join(' · ')}</span>
                              </div>
                            )}

                            {/* Action CTA */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                              <button
                                onClick={() => setInspectedEntry(event)}
                                style={{
                                  padding: '8px 18px',
                                  borderRadius: '999px',
                                  border: '1px solid var(--line)',
                                  backgroundColor: 'var(--card)',
                                  color: 'var(--fg)',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  if (event.tone === 'TRIBUTE') {
                                    alert(`Honoring ${event.title}. A virtual memorial candle has been lit in remembrance.`);
                                  } else {
                                    onPlanCelebration(event.category, event.title);
                                  }
                                }}
                                style={{
                                  padding: '8px 20px',
                                  borderRadius: '999px',
                                  border: 'none',
                                  backgroundColor: event.tone === 'TRIBUTE' ? '#475569' : 'var(--purple)',
                                  color: '#FFF',
                                  fontSize: '12.5px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  boxShadow: event.tone === 'TRIBUTE' ? '0 4px 12px rgba(71, 85, 105, 0.25)' : '0 4px 12px rgba(91, 42, 134, 0.25)'
                                }}
                              >
                                {event.tone === 'TRIBUTE' ? 'Honor & Light Candle' : 'Plan Surprise Package'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                  {/* UNIVERSAL JOY ENGINE (No Day is Ever Empty) */}
                  {(() => {
                    const m = anchorDate.getMonth() + 1;
                    const d = anchorDate.getDate();
                    const landmark = getDayMilestones(m, d);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Today's Universal Joy & Inspiration Radar
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '14px'
                        }}>
                          {/* Card 1: Today's World Landmark */}
                          <div style={{
                            backgroundColor: 'var(--bg)',
                            borderRadius: '16px',
                            border: '1px solid var(--line)',
                            padding: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--purple-soft)',
                                color: 'var(--purple)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Globe size={16} />
                              </div>
                              <div>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  {landmark.category}
                                </span>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fg)' }}>
                                  {landmark.title}
                                </div>
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                              {landmark.subtitle}
                            </p>
                          </div>

                          {/* Card 2: Luminary Spotlight */}
                          <div style={{
                            backgroundColor: 'var(--bg)',
                            borderRadius: '16px',
                            border: '1px solid var(--line)',
                            padding: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--coral-soft)',
                                color: 'var(--coral)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Star size={16} />
                              </div>
                              <div>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  LUMINARY INSPIRATION
                                </span>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fg)' }}>
                                  {landmark.luminary}
                                </div>
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                              Honoring visionary pioneers, icons & mentors whose courage and achievements shape humanity.
                            </p>
                          </div>

                          {/* Card 3: Milestone Radar */}
                          <div style={{
                            backgroundColor: 'var(--bg)',
                            borderRadius: '16px',
                            border: '1px solid var(--line)',
                            padding: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                color: '#10B981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Compass size={16} />
                              </div>
                              <div>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  YOUR MILESTONE RADAR
                                </span>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--fg)' }}>
                                  AfroTech Labs 3rd Year Runway
                                </div>
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                              Day 242 of relentless execution. Every day brings you closer to your grand milestone.
                            </p>
                          </div>
                        </div>

                        {/* Quick Add Celebration CTA */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                          <button
                            onClick={() => {
                              setPrefilledMonth(anchorDate.getMonth() + 1);
                              setFormDate(`${anchorDate.getFullYear()}-${String(anchorDate.getMonth() + 1).padStart(2, '0')}-${String(anchorDate.getDate()).padStart(2, '0')}`);
                              setShowCreateModal(true);
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px dashed var(--purple)',
                              color: 'var(--purple)',
                              padding: '10px 24px',
                              borderRadius: '999px',
                              fontWeight: 800,
                              fontSize: '13px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Plus size={15} /> Add Birthday or Celebration for this Date
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* UPCOMING RADAR (Next 72 Hours) */}
                  {upcomingRadarEntries.length > 0 && (
                    <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Clock size={16} color="var(--purple)" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Upcoming Radar (Next 72 Hours)
                        </span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '10px'
                      }}>
                        {upcomingRadarEntries.map(entry => (
                          <div
                            key={entry.id}
                            onClick={() => {
                              const [y, m, d] = entry.date.split('-').map(Number);
                              setAnchorDate(new Date(y, m - 1, d));
                            }}
                            style={{
                              backgroundColor: 'var(--bg)',
                              borderRadius: '12px',
                              border: '1px solid var(--line)',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: entry.color,
                                color: '#FFF',
                                fontSize: '11px',
                                fontWeight: 900,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {entry.monogram}
                              </div>
                              <div>
                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--fg)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {entry.title}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                  {MONTH_NAMES[entry.month - 1].slice(0, 3)} {entry.day} · {entry.location}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--coral)' }}>
                              {entry.relativeLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 6: CHRONOLOGICAL TIMELINE / AGENDA FEED */}
        {viewGranularity === 'agenda' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Past Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 900,
                color: 'var(--fg)',
                marginBottom: '12px'
              }}>
                <span>Past</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                  ({filteredEntries.filter(e => e.daysRemaining < 0).length} celebrations)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredEntries.filter(e => e.daysRemaining < 0).map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => setInspectedEntry(entry)}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--purple-soft)';
                      e.currentTarget.style.borderColor = 'var(--purple)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card)';
                      e.currentTarget.style.borderColor = 'var(--line)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fg)' }}>
                          {entry.title}
                        </span>
                        {entry.isVerifiedIdentity && (
                          <span title="Official Document Verified Identity">
                            <ShieldCheck size={14} color="#34D399" />
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: `${entry.color}22`,
                          color: entry.color,
                          fontWeight: 700
                        }}>
                          {entry.category}
                        </span>
                      </div>
                      <small style={{ color: 'var(--muted)', fontSize: '12.5px' }}>
                        {entry.subtitle || `on ${entry.date}`} · {entry.location}
                      </small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                        {entry.relativeLabel}
                      </span>
                      {/* Monogram circle badge (Matching Screenshot 1) */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: entry.color,
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900
                      }}>
                        {entry.monogram}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming / Current Year Section (Matching Screenshot 1: "2026") */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 900,
                color: 'var(--fg)',
                marginBottom: '12px'
              }}>
                <span>2026 & Upcoming</span>
                <span style={{ fontSize: '12px', color: 'var(--coral)', fontWeight: 700 }}>
                  ({filteredEntries.filter(e => e.daysRemaining >= 0).length} upcoming)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredEntries.filter(e => e.daysRemaining >= 0).map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => setInspectedEntry(entry)}
                    style={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '14px',
                      border: '1px solid var(--line)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--purple-soft)';
                      e.currentTarget.style.borderColor = 'var(--purple)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card)';
                      e.currentTarget.style.borderColor = 'var(--line)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--fg)' }}>
                          {entry.title}
                        </span>
                        {entry.isVerifiedIdentity && (
                          <span title="Official Document Verified Identity">
                            <ShieldCheck size={14} color="#34D399" />
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: `${entry.color}22`,
                          color: entry.color,
                          fontWeight: 700
                        }}>
                          {entry.category}
                        </span>
                      </div>
                      <small style={{ color: 'var(--muted)', fontSize: '12.5px' }}>
                        {entry.subtitle || `on ${entry.date}`} · {entry.location}
                      </small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '13px',
                        color: entry.daysRemaining <= 7 ? 'var(--coral)' : 'var(--purple)',
                        fontWeight: 700
                      }}>
                        {entry.relativeLabel}
                      </span>
                      {/* Monogram circle badge */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: entry.color,
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900
                      }}>
                        {entry.monogram}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: CONTEXTUAL MONTH POPUP (Matching Screenshot 2) */}
        {activeMonthModal !== null && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '20px',
              border: '1px solid var(--line)',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}>
              {/* Purple Header Bar (Matching Screenshot 2) */}
              <div style={{
                backgroundColor: 'var(--purple)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFF'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 900 }}>
                  {MONTH_NAMES[activeMonthModal - 1]} {selectedYear}
                </span>
                <button
                  onClick={() => setActiveMonthModal(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Month List Content */}
              <div style={{ padding: '16px', maxHeight: '420px', overflowY: 'auto' }}>
                {entriesByMonth[activeMonthModal]?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--muted)' }}>
                    <CalendarIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No celebrations registered in {MONTH_NAMES[activeMonthModal - 1]} yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entriesByMonth[activeMonthModal]?.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveMonthModal(null);
                          setInspectedEntry(item);
                        }}
                        style={{
                          backgroundColor: 'var(--bg)',
                          borderRadius: '12px',
                          border: '1px solid var(--line)',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--purple-soft)';
                          e.currentTarget.style.borderColor = 'var(--purple)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg)';
                          e.currentTarget.style.borderColor = 'var(--line)';
                        }}
                      >
                        <div>
                          <b style={{ fontSize: '14px', color: 'var(--fg)', display: 'block' }}>
                            {item.title}
                          </b>
                          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                            on {item.date}
                          </small>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                            {item.relativeLabel}
                          </span>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 900
                          }}>
                            {item.monogram}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Green Add Birthday / Celebration Button (Matching Screenshot 2) */}
                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => {
                      if (activeMonthModal) {
                        setPrefilledMonth(activeMonthModal);
                        setFormDate(`2026-${String(activeMonthModal).padStart(2, '0')}-15`);
                      }
                      setActiveMonthModal(null);
                      setShowCreateModal(true);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#16A34A',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <Plus size={16} />
                    <span>Add Birthday or Celebration</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: UNIFIED MULTI-OBJECT CREATION STUDIO */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '24px',
              border: '1px solid var(--line)',
              maxWidth: '540px',
              width: '100%',
              padding: '26px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: 'var(--fg)' }}>
                  Create Celebration Node ({MONTH_NAMES[prefilledMonth - 1]})
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Object Type Picker Pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                {[
                  { type: 'PERSON', label: '🎂 Person', icon: Users },
                  { type: 'STARTUP', label: '🚀 Startup', icon: Building2 },
                  { type: 'WEDDING', label: '💍 Wedding', icon: Heart },
                  { type: 'MILESTONE', label: '🎓 Milestone', icon: GraduationCap },
                  { type: 'IDOL', label: '🌟 My Idol', icon: Award },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setCreateObjectType(item.type as any)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: createObjectType === item.type ? 'var(--purple)' : 'var(--line)',
                      backgroundColor: createObjectType === item.type ? 'var(--purple-soft)' : 'var(--bg)',
                      color: createObjectType === item.type ? 'var(--purple)' : 'var(--fg)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Verified Identity Precedence Notice */}
              <div style={{
                backgroundColor: 'var(--purple-soft)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}>
                <ShieldCheck size={18} color="var(--purple)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--fg)', lineHeight: 1.45 }}>
                  <b>Civil Identity Reconciliation Protocol:</b> When this celebrant later registers and verifies with their official government documents, their official preferences will merge as source of truth, while your private notes remain protected.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                    {createObjectType === 'PERSON' ? 'Celebrant Full Name' : createObjectType === 'STARTUP' ? 'Startup / Company Name' : createObjectType === 'WEDDING' ? 'Couple / Wedding Title' : createObjectType === 'MILESTONE' ? 'Milestone Title' : 'Hero / Idol Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={createObjectType === 'PERSON' ? 'e.g. Christina, Brother David' : createObjectType === 'STARTUP' ? 'e.g. AfroTech Labs' : createObjectType === 'WEDDING' ? 'e.g. Sarah & Michael Wedding' : createObjectType === 'MILESTONE' ? 'e.g. Ph.D. Defense, Bar Exam Pass' : 'e.g. Nelson Mandela, Prof. Maathai'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '13.5px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      Celebration Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      City / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Douala, London"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* Specific field branches */}
                {createObjectType === 'PERSON' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      Relationship
                    </label>
                    <select
                      value={formRelationship}
                      onChange={(e) => setFormRelationship(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="Family">Family</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Partner">Partner</option>
                      <option value="Mentor">Mentor</option>
                    </select>
                  </div>
                )}

                {createObjectType === 'STARTUP' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FinTech, Clean Energy, Creative Studio"
                      value={formIndustry}
                      onChange={(e) => setFormIndustry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                )}

                {createObjectType === 'WEDDING' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      Partner Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Michael Jenkins"
                      value={formPartnerName}
                      onChange={(e) => setFormPartnerName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                )}

                {createObjectType === 'MILESTONE' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                      Institution / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Imperial College London, Bar Association"
                      value={formInstitution}
                      onChange={(e) => setFormInstitution(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                )}

                {createObjectType === 'IDOL' && (
                  <>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                        Inspirational Field / Domain
                      </label>
                      <select
                        value={formHeroDomain}
                        onChange={(e) => setFormHeroDomain(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid var(--line)',
                          backgroundColor: 'var(--bg)',
                          color: 'var(--fg)',
                          fontSize: '13px'
                        }}
                      >
                        <option value="COMMUNITY">Community & Humanitarian</option>
                        <option value="CIVIL_RIGHTS">Peace & Civil Rights</option>
                        <option value="SCIENCE">Science, Tech & Environment</option>
                        <option value="ARTS_MUSIC">Arts, Music & Culture</option>
                        <option value="SPORTS">Sports & Athletics</option>
                        <option value="LITERATURE">Literature & Philosophy</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                        Tribute Story / Impact Legacy
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Why does this hero inspire you and the world?"
                        value={formTributeBio}
                        onChange={(e) => setFormTributeBio(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1px solid var(--line)',
                          backgroundColor: 'var(--bg)',
                          color: 'var(--fg)',
                          fontSize: '13px',
                          resize: 'none'
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Private Relationship Notes (Protected layer) */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fg)', display: 'block', marginBottom: '5px' }}>
                    🔒 Private Relationship Notes (Only visible to you)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Budget ~$100, Shoe size 42, past gift given in 2025"
                    value={formPrivateNotes}
                    onChange={(e) => setFormPrivateNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '12.5px'
                    }}
                  />
                </div>

                {/* What they want & what they don't want */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', display: 'block', marginBottom: '5px' }}>
                      🎁 What They Love / Wishlist Clues
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Books, Perfume, Cakes"
                      value={formWants}
                      onChange={(e) => setFormWants(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '12.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', display: 'block', marginBottom: '5px' }}>
                      🚫 What to Avoid (Dislikes)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. No surprise calls, No alcohol"
                      value={formDontWants}
                      onChange={(e) => setFormDontWants(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '12.5px'
                      }}
                    />
                  </div>
                </div>

                {/* Submit buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '999px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'transparent',
                      color: 'var(--muted)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: 'var(--coral)',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 107, 107, 0.4)'
                    }}
                  >
                    Save Celebration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* MODAL 4: INSPECTED CELEBRATION DETAIL DRAWER */}
        {inspectedEntry && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '24px',
              border: '1px solid var(--line)',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: inspectedEntry.color,
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 900
                  }}>
                    {inspectedEntry.monogram}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--fg)' }}>
                      {inspectedEntry.title}
                    </h3>
                    <small style={{ color: 'var(--muted)', fontSize: '12.5px' }}>
                      {inspectedEntry.subtitle || `on ${inspectedEntry.date}`}
                    </small>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedEntry(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status and Countdown */}
              <div style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                    Celebration Timing
                  </span>
                  <b style={{ fontSize: '15px', color: inspectedEntry.daysRemaining <= 7 ? 'var(--coral)' : 'var(--purple)' }}>
                    {inspectedEntry.relativeLabel}
                  </b>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                    Category
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '999px',
                    backgroundColor: `${inspectedEntry.color}22`,
                    color: inspectedEntry.color
                  }}>
                    {inspectedEntry.category}
                  </span>
                </div>
              </div>

              {/* Preferences (Wants & Dislikes) */}
              {(inspectedEntry.wants || inspectedEntry.dontWants) && (
                <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
                  {inspectedEntry.wants && (
                    <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '12px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669', display: 'block', marginBottom: '4px' }}>
                        🎁 What They Love / Wishlist Hints:
                      </span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--fg)' }}>
                        {inspectedEntry.wants.join(' · ')}
                      </p>
                    </div>
                  )}

                  {inspectedEntry.dontWants && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#DC2626', display: 'block', marginBottom: '4px' }}>
                        🚫 What to Avoid (Dislikes):
                      </span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--fg)' }}>
                        {inspectedEntry.dontWants.join(' · ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {onOpenGiftsForPerson && (
                  <button
                    onClick={() => {
                      const personCircle: PersonCircleMember = {
                        id: inspectedEntry.id,
                        fullName: inspectedEntry.title,
                        relationship: 'Friend',
                        birthDate: inspectedEntry.date,
                        location: inspectedEntry.location || 'Global',
                        avatarUrl: inspectedEntry.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                        interests: inspectedEntry.wants || ['Celebration Surprise', 'Handmade Treats'],
                        giftPreferences: inspectedEntry.wants || ['Curated Gift Box'],
                        daysUntilCelebration: Math.max(0, inspectedEntry.daysRemaining)
                      };
                      setInspectedEntry(null);
                      onOpenGiftsForPerson(personCircle);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '999px',
                      padding: '11px 14px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Gift size={14} color="#FBBF24" />
                    <span>Find Gifts</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setInspectedEntry(null);
                    onPlanCelebration(inspectedEntry.category, inspectedEntry.title);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#4F46E5',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '11px 14px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={14} />
                  <span>Plan</span>
                </button>

                {onOpenSurprisePackage && (
                  <button
                    onClick={() => {
                      setInspectedEntry(null);
                      onOpenSurprisePackage(inspectedEntry.title);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#EC4899',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '11px 14px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Gift size={14} />
                    <span>Surprise</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
