'use client';

import React, {useEffect, useState} from 'react';

import {designTokens} from '../styles/tokens';

export type NavigationItem = {
  href: string;
  id: string;
  label: string;
};

type NavigationProps = {
  brand: string;
  currentId: string;
  items: NavigationItem[];
  recentItems?: NavigationItem[];
  secondaryItems?: NavigationItem[];
};

export function Navigation({
  brand,
  currentId,
  items,
  recentItems = [],
  secondaryItems = []
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleTouchEnd: React.TouchEventHandler<HTMLElement> = (event) => {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0]?.clientX - touchStartX;

    if (deltaX < -40) {
      closeMenu();
    }

    if (deltaX > 40) {
      setIsOpen(true);
    }

    setTouchStartX(null);
  };

  return (
    <nav
      aria-label="主导航"
      data-navigation="app-shell"
      data-navigation-depth="1"
      onTouchEnd={handleTouchEnd}
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
    >
      <style>{navigationCss}</style>
      <aside data-navigation-region="desktop-sidebar" style={desktopSidebarStyle}>
        <a href="/" style={brandStyle}>
          {brand}
        </a>
        <NavigationLinks currentId={currentId} items={items} />
        {recentItems.length ? (
          <section aria-label="最近任务" style={recentSectionStyle}>
            <span style={sectionLabelStyle}>最近任务</span>
            <NavigationLinks compact currentId={currentId} items={recentItems} />
          </section>
        ) : null}
        {secondaryItems.length ? (
          <div style={secondarySectionStyle}>
            <NavigationLinks compact currentId={currentId} items={secondaryItems} />
          </div>
        ) : null}
      </aside>

      <div data-navigation-region="mobile-topbar" style={mobileTopbarStyle}>
        <a href="/" style={mobileBrandStyle}>
          {brand}
        </a>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? '关闭导航菜单' : '打开导航菜单'}
          onClick={() => setIsOpen((value) => !value)}
          style={mobileMenuButtonStyle}
          type="button"
        >
          ☰
        </button>
      </div>

      <div
        aria-hidden={!isOpen}
        data-navigation-open={isOpen}
        data-navigation-region="mobile-drawer"
        style={{
          ...mobileDrawerStyle,
          transform: isOpen ? 'translateX(0)' : 'translateX(-110%)'
        }}
      >
        <NavigationLinks currentId={currentId} items={[...items, ...secondaryItems]} />
      </div>
      {isOpen ? <button aria-label="关闭导航菜单" onClick={closeMenu} style={scrimStyle} type="button" /> : null}

      <div data-navigation-region="mobile-bottom" style={mobileBottomStyle}>
        <NavigationLinks compact currentId={currentId} items={items.slice(0, 4)} />
      </div>
    </nav>
  );
}

function NavigationLinks({
  compact = false,
  currentId,
  items
}: {
  compact?: boolean;
  currentId: string;
  items: NavigationItem[];
}) {
  return (
    <div style={compact ? compactListStyle : listStyle}>
      {items.map((item) => {
        const active = item.id === currentId;

        return (
          <a
            aria-current={active ? 'page' : undefined}
            data-navigation-active={active}
            href={item.href}
            key={item.id}
            style={active ? activeLinkStyle : linkStyle}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

const navigationCss = `
@media (max-width: 767px) {
  [data-navigation-region="desktop-sidebar"] { display: none !important; }
  [data-navigation-region="mobile-topbar"] { display: flex !important; }
  [data-navigation-region="mobile-bottom"] { display: block !important; }
}
@media (min-width: 768px) {
  [data-navigation-region="mobile-topbar"],
  [data-navigation-region="mobile-drawer"],
  [data-navigation-region="mobile-bottom"] { display: none !important; }
}
`;

const desktopSidebarStyle = {
  background: designTokens.colors.surface,
  borderRight: `1px solid ${designTokens.colors.border}`,
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto',
  minHeight: '100vh',
  padding: `${designTokens.spacing[5]} ${designTokens.spacing[4]}`
};

const brandStyle = {
  color: designTokens.colors.neutral900,
  fontSize: designTokens.typography.sizeMd,
  fontWeight: designTokens.typography.weightBold,
  padding: `${designTokens.spacing[3]} ${designTokens.spacing[2]}`,
  textDecoration: 'none'
};

const listStyle = {
  display: 'grid',
  gap: designTokens.spacing[1],
  marginTop: designTokens.spacing[5]
};

const compactListStyle = {
  display: 'grid',
  gap: designTokens.spacing[1]
};

const linkStyle = {
  borderRadius: designTokens.radii.md,
  color: designTokens.colors.neutral600,
  display: 'block',
  fontSize: designTokens.typography.sizeSm,
  minHeight: '44px',
  padding: `${designTokens.spacing[3]} ${designTokens.spacing[3]}`,
  textDecoration: 'none'
};

const activeLinkStyle = {
  ...linkStyle,
  background: designTokens.colors.neutral100,
  color: designTokens.colors.neutral900,
  fontWeight: designTokens.typography.weightBold
};

const recentSectionStyle = {
  alignSelf: 'start',
  display: 'grid',
  gap: designTokens.spacing[2],
  marginTop: designTokens.spacing[6]
};

const sectionLabelStyle = {
  color: designTokens.colors.neutral600,
  fontSize: '12px',
  padding: `0 ${designTokens.spacing[3]}`
};

const secondarySectionStyle = {
  borderTop: `1px solid ${designTokens.colors.border}`,
  paddingTop: designTokens.spacing[3]
};

const mobileTopbarStyle = {
  alignItems: 'center',
  background: designTokens.colors.surface,
  borderBottom: `1px solid ${designTokens.colors.border}`,
  display: 'none',
  justifyContent: 'space-between',
  minHeight: 56,
  padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
  position: 'sticky' as const,
  top: 0,
  zIndex: 20
};

const mobileBrandStyle = {
  ...brandStyle,
  padding: 0
};

const mobileMenuButtonStyle = {
  background: designTokens.colors.surface,
  border: `1px solid ${designTokens.colors.border}`,
  borderRadius: designTokens.radii.md,
  color: designTokens.colors.neutral900,
  minHeight: '44px',
  minWidth: '44px'
};

const mobileDrawerStyle = {
  background: designTokens.colors.surface,
  borderRight: `1px solid ${designTokens.colors.border}`,
  bottom: 0,
  boxShadow: designTokens.shadows.high,
  display: 'grid',
  left: 0,
  maxWidth: 300,
  padding: designTokens.spacing[5],
  position: 'fixed' as const,
  top: 0,
  transition: 'transform 200ms ease',
  width: '82vw',
  zIndex: 40
};

const scrimStyle = {
  background: 'rgba(15, 23, 42, 0.36)',
  border: 0,
  bottom: 0,
  left: 0,
  position: 'fixed' as const,
  right: 0,
  top: 0,
  zIndex: 30
};

const mobileBottomStyle = {
  background: designTokens.colors.surface,
  borderTop: `1px solid ${designTokens.colors.border}`,
  bottom: 0,
  display: 'none',
  left: 0,
  padding: designTokens.spacing[2],
  position: 'fixed' as const,
  right: 0,
  zIndex: 20
};
