import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RULES, AGE_GROUPS, CATEGORIES } from '../data/rulebook.js';
import { trackEvent } from '../utils/mixpanel.js';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function RulesPage() {
  const [activeAge, setActiveAge] = useState('all');
  const chipRefs = useRef([]);

  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  // Scroll selected chip into view
  useEffect(() => {
    const idx = AGE_GROUPS.findIndex((g) => g.id === activeAge);
    chipRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [activeAge]);

  // Filter rules by age group
  const filteredRules = useMemo(() => {
    if (activeAge === 'all') return RULES;
    return RULES.filter((r) => r.ageGroup === activeAge);
  }, [activeAge]);

  // Group filtered rules by category
  const grouped = useMemo(() => {
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        rules: filteredRules.filter((r) => r.category === cat.id),
      }))
      .filter((g) => g.rules.length > 0);
  }, [filteredRules]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F8FAFC]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-3">
        <h1 className="text-xl font-bold text-[#1E293B] mb-0.5">
          လမ်းစည်းကမ်းများ
        </h1>
        <p className="text-sm text-gray-400">
          ကလေးများအတွက် လမ်းအန္တရာယ်ကင်းရှင်းရေး လမ်းညွှန်
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {AGE_GROUPS.map((group, idx) => (
            <button
              key={group.id}
              ref={(el) => { chipRefs.current[idx] = el; }}
              onClick={() => setActiveAge(group.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeAge === group.id
                  ? 'bg-[#0D9488] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rules List ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="space-y-5 pt-4">
          {grouped.map((cat) => (
            <motion.section
              key={cat.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              variants={sectionVariant}
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  style={{ backgroundColor: `${cat.color}14` }}
                >
                  {cat.icon}
                </div>
                <h2
                  className="text-sm font-bold"
                  style={{ color: cat.color }}
                >
                  {cat.title}
                </h2>
              </div>

              {/* Rule cards */}
              <div className="space-y-2">
                {cat.rules.map((rule, i) => (
                  <div
                    key={`${cat.id}-${i}`}
                    className="bg-white rounded-xl border border-gray-100 flex items-center gap-3 px-3 py-3 shadow-sm"
                  >
                    {/* Illustration placeholder */}
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-xl opacity-30">{cat.icon}</span>
                    </div>

                    {/* Rule text */}
                    <p className="flex-1 text-[13px] text-[#334155] leading-relaxed">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center pt-6 pb-2">
          <p className="text-sm text-gray-400 mb-3">
            စည်းကမ်းတွေ လေ့လာပြီးပြီလား?
          </p>
          <a
            href="/learn"
            className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-full px-6 py-3 font-semibold text-sm transition-colors shadow-md"
          >
            📚 ကတ်များဖြင့် လေ့လာရန်
          </a>
        </div>
      </div>
    </div>
  );
}
