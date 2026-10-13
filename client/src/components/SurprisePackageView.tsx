import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Lock, 
  Send, 
  Film, 
  DollarSign, 
  Plus, 
  Play, 
  CheckCircle, 
  ShieldCheck, 
  MessageSquare,
  FileText,
  Camera,
  Box
} from 'lucide-react';
import type { 
  SurprisePackage, 
  SurpriseContribution, 
  SurpriseDiscussionMessage,
  ContributionType 
} from '../../../shared/types';
import { mockSurprisePackages } from '../mockData';

interface SurprisePackageViewProps {
  onBackToDates?: () => void;
  preselectedCelebrant?: string;
}

export const SurprisePackageView: React.FC<SurprisePackageViewProps> = ({
  onBackToDates,
  preselectedCelebrant
}) => {
  const [packages, setPackages] = useState<SurprisePackage[]>(mockSurprisePackages);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    preselectedCelebrant 
      ? (mockSurprisePackages.find(p => p.celebrantName.toLowerCase().includes(preselectedCelebrant.toLowerCase()))?.id || mockSurprisePackages[0].id)
      : mockSurprisePackages[0].id
  );

  const activePackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  // Active sub-tab inside the war room
  const [activeTab, setActiveTab] = useState<'chat' | 'media' | 'gifts' | 'compiler'>('chat');

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Contribution Modal State
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contribType, setContribType] = useState<ContributionType>('VIDEO');
  const [contribText, setContribText] = useState('');
  const [contribAmount, setContribAmount] = useState<number>(25);
  const [contribTitle, setContribTitle] = useState('');
  const [contribDesc, setContribDesc] = useState('');
  const [flagForReel, setFlagForReel] = useState(true);

  // New Surprise Package Modal State
  const [isNewPackageModalOpen, setIsNewPackageModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCelebrantName, setNewCelebrantName] = useState('');
  const [newDate, setNewDate] = useState('2026-10-24');
  const [newVisibility, setNewVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
  const [newHasGoal, setNewHasGoal] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState(200);

  // Unboxing preview modal (Celebrant View)
  const [isUnboxingOpen, setIsUnboxingOpen] = useState(false);
  const [unboxingStep, setUnboxingStep] = useState<'UNWRAP' | 'REEL' | 'GIFTS'>('UNWRAP');
  const [thankYouNote, setThankYouNote] = useState('');
  const [hasSentThankYou, setHasSentThankYou] = useState(false);

  // Handle adding chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: SurpriseDiscussionMessage = {
      id: `m-${Date.now()}`,
      packageId: activePackage.id,
      senderId: 'u-1',
      senderName: 'Samuel Ndamukong',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: chatInput.trim(),
      createdAt: new Date().toISOString()
    };

    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        return {
          ...p,
          discussionMessages: [...p.discussionMessages, newMsg]
        };
      }
      return p;
    }));

    setChatInput('');
  };

  // Handle submitting contribution
  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();

    const newContrib: SurpriseContribution = {
      id: `c-${Date.now()}`,
      packageId: activePackage.id,
      contributorId: 'u-1',
      contributorName: 'Samuel Ndamukong',
      contributorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      type: contribType,
      messageText: contribText,
      giftTitle: contribTitle || undefined,
      giftDescription: contribDesc || undefined,
      amountContributed: contribType === 'MONEY' ? contribAmount : undefined,
      currency: activePackage.currency,
      mediaUrl: contribType === 'VIDEO' 
        ? 'https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-his-hand-in-a-video-call-42861-large.mp4'
        : contribType === 'PHOTO'
        ? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
        : undefined,
      isFlaggedForCompilation: flagForReel,
      compilationOrder: flagForReel ? (activePackage.contributions.filter(c => c.isFlaggedForCompilation).length + 1) : undefined,
      compilationCaption: contribText || contribTitle || 'Joyful tribute ✨',
      submittedAt: new Date().toISOString()
    };

    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        const nextContributions = [...p.contributions, newContrib];
        const nextAmount = contribType === 'MONEY' ? (p.currentPooledAmount + contribAmount) : p.currentPooledAmount;
        
        return {
          ...p,
          contributions: nextContributions,
          currentPooledAmount: nextAmount
        };
      }
      return p;
    }));

    setIsContributeModalOpen(false);
    setContribText('');
    setContribTitle('');
    setContribDesc('');
  };

  // Toggle compilation flag for an item
  const handleToggleCompilationFlag = (contribId: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        const updatedContribs = p.contributions.map(c => {
          if (c.id === contribId) {
            return {
              ...c,
              isFlaggedForCompilation: !c.isFlaggedForCompilation,
              compilationOrder: !c.isFlaggedForCompilation 
                ? (p.contributions.filter(item => item.isFlaggedForCompilation).length + 1)
                : undefined
            };
          }
          return c;
        });

        // Re-index compilation reel
        const flagged = updatedContribs
          .filter(c => c.isFlaggedForCompilation)
          .sort((a, b) => (a.compilationOrder || 0) - (b.compilationOrder || 0));

        return {
          ...p,
          contributions: updatedContribs,
          compilationReel: {
            id: `cr-${p.id}`,
            packageId: p.id,
            title: `${p.celebrantName} — Celebration Highlights Reel`,
            totalDurationSeconds: flagged.reduce((acc, curr) => acc + (curr.durationSeconds || 15), 0),
            soundtrackTitle: 'Joyful Horns & Celebration Chimes',
            compiledItems: flagged.map((c, idx) => ({
              contributionId: c.id,
              mediaUrl: c.mediaUrl || c.thumbnailUrl || '',
              type: (c.type === 'VIDEO' ? 'VIDEO' : c.type === 'PHOTO' ? 'PHOTO' : 'LETTER') as any,
              senderName: c.contributorName,
              caption: c.compilationCaption || c.messageText || '',
              durationSeconds: c.durationSeconds || 15,
              order: idx + 1
            })),
            isReady: flagged.length > 0,
            compiledAt: new Date().toISOString()
          }
        };
      }
      return p;
    }));
  };

  // Dispatch / Deliver Surprise Package
  const handleDeliverPackage = () => {
    setPackages(prev => prev.map(p => {
      if (p.id === activePackage.id) {
        return {
          ...p,
          status: 'DELIVERED',
          deliveredAt: new Date().toISOString()
        };
      }
      return p;
    }));
    setIsUnboxingOpen(true);
    setUnboxingStep('UNWRAP');
  };

  // Create New Surprise Package
  const handleCreateNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCelebrantName || !newTitle) return;

    const newPkg: SurprisePackage = {
      id: `sp-${Date.now()}`,
      title: newTitle,
      celebrantId: `u-${Date.now()}`,
      celebrantName: newCelebrantName,
      celebrantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      celebrantBirthDate: newDate,
      celebrantRelationship: 'Friend',
      organizerId: 'u-1',
      organizerName: 'Samuel Ndamukong',
      organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'PLANNING',
      visibility: newVisibility,
      targetDeliveryDate: `${newDate}T00:00:00Z`,
      invitedCircleIds: ['u-1'],
      contributions: [],
      discussionMessages: [
        {
          id: `m-init-${Date.now()}`,
          packageId: `sp-${Date.now()}`,
          senderId: 'u-1',
          senderName: 'Samuel Ndamukong',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          text: `Welcome to the secret Surprise Package for ${newCelebrantName}! Drop gift ideas, video greetings, and let's compile an unforgettable celebration. 🔒 Hidden from ${newCelebrantName}.`,
          createdAt: new Date().toISOString()
        }
      ],
      hasPooledGoal: newHasGoal,
      pooledGoalAmount: newHasGoal ? newGoalAmount : undefined,
      currentPooledAmount: 0,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPackages(prev => [newPkg, ...prev]);
    setSelectedPackageId(newPkg.id);
    setIsNewPackageModalOpen(false);
    setNewTitle('');
    setNewCelebrantName('');
  };

  const flaggedContributions = activePackage.contributions.filter(c => c.isFlaggedForCompilation);

  return (
    <div style={{
      flex: 1,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--bg)',
      color: 'var(--fg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Banner & Package Selector */}
      <div style={{
        padding: '24px 32px 18px',
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBackToDates && (
            <button
              onClick={onBackToDates}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--bg)',
                color: 'var(--purple)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Back to Dates
            </button>
          )}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'var(--purple-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--purple)'
          }}>
            <Box size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Surprise Packages</h2>
              <span style={{
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 107, 107, 0.12)',
                color: 'var(--coral)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={12} /> Stealth Collaboration
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
              Secret circle coordination for celebrants before the big reveal.
            </p>
          </div>
        </div>

        {/* Package Selector Pills & Create Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            gap: '4px'
          }}>
            {packages.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPackageId(p.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: p.id === activePackage.id ? 800 : 600,
                  backgroundColor: p.id === activePackage.id ? 'var(--purple)' : 'transparent',
                  color: p.id === activePackage.id ? '#FFF' : 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{p.celebrantName}</span>
                {p.status === 'DELIVERED' && (
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewPackageModalOpen(true)}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--coral)',
              color: '#FFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.25)'
            }}
          >
            <Plus size={15} />
            New Surprise Package
          </button>
        </div>
      </div>

      {/* Main Package Workspace */}
      <div style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Stealth Security & Countdown Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2D1445 0%, #170A24 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid rgba(244, 185, 66, 0.25)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img 
              src={activePackage.celebrantAvatar} 
              alt={activePackage.celebrantName}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                border: '3px solid var(--gold)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{
                  backgroundColor: 'rgba(255, 94, 98, 0.25)',
                  color: '#FF8A8D',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(255, 94, 98, 0.4)'
                }}>
                  <ShieldCheck size={13} />
                  {activePackage.status === 'DELIVERED' ? 'DELIVERED & UNSEALED' : 'STEALTH ACTIVE: HIDDEN FROM CELEBRANT'}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  {activePackage.visibility === 'PRIVATE' ? '🔒 Private Circle' : '🌍 Public Community Milestone'}
                </span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800 }}>
                {activePackage.title}
              </h1>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255,255,255,0.85)' }}>
                Celebrant: <strong>{activePackage.celebrantName}</strong> ({activePackage.celebrantRelationship || 'Friend'}) · Target: {new Date(activePackage.targetDeliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Delivery & Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 800 }}>
                Contributions
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>
                {activePackage.contributions.length} items · ${activePackage.currentPooledAmount} raised
              </div>
            </div>

            {activePackage.status !== 'DELIVERED' ? (
              <button
                onClick={handleDeliverPackage}
                style={{
                  backgroundColor: 'var(--gold)',
                  color: '#202124',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(244, 185, 66, 0.4)'
                }}
              >
                <Sparkles size={16} />
                Send Surprise Package Now!
              </button>
            ) : (
              <button
                onClick={() => { setIsUnboxingOpen(true); setUnboxingStep('UNWRAP'); }}
                style={{
                  backgroundColor: 'var(--purple-soft)',
                  color: 'var(--purple)',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle size={16} color="var(--purple)" />
                View Unboxing Ceremony
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs inside the Surprise War Room */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--line)',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'chat' ? 800 : 600,
              color: activeTab === 'chat' ? 'var(--purple)' : 'var(--muted)',
              borderBottom: activeTab === 'chat' ? '3px solid var(--purple)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageSquare size={16} />
            Coordination Chat ({activePackage.discussionMessages.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'media' ? 800 : 600,
              color: activeTab === 'media' ? 'var(--purple)' : 'var(--muted)',
              borderBottom: activeTab === 'media' ? '3px solid var(--purple)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Camera size={16} />
            Tributes & Video Wishes ({activePackage.contributions.filter(c => ['VIDEO', 'PHOTO', 'LETTER', 'VOICE_NOTE'].includes(c.type)).length})
          </button>

          <button
            onClick={() => setActiveTab('gifts')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'gifts' ? 800 : 600,
              color: activeTab === 'gifts' ? 'var(--purple)' : 'var(--muted)',
              borderBottom: activeTab === 'gifts' ? '3px solid var(--purple)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Gift size={16} />
            Gifts & Services Pool ({activePackage.contributions.filter(c => ['MONEY', 'PHYSICAL_GIFT', 'DIGITAL_GIFT', 'SERVICE'].includes(c.type)).length})
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'compiler' ? 800 : 600,
              color: activeTab === 'compiler' ? 'var(--purple)' : 'var(--muted)',
              borderBottom: activeTab === 'compiler' ? '3px solid var(--purple)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Film size={16} />
            Compilation Reel Studio ({flaggedContributions.length} flagged)
          </button>
        </div>

        {/* TAB 1: COORDINATION CHAT */}
        {activeTab === 'chat' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            minHeight: '440px'
          }}>
            {/* Messages Thread */}
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {activePackage.discussionMessages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '12px' }}>
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName} 
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{
                      backgroundColor: 'var(--bg)',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      border: '1px solid var(--line)',
                      maxWidth: '80%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800 }}>{msg.senderName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.45, color: 'var(--fg)' }}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} style={{
                padding: '14px 18px',
                borderTop: '1px solid var(--line)',
                display: 'flex',
                gap: '10px',
                backgroundColor: 'var(--card)'
              }}>
                <input 
                  type="text"
                  placeholder="Discuss ideas, drop suggestions (completely secret from celebrant)..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '13.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--purple)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700
                  }}
                >
                  <Send size={15} />
                  Send
                </button>
              </form>
            </div>

            {/* Quick Actions Side Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                backgroundColor: 'var(--card)',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                padding: '20px'
              }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>
                  Contribute to Package
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.45 }}>
                  Drop a video wish, pitch in funds, or pledge an individual gift/service.
                </p>
                <button
                  onClick={() => setIsContributeModalOpen(true)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--coral)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.25)'
                  }}
                >
                  <Plus size={16} />
                  Add Contribution
                </button>
              </div>

              {/* Compilation Status Box */}
              <div style={{
                backgroundColor: 'var(--card)',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>Compilation Reel</span>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700 }}>
                    {flaggedContributions.length} Indexed
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>
                  The coordinator flags circle contributions to automatically stitch together the final celebration movie.
                </p>
                <button
                  onClick={() => setActiveTab('compiler')}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--purple-soft)',
                    color: 'var(--purple)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Open Reel Sequencer →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIBUTES & VIDEO WISHES */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  Tributes, Video Greetings & Letters
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Flag items with the 🎬 icon to include them in the final unboxing movie.
                </p>
              </div>
              <button
                onClick={() => { setContribType('VIDEO'); setIsContributeModalOpen(true); }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--purple)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Camera size={15} /> Record / Add Tribute
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '18px'
            }}>
              {activePackage.contributions
                .filter(c => ['VIDEO', 'PHOTO', 'LETTER', 'VOICE_NOTE'].includes(c.type))
                .map(item => (
                  <div key={item.id} style={{
                    backgroundColor: 'var(--card)',
                    borderRadius: '16px',
                    border: item.isFlaggedForCompilation ? '2px solid var(--gold)' : '1px solid var(--line)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    {/* Header with author */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={item.contributorAvatar} 
                          alt={item.contributorName} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{item.contributorName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.type}</div>
                        </div>
                      </div>

                      {/* Compilation Reel Badge / Toggle */}
                      <button
                        onClick={() => handleToggleCompilationFlag(item.id)}
                        title={item.isFlaggedForCompilation ? 'Indexed in Final Compilation Reel' : 'Click to add to final reel'}
                        style={{
                          backgroundColor: item.isFlaggedForCompilation ? 'var(--gold)' : 'var(--bg)',
                          color: item.isFlaggedForCompilation ? '#202124' : 'var(--muted)',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Film size={12} />
                        {item.isFlaggedForCompilation ? `#${item.compilationOrder} in Reel` : 'Flag for Reel'}
                      </button>
                    </div>

                    {/* Content Preview */}
                    {item.type === 'VIDEO' && (
                      <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '160px',
                        backgroundColor: '#000',
                        position: 'relative',
                        marginBottom: '10px'
                      }}>
                        <video 
                          src={item.mediaUrl} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#202124'
                          }}>
                            <Play size={18} />
                          </div>
                        </div>
                      </div>
                    )}

                    {item.messageText && (
                      <p style={{
                        fontSize: '13px',
                        lineHeight: 1.45,
                        color: 'var(--fg)',
                        margin: 0,
                        flex: 1
                      }}>
                        "{item.messageText}"
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: GIFTS & SERVICES REGISTRY */}
        {activeTab === 'gifts' && (
          <div>
            {/* Pooled Cash Goal Banner */}
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Group Gift Fund</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                    Crowdfunded pot to purchase a joint surprise or gift voucher.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--purple)' }}>
                    ${activePackage.currentPooledAmount}
                  </span>
                  {activePackage.hasPooledGoal && activePackage.pooledGoalAmount && (
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}> / ${activePackage.pooledGoalAmount}</span>
                  )}
                </div>
              </div>

              {activePackage.hasPooledGoal && activePackage.pooledGoalAmount && (
                <div style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg)',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (activePackage.currentPooledAmount / activePackage.pooledGoalAmount) * 100)}%`,
                    backgroundColor: 'var(--gold)',
                    borderRadius: '999px'
                  }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { setContribType('MONEY'); setIsContributeModalOpen(true); }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--gold)',
                    color: '#202124',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <DollarSign size={15} /> Pitch in Funds
                </button>

                <button
                  onClick={() => { setContribType('PHYSICAL_GIFT'); setIsContributeModalOpen(true); }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--purple)',
                    color: '#FFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Gift size={15} /> Pledge Physical Gift
                </button>

                <button
                  onClick={() => { setContribType('SERVICE'); setIsContributeModalOpen(true); }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--purple-soft)',
                    color: 'var(--purple)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={15} /> Offer a Service / Talent
                </button>
              </div>
            </div>

            {/* Registry of Pledged Gifts and Services */}
            <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800 }}>Pledged Items & Services</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '16px'
            }}>
              {activePackage.contributions
                .filter(c => ['PHYSICAL_GIFT', 'DIGITAL_GIFT', 'SERVICE', 'MONEY'].includes(c.type))
                .map(item => (
                  <div key={item.id} style={{
                    backgroundColor: 'var(--card)',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <img 
                        src={item.contributorAvatar} 
                        alt={item.contributorName} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>{item.contributorName}</span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: item.type === 'SERVICE' ? 'var(--purple-soft)' : 'var(--bg)',
                        color: item.type === 'SERVICE' ? 'var(--purple)' : 'var(--muted)',
                        marginLeft: 'auto'
                      }}>
                        {item.type}
                      </span>
                    </div>

                    <h5 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--purple)' }}>
                      {item.giftTitle || (item.type === 'MONEY' ? `$${item.amountContributed} Cash Contribution` : 'Surprise Item')}
                    </h5>

                    {item.giftDescription && (
                      <p style={{ margin: '0 0 8px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.4 }}>
                        {item.giftDescription}
                      </p>
                    )}

                    {item.messageText && (
                      <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: 'var(--fg)' }}>
                        "{item.messageText}"
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMPILATION REEL STUDIO */}
        {activeTab === 'compiler' && (
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  Automated Compilation Reel Sequencer
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Items flagged in the war room are compiled into the master unboxing video for {activePackage.celebrantName}.
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--purple-soft)',
                color: 'var(--purple)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 800
              }}>
                Soundtrack: Acoustic Joy Chimes (1m 18s)
              </div>
            </div>

            {/* Sequenced Timeline */}
            <div style={{
              display: 'flex',
              gap: '14px',
              overflowX: 'auto',
              paddingBottom: '16px'
            }}>
              {flaggedContributions.map((clip, idx) => (
                <div key={clip.id} style={{
                  minWidth: '220px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '14px',
                  border: '2px solid var(--gold)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: 'var(--gold)',
                      color: '#202124',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      Scene #{idx + 1}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{clip.durationSeconds || 15}s</span>
                  </div>

                  <div style={{
                    height: '110px',
                    borderRadius: '8px',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    position: 'relative'
                  }}>
                    {clip.type === 'VIDEO' ? <Film size={28} /> : clip.type === 'PHOTO' ? <Camera size={28} /> : <FileText size={28} />}
                    <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '11px', fontWeight: 700 }}>
                      {clip.type}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800 }}>{clip.contributorName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {clip.compilationCaption || clip.messageText}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '14px',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--fg)', fontWeight: 600 }}>
                💡 Tip: Contributors can upload from mobile or web. You can re-order scenes or remove clips at any time before delivery.
              </span>
              <button
                onClick={() => { setIsUnboxingOpen(true); setUnboxingStep('REEL'); }}
                style={{
                  backgroundColor: 'var(--purple)',
                  color: '#FFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={14} /> Preview Master Reel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CONTRIBUTE TO PACKAGE */}
      {isContributeModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '24px',
            border: '1px solid var(--line)',
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>
              Contribute to {activePackage.celebrantName}’s Surprise
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'var(--muted)' }}>
              Choose your contribution type below. All items are shared with the secret planning circle.
            </p>

            <form onSubmit={handleSubmitContribution} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                  Contribution Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {(['VIDEO', 'MONEY', 'PHYSICAL_GIFT', 'SERVICE'] as ContributionType[]).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setContribType(type)}
                      style={{
                        padding: '9px 6px',
                        borderRadius: '10px',
                        border: contribType === type ? '2px solid var(--purple)' : '1px solid var(--line)',
                        backgroundColor: contribType === type ? 'var(--purple-soft)' : 'var(--bg)',
                        color: contribType === type ? 'var(--purple)' : 'var(--fg)',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {type === 'VIDEO' ? '🎥 Video' : type === 'MONEY' ? '💰 Money' : type === 'PHYSICAL_GIFT' ? '🎁 Gift' : '✨ Service'}
                    </button>
                  ))}
                </div>
              </div>

              {contribType === 'MONEY' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Amount ($ USD)
                  </label>
                  <input 
                    type="number" 
                    value={contribAmount}
                    onChange={(e) => setContribAmount(Number(e.target.value))}
                    min={5}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {(contribType === 'PHYSICAL_GIFT' || contribType === 'SERVICE') && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                      Title / Description of Gift or Service
                    </label>
                    <input 
                      type="text" 
                      placeholder={contribType === 'PHYSICAL_GIFT' ? 'e.g. Designer Perfume, Custom Cake' : 'e.g. DJing party, Photography, Airport Pickup'}
                      value={contribTitle}
                      onChange={(e) => setContribTitle(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--fg)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Heartfelt Message / Note
                </label>
                <textarea 
                  rows={3}
                  placeholder="Write your wishes or details for the group..."
                  value={contribText}
                  onChange={(e) => setContribText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              {contribType === 'VIDEO' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox"
                    checked={flagForReel}
                    onChange={(e) => setFlagForReel(e.target.checked)}
                  />
                  <span>Index this tribute into the automated Compilation Reel</span>
                </label>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'transparent',
                    color: 'var(--fg)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--purple)',
                    color: '#FFF',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Submit Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW SURPRISE PACKAGE */}
      {isNewPackageModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '24px',
            border: '1px solid var(--line)',
            padding: '28px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>
              Start a New Surprise Package
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'var(--muted)' }}>
              Creates a secret room completely hidden from the celebrant until delivery.
            </p>

            <form onSubmit={handleCreateNewPackage} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Surprise Package Title
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Mama Sophie’s 60th Jubilee Surprise"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Celebrant Name (Who is this for?)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Mama Sophie"
                  value={newCelebrantName}
                  onChange={(e) => setNewCelebrantName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Target Birthday / Date
                  </label>
                  <input 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Visibility
                  </label>
                  <select
                    value={newVisibility}
                    onChange={(e) => setNewVisibility(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="PRIVATE">🔒 Private Circle</option>
                    <option value="PUBLIC">🌍 Public Milestone</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <input
                  type="checkbox"
                  id="targetGoalToggle"
                  checked={newHasGoal}
                  onChange={(e) => setNewHasGoal(e.target.checked)}
                />
                <label htmlFor="targetGoalToggle" style={{ fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                  Set a fluid target pool goal (optional)
                </label>
              </div>

              {newHasGoal && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Target Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--fg)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewPackageModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    backgroundColor: 'transparent',
                    color: 'var(--fg)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--coral)',
                    color: '#FFF',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNBOXING CEREMONY MODAL (Celebrant View) */}
      {isUnboxingOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 5, 20, 0.94)',
          backdropFilter: 'blur(12px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 2000,
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '680px',
            width: '100%',
            backgroundColor: 'var(--card)',
            borderRadius: '28px',
            border: '2px solid var(--gold)',
            padding: '36px',
            textAlign: 'center',
            color: 'var(--fg)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {unboxingStep === 'UNWRAP' && (
              <div>
                <div style={{ fontSize: '54px', marginBottom: '14px' }}>🎁</div>
                <span style={{
                  backgroundColor: 'var(--gold-soft)',
                  color: 'var(--purple)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  Surprise Package Unlocked
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px' }}>
                  For {activePackage.celebrantName}!
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  Organized in secret by <strong>{activePackage.organizerName}</strong> and {activePackage.invitedCircleIds.length + 3} loved ones from across your circle.
                </p>

                <button
                  onClick={() => setUnboxingStep('REEL')}
                  style={{
                    backgroundColor: 'var(--gold)',
                    color: '#202124',
                    padding: '14px 32px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(244, 185, 66, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={18} />
                  Open Surprise Package!
                </button>
              </div>
            )}

            {unboxingStep === 'REEL' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
                  🎬 Your Circle Tribute Compilation Reel
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '18px' }}>
                  Playing {flaggedContributions.length} wishes sequenced with live celebration chimes.
                </p>

                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  height: '280px',
                  position: 'relative',
                  marginBottom: '20px'
                }}>
                  <video 
                    src="https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-his-hand-in-a-video-call-42861-large.mp4"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    autoPlay
                    loop
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#FFF',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '8px 14px',
                    borderRadius: '10px'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 800 }}>Samuel Ndamukong · Scene #1</span>
                    <span style={{ fontSize: '12px', color: 'var(--gold)' }}>28s</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setUnboxingStep('GIFTS')}
                    style={{
                      backgroundColor: 'var(--purple)',
                      color: '#FFF',
                      padding: '12px 28px',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Group Gifts & Tributes →
                  </button>
                </div>
              </div>
            )}

            {unboxingStep === 'GIFTS' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
                  🎁 Gifts & Messages From Your Circle
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '18px' }}>
                  ${activePackage.currentPooledAmount} in group funds and individual tributes pledged.
                </p>

                {/* Thank you box */}
                {!hasSentThankYou ? (
                  <div style={{
                    backgroundColor: 'var(--bg)',
                    borderRadius: '16px',
                    padding: '18px',
                    marginBottom: '18px',
                    textAlign: 'left'
                  }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--purple)', display: 'block', marginBottom: '6px' }}>
                      Send Thank You Message Back to All Contributors
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="Thank you all so much for this incredible surprise! I am so blessed to have you in my life. ❤️"
                      value={thankYouNote}
                      onChange={(e) => setThankYouNote(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--card)',
                        color: 'var(--fg)',
                        fontSize: '13px',
                        marginBottom: '8px'
                      }}
                    />
                    <button
                      onClick={() => setHasSentThankYou(true)}
                      style={{
                        backgroundColor: 'var(--coral)',
                        color: '#FFF',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Broadcast Thank You To Circle
                    </button>
                  </div>
                ) : (
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(74, 222, 128, 0.12)',
                    color: '#16a34a',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '18px'
                  }}>
                    ✓ Thank you message sent to all contributors! Added to your Memory Vault.
                  </div>
                )}

                <button
                  onClick={() => setIsUnboxingOpen(false)}
                  style={{
                    backgroundColor: 'var(--purple)',
                    color: '#FFF',
                    padding: '11px 26px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close & Save to Memory Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
