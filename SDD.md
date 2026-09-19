# SDD - מסמך עיצוב תוכנה

## סקירה כללית

מסמך זה מתאר את הארכיטקטורה הטכנית של אפליקציית לוח סיעור מוחות, כולל מבנה קומפוננטות, זרימת נתונים, והחלטות עיצוב.

---

## ארכיטקטורה כללית

```
┌───────────────────────────────────────────────┐
│                    Frontend                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │  Components │  │    Hooks    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└───────────────────────┬───────────────────────┘
                        │
                        │ Supabase Client
                        │
┌───────────────────────┼───────────────────────┐
│                    Backend                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  PostgreSQL │  │   Realtime  │  │     RLS     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└───────────────────────────────────────────────┘
```

---

## מבנה תיקיות

```
src/
├── pages/                    # דפי האפליקציה
│   ├── Board.tsx             # דף הלוח הראשי
│   └── Home.tsx              # דף הבית
│
├── components/
│   └── luach/                # קומפוננטות הלוח
│       ├── Canvas.tsx        # אזור העבודה הראשי
│       ├── NoteCard.tsx      # פתק/כרטיסייה
│       ├── Toolbar.tsx       # סרגל כלים תחתון
│       ├── Header.tsx        # כותרת עליונה
│       ├── Sidebar.tsx       # סרגל צד
│       ├── Toast.tsx         # התראות
│       ├── ColorPicker.tsx   # בורר צבעים
│       ├── FontPicker.tsx    # בורר פונטים
│       └── StickerPicker.tsx # בורר מדבקות
│
├── hooks/                    # React Hooks
│   ├── use-board.ts          # ניהול לוח
│   ├── use-notes.ts          # ניהול פתקים + Realtime
│   ├── use-local-boards.ts   # היסטוריית לוחות
│   └── use-author.ts         # שם משתמש
│
├── lib/                      # פונקציות עזר
│   ├── export-pdf.ts         # ייצוא PDF
│   └── copy-to-clipboard.ts  # העתקה ללוח
│
├── types/
│   └── luach.ts              # טיפוסים וקונפיגורציות
│
└── integrations/
    └── supabase/
        ├── client.ts         # Supabase Client
        ├── types.ts          # טיפוסים אוטומטיים
        └── helpers.ts        # פונקציות עזר
```

---

## קומפוננטות

### 1. Canvas

**תיאור**: אזור העבודה הראשי של הלוח

**קובץ**: `src/components/luach/Canvas.tsx`

**Props**:
```typescript
interface CanvasProps {
  children: ReactNode;
  onSizeChange?: (widthPercent: number, heightPercent: number) => void;
}
```

**Handle (נחשף ל-parent)**:
```typescript
interface CanvasHandle {
  centerView: () => void;   // מירכוז התצוגה
  resetSize: () => void;    // איפוס לגודל המסך
}
```

**State פנימי**:
```typescript
canvasSize: { width: number; height: number }
isResizing: boolean
```

**תכונות**:
- גריד רקע 40x40px
- סימון + אדום במרכז
- ידיות שינוי גודל בקצוות ובפינה
- מסגרת וצל
- מירכוז אוטומטי כשהלוח קטן מהמסך

---

### 2. NoteCard

**תיאור**: פתק או כרטיסייה בודד

**קובץ**: `src/components/luach/NoteCard.tsx`

**Props**:
```typescript
interface NoteCardProps {
  note: Note;
  scale: number;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onTextChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onFontChange: (id: string, font: NoteFont) => void;
  onStickerToggle: (id: string, sticker: Sticker) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**תכונות**:
- גרירה באמצעות react-draggable
- שינוי גודל בגרירת פינה
- סרגל כלים ב-hover
- שורות לכרטיסיות (CSS gradient)
- חתימת מחבר

---

### 3. Toolbar

**תיאור**: סרגל כלים תחתון

**קובץ**: `src/components/luach/Toolbar.tsx`

**Props**:
```typescript
interface ToolbarProps {
  selectedType: NoteType;
  onTypeSelect: (type: NoteType) => void;
  onExportPdf: () => void;
  onCopyLink: () => void;
  onCenterView: () => void;
  onResetSize: () => void;
  boardSizePercent: number;
}
```

**כפתורים**:
| כפתור | איקון | פעולה |
|--------|------|--------|
| פתק | StickyNote | בחירת סוג פתק |
| כרטיסייה | FileText | בחירת סוג כרטיסייה |
| מירכוז | Crosshair | מירכוז התצוגה |
| איפוס | Maximize | איפוס לגודל מסך |
| קישור | Link2 | העתקת קישור |
| PDF | Download | ייצוא PDF |

---

## Hooks

### use-notes

**קובץ**: `src/hooks/use-notes.ts`

**תפקיד**:
```typescript
function useNotes(boardId: string | undefined) {
  return {
    notes: Note[];
    loading: boolean;
    addNote: (type: NoteType, position: {x, y}, author: string) => void;
    moveNote: (id: string, x: number, y: number) => void;
    resizeNote: (id: string, width: number, height: number) => void;
    updateText: (id: string, text: string) => void;
    changeColor: (id: string, color: NoteColor) => void;
    changeFont: (id: string, font: NoteFont) => void;
    toggleSticker: (id: string, sticker: Sticker) => void;
    bringToFront: (id: string) => void;
    deleteNote: (id: string) => void;
  }
}
```

**תכונות**:
- Optimistic updates
- Supabase Realtime subscription
- ניהול z-index
- Debounced text updates

---

### use-board

**קובץ**: `src/hooks/use-board.ts`

**תפקיד**:
```typescript
function useBoard(slug: string) {
  return {
    board: Board | null;
    loading: boolean;
    error: string | null;
    updateTitle: (title: string) => void;
    deleteBoard: () => Promise<boolean>;
  }
}
```

---

### use-local-boards

**קובץ**: `src/hooks/use-local-boards.ts`

**תפקיד**:
```typescript
function useLocalBoards() {
  return {
    boards: LocalBoard[];
    addBoard: (board: Omit<LocalBoard, 'visitedAt'>) => void;
    removeBoard: (slug: string) => void;
  }
}
```

**אחסון**: localStorage

---

## מבנה נתונים

### טבלת boards

```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT DEFAULT '',
  is_protected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### טבלת notes

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'sticky',
  text TEXT DEFAULT '',
  x NUMERIC DEFAULT 100,
  y NUMERIC DEFAULT 100,
  width NUMERIC DEFAULT 120,
  height NUMERIC DEFAULT 120,
  color TEXT DEFAULT 'yellow',
  font TEXT DEFAULT 'base',
  stickers TEXT[] DEFAULT '{}',
  author TEXT DEFAULT '',
  z_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies

