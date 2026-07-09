import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import RevealCard from '../components/RevealCard.jsx';
import LikeButton from '../components/LikeButton.jsx';
import { TOPICS, getCardsForTopic, getRulesForTopic } from '../data/topics.js';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import AuthPrompt from '../components/AuthPrompt.jsx';
import { trackEvent } from '../utils/mixpanel.js';

const STAGES = {
  TOPICS: 'topics',
  INTRO: 'intro',
  CARDS: 'cards',
  QUIZ: 'quiz',
  COMPLETE: 'complete',
  RULES: 'rules',
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

function makeRuleKey(rule, idx) {
  return `${rule.category}:${rule.ageGroup}:${idx}`;
}

export default function HomePage() {
  const { user } = useAuth();
  const {
    completeTopic, isTopicComplete, completedCount,
    viewRule, isRuleViewed,
    setQuizScore, syncToRemote,
  } = useProgress(user?.id);

  const [stage, setStage] = useState(STAGES.TOPICS);
  const [topicId, setTopicId] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Topic likes
  const [topicLikes, setTopicLikes] = useState({});

  const topic = useMemo(() => TOPICS.find((t) => t.id === topicId), [topicId]);
  const cards = useMemo(() => (topicId ? getCardsForTopic(topicId) : []), [topicId]);
  const rules = useMemo(() => (topicId ? getRulesForTopic(topicId) : []), [topicId]);
  const currentRule = rules[ruleIndex];

  const nextIncompleteTopic = useMemo(
    () => TOPICS.find((t) => !isTopicComplete(t.id)) || null,
    [isTopicComplete],
  );

  // Fetch topic likes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    (async () => {
      const { data } = await supabase.from('topic_likes').select('topic_id, user_id');
      if (!data) return;
      const counts = {};
      const userLiked = new Set();
      data.forEach((row) => {
        counts[row.topic_id] = (counts[row.topic_id] || 0) + 1;
        if (row.user_id === user?.id) userLiked.add(row.topic_id);
      });
      const likes = {};
      TOPICS.forEach((t) => {
        likes[t.id] = { count: counts[t.id] || 0, liked: userLiked.has(t.id) };
      });
      setTopicLikes(likes);
    })();
  }, [user?.id]);

  // Sync progress
  useEffect(() => {
    if (user?.id) syncToRemote(user.id);
  }, [completedCount, user?.id, syncToRemote]);

  // ── Navigation ──
  const goToTopic = useCallback((id) => {
    setTopicId(id);
    setCardIndex(0);
    setFlipped(false);
    setQuizAnswer(null);
    setRuleIndex(0);
    setDirection(1);
    setStage(STAGES.INTRO);
    trackEvent('Topic Opened', { topic_id: id });
  }, []);

  const goToList = useCallback(() => {
    setStage(STAGES.TOPICS);
    setTopicId(null);
  }, []);

  const startCards = useCallback(() => {
    setStage(STAGES.CARDS);
    setFlipped(false);
  }, []);

  const nextCard = useCallback(() => {
    if (cardIndex + 1 < cards.length) {
      setDirection(1);
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setStage(STAGES.QUIZ);
      setQuizAnswer(null);
    }
  }, [cardIndex, cards.length]);

  const prevCard = useCallback(() => {
    if (cardIndex > 0) {
      setDirection(-1);
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [cardIndex]);

  const answerQuiz = useCallback((optionId, isCorrect) => {
    setQuizAnswer(optionId);
    trackEvent('Quiz Answered', { topic_id: topicId, option_id: optionId, correct: isCorrect });
    setQuizScore(topicId, isCorrect);
    if (isCorrect) {
      setTimeout(() => {
        completeTopic(topicId);
        setStage(STAGES.COMPLETE);
        if (!user) setShowAuthPrompt(true);
      }, 1000);
    }
  }, [topicId, completeTopic, setQuizScore, user]);

  const goToNextTopic = useCallback(() => {
    const next = TOPICS.find((t) => t.id !== topicId && !isTopicComplete(t.id));
    if (next) goToTopic(next.id);
    else goToList();
  }, [topicId, isTopicComplete, goToTopic, goToList]);

  const openRules = useCallback(() => {
    setRuleIndex(0);
    setDirection(1);
    setStage(STAGES.RULES);
  }, []);

  const nextRule = useCallback(() => {
    if (currentRule) viewRule(makeRuleKey(currentRule, ruleIndex));
    if (ruleIndex + 1 < rules.length) {
      setDirection(1);
      setRuleIndex((i) => i + 1);
    } else {
      trackEvent('Rules Completed', { topic_id: topicId });
      goToList();
    }
  }, [ruleIndex, rules.length, currentRule, viewRule, topicId, goToList]);

  const prevRule = useCallback(() => {
    if (ruleIndex > 0) {
      setDirection(-1);
      setRuleIndex((i) => i - 1);
    }
  }, [ruleIndex]);

  const toggleTopicLike = useCallback(async (tid) => {
    if (!user?.id) { setShowAuthPrompt(true); return; }
    if (!isSupabaseConfigured()) return;
    const current = topicLikes[tid];
    if (current?.liked) {
      await supabase.from('topic_likes').delete().eq('user_id', user.id).eq('topic_id', tid);
      setTopicLikes((prev) => ({ ...prev, [tid]: { count: Math.max(0, (prev[tid]?.count || 1) - 1), liked: false } }));
    } else {
      await supabase.from('topic_likes').insert({ user_id: user.id, topic_id: tid });
      setTopicLikes((prev) => ({ ...prev, [tid]: { count: (prev[tid]?.count || 0) + 1, liked: true } }));
    }
  }, [user, topicLikes]);

  // ── Render ──
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#0F1A2E]">
      <AnimatePresence mode="wait" custom={direction}>

        {/* ══════ TOPIC LIST ══════ */}
        {stage === STAGES.TOPICS && (
          <motion.div key="topics" variants={fadeScale} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
            <div className="px-5 pt-6 pb-4 max-w-lg mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">သင်ခန်းစာများ</h1>
                <p className="text-white/50 text-sm">{completedCount}/{TOPICS.length} ပြီးပါပြီ</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-teal-400" initial={false} animate={{ width: `${(completedCount / TOPICS.length) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {TOPICS.map((t, idx) => {
                  const done = isTopicComplete(t.id);
                  const cardCount = getCardsForTopic(t.id).length;
                  const ruleCount = getRulesForTopic(t.id).length;
                  return (
                    <motion.button key={t.id} onClick={() => goToTopic(t.id)} whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.3 }}
                      className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-colors"
                      style={{ background: done ? `linear-gradient(135deg, ${t.color}22, ${t.color}11)` : 'rgba(255,255,255,0.05)', border: `1px solid ${done ? t.color + '44' : 'rgba(255,255,255,0.08)'}` }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${t.color}20` }}>{t.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-base truncate">{t.title}</span>
                          {done && <HiCheckCircle className="text-green-400 shrink-0" size={18} />}
                        </div>
                        <span className="text-white/40 text-xs">{cardCount} ကတ်{ruleCount > 0 ? ` + ${ruleCount} စည်းကမ်း` : ''} + quiz</span>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <LikeButton liked={topicLikes[t.id]?.liked || false} count={topicLikes[t.id]?.count || 0} onToggle={() => toggleTopicLike(t.id)} size="sm" />
                      </div>
                      <HiArrowRight className="text-white/30 shrink-0" size={18} />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════ INTRO ══════ */}
        {stage === STAGES.INTRO && topic && (
          <motion.div key={`intro-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <button onClick={goToList} className="absolute top-4 left-4 flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors z-10">
              <HiArrowLeft size={16} /><span>ပြန်</span>
            </button>
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }} className="text-7xl mb-6">{topic.emoji}</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-white mb-3">{topic.title}</motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/60 text-base mb-8 max-w-xs">{topic.intro}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: `${topic.color}20`, border: `1px solid ${topic.color}33` }}>
              <span className="text-white/70 text-sm">📇 {cards.length} ကတ်</span>
              {rules.length > 0 && (<><span className="text-white/30">•</span><span className="text-white/70 text-sm">📋 {rules.length} စည်းကမ်း</span></>)}
              <span className="text-white/30">•</span>
              <span className="text-white/70 text-sm">❓ quiz ၁ ခု</span>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={startCards} whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-colors" style={{ background: topic.color, boxShadow: `0 8px 24px ${topic.color}44` }}>
              စတင်ရန် →
            </motion.button>
          </motion.div>
        )}

        {/* ══════ CARDS ══════ */}
        {stage === STAGES.CARDS && topic && cards[cardIndex] && (
          <motion.div key={`cards-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col overflow-hidden">
            <div className="relative z-30 flex items-center justify-between px-4 py-2" style={{ background: 'rgba(15, 26, 46, 0.85)', backdropFilter: 'blur(12px)' }}>
              <button onClick={goToList} className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors"><HiArrowLeft size={16} /></button>
              <div className="flex items-center gap-1.5">
                {cards.map((_, i) => (<div key={i} className="rounded-full transition-all duration-300" style={{ width: i === cardIndex ? 20 : 6, height: 6, background: i <= cardIndex ? topic.color : 'rgba(255,255,255,0.15)' }} />))}
              </div>
              <span className="text-white/40 text-xs tabular-nums">{cardIndex + 1}/{cards.length}</span>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={cards[cardIndex].id} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }} className="absolute inset-0">
                  <RevealCard card={cards[cardIndex]} cardIndex={cardIndex} totalCards={cards.length} isFlipped={flipped} onFlip={(val) => setFlipped(val)} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative z-30 flex items-center justify-between px-5 py-3" style={{ background: 'rgba(15, 26, 46, 0.9)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={prevCard} disabled={cardIndex === 0} className="flex items-center gap-1 text-white/50 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors">
                <HiArrowLeft size={16} /><span>နောက်</span>
              </button>
              <AnimatePresence>
                {flipped && (
                  <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onClick={nextCard} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors" style={{ background: topic.color, boxShadow: `0 4px 16px ${topic.color}44` }}>
                    <span>{cardIndex + 1 < cards.length ? 'နောက်တစ်ခု' : 'Quiz ဖြေရန်'}</span>
                    <HiArrowRight size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ══════ QUIZ ══════ */}
        {stage === STAGES.QUIZ && topic && (
          <motion.div key={`quiz-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <button onClick={() => { setStage(STAGES.CARDS); setCardIndex(cards.length - 1); }} className="absolute top-4 left-4 flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors z-10">
              <HiArrowLeft size={16} /><span>ပြန်</span>
            </button>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${topic.color}25`, color: topic.color, border: `1px solid ${topic.color}40` }}>❓ Quiz</motion.div>
            <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl font-bold text-white mb-8 max-w-sm leading-relaxed">{topic.quiz.question}</motion.h3>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {topic.quiz.options.map((opt, idx) => {
                const answered = quizAnswer !== null;
                const isCorrectAnswer = opt.isCorrect;
                const isChosen = quizAnswer === opt.id;
                const showResult = answered && isChosen;
                let btnBg = 'rgba(255,255,255,0.08)';
                let btnBorder = 'rgba(255,255,255,0.12)';
                if (showResult && isCorrectAnswer) { btnBg = 'rgba(34, 197, 94, 0.2)'; btnBorder = 'rgba(34, 197, 94, 0.5)'; }
                else if (showResult && !isCorrectAnswer) { btnBg = 'rgba(239, 68, 68, 0.2)'; btnBorder = 'rgba(239, 68, 68, 0.5)'; }
                return (
                  <motion.button key={opt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: showResult && !isCorrectAnswer ? [0, -6, 6, -4, 4, 0] : 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, x: { duration: 0.4 } }} onClick={() => !answered && answerQuiz(opt.id, opt.isCorrect)} disabled={answered}
                    className="w-full rounded-2xl px-5 py-4 text-left text-white font-semibold text-base disabled:cursor-not-allowed transition-colors" style={{ background: btnBg, border: `2px solid ${btnBorder}` }}>
                    <span className="mr-3 text-white/40 font-bold">{opt.id.toUpperCase()}.</span>{opt.text}
                    {showResult && isCorrectAnswer && <span className="ml-2">✅</span>}
                    {showResult && !isCorrectAnswer && <span className="ml-2">❌</span>}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {quizAnswer !== null && !topic.quiz.options.find((o) => o.id === quizAnswer)?.isCorrect && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-red-400 text-sm">ထပ်ကြိုးစားပါ!</motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══════ COMPLETE ══════ */}
        {stage === STAGES.COMPLETE && topic && (
          <motion.div key={`complete-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: `${topic.color}25`, boxShadow: `0 0 40px ${topic.color}33` }}><span className="text-5xl">✅</span></div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-white mb-2">ပြီးပါပြီ!</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/50 text-base mb-2">{topic.emoji} {topic.title}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-white/30 text-sm mb-8">{completedCount + 1}/{TOPICS.length} သင်ခန်းစာ ပြီးပါပြီ</motion.p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {rules.length > 0 && (
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} onClick={openRules} whileTap={{ scale: 0.96 }}
                  className="w-full py-3 rounded-xl text-white/80 font-semibold text-sm border border-white/15 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  📋 စည်းကမ်းများကြည့်ရန်
                </motion.button>
              )}
              {nextIncompleteTopic && (
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onClick={goToNextTopic} whileTap={{ scale: 0.96 }}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2" style={{ background: nextIncompleteTopic.color, boxShadow: `0 8px 24px ${nextIncompleteTopic.color}44` }}>
                  <span>{nextIncompleteTopic.emoji} နောက်တစ်ခု</span><HiArrowRight size={18} />
                </motion.button>
              )}
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={goToList} whileTap={{ scale: 0.96 }}
                className="w-full py-3 rounded-xl text-white/40 font-semibold text-sm hover:text-white/60 transition-colors">
                သင်ခန်းစာ အားလုံး
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ══════ RULES VIEWER ══════ */}
        {stage === STAGES.RULES && topic && currentRule && (
          <motion.div key={`rules-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col overflow-hidden">
            <div className="relative z-30 flex items-center justify-between px-4 py-2" style={{ background: 'rgba(15, 26, 46, 0.85)', backdropFilter: 'blur(12px)' }}>
              <button onClick={goToList} className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors"><HiArrowLeft size={16} /></button>
              <div className="flex items-center gap-2">
                <span className="text-base">{topic.emoji}</span>
                <span className="text-white/70 text-xs font-bold truncate max-w-[160px]">စည်းကမ်းများ</span>
              </div>
              <span className="text-white/40 text-xs tabular-nums">{ruleIndex + 1}/{rules.length}</span>
            </div>
            <div className="relative z-30 flex items-center justify-center gap-1.5 py-2" style={{ background: 'rgba(15, 26, 46, 0.6)' }}>
              {rules.map((_, i) => (<div key={i} className="rounded-full transition-all duration-300" style={{ width: i === ruleIndex ? 20 : 6, height: 6, background: i === ruleIndex ? topic.color : i < ruleIndex ? `${topic.color}66` : 'rgba(255,255,255,0.15)' }} />))}
            </div>
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={`${topicId}-rule-${ruleIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }} className="absolute inset-0 flex flex-col">
                  <div className="flex-1 relative bg-black overflow-hidden">
                    <img src={currentRule.image} alt={currentRule.text} className="absolute inset-0 w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-8">
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-white text-lg font-bold leading-relaxed text-center drop-shadow-lg">{currentRule.text}</motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative z-30 flex items-center justify-between px-5 py-3" style={{ background: 'rgba(15, 26, 46, 0.9)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={prevRule} disabled={ruleIndex === 0} className="flex items-center gap-1 text-white/50 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors">
                <HiArrowLeft size={16} /><span>နောက်</span>
              </button>
              <motion.button onClick={nextRule} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors" style={{ background: topic.color, boxShadow: `0 4px 16px ${topic.color}44` }}>
                <span>{ruleIndex + 1 < rules.length ? 'နောက်တစ်ခု' : 'ပြီးပါပြီ ✓'}</span><HiArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthPrompt open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </div>
  );
}
