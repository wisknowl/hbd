import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Gift, 
  Archive, 
  PlusSquare,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  Radio,
  Package
} from 'lucide-react';

export type NavViewType = 'explore' | 'foryou' | 'hbdays' | 'gifts' | 'rooms' | 'vault' | 'packages';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView: NavViewType;
  setActiveView: (view: NavViewType) => void;
  onSearch: (query: string) => void;
  openPlanner: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeView,
  setActiveView,
  onSearch,
  openPlanner,
  isDark,
  toggleTheme,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'foryou', label: 'For You', icon: Home },
    { id: 'hbdays', label: 'HBDays', icon: Calendar },
    { id: 'gifts', label: 'Universal Gifts', icon: Gift },
    { id: 'rooms', label: 'Celebration Rooms', icon: Radio },
    { id: 'vault', label: 'Memory Vault', icon: Archive },
    { id: 'packages', label: 'Bespoke Packages', icon: Package },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isCollapsed ? '76px' : '290px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid var(--line)',
        backgroundColor: 'var(--card)',
        padding: isCollapsed ? '16px 8px' : '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        transition: 'width 0.22s cubic-bezier(0.2, 0, 0, 1), padding 0.22s ease',
        zIndex: 100
      }}
    >
      {/* Top Section: Logo, Collapse Button, Search Bar, Navigation Links */}
      <div>
        {/* Reappearing Expand Button at the very top on hover when collapsed */}
        {isCollapsed && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transform: isHovered ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}>
            <button
              onClick={onToggleCollapse}
              title="Expand sidebar"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'var(--bg)',
                color: 'var(--purple)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        {/* Brand Logo Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: '20px',
          gap: '8px'
        }}>
          {/* Logo Mark + Text (when expanded) */}
          <div 
            onClick={() => setActiveView('explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--purple)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--cream)',
              fontFamily: 'Poppins',
              fontWeight: 900,
              fontSize: '14px',
              flexShrink: 0,
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

            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '130px' }}>
                <span style={{
                  fontFamily: 'Poppins',
                  fontWeight: 800,
                  fontSize: '17px',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: 'var(--fg)',
                  whiteSpace: 'nowrap'
                }}>
                  HBD <span style={{ color: 'var(--purple)' }}>Foundation</span>
                </span>
                <small style={{
                  fontSize: '8px',
                  letterSpacing: '1.2px',
                  fontWeight: 800,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                  whiteSpace: 'nowrap'
                }}>
                  Celebrate What Matters
                </small>
              </div>
            )}
          </div>

          {/* Toggle Sidebar Button (Shown in row only when expanded) */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse to icons only"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'var(--bg)',
                color: 'var(--muted)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--purple)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {/* Search Bar under the Logo (When Expanded) */}
        {!isCollapsed ? (
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              padding: '0 12px',
              height: '38px',
              marginBottom: '18px',
              transition: 'border 0.15s'
            }}
          >
            <Search size={15} color="var(--muted)" style={{ marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search celebrations..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch(e.target.value);
              }}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '13px',
                color: 'var(--fg)'
              }}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('');
                  onSearch('');
                }}
                style={{ color: 'var(--muted)', fontSize: '13px', padding: '0 4px' }}
              >
                ×
              </button>
            )}
          </form>
        ) : (
          /* Collapsed Search Icon trigger */
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <button
              onClick={onToggleCollapse}
              title="Search"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'var(--bg)',
                color: 'var(--muted)'
              }}
            >
              <Search size={18} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div style={{ display: 'grid', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: '14px',
                  padding: isCollapsed ? '12px' : '12px 14px',
                  borderRadius: '14px',
                  fontSize: '14.5px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--coral)' : 'var(--fg)',
                  backgroundColor: isActive ? 'var(--coral-soft)' : 'transparent',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={21} color={isActive ? 'var(--coral)' : 'currentColor'} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          <div style={{ height: '1px', backgroundColor: 'var(--line)', margin: '10px 4px' }} />

          {/* Plan Celebration CTA */}
          <button
            onClick={openPlanner}
            title={isCollapsed ? 'Plan a Celebration' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '14px',
              padding: isCollapsed ? '12px' : '12px 14px',
              borderRadius: '14px',
              fontSize: '14.5px',
              fontWeight: 700,
              color: 'var(--purple)',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <PlusSquare size={21} color="var(--purple)" style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Plan Celebration</span>}
          </button>
        </div>
      </div>

      {/* Bottom Section: Theme Toggle, Log In, and Footer */}
      <div>
        {/* Theme switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '8px 0' : '8px 4px',
          marginBottom: '10px'
        }}>
          {!isCollapsed && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
              Appearance
            </span>
          )}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'var(--bg)',
              color: 'var(--fg)',
              cursor: 'pointer'
            }}
          >
            {isDark ? <Sun size={15} color="var(--gold)" /> : <Moon size={15} />}
          </button>
        </div>

        {/* Log in CTA (Expanded only) */}
        {!isCollapsed ? (
          <div style={{
            backgroundColor: 'var(--bg)',
            borderRadius: '16px',
            padding: '14px',
            border: '1px solid var(--line)',
            marginBottom: '14px'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4, marginBottom: '10px' }}>
              Log in to celebrate friends, bookmark milestones, and cheer with confetti.
            </p>
            <button
              onClick={openPlanner}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '999px',
                backgroundColor: 'var(--coral)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={13} />
              Log in
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <button
              onClick={openPlanner}
              title="Log in"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--coral)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 10px rgba(255, 107, 107, 0.3)'
              }}
            >
              <Sparkles size={16} />
            </button>
          </div>
        )}

        {/* Footer info (Expanded only) */}
        {!isCollapsed && (
          <div style={{
            fontSize: '10.5px',
            color: 'var(--muted)',
            lineHeight: 1.5,
            padding: '0 4px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <span style={{ cursor: 'pointer' }}>About</span>
              <span style={{ cursor: 'pointer' }}>Mission</span>
              <span style={{ cursor: 'pointer' }}>Corporate</span>
              <span style={{ cursor: 'pointer' }}>Terms</span>
            </div>
            <div>© 2026 HBD Foundation</div>
          </div>
        )}
      </div>
    </aside>
  );
};
