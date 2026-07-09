# Teach Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a guided "Teach Mode" that walks parents/teachers through one topic at a time with a clear flow: Topic intro → Cards to flip → Quick quiz → Complete → Next topic

**Architecture:** New TeachMode page that guides through cards sequentially, with a Quiz component at the end of each topic. Progress stored in localStorage so parents can see which topics are completed.

**Tech Stack:** React, Framer Motion, localStorage for progress, Tailwind CSS

---

## File Structure

```
src/
├── pages/
│   └── TeachMode.jsx          # NEW: Main teach mode page
├── components/
│   ├── TeachCard.jsx           # NEW: Card for teach mode (flip animation)
│   ├── TeachQuiz.jsx           # NEW: Quiz component at end of topic
│   ├── TeachProgress.jsx       # NEW: Progress indicator showing completed topics
│   └── TopicSelector.jsx       # NEW: Topic selection screen
├── hooks/
│   └── useProgress.js          # NEW: Hook for localStorage progress
├── data/
│   └── teachTopics.js          # NEW: Organized topic data for teach mode
└── App.jsx                     # MODIFY: Add route for teach mode
```

---

## Data Structure

### teachTopics.js

Organizes FLIP_CARDS into teachable topics with 3-4 cards each:

```javascript
export const TEACH_TOPICS = [
  {
    id: 'walking',
    title: 'လမ်းလျှောက်ခြင်း',
    emoji: '🚶',
    color: '#F97316',
    intro: 'လမ်းလျှောက်ရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['walking-1', 'walking-3', 'walking-4', 'walking-5'],
    quiz: {
      question: 'ဘယ်ဟာက မှန်လဲ?',
      options: [
        { id: 'a', text: 'ကားလမ်းပေါ်မှာ လျှောက်တာ', isCorrect: false },
        { id: 'b', text: 'လူသွားစင်္ကြံပေါ်မှာ လျှောက်တာ', isCorrect: true },
      ]
    }
  },
  // ... more topics
];
```

---

## Task 1: Create Progress Hook

**Files:**
- Create: `src/hooks/useProgress.js`

- [ ] **Step 1: Create useProgress hook**

```javascript
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'road-safety-progress';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { completedTopics: [], currentTopic: null };
    } catch {
      return { completedTopics: [], currentTopic: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeTopic = (topicId) => {
    setProgress(prev => ({
      ...prev,
      completedTopics: [...new Set([...prev.completedTopics, topicId])],
    }));
  };

  const setCurrentTopic = (topicId) => {
    setProgress(prev => ({ ...prev, currentTopic: topicId }));
  };

  const isTopicComplete = (topicId) => {
    return progress.completedTopics.includes(topicId);
  };

  const resetProgress = () => {
    setProgress({ completedTopics: [], currentTopic: null });
  };

  return {
    progress,
    completeTopic,
    setCurrentTopic,
    isTopicComplete,
    resetProgress,
    completedCount: progress.completedTopics.length,
  };
}
```

- [ ] **Step 2: Test the hook manually**

Create a temporary test component or add to App.jsx temporarily to verify:
- Progress saves to localStorage
- `completeTopic()` adds topic to completed list
- `isTopicComplete()` returns correct boolean

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProgress.js
git commit -m "feat: add useProgress hook for teach mode progress tracking"
```

---

## Task 2: Create Topic Data

**Files:**
- Create: `src/data/teachTopics.js`

- [ ] **Step 1: Create teachTopics.js**

```javascript
import { FLIP_CARDS } from './flipCards.js';

export const TEACH_TOPICS = [
  {
    id: 'walking',
    title: 'လမ်းလျှောက်ခြင်း',
    emoji: '🚶',
    color: '#F97316',
    intro: 'လမ်းလျှောက်ရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['walking-1', 'walking-3', 'walking-4', 'walking-5'],
    quiz: {
      question: 'ဘယ်ဟာက လုံခြုံသလဲ?',
      options: [
        { id: 'a', text: 'ကားလမ်းပေါ်မှာ လျှောက်တာ', isCorrect: false },
        { id: 'b', text: 'လူသွားစင်္ကြံပေါ်မှာ လျှောက်တာ', isCorrect: true },
      ]
    }
  },
  {
    id: 'bicycle',
    title: 'စက်ဘီးစီးခြင်း',
    emoji: '🚲',
    color: '#CA8A04',
    intro: 'စက်ဘီးစီးရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['bicycle-1'],
    quiz: {
      question: 'စက်ဘီးစီးရင် ဘာဆောင်းရမလဲ?',
      options: [
        { id: 'a', text: 'ဦးထုပ်', isCorrect: true },
        { id: 'b', text: 'နားကြပ်', isCorrect: false },
      ]
    }
  },
  {
    id: 'tricycle',
    title: 'ဆိုင်ကယ်စီးခြင်း',
    emoji: '🛺',
    color: '#7C3AED',
    intro: 'ဆိုင်ကယ်စီးရင် ဘာတွေ သတိထားရမလဲ',
    cardIds: ['tricycle-2', 'bicycle-2'],
    quiz: {
      question: 'ဆိုင်ကယ်စီးရင် ဘာအရင်လုပ်ရမလဲ?',
      options: [
        { id: 'a', text: 'ဦးထုပ်ဆောင်းတာ', isCorrect: true },
        { id: 'b', text: 'ဖုန်းကြည့်တာ', isCorrect: false },
      ]
    }
  },
];