```sql
-- גישה פתוחה לכולם
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boards_public" ON boards FOR ALL USING (true);
CREATE POLICY "notes_public" ON notes FOR ALL USING (true);
```

---

## זרימת נתונים

### יצירת פתק

```
User Click → handleCanvasClick(x, y)
    │
    ├─→ חישוב מיקום ממורכז
    │
    ├─→ addNote(type, position, author)
    │       │
    │       ├─→ Optimistic update (tempId)
    │       │
    │       └─→ Supabase INSERT
    │               │
    │               └─→ החלפת tempId ב-realId
    │
    └─→ Realtime broadcast → כל המשתמשים
```

### סנכרון Realtime

```
Supabase Realtime Channel: board_{boardId}
    │
    ├─→ INSERT → הוספת פתק ל-state
    ├─→ UPDATE → עדכון פתק קיים
    └─→ DELETE → הסרת פתק מה-state
```

---

## קונפיגורציות

### צבעים

```typescript
export const NOTE_COLORS: Record<NoteColor, { bg: string; gradient: string }> = {
  yellow: { bg: '#fef3c7', gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)' },
  blue:   { bg: '#dbeafe', gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)' },
  green:  { bg: '#dcfce7', gradient: 'linear-gradient(135deg, #ecfccb 0%, #bbf7d0 100%)' },
  pink:   { bg: '#fce7f3', gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
  white:  { bg: '#ffffff', gradient: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)' },
};
```

### פונטים

```typescript
export const NOTE_FONTS: Record<NoteFont, string> = {
  base: 'system-ui, -apple-system, sans-serif',
  hand: '"Caveat", cursive',
  round: '"Outfit", sans-serif',
};
```

### מדבקות

```typescript
export const STICKER_EMOJI: Record<Sticker, string> = {
  star: '⭐',
  dot: '🔴',
  smiley: '😊',
};
```

### גדלים

```typescript
export const DEFAULT_STICKY_SIZE = { width: 120, height: 120 };
export const DEFAULT_CARD_SIZE = { width: 180, height: 120 };
```

---

## אופטימיזציות

### ביצועים

1. **Optimistic Updates** - עדכון UI מיידי, סנכרון ברקע
2. **Debounced Text** - שמירה אחרי 300ms ללא הקלדה
3. **CSS Transforms** - גרירה חלקה באמצעות translate
4. **React.memo** - מניעת רנדרים מיותרים

### המלצות

1. **Lazy Loading** - טעינת פתקים לפי viewport
2. **Virtualization** - ללוחות עם הרבה פתקים
3. **Web Workers** - לעיבוד כבד ברקע

---

## אבטחה

### גישה פתוחה

- אין אימות משתמשים
- RLS פתוח לכולם
- אין הצפנה צד שרת

### הגנות עתידית

1. **אימות** - Supabase Auth
2. **הרשאות** - בעלים ללוחות
3. **Rate Limiting** - הגבלת פעולות

---

## בדיקות

### ידניות

```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```

### מה לבדוק

- [ ] יצירת פתק במיקום נכון
- [ ] גרירת פתק
- [ ] שינוי גודל פתק
- [ ] שינוי צבע/פונט
- [ ] סנכרון בין משתמשים
- [ ] ייצוא PDF
- [ ] שינוי גודל לוח

---

## Deployment

### דרישות

- Node.js 18+
- npm 9+

### פקודות Build

```bash
npm install           # התקנה
npm run dev           # פיתוח
npm run build         # בנייה
npm run preview       # תצוגה מקדימה
```

### משתני סביבה

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## גרסאות

| גרסה | תאריך | שינויים |
|-------|--------|----------|
| 1.0.0 | 2026 | השקה ראשונית |
