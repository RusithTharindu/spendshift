export interface Accent {
  id: string;
  label: string;
  color: string;
  ink: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  glyph: string;
  tone: string;
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  amountOriginal?: number;
  rate?: number;
  categoryId: string;
  date: string;
  note: string;
  recurring: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'month';
}

export interface User {
  name: string;
  email?: string;
  baseCurrency: string;
  accentId: string;
  theme: 'light' | 'dark' | 'system';
  onboarded: boolean;
}

export interface AppState extends User {
  accent: Accent;
  categories: Category[];
  expenses: Expense[];
  budgets: Budget[];
}

export type FontPair = 'inter-jetbrains' | 'plex' | 'geist';

export interface Tweaks {
  density: 'compact' | 'comfortable';
  currency: string;
  fontPair: FontPair;
  accentId: string;
  animationLevel: number;
  sampleData: boolean;
  theme: 'light' | 'dark' | 'system';
}
