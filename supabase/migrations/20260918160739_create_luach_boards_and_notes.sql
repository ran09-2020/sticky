-- ============================================================
-- Luach (לוח) — collaborative infinite whiteboard
--
-- ACCESS MODEL (per approved product spec):
-- This is an intentionally open, no-login collaborative board.
-- Anyone with a board URL can read and write notes on it —
-- exactly like a physical shared whiteboard. This was the
-- explicit product requirement ("לוח ציבורי הנגיש לכולם").
-- Do NOT store personal or sensitive data on these boards.
-- ============================================================

-- ---------- boards ----------
CREATE TABLE public.boards (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9\-]{1,64}$'),
  title       TEXT NOT NULL DEFAULT '',
  is_protected BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX boards_slug_idx ON public.boards (slug);

-- ---------- notes ----------
CREATE TABLE public.notes (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id   UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  text       TEXT NOT NULL DEFAULT '',
  x          DOUBLE PRECISION NOT NULL DEFAULT 0,
  y          DOUBLE PRECISION NOT NULL DEFAULT 0,
  width      DOUBLE PRECISION NOT NULL DEFAULT 120,
  height     DOUBLE PRECISION NOT NULL DEFAULT 120,
  type       TEXT NOT NULL DEFAULT 'sticky' CHECK (type IN ('sticky','card')),
  color      TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow','blue','green','pink','white')),
  font       TEXT NOT NULL DEFAULT 'base'   CHECK (font IN ('base','hand','round')),
  stickers   TEXT[] NOT NULL DEFAULT '{}',
  author     TEXT NOT NULL DEFAULT '',
  z_index    INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX notes_board_id_idx ON public.notes (board_id);

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER notes_touch_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---------- RLS ----------
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes  ENABLE ROW LEVEL SECURITY;

-- boards: anyone may look up / create a board; only non-protected boards may be edited or removed
CREATE POLICY "boards are readable by everyone"
  ON public.boards FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "anyone can create a board"
  ON public.boards FOR INSERT TO anon, authenticated
  WITH CHECK (is_protected = false);

CREATE POLICY "unprotected boards can be renamed"
  ON public.boards FOR UPDATE TO anon, authenticated
  USING (is_protected = false)
  WITH CHECK (is_protected = false);

CREATE POLICY "unprotected boards can be deleted"
  ON public.boards FOR DELETE TO anon, authenticated
  USING (is_protected = false);

-- notes: fully collaborative within any existing board
CREATE POLICY "notes are readable by everyone"
  ON public.notes FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "anyone can add a note to an existing board"
  ON public.notes FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.boards b WHERE b.id = board_id));

CREATE POLICY "anyone can edit a note"
  ON public.notes FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (EXISTS (SELECT 1 FROM public.boards b WHERE b.id = board_id));

CREATE POLICY "anyone can delete a note"
  ON public.notes FOR DELETE TO anon, authenticated
  USING (true);

-- ---------- Realtime ----------
ALTER TABLE public.notes  REPLICA IDENTITY FULL;
ALTER TABLE public.boards REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;

-- ---------- Seed the always-available public board ----------
INSERT INTO public.boards (slug, title, is_protected)
VALUES ('public', 'הלוח הציבורי', true);
