'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { sumExpenses, fmtMoney, getCategory } from '@/lib/utils';
import Card from '@/components/atoms/Card';
import AnimNum from '@/components/atoms/AnimNum';
import Donut from '@/components/atoms/Donut';
import Segmented from '@/components/atoms/Segmented';
import PageHeader from '@/components/molecules/PageHeader';

type Period = 'week' | 'month' | 'year';

export default function InsightsScreen() {
  const { state } = useApp();
  const { expenses, baseCurrency, categories, accent } = state;
  const [period, setPeriod] = useState<Period>('month');

  const now = new Date();
  let start: Date;
  if (period === 'week') { start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0, 0, 0, 0); }
  else if (period === 'month') { start = new Date(now.getFullYear(), now.getMonth(), 1); }
  else { start = new Date(now.getFullYear(), 0, 1); }

  const inRange = expenses.filter(e => new Date(e.date) >= start);
  const total = sumExpenses(inRange);

  const byCat: Record<string, number> = {};
  inRange.forEach(e => { byCat[e.categoryId] = (byCat[e.categoryId] || 0) + e.amount; });
  const catData = Object.entries(byCat)
    .map(([id, value]) => ({ id, value, cat: getCategory(id, categories) }))
    .sort((a, b) => b.value - a.value);

  let series: { sum: number; label: string; d?: Date }[] = [];
  if (period === 'week') {
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const sum = inRange.filter(e => { const ed = new Date(e.date); return ed >= d && ed < next; }).reduce((s, e) => s + e.amount, 0);
      series.push({ sum, label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2) });
    }
  } else if (period === 'month') {
    const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 0; i < dim; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const sum = inRange.filter(e => { const ed = new Date(e.date); return ed >= d && ed < next; }).reduce((s, e) => s + e.amount, 0);
      series.push({ sum, label: String(d.getDate()), d });
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), i, 1); const next = new Date(now.getFullYear(), i + 1, 1);
      const sum = inRange.filter(e => { const ed = new Date(e.date); return ed >= d && ed < next; }).reduce((s, e) => s + e.amount, 0);
      series.push({ sum, label: d.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3) });
    }
  }
  const maxBar = Math.max(...series.map(s => s.sum), 1);

  const donutData = catData.slice(0, 6).map(c => ({ value: c.value, color: c.cat.tone, label: c.cat.name }));
  if (catData.length > 6) donutData.push({ value: catData.slice(6).reduce((s, c) => s + c.value, 0), color: 'var(--ink-4)', label: 'Other' });

  const byMerchant: Record<string, number> = {};
  inRange.forEach(e => { byMerchant[e.merchant] = (byMerchant[e.merchant] || 0) + e.amount; });
  const topMerch = Object.entries(byMerchant).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="page-wrap">
      <PageHeader title="Insights" />
      <Segmented value={period} onChange={v => setPeriod(v as Period)} style={{ marginBottom: 16 }} options={[
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]} />

      <Card style={{ padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Total · {period === 'week' ? '7 days' : period === 'month' ? 'this month' : 'this year'}
            </div>
            <div className="num" style={{ fontSize: 34, fontWeight: 700, color: 'var(--ink)', marginTop: 4, letterSpacing: '-0.025em' }}>
              <AnimNum value={total} format={v => fmtMoney(v, baseCurrency)} />
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{inRange.length} expenses</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: period === 'month' ? 2 : 5, height: 80 }}>
          {series.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%', minWidth: 2, maxWidth: 32,
                height: Math.max((s.sum / maxBar) * 70, 2),
                borderRadius: 4,
                background: s.sum > 0 ? accent.color : 'var(--line)',
                transition: 'height 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                transitionDelay: i * 10 + 'ms',
              }} />
              {(period !== 'month' || i % 5 === 0) && (
                <div style={{ fontSize: 9, color: 'var(--ink-3)', fontFamily: 'var(--font-num)' }}>{s.label}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12, marginBottom: 12 }}>
        {/* Donut + categories */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16 }}>By category</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Donut data={donutData} size={130} thickness={13} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{catData.length}</div>
                <div style={{ fontSize: 9, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>cats</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {catData.slice(0, 5).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c.cat.tone, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.cat.name}</div>
                  <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', flexShrink: 0 }}>{Math.round((c.value / total) * 100)}%</div>
                </div>
              ))}
              {catData.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>No data</div>}
            </div>
          </div>
        </Card>

        {period === 'month' && <Heatmap series={series as { sum: number; label: string; d: Date }[]} accentColor={accent.color} />}

        {/* Top merchants */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Top merchants</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topMerch.map(([m, v], i) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="num" style={{ width: 18, fontSize: 10, color: 'var(--ink-3)' }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</div>
                <div className="num" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>{fmtMoney(v, baseCurrency)}</div>
              </div>
            ))}
            {topMerch.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>No data</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Heatmap({ series, accentColor }: { series: { sum: number; label: string; d: Date }[]; accentColor: string }) {
  const max = Math.max(...series.map(s => s.sum), 1);
  const first = series[0];
  if (!first) return null;
  const startDow = first.d.getDay();
  const cells: (typeof series[0] | null)[] = [...Array(startDow).fill(null), ...series];
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Daily heatmap</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ fontSize: 9, color: 'var(--ink-3)', textAlign: 'center', fontFamily: 'var(--font-num)' }}>{d}</div>
        ))}
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const intensity = c.sum / max;
          return (
            <div key={i} title={`${c.d.toLocaleDateString()}: ${c.sum.toFixed(2)}`} style={{
              aspectRatio: '1', borderRadius: 5,
              background: c.sum === 0 ? 'var(--bg-2)' : accentColor,
              opacity: c.sum === 0 ? 1 : 0.18 + intensity * 0.82,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: intensity > 0.6 ? '#fff' : 'var(--ink-3)',
              fontFamily: 'var(--font-num)',
            }}>{c.d.getDate()}</div>
          );
        })}
      </div>
    </Card>
  );
}
