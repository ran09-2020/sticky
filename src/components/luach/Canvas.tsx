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

            {/* Center marker - red + */}
            <div data-ev-id="ev_95b42248f7"
          className="absolute flex items-center justify-center text-red-500 font-bold text-4xl select-none pointer-events-none"
          style={{
            left: CANVAS_SIZE / 2 - 20,
            top: CANVAS_SIZE / 2 - 20,
            width: 40,
            height: 40
          }}>

              +
            </div>

            {children}
          </TransformComponent>
        }
      </TransformWrapper>
    </div>);

}