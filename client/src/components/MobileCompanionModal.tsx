import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  QrCode, 
  Sparkles, 
  Film, 
  MessageSquare, 
  Gift, 
  Copy, 
  Check
} from 'lucide-react';

interface MobileCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const metroCommand = 'cd mobile && npm start';

  const handleCopy = () => {
    navigator.clipboard.writeText(metroCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 20, 28, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--card)',
          borderRadius: '24px',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Header Banner */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(91, 42, 134, 0.08) 0%, rgba(244, 185, 66, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: 'var(--purple)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--gold)',
              boxShadow: '0 6px 16px rgba(91, 42, 134, 0.25)'
            }}>
              <Smartphone size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--purple)', margin: 0 }}>
                  HBD Mobile Companion
                </h3>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--gold)',
                  color: '#202124',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Expo React Native
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px', margin: 0 }}>
                Experience celebration reels, mobile messages, and doorstep alerts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'var(--bg)',
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--fg)';
              e.currentTarget.style.backgroundColor = 'var(--line)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.backgroundColor = 'var(--bg)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Connect Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            gap: '20px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--line)',
            alignItems: 'center'
          }}>
            {/* Visual QR Simulator */}
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--line)',
              position: 'relative'
            }}>
              <QrCode size={100} color="#202124" strokeWidth={1.6} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: 'var(--purple)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '10px'
              }}>
                HBD
              </div>
            </div>

            {/* Launch Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--gold)" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--fg)' }}>
                  Launch in 2 seconds on your device:
                </span>
              </div>
              <ol style={{ 
                margin: 0, 
                paddingLeft: '18px', 
                fontSize: '12.5px', 
                color: 'var(--muted)', 
                lineHeight: 1.5 
              }}>
                <li>Open <strong>Expo Go</strong> on iOS or Android.</li>
                <li>Scan the QR code or run Metro in your terminal.</li>
                <li>Browse reels, test doorstep gifts & real-time messaging.</li>
              </ol>

              {/* Copy Terminal Snippet */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--card)',
                border: '1px solid var(--line)',
                marginTop: '4px'
              }}>
                <code style={{ fontSize: '11.5px', color: 'var(--purple)', fontFamily: 'monospace', fontWeight: 700 }}>
                  {metroCommand}
                </code>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: copied ? 'var(--emerald)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Key Mobile Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={16} color="var(--purple)" />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Full Reels</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
                Gestural feeds with original African horns & audio toasts.
              </span>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="var(--coral)" />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Messages</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
                Private celebration circles & RSVP coordination.
              </span>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gift size={16} color="var(--gold)" />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Doorstep Hub</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
                Live celebration courier delivery and stream link.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
            Directory: <code style={{ color: 'var(--fg)' }}>HBD-FOUNDATION/mobile</code>
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: 'var(--purple)',
              color: '#FFF8EE',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
