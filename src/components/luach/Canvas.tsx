import { useState, useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';

export interface CanvasHandle {
  centerView: () => void;
  resetSize: () => void;
}

interface CanvasProps {
  children: ReactNode;
  onSizeChange?: (widthPercent: number, heightPercent: number) => void;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ children, onSizeChange }, ref) => {
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Notify parent of size changes
  useEffect(() => {
    const widthPercent = Math.round(canvasSize.width / window.innerWidth * 100);
    const heightPercent = Math.round(canvasSize.height / window.innerHeight * 100);
    onSizeChange?.(widthPercent, heightPercent);
  }, [canvasSize, onSizeChange]);

  // Expose centerView and resetSize functions to parent
  useImperativeHandle(ref, () => ({
    centerView: () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Calculate scroll position to center the canvas
      // When canvas is larger than viewport, scroll to center
      // When canvas is smaller, it's already centered via CSS flex
      const scrollX = Math.max(0, (container.scrollWidth - container.clientWidth) / 2);
      const scrollY = Math.max(0, (container.scrollHeight - container.clientHeight) / 2);

      container.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: 'smooth'
      });
    },
    resetSize: () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      scrollContainerRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }), []);



  return (
    <div data-ev-id="ev_1b1c73a82f"
    ref={scrollContainerRef}
    className="absolute inset-0 overflow-auto bg-slate-300 flex items-center justify-center">

      <div data-ev-id="ev_be9ea112d2"
      className="relative border-2 border-slate-400 shadow-lg flex-shrink-0"
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
        className="absolute pointer-events-none select-none z-10 flex items-center justify-center opacity-20"
        style={{
          left: canvasSize.width / 2,
          top: canvasSize.height / 2,
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>
        </div>
        
        {children}

        {/* Resize handle - bottom left corner */}
        <div data-ev-id="ev_ae80edf7fc"
        className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize z-50 flex items-center justify-center"
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
            const dy = ev.clientY - resizeStart.current.y;
            // Dragging left (negative dx) = increase width, dragging down = increase height
            setCanvasSize({
              width: Math.max(window.innerWidth / 2, resizeStart.current.width - dx),
              height: Math.max(window.innerHeight / 2, resizeStart.current.height + dy)
            });
          };

          const handleUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
          };

          window.addEventListener('mousemove', handleMove);
          window.addEventListener('mouseup', handleUp);
        }}
        title="גרור להגדלת הלוח">

          <svg data-ev-id="ev_763057e69e" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 hover:text-gray-600 transform scale-x-[-1]">
            <path data-ev-id="ev_f7762a27d7" d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 10H20V8H22V10ZM18 14H16V12H18V14ZM14 18H12V16H14V18ZM10 22H8V20H10V22Z" />
          </svg>
        </div>

        {/* Left edge resize handle */}
        <div data-ev-id="ev_4022d41956"
        className="absolute top-0 left-0 w-2 h-full cursor-w-resize z-40 hover:bg-blue-400/30"
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
            // Dragging left (negative dx) = increase width
            setCanvasSize((prev) => ({
              ...prev,
              width: Math.max(window.innerWidth / 2, resizeStart.current.width - dx)
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