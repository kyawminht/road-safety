import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommentInput({ onSubmit, disabled }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
    inputRef.current?.blur();
  };

  return (
    <div
      className={`flex items-end gap-2 px-5 py-3 transition-colors border-t
        ${focused ? 'border-teal-500/30 bg-white/[0.03]' : 'border-white/5 bg-transparent'}`}
    >
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="အကြံပြုလိုရပါတယ်..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/25
          resize-none outline-none border border-white/10 focus:border-teal-500/40
          disabled:opacity-40 transition-colors"
        style={{ maxHeight: 100, minHeight: 40 }}
      />
      <AnimatePresence>
        {text.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleSubmit}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white
              shadow-lg shadow-teal-500/25 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
