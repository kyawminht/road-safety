import { useState, useRef, useEffect, useCallback } from 'react';
import ModuleCard from './ModuleCard.jsx';
import { MODULES, COMPLETION_MESSAGE } from '../data/modules.js';

export default function SimulationFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const feedRef = useRef(null);
  const cardRefs = useRef([]);

  const handleCardComplete = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= MODULES.length) {
        setAllDone(true);
        return prev;
      }
      return next;
    });
  }, []);

  // Auto-scroll to the active card
  useEffect(() => {
    if (activeIndex >= MODULES.length) return;
    const cardEl = cardRefs.current[activeIndex];
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={feedRef}
      className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6"
      style={{
        scrollSnapType: 'y mandatory',
        overflowY: 'auto',
        height: '100dvh',
      }}
    >
      <div className="text-center pt-2 pb-1">
        <h1 className="text-2xl font-bold text-white">
          လမ်းအန္တရာယ်ကင်းရှင်းရေး
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          မှန်ကန်သော လမ်းသွားနည်းလမ်းများ
        </p>
      </div>

      {MODULES.map((mod, idx) => (
        <div
          key={mod.id}
          ref={(el) => (cardRefs.current[idx] = el)}
        >
          <ModuleCard
            module={mod}
            isActive={idx === activeIndex}
            onComplete={handleCardComplete}
          />
        </div>
      ))}

      {allDone && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white">
            {COMPLETION_MESSAGE}
          </h2>
          <p className="text-gray-400 mt-2 text-base">
            အပေါ်သို့ပြန်ဆွဲပြီး ပြန်ကြည့်နိုင်ပါသည်
          </p>
        </div>
      )}

      {/* Bottom spacer for safe area */}
      <div className="h-16" />
    </div>
  );
}
