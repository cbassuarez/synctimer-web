import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function PhaseField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    let nextLock = performance.now() + 3000;
    let lockUntil = 0;

    const resize = () => {
      const { width } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * window.devicePixelRatio);
      canvas.height = Math.floor(320 * window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isLocked = time < lockUntil;
      const amplitude = isLocked ? 0.12 : 0.32;

      ctx.fillStyle = 'rgba(96, 225, 68, 0.06)';
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < height; y += 10) {
        for (let x = 0; x < width; x += 10) {
          const noise = Math.sin((x + frame) * 0.02) + Math.cos((y + frame) * 0.015);
          const alpha = Math.max(0, Math.min(1, (noise + 2) / 4)) * amplitude;
          ctx.fillStyle = `rgba(11, 15, 20, ${alpha})`;
          ctx.fillRect(x, y, 6, 6);
        }
      }

      if (time > nextLock) {
        lockUntil = time + 1200;
        nextLock = time + 4200 + Math.random() * 2000;
      }

      frame += 0.7;
      animationId = requestAnimationFrame(render);
    };

    if (reduced) {
      render(performance.now());
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    animationId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="phase-field" aria-hidden="true" />;
}
