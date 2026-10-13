import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { HBDProfile, FriendshipStatus } from '../../shared/types';
import { initialFriendships, mockPeople } from './data/people';

/**
 * Client-side session + social graph store.
 *
 * This is a stand-in for the real API: it persists to localStorage so the
 * flows survive a refresh. When the server endpoints exist, each action
 * below maps 1:1 to a request (POST /auth/signup, POST /friends/:id/request, …),
 * and the same shape will be replicated in mobile/.
 */

interface StoredAccount {
  profile: HBDProfile;
  friendships: Record<string, FriendshipStatus>;
  following: string[];
}

const ACCOUNT_KEY = 'hbd.account.v1';
const SESSION_KEY = 'hbd.session.v1';

const DEFAULT_ACCOUNT: StoredAccount = {
  profile: {
    id: 'u-samuel',
    handle: 'samuel_nd',
    fullName: 'Samuel Ndamukong',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 19,
    birthMonth: 10,
    isVerified: true,
    bio: 'Celebrating moments with family across borders.',
    preferences: {
      interests: ['Acoustic Music', 'Gourmet Treats', 'Tech'],
      giftWishes: ['Audio equipment', 'Bespoke cakes'],
      avoid: [],
      favoriteColor: '#5B2A86'
    },
    privacy: {
      birthdayVisibility: 'EVERYONE',
      showAge: false,
      preferencesVisibleToFriends: true
    }
  },
  friendships: initialFriendships,
  following: ['u-sarah', 'u-aisha']
};

function loadAccount(): StoredAccount {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount) : DEFAULT_ACCOUNT;
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

interface SessionContextValue {
  currentUser: HBDProfile | null;
  profile: HBDProfile | null;
  hasAccount: boolean;
  people: HBDProfile[];
  friendships: Record<string, FriendshipStatus>;
  following: string[];
  toast: string | null;

  statusOf: (userId: string) => FriendshipStatus;
  completeSignUp: (profile: HBDProfile, addedContactIds: string[]) => void;
  login: (profile: HBDProfile) => void;
  logIn: (contact: string) => boolean;
  logOut: () => void;
  updateProfile: (patch: Partial<HBDProfile>) => void;

  sendFriendRequest: (userId: string) => void;
  sendRequest: (userId: string) => void;
  cancelFriendRequest: (userId: string) => void;
  acceptFriendRequest: (userId: string) => void;
  acceptRequest: (userId: string) => void;
  declineFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
  toggleFollow: (userId: string) => void;
  showToast: (message: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stored = useRef(loadAccount());
  const [account, setAccount] = useState<StoredAccount | null>(stored.current);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Persist account + session flag
  useEffect(() => {
    if (account) localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }, [account]);
  useEffect(() => {
    localStorage.setItem(SESSION_KEY, isLoggedIn ? 'in' : 'out');
  }, [isLoggedIn]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const nameOf = (id: string) => mockPeople.find(p => p.id === id)?.fullName ?? 'Someone';

  const setStatus = useCallback((userId: string, status: FriendshipStatus) => {
    setAccount(prev => {
      if (!prev) return prev;
      const friendships = { ...prev.friendships };
      if (status === 'NONE') delete friendships[userId];
      else friendships[userId] = status;
      return { ...prev, friendships };
    });
  }, []);

  /**
   * Demo only: simulate the other person accepting after a short delay.
   * In production this arrives as a push notification / websocket event.
   */
  const simulateAcceptance = useCallback((userId: string, delayMs = 3500) => {
    window.setTimeout(() => {
      setAccount(prev => {
        if (!prev || prev.friendships[userId] !== 'REQUEST_SENT') return prev;
        return { ...prev, friendships: { ...prev.friendships, [userId]: 'FRIENDS' } };
      });
      showToast(`🎉 ${nameOf(userId)} accepted your friend request`);
    }, delayMs);
  }, [showToast]);

  const completeSignUp = useCallback((profile: HBDProfile, addedContactIds: string[]) => {
    const friendships: Record<string, FriendshipStatus> = { ...initialFriendships };
    addedContactIds.forEach(id => { friendships[id] = 'REQUEST_SENT'; });
    setAccount({ profile, friendships, following: ['u-aisha'] });
    setIsLoggedIn(true);
    addedContactIds.forEach((id, i) => simulateAcceptance(id, 2500 + i * 1500));
    showToast(`Welcome to HBD, ${profile.fullName.split(' ')[0]}! 🎂`);
  }, [simulateAcceptance, showToast]);

  const logIn = useCallback((contactOrHandle: string) => {
    const q = contactOrHandle.trim().toLowerCase().replace(/^@/, '');
    const acc = loadAccount();
    if (acc) {
      const matchContact = acc.profile.contact?.trim().toLowerCase() === q;
      const matchHandle = acc.profile.handle?.toLowerCase() === q;
      const matchName = acc.profile.fullName?.toLowerCase() === q;
      if (matchContact || matchHandle || matchName || !q) {
        setAccount(acc);
        setIsLoggedIn(true);
        showToast(`Welcome back, ${acc.profile.fullName.split(' ')[0]}! 🎉`);
        return true;
      }
    }

    // Also support logging in as any of the mock profiles for testing
    const mock = mockPeople.find(p => p.handle.toLowerCase() === q || p.fullName.toLowerCase().includes(q));
    if (mock) {
      const demoAccount: StoredAccount = { profile: mock, friendships: initialFriendships, following: [] };
      setAccount(demoAccount);
      setIsLoggedIn(true);
      showToast(`Welcome back, ${mock.fullName.split(' ')[0]}! 🎉`);
      return true;
    }

    showToast(`No account found for "${contactOrHandle}". Try signing up!`);
    return false;
  }, [showToast]);

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
    showToast('You are logged out');
  }, [showToast]);

