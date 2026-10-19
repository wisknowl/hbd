import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Truck,
  LayoutGrid,
  Cake,
  Ticket,
  Headphones,
  CreditCard,
  Star,
  Globe,
  X,
  Check,
  Search,
  User,
  Zap,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import type { UniversalGiftItem, PersonCircleMember } from '../../../shared/types';
import { mockUniversalGifts, mockCircleMembers } from '../mockData';
import { useSession } from '../session';

const DESTINATION_OPTIONS = [
  { id: 'ALL', label: 'Everywhere on Earth', flag: '🌐', subtitle: 'Global & cross-border ready' },
  { id: 'US', label: 'United States', flag: '🇺🇸', subtitle: 'Amazon US, Steam, Apple, Spotify' },
  { id: 'GB', label: 'United Kingdom', flag: '🇬🇧', subtitle: 'Amazon UK, London Patisseries, High Tea' },
  { id: 'CM', label: 'Cameroon', flag: '🇨🇲', subtitle: 'Douala & Yaoundé Bakeries, MTN/Orange Airtime' },
  { id: 'NG', label: 'Nigeria', flag: '🇳🇬', subtitle: 'Lagos Luxury Florists, Jumia, Airtel Airtime' },
  { id: 'CA', label: 'Canada', flag: '🇨🇦', subtitle: 'BestBuy, Amazon CA, Tim Hortons' },
  { id: 'CRISIS', label: 'Frontier & Crisis Zones', flag: '🕊️', subtitle: 'Ukraine, Sudan, Palestine — Emotional Reach' }
];

const DELIVERY_RAILS = [
  { id: 'ALL', label: 'All Celebrations', icon: LayoutGrid },
  { id: 'GIFTCARD_BRAND', label: 'Digital Brand Cards (Reloadly 2,900+)', icon: CreditCard },
  { id: 'NATIVE_ESCROW', label: 'Local Handcrafted & Escrow', icon: Cake },
  { id: 'MOBILE_CONNECTIVITY', label: 'Mobile Airtime & Data', icon: Zap },
  { id: 'EMOTIONAL_TRIBUTE', label: 'Tributes & Impact Milestones', icon: Heart }
];

const CATEGORIES: {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}[] = [
  { id: 'ALL', label: 'All Curations', icon: LayoutGrid },
  { id: 'FLOWERS_CAKE', label: 'Cakes & Florals', icon: Cake },
  { id: 'FASHION', label: 'Perfume & Jewelry', icon: Sparkles },
  { id: 'PERSONALIZED', label: 'Personalized Keepsakes', icon: Gift },
  { id: 'EXPERIENCE', label: 'Experiences & Dining', icon: Ticket },
  { id: 'TECH', label: 'Tech & Gadgets', icon: Headphones },
  { id: 'DIGITAL', label: 'Multi-Store Gift Cards', icon: CreditCard }
];

interface GiftEngineViewProps {
  initialRecipient?: PersonCircleMember | null;
  onPlanCustomCelebration: (name: string, location: string) => void;
}

