'use client';

import { useState } from 'react';
import { CURRENCIES } from '@/lib/constants';
import Tap from '@/components/atoms/Tap';
import { IconSearch, IconCheck } from '@/components/atoms/Icons';

interface CurrencyPickerProps {
  value: string;
  onSelect: (code: string) => void;
}

export default function CurrencyPicker({ value, onSelect }: CurrencyPickerProps) {
  const [q, setQ] = useState('');
  const filtered = CURRENCIES.filter(c =>
    !q || c.code.toLowerCase().includes(q.toLowerCase()) || c.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '80dvh' }}>
      <div style={{ padding: '4px 20px 12px', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Base currency</div>
      <div style={{
        margin: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r)',
        border: '0.5px solid var(--line)',
      }}>
        <IconSearch size={15} style={{ color: 'var(--ink-3)' }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search currency…"
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)' }} />
      </div>
      <div className="ss-scroll" style={{ overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.map(c => (
          <Tap key={c.code} onClick={() => onSelect(c.code)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 'var(--r)',
            background: value === c.code ? 'var(--accent-soft)' : 'transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="num" style={{
                width: 34, height: 34, borderRadius: 10,
                background: value === c.code ? 'var(--accent)' : 'var(--bg-2)',
                color: value === c.code ? '#fff' : 'var(--ink-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600,
              }}>{c.symbol}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{c.code}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.name}</div>
              </div>
            </div>
            {value === c.code && <IconCheck size={16} stroke={2} style={{ color: 'var(--accent)' }} />}
          </Tap>
        ))}
      </div>
    </div>
  );
}
