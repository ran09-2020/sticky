import { useRef, type ReactNode, type DragEvent } from 'react';

interface CanvasProps {
  children: ReactNode;
  onNoteDrop?: (x: number, y: number, noteType: string) => void;
}

export function Canvas({ children, onNoteDrop }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const noteType = e.dataTransfer.getData('noteType');
    if (!noteType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onNoteDrop?.(x, y, noteType);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div data-ev-id="ev_3657d1434a"
    ref={canvasRef}
    className="absolute inset-0 overflow-hidden"
    style={{
      backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
      backgroundSize: '40px 40px',
      backgroundColor: '#f3f4f6'
    }}
    onDrop={handleDrop}
    onDragOver={handleDragOver}>

      {/* Center marker */}
      <div data-ev-id="ev_90bddf16e0" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold pointer-events-none select-none z-10">+</div>
      
      {children}
    </div>);

}