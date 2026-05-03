interface EmptyProps {
  glyph?: string;
  title: string;
  hint?: string;
}

export default function Empty({ glyph = '◌', title, hint }: EmptyProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: '48px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 36, color: 'var(--ink-4)', fontFamily: 'var(--font-num)' }}>{glyph}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>{title}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 260, lineHeight: 1.6 }}>{hint}</div>}
    </div>
  );
}
