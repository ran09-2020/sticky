import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/helpers';

// Database types
export type Board = Tables<'boards'>;
export type Note = Tables<'notes'>;
export type BoardInsert = TablesInsert<'boards'>;
export type NoteInsert = TablesInsert<'notes'>;
export type NoteUpdate = TablesUpdate<'notes'>;

// Note types
export type NoteType = 'sticky' | 'card';
export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'white';
export type NoteFont = 'base' | 'hand' | 'round';
export type Sticker = 'star' | 'dot' | 'smiley';

// Board Topic
export interface BoardTopic {
  id: string;
  name: string;
}

// Local storage board history
export interface LocalBoard {
  slug: string;
  title: string;
  visitedAt: number;
}

// Color configurations
export const NOTE_COLORS: Record<NoteColor, { bg: string; gradient: string }> = {
  yellow: { bg: '#fef3c7', gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)' },
  blue:   { bg: '#dbeafe', gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)' },
  green:  { bg: '#dcfce7', gradient: 'linear-gradient(135deg, #ecfccb 0%, #bbf7d0 100%)' },
  pink:   { bg: '#fce7f3', gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
  white:  { bg: '#ffffff', gradient: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)' },
};

// Font configurations
export const NOTE_FONTS: Record<NoteFont, string> = {
  base: 'system-ui, -apple-system, sans-serif',
  hand: '"Caveat", cursive',
  round: '"Outfit", sans-serif',
};

// Sticker emoji mapping
export const STICKER_EMOJI: Record<Sticker, string> = {
  star: '⭐',
  dot: '🔴',
  smiley: '😊',
};

// Default note dimensions
export const DEFAULT_STICKY_SIZE = { width: 120, height: 120 };
export const DEFAULT_CARD_SIZE = { width: 180, height: 120 };

// Canvas constants
export const CANVAS_SIZE = 2000;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;
export const ZOOM_STEP = 0.05;
