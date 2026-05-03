import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export default function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      paddingBottom: 20,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {right && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{right}</div>}
    </div>
  );
}
