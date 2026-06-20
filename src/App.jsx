import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import RevealCard from './components/RevealCard.jsx';
import { TOPICS, FLIP_CARDS } from './data/flipCards.js';

export default function App() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const allCards = FLIP_CARDS;

  const currentTopic = useMemo(() => {
    const card = allCards[activeIndex];
    if (!card) return null;
    return TOPICS.find((t) => t.id === card.topicId);
  }, [activeIndex, allCards]);

  // Track which card is in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the last (furthest down) visible card — works for both
        // mobile snap (one card at a time) and desktop grid (many at once)
        const visible = entries.filter((e) => e.intersectionRatio > 0.3);
        if (visible.length === 0) return;

        let best = visible[0];
        for (const entry of visible) {
          const idx = Number(entry.target.dataset.index);
          const bestIdx = Number(best.target.dataset.index);
          if (!isNaN(idx) && idx > bestIdx) best = entry;
        }

        const idx = Number(best.target.dataset.index);
        if (!isNaN(idx)) setActiveIndex(idx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-dvh bg-black overflow-hidden flex flex-col">
      {/* ── Progress Bar ── */}
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
        {/* Glass strip container */}
        <div
          className="flex items-center px-4"
          style={{
            height: 20,
            paddingTop: 'max(env(safe-area-inset-top), 0px)',
            background: 'rgba(15, 26, 46, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Track */}
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.12)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{
                width: `${((activeIndex + 1) / allCards.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.7))',
                boxShadow: '0 0 10px rgba(255,255,255,0.25), 0 0 2px rgba(255,255,255,0.15)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Floating Topic Bar ── */}
      <div className="absolute top-[28px] inset-x-0 z-20 flex items-center justify-between gap-2 px-5 pt-4 pb-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
          <span className="text-base">
            {currentTopic ? currentTopic.emoji : '🚦'}
          </span>
          <span className="text-white/80 text-xs font-bold truncate max-w-[200px]">
            {currentTopic ? currentTopic.title : 'လမ်းအန္တရာယ်ကင်းရှင်းရေး'}
          </span>
        </div>

        {/* Download Button */}
        <a
          href="/road-safety.pdf"
          download
          className="pointer-events-auto flex items-center gap-1.5 bg-teal-600/90 hover:bg-teal-500 backdrop-blur-md rounded-full px-3 py-1.5 border border-teal-400/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
            <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          <span className="text-white text-xs font-semibold">PDF ဒေါင်းလုဒ်</span>
        </a>
      </div>

      {/* ── Full-screen Snap Feed ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory md:snap-none md:overflow-y-auto md:flex md:flex-col md:items-center"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="md:max-w-6xl md:w-full md:px-8 md:pt-[68px] md:pb-12 md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          {allCards.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              data-index={idx}
              className="snap-start snap-always h-dvh md:h-auto md:aspect-[4/5]"
            >
              <RevealCard
                card={card}
                cardIndex={idx}
                totalCards={allCards.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
