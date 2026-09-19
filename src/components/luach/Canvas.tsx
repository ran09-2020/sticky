import { useRef, useCallback, type ReactNode } from 'react';

interface CanvasProps {
  children: ReactNode;
}

export function Canvas({ children }: CanvasProps) {
  return (
    <div data-ev-id="ev_a3ae3630ca"
    className="w-full h-full relative overflow-hidden"
    style={{
      backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
      backgroundSize: '40px 40px',
      backgroundColor: '#f3f4f6'
    }}>

      {children}
    </div>);

}