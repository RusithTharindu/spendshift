'use client';

import { Expense, Category } from '@/lib/types';
import { fmtMoney, fmtDate } from '@/lib/utils';
import CatGlyph from '@/components/atoms/CategoryBadge';
import Tap from '@/components/atoms/Tap';
import { IconRepeat } from '@/components/atoms/Icons';

interface ExpenseRowProps {
  expense: Expense;
  categories: Category[];
  baseCurrency: string;
  first?: boolean;
  onClick: (expense: Expense) => void;
}

export default function ExpenseRow({ expense, categories, baseCurrency, first, onClick }: ExpenseRowProps) {
  const cat = categories.find(c => c.id === expense.categoryId) || { id: 'unknown', name: 'Uncategorized', glyph: '?', tone: '#807C73' };
  return (
    <Tap onClick={() => onClick(expense)} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 18px',
      borderTop: first ? 0 : '0.5px solid var(--line)',
    }}>
      <CatGlyph category={cat} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 14, fontWeight: 500, color: 'var(--ink)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{expense.merchant}</span>
          {expense.recurring && <IconRepeat size={11} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
          {cat.name} · {fmtDate(expense.date, 'relative')}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="num" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
          {fmtMoney(expense.amount, baseCurrency)}
        </div>
        {expense.currency !== baseCurrency && expense.amountOriginal !== undefined && (
          <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>
            {fmtMoney(expense.amountOriginal, expense.currency)}
          </div>
        )}
      </div>
    </Tap>
  );
}
