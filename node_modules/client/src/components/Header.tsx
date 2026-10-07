import React, { useState } from 'react';
import { Search, Sparkles, Sun, Moon, Plus } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  openPlanner: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  openPlanner,
  isDark,
  toggleTheme,
  onLogoClick,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header style={{
      height: '60px',
      backgroundColor: 'var(--card)',
      borderBottom: '1px solid var(--line)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand Logo matching TikTok's top-left branding */}
      <div 
        onClick={onLogoClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          backgroundColor: 'var(--purple)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--cream)',
          fontFamily: 'Poppins',
          fontWeight: 900,
          fontSize: '13px',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(91, 42, 134, 0.25)'
        }}>
          HBD
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold)',
            boxShadow: '0 0 6px var(--gold)'
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'Poppins',
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>
            HBD <span style={{ color: 'var(--purple)' }}>Foundation</span>
          </span>
          <small style={{
            fontSize: '8px',
            letterSpacing: '1.4px',
            fontWeight: 800,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}>
            Celebrate What Matters
          </small>
        </div>
      </div>

      {/* TikTok-style Center Search Bar */}
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg)',
          borderRadius: '999px',
          border: '1px solid var(--line)',
          padding: '0 16px',
          width: 'min(420px, 38vw)',
          height: '40px',
          transition: 'all 0.2s'
        }}
      >
        <Search size={17} color="var(--muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search celebrations, people, milestones..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '13.5px',
            color: 'var(--fg)'
          }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            style={{ color: 'var(--muted)', fontSize: '14px', padding: '0 4px' }}
          >
            ×
          </button>
        )}
      </form>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'var(--bg)',
            color: 'var(--fg)'
          }}
        >
          {isDark ? <Sun size={17} color="var(--gold)" /> : <Moon size={17} />}
        </button>

        {/* Plan a Celebration CTA */}
        <button
          onClick={openPlanner}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg)',
            border: '1.5px solid var(--line)',
            color: 'var(--fg)',
            fontWeight: 700,
            fontSize: '13px',
            padding: '8px 16px',
            borderRadius: '999px',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--purple)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
        >
          <Plus size={16} color="var(--purple)" />
          Plan Celebration
        </button>

        {/* TikTok-style Coral / Red Log In Button */}
        <button
          onClick={openPlanner}
          style={{
            backgroundColor: 'var(--coral)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '13px',
            padding: '9px 22px',
            borderRadius: '999px',
            boxShadow: '0 4px 14px rgba(255, 107, 107, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} />
          Log in
        </button>
      </div>
    </header>
  );
};
