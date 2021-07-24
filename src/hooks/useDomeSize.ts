import * as React from 'react';

interface DOMReactOnly {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

/* 修复 React.Suspense 造成无法获取DOM元素尺寸的问题 */
export function useDomeSize() {
  const initialRect: DOMReactOnly = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  const [rect, setRect] = React.useState<DOMReactOnly>(initialRect);

  const resizeObserver = React.useMemo(
    () =>
      new ResizeObserver((entries) => {
        const entry = entries[0];

        // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        const contentRectSize = Array.isArray(entry.contentRect) ? entry.contentRect[0] : entry.contentRect;
        setRect(contentRectSize);
      }),
    [],
  );

  const ref = React.useRef<HTMLElement>(null!);

  const refs = React.useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        resizeObserver.observe(node);
        ref.current = node;
      }
    },
    [resizeObserver],
  );

  React.useEffect(
    () => () => {
      resizeObserver.unobserve(ref.current);
    },
    [resizeObserver],
  );

  return [rect, refs, ref.current] as const;
}
