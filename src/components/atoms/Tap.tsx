'use client';

import { useState, CSSProperties, ReactNode, KeyboardEvent, MouseEvent } from 'react';

interface TapProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
  title?: string;
}

export default function Tap({ children, onClick, style, className, disabled, title }: TapProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      title={title}
      onPointerDown={() => { if (!disabled) setPressed(true); }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
      }}
      onClick={(e) => { if (!disabled) onClick?.(e); }}
      className={className}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.16s cubic-bezier(0.34,1.56,0.64,1), opacity 0.14s ease',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
