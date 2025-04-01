import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  side: 'left' | 'right';
  onResize?: (width: number) => void;
}

export const ResizablePanel: React.FC<Props> = ({ children, initialWidth, minWidth, maxWidth, side, onResize }) => {
  const [width, setWidth] = useState(initialWidth);
  const [resizing, setResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  };

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (!resizing || !panelRef.current?.parentElement) return;

      const rect = panelRef.current.parentElement.getBoundingClientRect();
      const newWidth = side === 'left' ? e.clientX - rect.left : rect.right - e.clientX;

      const constrained = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(constrained);
      if (onResize) onResize(constrained);
    };

    const stopResize = () => setResizing(false);

    if (resizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [resizing, minWidth, maxWidth, side, onResize]);

  return (
    <div
      ref={panelRef}
      className={`relative ${side === 'left' ? 'border-r' : 'border-l'} border-gray-200`}
      style={{ width }}
    >
      {children}
      <div
        onMouseDown={startResize}
        className={`absolute top-0 ${side === 'left' ? 'right-0 -mr-1' : 'left-0 -ml-1'} bottom-0 w-2 cursor-col-resize z-10 opacity-0 hover:opacity-100`}
      >
        <div className="w-1 h-16 bg-purple-400 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};