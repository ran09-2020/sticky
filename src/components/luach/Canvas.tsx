import { useState, useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode, type MouseEvent } from 'react';

export interface CanvasHandle {
  centerView: () => void;
}

interface CanvasProps {
  children: ReactNode;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ children }, ref) => {
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Expose centerView function to parent
  useImperativeHandle(ref, () => ({
    centerView: () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Scroll to center of canvas
      const scrollX = (canvasSize.width - container.clientWidth) / 2;
      const scrollY = (canvasSize.height - container.clientHeight) / 2;

      container.scrollTo({
        left: Math.max(0, scrollX),
        top: Math.max(0, scrollY),
        behavior: 'smooth'
      });
    }
  }), [canvasSize]);

  const handleResizeStart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: canvasSize.width,
      height: canvasSize.height
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e: globalThis.MouseEvent) => {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      const newWidth = Math.max(window.innerWidth / 2, resizeStart.current.width + dx);
      const newHeight = Math.max(window.innerHeight / 2, resizeStart.current.height + dy);
      setCanvasSize({ width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <div data-ev-id="ev_c80e5515a1"
    ref={scrollContainerRef}
    className="absolute inset-0 overflow-auto bg-slate-300">

      <div data-ev-id="ev_ceddbbc51e"
      className="relative border-2 border-slate-400 shadow-lg"
      style={{
        width: canvasSize.width,
        height: canvasSize.height,
        minWidth: '50%',
        minHeight: '50%',
        backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
        backgroundSize: '40px 40px',
        backgroundColor: '#f3f4f6'
      }}>


        {/* Center marker */}
        <div data-ev-id="ev_371056db9a"
        className="absolute text-red-500 text-6xl font-bold pointer-events-none select-none z-10"
        style={{
          left: canvasSize.width / 2,
          top: canvasSize.height / 2,
          transform: 'translate(-50%, -50%)'
        }}>

          +
        </div>
        
        {children}

        {/* Resize handle - bottom right corner */}
        <div data-ev-id="ev_9049b8c1f6"
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center"
        onMouseDown={handleResizeStart}
        title="גרור להגדלת הלוח">

          <svg data-ev-id="ev_aafcb9fdf5" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 hover:text-gray-600">
            <path data-ev-id="ev_42213c3ff1" d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 10H20V8H22V10ZM18 14H16V12H18V14ZM14 18H12V16H14V18ZM10 22H8V20H10V22Z" />
          </svg>
        </div>

        {/* Right edge resize handle */}
        <div data-ev-id="ev_db64dda97e"
        className="absolute top-0 right-0 w-2 h-full cursor-e-resize z-40 hover:bg-blue-400/30"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: canvasSize.width,
            height: canvasSize.height
          };

          const handleMove = (ev: globalThis.MouseEvent) => {
            const dx = ev.clientX - resizeStart.current.x;
            setCanvasSize((prev) => ({
              ...prev,
              width: Math.max(window.innerWidth / 2, resizeStart.current.width + dx)
            }));
          };

          const handleUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
          };

          window.addEventListener('mousemove', handleMove);
          window.addEventListener('mouseup', handleUp);
        }} />


        {/* Bottom edge resize handle */}
        <div data-ev-id="ev_30b7e23fc0"
        className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize z-40 hover:bg-blue-400/30"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: canvasSize.width,
            height: canvasSize.height
          };

          const handleMove = (ev: globalThis.MouseEvent) => {
            const dy = ev.clientY - resizeStart.current.y;
            setCanvasSize((prev) => ({
              ...prev,
              height: Math.max(window.innerHeight / 2, resizeStart.current.height + dy)
            }));
          };

          const handleUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
          };

          window.addEventListener('mousemove', handleMove);
          window.addEventListener('mouseup', handleUp);
        }} />

      </div>
    </div>);

});

Canvas.displayName = 'Canvas';