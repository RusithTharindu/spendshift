'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { ACCENTS } from '@/lib/constants';
import Card from '@/components/atoms/Card';
import Tap from '@/components/atoms/Tap';
import Sheet from '@/components/molecules/Sheet';
import SectionHeader from '@/components/molecules/SectionHeader';
import PageHeader from '@/components/molecules/PageHeader';
import CurrencyPicker from '@/components/molecules/CurrencyPicker';
import { IconCheck, IconChevR, IconWallet, IconTarget, IconExport, IconTrash, IconRepeat, IconSun, IconMoon, Icon } from '@/components/atoms/Icons';

export default function SettingsScreen() {
  const { state, updateUser, clearExpenses, resetData } = useApp();
  const { name, baseCurrency, theme, accent, categories, budgets } = state;
  const [showCurrency, setShowCurrency] = useState(false);
  const [showAccent, setShowAccent] = useState(false);

  function SettingRow({ icon, label, value, onClick, danger }: { icon: ReactNode; label: string; value?: string | number; onClick?: () => void; danger?: boolean }) {
    return (
      <Tap onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '0.5px solid var(--line)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: danger ? 'var(--danger-soft)' : 'var(--bg-2)', color: danger ? 'var(--danger)' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div style={{ flex: 1, fontSize: 14, color: danger ? 'var(--danger)' : 'var(--ink)' }}>{label}</div>
        {value !== undefined && <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{value}</div>}
        {!danger && <IconChevR size={15} style={{ color: 'var(--ink-4)' }} />}
      </Tap>
    );
  }

  const themeOpts = [
    { id: 'light' as const, label: 'Light', icon: <IconSun size={16} /> },
    { id: 'dark' as const, label: 'Dark', icon: <IconMoon size={16} /> },
    { id: 'system' as const, label: 'System', icon: <Icon size={16}><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /></Icon> },
  ];

  const handleExportCSV = () => {
    const { expenses } = state;
    if (!expenses.length) return;
    const rows = [
      ['Date', 'Merchant', 'Amount', 'Currency', 'Category', 'Note', 'Recurring'],
      ...expenses.map(e => [
        new Date(e.date).toLocaleDateString(),
        e.merchant,
        e.amount.toFixed(2),
        e.currency,
        categories.find(c => c.id === e.categoryId)?.name || e.categoryId,
        e.note,
        e.recurring ? 'Yes' : 'No',
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'spendshift-export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrap">
      <PageHeader title="Settings" />

      <Card style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
            {(name || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <input value={name} onChange={e => updateUser({ name: e.target.value })}
              style={{ width: '100%', border: 0, outline: 'none', background: 'transparent', fontSize: 17, fontWeight: 600, color: 'var(--ink)' }} />
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Local-only · no sync</div>
          </div>
        </div>
      </Card>

      <SectionHeader label="Appearance" />
      <Card padded={false} style={{ overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '14px 18px', borderBottom: '0.5px solid var(--line)' }}>
          <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 12 }}>Appearance</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {themeOpts.map(opt => {
              const active = theme === opt.id;
              return (
                <Tap key={opt.id} onClick={() => updateUser({ theme: opt.id })} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: active ? 'var(--accent-soft)' : 'var(--bg-2)',
                  border: '0.5px solid ' + (active ? 'var(--accent)' : 'transparent'),
                }}>
                  <span style={{ color: active ? 'var(--accent)' : 'var(--ink-3)' }}>{opt.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: active ? 'var(--accent)' : 'var(--ink-3)' }}>{opt.label}</span>
                </Tap>
              );
            })}
          </div>
        </div>
        <SettingRow icon={<div style={{ width: 14, height: 14, borderRadius: 5, background: 'var(--accent)' }} />}
          label="Accent color" value={accent.label} onClick={() => setShowAccent(true)} />
        <SettingRow icon={<IconWallet size={16} />} label="Base currency" value={baseCurrency} onClick={() => setShowCurrency(true)} />
      </Card>

      <SectionHeader label="Data" />
      <Card padded={false} style={{ overflow: 'hidden', marginBottom: 14 }}>
        <Link href="/categories" style={{ textDecoration: 'none' }}>
          <SettingRow icon={<div style={{ fontSize: 14, fontFamily: 'var(--font-num)' }}>◇</div>} label="Categories" value={categories.length} />
        </Link>
        <Link href="/budgets" style={{ textDecoration: 'none' }}>
          <SettingRow icon={<IconTarget size={16} />} label="Budgets" value={budgets.length} />
        </Link>
        <SettingRow icon={<IconExport size={16} />} label="Export to CSV" onClick={handleExportCSV} />
      </Card>

      <SectionHeader label="Danger zone" />
      <Card padded={false} style={{ overflow: 'hidden', marginBottom: 14 }}>
        <SettingRow danger icon={<IconTrash size={15} />} label="Clear all expenses"
          onClick={() => { if (confirm('Clear all expenses? Cannot be undone.')) clearExpenses(); }} />
        <Tap onClick={() => { if (confirm('Reset SpendShift and restart onboarding?')) resetData(); }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconRepeat size={15} />
          </div>
          <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>Reset & restart onboarding</div>
        </Tap>
      </Card>

      <div style={{ textAlign: 'center', padding: '12px 0 8px', fontSize: 11, color: 'var(--ink-4)' }}>
        SpendShift · local-only · v1.0
      </div>

      <Sheet open={showCurrency} onClose={() => setShowCurrency(false)}>
        <CurrencyPicker value={baseCurrency} onSelect={c => { updateUser({ baseCurrency: c }); setShowCurrency(false); }} />
      </Sheet>
      <Sheet open={showAccent} onClose={() => setShowAccent(false)}>
        <div style={{ padding: '4px 20px 28px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', padding: '8px 0 16px' }}>Accent color</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
            {ACCENTS.map(a => {
              const active = accent.id === a.id;
              return (
                <Tap key={a.id} onClick={() => { updateUser({ accentId: a.id }); setShowAccent(false); }} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                  padding: '10px 6px', borderRadius: 'var(--r)', background: 'var(--surface)',
                  border: '0.5px solid ' + (active ? a.color : 'var(--line)'),
                  boxShadow: active ? '0 0 0 3px ' + a.color + '22' : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {active && <IconCheck size={16} stroke={2.5} style={{ color: '#fff' }} />}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--ink)', textAlign: 'center' }}>{a.label}</div>
                </Tap>
              );
            })}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
