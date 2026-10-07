import React from 'react';
import { Check, Globe2, Crown, Gem, Gift, Heart } from 'lucide-react';
import type { CelebrationPackage, PackageTier } from '../../../shared/types';

interface PackagesSectionProps {
  packages: CelebrationPackage[];
  onSelectPackage: (tier: PackageTier) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onSelectPackage,
}) => {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gap: '36px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          color: 'var(--purple)',
          fontWeight: 800,
          fontSize: '12px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Celebration As A Service
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          From simple moments to grand productions.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', marginTop: '12px' }}>
          One brand orchestrating bakers, florists, videographers, and musicians behind the scenes so your experience is seamless.
        </p>
      </div>

      {/* Packages Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {packages.map((pkg) => {
          const isFeatured = pkg.isFeatured;
          return (
            <div
              key={pkg.tier}
              style={{
                backgroundColor: isFeatured ? 'var(--purple)' : 'var(--card)',
                color: isFeatured ? 'var(--cream)' : 'var(--fg)',
                borderRadius: '26px',
                padding: '30px 24px',
                border: isFeatured ? 'none' : '1px solid var(--line)',
                boxShadow: isFeatured ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: isFeatured ? 'scale(1.02)' : 'none',
                transition: 'transform 0.2s'
              }}
            >
              {pkg.badge && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: isFeatured ? 'var(--gold)' : 'var(--purple-soft)',
                  color: isFeatured ? 'var(--char)' : 'var(--purple)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {pkg.badge}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {pkg.tier === 'MINI' && <Gift size={20} color="var(--gold)" />}
                  {pkg.tier === 'CLASSIC' && <Heart size={20} color="var(--gold)" />}
                  {pkg.tier === 'PREMIUM' && <Gem size={20} color="var(--gold)" />}
                  {pkg.tier === 'SIGNATURE' && <Crown size={20} color="var(--gold)" />}
                  {pkg.tier === 'GLOBAL' && <Globe2 size={20} color="var(--gold)" />}
                  <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{pkg.title}</h3>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: isFeatured ? 'rgba(255, 248, 238, 0.85)' : 'var(--muted)',
                  marginBottom: '18px'
                }}>
                  {pkg.tagline}
                </p>

                <div style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  fontFamily: 'Poppins',
                  marginBottom: '22px',
                  color: isFeatured ? 'var(--gold)' : 'var(--purple)'
                }}>
                  {pkg.priceLabel}
                </div>

                <ul style={{
                  listStyle: 'none',
                  display: 'grid',
                  gap: '12px',
                  fontSize: '13px',
                  marginBottom: '28px'
                }}>
                  {pkg.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ opacity: isFeatured ? 0.95 : 0.85 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPackage(pkg.tier)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: isFeatured ? 'var(--gold)' : 'var(--purple)',
                  color: isFeatured ? 'var(--char)' : 'var(--cream)',
                  boxShadow: isFeatured ? '0 6px 18px rgba(244, 185, 66, 0.35)' : 'none',
                  border: 'none',
                  transition: 'transform 0.15s'
                }}
              >
                Choose {pkg.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
