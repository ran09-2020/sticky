import { Download, Link2 } from 'lucide-react';

interface ToolbarProps {
  onExportPdf: () => void;
  onCopyLink: () => void;
}

export function Toolbar({
  onExportPdf,
  onCopyLink
}: ToolbarProps) {
  return (
    <div data-ev-id="ev_df287e5623"
    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 z-50"
    dir="rtl">

      {/* Instructions */}
      <div data-ev-id="ev_861a35a70f" className="text-sm text-gray-600 border-l border-gray-200 pl-3">
        לחץ על הלוח להוספת פתק
      </div>

      {/* Export & Share */}
      <div data-ev-id="ev_fd9be12640" className="flex items-center gap-1">
        <button data-ev-id="ev_b2b1893a89"
        onClick={onCopyLink}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="העתק קישור">

          <Link2 size={18} />
        </button>
        <button data-ev-id="ev_2b22560337"
        onClick={onExportPdf}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
        title="שמור ל-PDF">

          <Download size={18} />
        </button>
      </div>
    </div>);

}