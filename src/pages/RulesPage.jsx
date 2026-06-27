import { motion } from 'framer-motion';
import { TOPICS, FLIP_CARDS } from '../data/flipCards.js';
import { trackEvent } from '../utils/mixpanel.js';
import { useEffect } from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function RulesPage() {
  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  // Group cards by topic
  const cardsByTopic = TOPICS.map((topic) => ({
    ...topic,
    cards: FLIP_CARDS.filter((c) => c.topicId === topic.id),
  })).filter((t) => t.cards.length > 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#0F1A2E] via-[#1E3A5F] to-[#0D9488] px-5 pt-8 pb-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-4xl block mb-3">🚦</span>
          <h1 className="text-2xl font-bold mb-2">လမ်းအန္တရာယ်ကင်းရှင်းရေး</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            ကလေးများအတွက် လမ်းစည်းကမ်းများ
          </p>
        </motion.div>

        <a
          href="/road-safety.pdf"
          download
          onClick={() => trackEvent('PDF Downloaded', { source: 'rules_hero' })}
          className="inline-flex items-center gap-2 mt-4 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-colors text-sm font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          PDF ဒေါင်းလုဒ်
        </a>
      </div>

      {/* ── Topic Sections ── */}
      <div className="px-4 pb-8">
        {cardsByTopic.map((topic) => (
          <section key={topic.id} className="mt-6">
            {/* Topic Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{topic.emoji}</span>
              <h2 className="text-lg font-bold text-[#1E293B]">{topic.title}</h2>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-2 gap-3">
              {topic.cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  variants={cardVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Correct behavior image */}
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={card.rightImage}
                      alt={card.backVisual}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Rule text */}
                  <div className="p-2.5">
                    <div className="flex items-start gap-1.5">
                      <span className="text-green-500 text-sm mt-0.5 shrink-0">✅</span>
                      <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                        {card.shortRule}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* ── Bottom CTA ── */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-3">စည်းကမ်းတွေကို လေ့လာပြီးပြီလား?</p>
          <a
            href="/learn"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full px-6 py-3 font-semibold text-sm transition-colors"
          >
            📚 ကတ်များဖြင့် လေ့လ်ရန်
          </a>
        </div>
      </div>
    </div>
  );
}
