import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import type { CelebrationCategory, PackageTier } from '../../../shared/types';

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CelebrationCategory;
  initialName?: string;
  onCelebrationBooked: (booking: any) => void;
}

export const PlannerModal: React.FC<PlannerModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  initialName,
  onCelebrationBooked,
}) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<CelebrationCategory>(initialCategory || 'BIRTHDAY');
  const [celebrantName, setCelebrantName] = useState(initialName || '');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('Douala, Cameroon');
  const [tier, setTier] = useState<PackageTier>('CLASSIC');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Custom Cake', 'Flowers']);
  const [notes, setNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('+237 699 00 00 00');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!isOpen) return null;

  const categories: { id: CelebrationCategory; title: string; desc: string; icon: string }[] = [
    { id: 'BIRTHDAY', title: 'A Person', desc: 'Birthdays & lives worth honoring', icon: '🎂' },
    { id: 'BEGINNING', title: 'A Beginning', desc: 'Startup, product, idea or movement', icon: '🚀' },
    { id: 'MILESTONE', title: 'A Milestone', desc: 'Achievement, promotion, 1M users', icon: '🏆' },
    { id: 'ANNIVERSARY', title: 'An Anniversary', desc: 'Years of love, company or legacy', icon: '📅' },
    { id: 'COMMUNITY', title: 'Community Hero', desc: 'Someone who deserves to be seen', icon: '❤️' }
  ];

  const packages: { id: PackageTier; name: string; price: string; desc: string }[] = [
    { id: 'MINI', name: 'HBD Mini', price: 'From $45', desc: 'Digital card, treats, message, delivery' },
    { id: 'CLASSIC', name: 'HBD Classic', price: 'From $150', desc: 'Cake, gift, flowers, balloons, photo capture' },
    { id: 'PREMIUM', name: 'HBD Premium', price: 'From $490', desc: 'Decor, video, live music, surprise orchestration' },
    { id: 'SIGNATURE', name: 'HBD Signature', price: 'VIP Quote', desc: 'Full event production, private venue, chef' },
    { id: 'GLOBAL', name: 'HBD Global', price: 'Cross-Border', desc: 'Celebrate someone across continents & cities' }
  ];

  const addonOptions = [
    'Custom Cake',
    'Fresh Flowers Bouquet',
    'Surprise Acoustic Singer',
    'Professional Videographer',
    'Digital Memory Vault Link',
    'Customized Video Compilation'
  ];

  const toggleAddon = (item: string) => {
    setSelectedAddons(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (step === 1 && !celebrantName) {
      alert('Please enter who or what we are celebrating.');
      return;
    }
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      submitBooking();
    }
  };

  const submitBooking = () => {
    const id = `HBD-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(id);
    setIsSuccess(true);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#5B2A86', '#F4B942', '#FF6B6B']
    });

    onCelebrationBooked({
      id,
      category,
      celebrantName,
      date,
      location,
      tier,
      selectedAddons,
      notes,
      contactPhone
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(20, 14, 28, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 200,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: '28px',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '32px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        border: '1px solid var(--line)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--muted)'
          }}
        >
          <X size={18} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                color: 'var(--purple)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} color="var(--gold)" />
                HBD Celebration Concierge · Step {step} of 3
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '6px' }}>
                {step === 1 && "What are you celebrating?"}
                {step === 2 && "Choose your celebration scale"}
                {step === 3 && "Add touches & coordinate"}
              </h2>
            </div>

            {/* Step 1: Type & Who */}
            {step === 1 && (
              <div style={{ display: 'grid', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: '14px 12px',
                        borderRadius: '16px',
                        border: '2px solid',
                        borderColor: category === c.id ? 'var(--purple)' : 'var(--line)',
                        backgroundColor: category === c.id ? 'var(--purple-soft)' : 'var(--bg)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.icon}</div>
                      <b style={{ fontSize: '13px', display: 'block', color: 'var(--fg)' }}>{c.title}</b>
                      <small style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>{c.desc}</small>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                      Who or what is being celebrated?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mama Chantal, Kaba Studio, 1M users milestone..."
                      value={celebrantName}
                      onChange={(e) => setCelebrantName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        borderRadius: '14px',
                        border: '1.5px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                        Date of celebration
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid var(--line)',
                          backgroundColor: 'var(--bg)',
                          color: 'var(--fg)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Douala, Yaoundé, London"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid var(--line)',
                          backgroundColor: 'var(--bg)',
                          color: 'var(--fg)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Packages */}
            {step === 2 && (
              <div style={{ display: 'grid', gap: '12px' }}>
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setTier(pkg.id)}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '18px',
                      border: '2px solid',
                      borderColor: tier === pkg.id ? 'var(--purple)' : 'var(--line)',
                      backgroundColor: tier === pkg.id ? 'var(--purple-soft)' : 'var(--bg)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <b style={{ fontSize: '15px', color: 'var(--fg)' }}>{pkg.name}</b>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0 0' }}>{pkg.desc}</p>
                    </div>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '13px',
                      color: 'var(--purple)',
                      backgroundColor: 'var(--card)',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: '1px solid var(--line)'
                    }}>
                      {pkg.price}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Addons & Contact */}
            {step === 3 && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    Select specific experiences or gifts:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {addonOptions.map((addon) => {
                      const isChecked = selectedAddons.includes(addon);
                      return (
                        <button
                          key={addon}
                          onClick={() => toggleAddon(addon)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1.5px solid',
                            borderColor: isChecked ? 'var(--gold)' : 'var(--line)',
                            backgroundColor: isChecked ? 'var(--gold)' : 'var(--bg)',
                            color: isChecked ? 'var(--char)' : 'var(--fg)',
                            cursor: 'pointer'
                          }}
                        >
                          {isChecked ? '✓ ' : '+ '} {addon}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                    WhatsApp or Phone (for coordination updates)
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                    Special instructions or emotional surprise details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. She loves white lilies and classical violin; we want to surprise her at noon..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              {step > 1 ? (
                <button
                  onClick={() => setStep(prev => prev - 1)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '999px',
                    border: '1px solid var(--line)',
                    color: 'var(--muted)',
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                >
                  Back
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--purple)',
                  color: 'var(--cream)',
                  padding: '13px 26px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: '0 8px 20px rgba(91, 42, 134, 0.25)'
                }}
              >
                {step === 3 ? 'Create My Celebration' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--purple-soft)',
              color: 'var(--purple)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} color="var(--purple)" />
            </div>

            <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '12px', letterSpacing: '1px' }}>
              CELEBRATION CONFIRMED · {bookingId}
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 12px' }}>
              Let’s celebrate {celebrantName}!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Your request for <b>{tier} Experience</b> in <b>{location}</b> has been received. An HBD Celebration Specialist is now designing your moment.
            </p>

            <div style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'left',
              marginBottom: '24px',
              fontSize: '13px',
              display: 'grid',
              gap: '6px'
            }}>
              <div><b>Type:</b> {category}</div>
              <div><b>Addons:</b> {selectedAddons.join(', ')}</div>
              <div><b>Contact:</b> {contactPhone}</div>
              <div><b>Expected Concierge Contact:</b> Within 2 hours on WhatsApp</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/237699000000?text=Hello%20HBD%20Foundation,%20I%20just%20submitted%20celebration%20request%20${bookingId}%20for%20${celebrantName}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '13px'
                }}
              >
                <MessageSquare size={16} />
                Open WhatsApp Concierge
              </a>

              <button
                onClick={onClose}
                style={{
                  padding: '12px 22px',
                  borderRadius: '999px',
                  border: '1px solid var(--line)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--fg)'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
