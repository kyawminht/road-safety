import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiDocumentText, HiClipboardDocumentList, HiUserGroup, HiAcademicCap, HiBookOpen } from 'react-icons/hi2';
import { GRADES, getLessonsForGrade, getAssessmentsForGrade, getParentTipsForGrade } from '../data/curriculum.js';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'k1', label: 'K-1' },
  { id: 'g2-3', label: '2-3' },
  { id: 'g4-5', label: '4-5' },
];

const fadeScale = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function ResourceItem({ icon: Icon, title, description, onClick, color }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-colors bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
    >
      <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm">{title}</div>
        <div className="text-white/40 text-xs mt-0.5">{description}</div>
      </div>
      <HiArrowRight className="text-white/20 shrink-0" size={16} />
    </motion.button>
  );
}

function GradeTabContent({ grade }) {
  const navigate = useNavigate();
  const lessons = useMemo(() => getLessonsForGrade(grade.id), [grade.id]);
  const assessments = useMemo(() => getAssessmentsForGrade(grade.id), [grade.id]);
  const parentTips = useMemo(() => getParentTipsForGrade(grade.id), [grade.id]);

  return (
    <motion.div key={grade.id} variants={fadeScale} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}
      className="space-y-6">
      {/* Grade header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${grade.color}20` }}>
          {grade.emoji}
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">{grade.title}</h2>
          <p className="text-white/40 text-xs">{grade.age} · {grade.description}</p>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Resources</h3>
        <div className="flex flex-col gap-2">
          <ResourceItem
            icon={HiBookOpen}
            title="Lesson Plans"
            description={`${lessons.length} သင်ခန်းစာများ`}
            color={grade.color}
            onClick={() => navigate(`/grade/${grade.id}/lesson/${lessons[0]?.id}`)}
          />
          <ResourceItem
            icon={HiClipboardDocumentList}
            title="Assessment Guide"
            description={`${assessments.length} စမ်းသပ်မေးခွန်း`}
            color={grade.color}
            onClick={() => navigate(`/grade/${grade.id}/assessment`)}
          />
          <ResourceItem
            icon={HiDocumentText}
            title="Student Response Form"
            description="Worksheet များ"
            color={grade.color}
            onClick={() => navigate(`/grade/${grade.id}/worksheets`)}
          />
          <ResourceItem
            icon={HiUserGroup}
            title="Parent/Caregiver Tip Sheets"
            description="မိဘများအတွက် အကြံပြုချက်များ"
            color={grade.color}
            onClick={() => navigate(`/grade/${grade.id}/parent-tips`)}
          />
        </div>
      </div>

      {/* Lesson list */}
      <div>
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Lesson Plans</h3>
        <div className="flex flex-col gap-2">
          {lessons.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              onClick={() => navigate(`/grade/${grade.id}/lesson/${lesson.id}`)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${grade.color}15` }}>
                {lesson.icon}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-white/90 text-sm font-medium truncate">{lesson.title}</div>
                <div className="text-white/30 text-xs">{lesson.duration}</div>
              </div>
              <HiArrowRight className="text-white/20 shrink-0" size={14} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function OverviewTab() {
  return (
    <motion.div key="overview" variants={fadeScale} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}
      className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-heading text-white mb-2">Child Road Safety Curriculum</h1>
        <p className="text-white/50 text-sm leading-relaxed">
          မြန်မာနိုင်ငံ ကလေးများအတွက် လမ်းဘေးကင်းရေး ပညာပေးသင်ခန်းစာများ
        </p>
      </div>

      {/* Teacher's Guide */}
      <div className="rounded-xl p-4 bg-teal-500/10 border border-teal-500/20">
        <div className="flex items-center gap-3 mb-2">
          <HiAcademicCap size={20} className="text-teal-400" />
          <h3 className="text-teal-400 font-semibold text-sm">Teacher's Guide</h3>
        </div>
        <p className="text-white/50 text-xs leading-relaxed">
          ဆရာ/ဆရာမများအတွက် လမ်းညွှန်။ ကလေးများကို လမ်းဘေးကင်းရေး သင်ကြားရန် လိုအပ်သည့် အချက်အလက်များ အားလုံးပါဝင်ပါသည်။
        </p>
      </div>

      {/* Overview description */}
      <div>
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          The Child Road Safety Curriculum teaches and encourages pedestrian safety for students grades
          Kindergarten through 5th Grade. It is organized into five lessons:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { icon: '🚶', title: 'Walking Near Traffic', desc: 'လမ်းလျှောက်ခြင်း' },
            { icon: '🚦', title: 'Crossing Streets', desc: 'လမ်းကူးခြင်း' },
            { icon: '🔄', title: 'Crossing Intersections', desc: 'လမ်းဆုံကူးခြင်း' },
            { icon: '🅿️', title: 'Parking Lot Safety', desc: 'ကားရပ်နားရာနေရာ' },
            { icon: '🚌', title: 'School Bus Safety', desc: 'ကျောင်းကားစီးနည်း' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <span className="text-xl">{item.icon}</span>
              <div>
                <span className="text-white/80 text-sm font-medium">{item.title}</span>
                <span className="text-white/30 text-xs ml-2">({item.desc})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade levels overview */}
      <div>
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Grade Levels</h3>
        <div className="flex flex-col gap-2">
          {GRADES.map((grade) => (
            <div key={grade.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${grade.color}20` }}>
                {grade.emoji}
              </div>
              <div className="flex-1">
                <div className="text-white/80 text-sm font-medium">{grade.title}</div>
                <div className="text-white/30 text-xs">{grade.age}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function GradeSelector() {
  const [activeTab, setActiveTab] = useState('overview');

  const activeGrade = useMemo(() => GRADES.find((g) => g.id === activeTab), [activeTab]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-0" style={{ background: 'rgba(15, 26, 46, 0.95)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500/20">
              <span className="text-lg">🛡️</span>
            </div>
            <span className="text-white font-bold text-sm">Road Safety Education</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10" style={{ background: 'rgba(15, 26, 46, 0.95)' }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const grade = GRADES.find((g) => g.id === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 relative py-3 text-center transition-colors"
              >
                <span className={`text-xs font-semibold ${isActive ? 'text-teal-400' : 'text-white/40 hover:text-white/60'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-5 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab />}
            {activeGrade && <GradeTabContent grade={activeGrade} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
