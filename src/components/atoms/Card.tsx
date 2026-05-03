import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padded?: boolean;
  className?: string;
}

export default function Card({ children, style, padded = true, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: padded ? 18 : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
