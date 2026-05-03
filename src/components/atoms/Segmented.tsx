'use client';

import { CSSProperties } from 'react';

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
  style?: CSSProperties;
}

export default function Segmented({ value, options, onChange, style }: SegmentedProps) {
  return (
    <div style={{ display: 'flex', padding: 3, background: 'var(--bg-2)', borderRadius: 14, ...style }}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex: 1, padding: '8px 12px', border: 0, borderRadius: 10,
            background: active ? 'var(--surface)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: active ? 'var(--shadow-1)' : 'none',
            transition: 'all 0.18s ease',
          }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
