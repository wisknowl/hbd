import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  label: string;
  sublabel?: string;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayMs?: number;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  sublabel,
  shortcut,
  side = 'bottom',
  align = 'center',
  delayMs = 120,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Position styles based on side and align
  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      zIndex: 9999,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    };

    switch (side) {
      case 'top':
        base.bottom = 'calc(100% + 8px)';
        if (align === 'center') base.left = '50%';
        if (align === 'start') base.left = '0';
        if (align === 'end') base.right = '0';
        break;
      case 'bottom':
        base.top = 'calc(100% + 8px)';
        if (align === 'center') base.left = '50%';
        if (align === 'start') base.left = '0';
        if (align === 'end') base.right = '0';
        break;
      case 'left':
        base.right = 'calc(100% + 8px)';
        if (align === 'center') base.top = '50%';
        if (align === 'start') base.top = '0';
        if (align === 'end') base.bottom = '0';
        break;
      case 'right':
        base.left = 'calc(100% + 8px)';
        if (align === 'center') base.top = '50%';
        if (align === 'start') base.top = '0';
        if (align === 'end') base.bottom = '0';
        break;
    }

    return base;
  };

  const getTransformOrigin = (): string => {
    let x = '50%';
    let y = '50%';
    if (side === 'top') y = '100%';
    if (side === 'bottom') y = '0%';
    if (side === 'left') x = '100%';
    if (side === 'right') x = '0%';
    return `${x} ${y}`;
  };

  const getTranslation = (): string => {
    let tx = '0%';
    let ty = '0%';
    if (align === 'center' && (side === 'top' || side === 'bottom')) tx = '-50%';
    if (align === 'center' && (side === 'left' || side === 'right')) ty = '-50%';
    return `translate(${tx}, ${ty})`;
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          style={{
            ...getPositionStyles(),
            transform: `${getTranslation()} scale(${isVisible ? 1 : 0.94})`,
            transformOrigin: getTransformOrigin(),
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
            backgroundColor: 'rgba(28, 22, 38, 0.96)',
            color: '#FFF8EE',
            borderRadius: '10px',
            padding: '6px 12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 24px -2px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            alignItems: align === 'center' ? 'center' : 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: '#FFF8EE',
              }}
            >
              {label}
            </span>
            {shortcut && (
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'var(--gold)',
                  fontFamily: 'monospace',
                }}
              >
                {shortcut}
              </span>
            )}
          </div>
          {sublabel && (
            <span
              style={{
                fontSize: '10.5px',
                color: 'rgba(255, 248, 238, 0.72)',
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
