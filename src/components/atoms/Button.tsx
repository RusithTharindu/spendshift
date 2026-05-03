'use client';

import { CSSProperties, ReactNode, MouseEvent } from 'react';
import Tap from './Tap';

interface BtnProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  style?: CSSProperties;
  disabled?: boolean;
}

export default function Btn({ children, onClick, icon, variant = 'primary', style, disabled }: BtnProps) {
  const isPrimary = variant === 'primary';
  return (
    <Tap onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      padding: '11px 18px', borderRadius: 'var(--r)',
      minHeight: 42,
      background: isPrimary ? 'var(--accent)' : 'var(--bg-2)',
      color: isPrimary ? '#fff' : 'var(--ink)',
      border: isPrimary ? 'none' : '0.5px solid var(--line)',
      fontSize: 14, fontWeight: 600,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      boxShadow: isPrimary ? '0 1px 2px rgba(0,0,0,.08),0 4px 12px var(--accent-soft)' : 'none',
      ...style,
    }}>
      {icon && icon}{children}
    </Tap>
  );
}
