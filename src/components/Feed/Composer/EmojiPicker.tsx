import React from 'react';
import { motion } from 'motion/react';

const EMOJIS = ['😊', '😂', '❤️', '👍', '🔥', '🙌', '✨', '🎉', '🤔', '😎', '😢', '😮', '🚀', '💯', '🌈', '🍕'];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-2 p-2 rounded-2xl shadow-2xl border z-50 w-64"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="grid grid-cols-4 gap-1">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="p-2 text-2xl hover:bg-[var(--hover-bg)] rounded-xl transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
