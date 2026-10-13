import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MobileUser {
  id: string;
  handle: string;
  fullName: string;
  avatarUrl: string;
  city: string;
  country: string;
  birthDay: number;
  birthMonth: number;
  birthYear?: number;
  bio?: string;
  isVerifiedCivil?: boolean;
  wishlist: string[];
  avoidList: string[];
  idols?: string[];
  musicGenres?: string[];
  animalTypes?: string[];
  hobbies?: string[];
  personalGoals?: string[];
  traditions?: string[];
  showTributes?: boolean;
}

export const DEMO_MOBILE_USERS: MobileUser[] = [
  {
    id: 'u-1',
    handle: 'samuel_nd',
    fullName: 'Samuel Ndamukong',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'London',
    country: 'United Kingdom',
    birthDay: 24,
    birthMonth: 10,
    birthYear: 1995,
    bio: 'Product architect & celebration enthusiast. Always down for good coffee & heartfelt surprises ✨',
    isVerifiedCivil: true,
    wishlist: ['Specialty Coffee Beans', 'Noise Cancelling Headphones', 'Kindle Travel Books', 'Minimalist Gold Watch'],
    avoidList: ['Lilies (allergic)', 'Extreme Sweet Fondant'],
    idols: ['Steve Jobs', 'Nelson Mandela'],
    musicGenres: ['Afrobeats', 'Jazz'],
    animalTypes: ['Dogs'],
    hobbies: ['Tech & Coding', 'Photography'],
    personalGoals: ['Scale HBD Globally', 'Master Acoustic Guitar'],
    traditions: ['Universal Secular', 'Christian Heritage', 'Pan-African & Diaspora'],
    showTributes: true,
  },
  {
    id: 'u-2',
    handle: 'aisha_tech',
    fullName: 'Aisha Bello',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
    birthDay: 14,
    birthMonth: 5,
    birthYear: 1997,
    bio: 'Founder at PaySeed. Celebrating ventures, milestones, and brilliant minds across Africa 🚀',
    isVerifiedCivil: true,
    wishlist: ['Smart Ring', 'Artisan Dark Chocolate', 'Mechanical Keyboard'],
    avoidList: ['Peanuts (severe allergy)', 'Plastic souvenirs'],
    idols: ['Wangari Maathai', 'Ada Lovelace'],
    musicGenres: ['Afrobeats', 'Soul'],
    animalTypes: ['Cats'],
    hobbies: ['Reading', 'Travel'],
    personalGoals: ['PaySeed Series A', 'Mentor 50 Female Founders'],
    traditions: ['Islamic Heritage', 'Pan-African & Diaspora'],
    showTributes: true,
  },
  {
    id: 'u-3',
    handle: 'amina_tariq',
    fullName: 'Amina & Tariq',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'Toronto',
    country: 'Canada',
    birthDay: 18,
    birthMonth: 12,
    birthYear: 1990,
    bio: 'Two decades of journeys, family love, and celebrating every anniversary together 🥂',
    isVerifiedCivil: true,
    wishlist: ['Vintage Red Wine', 'Scented Candle Set', 'Weekend Cabin Retreat'],
    avoidList: ['Synthetic Perfumes', 'Seafood'],
    idols: ['Miles Davis', 'Maya Angelou'],
    musicGenres: ['Classical', 'Jazz'],
    animalTypes: ['Horses'],
    hobbies: ['Culinary & Baking', 'Gardening'],
    personalGoals: ['Silver Anniversary Journey', 'Community Youth Fund'],
    traditions: ['Universal Secular', 'Islamic Heritage'],
    showTributes: true,
  },
];

interface AuthContextType {
  user: MobileUser | null;
  isAuthenticated: boolean;
  login: (identifier: string) => boolean;
  signUp: (userData: Partial<MobileUser>) => MobileUser;
  logout: () => void;
  switchUser: (u: MobileUser) => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalVisible: boolean;
  authModalMode: 'login' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(DEMO_MOBILE_USERS[0]);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const login = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase().replace(/^@/, '');
    const found = DEMO_MOBILE_USERS.find(
      u => u.handle.toLowerCase() === clean || u.fullName.toLowerCase().includes(clean)
    );
    if (found) {
      setUser(found);
      setIsAuthModalVisible(false);
      return true;
    }
    // If not found in presets, create a session user for this handle
    if (clean.length > 0) {
      const newUser: MobileUser = {
        id: `u-${Date.now()}`,
        handle: clean,
        fullName: clean.charAt(0).toUpperCase() + clean.slice(1),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        city: 'London',
        country: 'United Kingdom',
        birthDay: 15,
        birthMonth: 10,
        birthYear: 1998,
        bio: 'Celebration Passport Holder on HBD ✨',
        isVerifiedCivil: true,
        wishlist: ['Coffee', 'Books'],
        avoidList: ['None'],
        idols: ['Nelson Mandela'],
        musicGenres: ['Afrobeats'],
        animalTypes: ['Dogs'],
        hobbies: ['Tech & Coding'],
        personalGoals: ['Make Every Day Joyful'],
        traditions: ['Universal Secular'],
        showTributes: true,
      };
      setUser(newUser);
      setIsAuthModalVisible(false);
      return true;
    }
    return false;
  };

  const signUp = (userData: Partial<MobileUser>): MobileUser => {
    const newUser: MobileUser = {
      id: `u-${Date.now()}`,
      handle: (userData.handle || 'celebrant').replace(/^@/, ''),
      fullName: userData.fullName || 'New Celebrant',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: userData.city || 'London',
      country: userData.country || 'United Kingdom',
      birthDay: userData.birthDay || 24,
      birthMonth: userData.birthMonth || 10,
      birthYear: userData.birthYear || 1996,
      bio: userData.bio || 'Authentic celebration passport on HBD ✨',
      isVerifiedCivil: userData.isVerifiedCivil !== undefined ? userData.isVerifiedCivil : true,
      wishlist: userData.wishlist && userData.wishlist.length > 0 ? userData.wishlist : ['Specialty Coffee', 'Books'],
      avoidList: userData.avoidList || ['Lilies (allergic)'],
      idols: userData.idols || ['Nelson Mandela'],
      musicGenres: userData.musicGenres || ['Afrobeats', 'Jazz'],
      animalTypes: userData.animalTypes || ['Dogs'],
      hobbies: userData.hobbies || ['Photography'],
      personalGoals: userData.personalGoals || ['Launch Startup'],
      traditions: userData.traditions || ['Universal Secular'],
      showTributes: userData.showTributes !== undefined ? userData.showTributes : true,
    };
    setUser(newUser);
    setIsAuthModalVisible(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setAuthModalMode('login');
    setIsAuthModalVisible(true);
  };

  const switchUser = (u: MobileUser) => {
    setUser(u);
    setIsAuthModalVisible(false);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalVisible(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signUp,
        logout,
        switchUser,
        openAuthModal,
        closeAuthModal,
        isAuthModalVisible,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
