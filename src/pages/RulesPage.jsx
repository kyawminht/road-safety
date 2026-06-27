import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RULES, AGE_GROUPS, CATEGORIES } from '../data/rulebook.js';
import { trackEvent } from '../utils/mixpanel.js';

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function RulesPage() {
  const [activeAge, setActiveAge] = useState('all');
  const chipRefs = useRef([]);

  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  useEffect(() => {
    const idx = AGE_GROUPS.findIndex((g) => g.id === activeAge);
    chipRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [activeAge]);

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
      {/* ── Header Banner ── */}
      <div className="relative bg-[#0D9488] overflow-hidden px-5 pt-6 pb-5">
        {/* Decorative elements */}
        <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-8 top-2 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute -left-4 -bottom-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <span className="text-2xl">🚦</span>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              လမ်းစည်းကမ်းများ
            </h1>
            <p className="text-white/70 text-xs font-medium">
              ကလေးများအတွက် လမ်းအန္တရာယ်ကင်းရှင်းရေး လမ်းညွှန်
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border-b-2 border-teal-600 px-5 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {AGE_GROUPS.map((group, idx) => (
            <button
              key={group.id}
              ref={(el) => { chipRefs.current[idx] = el; }}
              onClick={() => setActiveAge(group.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-colors border-2 ${
                activeAge === group.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rules Content ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="space-y-8 pt-5">
          {grouped.map((cat) => (
            <motion.section
              key={cat.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              variants={sectionVariant}
            >
              {/* Category header — colored banner */}
              <div
                className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-4 overflow-hidden"
                style={{ backgroundColor: cat.color }}
              >
                {/* Decorative background circles */}
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -left-2 -bottom-4 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />

                <span className="text-xl relative z-10">{cat.icon}</span>
                <h2 className="text-sm font-extrabold text-white relative z-10 leading-tight">
                  {cat.title}
                </h2>
              </div>

              {/* Rule panels — 2 col grid */}
              <div className="grid grid-cols-2 gap-3">
                {cat.rules.map((rule, i) => (
                  <div key={`${cat.id}-${i}`} className="flex flex-col">
                    {/* Panel: rounded rectangle with numbered badge + illustration */}
                    <div
                      className="relative rounded-2xl border-[2.5px] border-gray-900 bg-gray-50 overflow-hidden"
                      style={{ aspectRatio: '1/1' }}
                    >
                      {/* Numbered badge */}
                      <div
                        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-extrabold z-10"
                      >
                        {i + 1}
                      </div>

                      {/* Illustration placeholder */}
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-15">{cat.icon}</span>
                      </div>
                    </div>

                    {/* Text below panel */}
                    <p className="text-[11px] text-gray-700 mt-2 px-0.5 leading-relaxed font-medium text-center">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center pt-8 pb-2">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm mb-3">
            <span className="text-base">↓</span>
            <span>စည်းကမ်းတွေ လေ့လာပြီးပြီလား?</span>
          </div>
          <br />
          <a
            href="/learn"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3 font-bold text-sm transition-colors border-2 border-gray-900"
          >
            📚 ကတ်များဖြင့် လေ့လာရန်
          </a>
        </div>
      </div>
    </div>
  );
}
