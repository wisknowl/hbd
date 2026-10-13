import React from 'react';
import { Bell, Smartphone, User } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Avatar } from './Avatar';
import { useSession } from '../session';

interface TopFloatingBarProps {
  onToggleActivity: () => void;
  onOpenMobileModal: () => void;
  onOpenProfile: () => void;
  isActivityOpen: boolean;
  unreadCount?: number;
}

export const TopFloatingBar: React.FC<TopFloatingBarProps> = ({
  onToggleActivity,
  onOpenMobileModal,
  onOpenProfile,
  isActivityOpen,
  unreadCount = 3,
}) => {
  const { profile } = useSession();

  return (
    <div
      style={{
        position: 'fixed',
        top: '18px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--card)',
        borderRadius: '16px',
        padding: '5px 8px',
        border: '1px solid var(--line)',
        boxShadow: '0 8px 28px rgba(91, 42, 134, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 1. Activity Icon (1st in order) */}
      <Tooltip
        label="Activity & Notifications"
        sublabel={unreadCount > 0 ? `${unreadCount} pending celebration invites & pots` : 'All caught up'}
        side="bottom"
        align="center"
      >
        <button
          onClick={onToggleActivity}
          aria-label="Activity and notifications"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: isActivityOpen ? 'var(--coral-soft)' : 'transparent',
            color: isActivityOpen ? 'var(--coral)' : 'var(--fg)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isActivityOpen) {
              e.currentTarget.style.backgroundColor = 'var(--purple-soft)';
              e.currentTarget.style.color = 'var(--purple)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActivityOpen) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--fg)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <Bell size={18} strokeWidth={2} />
          {/* Pulsing Notification Badge */}
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--coral)',
                boxShadow: '0 0 0 2px var(--card)',
              }}
            />
          )}
        </button>
      </Tooltip>

      {/* Subtle Separator */}
      <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--line)', margin: '0 2px' }} />

      {/* 2. Mobile Phone Icon (2nd in order) */}
      <Tooltip
        label="Mobile App Companion"
        sublabel="Preview or launch HBD Mobile with Expo"
        side="bottom"
        align="center"
      >
        <button
          onClick={onOpenMobileModal}
          aria-label="Mobile app companion"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'transparent',
            color: 'var(--fg)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--purple-soft)';
            e.currentTarget.style.color = 'var(--purple)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--fg)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Smartphone size={18} strokeWidth={2} />
        </button>
      </Tooltip>

      {/* Subtle Separator */}
      <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--line)', margin: '0 2px' }} />

      {/* 3. Profile Icon (3rd in order) */}
      <Tooltip
        label={profile?.fullName || 'My Profile'}
        sublabel="Celebration preferences & wishlist"
        side="bottom"
        align="end"
      >
        <button
          onClick={onOpenProfile}
          aria-label="Open profile"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '2px',
            transition: 'all 0.15s ease',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          {profile?.avatarUrl ? (
            <Avatar src={profile.avatarUrl} name={profile.fullName} size={30} />
          ) : (
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-soft)',
                color: 'var(--purple)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <User size={16} strokeWidth={2.2} />
            </div>
          )}
        </button>
      </Tooltip>
    </div>
  );
};
