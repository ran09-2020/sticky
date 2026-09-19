import type { NoteColor } from '@/types/luach';
import { NOTE_COLORS } from '@/types/luach';

interface ColorPickerProps {
  current: NoteColor;
  onSelect: (color: NoteColor) => void;
}

const COLORS: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'white'];

export function ColorPicker({ current, onSelect }: ColorPickerProps) {
  return (
    <div data-ev-id="ev_970d9ccd10" className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl p-2 flex gap-1 z-50">
      {COLORS.map((color) =>
      <button data-ev-id="ev_56a1877f9e"
      key={color}
      onClick={() => onSelect(color)}
      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
      current === color ? 'border-gray-800 ring-2 ring-gray-400' : 'border-gray-300'}`
      }
      style={{ background: NOTE_COLORS[color].gradient }}
      title={color} />

      )}
    </div>);

}