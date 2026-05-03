interface RadioProps {
  active: boolean;
  color?: string;
}

export default function Radio({ active, color }: RadioProps) {
  const c = color || 'var(--accent)';
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 11,
      border: '1.5px solid ' + (active ? c : 'var(--line-2)'),
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      transition: 'border-color 0.15s ease',
    }}>
      {active && <div style={{ width: 10, height: 10, borderRadius: 5, background: c }} />}
    </div>
  );
}
