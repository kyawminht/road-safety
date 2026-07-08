import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RULES, CATEGORIES } from '../data/rulebook.js';
import { trackEvent } from '../utils/mixpanel.js';

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function RulesPage({ onScrollChange }) {
  const [showHeader, setShowHeader] = useState(true);
  const headerVisibleRef = useRef(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  // Scroll handler to hide/show header — uses ref to avoid re-registering listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;

      // Hide header when scrolling down past 80px, show when scrolling up
      let shouldShow = true;
      if (currentScrollY > 80) {
        shouldShow = diff < 0;
      }

      // Only update if actually changed — prevents flicker
      if (shouldShow !== headerVisibleRef.current) {
        headerVisibleRef.current = shouldShow;
        setShowHeader(shouldShow);
        onScrollChange?.(shouldShow);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScrollChange]);

  const grouped = useMemo(() => {
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        rules: RULES.filter((r) => r.category === cat.id),
      }))
      .filter((g) => g.rules.length > 0);
  }, []);

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
        <div className="relative bg-[#0D9488] overflow-hidden px-6 py-5">
          {/* Decorative shapes */}
          <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-10 top-4 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />
          <div className="absolute -left-6 -bottom-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute left-12 bottom-2 w-6 h-6 rounded-full bg-white/6 pointer-events-none" />

          <div className="relative z-10 text-center">
            <h1 className="text-lg font-extrabold text-white leading-snug">
              လမ်းအန္တရာယ်ကင်းရှင်းရေး
            </h1>
            <p className="text-white/70 text-xs font-medium mt-1">
              ကလေးများအတွက် လမ်းညွှန်
            </p>
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
