import { useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowDownTray } from 'react-icons/hi2';
import { getGradeById, getParentTipsForGrade } from '../data/curriculum.js';

export default function ParentTipsView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const grade = useMemo(() => getGradeById(gradeId), [gradeId]);
  const tips = useMemo(() => getParentTipsForGrade(gradeId), [gradeId]);

  const handleDownload = useCallback((tip) => {
    const content = [
      `${'═'.repeat(50)}`,
      `  ${tip.title}`,
      `${'═'.repeat(50)}`,
      '',
      `${grade.emoji} ${grade.title} (${grade.age})`,
      '',
      ...tip.tips.map((t, i) => `  ${i + 1}. ${t}`),
      '',
      `${'─'.repeat(50)}`,
      '  လမ်းလျှောက်ခြင်း ဘေးကင်းရေး ပညာပေးအဖွဲ့',
      `${'─'.repeat(50)}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tip.id}-parent-tips.txt`;
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
        <h1 className="text-heading text-gray-900 mb-1">မိဘများအတွက် အကြံပြုချက်များ</h1>
        <p className="text-gray-400 text-sm mb-6">{grade.title} အတွက် မိဘများ သိထားသင့်သည့် အချက်များ</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl p-4 sm:p-5 bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${grade.color}15` }}>
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-base">{tip.title}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {tip.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-1 shrink-0" style={{ color: grade.color }}>●</span>
                    <span className="text-gray-600 text-sm leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>

              {tip.downloadable && (
                <button
                  onClick={() => handleDownload(tip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                  style={{ background: `${grade.color}10`, color: grade.color, border: `1px solid ${grade.color}30` }}
                >
                  <HiArrowDownTray size={16} />
                  <span>Download</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
