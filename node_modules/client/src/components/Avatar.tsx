import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { initialsOf } from '../lib/social';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  ring?: string;
  verified?: boolean;
}

/** Profile photo with an initials fallback (new users may skip the photo step). */
export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 44, ring, verified }) => (
  <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
    {src ? (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: ring ? `2px solid ${ring}` : undefined,
        }}
      />
    ) : (
      <div
        aria-label={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, var(--purple), var(--coral))',
          color: '#fff',
          fontWeight: 800,
          fontSize: size * 0.36,
          fontFamily: 'Poppins, sans-serif',
          border: ring ? `2px solid ${ring}` : undefined,
        }}
      >
        {initialsOf(name) || '🎂'}
      </div>
    )}
    {verified && (
      <BadgeCheck
        size={Math.max(14, size * 0.32)}
        color="#fff"
        fill="var(--purple)"
        style={{ position: 'absolute', right: -2, bottom: -2 }}
      />
    )}
  </div>
);
