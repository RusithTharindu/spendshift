'use client';

import { CSSProperties, ReactNode } from 'react';
import { Drawer } from 'vaul';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
}

export default function Sheet({ open, onClose, children, maxHeight = '90dvh' }: SheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen) onClose();
      }}
      direction="bottom"
      modal
      repositionInputs
    >
      <Drawer.Portal>
        <Drawer.Overlay className="ss-sheet-overlay" />
        <Drawer.Content
          className="ss-sheet-content"
          style={{ '--sheet-max-height': maxHeight } as CSSProperties}
          aria-describedby={undefined}
        >
          <Drawer.Title className="sr-only">Sheet</Drawer.Title>
          <Drawer.Handle className="ss-sheet-handle" />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