  const updateProfile = useCallback((patch: Partial<HBDProfile>) => {
    setAccount(prev => (prev ? { ...prev, profile: { ...prev.profile, ...patch } } : prev));
  }, []);

  const sendFriendRequest = useCallback((userId: string) => {
    setStatus(userId, 'REQUEST_SENT');
    showToast(`Friend request sent to ${nameOf(userId)}`);
    simulateAcceptance(userId);
  }, [setStatus, showToast, simulateAcceptance]);

  const cancelFriendRequest = useCallback((userId: string) => setStatus(userId, 'NONE'), [setStatus]);

  const acceptFriendRequest = useCallback((userId: string) => {
    setStatus(userId, 'FRIENDS');
    showToast(`You and ${nameOf(userId)} are now friends 🎉`);
  }, [setStatus, showToast]);

  const declineFriendRequest = useCallback((userId: string) => setStatus(userId, 'NONE'), [setStatus]);

  const removeFriend = useCallback((userId: string) => {
    setStatus(userId, 'NONE');
    showToast(`Removed ${nameOf(userId)} from friends`);
  }, [setStatus, showToast]);

  const toggleFollow = useCallback((userId: string) => {
    setAccount(prev => {
      if (!prev) return prev;
      const isFollowing = prev.following.includes(userId);
      return {
        ...prev,
        following: isFollowing ? prev.following.filter(id => id !== userId) : [...prev.following, userId],
      };
    });
  }, []);

  const value = useMemo<SessionContextValue>(() => {
    const friendships = isLoggedIn && account ? account.friendships : {};
    const curr = isLoggedIn && account ? account.profile : null;
    return {
      currentUser: curr,
      profile: curr,
      hasAccount: !!account,
      people: mockPeople,
      friendships,
      following: isLoggedIn && account ? account.following : [],
      toast,
      statusOf: (id: string) => friendships[id] ?? 'NONE',
      completeSignUp,
      login: (p: HBDProfile) => completeSignUp(p, []),
      logIn,
      logOut,
      updateProfile,
      sendFriendRequest,
      sendRequest: sendFriendRequest,
      cancelFriendRequest,
      acceptFriendRequest,
      acceptRequest: acceptFriendRequest,
      declineFriendRequest,
      removeFriend,
      toggleFollow,
      showToast,
    };
  }, [account, isLoggedIn, toast, completeSignUp, logIn, logOut, updateProfile, sendFriendRequest,
      cancelFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, toggleFollow, showToast]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
