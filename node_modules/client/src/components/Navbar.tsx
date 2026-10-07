import React from 'react';
import { Sparkles, Sun, Moon, Calendar, Gift, Film, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'reminders' | 'packages' | 'vault';
  setActiveTab: (tab: 'feed' | 'reminders' | 'packages' | 'vault') => void;
  openPlanner: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openPlanner,
  isDark,
  toggleTheme,
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--card)',
      borderBottom: '1px solid var(--line)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('feed')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'var(--purple)',
            color: 'var(--cream)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: '15px',
            boxShadow: '0 8px 18px rgba(91, 42, 134, 0.25)',
            position: 'relative'
          }}>
            HBD
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--gold)',
              boxShadow: '0 0 6px var(--gold)'
            }} />
          </div>
          <div>
            <div style={{ 
              fontFamily: 'Poppins', 
              fontWeight: 800, 
              fontSize: '20px', 
              lineHeight: 1.1,
              letterSpacing: '-0.03em'
            }}>
              HBD <span style={{ color: 'var(--purple)' }}>Foundation</span>
            </div>
            <small style={{ 
              display: 'block', 
              fontSize: '9px', 
              letterSpacing: '1.5px', 
              fontWeight: 700, 
              color: 'var(--muted)',
              textTransform: 'uppercase'
            }}>
              Celebrate What Matters
            </small>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: 'var(--bg)',
          padding: '5px',
          borderRadius: '999px',
          border: '1px solid var(--line)'
        }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: activeTab === 'feed' ? 'var(--cream)' : 'var(--muted)',
              background: activeTab === 'feed' ? 'var(--purple)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Film size={16} />
            Celebration Reel
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: activeTab === 'reminders' ? 'var(--cream)' : 'var(--muted)',
              background: activeTab === 'reminders' ? 'var(--purple)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} />
            Dates & Circles
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: activeTab === 'packages' ? 'var(--cream)' : 'var(--muted)',
              background: activeTab === 'packages' ? 'var(--purple)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Gift size={16} />
            Packages
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: activeTab === 'vault' ? 'var(--cream)' : 'var(--muted)',
              background: activeTab === 'vault' ? 'var(--purple)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Compass size={16} />
            Memory Vault
          </button>
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--fg)',
              background: 'var(--card)'
            }}
          >
            {isDark ? <Sun size={18} color="var(--gold)" /> : <Moon size={18} />}
          </button>

          <button
            onClick={openPlanner}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--gold) 0%, #f7c866 100%)',
              color: 'var(--char)',
              fontWeight: 800,
              fontSize: '14px',
              padding: '12px 22px',
              borderRadius: '999px',
              boxShadow: '0 6px 18px rgba(244, 185, 66, 0.35)',
              transition: 'transform 0.15s'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Sparkles size={16} />
            Plan a Celebration
          </button>
        </div>
      </div>
    </header>
  );
};
