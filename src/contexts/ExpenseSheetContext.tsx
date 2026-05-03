'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Expense } from '@/lib/types';

interface ExpenseSheetContextValue {
  sheetOpen: boolean;
  editingExpense: Expense | null;
  openExpense: (expense?: Expense) => void;
  closeSheet: () => void;
}

const ExpenseSheetContext = createContext<ExpenseSheetContextValue | null>(null);

export function useExpenseSheet() {
  const ctx = useContext(ExpenseSheetContext);
  if (!ctx) throw new Error('useExpenseSheet must be used within ExpenseSheetProvider');
  return ctx;
}

export function ExpenseSheetProvider({ children }: { children: ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const openExpense = (expense?: Expense) => {
    setEditingExpense(expense || null);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingExpense(null);
  };

  return (
    <ExpenseSheetContext.Provider value={{ sheetOpen, editingExpense, openExpense, closeSheet }}>
      {children}
    </ExpenseSheetContext.Provider>
  );
}
