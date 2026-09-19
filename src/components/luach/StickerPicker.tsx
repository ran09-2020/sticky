import type { Sticker } from '@/types/luach';
import { STICKER_EMOJI } from '@/types/luach';

interface StickerPickerProps {
  current: Sticker[];
  onToggle: (sticker: Sticker) => void;
}

const STICKERS: Sticker[] = ['star', 'dot', 'smiley'];

export function StickerPicker({ current, onToggle }: StickerPickerProps) {
  return (
    <div data-ev-id="ev_b03fc50684" className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl p-2 flex gap-1 z-50">
      {STICKERS.map((sticker) =>
      <button data-ev-id="ev_b444623718"
      key={sticker}
      onClick={() => onToggle(sticker)}
      className={`w-8 h-8 text-lg rounded transition-transform hover:scale-110 flex items-center justify-center ${
      current.includes(sticker) ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'}`
      }
      title={sticker}>

          {STICKER_EMOJI[sticker]}
        </button>
      )}
    </div>);

}