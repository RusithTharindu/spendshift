'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useExpenseSheet } from '@/contexts/ExpenseSheetContext';
import Tap from '@/components/atoms/Tap';
import { IconHome, IconList, IconChart, IconTarget, IconSettings, IconPlus } from '@/components/atoms/Icons';

const NAV = [
  { id: 'dashboard', label: 'Home',      icon: <IconHome size={18} />,     href: '/dashboard' },
  { id: 'activity',  label: 'Activity',  icon: <IconList size={18} />,     href: '/activity' },
  { id: 'insights',  label: 'Insights',  icon: <IconChart size={18} />,    href: '/insights' },
  { id: 'budgets',   label: 'Budgets',   icon: <IconTarget size={18} />,   href: '/budgets' },
  { id: 'settings',  label: 'Settings',  icon: <IconSettings size={18} />, href: '/settings' },
];

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Home',     icon: <IconHome size={20} />,     href: '/dashboard' },
  { id: 'activity',  label: 'Activity', icon: <IconList size={20} />,     href: '/activity' },
  { id: 'insights',  label: 'Insights', icon: <IconChart size={20} />,    href: '/insights' },
  { id: 'settings',  label: 'Settings', icon: <IconSettings size={20} />, href: '/settings' },
];

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { state } = useApp();
  const { openExpense } = useExpenseSheet();
  const pathname = usePathname();

  const activeId = NAV.find(n => pathname.startsWith(n.href))?.id || 'dashboard';

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <nav className="app-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 18px 20px', borderBottom: '0.5px solid var(--line)' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-num)',
          }}>§</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>SpendShift</span>
        </div>

        <div style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(n => {
            const active = activeId === n.id;
            return (
              <Link key={n.id} href={n.href} style={{ textDecoration: 'none' }}>
                <Tap style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 'var(--r)',
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  border: '0.5px solid ' + (active ? 'var(--line)' : 'transparent'),
                  boxShadow: active ? 'var(--shadow-1)' : 'none',
                  transition: 'all 0.15s ease',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{n.icon}</span>
                  {n.label}
                </Tap>
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '0 10px 16px' }}>
          <Tap onClick={() => openExpense()} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px', borderRadius: 'var(--r)',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,.08),0 4px 14px var(--accent-soft)',
          }}>
            <IconPlus size={16} stroke={2.5} /> Add expense
          </Tap>
        </div>

        <div style={{ padding: '12px 14px', borderTop: '0.5px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            {(state.name || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{state.name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{state.baseCurrency}</div>
          </div>
          <Link href="/settings">
            <Tap style={{ color: 'var(--ink-3)' }}>
              <IconSettings size={15} />
            </Tap>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="app-content">
        <div className="anim-fade-up" style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="app-bottomnav" style={{ display: 'none' }}>
        <div className="app-bottomnav-inner">
          {BOTTOM_NAV.slice(0, 2).map(n => {
            const active = activeId === n.id;
            return (
              <Link key={n.id} href={n.href} style={{ textDecoration: 'none', flex: 1 }}>
                <Tap style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 14, color: active ? 'var(--ink)' : 'var(--ink-4)' }}>
                  {n.icon}
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.1 }}>{n.label}</span>
                </Tap>
              </Link>
            );
          })}

          {/* FAB */}
          <Tap onClick={() => openExpense()} style={{
            width: 50, height: 50, borderRadius: 18,
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px var(--accent-soft),0 1px 2px rgba(0,0,0,.1)',
            flexShrink: 0,
          }}>
            <IconPlus size={22} stroke={2.2} />
          </Tap>

          {BOTTOM_NAV.slice(2).map(n => {
            const active = activeId === n.id;
            return (
              <Link key={n.id} href={n.href} style={{ textDecoration: 'none', flex: 1 }}>
                <Tap style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 14, color: active ? 'var(--ink)' : 'var(--ink-4)' }}>
                  {n.icon}
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.1 }}>{n.label}</span>
                </Tap>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
