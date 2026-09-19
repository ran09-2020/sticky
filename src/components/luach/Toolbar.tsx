import { Download, Link2, StickyNote, FileText, Crosshair } from 'lucide-react';
import type { NoteType } from '@/types/luach';

interface ToolbarProps {
  selectedType: NoteType;
  onTypeSelect: (type: NoteType) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
  onCenterView: () => void;
}

export function Toolbar({
  selectedType,
  onTypeSelect,
  onExportPdf,
  onCopyLink,
  onCenterView
}: ToolbarProps) {
  return (
    <div data-ev-id="ev_2c38a4b008"
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 z-50"
    dir="rtl">

      {/* Note type buttons */}
      <div data-ev-id="ev_fd9be12640" className="flex items-center gap-1 border-l border-gray-200 pl-3">
        <button data-ev-id="ev_b2b1893a89"
        onClick={() => onTypeSelect('sticky')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        selectedType === 'sticky' ?
        'bg-amber-200 text-amber-900 ring-2 ring-amber-400' :
        'bg-amber-100 hover:bg-amber-200 text-amber-800'}`
        }
        title="לחץ ואז לחץ על הלוח להוספת פתק">

          <StickyNote size={16} />
          <span data-ev-id="ev_15f7259c45">פתק</span>
        </button>
        <button data-ev-id="ev_2ae57dd072"
        onClick={() => onTypeSelect('card')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        selectedType === 'card' ?
        'bg-blue-200 text-blue-900 ring-2 ring-blue-400' :
        'bg-blue-100 hover:bg-blue-200 text-blue-800'}`
        }
        title="לחץ ואז לחץ על הלוח להוספת כרטיסייה">

          <FileText size={16} />
          <span data-ev-id="ev_a5ece67589">כרטיסייה</span>
        </button>
      </div>

      {/* Instructions */}
      <div data-ev-id="ev_fa6a4dfffb" className="text-xs text-gray-500">
        לחץ על הלוח להוספה
      </div>

      {/* Center button */}
      <button data-ev-id="ev_175790d17b"
      onClick={onCenterView}
      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
      title="מרכז את התצוגה">

        <Crosshair size={18} />
      </button>

      {/* Export & Share */}
      <div data-ev-id="ev_67f0048f7c" className="flex items-center gap-1 border-r border-gray-200 pr-3">
        <button data-ev-id="ev_96ae76a6fa"
        onClick={onCopyLink}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="העתק קישור">

          <Link2 size={18} />
        </button>
        <button data-ev-id="ev_ff672a5c10"
        onClick={onExportPdf}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="שמור ל-PDF">

          <Download size={18} />
        </button>
      </div>
    </div>);

}