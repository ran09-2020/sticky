import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, X, Plus, Trash2, ChevronLeft } from 'lucide-react';
import type { LocalBoard } from '@/types/luach';

interface SidebarProps {
  currentSlug: string;
  boards: LocalBoard[];
  onRemoveBoard: (slug: string) => void;
  onCreateBoard: (slug: string) => void;
  isProtected: boolean;
  onDeleteBoard?: () => void;
}

export function Sidebar({
  currentSlug,
  boards,
  onRemoveBoard,
  onCreateBoard,
  isProtected,
  onDeleteBoard
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [showNewBoard, setShowNewBoard] = useState(false);
  const navigate = useNavigate();

  const handleCreateBoard = () => {
    const slug = newBoardName.
    toLowerCase().
    trim().
    replace(/[^a-z0-9\u0590-\u05ff]/g, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '').
    slice(0, 64);

    if (slug) {
      onCreateBoard(slug);
      navigate(`/${slug}`);
      setNewBoardName('');
      setShowNewBoard(false);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button data-ev-id="ev_59aa6aca38"
      onClick={() => setIsOpen(true)}
      className="fixed top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur rounded-lg shadow-md hover:bg-gray-50 transition-colors">

        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen &&
      <div data-ev-id="ev_8561cea9a7"
      className="fixed inset-0 bg-black/30 z-50"
      onClick={() => setIsOpen(false)} />

      }

      {/* Sidebar panel */}
      <div data-ev-id="ev_ebe7a92021"
      className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'}`
      }
      dir="rtl">

        <div data-ev-id="ev_9d47b4eb5d" className="flex items-center justify-between p-4 border-b">
          <h2 data-ev-id="ev_399d823fa8" className="text-lg font-semibold">הלוחות שלי</h2>
          <button data-ev-id="ev_4285cbb6e5"
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded">

            <X size={20} />
          </button>
        </div>

        <div data-ev-id="ev_66da352ce2" className="p-4 flex flex-col gap-4 h-[calc(100%-60px)] overflow-auto">
          {/* Create new board */}
          {showNewBoard ?
          <div data-ev-id="ev_a257e31c5b" className="flex flex-col gap-2">
              <input data-ev-id="ev_4106bc650f"
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שם הלוח (אנגלית)"
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus />

              <div data-ev-id="ev_15066cf2ad" className="flex gap-2">
                <button data-ev-id="ev_bb5d29fed6"
              onClick={handleCreateBoard}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">

                  צור
                </button>
                <button data-ev-id="ev_57291bcd03"
              onClick={() => setShowNewBoard(false)}
              className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">

                  ביטול
                </button>
              </div>
            </div> :

          <button data-ev-id="ev_3c8e50585f"
          onClick={() => setShowNewBoard(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">

              <Plus size={18} />
              <span data-ev-id="ev_9b8f084cb4">לוח חדש</span>
            </button>
          }

          {/* Boards list */}
          <div data-ev-id="ev_1e884ef85a" className="flex flex-col gap-1">
            <h3 data-ev-id="ev_75dde8cdea" className="text-sm text-gray-500 font-medium mb-1">לוחות אחרונים</h3>
            {boards.length === 0 &&
            <p data-ev-id="ev_a147d0c563" className="text-sm text-gray-400">אין לוחות בהיסטוריה</p>
            }
            {boards.map((board) =>
            <div data-ev-id="ev_1c48b7a56d"
            key={board.slug}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            board.slug === currentSlug ?
            'bg-blue-100 text-blue-800' :
            'hover:bg-gray-100'}`
            }
            onClick={() => {
              navigate(`/${board.slug}`);
              setIsOpen(false);
            }}>

                <ChevronLeft size={16} className="text-gray-400" />
                <span data-ev-id="ev_d295f4918a" className="flex-1 truncate text-sm">
                  {board.title || board.slug}
                </span>
                {board.slug !== 'public' &&
              <button data-ev-id="ev_6ee7e971ae"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveBoard(board.slug);
              }}
              className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
              title="הסר מההיסטוריה">

                    <X size={14} />
                  </button>
              }
              </div>
            )}
          </div>

          {/* Delete current board */}
          {!isProtected && onDeleteBoard &&
          <div data-ev-id="ev_1d3768f06c" className="mt-auto pt-4 border-t">
              <button data-ev-id="ev_9d6a8830a3"
            onClick={() => {
              if (confirm('האם אתה בטוח שברצונך למחוק את הלוח הזה? פעולה זו לא ניתנת לביטול.')) {
                onDeleteBoard();
                setIsOpen(false);
              }
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">

                <Trash2 size={18} />
                <span data-ev-id="ev_3bef269385">מחק לוח זה</span>
              </button>
            </div>
          }
        </div>
      </div>
    </>);

}