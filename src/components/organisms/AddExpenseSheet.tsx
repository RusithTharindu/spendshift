'use client';

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Expense } from '@/lib/types';
import { CURRENCIES } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import Sheet from '@/components/molecules/Sheet';
import CurrencyPicker from '@/components/molecules/CurrencyPicker';
import FieldLabel from '@/components/molecules/FieldLabel';
import Tap from '@/components/atoms/Tap';
import Toggle from '@/components/atoms/Toggle';
import CatGlyph from '@/components/atoms/CategoryBadge';
import { IconRepeat, IconTrash } from '@/components/atoms/Icons';

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  editing?: Expense | null;
}

const IS: React.CSSProperties = {
  width: '100%', padding: '13px 15px',
  background: 'var(--bg-2)', border: '0.5px solid var(--line)',
  borderRadius: 'var(--r)', fontSize: 14, color: 'var(--ink)', outline: 'none',
  fontFamily: 'inherit',
};

export default function AddExpenseSheet({ open, onClose, editing }: AddExpenseSheetProps) {
  const { state, addExpense, updateExpense, deleteExpense } = useApp();
  const { categories, baseCurrency } = state;

  const [amount, setAmount]       = useState('');
  const [merchant, setMerchant]   = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [currency, setCurrency]   = useState(baseCurrency);
  const [rate, setRate]           = useState('1');
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote]           = useState('');
  const [recurring, setRecurring] = useState(false);
  const [showCurr, setShowCurr]   = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setAmount(String(editing.amountOriginal ?? editing.amount));
      setMerchant(editing.merchant);
      setCategoryId(editing.categoryId);
      setCurrency(editing.currency);
      setRate(String(editing.rate ?? 1));
      setDate(new Date(editing.date).toISOString().slice(0, 10));
      setNote(editing.note || '');
      setRecurring(!!editing.recurring);
    } else {
      setAmount(''); setMerchant('');
      setCategoryId(categories[0]?.id || '');
      setCurrency(baseCurrency); setRate('1');
      setDate(new Date().toISOString().slice(0, 10));
      setNote(''); setRecurring(false);
    }
  }, [open, editing, categories, baseCurrency]);

  const a = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 1;
  const inBase = currency === baseCurrency ? a : a * r;
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  const baseSym = CURRENCIES.find(c => c.code === baseCurrency)?.symbol || '$';
  const valid = a > 0 && merchant.trim() && categoryId;

  const submit = async () => {
    if (!valid) return;
    const expense: Expense = {
      id: editing?.id || 'e_' + uuid().replace(/-/g, '').slice(0, 12),
      merchant: merchant.trim(),
      amount: inBase,
      currency,
      amountOriginal: currency === baseCurrency ? undefined : a,
      rate: currency === baseCurrency ? undefined : r,
      categoryId,
      date: new Date(date + 'T12:00:00').toISOString(),
      note: note.trim(),
      recurring,
    };
    if (editing) {
      await updateExpense(expense);
    } else {
      await addExpense(expense);
    }
    onClose();
  };

  const remove = async () => {
    if (!editing) return;
    await deleteExpense(editing.id);
    onClose();
  };

  return (
    <>
      <Sheet open={open} onClose={onClose} maxHeight="94dvh">
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 20px 14px' }}>
            <Tap onClick={onClose} style={{ fontSize: 14, color: 'var(--ink-3)', padding: '4px 0' }}>Cancel</Tap>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{editing ? 'Edit expense' : 'New expense'}</div>
            <Tap onClick={submit} style={{
              fontSize: 14, fontWeight: 600,
              color: valid ? 'var(--accent)' : 'var(--ink-4)',
              padding: '4px 0',
            }}>{editing ? 'Save' : 'Add'}</Tap>
          </div>

          <div className="ss-scroll" style={{ overflowY: 'auto', padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Big amount */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 8px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                <span className="num" style={{ fontSize: 28, color: 'var(--ink-3)', fontWeight: 500 }}>{sym}</span>
                <input
                  type="text" inputMode="decimal"
                  autoFocus={!editing}
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="0.00"
                  style={{
                    border: 0, outline: 'none', background: 'transparent',
                    fontFamily: 'var(--font-num)', fontSize: 52, fontWeight: 700,
                    color: 'var(--ink)', letterSpacing: '-0.03em',
                    width: Math.max((amount.length || 4), 4) + 'ch',
                    textAlign: 'center', padding: 0, minWidth: '2ch', maxWidth: '8ch',
                  }}
                />
              </div>
              {currency !== baseCurrency && a > 0 && (
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                  ≈ <span className="num">{baseSym}{inBase.toFixed(2)}</span> at rate {r}
                </div>
              )}
            </div>

            {/* Currency row */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Tap onClick={() => setShowCurr(true)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 'var(--r)',
                background: 'var(--bg-2)', border: '0.5px solid var(--line)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Currency</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{currency}</span>
              </Tap>
              {currency !== baseCurrency && (
                <div style={{
                  flex: 1, padding: '10px 14px', borderRadius: 'var(--r)',
                  background: 'var(--bg-2)', border: '0.5px solid var(--line)',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 4 }}>1 {currency} = ? {baseCurrency}</div>
                  <input type="text" inputMode="decimal" value={rate}
                    onChange={e => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                    style={{ width: '100%', border: 0, outline: 'none', background: 'transparent', fontFamily: 'var(--font-num)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }} />
                </div>
              )}
            </div>

            {/* Merchant */}
            <div>
              <FieldLabel>Merchant</FieldLabel>
              <input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="What did you buy?" style={{ ...IS, marginTop: 7 }} />
            </div>

            {/* Category grid */}
            <div>
              <FieldLabel>Category</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 7 }}>
                {categories.map(c => {
                  const active = c.id === categoryId;
                  return (
                    <Tap key={c.id} onClick={() => setCategoryId(c.id)} style={{
                      padding: '10px 6px', borderRadius: 14,
                      background: active ? c.tone + '18' : 'var(--bg-2)',
                      border: '0.5px solid ' + (active ? c.tone : 'transparent'),
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}>
                      <CatGlyph category={c} size={26} />
                      <span style={{
                        fontSize: 10, fontWeight: 500, color: 'var(--ink)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
                        textAlign: 'center',
                      }}>{c.name.split(' ')[0]}</span>
                    </Tap>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <FieldLabel>Date</FieldLabel>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...IS, marginTop: 7 }} />
            </div>

            {/* Note */}
            <div>
              <FieldLabel>Note</FieldLabel>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Anything to remember?" rows={2}
                style={{ ...IS, marginTop: 7, resize: 'none', lineHeight: 1.5, paddingTop: 12, paddingBottom: 12 }} />
            </div>

            {/* Recurring */}
            <Tap onClick={() => setRecurring(!recurring)} style={{
              padding: '13px 15px', borderRadius: 'var(--r)',
              background: 'var(--bg-2)', border: '0.5px solid var(--line)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <IconRepeat size={16} style={{ color: 'var(--ink-2)' }} />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>Mark as recurring</span>
              <Toggle on={recurring} onChange={setRecurring} />
            </Tap>

            {editing && (
              <Tap onClick={remove} style={{
                padding: '13px 15px', borderRadius: 'var(--r)',
                background: 'var(--danger-soft)', color: 'var(--danger)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 13, fontWeight: 500,
              }}><IconTrash size={15} /> Delete expense</Tap>
            )}
          </div>
        </div>
      </Sheet>

      <Sheet open={showCurr} onClose={() => setShowCurr(false)}>
        <CurrencyPicker value={currency} onSelect={c => { setCurrency(c); setShowCurr(false); }} />
      </Sheet>
    </>
  );
}
