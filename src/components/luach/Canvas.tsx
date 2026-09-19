import type { ReactNode } from 'react';

interface CanvasProps {
  children: ReactNode;
}

export function Canvas({ children }: CanvasProps) {
  return (
    <div data-ev-id="ev_a3ae3630ca"
    className="absolute inset-0 overflow-hidden"
    style={{
      backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
      backgroundSize: '40px 40px',
      backgroundColor: '#f3f4f6'
    }}>

      {/* Center marker */}
      <div data-ev-id="ev_dd059761fc" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold pointer-events-none select-none z-10">+</div>
      
      {children}
    </div>);

}