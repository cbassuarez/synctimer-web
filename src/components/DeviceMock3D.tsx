import type { ReactNode, CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const sizeMap = {
  sm: 'device-mock--sm',
  md: 'device-mock--md',
  lg: 'device-mock--lg',
};

type DeviceMock3DProps = {
  variant: 'portrait' | 'landscape';
  size?: 'sm' | 'md' | 'lg';
  tilt?: { x: number; y: number };
  offset?: { x: number; y: number; z: number };
  media?: ReactNode;
  fallbackLabel?: string;
};

export default function DeviceMock3D({
  variant,
  size = 'md',
  tilt,
  offset,
  media,
  fallbackLabel,
}: DeviceMock3DProps) {
  const reduced = useReducedMotion();
  const Wrapper: typeof motion.div = reduced ? motion.div : motion.div;
  const classes = ['device-mock', `device-mock--${variant}`, sizeMap[size]].join(' ');
  const style = {
    '--device-tilt-x': `${tilt?.x ?? -10}deg`,
    '--device-tilt-y': `${tilt?.y ?? 18}deg`,
    '--device-offset-x': `${offset?.x ?? 18}px`,
    '--device-offset-y': `${offset?.y ?? 10}px`,
    '--device-offset-z': `${offset?.z ?? 22}px`,
  } as CSSProperties;

  return (
    <div className={classes} style={style}>
      <Wrapper
        className="device-mock-parallax"
        whileHover={reduced ? undefined : { x: 6, y: -4 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.4 }}
      >
        <div className="device-mock-frame">
          {media ?? (
            <div className="device-mock-placeholder">
              <span>{fallbackLabel ?? 'Media unavailable'}</span>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
