'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Budget } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { fmtMoney, getCategory } from '@/lib/utils';
import { CURRENCIES } from '@/lib/constants';
import Card from '@/components/atoms/Card';
import AnimNum from '@/components/atoms/AnimNum';
import Progress from '@/components/atoms/Progress';
import Empty from '@/components/atoms/Empty';
import Btn from '@/components/atoms/Button';
import Tap from '@/components/atoms/Tap';
import CatGlyph from '@/components/atoms/CategoryBadge';
import Sheet from '@/components/molecules/Sheet';
import PageHeader from '@/components/molecules/PageHeader';
import { IconPlus, IconChevR, IconTrash } from '@/components/atoms/Icons';

export default function BudgetsScreen() {
  const { state, saveBudget, deleteBudget } = useApp();
  const { budgets, expenses, categories, baseCurrency } = state;
  const [editing, setEditing] = useState<Budget | null>(null);

  const now = new Date();
  const monthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });

  const enriched = budgets.map(b => {
    const cat = getCategory(b.categoryId, categories);
    const spent = monthExp.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
    return { ...b, cat, spent };
  });

  const totalSpent = enriched.reduce((s, b) => s + b.spent, 0);
  const totalBudget = enriched.reduce((s, b) => s + b.amount, 0);

  const handleSave = async (b: Budget) => { await saveBudget(b); setEditing(null); };
  const handleDelete = async (id: string) => { await deleteBudget(id); setEditing(null); };

  return (
    <div className="page-wrap">
      <PageHeader title="Budgets" subtitle="Monthly spending caps"
        right={<Btn onClick={() => setEditing({ id: 'b_' + uuid().slice(0, 8), categoryId: categories[0]?.id || '', amount: 100, period: 'month' })} icon={<IconPlus size={15} stroke={2.5} />}>New</Btn>}
      />

      {enriched.length > 0 && (
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <div className="num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
              <AnimNum value={totalSpent} format={v => fmtMoney(v, baseCurrency)} />
            </div>
            <div className="num" style={{ fontSize: 14, color: 'var(--ink-3)' }}>of {fmtMoney(totalBudget, baseCurrency)}</div>
          </div>
          <Progress value={totalSpent} max={totalBudget} height={8} />
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
            {totalSpent > totalBudget
              ? <span style={{ color: 'var(--danger)' }}>Total over budget by {fmtMoney(totalSpent - totalBudget, baseCurrency)}</span>
              : `${fmtMoney(totalBudget - totalSpent, baseCurrency)} remaining across all budgets`}
          </div>
        </Card>
      )}

      {enriched.length === 0
        ? <Card><Empty glyph="◎" title="No budgets yet" hint="Set monthly caps per category to track your spending goals" /></Card>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
          {enriched.map(b => (
            <Tap key={b.id} onClick={() => setEditing(b)}>
              <Card style={{ padding: 18, height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <CatGlyph category={b.cat} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{b.cat.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>Monthly</div>
                  </div>
                  <IconChevR size={15} style={{ color: 'var(--ink-4)' }} />
                </div>
                <Progress value={b.spent} max={b.amount} color={b.cat.tone} height={6} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  <div className="num" style={{ fontSize: 13, fontWeight: 600, color: b.spent > b.amount ? 'var(--danger)' : 'var(--ink)' }}>
                    {fmtMoney(b.spent, baseCurrency)}
                  </div>
                  <div className="num" style={{ fontSize: 13, color: 'var(--ink-3)' }}>of {fmtMoney(b.amount, baseCurrency)}</div>
                </div>
                <div style={{ fontSize: 12, marginTop: 5, color: b.spent > b.amount ? 'var(--danger)' : 'var(--ink-3)' }}>
                  {b.spent > b.amount ? `Over by ${fmtMoney(b.spent - b.amount, baseCurrency)}` : `${fmtMoney(b.amount - b.spent, baseCurrency)} left`}
                </div>
              </Card>
            </Tap>
          ))}
        </div>
      }

      <Sheet open={!!editing} onClose={() => setEditing(null)}>
        {editing && <BudgetEditor budget={editing} categories={categories} baseCurrency={baseCurrency} onSave={handleSave} onDelete={handleDelete} onCancel={() => setEditing(null)} />}
      </Sheet>
    </div>
  );
}

function BudgetEditor({ budget, categories, baseCurrency, onSave, onDelete, onCancel }: {
  budget: Budget; categories: { id: string; name: string; glyph: string; tone: string }[];
  baseCurrency: string; onSave: (b: Budget) => void; onDelete: (id: string) => void; onCancel: () => void;
}) {
  const [categoryId, setCategoryId] = useState(budget.categoryId);
  const [amount, setAmount] = useState(String(budget.amount || ''));
  const isNew = budget.amount === 100 && !('spent' in budget);
  const sym = CURRENCIES.find(c => c.code === baseCurrency)?.symbol || '$';

  return (
    <div className="ss-scroll" style={{ padding: '4px 20px 28px', overflowY: 'auto', maxHeight: '85dvh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 18px' }}>
        <Tap onClick={onCancel} style={{ fontSize: 14, color: 'var(--ink-3)' }}>Cancel</Tap>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Budget</div>
        <Tap onClick={() => { const a = parseFloat(amount); if (a > 0 && categoryId) onSave({ ...budget, categoryId, amount: a }); }}
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>Save</Tap>
      </div>

      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Category</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 20 }}>
        {categories.map(c => (
          <Tap key={c.id} onClick={() => setCategoryId(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 14,
            background: categoryId === c.id ? c.tone + '18' : 'var(--bg-2)',
            border: '0.5px solid ' + (categoryId === c.id ? c.tone : 'transparent'),
          }}>
            <CatGlyph category={c} size={24} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{c.name.split(' ')[0]}</span>
          </Tap>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Monthly limit</div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-2)', borderRadius: 'var(--r)', border: '0.5px solid var(--line)' }}>
        <span className="num" style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink-3)', marginRight: 8 }}>{sym}</span>
        <input type="text" inputMode="decimal" value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontFamily: 'var(--font-num)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }} />
      </div>

      {!isNew && (
        <Tap onClick={() => onDelete(budget.id)} style={{ marginTop: 20, padding: '13px 16px', borderRadius: 'var(--r)', background: 'var(--danger-soft)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
          <IconTrash size={15} /> Remove budget
        </Tap>
      )}
    </div>
  );
}
