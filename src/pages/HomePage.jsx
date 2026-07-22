import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiDocumentText, HiClipboardDocumentList, HiUserGroup, HiBookOpen } from 'react-icons/hi2';
import { RULES, CATEGORIES, AGE_GROUPS } from '../data/rulebook.js';
import { GRADES, getLessonsForGrade } from '../data/curriculum.js';
import CreatorSection from '../components/CreatorSection.jsx';

const TOPIC_TABS = [
  { id: 'all', label: 'Overview' },
  { id: 'walking', label: 'Walking' },
  { id: 'bicycle', label: 'Bicycle' },
  { id: 'motorcycle', label: 'Motorcycle' },
  { id: 'schoolbus', label: 'School Bus' },
];

const fadeScale = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

/* ── Section content for each category ── */
const SECTIONS = {
  walking: [
    {
      title: 'အခြေခံ လမ်းဘေးကင်းရေး',
      desc: 'ကလေးများ အမြဲသတိထားရမည့် အချက်များ',
      rules: ['လူသွားစင်္ကြံပေါ်မှာပဲ လျှောက်ပါ', 'လူကြီးလက်ကို ကိုင်ထားပါ', 'ကားလမ်းပေါ် မပြေးရ'],
    },
    {
      title: 'လမ်းကူးသည့်အခါ',
      desc: 'ရပ်-ကြည့်-နားထောင်-ကူး နည်းလမ်း',
      rules: ['ရပ်-ကြည့်-နားထောင်-ကူး', 'လူကူးမျဉ်းကျားကနေပဲ ကူးပါ', 'မီးစိမ်းမှသာ ကူးပါ', 'တံတားကနေပဲ ကူးပါ'],
    },
    {
      title: 'သတိပေးချက်များ',
      desc: 'ဘေးအန္တရာယ်ကင်းအောင် ရှောင်ရန်',
      rules: ['လမ်းဘေးကပ် ကားဘက်မျက်နှာမူပြီးလျှောက်ပါ', 'ကားကြားထဲက မထွက်ရ', 'ဖုန်းမကြည့်ရ', 'ညဘက် အရောင်တောက်အင်္ကျီ ဝတ်ပါ', 'ထီးမြှင့်ဆောင်းပါ'],
    },
  ],
  bicycle: [
    {
      title: 'မဖြစ်မနေ ဆောင်ရန်',
      desc: 'စက်ဘီးစီးသူ အမြဲလုပ်ရန်',
      rules: ['ဦးထုပ်ဆောင်းပါ', 'ဘရိတ်စစ်ပါ', 'မေးကြိုးချိတ်ပါ'],
    },
    {
      title: 'လမ်းပေါ်မှာ',
      desc: 'လမ်းအသုံးပြုသည့်အခါ သတိထားရန်',
      rules: ['လူကြီးနဲ့ပဲစီးပါ', 'လမ်းကူးရင် ဆင်းတွန်းပါ', 'လမ်းဘေးကပ်စီးပါ', 'လမ်းဆုံမှာ နှေးပါ'],
    },
    {
      title: 'အချက်ပြနည်း',
      desc: 'အချက်ပြစနစ် သင်ယူပါ',
      rules: ['လက်ပြအချက်သင်ပါ'],
    },
    {
      title: 'ညဘက်နှင့် ရာသီဥတု',
      desc: 'မြင်နိုင်အောင် ပြင်ဆင်ပါ',
      rules: ['ညဘက် မီးတပ်စီးပါ', 'အရောင်ဖျော့အင်္ကျီ ဝတ်ပါ', 'ဖုန်းနားမထောင်ရ'],
    },
  ],
  motorcycle: [
    {
      title: 'မဖြစ်မနေ ဆောင်ရန်',
      desc: 'ဆိုင်ကယ်စီးသူ အမြဲလုပ်ရန်',
      rules: ['ဦးထုပ်မဖြစ်မနေဆောင်းပါ', 'ညဘက် ရှေ့မီးဖွင့်ပါ'],
    },
    {
      title: 'လမ်းပေါ်မှာ',
      desc: 'လမ်းအသုံးပြုသည့်အခါ သတိထားရန်',
      rules: ['လူ ၂ ယောက်ထက် မစီးရ', 'အမြန်နှုန်းကျော်မစီးရ', 'လမ်းဆုံမှာ နှေးပါ'],
    },
    {
      title: 'ဘေးအန္တရာယ်ကင်းအောင်',
      desc: 'ကိုယ့်ကိုကိုယ် ကာကွယ်ရန်',
      rules: ['ဖုန်းမကိုင်ရ', 'အရက်မူးရင် မမောင်းရ', 'ကလေးကိုရှေ့မတင်ရ'],
    },
  ],
  schoolbus: [
    {
      title: 'ဖယ်ရီ/ကျောင်းကား စီးသည့်အခါ',
      desc: 'ယာဉ်ပေါ်တက်ခြင်းနှင့် ဆင်းခြင်း',
      rules: ['ခေါင်းလက် မထုတ်ရ', 'မောင်းသူကို မနှောက်ရ', 'တန်းစီပြီးတက်ပါ'],
    },
    {
      title: 'လမ်းကူးသည့်အခါ',
      desc: 'ကားရပ်မှ ကူးပါ',
      rules: ['ကားသွားမှ ကူးပါ'],
    },
    {
      title: 'ယာဉ်ပေါ်တွင်',
      desc: 'ဘေးကင်းအောင် နေရန်',
      rules: ['တံခါးဝမှာ မရပ်ရ', 'မောင်းသူကို ကြည့်ပါ'],
    },
  ],
};

