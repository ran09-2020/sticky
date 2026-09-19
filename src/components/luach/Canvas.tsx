import { useRef, useCallback, type ReactNode } from 'react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { CANVAS_SIZE, MIN_ZOOM, MAX_ZOOM } from '@/types/luach';

interface CanvasProps {
  children: ReactNode;
  onScaleChange?: (scale: number) => void;
  transformRef?: React.RefObject<ReactZoomPanPinchRef | null>;
  showCenterMarker?: boolean;
}

export function Canvas({ children, onScaleChange, transformRef, showCenterMarker }: CanvasProps) {
  const localRef = useRef<ReactZoomPanPinchRef>(null);
  const ref = transformRef ?? localRef;

  const handleTransform = useCallback((
  _ref: ReactZoomPanPinchRef,
  state: {scale: number;}) =>
  {
    onScaleChange?.(state.scale);
  }, [onScaleChange]);

  return (
    <div data-ev-id="ev_fddbdf4c98"
    className="w-full h-full relative"
    style={{
      backgroundImage: `
          linear-gradient(to right, #d1d5db 1px, transparent 1px),
          linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
      backgroundSize: '40px 40px',
      backgroundColor: '#f3f4f6'
    }}>

      <TransformWrapper
        ref={ref}
        initialScale={1}
        minScale={MIN_ZOOM}
        maxScale={MAX_ZOOM}
        limitToBounds={false}
        wheel={{ step: 0.05 }}
        panning={{ velocityDisabled: true, excluded: ['no-drag'] }}
        onTransform={handleTransform}
        initialPositionX={0}
        initialPositionY={0}>

        {() =>
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

            {/* Transparent canvas area */}
            <div data-ev-id="ev_83b6183323" className="absolute inset-0" />

            {children}
          </TransformComponent>
        }
      </TransformWrapper>

      {/* Center marker - shows when centering */}
      {showCenterMarker &&
      <div data-ev-id="ev_a92054b12a" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none animate-pulse">
          <div data-ev-id="ev_d994ed4f98" className="relative">
            {/* Crosshair lines */}
            <div data-ev-id="ev_9a69d5eb93" className="absolute w-20 h-1 bg-red-500 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <div data-ev-id="ev_5269aa0cc9" className="absolute w-1 h-20 bg-red-500 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            {/* Center circle */}
            <div data-ev-id="ev_5d3d03aa40" className="absolute w-8 h-8 border-4 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            {/* Label */}
            <div data-ev-id="ev_30ee2f66a4" className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
              מרכז הלוח
            </div>
          </div>
        </div>
      }
    </div>);

}