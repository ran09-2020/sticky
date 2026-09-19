import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Board, BoardInsert } from '@/types/luach';
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
        .insert({ slug, title: '' } as BoardInsert)
        .select()
        .single();

      if (createError) {
        setError('שגיאה ביצירת הלוח');
        setLoading(false);
        return;
      }

      setBoard(created);
      addBoard({ slug: created.slug, title: created.title });
      setLoading(false);
    };

    fetchOrCreate();
  }, [slug, addBoard]);

  // Update board title
  const updateTitle = useCallback(async (title: string) => {
    if (!supabase || !board || board.is_protected) return;

    setBoard(prev => prev ? { ...prev, title } : null);

    await supabase
      .from('boards')
      .update({ title })
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

  return { board, loading, error, updateTitle, deleteBoard };
}
