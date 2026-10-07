import React, { useState, useEffect } from 'react';
import { Sidebar, type NavViewType } from './components/Sidebar';
import { CelebrationFeed } from './components/CelebrationFeed';
import { ExploreGrid } from './components/ExploreGrid';
import { PackagesSection } from './components/PackagesSection';
import { MemoryVaultSection } from './components/MemoryVaultSection';
import { PlannerModal } from './components/PlannerModal';
import { HBDaysView } from './components/HBDaysView';
import { GiftEngineView } from './components/GiftEngineView';
import { CelebrationRoomsView } from './components/CelebrationRoomsView';
import { OnboardingView } from './components/OnboardingView';
import { FriendsView } from './components/FriendsView';
import { ProfileView } from './components/ProfileView';
import { useSession } from './session';
import { mockReels, mockPackages } from './mockData';
import type { ReelPost, CelebrationCategory, PersonCircleMember } from '../../shared/types';

export const App: React.FC = () => {
  const { profile } = useSession();
  // Default landing page is Explore
  const [activeView, setActiveView] = useState<NavViewType>('explore');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [reels, setReels] = useState<ReelPost[]>(mockReels);
  const [selectedPersonForGifts, setSelectedPersonForGifts] = useState<PersonCircleMember | null>(null);
  
  // Planner modal states
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerCategory, setPlannerCategory] = useState<CelebrationCategory>('BIRTHDAY');
  const [plannerCelebrant, setPlannerCelebrant] = useState('');

  // Apply dark theme attribute to HTML root
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);

  const handleCheer = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          cheerCount: r.cheerCount + 1,
          isCheered: true
        };
      }
      return r;
    }));
  };

  const handleOpenPlanner = (category: CelebrationCategory = 'BIRTHDAY', celebrant: string = '') => {
    setPlannerCategory(category);
    setPlannerCelebrant(celebrant);
    setIsPlannerOpen(true);
  };

  const handleSelectReelFromExplore = (selected: ReelPost) => {
    setReels(prev => [selected, ...prev.filter(r => r.id !== selected.id)]);
    setActiveView('foryou');
  };

  const handleOpenGiftsForPerson = (person: PersonCircleMember) => {
    setSelectedPersonForGifts(person);
    setActiveView('gifts');
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const filtered = mockReels.filter(r => 
        r.caption.toLowerCase().includes(q) ||
        r.user.fullName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
      setReels(filtered.length ? filtered : mockReels);
      setActiveView('explore');
    } else {
      setReels(mockReels);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      backgroundColor: 'var(--bg)', 
      overflow: 'hidden' 
    }}>
      {!profile ? (
        <div style={{ width: '100%', height: '100%' }}>
          <OnboardingView onComplete={() => setActiveView('explore')} />
        </div>
      ) : (
        <>
          {/* Expanded / Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        activeView={activeView}
        setActiveView={setActiveView}
        onSearch={handleSearch}
        openPlanner={() => handleOpenPlanner('BIRTHDAY', '')}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Full-Height Content Area */}
      <main style={{ flex: 1, display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {activeView === 'explore' && (
          <ExploreGrid
            reels={reels}
            onSelectReel={handleSelectReelFromExplore}
          />
        )}

        {activeView === 'foryou' && (
          <CelebrationFeed
            reels={reels}
            onCheer={handleCheer}
            onOpenPlannerForReel={(reel) => handleOpenPlanner(reel.category, reel.user.fullName)}
          />
        )}

        {activeView === 'hbdays' && (
          <HBDaysView
            onPlanCelebration={(cat, name) => handleOpenPlanner(cat, name)}
            onOpenGiftsForPerson={handleOpenGiftsForPerson}
          />
        )}

        {activeView === 'friends' && (
          <FriendsView />
        )}

        {activeView === 'profile' && (
          <ProfileView 
            onOpenPlanner={() => handleOpenPlanner('BIRTHDAY', '')}
            onNavigateToFriends={() => setActiveView('friends')}
          />
        )}

        {activeView === 'gifts' && (
          <GiftEngineView
            initialRecipient={selectedPersonForGifts}
            onPlanCustomCelebration={(name, location) => handleOpenPlanner('BIRTHDAY', `${name} (${location})`)}
          />
        )}

        {activeView === 'rooms' && (
          <CelebrationRoomsView
            onPlanCelebration={() => handleOpenPlanner('BIRTHDAY', '')}
            onViewVault={() => setActiveView('vault')}
          />
        )}

        {activeView === 'packages' && (
          <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
            <PackagesSection
              packages={mockPackages}
              onSelectPackage={() => handleOpenPlanner('BIRTHDAY', '')}
            />
          </div>
        )}

        {activeView === 'vault' && (
          <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
            <MemoryVaultSection />
          </div>
        )}
      </main>

      {/* Celebration Planner Modal */}
      <PlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        initialCategory={plannerCategory}
        initialName={plannerCelebrant}
        onCelebrationBooked={(booking) => {
          console.log('Booked celebration request:', booking);
        }}
      />
        </>
      )}
    </div>
  );
};

export default App;
