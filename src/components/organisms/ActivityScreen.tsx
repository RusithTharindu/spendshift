'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useExpenseSheet } from '@/contexts/ExpenseSheetContext';
import { groupByDate, sumExpenses, fmtMoney, getCategory } from '@/lib/utils';
import Card from '@/components/atoms/Card';
import Empty from '@/components/atoms/Empty';
import CatGlyph from '@/components/atoms/CategoryBadge';
import Tap from '@/components/atoms/Tap';
import IconBtn from '@/components/atoms/IconButton';
import Sheet from '@/components/molecules/Sheet';
import PageHeader from '@/components/molecules/PageHeader';
import ExpenseRow from '@/components/molecules/ExpenseRow';
import { IconSearch, IconClose, IconFilter, IconCheck } from '@/components/atoms/Icons';

export default function ActivityScreen() {
  const { state } = useApp();
  const { openExpense } = useExpenseSheet();
  const { expenses, baseCurrency, categories } = state;
  const [q, setQ] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = expenses
    .filter(e => !q || e.merchant.toLowerCase().includes(q.toLowerCase()) || (e.note || '').toLowerCase().includes(q.toLowerCase()))
    .filter(e => !filterCat || e.categoryId === filterCat);

  const groups = groupByDate(filtered);
  const total = sumExpenses(filtered);

  return (
    <div className="page-wrap">
      <PageHeader title="Activity"
        subtitle={`${filtered.length} expenses · ${fmtMoney(total, baseCurrency)}`}
        right={
          <IconBtn icon={<IconFilter size={16} />} onClick={() => setFilterOpen(true)}
            label="Filter" style={filterCat ? { background: 'var(--accent)', color: '#fff', border: 'none' } : {}} />
        }
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface)', border: '0.5px solid var(--line)', borderRadius: 'var(--r)', marginBottom: 14 }}>
        <IconSearch size={16} style={{ color: 'var(--ink-3)', flexShrink: 0 }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search expenses…"
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)' }} />
        {q && <Tap onClick={() => setQ('')} style={{ color: 'var(--ink-3)' }}><IconClose size={14} /></Tap>}
      </div>

      {filterCat && (
        <div style={{ marginBottom: 12 }}>
          <Tap onClick={() => setFilterCat(null)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 999,
            background: 'var(--accent-soft)', fontSize: 12, color: 'var(--accent)', fontWeight: 500,
          }}>
            {getCategory(filterCat, categories).name}
            <IconClose size={11} />
          </Tap>
        </div>
      )}

      {groups.length === 0
        ? <Card><Empty title="Nothing found" hint="Try a different search or remove the filter" /></Card>
        : groups.map(g => (
          <div key={g.key} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px 8px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{g.label}</div>
              <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{fmtMoney(sumExpenses(g.items), baseCurrency)}</div>
            </div>
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {g.items.map((e, i) => <ExpenseRow key={e.id} expense={e} categories={categories} baseCurrency={baseCurrency} first={i === 0} onClick={openExpense} />)}
            </Card>
          </div>
        ))
      }

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)}>
        <div style={{ padding: '4px 20px 28px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', padding: '8px 0 16px' }}>Filter by category</div>
          <Tap onClick={() => { setFilterCat(null); setFilterOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '0.5px solid var(--line)' }}>
            <span style={{ fontSize: 14, color: 'var(--ink)' }}>All categories</span>
            {!filterCat && <IconCheck size={16} stroke={2} style={{ color: 'var(--accent)' }} />}
          </Tap>
          {categories.map(c => (
            <Tap key={c.id} onClick={() => { setFilterCat(c.id); setFilterOpen(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '0.5px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CatGlyph category={c} size={30} />
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>{c.name}</span>
              </div>
              {filterCat === c.id && <IconCheck size={16} stroke={2} style={{ color: 'var(--accent)' }} />}
            </Tap>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
