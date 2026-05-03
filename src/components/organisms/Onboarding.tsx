'use client';

import { useState, useEffect } from 'react';
import { ACCENTS, CURRENCIES } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import Tap from '@/components/atoms/Tap';
import Radio from '@/components/atoms/Radio';
import { IconArrowR, IconSearch, IconCheck, IconSun, IconMoon } from '@/components/atoms/Icons';

export default function Onboarding() {
  const { finishOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [accentId, setAccentId] = useState('sage');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [sampleData, setSampleData] = useState(true);
  const TOTAL = 5;

  const accent = ACCENTS.find(a => a.id === accentId) || ACCENTS[0];

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent.color);
    document.documentElement.style.setProperty('--accent-soft', accent.color + '20');
    document.documentElement.style.setProperty('--accent-ink', accent.ink);
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'system' ? 'light' : theme);
  }, [theme]);

  const next = async () => {
    if (step < TOTAL - 1) {
      setStep(s => s + 1);
    } else {
      await finishOnboarding({ name: name.trim() || 'You', currency, accentId, theme, sampleData });
    }
  };

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px', transition: 'background 0.25s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="anim-fade-up">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: accent.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-num)',
          }}>§</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>SpendShift</span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 28 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              height: 3, flex: i === step ? 2 : 1, borderRadius: 2,
              background: i <= step ? accent.color : 'var(--line-2)',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>

        <div key={step} className="anim-fade-up">
          {step === 0 && <StepWelcome name={name} setName={setName} accentColor={accent.color} />}
          {step === 1 && <StepCurrency value={currency} onChange={setCurrency} accentColor={accent.color} />}
          {step === 2 && <StepAccent value={accentId} onChange={setAccentId} />}
          {step === 3 && <StepTheme value={theme} onChange={setTheme} accentColor={accent.color} />}
          {step === 4 && <StepSample value={sampleData} onChange={setSampleData} accentColor={accent.color} />}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {step > 0 && (
            <Tap onClick={() => setStep(s => s - 1)} style={{
              padding: '14px 20px', borderRadius: 'var(--r)',
              background: 'var(--bg-2)', color: 'var(--ink-2)',
              fontSize: 14, fontWeight: 500, border: '0.5px solid var(--line)',
            }}>Back</Tap>
          )}
          <Tap onClick={next} style={{
            flex: 1, padding: '14px 20px', borderRadius: 'var(--r)',
            background: accent.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,.08),0 4px 16px ' + accent.color + '30',
          }}>
            {step === TOTAL - 1 ? 'Open SpendShift' : 'Continue'}
            <IconArrowR size={16} stroke={2} />
          </Tap>
        </div>
      </div>
    </div>
  );
}

function StepWelcome({ name, setName, accentColor }: { name: string; setName: (v: string) => void; accentColor: string }) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--ink)' }}>
        Welcome to<br />SpendShift
      </div>
      <div style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.6, marginTop: 14, maxWidth: 340 }}>
        A quiet, local-only way to track where your money actually goes. No accounts, no ads.
      </div>
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
          What should we call you?
        </div>
        <input
          autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          placeholder="Your name (optional)"
          style={{
            width: '100%', padding: '14px 16px',
            background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 'var(--r)', fontSize: 16, color: 'var(--ink)', outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => (e.target.style.borderColor = accentColor)}
          onBlur={e => (e.target.style.borderColor = 'var(--line)')}
        />
      </div>
    </div>
  );
}

function StepCurrency({ value, onChange, accentColor }: { value: string; onChange: (v: string) => void; accentColor: string }) {
  const [q, setQ] = useState('');
  const filtered = CURRENCIES.filter(c => !q || c.code.toLowerCase().includes(q.toLowerCase()) || c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Pick your base currency</div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, marginTop: 10, marginBottom: 18 }}>
        Everything rolls up to this. You can still log in other currencies — we'll ask for the rate.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface)', border: '0.5px solid var(--line)', borderRadius: 'var(--r)', marginBottom: 10 }}>
        <IconSearch size={15} style={{ color: 'var(--ink-3)' }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
          style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)' }} />
      </div>
      <div className="ss-scroll" style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {filtered.map(c => {
          const active = c.code === value;
          return (
            <Tap key={c.code} onClick={() => onChange(c.code)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 14px', borderRadius: 'var(--r)',
              background: active ? accentColor + '12' : 'var(--surface)',
              border: '0.5px solid ' + (active ? accentColor : 'var(--line)'),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="num" style={{ width: 36, height: 36, borderRadius: 10, background: active ? accentColor : 'var(--bg-2)', color: active ? '#fff' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}>{c.symbol}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{c.code}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.name}</div>
                </div>
              </div>
              {active && <IconCheck size={17} stroke={2} style={{ color: accentColor }} />}
            </Tap>
          );
        })}
      </div>
    </div>
  );
}

