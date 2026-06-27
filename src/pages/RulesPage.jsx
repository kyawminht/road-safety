import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RULEBOOK } from '../data/rulebook.js';
import { trackEvent } from '../utils/mixpanel.js';

// ── Level config ──
const LEVEL = {
  green:  { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200', label: '🟢' },
  yellow: { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700',     border: 'border-amber-200',   label: '🟡' },
  red:    { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700',         border: 'border-red-200',     label: '🔴' },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function RulesPage() {
  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-[#1E293B] mb-1">
          လမ်းစည်းကမ်းများ
        </h1>
        <p className="text-sm text-gray-400">
          ကလေးများအတွက် လမ်းအန္တရာယ်ကင်းရှင်းရေး လမ်းညွှန်
        </p>
      </div>

      <div className="px-4 pb-10 space-y-6 pt-4">
        {RULEBOOK.map((category) => (
          <motion.section
            key={category.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={sectionVariant}
          >
            {/* ── Category Header ── */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: `${category.color}15` }}
              >
                {category.icon}
              </div>
              <h2
                className="text-base font-bold"
                style={{ color: category.color }}
              >
                {category.title}
              </h2>
            </div>

            {/* ── Age Group Cards ── */}
            <div className="space-y-3">
              {category.groups.map((group) => {
                const lv = LEVEL[group.level];
                return (
                  <div
                    key={group.label + group.age}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Card top: illustration placeholder + age header */}
                    <div className="flex">
                      {/* Illustration placeholder */}
                      <div className="w-[100px] shrink-0 flex items-center justify-center p-3 bg-gray-50">
                        <div className="w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-3xl opacity-40">{category.icon}</span>
                        </div>
                      </div>

                      {/* Age group info */}
                      <div className="flex-1 px-3 pt-4 pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{lv.label}</span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${category.color}12`,
                              color: category.color,
                            }}
                          >
                            {group.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{group.age}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 border-t border-gray-100" />

                    {/* Rules list */}
                    <ul className="px-4 py-3 space-y-2.5">
                      {group.rules.map((rule, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-[1px]"
                            style={{ backgroundColor: category.color }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[13px] text-[#334155] leading-relaxed">
                            {rule}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* ── Bottom ── */}
        <div className="text-center pt-4 pb-2">
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
