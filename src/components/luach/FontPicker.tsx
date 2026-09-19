import type { NoteFont } from '@/types/luach';
import { NOTE_FONTS } from '@/types/luach';

interface FontPickerProps {
  current: NoteFont;
  onSelect: (font: NoteFont) => void;
}

const FONTS: {value: NoteFont;label: string;}[] = [
{ value: 'base', label: 'רגיל' },
{ value: 'hand', label: 'כתב יד' },
{ value: 'round', label: 'מסודר' }];


export function FontPicker({ current, onSelect }: FontPickerProps) {
  return (
    <div data-ev-id="ev_cd5513f3a9" className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl p-2 flex flex-col gap-1 z-50 min-w-[100px]">
      {FONTS.map(({ value, label }) =>
      <button data-ev-id="ev_01a1bc0a62"
      key={value}
      onClick={() => onSelect(value)}
      className={`px-3 py-1 text-right rounded transition-colors ${
      current === value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`
      }
      style={{ fontFamily: NOTE_FONTS[value] }}>

          {label}
        </button>
      )}
    </div>);

}