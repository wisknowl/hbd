import type { HBDProfile, FriendshipStatus, PersonCircleMember } from '../../../shared/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Days from `from` until the next occurrence of day/month (0 = today). */
export function daysUntilBirthday(day: number, month: number, from: Date = new Date()): number {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) next = new Date(today.getFullYear() + 1, month - 1, day);
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

export function formatBirthday(day: number, month: number): string {
  return `${MONTHS[month - 1]} ${day}`;
}

/** Age the person turns on their next birthday, if they share their birth year and allow it. */
export function turningAge(p: HBDProfile, from: Date = new Date()): number | null {
  if (!p.birthYear || !p.privacy.showAge) return null;
  const days = daysUntilBirthday(p.birthDay, p.birthMonth, from);
  const next = new Date(from.getTime() + days * 86_400_000);
  return next.getFullYear() - p.birthYear;
}

export function countdownLabel(days: number): string {
  if (days === 0) return 'Today 🎉';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

// ------------------------------------------------------------------
// Privacy rules — the single source of truth for what a viewer may see.
// The shipping address is never exposed; gifts go through HBD.
// ------------------------------------------------------------------
export function canSeeBirthday(p: HBDProfile, status: FriendshipStatus): boolean {
  if (p.privacy.birthdayVisibility === 'EVERYONE') return true;
  if (p.privacy.birthdayVisibility === 'FRIENDS') return status === 'FRIENDS';
  return false;
}

export function canSeePreferences(p: HBDProfile, status: FriendshipStatus): boolean {
  return status === 'FRIENDS' && p.privacy.preferencesVisibleToFriends;
}

export function canSendGift(status: FriendshipStatus): boolean {
  return status === 'FRIENDS';
}

/** Adapts an HBD profile to the Gift Engine's recipient shape. */
export function profileToRecipient(p: HBDProfile): PersonCircleMember {
  return {
    id: p.id,
    fullName: p.fullName,
    relationship: 'Friend',
    birthDate: `${p.birthYear ?? 2000}-${String(p.birthMonth).padStart(2, '0')}-${String(p.birthDay).padStart(2, '0')}`,
    location: `${p.city}, ${p.country}`,
    avatarUrl: p.avatarUrl ?? '',
    favoriteColor: p.preferences.favoriteColor,
    interests: p.preferences.interests,
    giftPreferences: p.preferences.giftWishes,
    daysUntilCelebration: daysUntilBirthday(p.birthDay, p.birthMonth),
  };
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

/** Downscale an uploaded image to a small square data URL so it fits in localStorage. */
export function resizeImageFile(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unsupported'));
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
