import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiDocumentText, HiClipboardDocumentList, HiUserGroup } from 'react-icons/hi2';
import { getGradeById, getLessonsForGrade, getAssessmentsForGrade, getParentTipsForGrade } from '../data/curriculum.js';
import { useProgress } from '../hooks/useProgress.js';
import { useAuth } from '../hooks/useAuth.jsx';

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function GradeDashboard() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, completeLesson, isLessonComplete } = useProgress(user?.id);

  const grade = useMemo(() => getGradeById(gradeId), [gradeId]);
  const lessons = useMemo(() => getLessonsForGrade(gradeId), [gradeId]);
  const assessments = useMemo(() => getAssessmentsForGrade(gradeId), [gradeId]);
  const parentTips = useMemo(() => getParentTipsForGrade(gradeId), [gradeId]);

  const completedLessons = lessons.filter((l) => isLessonComplete(l.id)).length;
  const progressPercent = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  if (!grade) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/50">
        <p>အတန်းကို ရှာမတွေ့ပါ</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pt-6 pb-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm transition-colors mb-4">
            <HiArrowLeft size={16} /><span>ပြန်</span>
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${grade.color}25` }}>
              {grade.emoji}
            </div>
            <div>
              <h1 className="text-heading text-white">{grade.title}</h1>
              <p className="text-white/50 text-sm">{grade.age} · {grade.description}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1">
              <span>{completedLessons}/{lessons.length} ပြီးပါပြီ</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: grade.color }} initial={false} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            onClick={() => navigate(`/grade/${gradeId}/assessment`)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <HiClipboardDocumentList size={24} style={{ color: grade.color }} />
            <span className="text-white/70 text-xs font-medium">စမ်းသပ်မေးခွန်း</span>
          </motion.button>
          <motion.button
            onClick={() => navigate(`/grade/${gradeId}/parent-tips`)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <HiUserGroup size={24} style={{ color: grade.color }} />
            <span className="text-white/70 text-xs font-medium">မိဘများအတွက်</span>
          </motion.button>
          <motion.button
            onClick={() => navigate(`/grade/${gradeId}/worksheets`)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <HiDocumentText size={24} style={{ color: grade.color }} />
            <span className="text-white/70 text-xs font-medium">Worksheets</span>
          </motion.button>
        </div>

        {/* Lesson list */}
        <div className="mb-4">
          <h2 className="text-subheading text-white mb-3">သင်ခန်းစာများ</h2>
        </div>
        <div className="flex flex-col gap-3">
          {lessons.map((lesson, idx) => {
            const done = isLessonComplete(lesson.id);
            return (
              <motion.button
                key={lesson.id}
                onClick={() => navigate(`/grade/${gradeId}/lesson/${lesson.id}`)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-colors"
                style={{
                  background: done ? `linear-gradient(135deg, ${grade.color}22, ${grade.color}11)` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${done ? grade.color + '44' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${grade.color}20` }}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-base truncate">{lesson.title}</span>
                    {done && <HiCheckCircle className="text-green-400 shrink-0" size={18} />}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{lesson.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-white/30">{lesson.duration}</span>
                    <span className="text-xs text-white/20">·</span>
                    <span className="text-xs text-white/30">{lesson.objectives.length} ရည်ရွယ်ချက်</span>
                  </div>
                </div>
                <HiArrowRight className="text-white/30 shrink-0" size={18} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
