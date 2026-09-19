import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Note, NoteInsert, NoteUpdate, NoteType, NoteColor, NoteFont, Sticker } from '@/types/luach';
import { DEFAULT_STICKY_SIZE, DEFAULT_CARD_SIZE } from '@/types/luach';

export function useNotes(boardId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const maxZIndex = useRef(1);

  // Fetch initial notes
  useEffect(() => {
    if (!supabase || !boardId) return;

    const fetchNotes = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('board_id', boardId)
        .order('z_index', { ascending: true });

      const notesList = data ?? [];
      setNotes(notesList);
      maxZIndex.current = Math.max(1, ...notesList.map(n => n.z_index));
      setLoading(false);
    };

    fetchNotes();
  }, [boardId]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!supabase || !boardId) return;

    const channel = supabase
      .channel(`notes:${boardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNote = payload.new as Note;
            setNotes(prev => {
              if (prev.some(n => n.id === newNote.id)) return prev;
              maxZIndex.current = Math.max(maxZIndex.current, newNote.z_index);
              return [...prev, newNote];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Note;
            setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
            maxZIndex.current = Math.max(maxZIndex.current, updated.z_index);
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Note;
            setNotes(prev => prev.filter(n => n.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId]);

  // Add note
  const addNote = useCallback(async (
    type: NoteType,
    position: { x: number; y: number },
    author: string
  ) => {
    if (!supabase || !boardId) return;

    const size = type === 'sticky' ? DEFAULT_STICKY_SIZE : DEFAULT_CARD_SIZE;
    const newZIndex = maxZIndex.current + 1;
    maxZIndex.current = newZIndex;

    const noteData: NoteInsert = {
      board_id: boardId,
      type,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      author,
      z_index: newZIndex,
    };

    // Optimistic update
    const tempId = crypto.randomUUID();
    const tempNote: Note = {
      id: tempId,
      board_id: boardId,
      text: '',
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      type,
      color: 'yellow',
      font: 'base',
      stickers: [],
      author,
      z_index: newZIndex,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotes(prev => [...prev, tempNote]);

    const { data } = await supabase
      .from('notes')
      .insert(noteData)
      .select()
      .single();

    if (data) {
      setNotes(prev => prev.map(n => n.id === tempId ? data : n));
    }
  }, [boardId]);

  // Update note
  const updateNote = useCallback(async (id: string, updates: NoteUpdate) => {
    if (!supabase) return;

    // Optimistic update
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } as Note : n));

    await supabase
      .from('notes')
      .update(updates)
      .eq('id', id);
  }, []);

  // Move note (called on drag end)
  const moveNote = useCallback(async (id: string, x: number, y: number) => {
    await updateNote(id, { x, y });
  }, [updateNote]);

  // Resize note
  const resizeNote = useCallback(async (id: string, width: number, height: number) => {
    await updateNote(id, { width, height });
  }, [updateNote]);

  // Update text
  const updateText = useCallback(async (id: string, text: string) => {
    await updateNote(id, { text });
  }, [updateNote]);

  // Change color
  const changeColor = useCallback(async (id: string, color: NoteColor) => {
    await updateNote(id, { color });
  }, [updateNote]);

  // Change font
  const changeFont = useCallback(async (id: string, font: NoteFont) => {
    await updateNote(id, { font });
  }, [updateNote]);

  // Toggle sticker
  const toggleSticker = useCallback(async (id: string, sticker: Sticker) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const stickers = note.stickers.includes(sticker)
      ? note.stickers.filter(s => s !== sticker)
      : [...note.stickers, sticker];

    await updateNote(id, { stickers });
  }, [notes, updateNote]);

  // Bring to front
  const bringToFront = useCallback(async (id: string) => {
    const newZIndex = maxZIndex.current + 1;
    maxZIndex.current = newZIndex;
    await updateNote(id, { z_index: newZIndex });
  }, [updateNote]);

  // Delete note
  const deleteNote = useCallback(async (id: string) => {
    if (!supabase) return;

    // Optimistic update
    setNotes(prev => prev.filter(n => n.id !== id));

    await supabase
      .from('notes')
      .delete()
      .eq('id', id);
  }, []);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    moveNote,
    resizeNote,
    updateText,
    changeColor,
    changeFont,
    toggleSticker,
    bringToFront,
    deleteNote,
  };
}
