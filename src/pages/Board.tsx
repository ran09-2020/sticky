import { useState, useRef, useCallback, type DragEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { useBoard } from '@/hooks/use-board';
import { useNotes } from '@/hooks/use-notes';
import { useLocalBoards } from '@/hooks/use-local-boards';
import { useAuthor } from '@/hooks/use-author';
import { Canvas } from '@/components/luach/Canvas';
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
  const { notes, loading: notesLoading, addNote, moveNote, resizeNote, updateText, changeColor, changeFont, toggleSticker, bringToFront, deleteNote } = useNotes(board?.id);
  const { boards: localBoards, addBoard, removeBoard } = useLocalBoards();
  const { author, setAuthor } = useAuthor();

  const [toast, setToast] = useState<{message: string;type: 'success' | 'error';} | null>(null);
  const canvasContentRef = useRef<HTMLDivElement>(null);



  const handleExportPdf = useCallback(async () => {
    const contentEl = canvasContentRef.current;
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

  // Handle drop from toolbar
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const noteType = e.dataTransfer.getData('noteType') as NoteType;
    if (!noteType) return;

    // Get the canvas content element's position
    const contentEl = canvasContentRef.current;
    if (!contentEl) return;

    const rect = contentEl.getBoundingClientRect();

    // Note dimensions (to center the note at drop point)
    const noteWidth = noteType === 'sticky' ? 120 : 180;
    const noteHeight = 120;

    // Calculate position relative to the canvas (no zoom/pan anymore)
    const canvasX = e.clientX - rect.left - noteWidth / 2;
    const canvasY = e.clientY - rect.top - noteHeight / 2;

    addNote(noteType, { x: Math.max(0, canvasX), y: Math.max(0, canvasY) }, author);
  }, [addNote, author]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

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
    <div data-ev-id="ev_2420b85897"
    className="h-screen w-screen overflow-hidden bg-gray-100"
    onDrop={handleDrop}
    onDragOver={handleDragOver}>

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
      <Canvas>
        <div data-ev-id="ev_134a15b931" ref={canvasContentRef} className="absolute inset-0">
          {/* Center marker - red + at center of screen */}
          <div data-ev-id="ev_11816c4082" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold pointer-events-none select-none">+</div>
          
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
        onExportPdf={handleExportPdf}
        onCopyLink={handleCopyLink} />




      {/* Toast notifications */}
      {toast &&
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)} />

      }
    </div>);

}