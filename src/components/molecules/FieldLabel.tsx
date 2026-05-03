import { ReactNode } from 'react';

export default function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
      {children}
    </div>
  );
}