export function getCardsByTopic(topicId) {
  const topic = TEACH_TOPICS.find(t => t.id === topicId);
  if (!topic) return [];
  return topic.cardIds
    .map(id => FLIP_CARDS.find(card => card.id === id))
    .filter(Boolean);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/teachTopics.js
git commit -m "feat: add teachTopics data for guided teach mode"
```

---

## Task 3: Create TeachCard Component

**Files:**
- Create: `src/components/TeachCard.jsx`

- [ ] **Step 1: Create TeachCard.jsx**

```javascript
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TeachCard({ card, onNext, isLast }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleTap = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card container with perspective */}
      <div
        className="w-full max-w-sm cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleTap}
      >
        <motion.div
          className="relative w-full"
          style={{ aspectRatio: '3/4' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Front side - Wrong */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="h-full flex flex-col">
              {/* Red header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center gap-3">
                <span className="text-3xl">❌</span>
                <span className="text-white font-bold text-xl">မလုပ်ရ</span>
              </div>
              {/* Image */}
              <div className="flex-1 bg-gray-100">
                <img
                  src={card.wrongImage}
                  alt={card.frontVisual}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Description */}
              <div className="bg-white p-4">
                <p className="text-gray-700 text-center">{card.frontVisual}</p>
              </div>
            </div>
          </div>

          {/* Back side - Right */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="h-full flex flex-col">
              {/* Green header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <span className="text-white font-bold text-xl">လုပ်ရမယ်</span>
              </div>
              {/* Image */}
              <div className="flex-1 bg-gray-100">
                <img
                  src={card.rightImage}
                  alt={card.backVisual}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Rule */}
              <div className="bg-white p-4">
                <p className="text-gray-700 text-center font-semibold">{card.shortRule}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tap instruction */}
      <p className="text-gray-500 text-sm mt-4">
        {isFlipped ? 'နှိပ်ပြီး ပြန်ကြည့်ပါ' : 'ကတ်ကိုနှိပ်ပြီး အမှန်ကိုကြည့်ပါ'}
      </p>

      {/* Next button */}
      {isFlipped && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-full font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          {isLast ? 'Quiz ဖြေရန်' : 'နောက်တစ်ခု'}
        </motion.button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TeachCard.jsx
git commit -m "feat: add TeachCard component with flip animation"
```

---

## Task 4: Create TeachQuiz Component

**Files:**
- Create: `src/components/TeachQuiz.jsx`

- [ ] **Step 1: Create TeachQuiz.jsx**

```javascript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeachQuiz({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (option) => {
    if (showResult) return;
    setSelected(option.id);
    setIsCorrect(option.isCorrect);
    setShowResult(true);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Question */}
        <div className="bg-teal-600 text-white rounded-2xl p-6 mb-6 text-center">
          <span className="text-4xl block mb-3">❓</span>
          <h2 className="text-xl font-bold">{quiz.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {quiz.options.map((option) => {
            const isSelected = selected === option.id;
            const showCorrect = showResult && option.isCorrect;
            const showWrong = showResult && isSelected && !option.isCorrect;

            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                  showCorrect
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : showWrong
                    ? 'bg-red-100 border-2 border-red-500 text-red-700'
                    : isSelected
                    ? 'bg-teal-100 border-2 border-teal-500'
                    : 'bg-gray-100 border-2 border-transparent hover:border-gray-300'
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {showCorrect && '✅'}
                    {showWrong && '❌'}
                    {!showResult && option.id === 'a' ? '🇦' : !showResult && option.id === 'b' ? '🇧' : ''}
                  </span>
                  <span>{option.text}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Result message */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 rounded-xl text-center ${
                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <span className="text-3xl block mb-2">{isCorrect ? '🎉' : '💪'}</span>
              <p className="font-bold text-lg">
                {isCorrect ? 'မှန်တယ်!' : 'ထပ်ကြိုးစားပါ'}
              </p>
              {!isCorrect && (
                <button
                  onClick={() => { setSelected(null); setShowResult(false); }}
                  className="mt-2 text-red-600 underline"
                >
                  ထပ်ဖြေကြည့်ပါ
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button after correct answer */}
        {showResult && isCorrect && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full mt-4 bg-teal-600 text-white py-3 rounded-full font-bold"
            onClick={onComplete}
          >
            ပြီးပါပြီ! ✨
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TeachQuiz.jsx
git commit -m "feat: add TeachQuiz component for topic completion"
```

---

## Task 5: Create TeachMode Page

**Files:**
- Create: `src/pages/TeachMode.jsx`

- [ ] **Step 1: Create TeachMode.jsx**

```javascript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEACH_TOPICS, getCardsByTopic } from '../data/teachTopics';
import { useProgress } from '../hooks/useProgress';
import TeachCard from '../components/TeachCard';
import TeachQuiz from '../components/TeachQuiz';

const PHASES = {
  TOPIC_LIST: 'topic_list',
  INTRO: 'intro',
  CARDS: 'cards',
  QUIZ: 'quiz',
  COMPLETE: 'complete',
};

export default function TeachMode() {
  const { completeTopic, isTopicComplete, completedCount } = useProgress();
  const [phase, setPhase] = useState(PHASES.TOPIC_LIST);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const topic = TEACH_TOPICS.find(t => t.id === selectedTopic);
  const cards = topic ? getCardsByTopic(topic.id) : [];

  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
    setCurrentCardIndex(0);
    setPhase(PHASES.INTRO);
  };

  const handleStartCards = () => {
    setPhase(PHASES.CARDS);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setPhase(PHASES.QUIZ);
    }
  };

  const handleQuizComplete = () => {
    completeTopic(selectedTopic);
    setPhase(PHASES.COMPLETE);
  };

  const handleBackToTopics = () => {
    setPhase(PHASES.TOPIC_LIST);
    setSelectedTopic(null);
    setCurrentCardIndex(0);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <AnimatePresence mode="wait">
        {/* Topic List */}
        {phase === PHASES.TOPIC_LIST && (
          <motion.div
            key="topic_list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">သင်ကြားနည်း</h1>
              <p className="text-gray-500 mt-2">ဘယ်ခေါင်းစဉ် သင်ချင်လဲ?</p>
              <p className="text-teal-600 text-sm mt-1">
                {completedCount}/{TEACH_TOPICS.length} ပြီးပြီ
              </p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              {TEACH_TOPICS.map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectTopic(t.id)}
                  className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 text-left"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: t.color + '20' }}
                  >
                    {t.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{t.title}</h3>
                    <p className="text-gray-500 text-sm">{t.cardIds.length} ကတ်</p>
                  </div>
                  {isTopicComplete(t.id) && (
                    <span className="text-2xl">✅</span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Intro */}
        {phase === PHASES.INTRO && topic && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center min-h-[80vh] p-6"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6"
              style={{ backgroundColor: topic.color + '20' }}
            >
              {topic.emoji}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h2>
            <p className="text-gray-500 text-center mb-8">{topic.intro}</p>
            <p className="text-gray-400 text-sm mb-4">{topic.cardIds.length} ကတ် ရှိတယ်</p>

            <button
              onClick={handleStartCards}
              className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold text-lg"
            >
              စတင်ပါ
            </button>

            <button
              onClick={handleBackToTopics}
              className="mt-4 text-gray-500 underline"
            >
              ပြန်သွားရန်
            </button>
          </motion.div>
        )}

        {/* Cards */}
        {phase === PHASES.CARDS && topic && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-6"
          >
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              <button onClick={handleBackToTopics} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 flex gap-1">
                {cards.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= currentCardIndex ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {currentCardIndex + 1}/{cards.length}
              </span>
            </div>

            {/* Current card */}
            <TeachCard
              card={cards[currentCardIndex]}
              onNext={handleNextCard}
              isLast={currentCardIndex === cards.length - 1}
            />
          </motion.div>
        )}

        {/* Quiz */}
        {phase === PHASES.QUIZ && topic && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <TeachQuiz quiz={topic.quiz} onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {/* Complete */}
        {phase === PHASES.COMPLETE && topic && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] p-6"
          >
            <motion.span
              className="text-7xl mb-6"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              🎉
            </motion.span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ပြီးပါပြီ!</h2>
            <p className="text-gray-500 mb-2">{topic.title} သင်ပြီးပြီ</p>
            <p className="text-teal-600 mb-8">
              {completedCount}/{TEACH_TOPICS.length} ခေါင်းစဉ် ပြီးပြီ
            </p>

            <button
              onClick={handleBackToTopics}
              className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold"
            >
              နောက်ခေါင်းစဉ် ရွေးပါ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/TeachMode.jsx
git commit -m "feat: add TeachMode page with guided flow"
```

---

## Task 6: Update App Router

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import and route**

Add import at top:
```javascript
import TeachMode from './pages/TeachMode.jsx';
```

Add route inside `<Routes>`:
```javascript
<Route path="/teach" element={<TeachMode />} />
```

- [ ] **Step 2: Update BottomNav**

Modify: `src/components/BottomNav.jsx`

Add teach mode button (book/teach icon) to the navigation.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/components/BottomNav.jsx
git commit -m "feat: add teach mode route and navigation"
```

---

## Task 7: Test and Verify

- [ ] **Step 1: Run the app**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
npm run dev
```

- [ ] **Step 2: Test the flow**

1. Navigate to teach mode
2. Select a topic
3. Flip through all cards
4. Complete the quiz
5. Verify progress saves (refresh page, check ✅)
6. Verify completed count updates

- [ ] **Step 3: Fix any issues**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete teach mode implementation"
```

---

## Summary

After implementation:
- Parents/teachers see clear topic list with progress
- Each topic has: intro → cards → quiz → complete
- Progress saves to localStorage
- Simple, guided flow instead of overwhelming grid
