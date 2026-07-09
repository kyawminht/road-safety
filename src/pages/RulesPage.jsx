import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import { RULES, CATEGORIES } from '../data/rulebook.js';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { trackEvent } from '../utils/mixpanel.js';

const CATEGORY_ICONS = {
  walking: '🚶',
  bicycle: '🚲',
  motorcycle: '🏍️',
  schoolbus: '🚌',
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

export default function RulesPage() {
  const { user } = useAuth();
  const { viewRule, isRuleViewed, viewedCount, syncToRemote } = useProgress(user?.id);

  // Sync viewed rules to Supabase when logged in
  useEffect(() => {
    if (user?.id && viewedCount > 0) syncToRemote(user.id);
  }, [viewedCount, user?.id, syncToRemote]);
  const [stage, setStage] = useState('categories'); // 'categories' | 'rules'
  const [categoryId, setCategoryId] = useState(null);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const grouped = useMemo(() =>
    CATEGORIES.map((cat) => ({
      ...cat,
      rules: RULES.filter((r) => r.category === cat.id),
    })).filter((g) => g.rules.length > 0),
  []);

  const currentCategory = useMemo(
    () => grouped.find((g) => g.id === categoryId),
    [grouped, categoryId],
  );

  const currentRules = currentCategory?.rules || [];
  const currentRule = currentRules[ruleIndex];
  const currentRuleKey = currentRule ? makeRuleKey(currentRule, ruleIndex) : null;

  const categoryViewedCount = useMemo(() => {
    if (!currentCategory) return 0;
    return currentCategory.rules.filter((r, i) =>
      isRuleViewed(makeRuleKey(r, i)),
    ).length;
  }, [currentCategory, isRuleViewed]);

  const openCategory = useCallback((id) => {
    setCategoryId(id);
    setRuleIndex(0);
    setDirection(1);
    setStage('rules');
    trackEvent('Rules Category Opened', { category: id });
  }, []);

  const goBack = useCallback(() => {
    setStage('categories');
    setCategoryId(null);
  }, []);

  const nextRule = useCallback(() => {
    if (ruleIndex + 1 < currentRules.length) {
      // Mark current as viewed
      if (currentRuleKey) viewRule(currentRuleKey);
      setDirection(1);
      setRuleIndex((i) => i + 1);
    } else {
      // Mark last rule as viewed and go back
      if (currentRuleKey) viewRule(currentRuleKey);
      trackEvent('Rules Category Completed', { category: categoryId });
      goBack();
    }
  }, [ruleIndex, currentRules.length, currentRuleKey, viewRule, categoryId, goBack]);

  const prevRule = useCallback(() => {
    if (ruleIndex > 0) {
      setDirection(-1);
      setRuleIndex((i) => i - 1);
    }
  }, [ruleIndex]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#0F1A2E]">
      <AnimatePresence mode="wait">
        {/* ══════ CATEGORY LIST ══════ */}
        {stage === 'categories' && (
          <motion.div
            key="categories"
            variants={fadeScale}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            {/* Header banner */}
            <div className="relative bg-[#0D9488] overflow-hidden px-6 py-5">
              <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-10 top-4 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />
              <div className="absolute -left-6 -bottom-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10 text-center">
                <h1 className="text-lg font-extrabold text-white leading-snug">
                  လမ်းအန္တရာယ်ကင်းရှင်းရေး
                </h1>
                <p className="text-white/70 text-xs font-medium mt-1">
                  ကလေးများအတွက် လမ်းညွှန်
                </p>
              </div>
            </div>

            {/* Category cards */}
            <div className="px-5 pt-6 pb-10 max-w-lg mx-auto flex flex-col gap-3">
              {grouped.map((cat, idx) => {
                const viewed = cat.rules.filter((r, i) =>
                  isRuleViewed(makeRuleKey(r, i)),
                ).length;
                const allDone = viewed === cat.rules.length;

                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => openCategory(cat.id)}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-colors"
                    style={{
                      background: allDone
                        ? `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${allDone ? cat.color + '44' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${cat.color}20` }}
                    >
                      {CATEGORY_ICONS[cat.id] || '📋'}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm leading-tight truncate">
                          {cat.title}
                        </span>
                        {allDone && (
                          <span className="text-green-400 text-sm">✅</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/40 text-xs">
                          {viewed}/{cat.rules.length} စည်းကမ်း
                        </span>
                        {/* Mini progress bar */}
                        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden max-w-[100px]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(viewed / cat.rules.length) * 100}%`,
                              background: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <HiArrowRight className="text-white/30 shrink-0" size={18} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ══════ RULE VIEWER ══════ */}
        {stage === 'rules' && currentRule && (
          <motion.div
            key={`rules-${categoryId}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Top bar */}
            <div
              className="relative z-30 flex items-center justify-between px-4 py-2"
              style={{ background: 'rgba(15, 26, 46, 0.85)', backdropFilter: 'blur(12px)' }}
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors"
              >
                <HiArrowLeft size={16} />
              </button>

              {/* Category title */}
              <div className="flex items-center gap-2">
                <span className="text-base">{CATEGORY_ICONS[categoryId]}</span>
                <span className="text-white/70 text-xs font-bold truncate max-w-[160px]">
                  {currentCategory?.title}
                </span>
              </div>

              <span className="text-white/40 text-xs tabular-nums">
                {ruleIndex + 1}/{currentRules.length}
              </span>
            </div>

            {/* Progress dots */}
            <div className="relative z-30 flex items-center justify-center gap-1.5 py-2"
              style={{ background: 'rgba(15, 26, 46, 0.6)' }}
            >
              {currentRules.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === ruleIndex ? 20 : 6,
                    height: 6,
                    background: i === ruleIndex
                      ? currentCategory?.color
                      : i < ruleIndex
                        ? `${currentCategory?.color}66`
                        : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>

            {/* Rule content — full screen */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${categoryId}-${ruleIndex}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Illustration */}
                  <div className="flex-1 relative bg-black overflow-hidden">
                    <img
                      src={currentRule.image}
                      alt={currentRule.text}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                  </div>

                  {/* Rule text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-8">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-white text-lg font-bold leading-relaxed text-center drop-shadow-lg"
                    >
                      {currentRule.text}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom action bar */}
            <div
              className="relative z-30 flex items-center justify-between px-5 py-3"
              style={{
                background: 'rgba(15, 26, 46, 0.9)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Prev */}
              <button
                onClick={prevRule}
                disabled={ruleIndex === 0}
                className="flex items-center gap-1 text-white/50 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors"
              >
                <HiArrowLeft size={16} />
                <span>နောက်</span>
              </button>

              {/* Next / Done */}
              <motion.button
                onClick={nextRule}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors"
                style={{
                  background: currentCategory?.color,
                  boxShadow: `0 4px 16px ${currentCategory?.color}44`,
                }}
              >
                <span>
                  {ruleIndex + 1 < currentRules.length ? 'နောက်တစ်ခု' : 'ပြီးပါပြီ ✓'}
                </span>
                <HiArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
