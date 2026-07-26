import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, RULES } from '../../data/rulebook.js';

/* ── Design tokens ── */
const COLORS = {
  background: '#F5F8F6',
  cardBackground: '#FFFFFF',
  primaryGreen: '#147A4F',
  primaryText: '#2B2B2B',
  secondaryText: '#7A817D',
  border: '#E6EAE8',
  inactiveNav: '#DDE3E0',
  learnedGreen: '#2E9B68',
};

/* ── Framer Motion variants ── */
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15 },
  },
};

/* ── Sub-components ── */

function StatusBar() {
  return (
    <div
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
        height: 'max(env(safe-area-inset-top, 0px) + 36px, 44px)',
        backgroundColor: COLORS.background,
      }}
    />
  );
}

function PageTitle({ language }) {
  return (
    <div style={{ paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 0 }}>
      <h1
        className="font-bold"
        style={{ fontSize: 15, color: COLORS.primaryText }}
      >
        {language === 'EN' ? 'Rule Cards' : 'စည်းကမ်းများ'}
      </h1>
    </div>
  );
}

function FilterChips({ activeCategory, onSelect, language }) {
  const langKey = language === 'EN' ? 'en' : 'mm';
  const allLabel = language === 'EN' ? 'All' : 'အားလုံး';
  return (
    <div
      className="flex flex-row"
      style={{
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 8,
        gap: 6,
        flexWrap: 'nowrap',
        overflowX: 'auto',
      }}
    >
      <button
        type="button"
        onClick={() => onSelect('All')}
        className="shrink-0 flex items-center justify-center transition-colors duration-200"
        style={{
          height: 32,
          borderRadius: 10,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: activeCategory === 'All' ? COLORS.primaryGreen : COLORS.cardBackground,
          borderWidth: activeCategory === 'All' ? 0 : 1,
          borderStyle: 'solid',
          borderColor: COLORS.border,
          fontSize: 10,
          fontWeight: activeCategory === 'All' ? 600 : 500,
          color: activeCategory === 'All' ? '#FFFFFF' : COLORS.primaryText,
        }}
      >
        {allLabel}
      </button>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className="shrink-0 flex items-center justify-center transition-colors duration-200"
            style={{
              height: 32,
              borderRadius: 10,
              paddingLeft: 12,
              paddingRight: 12,
              backgroundColor: isActive ? COLORS.primaryGreen : COLORS.cardBackground,
              borderWidth: isActive ? 0 : 1,
              borderStyle: 'solid',
              borderColor: COLORS.border,
              fontSize: 10,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#FFFFFF' : COLORS.primaryText,
            }}
          >
            {cat.title[langKey]}
          </button>
        );
      })}
    </div>
  );
}

/* ── Mobile: Horizontal row card ── */
function RuleCardMobile({ rule, categoryColor, onNavigate }) {
  return (
    <motion.button
      variants={cardVariants}
      type="button"
      onClick={() => onNavigate('rules', rule.category)}
      layout
      className="w-full flex items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
      style={{
        height: 80,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: COLORS.border,
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        paddingLeft: 0,
        paddingRight: 14,
        overflow: 'hidden',
      }}
      whileTap={{ scale: 0.985 }}
    >
      <div
        style={{
          width: 72,
          height: '100%',
          backgroundColor: categoryColor,
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <img
          src={rule.image}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
      <span
        className="font-semibold text-left leading-tight"
        style={{
          fontSize: 11,
          color: COLORS.primaryText,
          marginLeft: 12,
          flex: 1,
        }}
      >
        {rule.text}
      </span>
    </motion.button>
  );
}

/* ── Desktop: Shopping card (vertical) ── */
function RuleCardDesktop({ rule, onNavigate }) {
  return (
    <motion.button
      variants={cardVariants}
      type="button"
      onClick={() => onNavigate('rules', rule.category)}
      layout
      className="flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
      style={{
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: COLORS.border,
        overflow: 'hidden',
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <img
          src={rule.image}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Text */}
      <div
        style={{
          padding: '10px 12px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <span
          className="font-semibold leading-tight"
          style={{
            fontSize: 12,
            color: COLORS.primaryText,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {rule.text}
        </span>
      </div>
    </motion.button>
  );
}

/* ── Main Screen ── */

export default function RulesScreen({ onNavigate }) {
  const language = 'EN';
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryColorMap = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((cat) => { map[cat.id] = cat.color; });
    return map;
  }, []);

  const filteredRules = useMemo(() => {
    if (activeCategory === 'All') return RULES;
    return RULES.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  return (
    <div
      className="h-full min-h-0 flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* ── Status bar ── */}
      <StatusBar />

      {/* ── Page title ── */}
      <PageTitle language={language} />

      {/* ── Category filter chips ── */}
      <FilterChips activeCategory={activeCategory} onSelect={setActiveCategory} language={language} />

      {/* ── Scrollable content ── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ paddingTop: 12, paddingLeft: 14, paddingRight: 14 }}>
        {filteredRules.length > 0 ? (
          <motion.div
            className={isDesktop ? 'grid' : 'flex flex-col'}
            style={isDesktop ? { gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 } : { gap: 10 }}
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredRules.map((rule) => (
                isDesktop ? (
                  <RuleCardDesktop
                    key={rule.category + rule.text}
                    rule={rule}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <RuleCardMobile
                    key={rule.category + rule.text}
                    rule={rule}
                    categoryColor={categoryColorMap[rule.category]}
                    onNavigate={onNavigate}
                  />
                )
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: 80 }}>
            <span style={{ fontSize: 10, color: COLORS.secondaryText }}>
              {language === 'EN' ? 'No rules in this category' : 'ဤအမျိုးအစားတွင် စည်းကမ်းများ မရှိသေးပါ'}
            </span>
          </div>
        )}

        {/* ── Flexible empty space ── */}
        <div className="flex-1 min-h-[80px]" />
      </div>
    </div>
  );
}
