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
import { MessagesView } from './components/MessagesView';
import { SurprisePackageView } from './components/SurprisePackageView';
import { TopFloatingBar } from './components/TopFloatingBar';
import { ActivityDrawer } from './components/ActivityDrawer';
import { MobileCompanionModal } from './components/MobileCompanionModal';
import { useSession } from './session';
import { mockReels, mockPackages } from './mockData';
import type { ReelPost, CelebrationCategory, PersonCircleMember } from '../../shared/types';

const VALID_VIEWS: Record<string, NavViewType> = {
  '': 'explore',
  'explore': 'explore',
  'foryou': 'foryou',
  'feed': 'foryou',
  'hbdays': 'hbdays',
  'dates': 'hbdays',
  'calendar': 'hbdays',
  'gifts': 'gifts',
  'messages': 'messages',
  'inbox': 'messages',
  'friends': 'friends',
  'profile': 'profile',
  'rooms': 'rooms',
  'packages': 'packages',
  'vault': 'vault',
  'surprisepackage': 'surprisepackage',
  'surprise': 'surprisepackage'
};

function getRouteFromLocation(): { view: NavViewType; celebrant?: string } {
  if (typeof window === 'undefined') return { view: 'explore' };
  const rawPath = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const celebrant = searchParams.get('celebrant') || undefined;
  const view = VALID_VIEWS[rawPath] || 'explore';
  return { view, celebrant };
}

export const App: React.FC = () => {
  const { profile } = useSession();
  
  // URL-driven navigation state
  const initialRoute = getRouteFromLocation();
  const [activeView, setActiveView] = useState<NavViewType>(initialRoute.view);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [reels, setReels] = useState<ReelPost[]>(mockReels);
  const [selectedPersonForGifts, setSelectedPersonForGifts] = useState<PersonCircleMember | null>(null);
  const [selectedCelebrantForSurprise, setSelectedCelebrantForSurprise] = useState<string | undefined>(initialRoute.celebrant);

  // Synchronize browser history and URL bar with navigation
  const navigateTo = React.useCallback((view: NavViewType, options?: { celebrant?: string; replace?: boolean }) => {
    setActiveView(view);
    if (options?.celebrant !== undefined) {
      setSelectedCelebrantForSurprise(options.celebrant);
    }

    const path = view === 'explore' ? '/' : `/${view}`;
    const params = new URLSearchParams();
    if (options?.celebrant) {
      params.set('celebrant', options.celebrant);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const targetUrl = `${path}${queryString}`;

    if (options?.replace) {
      window.history.replaceState({ view }, '', targetUrl);
    } else if (window.location.pathname + window.location.search !== targetUrl) {
      window.history.pushState({ view }, '', targetUrl);
    }
  }, []);

  // Listen to browser Back and Forward button events
  useEffect(() => {
    const handlePopState = () => {
      const { view, celebrant } = getRouteFromLocation();
      setActiveView(view);
      if (celebrant) {
        setSelectedCelebrantForSurprise(celebrant);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure initial deep-link clean sync if path was root
  useEffect(() => {
    const { view } = getRouteFromLocation();
    if (view !== 'explore' && window.location.pathname === '/') {
      window.history.replaceState({ view }, '', `/${view}`);
    }
  }, []);

  // Activity drawer & Mobile companion modal states
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
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
    navigateTo('foryou');
  };

  const handleOpenGiftsForPerson = (person: PersonCircleMember) => {
    setSelectedPersonForGifts(person);
    navigateTo('gifts');
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
      navigateTo('explore');
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
          <OnboardingView onComplete={() => navigateTo('explore')} />
        </div>
      ) : (
        <>
          {/* Expanded / Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        activeView={activeView}
        setActiveView={navigateTo}
        onSearch={handleSearch}
        openPlanner={() => handleOpenPlanner('BIRTHDAY', '')}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onToggleActivity={() => setIsActivityOpen(prev => !prev)}
        isActivityOpen={isActivityOpen}
      />

      {/* Top Right Floating Control Capsule (Activity, Mobile Companion, Profile) */}
      <TopFloatingBar
        onToggleActivity={() => setIsActivityOpen(prev => !prev)}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
        onOpenProfile={() => navigateTo('profile')}
        isActivityOpen={isActivityOpen}
        unreadCount={3}
      />

      {/* Rolled-out Left Block: Notifications & Activity with CTAs */}
      <ActivityDrawer
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        isSidebarCollapsed={isSidebarCollapsed}
        onOpenPlanner={(celebrant) => handleOpenPlanner('BIRTHDAY', celebrant || '')}
        onNavigateToGifts={() => navigateTo('gifts')}
        onNavigateToMessages={() => navigateTo('messages')}
        onNavigateToVault={() => navigateTo('vault')}
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
            onOpenSurprisePackage={(celebrant) => {
              navigateTo('surprisepackage', { celebrant });
            }}
          />
        )}

        {activeView === 'surprisepackage' && (
          <SurprisePackageView
            preselectedCelebrant={selectedCelebrantForSurprise}
            onBackToDates={() => navigateTo('hbdays')}
          />
        )}

        {(activeView === 'messages' || activeView === 'inbox') && (
          <MessagesView 
            onOpenPlanner={(name) => handleOpenPlanner('BIRTHDAY', name || '')}
            onOpenGifts={() => navigateTo('gifts')}
          />
        )}

        {activeView === 'friends' && (
          <FriendsView />
        )}

        {activeView === 'profile' && (
          <ProfileView 
            onOpenPlanner={() => handleOpenPlanner('BIRTHDAY', '')}
            onNavigateToFriends={() => navigateTo('friends')}
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
            onViewVault={() => navigateTo('vault')}
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

      {/* Mobile Companion / Expo Launcher Modal */}
      <MobileCompanionModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />

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