function StatCard({ number, label, source }) {
  return (
    <div className="text-center p-3 sm:p-4 lg:p-5">
      <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1">{number}</div>
      <div className="text-gray-500 text-[10px] sm:text-xs lg:text-sm leading-tight">{label}</div>
      {source && <div className="text-gray-400 text-[9px] sm:text-[10px] lg:text-xs mt-1">Source</div>}
    </div>
  );
}

function ResourceItem({ icon: Icon, title, description, onClick, color }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl text-left transition-colors bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        <Icon size={20} className="sm:hidden" style={{ color }} />
        <Icon size={22} className="hidden sm:block" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 font-semibold text-sm">{title}</div>
        <div className="text-gray-500 text-xs mt-0.5">{description}</div>
      </div>
      <HiArrowRight className="text-gray-300 shrink-0" size={16} />
    </motion.button>
  );
}

/* ── Rule Row: vertical card like shopping card ── */
function RuleRow({ rule, index, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image on top */}
      <div className="aspect-[4/3] bg-gray-100 relative">
        <img src={rule.image} alt={rule.text} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm" style={{ background: color, color: '#fff' }}>
          {index + 1}
        </div>
      </div>
      {/* Text below */}
      <div className="p-3 sm:p-3.5 lg:p-4">
        <h4 className="text-gray-900 font-bold text-xs sm:text-sm lg:text-[15px] leading-snug">{rule.text}</h4>
        {rule.desc && <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-1 leading-relaxed">{rule.desc}</p>}
      </div>
    </motion.div>
  );
}

