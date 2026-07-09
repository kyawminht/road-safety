import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function LikeButton({ liked, count, onToggle, size = 'md' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-xs', gap: 'gap-1', pad: 'px-2 py-1' },
    md: { icon: 20, text: 'text-sm', gap: 'gap-1.5', pad: 'px-3 py-1.5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.85 }}
      className={`flex items-center ${s.gap} ${s.pad} rounded-full transition-colors
        ${liked
          ? 'bg-red-500/15 text-red-400'
          : 'bg-white/5 text-white/40 hover:text-white/60'
        }`}
    >
      <motion.span
        animate={liked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="leading-none"
      >
        {liked ? '❤️' : '🤍'}
      </motion.span>
      {count > 0 && (
        <span className={`${s.text} font-semibold tabular-nums`}>
          {count}
        </span>
      )}
    </motion.button>
  );
}
