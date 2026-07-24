import { EMOJI_LIST } from "../../utils/helpers";

const EmojiPicker = ({ onSelect, onClose }) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose} />
    <div className="absolute bottom-16 left-0 z-50 bg-surface-800 backdrop-blur-xl rounded-2xl border border-surface-700/30 shadow-glass p-3 w-72 animate-scale-in">
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((emoji) => (
          <button key={emoji} type="button" onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-surface-700 rounded-lg transition active:scale-90">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  </>
);

export default EmojiPicker;