/* ── Section block with step number, header + rule rows ── */
function SectionBlock({ section, rules, color, startIdx, stepNumber, totalSteps, isLast }) {
  return (
    <div className="relative">
      {/* Section connector line from previous section */}
      {stepNumber > 1 && (
        <div className="hidden lg:flex flex-col items-center -mt-3 mb-1">
          <div className="w-0.5 h-4 rounded-full" style={{ background: `${color}30` }} />
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="opacity-50 -mt-0.5">
            <path d="M10 0L10 8M10 8L5 3M10 8L15 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      {stepNumber > 1 && (
        <div className="lg:hidden flex flex-col items-center -mt-3 mb-1">
          <div className="w-0.5 h-4 rounded-full" style={{ background: `${color}30` }} />
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="opacity-50 -mt-0.5">
            <path d="M10 0L10 8M10 8L5 3M10 8L15 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
        {/* Section header with step badge */}
        <div className="flex items-start gap-3 lg:gap-4 px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-3 lg:px-6 lg:pt-6 lg:pb-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base font-bold shrink-0 shadow-sm" style={{ background: color, color: '#fff' }}>
            {stepNumber}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg leading-snug">{section.title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base mt-0.5">{section.desc}</p>
          </div>
          {stepNumber < totalSteps && (
            <div className="shrink-0 mt-1">
              <span className="text-[10px] lg:text-xs font-medium px-2 lg:px-3 py-0.5 rounded-full" style={{ background: `${color}12`, color }}>
                ဆက်လက် →
              </span>
            </div>
          )}
          {stepNumber === totalSteps && (
            <div className="shrink-0 mt-1">
              <span className="text-[10px] lg:text-xs font-medium px-2 lg:px-3 py-0.5 rounded-full" style={{ background: '#10B98115', color: '#10B981' }}>
                ✓ ပြီးပါပြီ
              </span>
            </div>
          )}
        </div>

        {/* Rules list — 3-col grid on desktop like shopping cards */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-3 xl:gap-4">
            {section.rules.map((ruleText, i) => {
              const rule = rules.find((r) => r.text === ruleText);
              if (!rule) return null;
              return (
                <RuleRow
                  key={`${rule.category}-${rule.ageGroup}-${rule.text}`}
                  rule={rule}
                  index={startIdx + i}
                  color={color}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <motion.div key="overview" variants={fadeScale} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}
      className="space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Hero stats */}
      <div className="rounded-2xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <StatCard number="1,219" label="ကလေးများ လမ်းဘေးကင်းရေး ကျဆုံးခဲ့ရ" source="NHTSA 2024" />
          <StatCard number="6,228" label="Motorcyclists killed in 2024" source="NHTSA 2024" />
          <StatCard number="7,080" label="Pedestrians killed in 2024" source="NHTSA 2024" />
        </div>
      </div>

      {/* About + Resources side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <div>
          <h2 className="text-gray-900 font-bold text-lg sm:text-xl lg:text-2xl mb-2">Child Road Safety Curriculum</h2>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed">
            မြန်မာနိုင်ငံ ကလေးများအတွက် လမ်းဘေးကင်းရေး ပညာပေးသင်ခန်းစာများ။
            ကလေးငယ်များကို လမ်းဘေးကင်းရေး အသိပညာပေးရန် ဒီဇိုင်းဆွဲထားပါသည်။
          </p>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <ResourceItem icon={HiBookOpen} title="Lesson Plans" description="သင်ခန်းစာများ" color="#0891B2" onClick={() => {}} />
            <ResourceItem icon={HiClipboardDocumentList} title="Assessment Guide" description="စမ်းသပ်မေးခွန်း" color="#0891B2" onClick={() => {}} />
            <ResourceItem icon={HiDocumentText} title="Student Response Form" description="Worksheets" color="#0891B2" onClick={() => {}} />
            <ResourceItem icon={HiUserGroup} title="Parent/Caregiver Tip Sheets" description="မိဘများအတွက်" color="#0891B2" onClick={() => {}} />
          </div>
        </div>
      </div>

      {/* Grade levels */}
      <div>
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Grade Levels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {GRADES.map((grade) => (
            <div key={grade.id} className="flex items-center gap-3 p-3 lg:p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-xl lg:text-2xl shrink-0" style={{ background: `${grade.color}15` }}>
                {grade.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-sm lg:text-base font-medium truncate">{grade.title}</div>
                <div className="text-gray-500 text-xs lg:text-sm">{grade.age} · {getLessonsForGrade(grade.id).length} lessons</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TopicTabContent({ categoryId }) {
  const [ageGroup, setAgeGroup] = useState('all');
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const sections = SECTIONS[categoryId] || [];

  const filteredRules = useMemo(() => {
    let rules = RULES.filter((r) => r.category === categoryId);
    if (ageGroup !== 'all') {
      rules = rules.filter((r) => r.ageGroup === ageGroup);
    }
    return rules;
  }, [categoryId, ageGroup]);

  if (!category) return null;

  return (
    <motion.div key={categoryId} variants={fadeScale} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}
      className="space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Topic header */}
      <div>
        <h2 className="text-gray-900 font-bold text-lg sm:text-xl lg:text-2xl mb-1">{category.title}</h2>
      </div>

      {/* Age group filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {AGE_GROUPS.map((ag) => (
          <button key={ag.id} onClick={() => setAgeGroup(ag.id)}
            className={`shrink-0 px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 border ${
              ageGroup === ag.id
                ? 'text-white border-transparent shadow-sm'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-700'
            }`}
            style={ageGroup === ag.id ? { background: category.color, borderColor: category.color } : {}}>
            {ag.label}
          </button>
        ))}
      </div>

      {/* Sections with rules */}
      {ageGroup === 'all' ? (
        <div className="space-y-4">
          {(() => {
            let idx = 0;
            const matchedTexts = new Set();
            const blocks = sections.map((section) => {
              const sectionRules = section.rules
                .map((text) => filteredRules.find((r) => r.text === text))
                .filter(Boolean);
              sectionRules.forEach((r) => matchedTexts.add(r.text));
              const startIdx = idx;
              idx += sectionRules.length;
              return { section, sectionRules, startIdx };
            }).filter((b) => b.sectionRules.length > 0);

            const unmatched = filteredRules.filter((r) => !matchedTexts.has(r.text));

            return (
              <>
                {blocks.map((b, sIdx) => (
                  <SectionBlock
                    key={sIdx}
                    section={{ title: b.section.title, desc: b.section.desc, rules: b.sectionRules.map((r) => r.text) }}
                    rules={filteredRules}
                    color={category.color}
                    startIdx={b.startIdx}
                    stepNumber={sIdx + 1}
                    totalSteps={blocks.length}
                    isLast={sIdx === blocks.length - 1}
                  />
                ))}
                {unmatched.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-3 xl:gap-4">
                    {unmatched.map((rule, i) => (
                      <RuleRow
                        key={`${rule.category}-${rule.ageGroup}-${idx + i}`}
                        rule={rule}
                        index={idx + i}
                        color={category.color}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-3 xl:gap-4">
          {filteredRules.map((rule, idx) => (
            <RuleRow
              key={`${rule.category}-${rule.ageGroup}-${idx}`}
              rule={rule}
              index={idx}
              color={category.color}
            />
          ))}
        </div>
      )}

      {filteredRules.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-400 text-sm">
          ဒီအုပ်စုအတွက် စည်းကမ်းများ မရှိသေးပါ
        </div>
      )}
    </motion.div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-0 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-teal-100">
              <span className="text-lg sm:text-xl">🛡️</span>
            </div>
            <div>
              <span className="text-gray-900 font-bold text-sm sm:text-base block leading-tight">Road Safety Education</span>
              <span className="text-gray-400 text-[10px] sm:text-xs">Myanmar Child Pedestrian Safety Curriculum</span>
            </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex overflow-x-auto scrollbar-none">
          {TOPIC_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 relative py-3 px-4 sm:px-5 text-center transition-colors"
              >
                <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'all' && <OverviewTab />}
            {activeTab !== 'all' && <TopicTabContent categoryId={activeTab} />}
          </AnimatePresence>

          <CreatorSection />

          {/* Footer */}
          <footer className="mt-4 sm:mt-6 lg:mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-900 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-500 text-[10px] sm:text-xs">Road Safety Education Program · Myanmar</p>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/comments')} className="flex items-center gap-1.5 text-gray-400 hover:text-teal-400 text-[10px] sm:text-xs transition-colors">
                  <HiDocumentText size={12} />
                  <span>Feedback</span>
                </button>
                <button onClick={() => navigate('/simulator')} className="flex items-center gap-1.5 text-gray-400 hover:text-teal-400 text-[10px] sm:text-xs transition-colors">
                  <HiBookOpen size={12} />
                  <span>Games</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
