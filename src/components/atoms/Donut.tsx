interface DonutSlice {
  value: number;
  color: string;
  label?: string;
}

interface DonutProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
}

export default function Donut({ data, size = 140, thickness = 14 }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const off = -acc;
        acc += len;
        return (
          <circle key={i} cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={d.color} strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={off}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
      })}
    </svg>
  );
}
