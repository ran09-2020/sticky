import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { useBoard } from '@/hooks/use-board';
import { useNotes } from '@/hooks/use-notes';
import { useLocalBoards } from '@/hooks/use-local-boards';
import { useAuthor } from '@/hooks/use-author';
import { Canvas, type CanvasHandle } from '@/components/luach/Canvas';
import { NoteCard } from '@/components/luach/NoteCard';
import { Toolbar } from '@/components/luach/Toolbar';
import { Sidebar } from '@/components/luach/Sidebar';
import { Header } from '@/components/luach/Header';
import { Toast } from '@/components/luach/Toast';
import { exportToPdf } from '@/lib/export-pdf';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import type { NoteType, NoteColor, NoteFont, Sticker } from '@/types/luach';
import { Loader2 } from 'lucide-react';

export default function Board() {
  const { slug = 'public' } = useParams<{slug: string;}>();
  const navigate = useNavigate();

  const { board, loading: boardLoading, error, updateTitle, deleteBoard } = useBoard(slug);
  const { notes, loading: notesLoading, addNote, moveNote, resizeNote, updateText, changeColor, changeFont, toggleSticker, bringToFront, deleteNote, deleteAllNotes } = useNotes(board?.id);
  const { boards: localBoards, addBoard, removeBoard } = useLocalBoards();
  const { author, setAuthor } = useAuthor();

  const [toast, setToast] = useState<{message: string;type: 'success' | 'error';} | null>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType>('sticky');
  const [boardSizePercent, setBoardSizePercent] = useState(100);
  const notesContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleSizeChange = useCallback((widthPercent: number, heightPercent: number) => {
    // Use the average or max of width/height percent
    setBoardSizePercent(Math.max(widthPercent, heightPercent));
  }, []);

  const handleCenterView = useCallback(() => {
    canvasRef.current?.centerView();
  }, []);

  const handleResetSize = useCallback(() => {
    canvasRef.current?.resetSize();
  }, []);

  const handleDeleteAllNotes = useCallback(() => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הפתקים? פעולה זו בלתי הפיכה.')) {
      deleteAllNotes();
    }
  }, [deleteAllNotes]);

  const handleExportPdf = useCallback(async () => {
    const contentEl = notesContainerRef.current;
    if (!contentEl) return;

    const success = await exportToPdf(contentEl, `${slug}-${Date.now()}.pdf`);
    setToast({
      message: success ? 'הלוח נשמר בהצלחה!' : 'שגיאה בשמירת ה-PDF',
      type: success ? 'success' : 'error'
    });
  }, [slug]);

  const handleCopyLink = useCallback(() => {
    const success = copyToClipboard(window.location.href);
    setToast({
      message: success ? 'הקישור הועתק!' : 'שגיאה בהעתקת הקישור',
      type: success ? 'success' : 'error'
    });
  }, []);

  const handleDeleteBoard = useCallback(async () => {
    const success = await deleteBoard();
    if (success) {
      removeBoard(slug);
      navigate('/public');
    } else {
      setToast({ message: 'שגיאה במחיקת הלוח', type: 'error' });
    }
  }, [deleteBoard, removeBoard, slug, navigate]);

  const handleCreateBoard = useCallback((newSlug: string) => {
    addBoard({ slug: newSlug, title: '' });
  }, [addBoard]);

  // Handle click on canvas - create a note at click position
  const handleCanvasClick = useCallback((x: number, y: number) => {
    // Center the note on the click point
    const noteWidth = selectedNoteType === 'sticky' ? 120 : 180;
    const noteHeight = 120;
    const posX = Math.max(0, x - noteWidth / 2);
    const posY = Math.max(0, y - noteHeight / 2);

    addNote(selectedNoteType, { x: posX, y: posY }, author);
  }, [addNote, author, selectedNoteType]);

  // Database not enabled
  if (!supabase) {
    return (
      <div data-ev-id="ev_842ad279fe" className="flex items-center justify-center h-screen bg-gray-50" dir="rtl">
        <div data-ev-id="ev_dde6744477" className="text-center p-8">
          <h1 data-ev-id="ev_3e1ae2c1f8" className="text-2xl font-bold text-gray-800 mb-2">המערכת לא זמינה</h1>
          <p data-ev-id="ev_5cca9ebf37" className="text-gray-600">יש להפעיל את מסד הנתונים תחילה</p>
        </div>
      </div>);

  }

  // Loading
  if (boardLoading || notesLoading) {
    return (
      <div data-ev-id="ev_1cf3ac1709" className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>);

  }

  // Error
  if (error) {
    return (
      <div data-ev-id="ev_5a3954db68" className="flex items-center justify-center h-screen bg-gray-50" dir="rtl">
        <div data-ev-id="ev_df15189179" className="text-center p-8">
          <h1 data-ev-id="ev_e4bb332ef4" className="text-2xl font-bold text-red-600 mb-2">שגיאה</h1>
          <p data-ev-id="ev_da19c09ba9" className="text-gray-600">{error}</p>
        </div>
      </div>);

  }

  if (!board) return null;

  return (
    <div data-ev-id="ev_2420b85897" className="h-screen w-screen overflow-hidden bg-gray-100 relative">

      {/* Header */}
      <Header
        title={board.title}
        author={author}
        isProtected={board.is_protected}
        onTitleChange={updateTitle}
        onAuthorChange={setAuthor} />


      {/* Sidebar */}
      <Sidebar
        currentSlug={slug}
        boards={localBoards}
        onRemoveBoard={removeBoard}
        onCreateBoard={handleCreateBoard}
        isProtected={board.is_protected}
        onDeleteBoard={!board.is_protected ? handleDeleteBoard : undefined} />


      {/* Canvas */}
      <Canvas ref={canvasRef} onSizeChange={handleSizeChange}>
        <div data-ev-id="ev_1bf3cdf1a1"
        ref={notesContainerRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={(e) => {
          // Only handle clicks directly on this container, not on notes
          if (e.target === e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleCanvasClick(x, y);
          }
        }}>


          {notes.map((note) =>
          <NoteCard
            key={note.id}
            note={note}
            scale={1}
            onMove={moveNote}
            onResize={resizeNote}
            onTextChange={updateText}
            onColorChange={changeColor}
            onFontChange={changeFont}
            onStickerToggle={toggleSticker}
            onBringToFront={bringToFront}
            onDelete={deleteNote} />

          )}
        </div>
      </Canvas>

      {/* Toolbar */}
      <Toolbar
        selectedType={selectedNoteType}
        onTypeSelect={setSelectedNoteType}
        onExportPdf={handleExportPdf}
        onCopyLink={handleCopyLink}
        onCenterView={handleCenterView}
        onResetSize={handleResetSize}
        onDeleteAll={handleDeleteAllNotes}
        boardSizePercent={boardSizePercent} />




      {/* Toast notifications */}
      {toast &&
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)} />

      }
    </div>);

}