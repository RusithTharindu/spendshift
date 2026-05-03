import { SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'stroke'> & { size?: number; stroke?: number };

function Icon({ d, size = 20, stroke = 1.5, fill = 'none', children, viewBox = '0 0 24 24', style, className }: IconProps & { d?: string }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill={fill as string} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export const IconHome     = (p: IconProps) => <Icon {...p}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v10h14V10"/></Icon>;
export const IconList     = (p: IconProps) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h10"/></Icon>;
export const IconChart    = (p: IconProps) => <Icon {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></Icon>;
export const IconSettings = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
export const IconPlus     = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
export const IconCheck    = (p: IconProps) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
export const IconBack     = (p: IconProps) => <Icon {...p}><path d="M15 18l-6-6 6-6"/></Icon>;
export const IconChevR    = (p: IconProps) => <Icon {...p}><path d="M9 18l6-6-6-6"/></Icon>;
export const IconChevD    = (p: IconProps) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
export const IconClose    = (p: IconProps) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>;
export const IconSearch   = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Icon>;
export const IconFilter   = (p: IconProps) => <Icon {...p}><path d="M3 6h18M6 12h12M10 18h4"/></Icon>;
export const IconCal      = (p: IconProps) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/></Icon>;
export const IconCard     = (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/></Icon>;
export const IconLock     = (p: IconProps) => <Icon {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></Icon>;
export const IconRepeat   = (p: IconProps) => <Icon {...p}><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></Icon>;
export const IconTrend    = (p: IconProps) => <Icon {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></Icon>;
export const IconWallet   = (p: IconProps) => <Icon {...p}><path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="13" r="1.2" fill="currentColor"/></Icon>;
export const IconTarget   = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Icon>;
export const IconMoon     = (p: IconProps) => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
export const IconSun      = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>;
export const IconEdit     = (p: IconProps) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>;
export const IconTrash    = (p: IconProps) => <Icon {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Icon>;
export const IconArrowR   = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
export const IconArrowU   = (p: IconProps) => <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Icon>;
export const IconArrowD   = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12l7 7 7-7"/></Icon>;
export const IconNote     = (p: IconProps) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></Icon>;
export const IconExport   = (p: IconProps) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5-5 5 5"/><path d="M12 5v12"/></Icon>;
export const IconBell     = (p: IconProps) => <Icon {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>;
export const IconHelp     = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4"/><path d="M12 17.5h.01"/></Icon>;
export const IconHalfCircle = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></Icon>;

export { Icon };
