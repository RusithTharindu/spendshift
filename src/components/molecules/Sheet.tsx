'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
}

export default function Sheet({ open, onClose, children, maxHeight = '90dvh' }: SheetProps) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,18,14,.42)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        opacity: open ? 1 : 0,
        transition: 'opacity 0.24s ease',
      }} />
      <div style={{
        position: 'relative',
        background: 'var(--surface)',
        borderTopLeftRadius: 26, borderTopRightRadius: 26,
        boxShadow: '0 -8px 40px rgba(0,0,0,.18)',
        maxHeight,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1)',
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
        paddingBottom: 'env(safe-area-inset-bottom,0px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
        </div>
        {children}
      </div>
    </div>
  );
}
