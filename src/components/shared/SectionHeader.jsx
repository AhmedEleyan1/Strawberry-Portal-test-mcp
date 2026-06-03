import React from 'react';

export function SectionHeader({ title, id, className = '', children, ...props }) {
  return (
    <h2 id={id} className={`section-title ${className}`} {...props}>
      {title}
      {children}
    </h2>
  );
}
