// Central React + htm setup — all components import from this file
import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm@3';

function parseStyleString(styleStr) {
  const styleObj = {};
  if (!styleStr) return styleObj;
  
  const declarations = styleStr.split(';');
  for (let i = 0; i < declarations.length; i++) {
    const decl = declarations[i].trim();
    if (!decl) continue;
    
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    
    const property = decl.substring(0, colonIndex).trim();
    const value = decl.substring(colonIndex + 1).trim();
    
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      styleObj[camelProperty] = value;
    }
  }
  return styleObj;
}

function customCreateElement(type, props, ...children) {
  if (props) {
    let newProps = null;
    if (typeof props.style === 'string') {
      newProps = newProps || { ...props };
      newProps.style = parseStyleString(props.style);
    }
    if ('class' in props) {
      newProps = newProps || { ...props };
      newProps.className = props.class;
      delete newProps.class;
    }
    if (newProps) {
      return React.createElement(type, newProps, ...children);
    }
  }
  return React.createElement(type, props, ...children);
}

export const html = htm.bind(customCreateElement);

export const {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Fragment,
  Component
} = React;

export function render(vnode, container) {
  const root = ReactDOM.createRoot(container);
  root.render(vnode);
}
