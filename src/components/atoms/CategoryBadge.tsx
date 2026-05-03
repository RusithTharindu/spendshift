import { Category } from '@/lib/types';

interface CatGlyphProps {
  category?: Category | null;
  size?: number;
}

export default function CatGlyph({ category, size = 32 }: CatGlyphProps) {
  if (!category) return null;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.42,
      background: category.tone + '1A',
      color: category.tone,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.48, fontWeight: 500,
      fontFamily: 'var(--font-num)',
      flexShrink: 0,
    }}>
      {category.glyph}
    </div>
  );
}
