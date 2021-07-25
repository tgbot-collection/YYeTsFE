import * as React from "react";

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
  const ref = React.useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref] as const;
}
