import { useRef, type DragEvent } from 'react';
import { StickyNote, FileText, Download, Link2 } from 'lucide-react';
import type { NoteType } from '@/types/luach';

interface ToolbarProps {
  onExportPdf: () => void;
  onCopyLink: () => void;
}

export function Toolbar({
  onExportPdf,
  onCopyLink
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Handle drag start - set the note type in dataTransfer
  const handleDragStart = (e: DragEvent<HTMLButtonElement>, type: NoteType) => {
    e.dataTransfer.setData('noteType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div data-ev-id="ev_a23a4a8db7"
    ref={toolbarRef}
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 z-50"
    dir="rtl">

      {/* Draggable note buttons */}
      <div data-ev-id="ev_a26a37718f" className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button data-ev-id="ev_4eb4b36bcf"
        draggable
        onDragStart={(e) => handleDragStart(e, 'sticky')}
        className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 text-sm font-medium transition-colors cursor-grab active:cursor-grabbing"
        title="גרור ללוח כדי להוסיף פתק">

          <StickyNote size={16} />
          <span data-ev-id="ev_35c3f4c001">פתק</span>
        </button>
        <button data-ev-id="ev_1e93435c2b"
        draggable
        onDragStart={(e) => handleDragStart(e, 'card')}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 text-sm font-medium transition-colors cursor-grab active:cursor-grabbing"
        title="גרור ללוח כדי להוסיף כרטיסייה">

          <FileText size={16} />
          <span data-ev-id="ev_e51ae0e7c1">כרטיסייה</span>
        </button>
      </div>

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