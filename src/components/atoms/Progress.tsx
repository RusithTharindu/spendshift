interface ProgressProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
}

export default function Progress({ value, max, color = 'var(--accent)', height = 6 }: ProgressProps) {
  const pct = Math.min(1, value / Math.max(max, 1));
  const over = value > max;
  return (
    <div style={{ height, borderRadius: height, background: 'var(--bg-2)', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${pct * 100}%`,
        background: over ? 'var(--danger)' : color,
        borderRadius: height,
        transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}
