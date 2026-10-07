import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import type { ReelPost } from '../../../shared/types';

interface ExploreGridProps {
  reels: ReelPost[];
  onSelectReel: (reel: ReelPost) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({
  reels,
  onSelectReel,
}) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { key: 'ALL', label: 'All' },
    { key: 'BIRTHDAY', label: 'People & Birthdays' },
    { key: 'BEGINNING', label: 'Beginnings & Startups' },
    { key: 'MILESTONE', label: 'Milestones & Triumphs' },
    { key: 'ANNIVERSARY', label: 'Anniversaries' },
    { key: 'COMMUNITY', label: 'Community Heroes' },
    { key: 'GLOBAL', label: 'Global Surprises' }
  ];

  const filtered = activeCategory === 'ALL'
    ? reels
    : reels.filter(r => r.category === activeCategory);

  const featured = filtered[0] || reels[0];
  const gridItems = filtered.length > 1 ? filtered.slice(1) : reels;

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      padding: '24px 32px'
    }}>
      {/* Top Horizontal Category Pills (Screenshot 2: tiktok.com/explore) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '20px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--line)',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13.5px',
                fontWeight: isActive ? 800 : 600,
                backgroundColor: isActive ? 'var(--char)' : 'var(--bg)',
                color: isActive ? 'var(--cream)' : 'var(--fg)',
                border: '1px solid',
                borderColor: isActive ? 'var(--char)' : 'var(--line)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Explore Layout: Hero Feature + Grid Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Large Featured Card (matches big animal/landscape video on Screenshot 2) */}
        {featured && (
          <div 
            onClick={() => onSelectReel(featured)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gridColumn: '1 / 2'
            }}
          >
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#000',
              aspectRatio: '16 / 10',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={featured.mediaUrl}
                alt={featured.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                textShadow: '0 1px 4px rgba(0,0,0,0.8)'
              }}>
                <Heart size={15} fill="#fff" color="#fff" />
                <span>{featured.cheerCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Creator Tag under featured video */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <img
                src={featured.user.avatarUrl}
                alt={featured.user.fullName}
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--fg)' }}>
                {featured.user.fullName}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                @{featured.user.handle}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.4 }}>
              {featured.caption}
            </p>
          </div>
        )}

        {/* Multi-Card Grid Items (matching right-side cards in Screenshot 2) */}
        {gridItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectReel(item)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#000',
              aspectRatio: '4 / 3',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={item.mediaUrl}
                alt={item.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                textShadow: '0 1px 4px rgba(0,0,0,0.8)'
              }}>
                <Heart size={13} fill="#fff" color="#fff" />
                <span>{(item.cheerCount / 1000).toFixed(1)}K</span>
              </div>
            </div>

            {/* Creator Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px' }}>
              <img
                src={item.user.avatarUrl}
                alt={item.user.fullName}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.user.fullName}
              </span>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--muted)',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
