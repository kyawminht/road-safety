import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, FLIP_CARDS } from '../../data/flipCards.js';
import FilterChips from '../../components/mobile/FilterChips.jsx';
import FlipCard from '../../components/mobile/FlipCard.jsx';
import ProgressDots from '../../components/mobile/ProgressDots.jsx';

export default function LearnPage({ filterTopic: initialFilter, onNavigate }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);

  const filteredCards = useMemo(() => {
    if (!activeFilter) return FLIP_CARDS;
    return FLIP_CARDS.filter((c) => c.topicId === activeFilter);
  }, [activeFilter]);

  const currentCard = filteredCards[currentIndex];
  const currentTopic = useMemo(() => {
    if (!currentCard) return null;
    return TOPICS.find((t) => t.id === currentCard.topicId);
  }, [currentCard]);

  const handleFilterChange = useCallback((topicId) => {
    setActiveFilter(topicId);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredCards.length]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') { e.preventDefault(); setIsFlipped((f) => !f); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  if (!currentCard) {
    return (
      <div className="flex-1 flex items-center justify-center bg-road-white">
        <div className="text-center">
          <p className="text-road-gray-400">ကတ်များမရှိပါ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-road-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <h1 className="text-subheading text-road-black">စည်းကမ်းများ</h1>
        <button
          onClick={() => setTeacherMode(!teacherMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            teacherMode
              ? 'bg-road-red text-white'
              : 'bg-road-gray-100 text-road-gray-600'
          }`}
        >
          {teacherMode ? '👨‍🏫 ဆရာ/ဆရာမ' : '🎒 ကျောင်းသား'}
        </button>
      </div>

      {/* Filter chips */}
      <FilterChips
        topics={TOPICS}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2">
        {teacherMode ? (
          /* Teacher mode: full-width, no nav dots */
          <div className="w-full max-w-md">
            <FlipCard
              key={`${currentCard.id}-${isFlipped}`}
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
              className="w-full"
            />
          </div>
        ) : (
          /* Student mode: with progress dots */
          <div className="w-full max-w-sm">
            <ProgressDots total={filteredCards.length} current={currentIndex} />
            <FlipCard
              key={currentCard.id}
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Topic badge */}
      {currentTopic && (
        <div className="text-center text-xs text-road-gray-400 mb-1">
          {currentTopic.emoji} {currentTopic.title}
        </div>
      )}

      {/* Navigation */}
      {!teacherMode && (
        <div className="flex items-center justify-between px-6 pb-4 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              currentIndex === 0
                ? 'bg-road-gray-100 text-road-gray-300'
                : 'bg-road-black text-white active:scale-95'
            }`}
          >
            ◀ ရှေ့တစ်ခု
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredCards.length - 1}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              currentIndex >= filteredCards.length - 1
                ? 'bg-road-gray-100 text-road-gray-300'
                : 'bg-road-yellow text-road-black active:scale-95'
            }`}
          >
            နောက်တစ်ခု ▶
          </button>
        </div>
      )}

      {/* Teacher mode nav */}
      {teacherMode && (
        <div className="flex items-center justify-center gap-8 pb-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-2xl opacity-50 disabled:opacity-20"
          >
            ◀
          </button>
          <span className="text-road-gray-400 text-sm">
            {currentIndex + 1} / {filteredCards.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredCards.length - 1}
            className="text-2xl opacity-50 disabled:opacity-20"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
