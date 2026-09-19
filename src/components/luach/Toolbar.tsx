import { useRef } from 'react';
import { StickyNote, FileText, Download, Link2, Crosshair } from 'lucide-react';
import type { NoteType } from '@/types/luach';
import { CANVAS_SIZE } from '@/types/luach';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ToolbarProps {
  scale: number;
  transformRef: React.RefObject<ReactZoomPanPinchRef | null>;
  onAddNote: (type: NoteType, position: {x: number;y: number;}) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
  onCenterView: () => void;
}

export function Toolbar({
  scale,
  transformRef,
  onAddNote,
  onExportPdf,
  onCopyLink,
  onCenterView,
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Calculate position near the toolbar (bottom center of visible area)
  const getNotePosition = (): {x: number;y: number;} => {
    const wrapper = transformRef.current;

    if (!wrapper || !wrapper.state) {
      return { x: 200, y: 200 };
    }

    const { positionX, positionY, scale: currentScale } = wrapper.state;

    // Position near bottom center of viewport (above toolbar)
    const screenX = window.innerWidth / 2;
    const screenY = window.innerHeight - 150;

    // Convert to canvas coordinates
    const canvasX = (screenX - positionX) / currentScale - 60;
    const canvasY = (screenY - positionY) / currentScale - 60;

    return { x: Math.max(10, canvasX), y: Math.max(10, canvasY) };
  };

  const handleAddNote = (type: NoteType) => {
    const position = getNotePosition();
    onAddNote(type, position);
  };

  const handleZoomIn = () => {
    transformRef.current?.zoomIn(0.05);
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut(0.05);
  };

  const handleCenterView = () => {
    const wrapper = transformRef.current;
    if (!wrapper) return;

    // Center the canvas: move so that canvas center is at viewport center
    const centerX = -(CANVAS_SIZE / 2) + window.innerWidth / 2;
    const centerY = -(CANVAS_SIZE / 2) + window.innerHeight / 2;

    wrapper.setTransform(centerX, centerY, 1, 300);
    onCenterView();
  };

  return (
    <div data-ev-id="ev_a23a4a8db7"
    ref={toolbarRef}
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 z-50"
    dir="rtl">

      {/* Add notes */}
      <div data-ev-id="ev_98458c0d6f" className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button data-ev-id="ev_93e2e8b72d"
        onClick={() => handleAddNote('sticky')}
        className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 text-sm font-medium transition-colors">

          <StickyNote size={16} />
          <span data-ev-id="ev_c80df79931">פתק</span>
        </button>
        <button data-ev-id="ev_7a5e542d90"
        onClick={() => handleAddNote('card')}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 text-sm font-medium transition-colors">

          <FileText size={16} />
          <span data-ev-id="ev_86fe76952e">כרטיסייה</span>
        </button>
      </div>

      {/* Zoom controls */}
      <div data-ev-id="ev_7a8f84692c" className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button data-ev-id="ev_538f62a57d"
        onClick={handleZoomIn}
        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-700 font-bold text-lg"
        title="הגדל">

          +
        </button>
        <span data-ev-id="ev_3dc253d684" className="text-xs text-gray-500 min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button data-ev-id="ev_dd126f842a"
        onClick={handleZoomOut}
        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-700 font-bold text-lg"
        title="הקטן">

          −
        </button>
      </div>

      {/* Center button */}
      <button data-ev-id="ev_faed6d5297"
      onClick={handleCenterView}
      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 border-l border-gray-200 pl-2"
      title="מרכז את הלוח">

        <Crosshair size={18} />
      </button>

      {/* Export & Share */}
      <div data-ev-id="ev_06051549ed" className="flex items-center gap-1">
        <button data-ev-id="ev_5ed29b8041"
        onClick={onCopyLink}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="העתק קישור">

          <Link2 size={18} />
        </button>
        <button data-ev-id="ev_3efabc6bdf"
        onClick={onExportPdf}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="שמור ל-PDF">

          <Download size={18} />
        </button>
      </div>
    </div>);

}