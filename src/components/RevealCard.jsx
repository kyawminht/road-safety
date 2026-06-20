import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RevealCard({ card, cardIndex, totalCards }) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleToggle = useCallback(() => {
    setIsRevealed((prev) => !prev);
  }, []);

  return (
    <motion.div
      onClick={handleToggle}
      whileTap={{ scale: 0.98 }}
      className="h-dvh md:h-full w-full bg-black flex flex-col relative overflow-hidden cursor-pointer select-none"
      style={{
        borderLeft: isRevealed
          ? '5px solid rgba(22, 163, 74, 0.85)'
          : '5px solid rgba(220, 38, 38, 0.85)',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-label={isRevealed ? 'အမှားကိုပြန်ကြည့်ရန်' : 'အမှန်ကိုကြည့်ရန်'}
    >
      {/* ── Full-screen Image ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={isRevealed ? 'right' : 'wrong'}
            src={isRevealed ? card.rightImage : card.wrongImage}
            alt={isRevealed ? card.backVisual : card.frontVisual}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
      </div>

      {/* ── Bottom Content ── */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-8 px-6">
        {/* Status strip — full-width colored band with icon + label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isRevealed ? 'correct-strip' : 'wrong-strip'}
            className="w-full rounded-none flex items-center justify-center gap-2.5 py-2.5 mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
           
          >
            <span
              className="text-xl leading-none select-none"
              role="img"
              aria-label={isRevealed ? 'Correct' : 'Wrong'}
            >
              {isRevealed ? '✅' : '❌'}
            </span>
            <span
              className="text-sm font-bold tracking-wider"
              style={{
                color: isRevealed ? '#86EFAC' : '#FCA5A5',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}
            >
              {isRevealed ? 'အမှန်' : 'အမှား'}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Main rule text */}
        <p className="text-lg font-bold leading-relaxed text-white mb-6 drop-shadow-lg text-center">
          {isRevealed ? card.shortRule : card.frontVisual}
        </p>

        {/* ── Primary flip button ── */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
          whileTap={{ scale: 0.96 }}
          className="w-full h-[56px] rounded-xl text-base font-bold tracking-wide
            flex items-center justify-center gap-2.5
            bg-[#0D9488] text-white
            shadow-lg shadow-teal-500/25
            active:shadow-md active:shadow-teal-500/15
            transition-colors duration-300"
        >
          <motion.span
            className="text-lg leading-none"
            animate={{ rotate: isRevealed ? 180 : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            ↻
          </motion.span>
          <span>
            {isRevealed ? 'အမှားကိုပြန်ကြည့်ရန်' : 'အမှန်ကိုကြည့်ရန်'}
          </span>
        </motion.button>

        {/* ── Counter ── */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-white/50 tabular-nums font-medium">
            {cardIndex + 1} / {totalCards}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
