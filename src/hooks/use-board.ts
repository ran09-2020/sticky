import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Board, BoardInsert, BoardTopic } from '@/types/luach';
import { useLocalBoards } from '@/hooks/use-local-boards';

export function useBoard(slug: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addBoard } = useLocalBoards();

  // Fetch or create board
  useEffect(() => {
    if (!supabase || !slug) return;

    const fetchOrCreate = async () => {
      setLoading(true);
      setError(null);

      // Try to find existing board
      const { data: existing, error: fetchError } = await supabase
        .from('boards')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (fetchError) {
        setError('שגיאה בטעינת הלוח');
        setLoading(false);
        return;
      }

      if (existing) {
        setBoard(existing);
        addBoard({ slug: existing.slug, title: existing.title });
        setLoading(false);
        return;
      }

      // Create new board
      const { data: created, error: createError } = await supabase
        .from('boards')
        .insert({ 
          slug, 
          title: '',
          topics: [{ id: 'default', name: 'ראשי' }] as any
        } as BoardInsert)
        .select()
        .single();

      if (createError) {
        // Handle race condition: if it was created right after our initial fetch
        if (createError.code === '23505' || createError.message.includes('duplicate key')) {
          const { data: retryExisting } = await supabase
            .from('boards')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
            
          if (retryExisting) {
            setBoard(retryExisting);
            addBoard({ slug: retryExisting.slug, title: retryExisting.title });
            setLoading(false);
            return;
          }
        }
        
        console.error('Board creation error:', createError);
        setError(`שגיאה ביצירת הלוח: ${createError.message}`);
        setLoading(false);
        return;
      }

      setBoard(created);
      addBoard({ slug: created.slug, title: created.title });
      setLoading(false);
    };

    fetchOrCreate();
  }, [slug, addBoard]);

  // Realtime subscription for board updates (like size)
  useEffect(() => {
    if (!supabase || !board) return;

    const channel = supabase.channel(`board_${board.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'boards',
          filter: `id=eq.${board.id}`
        },
        (payload) => {
          setBoard(payload.new as Board);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [board?.id]);

  // Update board title
  const updateTitle = useCallback(async (title: string) => {
    if (!supabase || !board || board.is_protected) return;

    setBoard(prev => prev ? { ...prev, title } : null);

    await supabase
      .from('boards')
      .update({ title })
      .eq('id', board.id);
  }, [board]);

  // Update board size
  const updateSize = useCallback(async (width: number, height: number) => {
    if (!supabase || !board || board.is_protected) return;

    setBoard(prev => prev ? { ...prev, width, height } : null);

    await supabase
      .from('boards')
      .update({ width, height })
      .eq('id', board.id);
  }, [board]);

  // Delete board
  const deleteBoard = useCallback(async () => {
    if (!supabase || !board || board.is_protected) return false;

    const { error: deleteError } = await supabase
      .from('boards')
      .delete()
      .eq('id', board.id);

    return !deleteError;
  }, [board]);

  // Topics management
  const updateTopics = useCallback(async (newTopics: BoardTopic[]) => {
    if (!supabase || !board || board.is_protected) return;
    setBoard(prev => prev ? { ...prev, topics: newTopics as any } : null);
    await supabase.from('boards').update({ topics: newTopics as any }).eq('id', board.id);
  }, [board]);

  const addTopic = useCallback(async (name: string) => {
    if (!board) return;
    const currentTopics = (board.topics as unknown as BoardTopic[] | null) || [{ id: 'default', name: 'ראשי' }];
    const newTopic = { id: crypto.randomUUID(), name };
    await updateTopics([...currentTopics, newTopic]);
    return newTopic.id;
  }, [board, updateTopics]);

  const renameTopic = useCallback(async (id: string, name: string) => {
    if (!board) return;
    const currentTopics = (board.topics as unknown as BoardTopic[] | null) || [{ id: 'default', name: 'ראשי' }];
    const newTopics = currentTopics.map(t => t.id === id ? { ...t, name } : t);
    await updateTopics(newTopics);
  }, [board, updateTopics]);

  const removeTopic = useCallback(async (id: string) => {
    if (!board) return;
    const currentTopics = (board.topics as unknown as BoardTopic[] | null) || [{ id: 'default', name: 'ראשי' }];
    if (currentTopics.length <= 1) return; // Don't delete the last topic
    const newTopics = currentTopics.filter(t => t.id !== id);
    await updateTopics(newTopics);
  }, [board, updateTopics]);

  return { 
    board, 
    loading, 
    error, 
    updateTitle, 
    updateSize, 
    deleteBoard,
    addTopic,
    renameTopic,
    removeTopic
  };
}
