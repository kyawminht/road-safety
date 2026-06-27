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
      {/* ═══════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════ */}
      <div className="relative bg-[#0D9488] overflow-hidden shrink-0">
        {/* Decorative shapes */}
        <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-10 top-4 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute -left-6 -bottom-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-12 bottom-2 w-6 h-6 rounded-full bg-white/6 pointer-events-none" />

        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                လမ်းစည်းကမ်းများ
              </h1>
              <p className="text-white/65 text-base mt-1 font-medium">
                ကလေးများအတွက် လမ်းအန္တရာယ်ကင်းရှင်းရေး လမ်းညွှန်
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FILTER BAR
          ═══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 shrink-0 px-5 pt-4 pb-3.5">
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          {AGE_GROUPS.map((group, idx) => (
            <button
              key={group.id}
              ref={(el) => { chipRefs.current[idx] = el; }}
              onClick={() => setActiveAge(group.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
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

      {/* ═══════════════════════════════════════════
          RULES CONTENT
          ═══════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto">
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
                className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl mb-5 overflow-hidden"
                style={{ backgroundColor: cat.color }}
              >
                <div className="absolute -right-4 -top-5 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -left-2 -bottom-4 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />
                <h2 className="text-base font-extrabold text-white relative z-10 leading-tight">
                  {cat.title}
                </h2>
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
                      {/* Placeholder — subtle crosshatch */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`hatch-${cat.id}`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="16" stroke="#D1D5DB" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#hatch-${cat.id})`} />
                      </svg>
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

        {/* ═══════════════════════════════════════════
            BOTTOM
            ═══════════════════════════════════════════ */}
        <div className="text-center px-5 pb-12 pt-2">
          <p className="text-base text-gray-300 font-medium mb-4">
            စည်းကမ်းတွေ လေ့လာပြီးပြီလား?
          </p>
          <a
            href="/learn"
            className="inline-flex bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-full px-7 py-3.5 font-bold text-base transition-colors"
          >
            ကတ်များဖြင့် လေ့လာရန်
          </a>
        </div>
      </div>
    </div>
  );
}
