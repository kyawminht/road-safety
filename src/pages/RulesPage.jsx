import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RULES, AGE_GROUPS, CATEGORIES } from '../data/rulebook.js';
import { trackEvent } from '../utils/mixpanel.js';

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function RulesPage({ onScrollChange }) {
  const [activeAge, setActiveAge] = useState('all');
  const chipRefs = useRef([]);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  useEffect(() => {
    const idx = AGE_GROUPS.findIndex((g) => g.id === activeAge);
    chipRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [activeAge]);

  // Scroll handler to hide/show header
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;

      // Hide header when scrolling down past 50px, show when scrolling up
      let shouldShow = true;
      if (currentScrollY > 50) {
        shouldShow = diff < 0;
      }

      if (shouldShow !== showHeader) {
        setShowHeader(shouldShow);
        onScrollChange?.(shouldShow);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [showHeader, onScrollChange]);

  const filteredRules = useMemo(() => {
    if (activeAge === 'all') return RULES;
    return RULES.filter((r) => r.ageGroup === activeAge);
  }, [activeAge]);

  const grouped = useMemo(() => {
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        rules: filteredRules.filter((r) => r.category === cat.id),
      }))
      .filter((g) => g.rules.length > 0);
  }, [filteredRules]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      {/* ═══════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={false}
        animate={{
          height: showHeader ? 'auto' : 0,
          opacity: showHeader ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden shrink-0"
      >
        <div className="relative bg-[#0D9488] overflow-hidden p-8">
          {/* Decorative shapes */}
          <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-10 top-4 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />
          <div className="absolute -left-6 -bottom-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute left-12 bottom-2 w-6 h-6 rounded-full bg-white/6 pointer-events-none" />

          <div className="relative z-10 !p-4">
            <p className="text-white mt-2 font-bold">
              ကလေးများအတွက် လမ်းအန္တရာယ်ကင်းရှင်းရေး လမ်းညွှန်
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          FILTER BAR
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={false}
        animate={{
          height: showHeader ? 'auto' : 0,
          opacity: showHeader ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden shrink-0"
      >
        <div className="bg-white border-b border-gray-100 px-5 pt-4 pb-3.5 !my-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-none">
            {AGE_GROUPS.map((group, idx) => (
              <button
                key={group.id}
                ref={(el) => { chipRefs.current[idx] = el; }}
                onClick={() => setActiveAge(group.id)}
                className={`shrink-0 px-5 !p-2 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
                  activeAge === group.id
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-500'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          RULES CONTENT
          ═══════════════════════════════════════════ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="px-5 pt-6 pb-10 space-y-10">
          {grouped.map((cat) => (
            <motion.section
              key={cat.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              variants={sectionVariant}
            >
              {/* ── Category header ribbon ── */}
              <div
                className="relative flex items-center gap-3 px-5 py-4 mb-6 overflow-hidden rounded-2xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                }}
              >
                {/* Decorative shapes */}
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute right-8 top-2 w-8 h-8 rounded-full bg-white/8 pointer-events-none" />
                <div className="absolute -left-4 -bottom-6 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute left-16 bottom-1 w-4 h-4 rounded-full bg-white/6 pointer-events-none" />

                {/* Category icon */}
                <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-lg">
                    {cat.id === 'walking' && '🚶'}
                    {cat.id === 'bicycle' && '🚲'}
                    {cat.id === 'motorcycle' && '🏍️'}
                    {cat.id === 'schoolbus' && '🚌'}
                  </span>
                </div>

                {/* Title and count */}
                <div className="relative z-10 flex-1">
                  <h2 className="text-base font-extrabold text-white leading-tight">
                    {cat.title}
                  </h2>
                  <p className="text-white/70 text-xs font-medium mt-0.5">
                    {cat.rules.length} စည်းကမ်း
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="relative z-10 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* ── Rule panels grid ── */}
              <div className="grid grid-cols-2 gap-4">
                {cat.rules.map((rule, i) => (
                  <div key={`${cat.id}-${i}`} className="flex flex-col">
                    {/* Illustration panel */}
                    <div
                      className="relative rounded-2xl border-[2.5px] border-gray-900 bg-gray-50 overflow-hidden"
                      style={{ aspectRatio: '1/1' }}
                    >
                      {/* Number badge */}
                      <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-extrabold z-10">
                        {i + 1}
                      </div>
                      {/* Illustration image */}
                      <img
                        src={rule.image}
                        alt={rule.text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Rule text */}
                    <p className="text-[13px] text-gray-600 mt-3 px-0.5 leading-relaxed font-semibold text-center">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

      </div>
    </div>
  );
}
