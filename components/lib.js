// Central Preact + htm setup — all components import from this file
export { h, render, Component, Fragment } from 'https://esm.sh/preact@10';
export { useState, useEffect, useCallback, useRef, useMemo } from 'https://esm.sh/preact@10/hooks';
import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';
export const html = htm.bind(h);
