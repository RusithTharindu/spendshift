'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';

interface AnimNumProps {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  style?: CSSProperties;
  className?: string;
}

export default function AnimNum({ value, duration = 550, format = v => v.toFixed(2), style, className }: AnimNumProps) {
  const [v, setV] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current, to = value;
    if (from === to) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setV(from + (to - from) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { fromRef.current = to; setV(to); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span style={style} className={className}>{format(v)}</span>;
}
