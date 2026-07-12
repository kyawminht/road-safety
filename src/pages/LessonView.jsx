import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { getGradeById, LESSONS } from '../data/curriculum.js';
import { FLIP_CARDS } from '../data/flipCards.js';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { hapticSuccess } from '../utils/haptics.js';

const STAGES = { OBJECTIVES: 'objectives', VISUAL: 'visual', QUIZ: 'quiz', COMPLETE: 'complete' };

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function LessonView() {
  const { gradeId, id: lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeLesson } = useProgress(user?.id);

  const grade = useMemo(() => getGradeById(gradeId), [gradeId]);
  const lesson = useMemo(() => LESSONS.find((l) => l.id === lessonId), [lessonId]);

  const [stage, setStage] = useState(STAGES.OBJECTIVES);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(1);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState(null);

  const lessonCards = useMemo(() => {
    if (!lesson?.cards) return [];
    return lesson.cards.map((id) => FLIP_CARDS.find((c) => c.id === id)).filter(Boolean);
  }, [lesson]);

  const quizCard = useMemo(() => {
    if (lessonCards.length === 0) return null;
    return lessonCards[cardIndex % lessonCards.length];
  }, [lessonCards, cardIndex]);

  const handleNextObjectives = useCallback(() => {
    setDirection(1);
    if (lessonCards.length > 0) {
      setStage(STAGES.VISUAL);
      setCardIndex(0);
      setFlipped(false);
    } else {
      setStage(STAGES.QUIZ);
    }
  }, [lessonCards.length]);

  const handleNextCard = useCallback(() => {
    if (cardIndex + 1 < lessonCards.length) {
      setDirection(1);
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setStage(STAGES.QUIZ);
    }
  }, [cardIndex, lessonCards.length]);

  const handlePrevCard = useCallback(() => {
    if (cardIndex > 0) {
      setDirection(-1);
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [cardIndex]);

  const handleQuizAnswer = useCallback((choice) => {
    const isCorrect = choice === quizCard.backVisual;
    setQuizChoice(choice);
    setQuizCorrect(isCorrect);
    if (isCorrect) hapticSuccess();
  }, [quizCard]);

  const handleFinish = useCallback(() => {
    completeLesson(lessonId);
    setStage(STAGES.COMPLETE);
  }, [lessonId, completeLesson]);

  if (!grade || !lesson) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>သင်ခန်းစာကို ရှာမတွေ့ပါ</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <AnimatePresence mode="wait" custom={direction}>

        {/* ═══ OBJECTIVES ═══ */}
        {stage === STAGES.OBJECTIVES && (
          <motion.div key="objectives" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col px-4 sm:px-6 pt-4 sm:pt-6 pb-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full">
              <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors mb-4">
                <HiArrowLeft size={16} /><span>ပြန်</span>
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${grade.color}15` }}>
                  {lesson.icon}
                </div>
                <div>
                  <h1 className="text-heading text-gray-900">{lesson.title}</h1>
                  <p className="text-gray-400 text-xs">{lesson.duration}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm sm:text-base mb-5">{lesson.description}</p>

              <h2 className="text-subheading text-gray-900 mb-3">ရည်ရွယ်ချက်များ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {lesson.objectives.map((obj, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `${grade.color}20`, color: grade.color }}>
                      {i + 1}
                    </div>
                    <span className="text-gray-700 text-sm">{obj}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto">
                <motion.button onClick={handleNextObjectives} whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2"
                  style={{ background: grade.color, boxShadow: `0 8px 24px ${grade.color}44` }}>
                  <span>စတင်ရန်</span><HiArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ VISUAL CARDS ═══ */}
        {stage === STAGES.VISUAL && lessonCards[cardIndex] && (
          <motion.div key={`card-${cardIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Top bar */}
            <div className="relative z-30 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <button onClick={() => setStage(STAGES.OBJECTIVES)} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors"><HiArrowLeft size={16} /></button>
              <div className="flex items-center gap-1.5">
                {lessonCards.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === cardIndex ? 20 : 6, height: 6, background: i <= cardIndex ? grade.color : '#e5e7eb' }} />
                ))}
              </div>
              <span className="text-gray-400 text-xs tabular-nums">{cardIndex + 1}/{lessonCards.length}</span>
            </div>

            {/* Card content */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-white">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={lessonCards[cardIndex].id} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}
                  className="w-full max-w-md mx-4 sm:mx-auto flex flex-col items-center justify-center">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4">
                    <div className="aspect-square bg-gray-100 relative">
                      <img src={flipped ? lessonCards[cardIndex].rightImage : lessonCards[cardIndex].wrongImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-white text-sm font-medium px-4 py-1.5 rounded-full bg-black/40">
                          {flipped ? lessonCards[cardIndex].backVisual : lessonCards[cardIndex].frontVisual}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.button onClick={() => setFlipped(!flipped)} whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ background: flipped ? '#dcfce7' : `${grade.color}15`, color: flipped ? '#16a34a' : grade.color, border: `1px solid ${flipped ? '#bbf7d0' : grade.color + '30'}` }}>
                    {flipped ? '✓ မှန်ကန်' : 'ပုံကို နှိပ်ပြောင်းပါ'}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="relative z-30 flex items-center justify-between px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-200">
              <button onClick={handlePrevCard} disabled={cardIndex === 0} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors">
                <HiArrowLeft size={16} /><span>နောက်</span>
              </button>
              <AnimatePresence>
                {flipped && (
                  <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onClick={handleNextCard} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors" style={{ background: grade.color, boxShadow: `0 4px 16px ${grade.color}44` }}>
                    <span>{cardIndex + 1 < lessonCards.length ? 'နောက်တစ်ခု' : 'Quiz ဖြေရန်'}</span>
                    <HiArrowRight size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ QUIZ ═══ */}
        {stage === STAGES.QUIZ && quizCard && (
          <motion.div key="quiz" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center bg-white">
            <button onClick={() => setStage(STAGES.VISUAL)} className="absolute top-4 left-4 flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors z-10">
              <HiArrowLeft size={16} /><span>ပြန်</span>
            </button>

            <div className="max-w-lg w-full">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 px-4 py-1.5 rounded-full text-sm font-semibold inline-block"
                style={{ background: `${grade.color}15`, color: grade.color, border: `1px solid ${grade.color}30` }}>❓ ဘယ်ဟာက မှန်သလဲ?</motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-500 text-sm mb-6">
                ဘယ်ပုံက လုံခြုံသလဲ? တစ်ပုံကို ရွေးပါ
              </motion.p>

              <div className="flex gap-4 w-full max-w-sm mx-auto">
                <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  onClick={() => !quizChoice && handleQuizAnswer(quizCard.wrongVisual)} disabled={!!quizChoice}
                  className="flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    borderColor: quizChoice === quizCard.wrongVisual ? (quizCorrect ? '#22c55e' : '#ef4444') : '#e5e7eb',
                  }}>
                  <div className="aspect-square bg-gray-100 relative">
                    <img src={quizCard.wrongImage} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <span className="text-white text-2xl font-bold bg-black/40 w-10 h-10 rounded-full flex items-center justify-center">A</span>
                    </div>
                  </div>
                </motion.button>

                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  onClick={() => !quizChoice && handleQuizAnswer(quizCard.backVisual)} disabled={!!quizChoice}
                  className="flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    borderColor: quizChoice === quizCard.backVisual ? (quizCorrect ? '#22c55e' : '#ef4444') : '#e5e7eb',
                  }}>
                  <div className="aspect-square bg-gray-100 relative">
                    <img src={quizCard.rightImage} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <span className="text-white text-2xl font-bold bg-black/40 w-10 h-10 rounded-full flex items-center justify-center">B</span>
                    </div>
                  </div>
                </motion.button>
              </div>

              <AnimatePresence>
                {quizChoice && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-6 flex flex-col items-center gap-3">
                    {quizCorrect ? (
                      <>
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-4xl">🎉</motion.span>
                        <p className="text-green-600 font-bold text-lg">မှန်ပါတယ်!</p>
                        <p className="text-gray-400 text-sm">{quizCard.shortRule}</p>
                      </>
                    ) : (
                      <>
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-4xl">😅</motion.span>
                        <p className="text-red-500 font-bold text-lg">မှားပါတယ်!</p>
                        <p className="text-gray-400 text-sm">{quizCard.shortRule}</p>
                      </>
                    )}
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} onClick={handleFinish} whileTap={{ scale: 0.96 }}
                      className="mt-2 px-8 py-3 rounded-xl text-white font-bold text-base shadow-lg" style={{ background: grade.color, boxShadow: `0 8px 24px ${grade.color}44` }}>
                      ပြီးပါပြီ ✓
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ COMPLETE ═══ */}
        {stage === STAGES.COMPLETE && (
          <motion.div key="complete" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 text-center bg-white">
            <div className="max-w-md w-full">
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-green-50">
                  <span className="text-5xl">✅</span>
                </div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-gray-900 mb-2">ပြီးပါပြီ!</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-500 text-base mb-8">{lesson.icon} {lesson.title}</motion.p>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onClick={() => navigate('/')} whileTap={{ scale: 0.96 }}
                className="px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-lg" style={{ background: grade.color, boxShadow: `0 8px 24px ${grade.color}44` }}>
                Curriculum သို့ ပြန်ရန်
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
