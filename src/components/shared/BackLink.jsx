import React from 'react';
import { Icon } from './Icon';
import { useNavigation } from '../../App';

export function BackLink({ href, text, className = '', ...props }) {
  const { setView } = useNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    if (href.includes('company')) {
      setView('company');
    } else {
      setView('contract');
    }
  };

  return (
    <a href={href} onClick={handleClick} className={`back-link ${className}`} {...props}>
      <Icon name="chevronBack" className="back-chevron" />
      {text}
    </a>
  );
}
