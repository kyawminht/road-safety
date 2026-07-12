import { useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowDownTray } from 'react-icons/hi2';
import { getGradeById, getLessonsForGrade } from '../data/curriculum.js';

export default function WorksheetsView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const grade = useMemo(() => getGradeById(gradeId), [gradeId]);
  const lessons = useMemo(() => getLessonsForGrade(gradeId), [gradeId]);

  const handleDownloadWorksheet = useCallback((lesson) => {
    const content = [
      `${'═'.repeat(50)}`,
      `  Worksheet: ${lesson.title}`,
      `${'═'.repeat(50)}`,
      '',
      `${grade.emoji} ${grade.title} (${grade.age})`,
      `Duration: ${lesson.duration}`,
      '',
      `${'─'.repeat(50)}`,
      '  Learning Objectives:',
      `${'─'.repeat(50)}`,
      ...lesson.objectives.map((o, i) => `  ${i + 1}. ${o}`),
      '',
      `${'─'.repeat(50)}`,
      '  Activities:',
      `${'─'.repeat(50)}`,
      ...lesson.activities.map((a) => `  - ${a.title}: ${a.description}`),
      '',
      `${'─'.repeat(50)}`,
      '  Student Response:',
      `${'─'.repeat(50)}`,
      '',
      '  Name: _______________    Date: _______________',
      '',
      '  1. What did you learn today?',
      '  ________________________________________',
      '',
      '  2. Draw the safe way to cross the road:',
      '  ┌────────────────────────────────────┐',
      '  │                                    │',
      '  │                                    │',
      '  │                                    │',
      '  └────────────────────────────────────┘',
      '',
      '  3. Circle the safe picture:',
      '  (A)                    (B)',
      '',
      `${'─'.repeat(50)}`,
      '  Road Safety Education Program',
      `${'─'.repeat(50)}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.id}-worksheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [grade]);

  if (!grade) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>အတန်းကို ရှာမတွေ့ပါ</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8 max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors mb-4">
          <HiArrowLeft size={16} /><span>ပြန်</span>
        </button>
        <h1 className="text-heading text-gray-900 mb-1">Worksheets</h1>
        <p className="text-gray-400 text-sm mb-6">{grade.title} အတွက် ကျောင်းသား worksheet များ</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl p-4 bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${grade.color}15` }}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-base truncate">{lesson.title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{lesson.duration}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                {lesson.objectives.slice(0, 2).map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5 shrink-0" style={{ color: grade.color }}>•</span>
                    <span className="text-gray-500 text-xs">{obj}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleDownloadWorksheet(lesson)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                style={{ background: `${grade.color}10`, color: grade.color, border: `1px solid ${grade.color}30` }}
              >
                <HiArrowDownTray size={16} />
                <span>Download</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
