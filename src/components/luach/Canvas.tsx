import { useRef, type ReactNode, type MouseEvent } from 'react';

interface CanvasProps {
  children: ReactNode;
  onCanvasClick?: (x: number, y: number) => void;
}

export function Canvas({ children, onCanvasClick }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // Only handle clicks directly on the canvas background, not on children
    if (e.target !== canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onCanvasClick?.(x, y);
  };

  return (
    <div data-ev-id="ev_fddbdf4c98"
    ref={canvasRef}
    className="absolute inset-0 overflow-hidden cursor-crosshair"
    style={{
      backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
      backgroundSize: '40px 40px',
      backgroundColor: '#f3f4f6'
    }}
    onClick={handleClick}>

      {/* Center marker */}
      <div data-ev-id="ev_d2e4a1fd38" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold pointer-events-none select-none z-10">+</div>
      
      {children}
    </div>);

}