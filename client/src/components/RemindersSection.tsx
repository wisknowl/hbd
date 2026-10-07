import React, { useState } from 'react';
import { Plus, Sparkles, Clock } from 'lucide-react';
import type { ReminderItem, CelebrationCategory } from '../../../shared/types';

interface RemindersSectionProps {
  reminders: ReminderItem[];
  onAddReminder: (reminder: any) => void;
  onPlanCelebrationForReminder: (reminder: ReminderItem) => void;
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  reminders,
  onAddReminder,
  onPlanCelebrationForReminder,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [celebrant, setCelebrant] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState<CelebrationCategory>('BIRTHDAY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !celebrant || !eventDate) return;

    onAddReminder({
      title,
      celebrant,
      eventDate,
      category
    });

    setTitle('');
    setCelebrant('');
    setEventDate('');
    setShowAddForm(false);
  };

  return (
    <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: '36px 20px',
      display: 'grid',
      gap: '28px'
    }}>
      {/* Greeting Banner */}
      <div>
        <small style={{ color: 'var(--muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Good Morning, Amina 👋
        </small>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginTop: '4px' }}>
          What’s worth celebrating?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
          HBD keeps your important dates, milestones and anniversaries alive so you never miss a moment that matters.
        </p>
      </div>

      {/* Featured Milestone Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--purple) 0%, #3d1b5a 100%)',
        color: 'var(--cream)',
        borderRadius: '26px',
        padding: '30px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 185, 66, 0.15)',
          filter: 'blur(10px)'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(244, 185, 66, 0.25)',
          color: 'var(--gold)',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          marginBottom: '12px'
        }}>
          <Clock size={12} />
          In 30 Days · Major Anniversary
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          Your company turns 10 years old
        </h2>
        <p style={{ opacity: 0.85, fontSize: '14px', maxWidth: '520px', marginBottom: '20px' }}>
          A decade of existence deserves to be commemorated with your team, customers, and founders. Would you like HBD to design the celebration?
        </p>

        <button
          onClick={() => onPlanCelebrationForReminder({
            id: 'corp-10',
            title: 'Company 10th Anniversary',
            category: 'ANNIVERSARY',
            eventDate: '2026-11-06',
            daysRemaining: 30,
            celebrant: 'Kaba Technologies',
            icon: '🏢',
            hasCelebrationPlanned: false
          })}
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--char)',
            fontWeight: 800,
            fontSize: '14px',
            padding: '12px 24px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 16px rgba(244, 185, 66, 0.3)'
          }}
        >
          <Sparkles size={16} />
          Plan Anniversary Celebration
        </button>
      </div>

      {/* Upcoming Reminders List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '19px', fontWeight: 800 }}>Coming Up in Your Circle</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: 700,
              backgroundColor: 'var(--purple-soft)',
              color: 'var(--purple)'
            }}
          >
            <Plus size={14} />
            Add Date or Milestone
          </button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--card)',
              border: '1.5px solid var(--purple)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '16px',
              display: 'grid',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Save a Date to Celebrate</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <input
                type="text"
                placeholder="Title e.g. Dad's 70th, Product v1 Launch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '13px'
                }}
              />
              <input
                type="text"
                placeholder="Celebrant name or entity"
                value={celebrant}
                onChange={(e) => setCelebrant(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '13px'
                }}
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '13px'
                }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CelebrationCategory)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--fg)',
                  fontSize: '13px'
                }}
              >
                <option value="BIRTHDAY">🎂 Birthday</option>
                <option value="BEGINNING">🚀 Beginning</option>
                <option value="MILESTONE">🏆 Milestone</option>
                <option value="ANNIVERSARY">📅 Anniversary</option>
                <option value="COMMUNITY">❤️ Community</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--muted)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--purple)',
                  color: 'var(--cream)',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}

        {/* Reminders Cards */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {reminders.map((r) => (
            <div
              key={r.id}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--purple-soft)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '20px'
                }}>
                  {r.icon}
                </div>
                <div>
                  <b style={{ fontSize: '15px', color: 'var(--fg)', display: 'block' }}>{r.title}</b>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    {r.celebrant} · {new Date(r.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  color: 'var(--coral)',
                  fontWeight: 800,
                  fontSize: '13px',
                  backgroundColor: 'var(--coral-soft)',
                  padding: '5px 12px',
                  borderRadius: '999px'
                }}>
                  {r.daysRemaining} days left
                </span>

                <button
                  onClick={() => onPlanCelebrationForReminder(r)}
                  style={{
                    backgroundColor: 'var(--purple)',
                    color: 'var(--cream)',
                    fontWeight: 700,
                    fontSize: '12px',
                    padding: '8px 16px',
                    borderRadius: '999px'
                  }}
                >
                  Plan Surprise
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
