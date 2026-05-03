'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppState, Expense, Budget, Category, Tweaks } from '@/lib/types';
import { ACCENTS, DEFAULT_CATEGORIES, FONT_PAIRS } from '@/lib/constants';
import { buildSampleExpenses, buildSampleBudgets, getAccent } from '@/lib/utils';

interface AppContextValue {
  state: AppState;
  tweaks: Tweaks;
  loading: boolean;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  // expense actions
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearExpenses: () => Promise<void>;
  // budget actions
  saveBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  // category actions
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // user actions
  finishOnboarding: (data: {
    currency: string; accentId: string; theme: 'light' | 'dark' | 'system'; sampleData: boolean;
  }) => Promise<void>;
  updateUser: (data: Partial<AppState>) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const DEFAULT_TWEAKS: Tweaks = {
  density: 'comfortable',
  currency: 'USD',
  fontPair: 'inter-jetbrains',
  accentId: 'sage',
  animationLevel: 6,
  sampleData: false,
  theme: 'light',
};

function getStoredTweaks(): Tweaks {
  if (typeof window === 'undefined') return DEFAULT_TWEAKS;
  try {
    const s = localStorage.getItem('spendshift_tweaks');
    if (s) return { ...DEFAULT_TWEAKS, ...JSON.parse(s) };
  } catch {}
  return DEFAULT_TWEAKS;
}

function applyTheme(theme: string) {
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.setAttribute('data-theme', resolved);
}

function applyAccent(color: string, ink: string) {
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-soft', color + '22');
  document.documentElement.style.setProperty('--accent-ink', ink);
}

function applyFontPair(fontPair: string) {
  const fp = FONT_PAIRS[fontPair as keyof typeof FONT_PAIRS] || FONT_PAIRS['inter-jetbrains'];
  document.documentElement.style.setProperty('--font-ui', fp.ui);
  document.documentElement.style.setProperty('--font-num', fp.num);
}

async function api(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [tweaks, setTweaksState] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [state, setState] = useState<AppState>({
    name: 'You',
    email: '',
    baseCurrency: 'USD',
    accentId: 'sage',
    accent: ACCENTS[0],
    theme: 'light',
    onboarded: false,
    categories: [],
    expenses: [],
    budgets: [],
  });

  // Load initial data
  useEffect(() => {
    const storedTweaks = getStoredTweaks();
    setTweaksState(storedTweaks);
    applyFontPair(storedTweaks.fontPair);

    async function init() {
      try {
        const [user, categories, expenses, budgets] = await Promise.all([
          api('/api/user'),
          api('/api/categories'),
          api('/api/expenses'),
          api('/api/budgets'),
        ]);

        const accent = getAccent(user.accentId);
        applyTheme(user.theme);
        applyAccent(accent.color, accent.ink);

        setState({
          name: user.name,
          email: user.email,
          baseCurrency: user.baseCurrency,
          accentId: user.accentId,
          accent,
          theme: user.theme,
          onboarded: user.onboarded,
          categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES.slice(),
          expenses,
          budgets,
        });

        setTweaksState(prev => ({ ...prev, currency: user.baseCurrency, accentId: user.accentId, theme: user.theme }));
      } catch (err) {
        console.error('Failed to init app:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // System theme listener
  useEffect(() => {
    if (state.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [state.theme]);

  const setTweak = useCallback(<K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaksState(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('spendshift_tweaks', JSON.stringify(next));

      if (key === 'fontPair') applyFontPair(value as string);
      if (key === 'theme') {
        setState(s => ({ ...s, theme: value as AppState['theme'] }));
        applyTheme(value as string);
      }
      if (key === 'accentId') {
        const accent = getAccent(value as string);
        setState(s => ({ ...s, accentId: value as string, accent }));
        applyAccent(accent.color, accent.ink);
      }
      if (key === 'currency') {
        setState(s => ({ ...s, baseCurrency: value as string }));
      }
      return next;
    });
  }, []);

  const addExpense = useCallback(async (expense: Expense) => {
    const created = await api('/api/expenses', 'POST', expense);
    setState(s => ({ ...s, expenses: [created, ...s.expenses] }));
  }, []);

  const updateExpense = useCallback(async (expense: Expense) => {
    const updated = await api(`/api/expenses/${expense.id}`, 'PATCH', expense);
    setState(s => ({ ...s, expenses: s.expenses.map(e => e.id === updated.id ? updated : e) }));
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await api(`/api/expenses/${id}`, 'DELETE');
    setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }));
  }, []);

  const clearExpenses = useCallback(async () => {
    await api('/api/expenses/bulk', 'DELETE');
    setState(s => ({ ...s, expenses: [] }));
  }, []);

  const saveBudget = useCallback(async (budget: Budget) => {
    const existing = state.budgets.find(b => b.id === budget.id);
    if (existing) {
      const updated = await api(`/api/budgets/${budget.id}`, 'PATCH', budget);
      setState(s => ({ ...s, budgets: s.budgets.map(b => b.id === updated.id ? updated : b) }));
    } else {
      const created = await api('/api/budgets', 'POST', budget);
      setState(s => ({ ...s, budgets: [...s.budgets, created] }));
    }
  }, [state.budgets]);

  const deleteBudget = useCallback(async (id: string) => {
    await api(`/api/budgets/${id}`, 'DELETE');
    setState(s => ({ ...s, budgets: s.budgets.filter(b => b.id !== id) }));
  }, []);

  const saveCategory = useCallback(async (category: Category) => {
    const existing = state.categories.find(c => c.id === category.id);
    if (existing) {
      const updated = await api(`/api/categories/${category.id}`, 'PATCH', category);
      setState(s => ({ ...s, categories: s.categories.map(c => c.id === updated.id ? updated : c) }));
    } else {
      const created = await api('/api/categories', 'POST', category);
      setState(s => ({ ...s, categories: [...s.categories, created] }));
    }
  }, [state.categories]);

  const deleteCategory = useCallback(async (id: string) => {
    await api(`/api/categories/${id}`, 'DELETE');
    setState(s => ({ ...s, categories: s.categories.filter(c => c.id !== id) }));
  }, []);

  const finishOnboarding = useCallback(async (data: {
    currency: string; accentId: string; theme: 'light' | 'dark' | 'system'; sampleData: boolean;
  }) => {
    const accent = getAccent(data.accentId);
    applyTheme(data.theme);
    applyAccent(accent.color, accent.ink);

    await api('/api/user', 'PATCH', {
      baseCurrency: data.currency, accentId: data.accentId, theme: data.theme, onboarded: true,
    });

    // Seed categories if none exist
    const cats = await api('/api/categories');
    if (cats.length === 0) {
      await api('/api/categories/seed', 'POST');
      const seeded = await api('/api/categories');
      setState(s => ({ ...s, categories: seeded }));
    }

    // Seed sample data if requested
    if (data.sampleData) {
      const sampleExp = buildSampleExpenses(data.currency);
      const sampleBud = buildSampleBudgets();
      await api('/api/expenses/bulk', 'POST', { expenses: sampleExp });
      await api('/api/budgets/bulk', 'POST', { budgets: sampleBud });
      const [expenses, budgets] = await Promise.all([api('/api/expenses'), api('/api/budgets')]);
      setState(s => ({ ...s, expenses, budgets }));
    }

    setTweaksState(prev => {
      const next = { ...prev, accentId: data.accentId, currency: data.currency, theme: data.theme };
      localStorage.setItem('spendshift_tweaks', JSON.stringify(next));
      return next;
    });

    setState(s => ({
      ...s, baseCurrency: data.currency,
      accentId: data.accentId, accent, theme: data.theme, onboarded: true,
    }));
  }, []);

  const updateUser = useCallback(async (data: Partial<AppState>) => {
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.baseCurrency !== undefined) patch.baseCurrency = data.baseCurrency;
    if (data.accentId !== undefined) patch.accentId = data.accentId;
    if (data.theme !== undefined) patch.theme = data.theme;

    await api('/api/user', 'PATCH', patch);

    if (data.accentId) {
      const accent = getAccent(data.accentId);
      applyAccent(accent.color, accent.ink);
      setState(s => ({ ...s, ...data, accent }));
    } else {
      setState(s => ({ ...s, ...data }));
    }

    if (data.theme) applyTheme(data.theme);
  }, []);

  const resetData = useCallback(async () => {
    await Promise.all([
      api('/api/expenses/bulk', 'DELETE'),
      api('/api/budgets/bulk', 'DELETE'),
    ]);
    await api('/api/user', 'PATCH', { onboarded: false });
    setState(s => ({
      ...s, onboarded: false, expenses: [], budgets: [],
      categories: DEFAULT_CATEGORIES.slice(),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state, tweaks, loading,
      setTweak, addExpense, updateExpense, deleteExpense, clearExpenses,
      saveBudget, deleteBudget, saveCategory, deleteCategory,
      finishOnboarding, updateUser, resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}
