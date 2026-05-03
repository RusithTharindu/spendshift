'use client';

import { MouseEvent } from 'react';

interface ToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ on, onChange }: ToggleProps) {
  return (
    <div
      onClick={(e: MouseEvent) => { e.stopPropagation(); onChange(!on); }}
      style={{
        width: 40, height: 24, borderRadius: 12,
        background: on ? 'var(--accent)' : 'var(--line-2)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.2s ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 19 : 3,
        width: 18, height: 18, borderRadius: 9,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.18)',
        transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}
