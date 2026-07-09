import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import RevealCard from '../components/RevealCard.jsx';
import RuleCard from '../components/RuleCard.jsx';
import LikeButton from '../components/LikeButton.jsx';
import { TOPICS, AGE_GROUPS, getCardsForTopic, getRulesForTopic } from '../data/topics.js';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import AuthPrompt from '../components/AuthPrompt.jsx';
import { trackEvent } from '../utils/mixpanel.js';

const STAGES = {
  TOPICS: 'topics',
  INTRO: 'intro',
  RULES: 'rules',
  CARDS: 'cards',
  QUIZ: 'quiz',
  RESULT: 'result',
  COMPLETE: 'complete',
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
  const [ruleIndex, setRuleIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [ageGroup, setAgeGroup] = useState('all');

  // Quiz state
  const [quizChoice, setQuizChoice] = useState(null); // 'wrong' | 'right' | null
  const [quizCorrect, setQuizCorrect] = useState(null); // true | false | null

  // Topic likes
  const [topicLikes, setTopicLikes] = useState({});

  const topic = useMemo(() => TOPICS.find((t) => t.id === topicId), [topicId]);
  const cards = useMemo(() => (topicId ? getCardsForTopic(topicId) : []), [topicId]);
  const rules = useMemo(() => (topicId ? getRulesForTopic(topicId, ageGroup) : []), [topicId, ageGroup]);
  const currentRule = rules[ruleIndex];

  // Pick a random card for the quiz
  const quizCard = useMemo(() => {
    if (cards.length === 0) return null;
    // Use a deterministic pick based on topicId
    const idx = topicId ? topicId.charCodeAt(0) % cards.length : 0;
    return cards[idx];
  }, [cards, topicId]);

  // Journey steps: Rules → Cards → Quiz
  const journeySteps = useMemo(() => {
    const steps = [];
    if (rules.length > 0) steps.push({ label: 'စည်းကမ်း', icon: '📋' });
    if (cards.length > 0) steps.push({ label: 'လေ့လာရန်', icon: '📇' });
    steps.push({ label: 'Quiz', icon: '❓' });
    return steps;
  }, [rules.length, cards.length]);

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
    setRuleIndex(0);
    setQuizChoice(null);
    setQuizCorrect(null);
    setDirection(1);
    setStage(STAGES.INTRO);
    trackEvent('Topic Opened', { topic_id: id });
  }, []);

  const goToList = useCallback(() => {
    setStage(STAGES.TOPICS);
    setTopicId(null);
  }, []);

  const startJourney = useCallback(() => {
    // Start with rules if available, otherwise cards
    if (rules.length > 0) {
      setRuleIndex(0);
      setDirection(1);
      setStage(STAGES.RULES);
    } else if (cards.length > 0) {
      setStage(STAGES.CARDS);
      setFlipped(false);
    } else {
      setStage(STAGES.QUIZ);
    }
  }, [rules.length, cards.length]);

  // Rules navigation
  const nextRule = useCallback(() => {
    if (currentRule) viewRule(makeRuleKey(currentRule, ruleIndex));
    if (ruleIndex + 1 < rules.length) {
      setDirection(1);
      setRuleIndex((i) => i + 1);
    } else {
      // Rules done → go to cards or quiz
      if (cards.length > 0) {
        setStage(STAGES.CARDS);
        setCardIndex(0);
        setFlipped(false);
      } else {
        setStage(STAGES.QUIZ);
      }
    }
  }, [ruleIndex, rules.length, currentRule, viewRule, cards.length]);

  const prevRule = useCallback(() => {
    if (ruleIndex > 0) {
      setDirection(-1);
      setRuleIndex((i) => i - 1);
    }
  }, [ruleIndex]);

  // Cards navigation
  const nextCard = useCallback(() => {
    if (cardIndex + 1 < cards.length) {
      setDirection(1);
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      // Cards done → go to quiz
      setStage(STAGES.QUIZ);
    }
  }, [cardIndex, cards.length]);

  const prevCard = useCallback(() => {
    if (cardIndex > 0) {
      setDirection(-1);
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [cardIndex]);

  // Quiz
  const answerQuiz = useCallback((choice) => {
    const isCorrect = choice === 'right';
    setQuizChoice(choice);
    setQuizCorrect(isCorrect);
    trackEvent('Quiz Answered', { topic_id: topicId, correct: isCorrect });
    setQuizScore(topicId, isCorrect);
  }, [topicId, setQuizScore]);

  const finishQuiz = useCallback(() => {
    completeTopic(topicId);
    setStage(STAGES.COMPLETE);
    if (!user) setShowAuthPrompt(true);
  }, [topicId, completeTopic, user]);

  const goToNextTopic = useCallback(() => {
    const next = TOPICS.find((t) => t.id !== topicId && !isTopicComplete(t.id));
    if (next) goToTopic(next.id);
    else goToList();
  }, [topicId, isTopicComplete, goToTopic, goToList]);

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

              {/* Age group filter */}
              <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
                {AGE_GROUPS.map((ag) => (
                  <button key={ag.id} onClick={() => setAgeGroup(ag.id)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      ageGroup === ag.id
                        ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/20'
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white/70 hover:border-white/20'
                    }`}>
                    {ag.label}
                  </button>
                ))}
              </div>

              {/* Topic cards */}
              <div className="flex flex-col gap-3">
                {TOPICS.map((t, idx) => {
                  const done = isTopicComplete(t.id);
                  return (
                    <motion.button key={t.id} onClick={() => goToTopic(t.id)} whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.3 }}
                      className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-colors"
                      style={{ background: done ? `linear-gradient(135deg, ${t.color}22, ${t.color}11)` : 'rgba(255,255,255,0.05)', border: `1px solid ${done ? t.color + '44' : 'rgba(255,255,255,0.08)'}` }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${t.color}20` }}>{t.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-base truncate">{t.title}</span>
                          {done && <HiCheckCircle className="text-green-400 shrink-0" size={18} />}
                        </div>
                        {/* Journey steps */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {journeySteps.map((step, i) => (
                            <span key={i} className="flex items-center gap-1 text-white/30 text-[10px]">
                              {i > 0 && <span className="text-white/15">→</span>}
                              <span>{step.icon}</span>
                            </span>
                          ))}
                          <span className="text-white/25 text-[10px] ml-1">{journeySteps.length} steps</span>
                        </div>
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

            {/* Journey timeline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-8">
              {journeySteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/20 text-xs">→</span>}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ background: `${topic.color}20`, border: `1px solid ${topic.color}33` }}>
                      {step.icon}
                    </div>
                    <span className="text-white/40 text-[10px] font-medium">{step.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={startJourney} whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-colors" style={{ background: topic.color, boxShadow: `0 8px 24px ${topic.color}44` }}>
              စတင်ရန် →
            </motion.button>
          </motion.div>
        )}

        {/* ══════ RULES ══════ */}
        {stage === STAGES.RULES && topic && currentRule && (
          <motion.div key={`rules-${topicId}-${ruleIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="relative z-30 flex items-center justify-between px-4 py-2" style={{ background: 'rgba(15, 26, 46, 0.85)', backdropFilter: 'blur(12px)' }}>
              <button onClick={goToList} className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors"><HiArrowLeft size={16} /></button>
              <div className="flex items-center gap-2">
                <span className="text-base">{topic.emoji}</span>
                <span className="text-white/70 text-xs font-bold">📋 စည်းကမ်း</span>
              </div>
              <span className="text-white/40 text-xs tabular-nums">{ruleIndex + 1}/{rules.length}</span>
            </div>
            {/* Step dots */}
            <div className="relative z-30 flex items-center justify-center gap-1.5 py-2" style={{ background: 'rgba(15, 26, 46, 0.6)' }}>
              {rules.map((_, i) => (<div key={i} className="rounded-full transition-all duration-300" style={{ width: i === ruleIndex ? 20 : 6, height: 6, background: i === ruleIndex ? topic.color : i < ruleIndex ? `${topic.color}66` : 'rgba(255,255,255,0.15)' }} />))}
            </div>
            {/* Card area */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={`${topicId}-rule-${ruleIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }} className="absolute inset-0">
                  <RuleCard rule={currentRule} index={ruleIndex} total={rules.length} color={topic.color} />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Bottom bar */}
            <div className="relative z-30 flex items-center justify-between px-5 py-3" style={{ background: 'rgba(15, 26, 46, 0.9)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={prevRule} disabled={ruleIndex === 0} className="flex items-center gap-1 text-white/50 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors">
                <HiArrowLeft size={16} /><span>နောက်</span>
              </button>
              <motion.button onClick={nextRule} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors" style={{ background: topic.color, boxShadow: `0 4px 16px ${topic.color}44` }}>
                <span>{ruleIndex + 1 < rules.length ? 'နောက်တစ်ခု' : cards.length > 0 ? 'လေ့လာရန် →' : 'Quiz ဖြေရန်'}</span>
                <HiArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ══════ CARDS ══════ */}
        {stage === STAGES.CARDS && topic && cards[cardIndex] && (
          <motion.div key={`cards-${topicId}-${cardIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
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

        {/* ══════ QUIZ (pick correct image) ══════ */}
        {stage === STAGES.QUIZ && topic && quizCard && (
          <motion.div key={`quiz-${topicId}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            <button onClick={goToList} className="absolute top-4 left-4 flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors z-10">
              <HiArrowLeft size={16} /><span>ပြန်</span>
            </button>

            {/* Quiz badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: `${topic.color}25`, color: topic.color, border: `1px solid ${topic.color}40` }}>❓ ဘယ်ဟာက မှန်သလဲ?</motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/50 text-sm mb-6">
              ပုံနှစ်ပုံထဲမှ မှန်ကန်တဲ့ ပုံကို ရွေးပါ
            </motion.p>

            {/* Two image options */}
            <div className="flex gap-4 w-full max-w-sm">
              {/* Wrong option */}
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                onClick={() => !quizChoice && answerQuiz('wrong')} disabled={!!quizChoice}
                className="flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 disabled:cursor-not-allowed"
                style={{
                  borderColor: quizChoice === 'wrong' ? (quizCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                  boxShadow: quizChoice === 'wrong' ? (quizCorrect ? '0 0 20px rgba(34,197,94,0.3)' : '0 0 20px rgba(239,68,68,0.3)') : 'none',
                }}>
                <div className="aspect-square bg-black/50 relative">
                  <img src={quizCard.wrongImage} alt="Wrong" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white/70 text-xs font-medium bg-black/50 px-2 py-1 rounded">❌ မှားယွင်း</span>
                  </div>
                </div>
              </motion.button>

              {/* Right option */}
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                onClick={() => !quizChoice && answerQuiz('right')} disabled={!!quizChoice}
                className="flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 disabled:cursor-not-allowed"
                style={{
                  borderColor: quizChoice === 'right' ? (quizCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                  boxShadow: quizChoice === 'right' ? (quizCorrect ? '0 0 20px rgba(34,197,94,0.3)' : '0 0 20px rgba(239,68,68,0.3)') : 'none',
                }}>
                <div className="aspect-square bg-black/50 relative">
                  <img src={quizCard.rightImage} alt="Right" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white/70 text-xs font-medium bg-black/50 px-2 py-1 rounded">✅ မှန်ကန်</span>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Result feedback */}
            <AnimatePresence>
              {quizChoice && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-6 flex flex-col items-center gap-3">
                  {quizCorrect ? (
                    <>
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-4xl">🎉</motion.span>
                      <p className="text-green-400 font-bold text-lg">မှန်ပါတယ်!</p>
                      <p className="text-white/40 text-sm">{quizCard.shortRule}</p>
                    </>
                  ) : (
                    <>
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-4xl">😅</motion.span>
                      <p className="text-red-400 font-bold text-lg">မှားပါတယ်!</p>
                      <p className="text-white/40 text-sm">{quizCard.shortRule}</p>
                    </>
                  )}
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} onClick={finishQuiz} whileTap={{ scale: 0.96 }}
                    className="mt-2 px-8 py-3 rounded-xl text-white font-bold text-base shadow-lg" style={{ background: topic.color, boxShadow: `0 8px 24px ${topic.color}44` }}>
                    ပြီးပါပြီ ✓
                  </motion.button>
                </motion.div>
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
      </AnimatePresence>

      <AuthPrompt open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </div>
  );
}
