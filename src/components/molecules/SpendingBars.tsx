interface SpendingBarsProps {
  days: number[];
  accentColor: string;
}

export default function SpendingBars({ days, accentColor }: SpendingBarsProps) {
  const max = Math.max(...days, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 72 }}>
      {days.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', minWidth: 2,
            height: Math.max((v / max) * 64, 2),
            borderRadius: 4,
            background: v > 0 ? accentColor : 'var(--line)',
            transition: 'height 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            transitionDelay: i * 15 + 'ms',
          }} />
        </div>
      ))}
    </div>
  );
}
