import type { Accent, Currency, Category } from './types';

export const ACCENTS: Accent[] = [
  { id: 'sage',       label: 'Sage',       color: '#6B7A55', ink: '#4F5C3F' },
  { id: 'terracotta', label: 'Terracotta', color: '#B85B4A', ink: '#8B4234' },
  { id: 'slate',      label: 'Slate',      color: '#5A6B7A', ink: '#3F4D5A' },
  { id: 'plum',       label: 'Plum',       color: '#7A5B6B', ink: '#5A3F4F' },
  { id: 'ochre',      label: 'Ochre',      color: '#A68A4F', ink: '#7A6435' },
  { id: 'charcoal',   label: 'Charcoal',   color: '#3F3D38', ink: '#29272A' },
  { id: 'forest',     label: 'Forest',     color: '#3F5C42', ink: '#2C4230' },
  { id: 'midnight',   label: 'Midnight',   color: '#3D4A6B', ink: '#2A3450' },
  { id: 'rose',       label: 'Rose',       color: '#C28A8A', ink: '#9C6868' },
  { id: 'mustard',    label: 'Mustard',    color: '#B89548', ink: '#8A6E32' },
  { id: 'rust',       label: 'Rust',       color: '#9C5238', ink: '#723A26' },
  { id: 'cocoa',      label: 'Cocoa',      color: '#6B4F3D', ink: '#4F3A2C' },
  { id: 'lavender',   label: 'Lavender',   color: '#8A7FA8', ink: '#665C82' },
  { id: 'teal',       label: 'Teal',       color: '#4F7A78', ink: '#3A5C5A' },
  { id: 'olive',      label: 'Olive',      color: '#7A7A4F', ink: '#5C5C3A' },
  { id: 'coral',      label: 'Coral',      color: '#C77064', ink: '#9C5246' },
  { id: 'denim',      label: 'Denim',      color: '#5A748F', ink: '#42566A' },
  { id: 'moss',       label: 'Moss',       color: '#5C6B3F', ink: '#42502C' },
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩',  name: 'Korean Won' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food',      name: 'Food & Dining',  glyph: '✦', tone: '#B85B4A', isDefault: true },
  { id: 'transport', name: 'Transport',      glyph: '◐', tone: '#5A6B7A', isDefault: true },
  { id: 'groceries', name: 'Groceries',      glyph: '◇', tone: '#6B7A55', isDefault: true },
  { id: 'home',      name: 'Home & Bills',   glyph: '▢', tone: '#7A6B5B', isDefault: true },
  { id: 'leisure',   name: 'Leisure',        glyph: '◉', tone: '#7A5B6B', isDefault: true },
  { id: 'health',    name: 'Health',         glyph: '+',  tone: '#5B7A6B', isDefault: true },
  { id: 'shopping',  name: 'Shopping',       glyph: '○', tone: '#A68A4F', isDefault: true },
  { id: 'travel',    name: 'Travel',         glyph: '△', tone: '#5B6B7A', isDefault: true },
];

export const CAT_GLYPHS = ['✦','◐','◇','▢','◉','+','○','△','◈','◊','※','✕','✿','⌘','◑','☼'];
export const CAT_TONES  = ['#B85B4A','#5A6B7A','#6B7A55','#7A6B5B','#7A5B6B','#5B7A6B','#A68A4F','#5B6B7A','#7A5B5B','#5B5B7A','#7A7A5B','#3F3D38'];

export const FONT_PAIRS = {
  'inter-jetbrains': { ui: "'Inter',system-ui,sans-serif",       num: "'JetBrains Mono',ui-monospace,monospace",  label: 'Inter + JetBrains Mono' },
  'plex':            { ui: "'IBM Plex Sans',system-ui,sans-serif", num: "'IBM Plex Mono',ui-monospace,monospace",   label: 'IBM Plex' },
  'geist':           { ui: "'Geist',system-ui,sans-serif",         num: "'Geist Mono',ui-monospace,monospace",      label: 'Geist' },
} as const;
