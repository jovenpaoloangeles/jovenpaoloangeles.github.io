import { useState } from 'react';
import { iconSrc, monogram, type Tool } from '@/content/techstack';
import { cn } from '@/lib/utils';

export function TechIcon({
  tool,
  size = 20,
  className,
}: {
  tool: Pick<Tool, 'name' | 'icon'>;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const src = iconSrc(tool);
  const mg = monogram(tool);
  const box = { width: size, height: size };

  if (!src || broken) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-border bg-muted text-muted-foreground font-bold',
          className
        )}
        style={{ ...box, fontSize: size * 0.36 }}
        aria-hidden
      >
        {mg}
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center justify-center', className)} style={box}>
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </span>
  );
}
