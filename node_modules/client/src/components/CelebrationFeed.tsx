import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart,
  MessageCircle, 
  Bookmark, 
  Share2, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Gift,
  Award
} from 'lucide-react';
import type { ReelPost } from '../../../shared/types';

interface CelebrationFeedProps {
  reels: ReelPost[];
  onCheer: (id: string) => void;
  onOpenPlannerForReel: (reel: ReelPost) => void;
}

export const CelebrationFeed: React.FC<CelebrationFeedProps> = ({
  reels,
  onCheer,
  onOpenPlannerForReel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});

  const currentReel = reels[currentIndex] || reels[0];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleSave = (id: string) => {
    setSavedReels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerCheerConfetti = (e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#5B2A86', '#F4B942', '#FF6B6B', '#FFF8EE']
      });
    } else {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#5B2A86', '#F4B942', '#FF6B6B']
      });
    }
    if (currentReel) {
      onCheer(currentReel.id);
    }
  };

  if (!currentReel) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No celebrations available.</div>;
  }

  const isSaved = !!savedReels[currentReel.id];

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '16px 24px',
      overflow: 'hidden'
    }}>
      {/* Centered Reel Container + Right Action Rail */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '20px',
        maxHeight: 'calc(100vh - 40px)'
      }}>
        {/* Main Vertical Reel (Fits Viewport Height) */}
        <div style={{
          height: 'min(calc(100vh - 48px), 760px)',
          aspectRatio: '9 / 16',
          borderRadius: '18px',
          overflow: 'hidden',
          backgroundColor: '#000',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Media Player */}
          <img
            src={currentReel.mediaUrl}
            alt={currentReel.caption}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Top Badge */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {currentReel.celebrationBadge && (
              <div style={{
                backgroundColor: 'rgba(91, 42, 134, 0.85)',
                color: 'var(--cream)',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(244, 185, 66, 0.4)'
              }}>
                <Award size={12} color="var(--gold)" />
                {currentReel.celebrationBadge}
              </div>
            )}
          </div>

          {/* Bottom Caption Overlay */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '20px 18px 18px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
            color: '#fff'
          }}>
            {/* Creator Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>
                {currentReel.user.fullName.toUpperCase()}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                @{currentReel.user.handle}
              </span>
            </div>

            {/* Caption */}
            <p style={{
              fontSize: '13px',
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '10px'
            }}>
              {currentReel.caption}
            </p>

            {/* Audio Track */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--gold)',
              fontWeight: 600
            }}>
              <Music size={13} />
              <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentReel.audioTrack}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Rail (Exactly matching TikTok Desktop Screenshot 1) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '8px'
        }}>
          {/* Creator Avatar with follow plus badge */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <img
              src={currentReel.user.avatarUrl}
              alt={currentReel.user.fullName}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid #fff',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'var(--coral)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '13px',
              fontWeight: 900
            }}>
              +
            </div>
          </div>

          {/* Cheer / Heart Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={triggerCheerConfetti}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: currentReel.isCheered ? 'var(--coral)' : 'var(--card)',
                color: currentReel.isCheered ? '#fff' : 'var(--fg)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s'
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Heart size={22} fill={currentReel.isCheered ? 'currentColor' : 'none'} color={currentReel.isCheered ? '#fff' : 'currentColor'} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px', color: 'var(--fg)' }}>
              {(currentReel.cheerCount / 1000).toFixed(1)}K
            </span>
          </div>

          {/* Comments */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--card)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <MessageCircle size={22} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px', color: 'var(--fg)' }}>
              {currentReel.commentCount}
            </span>
          </div>

          {/* Bookmark / Save */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => toggleSave(currentReel.id)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: isSaved ? 'var(--gold)' : 'var(--card)',
                color: isSaved ? 'var(--char)' : 'var(--fg)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px', color: 'var(--fg)' }}>
              {isSaved ? 'Saved' : 'Save'}
            </span>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: currentReel.caption, url: window.location.href });
                } else {
                  alert('Celebration link copied!');
                }
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--card)',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Share2 size={20} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px', color: 'var(--fg)' }}>
              {currentReel.shareCount}
            </span>
          </div>

          {/* Gift Surprise */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => onOpenPlannerForReel(currentReel)}
              title="Send a gift or surprise for this moment"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                color: 'var(--char)',
                border: 'none',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 12px rgba(244, 185, 66, 0.4)'
              }}
            >
              <Gift size={20} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 800, marginTop: '4px', color: 'var(--gold)' }}>
              Gift
            </span>
          </div>

          {/* Spinning Music Disc (TikTok Signature) */}
          <div style={{ marginTop: '4px' }}>
            <div 
              className="spin-disc"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#111',
                border: '4px solid #202124',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src={currentReel.user.avatarUrl}
                alt="music"
                style={{ width: '22px', height: '22px', borderRadius: '50%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Up / Down Navigation Controls (Far Right, TikTok Desktop) */}
      <div style={{
        position: 'absolute',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Previous celebration"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow-sm)',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.35 : 1,
            color: 'var(--fg)'
          }}
        >
          <ChevronUp size={20} />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          title="Next celebration"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--shadow-sm)',
            cursor: currentIndex === reels.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === reels.length - 1 ? 0.35 : 1,
            color: 'var(--fg)'
          }}
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};