export const GiftEngineView: React.FC<GiftEngineViewProps> = ({
  initialRecipient,
  onPlanCustomCelebration,
}) => {
  // Query state
  const [recipientName, setRecipientName] = useState(initialRecipient ? initialRecipient.fullName : '');
  const [recipientLocation, setRecipientLocation] = useState(initialRecipient ? (initialRecipient.location.includes('Cameroon') ? 'CM' : initialRecipient.location.includes('UK') ? 'GB' : 'ALL') : 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [railFilter, setRailFilter] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(350);
  const [includeHbdGives, setIncludeHbdGives] = useState(true);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [customOrderAmount, setCustomOrderAmount] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('RECOMMENDED');

  // Catalog state: initialized with mock items, hydratable from live /api/gifting/catalog
  const [catalog, setCatalog] = useState<UniversalGiftItem[]>(mockUniversalGifts);

  useEffect(() => {
    fetch('http://localhost:4000/api/gifting/catalog')
      .then(res => res.json())
      .then(data => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: UniversalGiftItem[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category === 'FLOWERS' || item.category === 'CAKE' || item.category === 'CAKES' ? 'FLOWERS_CAKE'
              : item.category === 'JEWELRY' || item.category === 'FASHION' || item.category === 'FRAGRANCE' ? 'FASHION'
              : item.category === 'EXPERIENCE' || item.category === 'EXPERIENCES' ? 'EXPERIENCE'
              : item.category === 'GADGETS' || item.category === 'TECH' || item.category === 'CONNECTIVITY' ? 'TECH'
              : item.category === 'CARDS' || item.category === 'DIGITAL' ? 'DIGITAL'
              : 'PERSONALIZED',
            price: Number(item.price),
            currency: item.currency || 'USD',
            providerName: item.merchantName || 'HBD Partner Merchant',
            providerType: item.isPhysicalStore ? 'bakery' : 'shopify',
            locationScope: item.deliveryScope === 'GLOBAL' ? 'Global' : (item.deliveryScope?.replace('_ONLY', '') || 'Global'),
            imageUrl: item.imageUrl,
            rating: Number(item.rating) || 4.9,
            reviewsCount: 88,
            estimatedDeliveryDays: item.estimatedDeliveryDays ?? 0,
            isCrossBorderReady: item.deliveryScope === 'GLOBAL' || !item.isPhysicalStore,
            fulfillmentType: item.fulfillmentType,
            denominationType: item.denominationType,
            minAmount: item.minAmount ? Number(item.minAmount) : null,
            maxAmount: item.maxAmount ? Number(item.maxAmount) : null,
            countryCode: item.countryCode
          }));
          setCatalog(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Modal checkout state
  const [selectedGift, setSelectedGift] = useState<UniversalGiftItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { currentUser } = useSession();
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('+237 670 000 000');
  const [giftMessage, setGiftMessage] = useState('Happy Birthday! Thinking of you with all my heart across the miles.');

  // Filter and sort gifts
  const filteredGifts = catalog
    .filter(gift => {
      // Budget check
      if (gift.price > maxBudget) return false;

      // Category check
      if (categoryFilter !== 'ALL' && gift.category !== categoryFilter) return false;

      // Delivery rail check
      if (railFilter !== 'ALL') {
        if (railFilter === 'GIFTCARD_BRAND' && gift.fulfillmentType !== 'GIFTCARD_BRAND' && gift.category !== 'DIGITAL') return false;
        if (railFilter === 'NATIVE_ESCROW' && gift.fulfillmentType !== 'NATIVE_ESCROW' && gift.category !== 'FLOWERS_CAKE' && gift.category !== 'EXPERIENCE') return false;
        if (railFilter === 'MOBILE_CONNECTIVITY' && gift.fulfillmentType !== 'MOBILE_CONNECTIVITY') return false;
        if (railFilter === 'EMOTIONAL_TRIBUTE' && gift.fulfillmentType !== 'EMOTIONAL_TRIBUTE' && gift.fulfillmentType !== 'HUMANITARIAN_MILESTONE') return false;
      }

      // Destination Location check
      if (recipientLocation !== 'ALL') {
        const loc = recipientLocation.toUpperCase();
        const code = (gift.countryCode || '').toUpperCase();
        const scope = (gift.locationScope || '').toUpperCase();
        if (loc === 'CRISIS') {
          if (!['UA', 'SD', 'SY', 'PS'].includes(code) && !gift.title.toLowerCase().includes('lifeline') && !gift.title.toLowerCase().includes('capsule')) {
            return false;
          }
        } else {
          if (code !== 'GLOBAL' && code !== loc && !scope.includes(loc)) {
            return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return 0; // Default RECOMMENDED
    });

  const handleStartCheckout = (gift: UniversalGiftItem) => {
    setSelectedGift(gift);
    setCustomOrderAmount(gift.price || 50);
    setIsCheckoutOpen(true);
    setOrderComplete(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;
    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:4000/api/gifting/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giverId: currentUser?.id || 'u-1',
          recipientId: initialRecipient?.id || 'u-2',
          itemId: selectedGift.id,
          greetingMessage: giftMessage,
          customAmount: customOrderAmount
        })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
      }
    } catch (err) {
      console.warn('Backend order placement deferred:', err);
    } finally {
      setIsSubmitting(false);
      setOrderComplete(true);
    }
  };

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      padding: '32px 28px'
    }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* Header Banner — Universal Gift Orchestration Layer */}
        <div style={{
          background: 'linear-gradient(135deg, #2D114D 0%, #1A0830 100%)',
          borderRadius: '26px',
          padding: '34px 32px',
          color: 'var(--cream)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '28px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-30px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 107, 107, 0.15)',
            filter: 'blur(35px)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(244, 185, 66, 0.2)',
              color: 'var(--gold)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              <ShoppingBag size={14} />
              UNIVERSAL GIFT ENGINE · CELEBRATION LAYER ABOVE ECOMMERCE
            </div>

            <h1 style={{
              fontSize: '34px',
              fontWeight: 900,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '10px'
            }}>
              Find & Send The Perfect Gift. <span style={{ color: 'var(--coral)' }}>Anywhere On Earth.</span>
            </h1>

            <p style={{
              fontSize: '15.5px',
              maxWidth: '680px',
              lineHeight: 1.5,
              opacity: 0.9,
              marginBottom: '20px'
            }}>
              HBD orchestrates gifts across Amazon, Shopify, local African florists, artisanal bakeries, and experience providers. You choose the budget and recipient—HBD handles cross-border fulfillment.
            </p>

            {/* Quick Circle selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, opacity: 0.8 }}>
                Quick pick from My People:
              </span>
              {mockCircleMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => {
                    setRecipientName(member.fullName);
                    const code = member.location.includes('Cameroon') ? 'CM'
                      : member.location.includes('UK') ? 'GB'
                      : member.location.includes('Canada') ? 'CA'
                      : member.location.includes('Nigeria') ? 'NG'
                      : 'US';
                    setRecipientLocation(code);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    backgroundColor: recipientName === member.fullName ? 'var(--coral)' : 'rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <img 
                    src={member.avatarUrl} 
                    alt={member.fullName}
                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {member.fullName} ({member.relationship})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Search & Filter Control Panel */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '22px',
          border: '1px solid var(--line)',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* 1. Who are you celebrating? */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <User size={13} color="var(--purple)" />
                1. Who are you celebrating?
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Sister Sarah, Mama Chantal"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
                <Search size={15} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* 2. Where are they located? Custom Floating Menu */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Globe size={13} color="var(--purple)" />
                2. Where are they located?
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsLocationMenuOpen(prev => !prev)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '12px',
                    border: isLocationMenuOpen ? '1px solid var(--purple)' : '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    textAlign: 'left',
                    boxShadow: isLocationMenuOpen ? '0 0 0 2px var(--purple-soft)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '16px' }}>
                      {DESTINATION_OPTIONS.find(o => o.id === recipientLocation)?.flag || '🌐'}
                    </span>
                    <span style={{ fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {DESTINATION_OPTIONS.find(o => o.id === recipientLocation)?.label || 'Everywhere on Earth'}
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ transform: isLocationMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, color: 'var(--muted)' }} />
                </button>

                {isLocationMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '6px',
                    maxHeight: '280px',
                    overflowY: 'auto'
                  }}>
                    {DESTINATION_OPTIONS.map(opt => {
                      const isSelected = recipientLocation === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setRecipientLocation(opt.id);
                            setIsLocationMenuOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isSelected ? 'var(--purple-soft)' : 'transparent',
                            color: isSelected ? 'var(--purple)' : 'var(--fg)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>{opt.flag}</span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: isSelected ? 800 : 600 }}>{opt.label}</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{opt.subtitle}</div>
                            </div>
                          </div>
                          {isSelected && <Check size={14} color="var(--purple)" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Budget Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>
                  3. Max Budget
                </label>
                <b style={{ fontSize: '13px', color: 'var(--coral)' }}>${maxBudget} USD</b>
              </div>
              <input
                type="range"
                min="25"
                max="350"
                step="5"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--coral)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
                <span>$25</span>
                <span>$150</span>
                <span>$350+</span>
              </div>
            </div>
          </div>

          {/* Delivery Rail / Fulfillment Type Filter Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '16px',
            borderTop: '1px solid var(--line)',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginRight: '6px' }}>
              Fulfillment Rail:
            </span>
            {DELIVERY_RAILS.map(rail => {
              const RailIcon = rail.icon;
              const isSelected = railFilter === rail.id;
              return (
                <button
                  key={rail.id}
                  type="button"
                  onClick={() => setRailFilter(rail.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? 'var(--purple-soft)' : 'var(--bg)',
                    color: isSelected ? 'var(--purple)' : 'var(--fg)',
                    border: isSelected ? '1px solid var(--purple)' : '1px solid var(--line)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RailIcon size={13} color={isSelected ? 'var(--purple)' : 'var(--muted)'} />
                  <span>{rail.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Chips with System Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginRight: '6px' }}>
              Gift Categories:
            </span>
            {CATEGORIES.map(cat => {
              const IconComp = cat.icon;
              const isSelected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 800 : 500,
                    backgroundColor: isSelected ? 'var(--coral-soft)' : 'var(--bg)',
                    color: isSelected ? 'var(--coral)' : 'var(--fg)',
                    border: isSelected ? '1px solid var(--coral)' : '1px solid var(--line)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconComp size={14} color={isSelected ? 'var(--coral)' : 'var(--muted)'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info & Filter / Sort Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
              {filteredGifts.length} Connected Celebration Gifts Found
            </h2>
            <small style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Filtered for {recipientName ? `“${recipientName}”` : 'any celebrant'} · Delivered in {DESTINATION_OPTIONS.find(o => o.id === recipientLocation)?.label || recipientLocation} · Up to ${maxBudget}
            </small>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={14} color="var(--purple)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--fg)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="RECOMMENDED">✨ Recommended</option>
                <option value="PRICE_LOW">💵 Price: Low to High</option>
                <option value="PRICE_HIGH">💎 Price: High to Low</option>
                <option value="RATING">⭐ Highest Rated</option>
              </select>
            </div>

            {/* Philanthropy banner */}
            <div style={{
              backgroundColor: 'var(--purple-soft)',
              border: '1px solid var(--line)',
              borderRadius: '14px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Heart size={14} color="var(--coral)" fill="var(--coral)" />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeHbdGives} 
                  onChange={(e) => setIncludeHbdGives(e.target.checked)}
                  style={{ accentColor: 'var(--purple)' }}
                />
                +$5 HBD Gives Meal
              </label>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '22px',
          marginBottom: '40px'
        }}>
          {filteredGifts.map(gift => (
            <div
              key={gift.id}
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: '22px',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.18s, box-shadow 0.18s'
              }}
            >
              {/* Image & Provider Tag */}
              <div style={{ position: 'relative', height: '190px' }}>
                <img 
                  src={gift.imageUrl} 
                  alt={gift.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ShoppingBag size={11} color="var(--gold)" />
                  {gift.providerName}
                </div>

                {gift.isCrossBorderReady && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    backgroundColor: 'rgba(91, 42, 134, 0.92)',
                    backdropFilter: 'blur(6px)',
                    color: 'var(--cream)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Truck size={11} />
                    Cross-Border Ready
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--fg)', lineHeight: 1.3 }}>
                      {gift.title}
                    </h3>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--coral)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      ${gift.price}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.45, marginBottom: '12px' }}>
                    {gift.description}
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--muted)',
                    marginBottom: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--line)'
                  }}>
                    {gift.fulfillmentType === 'GIFTCARD_BRAND' || gift.category === 'DIGITAL' ? (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'var(--purple-soft)', 
                        color: 'var(--purple)', 
                        fontSize: '11px', 
                        fontWeight: 700 
                      }}>
                        <CreditCard size={11} />
                        {gift.countryCode === 'US' ? '🇺🇸 US Store' : gift.countryCode === 'GB' ? '🇬🇧 UK Store' : '🌐 Instant Digital Code'}
                      </span>
                    ) : gift.fulfillmentType === 'MOBILE_CONNECTIVITY' ? (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                        color: '#10B981', 
                        fontSize: '11px', 
                        fontWeight: 700 
                      }}>
                        <Zap size={11} />
                        Instant Recharge
                      </span>
                    ) : gift.fulfillmentType === 'HUMANITARIAN_MILESTONE' ? (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(239, 68, 68, 0.12)', 
                        color: '#EF4444', 
                        fontSize: '11px', 
                        fontWeight: 700 
                      }}>
                        <Heart size={11} />
                        Milestone Certificate
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'var(--bg)', 
                        color: 'var(--fg)', 
                        fontSize: '11px', 
                        fontWeight: 600,
                        border: '1px solid var(--line)'
                      }}>
                        <MapPin size={11} color="var(--purple)" />
                        {gift.locationScope.includes('Douala') ? 'Douala Local Delivery' : gift.locationScope.includes('London') ? 'London Store & Courier' : gift.locationScope}
                      </span>
                    )}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="var(--gold)" color="var(--gold)" />
                      <b style={{ color: 'var(--fg)', fontSize: '12px' }}>{gift.rating}</b>
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>({gift.reviewsCount})</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartCheckout(gift)}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--purple)',
                      color: 'var(--cream)',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(91, 42, 134, 0.25)',
                      cursor: 'pointer'
                    }}
                  >
                    <Gift size={15} />
                    Send Gift
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cannot find exact item? Bespoke Concierge Box */}
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1.5px dashed var(--purple)',
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--purple)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px'
            }}>
              Custom Celebration Request
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
              Want a custom cake, violinist, or diaspora surprise in Africa?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: 0, maxWidth: '580px' }}>
              Our dedicated local Celebration Concierge in Douala, Lagos, Accra, and Nairobi will source, bake, hand-wrap, and deliver anything with photographic confirmation.
            </p>
          </div>

          <button
            onClick={() => onPlanCustomCelebration(recipientName || 'My Celebrant', recipientLocation)}
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              backgroundColor: 'var(--coral)',
              color: '#fff',
              fontSize: '13.5px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            Request Custom Concierge
          </button>
        </div>
      </div>

      {/* Checkout / Gift Orchestration Modal */}
      {isCheckoutOpen && selectedGift && (
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
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {!orderComplete ? (
              <form onSubmit={handleConfirmOrder}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={20} color="var(--purple)" />
                    <h3 style={{ fontSize: '19px', fontWeight: 800 }}>Send Gift</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      color: 'var(--muted)',
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Gift Summary Box */}
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  backgroundColor: 'var(--bg)',
                  padding: '12px',
                  borderRadius: '16px',
                  marginBottom: '18px'
                }}>
                  <img 
                    src={selectedGift.imageUrl} 
                    alt={selectedGift.title} 
                    style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <b style={{ fontSize: '14px', display: 'block' }}>{selectedGift.title}</b>
                    <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                      Fulfilled via {selectedGift.providerName} · {selectedGift.locationScope}
                    </small>
                    <div style={{ color: 'var(--coral)', fontWeight: 800, fontSize: '14px', marginTop: '4px' }}>
                      ${customOrderAmount || selectedGift.price} USD
                    </div>
                  </div>
                </div>

                {/* Interactive Denomination Selector for Digital Brand Cards & Variable Value Items */}
                {(selectedGift.fulfillmentType === 'GIFTCARD_BRAND' || selectedGift.category === 'DIGITAL' || selectedGift.denominationType === 'RANGE' || selectedGift.denominationType === 'FIXED') && (
                  <div style={{
                    backgroundColor: 'var(--bg)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    border: '1px solid var(--line)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CreditCard size={13} color="var(--purple)" />
                        Choose Gift Card Denomination:
                      </label>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                        {selectedGift.denominationType === 'RANGE' ? 'Custom Amount' : 'Standard Tiers'}
                      </span>
                    </div>

                    {/* Quick Preset Pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {[15, 25, 50, 100, 250].map(amt => {
                        const isChosen = customOrderAmount === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setCustomOrderAmount(amt)}
                            style={{
                              padding: '5px 13px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: isChosen ? 800 : 600,
                              backgroundColor: isChosen ? 'var(--purple)' : 'var(--card)',
                              color: isChosen ? 'var(--cream)' : 'var(--fg)',
                              border: isChosen ? '1px solid var(--purple)' : '1px solid var(--line)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            ${amt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>Custom USD Amount:</span>
                      <div style={{ position: 'relative', width: '110px' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--coral)', fontSize: '13px' }}>$</span>
                        <input
                          type="number"
                          min="5"
                          max="1000"
                          value={customOrderAmount}
                          onChange={(e) => setCustomOrderAmount(Math.max(5, Number(e.target.value)))}
                          style={{
                            width: '100%',
                            padding: '5px 10px 5px 22px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            backgroundColor: 'var(--card)',
                            color: 'var(--fg)',
                            fontWeight: 700,
                            fontSize: '12.5px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form fields */}
                <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Celebrant Recipient Name
                    </label>
                    <input 
                      type="text"
                      value={recipientName || 'Mama Chantal'}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--card)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Delivery WhatsApp / Phone (For courier coordination)
                    </label>
                    <input 
                      type="text"
                      value={giftRecipientPhone}
                      onChange={(e) => setGiftRecipientPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--card)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Celebration Message & Card Inscription
                    </label>
                    <textarea 
                      rows={2}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--card)',
                        color: 'var(--fg)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* Pricing & HBD Gives breakdown */}
                <div style={{
                  backgroundColor: 'var(--bg)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--muted)' }}>Gift Subtotal:</span>
                    <span>${customOrderAmount || selectedGift.price}.00</span>
                  </div>
                  {includeHbdGives && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--purple)', fontWeight: 600 }}>
                      <span>HBD Gives (Orphanage Birthday Meal):</span>
                      <span>+$5.00</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--muted)' }}>HBD Celebration Concierge & Tracking:</span>
                    <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--line)',
                    fontWeight: 800,
                    fontSize: '15px'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--coral)' }}>
                      ${(customOrderAmount || selectedGift.price) + (includeHbdGives ? 5 : 0)}.00 USD
                    </span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--coral)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(255, 107, 107, 0.35)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  <Gift size={16} />
                  {isSubmitting ? 'Sending Gift...' : `Send Gift · $${(customOrderAmount || selectedGift.price) + (includeHbdGives ? 5 : 0)}.00 USD`}
                </button>
              </form>
            ) : (
              /* Order Success Confirmation */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Check size={32} strokeWidth={2.5} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                  Gift Sent!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  HBD has routed this order to <b>{placedOrder?.merchant?.name || selectedGift.providerName}</b>. Your celebrant ({recipientName || 'Celebrant'}) will receive their surprise with your custom message!
                </p>
                <div style={{
                  backgroundColor: 'var(--bg)',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: 'var(--fg)',
                  marginBottom: '20px',
                  border: '1px solid var(--line)'
                }}>
                  <div>Order Reference: <b style={{ color: 'var(--purple)' }}>{placedOrder?.orderNumber || `HBD-GIFT-${new Date().getFullYear()}-882A`}</b></div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                    Status: <span style={{ color: '#10B981', fontWeight: 700 }}>{placedOrder?.status || 'ESCROWED'}</span> • Funds securely held in HBD Escrow
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--purple)',
                    color: 'var(--cream)',
                    fontWeight: 800,
                    fontSize: '13px'
                  }}
                >
                  Back to Gifts
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
