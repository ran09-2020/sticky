import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'luach_author';

export function useAuthor() {
  const [author, setAuthorState] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAuthorState(stored);
      }
    } catch {
      // Ignore
    }
  }, []);

  const setAuthor = useCallback((name: string) => {
    setAuthorState(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // Ignore
    }
  }, []);

  return { author, setAuthor };
}
