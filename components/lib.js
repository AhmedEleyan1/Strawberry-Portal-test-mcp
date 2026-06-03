// Central React + htm setup — all components import from this file
import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm@3';

export const html = htm.bind(React.createElement);

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
