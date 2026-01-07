import { useState } from 'react';

type TiltedMediaProps = {
  variant: 'hero' | 'section';
  src?: string;
  type: 'video' | 'image';
  alt?: string;
  missingLabel: string;
  className?: string;
};

export default function TiltedMedia({
  variant,
  src,
  type,
  alt = '',
  missingLabel,
  className,
}: TiltedMediaProps) {
  const [failed, setFailed] = useState(false);
  const classes = ['tilted-media', `tilted-media--${variant}`, className].filter(Boolean).join(' ');

  if (!src || failed) {
    return (
      <div className={classes}>
        <div className="tilted-media__placeholder">
          <span>{missingLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      {type === 'video' ? (
        <video
          className="tilted-media__asset"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          className="tilted-media__asset"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
