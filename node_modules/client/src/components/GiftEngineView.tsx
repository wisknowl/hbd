import React, { useState } from 'react';
import { 
  Gift, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import type { UniversalGiftItem, PersonCircleMember } from '../../../shared/types';
import { mockUniversalGifts, mockCircleMembers } from '../mockData';

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
  const [recipientLocation, setRecipientLocation] = useState(initialRecipient ? initialRecipient.location : 'All');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(150);
  const [includeHbdGives, setIncludeHbdGives] = useState(true);

  // Modal checkout state
  const [selectedGift, setSelectedGift] = useState<UniversalGiftItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('+237 670 000 000');
  const [giftMessage, setGiftMessage] = useState('Happy Birthday! Thinking of you with all my heart across the miles.');

  // Filter gifts
  const filteredGifts = mockUniversalGifts.filter(gift => {
    // Budget check
    if (gift.price > maxBudget) return false;

    // Category check
    if (categoryFilter !== 'ALL' && gift.category !== categoryFilter) return false;

    // Location check
    if (recipientLocation !== 'All') {
      const loc = recipientLocation.toLowerCase();
      const scope = gift.locationScope.toLowerCase();
      if (!scope.includes('global') && !scope.includes(loc.split(',')[0].trim())) {
        return false;
      }
    }

    return true;
  });

  const handleStartCheckout = (gift: UniversalGiftItem) => {
    setSelectedGift(gift);
    setIsCheckoutOpen(true);
    setOrderComplete(false);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    setTimeout(() => {
      // simulate auto-close after 2.5s
      // setIsCheckoutOpen(false);
    }, 2500);
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
                    setRecipientLocation(member.location);
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
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                1. Who are you celebrating?
              </label>
              <input
                type="text"
                placeholder="e.g. Sister Sarah, Mama Chantal"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 2. Where are they located? */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                2. Where are they located?
              </label>
              <select
                value={recipientLocation}
                onChange={(e) => setRecipientLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '14px'
                }}
              >
                <option value="All">🌍 Everywhere (Global & Local)</option>
                <option value="Douala, Cameroon">🇨🇲 Douala, Cameroon (Local Bakeries & Flowers)</option>
                <option value="London, UK">🇬🇧 London, UK (Amazon UK, High Tea)</option>
                <option value="Toronto, Canada">🇨🇦 Toronto, Canada (BestBuy, Amazon NA)</option>
                <option value="Lagos, Nigeria">🇳🇬 Lagos, Nigeria (AfriCrafts, Gourmet)</option>
              </select>
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

          {/* Category Filter Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '16px',
            borderTop: '1px solid var(--line)'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginRight: '6px' }}>
              Gift Categories:
            </span>
            {[
              { id: 'ALL', label: 'All Curations' },
              { id: 'FLOWERS_CAKE', label: '🎂 Cakes & Florals' },
              { id: 'FASHION', label: '✨ Perfume & Jewelry' },
              { id: 'PERSONALIZED', label: '🎁 Personalized Keepsakes' },
              { id: 'EXPERIENCE', label: '🎟️ Experiences & Dining' },
              { id: 'TECH', label: '🎧 Tech & Gadgets' },
              { id: 'DIGITAL', label: '💳 Multi-Store Gift Cards' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: categoryFilter === cat.id ? 800 : 500,
                  backgroundColor: categoryFilter === cat.id ? 'var(--coral-soft)' : 'var(--bg)',
                  color: categoryFilter === cat.id ? 'var(--coral)' : 'var(--fg)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info & HBD Gives Banner */}
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
              Filtered for {recipientName ? `“${recipientName}”` : 'any celebrant'} · Delivered in {recipientLocation} · Up to ${maxBudget}
            </small>
          </div>

          {/* Philanthropy banner */}
          <div style={{
            backgroundColor: 'var(--purple-soft)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Heart size={16} color="var(--coral)" fill="var(--coral)" />
            <div style={{ fontSize: '12.5px', color: 'var(--fg)' }}>
              <b>HBD Gives:</b> Celebrate someone by helping a child celebrate too.
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={includeHbdGives} 
                onChange={(e) => setIncludeHbdGives(e.target.checked)}
                style={{ accentColor: 'var(--purple)' }}
              />
              +$5 Gift Meal
            </label>
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="var(--purple)" />
                      {gift.locationScope}
                    </span>
                    <span>
                      ⭐ {gift.rating} ({gift.reviewsCount})
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
                    Send via HBD Celebration Flow
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
                    <h3 style={{ fontSize: '19px', fontWeight: 800 }}>Orchestrate Celebration Gift</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    style={{ fontSize: '18px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
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
                      ${selectedGift.price} USD
                    </div>
                  </div>
                </div>

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
                    <span>${selectedGift.price}.00</span>
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
                      ${selectedGift.price + (includeHbdGives ? 5 : 0)}.00 USD
                    </span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
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
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={16} />
                  Authorize & Dispatch Celebration Gift
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
                  color: '#22c55e',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px'
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                  Celebration Gift Dispatched!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  HBD has routed this order to <b>{selectedGift.providerName}</b>. Your celebrant ({recipientName}) will receive their surprise with your custom message!
                </p>
                <div style={{
                  backgroundColor: 'var(--bg)',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--muted)',
                  marginBottom: '20px'
                }}>
                  Tracking Code: <b>HBD-GIFT-{Math.floor(100000 + Math.random() * 900000)}</b>
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
