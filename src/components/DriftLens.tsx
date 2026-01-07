import { useEffect, useRef } from 'react';

export default function DriftLens() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty('--lens-x', `${x}%`);
      node.style.setProperty('--lens-y', `${y}%`);
      node.classList.add('active');
    };

    const handleLeave = () => {
      node.classList.remove('active');
    };

    node.addEventListener('pointermove', handleMove);
    node.addEventListener('pointerleave', handleLeave);

    return () => {
      node.removeEventListener('pointermove', handleMove);
      node.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return <div ref={ref} className="drift-lens" aria-hidden="true" />;
}
