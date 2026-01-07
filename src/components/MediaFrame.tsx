import { useState } from 'react';

type MediaFrameProps = {
  src?: string;
  alt?: string;
  label: string;
  className?: string;
};

export default function MediaFrame({ src, alt = '', label, className }: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`media-frame placeholder ${className ?? ''}`.trim()}>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className={`media-frame ${className ?? ''}`.trim()}>
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}
