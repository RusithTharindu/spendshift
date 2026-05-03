'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Category } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { fmtMoney } from '@/lib/utils';
import { CAT_GLYPHS, CAT_TONES } from '@/lib/constants';
import Card from '@/components/atoms/Card';
import Btn from '@/components/atoms/Button';
import Tap from '@/components/atoms/Tap';
import CatGlyph from '@/components/atoms/CategoryBadge';
import Sheet from '@/components/molecules/Sheet';
import PageHeader from '@/components/molecules/PageHeader';
import { IconPlus, IconChevR, IconCheck, IconTrash } from '@/components/atoms/Icons';

export default function CategoriesScreen() {
  const { state, saveCategory, deleteCategory } = useApp();
  const { categories, expenses, baseCurrency } = state;
  const [editing, setEditing] = useState<Category | null>(null);

  const now = new Date();
  const monthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const usage = (id: string) => monthExp.filter(e => e.categoryId === id).reduce((s, e) => s + e.amount, 0);

  const handleSave = async (cat: Category) => { await saveCategory(cat); setEditing(null); };
  const handleDelete = async (id: string) => { await deleteCategory(id); setEditing(null); };

  return (
    <div className="page-wrap">
      <PageHeader title="Categories" subtitle={`${categories.length} categories`}
        right={<Btn onClick={() => setEditing({ id: 'c_' + uuid().slice(0, 8), name: '', glyph: '◇', tone: CAT_TONES[0] })} icon={<IconPlus size={15} stroke={2.5} />}>New</Btn>}
      />
      <Card padded={false} style={{ overflow: 'hidden' }}>
        {categories.map((c, i) => (
          <Tap key={c.id} onClick={() => setEditing(c)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '0.5px solid var(--line)' : 0 }}>
            <CatGlyph category={c} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{c.name}</div>
              <div className="num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{fmtMoney(usage(c.id), baseCurrency)} this month</div>
            </div>
            <IconChevR size={16} style={{ color: 'var(--ink-4)' }} />
          </Tap>
        ))}
      </Card>

      <Sheet open={!!editing} onClose={() => setEditing(null)}>
        {editing && <CategoryEditor cat={editing} onSave={handleSave} onDelete={handleDelete} onCancel={() => setEditing(null)} />}
      </Sheet>
    </div>
  );
}

function CategoryEditor({ cat, onSave, onDelete, onCancel }: {
  cat: Category; onSave: (c: Category) => void; onDelete: (id: string) => void; onCancel: () => void;
}) {
  const [name, setName] = useState(cat.name);
  const [glyph, setGlyph] = useState(cat.glyph);
  const [tone, setTone] = useState(cat.tone);
  const isNew = !cat.name;

  return (
    <div className="ss-scroll" style={{ padding: '4px 20px 28px', overflowY: 'auto', maxHeight: '85dvh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 18px' }}>
        <Tap onClick={onCancel} style={{ fontSize: 14, color: 'var(--ink-3)' }}>Cancel</Tap>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{isNew ? 'New category' : 'Edit category'}</div>
        <Tap onClick={() => name.trim() && onSave({ ...cat, name: name.trim(), glyph, tone })}
          style={{ fontSize: 14, fontWeight: 600, color: name.trim() ? 'var(--accent)' : 'var(--ink-4)' }}>Save</Tap>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 20px' }}>
        <div style={{ width: 64, height: 64, borderRadius: 22, background: tone + '1A', color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontFamily: 'var(--font-num)' }}>{glyph}</div>
      </div>

      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" autoFocus
        style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-2)', border: '0.5px solid var(--line)', borderRadius: 'var(--r)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Glyph</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 7 }}>
          {CAT_GLYPHS.map(g => (
            <Tap key={g} onClick={() => setGlyph(g)} style={{ aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontFamily: 'var(--font-num)', background: glyph === g ? tone + '1A' : 'var(--bg-2)', color: glyph === g ? tone : 'var(--ink-2)', border: '0.5px solid ' + (glyph === g ? tone : 'transparent') }}>{g}</Tap>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Color</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {CAT_TONES.map(t => (
            <Tap key={t} onClick={() => setTone(t)} style={{ aspectRatio: '1', borderRadius: 12, background: t, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: tone === t ? '0 0 0 3px ' + t + '35' : 'none' }}>
              {tone === t && <IconCheck size={15} stroke={2.5} style={{ color: '#fff' }} />}
            </Tap>
          ))}
        </div>
      </div>

      {!isNew && (
        <Tap onClick={() => onDelete(cat.id)} style={{ marginTop: 24, padding: '13px 16px', borderRadius: 'var(--r)', background: 'var(--danger-soft)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
          <IconTrash size={15} /> Delete category
        </Tap>
      )}
    </div>
  );
}
