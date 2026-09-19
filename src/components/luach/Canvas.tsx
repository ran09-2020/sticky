import { useRef, useCallback, type ReactNode } from 'react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { CANVAS_SIZE, MIN_ZOOM, MAX_ZOOM } from '@/types/luach';

interface CanvasProps {
  children: ReactNode;
  onScaleChange?: (scale: number) => void;
  transformRef?: React.RefObject<ReactZoomPanPinchRef | null>;
}

export function Canvas({ children, onScaleChange, transformRef }: CanvasProps) {
  const localRef = useRef<ReactZoomPanPinchRef>(null);
  const ref = transformRef ?? localRef;

  const handleTransform = useCallback((
    _ref: ReactZoomPanPinchRef,
    state: { scale: number }
  ) => {
    onScaleChange?.(state.scale);
  }, [onScaleChange]);

  // Center the canvas: position so that canvas center aligns with viewport center
  const initialX = typeof window !== 'undefined' ? -(CANVAS_SIZE - window.innerWidth) / 2 : 0;
  const initialY = typeof window !== 'undefined' ? -(CANVAS_SIZE - window.innerHeight) / 2 : 0;

  return (
    <TransformWrapper
      ref={ref}
      initialScale={1}
      minScale={MIN_ZOOM}
      maxScale={MAX_ZOOM}
      limitToBounds={false}
      wheel={{ step: 0.05 }}
      panning={{ velocityDisabled: true, excluded: ['no-drag'] }}
      onTransform={handleTransform}
      initialPositionX={initialX}
      initialPositionY={initialY}
    >

      {({ zoomIn, zoomOut, resetTransform }) =>
      <>
          <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            cursor: 'grab'
          }}
          contentStyle={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE
          }}>

            {/* Grid background */}
            <div data-ev-id="ev_e5227cf1ad"
          className="absolute inset-0"
          style={{
            backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
            backgroundSize: '40px 40px',
            backgroundColor: '#f9fafb'
          }} />

            {children}
          </TransformComponent>

          {/* Zoom controls - accessible via ref */}
          <div data-ev-id="ev_1e14cbf6fc" className="hidden">
            <button data-ev-id="ev_21ff7a3da6" data-zoom-in onClick={() => zoomIn(0.2)}>+</button>
            <button data-ev-id="ev_06ca447001" data-zoom-out onClick={() => zoomOut(0.2)}>-</button>
            <button data-ev-id="ev_a0988072b1" data-reset onClick={() => resetTransform()}>↻</button>
          </div>
        </>
      }
    </TransformWrapper>);

}