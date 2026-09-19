import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import Draggable, { type DraggableEvent, type DraggableData } from 'react-draggable';
import { X, Palette, Type, Sticker } from 'lucide-react';
import type { Note, NoteColor, NoteFont, Sticker as StickerType } from '@/types/luach';
import { NOTE_COLORS, NOTE_FONTS, STICKER_EMOJI } from '@/types/luach';
import { ColorPicker } from '@/components/luach/ColorPicker';
import { FontPicker } from '@/components/luach/FontPicker';
import { StickerPicker } from '@/components/luach/StickerPicker';

interface NoteCardProps {
  note: Note;
  scale: number;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onTextChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onFontChange: (id: string, font: NoteFont) => void;
  onStickerToggle: (id: string, sticker: StickerType) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({
  note,
  scale,
  onMove,
  onResize,
  onTextChange,
  onColorChange,
  onFontChange,
  onStickerToggle,
  onBringToFront,
  onDelete
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [localText, setLocalText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number>();

  // Sync text from server
  useEffect(() => {
    setLocalText(note.text);
  }, [note.text]);

  // Debounced text update
  const handleTextChange = useCallback((value: string) => {
    setLocalText(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      onTextChange(note.id, value);
    }, 300);
  }, [note.id, onTextChange]);

  // Handle resize
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleResizeStart = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: note.width,
      height: note.height
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e: globalThis.MouseEvent) => {
      const dx = (e.clientX - resizeStart.x) / scale;
      const dy = (e.clientY - resizeStart.y) / scale;
      const newWidth = Math.max(80, resizeStart.width + dx);
      const newHeight = Math.max(60, resizeStart.height + dy);
      onResize(note.id, newWidth, newHeight);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, resizeStart, scale, note.id, onResize]);

  const colorConfig = NOTE_COLORS[note.color as NoteColor] ?? NOTE_COLORS.yellow;
  const fontFamily = NOTE_FONTS[note.font as NoteFont] ?? NOTE_FONTS.base;
  const isCard = note.type === 'card';

  const handleDragStart = () => {
    onBringToFront(note.id);
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    onMove(note.id, data.x, data.y);
  };

  const closePickers = () => {
    setShowColorPicker(false);
    setShowFontPicker(false);
    setShowStickerPicker(false);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: note.x, y: note.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      handle=".drag-handle"
      scale={scale}
      cancel=".no-drag">

      <div data-ev-id="ev_26af3bc375"
      ref={nodeRef}
      className="absolute select-none"
      style={{
        width: note.width,
        height: note.height,
        zIndex: note.z_index
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {setIsHovered(false);closePickers();}}>

        {/* Main card */}
        <div data-ev-id="ev_56a0ea7d89"
        className="drag-handle w-full h-full rounded-md cursor-move shadow-md relative overflow-hidden"
        style={{
          background: colorConfig.gradient,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
        }}>

          {/* Card lines */}
          {isCard &&
          <>
              <div data-ev-id="ev_adf83a6a96" className="absolute top-0 left-0 right-0 h-3 bg-red-400/60" />
              <div data-ev-id="ev_57910a955b" className="absolute top-5 left-2 right-2 bottom-6 flex flex-col gap-2">
                {[...Array(5)].map((_, i) =>
              <div data-ev-id="ev_2fe2f7bad8" key={i} className="h-px bg-blue-300/30" />
              )}
              </div>
            </>
          }

          {/* Stickers */}
          {note.stickers.length > 0 &&
          <div data-ev-id="ev_1a1c6268ec" className="absolute bottom-1 left-1 flex gap-0.5 text-sm">
              {note.stickers.map((s) =>
            <span data-ev-id="ev_8e4bf42f4f" key={s}>{STICKER_EMOJI[s as StickerType]}</span>
            )}
            </div>
          }

          {/* Text area */}
          <textarea data-ev-id="ev_685339aea3"
          ref={textareaRef}
          value={localText}
          onChange={(e) => handleTextChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="no-drag w-full h-full bg-transparent border-none outline-none resize-none p-2 text-gray-800 text-sm leading-relaxed"
          style={{
            fontFamily,
            paddingTop: isCard ? '18px' : '8px'
          }}
          placeholder="הקלד כאן..."
          dir="auto" />


          {/* Author signature */}
          {note.author &&
          <div data-ev-id="ev_d86810709f"
          className="absolute bottom-1 left-2 text-[10px] text-gray-500/70 truncate max-w-[80%]"
          style={{ fontFamily: NOTE_FONTS.hand }}>

              — {note.author}
            </div>
          }

          {/* Resize handle */}
          <div data-ev-id="ev_9e18178fab"
          ref={resizeRef}
          className="no-drag absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={handleResizeStart}>

            <svg data-ev-id="ev_25e0cfd6ca" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
              <path data-ev-id="ev_f0d75658d4" d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
            </svg>
          </div>
        </div>

        {/* Toolbar */}
        {isHovered &&
        <div data-ev-id="ev_d6defdd024" className="no-drag absolute -top-8 left-0 flex gap-1 bg-white/95 backdrop-blur rounded-md shadow-lg p-1 z-50">
            <button data-ev-id="ev_36d34ce97a"
          onClick={() => {closePickers();setShowColorPicker(!showColorPicker);}}
          className="p-1 hover:bg-gray-100 rounded text-gray-600"
          title="צבע">

              <Palette size={16} />
            </button>
            <button data-ev-id="ev_7dd840b73e"
          onClick={() => {closePickers();setShowFontPicker(!showFontPicker);}}
          className="p-1 hover:bg-gray-100 rounded text-gray-600"
          title="פונט">

              <Type size={16} />
            </button>
            <button data-ev-id="ev_34906d50a4"
          onClick={() => {closePickers();setShowStickerPicker(!showStickerPicker);}}
          className="p-1 hover:bg-gray-100 rounded text-gray-600"
          title="מדבקות">

              <Sticker size={16} />
            </button>
            <button data-ev-id="ev_34d6301b80"
          onClick={() => onDelete(note.id)}
          className="p-1 hover:bg-red-100 rounded text-red-500"
          title="מחק">

              <X size={16} />
            </button>

            {/* Pickers */}
            {showColorPicker &&
          <ColorPicker
            current={note.color as NoteColor}
            onSelect={(color) => {onColorChange(note.id, color);setShowColorPicker(false);}} />

          }
            {showFontPicker &&
          <FontPicker
            current={note.font as NoteFont}
            onSelect={(font) => {onFontChange(note.id, font);setShowFontPicker(false);}} />

          }
            {showStickerPicker &&
          <StickerPicker
            current={note.stickers as StickerType[]}
            onToggle={(sticker) => onStickerToggle(note.id, sticker)} />

          }
          </div>
        }
      </div>
    </Draggable>);

}