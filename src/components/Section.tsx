import React from 'react';

export default function Section({
  eyebrow,
  title,
  description,
  children,
  media,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  media?: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-copy">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p className="section-desc">{description}</p>}
        {children}
      </div>
      {media && <div className="section-media">{media}</div>}
    </section>
  );
}
