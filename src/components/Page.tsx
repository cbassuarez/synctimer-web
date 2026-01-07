import React from 'react';

export default function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={`page ${className ?? ''}`.trim()}>{children}</main>;
}
