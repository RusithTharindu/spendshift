'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { ExpenseSheetProvider, useExpenseSheet } from '@/contexts/ExpenseSheetContext';
import AppShell from '@/components/organisms/AppShell';
import AddExpenseSheet from '@/components/organisms/AddExpenseSheet';

function AppLayoutInner({ children }: { children: ReactNode }) {
  const { state, loading } = useApp();
  const { sheetOpen, editingExpense, closeSheet } = useExpenseSheet();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !state.onboarded) {
      router.replace('/onboarding');
    }
  }, [loading, state.onboarded, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh', background: 'var(--bg)' }}>
        <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading…</div>
      </div>
    );
  }

  if (!state.onboarded) return null;

  return (
    <>
      <AppShell>{children}</AppShell>
      <AddExpenseSheet open={sheetOpen} onClose={closeSheet} editing={editingExpense} />
    </>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ExpenseSheetProvider>
        <AppLayoutInner>{children}</AppLayoutInner>
      </ExpenseSheetProvider>
    </AppProvider>
  );
}
