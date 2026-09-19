import { useState, useEffect, useCallback } from 'react';
import type { LocalBoard } from '@/types/luach';

const STORAGE_KEY = 'luach_boards';
const MAX_BOARDS = 20;

export function useLocalBoards() {
  const [boards, setBoards] = useState<LocalBoard[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBoards(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage
  const save = useCallback((newBoards: LocalBoard[]) => {
    setBoards(newBoards);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBoards));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Add or update board
  const addBoard = useCallback(({ slug, title }: { slug: string; title: string }) => {
    setBoards(prev => {
      const filtered = prev.filter(b => b.slug !== slug);
      const updated: LocalBoard[] = [
        { slug, title, visitedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_BOARDS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Remove board
  const removeBoard = useCallback((slug: string) => {
    setBoards(prev => {
      const updated = prev.filter(b => b.slug !== slug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  return { boards, addBoard, removeBoard };
}