function StepAccent({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Choose your accent</div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, marginTop: 10, marginBottom: 22 }}>
        Sets the highlight color across the app. Previewed live — pick what feels right.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {ACCENTS.map(a => {
          const active = a.id === value;
          return (
            <Tap key={a.id} onClick={() => onChange(a.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '10px 6px', borderRadius: 'var(--r)',
              background: 'var(--surface)',
              border: '0.5px solid ' + (active ? a.color : 'var(--line)'),
              boxShadow: active ? '0 0 0 3px ' + a.color + '22' : 'none',
              transition: 'all 0.18s ease',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {active && <IconCheck size={16} stroke={2.5} style={{ color: '#fff' }} />}
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2 }}>{a.label}</div>
            </Tap>
          );
        })}
      </div>
    </div>
  );
}

function StepTheme({ value, onChange, accentColor }: { value: string; onChange: (v: 'light' | 'dark' | 'system') => void; accentColor: string }) {
  const opts = [
    {
      id: 'light' as const, label: 'Light', hint: 'Warm off-white, clean and airy.',
      preview: (
        <div style={{ width: '100%', height: 56, borderRadius: 12, background: '#FBFAF7', border: '0.5px solid #ECE8DE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: accentColor }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 48, height: 4, borderRadius: 2, background: '#2B2A28', opacity: 0.7 }} />
            <div style={{ width: 32, height: 3, borderRadius: 2, background: '#807C73' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'dark' as const, label: 'Dark', hint: 'Rich charcoal, easy on the eyes.',
      preview: (
        <div style={{ width: '100%', height: 56, borderRadius: 12, background: '#1A1714', border: '0.5px solid #2E2B26', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: accentColor }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 48, height: 4, borderRadius: 2, background: '#EDEAE0', opacity: 0.9 }} />
            <div style={{ width: 32, height: 3, borderRadius: 2, background: '#8A8578' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'system' as const, label: 'System', hint: 'Follows your OS preference.',
      preview: (
        <div style={{ width: '100%', height: 56, borderRadius: 12, overflow: 'hidden', border: '0.5px solid var(--line)', display: 'flex' }}>
          <div style={{ flex: 1, background: '#FBFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSun size={18} style={{ color: '#A68A4F' }} /></div>
          <div style={{ flex: 1, background: '#1A1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMoon size={18} style={{ color: '#8A8578' }} /></div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Light or dark?</div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, marginTop: 10, marginBottom: 22 }}>Choose your preferred appearance. You can always change it in Settings.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {opts.map(opt => {
          const active = value === opt.id;
          return (
            <Tap key={opt.id} onClick={() => onChange(opt.id)} style={{
              padding: 12, borderRadius: 'var(--r-lg)', background: 'var(--surface)',
              border: '0.5px solid ' + (active ? accentColor : 'var(--line)'),
              boxShadow: active ? '0 0 0 3px ' + accentColor + '22' : 'none',
              transition: 'all 0.18s ease',
            }}>
              {opt.preview}
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</div>
                <Radio active={active} color={accentColor} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>{opt.hint}</div>
            </Tap>
          );
        })}
      </div>
    </div>
  );
}

function StepSample({ value, onChange, accentColor }: { value: boolean; onChange: (v: boolean) => void; accentColor: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Start with sample data?</div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, marginTop: 10, marginBottom: 22 }}>
        Adds ~3 weeks of realistic expenses so you can explore charts and budgets right away. Clear it anytime.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { v: true, label: 'Yes, populate it', hint: '~24 expenses · 8 categories · 4 budgets set up.' },
          { v: false, label: 'Start fresh', hint: 'Empty ledger. Add your first expense yourself.' },
        ].map(opt => {
          const active = value === opt.v;
          return (
            <Tap key={String(opt.v)} onClick={() => onChange(opt.v)} style={{
              padding: 18, borderRadius: 'var(--r-lg)', background: 'var(--surface)',
              border: '0.5px solid ' + (active ? accentColor : 'var(--line)'),
              boxShadow: active ? '0 0 0 3px ' + accentColor + '22' : 'none',
              transition: 'all 0.18s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5, lineHeight: 1.5 }}>{opt.hint}</div>
                </div>
                <Radio active={active} color={accentColor} />
              </div>
            </Tap>
          );
        })}
      </div>
    </div>
  );
}
