import { ReactNode } from 'react';

interface SectionHeaderProps {
  label: string;
  action?: ReactNode;
}

export default function SectionHeader({ label, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2px 10px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--ink-3)',
      }}>{label}</div>
      {action}
    </div>
  );
}
