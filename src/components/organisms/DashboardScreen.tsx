'use client';

import { useApp } from '@/contexts/AppContext';
import { useExpenseSheet } from '@/contexts/ExpenseSheetContext';
import { sumExpenses, fmtMoney, getCategory } from '@/lib/utils';
import Card from '@/components/atoms/Card';
import AnimNum from '@/components/atoms/AnimNum';
import Progress from '@/components/atoms/Progress';
import Empty from '@/components/atoms/Empty';
import CatGlyph from '@/components/atoms/CategoryBadge';
import Btn from '@/components/atoms/Button';
import Tap from '@/components/atoms/Tap';
import SpendingBars from '@/components/molecules/SpendingBars';
import SectionHeader from '@/components/molecules/SectionHeader';
import ExpenseRow from '@/components/molecules/ExpenseRow';
import { IconPlus, IconChevR } from '@/components/atoms/Icons';
import Link from 'next/link';

export default function DashboardScreen() {
  const { state } = useApp();
  const { openExpense } = useExpenseSheet();
  const { expenses, baseCurrency, name, accent, categories, budgets } = state;

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExp = expenses.filter(e => new Date(e.date) >= startMonth);
  const totalMonth = sumExpenses(monthExp);

  const startWeek = new Date(now); startWeek.setDate(now.getDate() - 6); startWeek.setHours(0, 0, 0, 0);
  const weekExp = expenses.filter(e => new Date(e.date) >= startWeek);

  const days30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (29 - i)); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    return expenses.filter(e => { const ed = new Date(e.date); return ed >= d && ed < next; }).reduce((s, e) => s + e.amount, 0);
  });

  const byCat: Record<string, number> = {};
  monthExp.forEach(e => { byCat[e.categoryId] = (byCat[e.categoryId] || 0) + e.amount; });
  const topCats = Object.entries(byCat)
    .map(([id, value]) => ({ id, value, cat: getCategory(id, categories) }))
    .sort((a, b) => b.value - a.value).slice(0, 4);

  const recent = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const hotBudget = budgets.map(b => {
    const spent = monthExp.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
    return { ...b, spent, pct: spent / b.amount, cat: getCategory(b.categoryId, categories) };
  }).sort((a, b) => b.pct - a.pct)[0];

  const h = now.getHours();
  const greet = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-wrap">
      <div style={{ paddingBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {greet}, {name}
          </h1>
          <Btn onClick={() => openExpense()} icon={<IconPlus size={15} stroke={2.5} />}>Add expense</Btn>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' }}>This month</div>
          <div className="num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginTop: 4, letterSpacing: '-0.025em' }}>
            <AnimNum value={totalMonth} format={v => fmtMoney(v, baseCurrency)} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{monthExp.length} expenses</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Last 7 days</div>
          <div className="num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginTop: 4, letterSpacing: '-0.025em' }}>
            <AnimNum value={sumExpenses(weekExp)} format={v => fmtMoney(v, baseCurrency)} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{weekExp.length} expenses</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Daily avg</div>
          <div className="num" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginTop: 4, letterSpacing: '-0.025em' }}>
            <AnimNum value={totalMonth / Math.max(now.getDate(), 1)} format={v => fmtMoney(v, baseCurrency)} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{now.getDate()} days in</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {/* 30-day chart */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>30-day spending</div>
            <Link href="/insights">
              <Tap style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Insights <IconChevR size={13} stroke={2} />
              </Tap>
            </Link>
          </div>
          <SpendingBars days={days30} accentColor={accent.color} />
        </Card>

        {/* 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
          {/* Top categories */}
          <div>
            <SectionHeader label="Top categories this month" action={
              <Link href="/insights"><Tap style={{ fontSize: 11, color: 'var(--ink-3)' }}>See all →</Tap></Link>
            } />
            <Card padded={false} style={{ overflow: 'hidden' }}>
              {topCats.length === 0
                ? <Empty title="No expenses yet" hint="Tap 'Add expense' to get started" />
                : topCats.map((c, i) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i ? '0.5px solid var(--line)' : 0 }}>
                    <CatGlyph category={c.cat} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{c.cat.name}</div>
                      <Progress value={c.value} max={totalMonth} color={c.cat.tone} height={4} />
                    </div>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>
                      {fmtMoney(c.value, baseCurrency)}
                    </div>
                  </div>
                ))
              }
            </Card>
          </div>

          {/* Budget spotlight */}
          <div>
            <SectionHeader label="Budget spotlight" />
            {hotBudget
              ? (
                <Card style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <CatGlyph category={hotBudget.cat} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{hotBudget.cat.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>Monthly budget</div>
                    </div>
                    <Link href="/budgets"><Tap style={{ fontSize: 11, color: 'var(--ink-3)' }}>All →</Tap></Link>
                  </div>
                  <Progress value={hotBudget.spent} max={hotBudget.amount} color={hotBudget.cat.tone} height={7} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: hotBudget.pct > 1 ? 'var(--danger)' : 'var(--ink)' }}>
                      {fmtMoney(hotBudget.spent, baseCurrency)}
                    </div>
                    <div className="num" style={{ fontSize: 13, color: 'var(--ink-3)' }}>of {fmtMoney(hotBudget.amount, baseCurrency)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>
                    {hotBudget.pct > 1
                      ? <span style={{ color: 'var(--danger)' }}>Over by {fmtMoney(hotBudget.spent - hotBudget.amount, baseCurrency)}</span>
                      : `${fmtMoney(hotBudget.amount - hotBudget.spent, baseCurrency)} remaining`}
                  </div>
                </Card>
              )
              : <Card><Empty glyph="◎" title="No budgets" hint="Set monthly caps in Budgets" /></Card>
            }
          </div>
        </div>

        {/* Recent */}
        <div>
          <SectionHeader label="Recent activity" action={
            <Link href="/activity"><Tap style={{ fontSize: 11, color: 'var(--ink-3)' }}>See all →</Tap></Link>
          } />
          <Card padded={false} style={{ overflow: 'hidden' }}>
            {recent.length === 0
              ? <Empty title="Nothing logged" hint="Your latest expenses will appear here" />
              : recent.map((e, i) => (
                <ExpenseRow key={e.id} expense={e} categories={categories} baseCurrency={baseCurrency} first={i === 0} onClick={openExpense} />
              ))
            }
          </Card>
        </div>
      </div>
    </div>
  );
}
