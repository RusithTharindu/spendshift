'use client';

import { CSSProperties, ReactNode, MouseEvent } from 'react';
import Tap from './Tap';

interface IconBtnProps {
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  label?: string;
  style?: CSSProperties;
  accent?: boolean;
}

export default function IconBtn({ icon, onClick, label, style, accent }: IconBtnProps) {
  return (
    <Tap onClick={onClick} title={label} style={{
      width: 38, height: 38, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent ? '#fff' : 'var(--ink-2)',
      background: accent ? 'var(--accent)' : 'var(--bg-2)',
      border: '0.5px solid ' + (accent ? 'transparent' : 'var(--line)'),
      flexShrink: 0,
      ...style,
    }}>
      {icon}
    </Tap>
  );
}
