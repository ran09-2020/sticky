import { useRef } from 'react';
import { Plus, StickyNote, FileText, ZoomIn, ZoomOut, Download, Link2 } from 'lucide-react';
import type { NoteType } from '@/types/luach';
import { CANVAS_SIZE } from '@/types/luach';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ToolbarProps {
  scale: number;
  transformRef: React.RefObject<ReactZoomPanPinchRef | null>;
  onAddNote: (type: NoteType, position: {x: number;y: number;}) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
}

export function Toolbar({
  scale,
  transformRef,
  onAddNote,
  onExportPdf,
  onCopyLink
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const getViewportCenter = (): {x: number; y: number;} => {
    const wrapper = transformRef.current;
    
    // Default: center of canvas
    const defaultPos = { x: CANVAS_SIZE / 2 - 60, y: CANVAS_SIZE / 2 - 100 };
    
    if (!wrapper || !wrapper.state) {
      return defaultPos;
    }

    const { positionX, positionY, scale: currentScale } = wrapper.state;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Position above toolbar (bottom center of visible area)
    const screenX = viewportWidth / 2;
    const screenY = viewportHeight - 200; // Above the toolbar

    // Convert screen coordinates to canvas coordinates
    const canvasX = (screenX - positionX) / currentScale - 60;
    const canvasY = (screenY - positionY) / currentScale - 60;

    return { x: canvasX, y: canvasY };
  };

  const handleAddNote = (type: NoteType) => {
    const position = getViewportCenter();
    onAddNote(type, position);
  };

  const handleZoomIn = () => {
    transformRef.current?.zoomIn(0.05);
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut(0.05);
  };

  return (
    <div data-ev-id="ev_6ae86cb565"
    ref={toolbarRef}
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 z-50"
    dir="rtl">

      {/* Add notes */}
      <div data-ev-id="ev_68580745a3" className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button data-ev-id="ev_20a7cf373c"
        onClick={() => handleAddNote('sticky')}
        className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 text-sm font-medium transition-colors">

          <StickyNote size={16} />
          <span data-ev-id="ev_50ef7eead0">פתק</span>
        </button>
        <button data-ev-id="ev_5ec32f3e7a"
        onClick={() => handleAddNote('card')}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 text-sm font-medium transition-colors">

          <FileText size={16} />
          <span data-ev-id="ev_8c4b626abe">כרטיסייה</span>
        </button>
      </div>

      {/* Zoom controls */}
      <div data-ev-id="ev_dad42cadbd" className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button data-ev-id="ev_5e7b81aa7b"
        onClick={handleZoomOut}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="התרחק">

          <ZoomOut size={18} />
        </button>
        <span data-ev-id="ev_a5aaaab5a3" className="text-xs text-gray-500 min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button data-ev-id="ev_af2790c538"
        onClick={handleZoomIn}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="התקרב">

          <ZoomIn size={18} />
        </button>
      </div>

      {/* Export & Share */}
      <div data-ev-id="ev_1d2d25293b" className="flex items-center gap-1">
        <button data-ev-id="ev_ae821d0a1e"
        onClick={onCopyLink}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="העתק קישור">

          <Link2 size={18} />
        </button>
        <button data-ev-id="ev_c616cf849a"
        onClick={onExportPdf}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="שמור ל-PDF">

          <Download size={18} />
        </button>
      </div>
    </div>);

}