import { CURRENCIES, DEFAULT_CATEGORIES, ACCENTS } from './constants';
import type { Expense, Category, Budget } from './types';

export function fmtMoney(amount: number, currency: string): string {
  const c = CURRENCIES.find(x => x.code === currency) || { symbol: currency };
  const n = Math.abs(amount);
  const isInt = currency === 'JPY' || currency === 'KRW';
  const formatted = isInt
    ? Math.round(n).toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return c.symbol + formatted;
}

export function fmtDate(iso: string, mode: 'short' | 'relative' = 'short'): string {
  const d = new Date(iso);
  const now = new Date();
  if (mode === 'relative') {
    if (d.toDateString() === now.toDateString()) return 'Today';
    const yest = new Date(now); yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

interface DateGroup {
  key: string;
  label: string;
  items: Expense[];
}

export function groupByDate(expenses: Expense[]): DateGroup[] {
  const groups: Record<string, Expense[]> = {};
  expenses.forEach(e => {
    const k = new Date(e.date).toDateString();
    (groups[k] = groups[k] || []).push(e);
  });
  return Object.entries(groups)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([k, items]) => ({ key: k, label: fmtDate(items[0].date, 'relative'), items }));
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + e.amount, 0);
}

export function getCategory(id: string, categories: Category[]): Category {
  return categories.find(c => c.id === id) || { id: 'unknown', name: 'Uncategorized', glyph: '?', tone: '#807C73' };
}

export function getAccent(id: string) {
  return ACCENTS.find(a => a.id === id) || ACCENTS[0];
}

export function buildSampleExpenses(baseCurrency = 'USD'): Expense[] {
  const now = new Date();
  const day = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    d.setHours(9 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);
    return d.toISOString();
  };
  const items = [
    { merchant: 'Morning Espresso',     amount: 4.50,   cat: 'food',      d: 0,  note: 'Cortado at the corner spot' },
    { merchant: 'Whole Foods',          amount: 64.20,  cat: 'groceries', d: 0 },
    { merchant: 'Uber',                 amount: 12.40,  cat: 'transport', d: 1 },
    { merchant: 'Netflix',              amount: 15.99,  cat: 'leisure',   d: 1, recurring: true },
    { merchant: 'Lunch — Soba',         amount: 18.00,  cat: 'food',      d: 2 },
    { merchant: 'Pharmacy',             amount: 23.40,  cat: 'health',    d: 3 },
    { merchant: 'Bookstore',            amount: 28.00,  cat: 'shopping',  d: 4, note: 'Two paperbacks' },
    { merchant: 'Train pass',           amount: 84.00,  cat: 'transport', d: 5, recurring: true },
    { merchant: "Trader Joe's",         amount: 42.10,  cat: 'groceries', d: 5 },
    { merchant: 'Dinner — friends',     amount: 56.00,  cat: 'food',      d: 6 },
    { merchant: 'Internet',             amount: 49.00,  cat: 'home',      d: 7, recurring: true },
    { merchant: 'Coffee beans',         amount: 22.50,  cat: 'groceries', d: 8 },
    { merchant: 'Pottery class',        amount: 45.00,  cat: 'leisure',   d: 9, currency: 'EUR', amountOriginal: 41.50, rate: 1.0843 },
    { merchant: 'Gym',                  amount: 32.00,  cat: 'health',    d: 10, recurring: true },
    { merchant: 'Hardware store',       amount: 17.85,  cat: 'home',      d: 11 },
    { merchant: 'Lunch — bowl',         amount: 14.00,  cat: 'food',      d: 12 },
    { merchant: 'Taxi',                 amount: 18.20,  cat: 'transport', d: 13 },
    { merchant: 'Farmers market',       amount: 31.40,  cat: 'groceries', d: 14 },
    { merchant: 'Concert',              amount: 65.00,  cat: 'leisure',   d: 15 },
    { merchant: 'Electric bill',        amount: 78.50,  cat: 'home',      d: 16, recurring: true },
    { merchant: 'New jacket',           amount: 124.00, cat: 'shopping',  d: 17 },
    { merchant: 'Brunch',               amount: 24.50,  cat: 'food',      d: 18 },
    { merchant: 'Train — weekend trip', amount: 58.00,  cat: 'travel',    d: 19 },
    { merchant: 'Hotel — one night',    amount: 142.00, cat: 'travel',    d: 20, currency: 'EUR', amountOriginal: 131.00, rate: 1.0840 },
  ] as Array<{
    merchant: string; amount: number; cat: string; d: number;
    note?: string; recurring?: boolean; currency?: string; amountOriginal?: number; rate?: number;
  }>;

  return items.map((it, i) => ({
    id: 'sample_' + i,
    date: day(it.d),
    merchant: it.merchant,
    amount: it.amount,
    currency: it.currency || baseCurrency,
    amountOriginal: it.amountOriginal,
    rate: it.rate,
    categoryId: it.cat,
    note: it.note || '',
    recurring: !!it.recurring,
  }));
}

export function buildSampleBudgets(): Budget[] {
  return [
    { id: 'sample_b1', categoryId: 'food',      amount: 350, period: 'month' },
    { id: 'sample_b2', categoryId: 'groceries', amount: 400, period: 'month' },
    { id: 'sample_b3', categoryId: 'transport', amount: 150, period: 'month' },
    { id: 'sample_b4', categoryId: 'leisure',   amount: 120, period: 'month' },
  ];
}
