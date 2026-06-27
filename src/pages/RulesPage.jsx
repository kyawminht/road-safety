import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TOPICS, FLIP_CARDS } from '../data/flipCards.js';
import { trackEvent } from '../utils/mixpanel.js';

// ── Per-topic color themes ──
const TOPIC_THEMES = {
  walking:  { bg: '#FFF5F0', accent: '#F97316', soft: '#FFEDD5', text: '#9A3412', name: 'လမ်းလျှောက်ခြင်း' },
  helmet:   { bg: '#F0F4FF', accent: '#4A90D9', soft: '#DBEAFE', text: '#1E40AF', name: 'ဦးထုပ်ဆောင်းခြင်း' },
  sidecar:  { bg: '#F0FFF5', accent: '#2EAD71', soft: '#DCFCE7', text: '#166534', name: 'ဘေးတွဲစီးခြင်း' },
  bicycle:  { bg: '#FFFEF0', accent: '#EAB308', soft: '#FEF9C3', text: '#854D0E', name: 'စက်ဘီးစီးခြင်း' },
  tricycle: { bg: '#F8F0FF', accent: '#8B5CF6', soft: '#EDE9FE', text: '#5B21B6', name: 'ဆိုင်ကယ်စီးခြင်း' },
};

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const imgVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Mascot speech messages for variety ──
const MASCOT_MESSAGES = [
  'သတိထားပါ!',
  'လုံခြုံစွာသွားပါ!',
  'မှတ်ထားနော်!',
  'ဒါလေးလုပ်ပါ!',
  'အမှန်ကိုရွေးပါ!',
  'သေချာကြည့်ပါ!',
  'ဒါကိုမလုပ်ပါနဲ့!',
  'အမြဲသတိရပါ!',
];

export default function RulesPage() {
  useEffect(() => {
    trackEvent('Rules Page Opened');
  }, []);

  const cardsByTopic = TOPICS.map((topic) => ({
    ...topic,
    theme: TOPIC_THEMES[topic.id] || TOPIC_THEMES.walking,
    cards: FLIP_CARDS.filter((c) => c.topicId === topic.id),
  })).filter((t) => t.cards.length > 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFBFA]">
      {/* ═══════════════════════════════════════════
          HERO — Mascot Welcome
          ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F0] via-[#FFF0E8] to-[#FFFBFA] px-5 pt-8 pb-8">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FFEDD5]/60 pointer-events-none" />
        <div className="absolute top-20 -left-8 w-24 h-24 rounded-full bg-[#DBEAFE]/40 pointer-events-none" />
        <div className="absolute bottom-4 right-12 w-16 h-16 rounded-full bg-[#DCFCE7]/50 pointer-events-none" />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mascot avatar placeholder + speech bubble */}
          <div className="flex items-start gap-3 mb-4">
            {/* Mascot circle — replace with <img src={mascotImg}> later */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE0C0] to-[#FFC890] border-2 border-[#F97316]/30 flex items-center justify-center text-3xl shrink-0 shadow-md"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              🧒
            </motion.div>

            {/* Speech bubble */}
            <motion.div
              className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-[#FFEDD5]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <p className="text-[#9A3412] font-bold text-sm mb-0.5">
                မင်္ဂလာပါ! 👋
              </p>
              <p className="text-[#1E293B] text-xs leading-relaxed">
                လမ်းစည်းကမ်းတွေ အတူတူ လေ့လာကြမယ်နော်!
              </p>
            </motion.div>
          </div>

          <h1 className="text-2xl font-bold text-[#1E293B] mb-1">
            လမ်းစည်းကမ်းများ
          </h1>
          <p className="text-[#64748B] text-sm">
            မှန်ကန်စွာသွားလာနည်း — ကလေးများအတွက်
          </p>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          TOPIC CHAPTERS
          ═══════════════════════════════════════════ */}
      <div className="px-4 pb-8 space-y-8">
        {cardsByTopic.map((topic, topicIdx) => (
          <motion.section
            key={topic.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={revealVariants}
          >
            {/* Chapter Header */}
            <div className="flex items-center gap-3 mb-3 mt-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                style={{ background: topic.theme.soft }}
              >
                {topic.emoji}
              </div>
              <div>
                <h2
                  className="text-base font-bold"
                  style={{ color: topic.theme.text }}
                >
                  {topic.title}
                </h2>
                <p className="text-xs text-gray-400">
                  {topic.cards.length} ခု စည်းကမ်း{topic.cards.length > 1 ? 'များ' : ''}
                </p>
              </div>
            </div>

            {/* Rule Cards */}
            <div className="space-y-3">
              {topic.cards.map((card, cardIdx) => {
                const msg = MASCOT_MESSAGES[(topicIdx * 4 + cardIdx) % MASCOT_MESSAGES.length];
                return (
                  <motion.div
                    key={card.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={imgVariants}
                    className="rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                    style={{ background: topic.theme.bg }}
                  >
                    {/* ── Side-by-side comparison ── */}
                    <div className="flex">
                      {/* Wrong side */}
                      <div className="flex-1 relative">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={card.wrongImage}
                            alt={card.frontVisual}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Red overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent pointer-events-none" />
                        </div>
                        {/* Badge */}
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          ❌ အမှား
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-[2px] bg-white shrink-0" />

                      {/* Right side */}
                      <div className="flex-1 relative">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={card.rightImage}
                            alt={card.backVisual}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent pointer-events-none" />
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          ✅ အမှန်
                        </div>
                      </div>
                    </div>

                    {/* ── Bottom: rule text + mascot ── */}
                    <div className="px-3 py-2.5 flex items-center justify-between">
                      <p
                        className="text-sm font-bold"
                        style={{ color: topic.theme.text }}
                      >
                        {card.shortRule}
                      </p>
                      {/* Mini mascot sticker */}
                      <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-2.5 py-1 border border-gray-100">
                        <span className="text-xs">🧒</span>
                        <span className="text-[10px] text-gray-500 font-medium">{msg}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* ═══════════════════════════════════════════
            BOTTOM CTA
            ═══════════════════════════════════════════ */}
        <motion.div
          className="mt-8 text-center pb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Mascot asking a question */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🧒</span>
            <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
              <p className="text-xs text-[#1E293B] font-medium">
                စည်းကမ်းတွေ လေ့လာပြီးပြီလား?
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href="/learn"
              className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-2.5 font-semibold text-sm transition-colors shadow-md shadow-orange-200"
            >
              📚 ကတ်များဖြင့် လေ့လာရန်
            </a>
            <a
              href="/road-safety.pdf"
              download
              onClick={() => trackEvent('PDF Downloaded', { source: 'rules_footer' })}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#64748B] rounded-full px-4 py-2.5 font-semibold text-xs border border-gray-200 transition-colors"
            >
              📥 PDF
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
