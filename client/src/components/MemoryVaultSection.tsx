import React from 'react';
import { Archive, Play } from 'lucide-react';

export const MemoryVaultSection: React.FC = () => {
  const archives = [
    {
      id: 'mv-1',
      title: 'Mama Chantal’s 60th Golden Jubilee',
      date: 'October 2026 · Douala',
      category: 'BIRTHDAY',
      cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      mediaCount: '34 photos · 4 videos',
      quote: '“I felt the love from three continents in one room.”'
    },
    {
      id: 'mv-2',
      title: 'The Birth of PaySeed Tech',
      date: 'Launch Day · Lagos',
      category: 'BEGINNING',
      cover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
      mediaCount: '12 photos · 1 tribute film',
      quote: '“Our first transaction processed at 9:14 AM. The dream became real.”'
    },
    {
      id: 'mv-3',
      title: 'Amina & Tariq: 20 Years Together',
      date: 'November 2026 · London & Douala',
      category: 'ANNIVERSARY',
      cover: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      mediaCount: '58 photos · 2 interviews',
      quote: '“Two decades of resilience, laughter, and building a family.”'
    }
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gap: '32px'
    }}>
      {/* Manifesto Vault Header */}
      <div style={{
        background: 'linear-gradient(135deg, #20132b 0%, #150920 100%)',
        color: 'var(--cream)',
        borderRadius: '28px',
        padding: '36px',
        border: '1px solid var(--line)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--gold)',
          fontWeight: 800,
          fontSize: '11px',
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Archive size={14} />
          HBD Memory Vault
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', maxWidth: '640px' }}>
          Important moments deserve to be remembered forever.
        </h1>

        <p style={{
          color: 'rgba(255, 248, 238, 0.8)',
          fontSize: '15px',
          maxWidth: '580px',
          marginTop: '12px',
          lineHeight: 1.6
        }}>
          Celebration doesn’t end when the cake is cut. The Memory Vault is a permanent digital sanctuary for your milestone photos, video tributes, and letters so your legacy endures.
        </p>

        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          borderLeft: '4px solid var(--gold)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0 14px 14px 0',
          fontStyle: 'italic',
          fontSize: '14px',
          color: 'var(--gold)'
        }}>
          “Birth is the beginning. Life is the journey. Milestones are the memories. Celebration is how we remember that it mattered.”
        </div>
      </div>

      {/* Vault Chapters */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Your Celebration Archives</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {archives.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '170px' }}>
                <img
                  src={item.cover}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(91, 42, 134, 0.85)',
                  color: 'var(--cream)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  {item.category}
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  {item.mediaCount}
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <small style={{ color: 'var(--muted)', fontSize: '11px', fontWeight: 700 }}>{item.date}</small>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>{item.title}</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', fontStyle: 'italic', marginTop: '8px' }}>
                    {item.quote}
                  </p>
                </div>

                <button
                  style={{
                    marginTop: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--purple)',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  <Play size={14} /> Open Celebration Vault →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
