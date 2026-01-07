import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function HeroField() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return undefined;

    let frame: number | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        element.style.setProperty('--hero-x', `${(x * 100).toFixed(2)}%`);
        element.style.setProperty('--hero-y', `${(y * 100).toFixed(2)}%`);
        frame = null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [reduced]);

  return <div ref={ref} className="hero-field" data-reduced-motion={reduced ? 'true' : 'false'} aria-hidden="true" />;
}
