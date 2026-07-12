import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { getGradeById, getAssessmentsForGrade, getAssessmentById } from '../data/curriculum.js';

const fadeScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function AssessmentView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const grade = useMemo(() => getGradeById(gradeId), [gradeId]);
  const assessments = useMemo(() => getAssessmentsForGrade(gradeId), [gradeId]);

  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);

  const assessment = useMemo(() => {
    if (!selectedAssessment) return null;
    return getAssessmentById(selectedAssessment);
  }, [selectedAssessment]);

  const handleSelectAssessment = useCallback((id) => {
    setSelectedAssessment(id);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  }, []);

  const handleAnswer = useCallback((questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const handleNext = useCallback(() => {
    if (assessment && currentQuestion + 1 < assessment.questions.length) {
      setDirection(1);
      setCurrentQuestion((i) => i + 1);
    } else {
      setShowResult(true);
    }
  }, [assessment, currentQuestion]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion((i) => i - 1);
    }
  }, [currentQuestion]);

  const score = useMemo(() => {
    if (!assessment) return 0;
    let correct = 0;
    assessment.questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  }, [assessment, answers]);

  const handleBackToSelection = useCallback(() => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  }, []);

  if (!grade) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>အတန်းကို ရှာမတွေ့ပါ</p>
      </div>
    );
  }

  // Assessment selection screen
  if (!assessment) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8 max-w-2xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors mb-4">
            <HiArrowLeft size={16} /><span>ပြန်</span>
          </button>
          <h1 className="text-heading text-gray-900 mb-1">စမ်းသပ်မေးခွန်း</h1>
          <p className="text-gray-400 text-sm mb-6">{grade.title} အတွက် စမ်းသပ်မေးခွန်းများ</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assessments.map((a, idx) => (
              <motion.button
                key={a.id}
                onClick={() => handleSelectAssessment(a.id)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-colors bg-gray-50 border border-gray-200 hover:bg-gray-100"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${grade.color}15` }}>
                  {a.type === 'pre' ? '📝' : '✅'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 font-bold text-base">{a.title}</div>
                  <p className="text-gray-400 text-xs mt-0.5">{a.description}</p>
                  <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full" style={{ background: `${grade.color}15`, color: grade.color }}>
                    {a.questions.length} မေးခွန်း
                  </span>
                </div>
                <HiArrowRight className="text-gray-300 shrink-0" size={18} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const total = assessment.questions.length;
    const percent = Math.round((score / total) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 text-center bg-white">
        <div className="max-w-md w-full">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mb-6">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto bg-green-50">
              <span className="text-5xl">{percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '💪'}</span>
            </div>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-gray-900 mb-2">
            {score}/{total} မှန်ပါတယ်
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-500 text-base mb-2">
            {percent}% အမှတ်ရပါတယ်
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-gray-400 text-sm mb-8">
            {assessment.title}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm mx-auto">
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onClick={handleBackToSelection} whileTap={{ scale: 0.96 }}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-base shadow-lg" style={{ background: grade.color, boxShadow: `0 8px 24px ${grade.color}44` }}>
              ပြန်လည်ရွေးချယ်ရန်
            </motion.button>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={() => navigate('/')} whileTap={{ scale: 0.96 }}
              className="flex-1 py-3 rounded-xl text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors">
              Curriculum သို့ ပြန်ရန်
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const question = assessment.questions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const hasAnswered = selectedAnswer !== undefined;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <div className="relative z-30 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <button onClick={handleBackToSelection} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors"><HiArrowLeft size={16} /></button>
        <div className="flex items-center gap-2">
          <span className="text-base">{grade.emoji}</span>
          <span className="text-gray-600 text-xs font-bold">{assessment.title}</span>
        </div>
        <span className="text-gray-400 text-xs tabular-nums">{currentQuestion + 1}/{assessment.questions.length}</span>
      </div>

      {/* Progress dots */}
      <div className="relative z-30 flex items-center justify-center gap-1.5 py-2 bg-gray-100">
        {assessment.questions.map((q, i) => {
          const answered = answers[q.id] !== undefined;
          const isCorrect = answered && answers[q.id] === q.correct;
          return (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width: i === currentQuestion ? 20 : 6, height: 6,
              background: i === currentQuestion ? grade.color : answered ? (isCorrect ? '#22c55e' : '#ef4444') : '#e5e7eb',
            }} />
          );
        })}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={currentQuestion} custom={direction} variants={{
          enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
          center: { x: 0, opacity: 1 },
          exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
        }} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <div className="max-w-lg w-full">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-900 text-lg sm:text-xl font-bold mb-6 leading-relaxed">
              {question.text}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto">
              {question.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrectOption = i === question.correct;
                const showFeedback = hasAnswered;
                return (
                  <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    onClick={() => !hasAnswered && handleAnswer(question.id, i)} disabled={hasAnswered}
                    className="w-full p-4 rounded-xl text-left transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-3"
                    style={{
                      background: showFeedback
                        ? (isCorrectOption ? '#dcfce7' : isSelected ? '#fee2e2' : '#f9fafb')
                        : '#f9fafb',
                      border: `1px solid ${showFeedback
                        ? (isCorrectOption ? '#86efac' : isSelected ? '#fca5a5' : '#e5e7eb')
                        : '#e5e7eb'}`,
                    }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: showFeedback
                          ? (isCorrectOption ? '#dcfce7' : isSelected ? '#fee2e2' : '#f3f4f6')
                          : '#f3f4f6',
                        color: showFeedback
                          ? (isCorrectOption ? '#16a34a' : isSelected ? '#dc2626' : '#9ca3af')
                          : '#9ca3af',
                      }}>
                      {showFeedback && isCorrectOption ? <HiCheckCircle size={18} /> : showFeedback && isSelected ? <HiXCircle size={18} /> : String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-gray-700 text-sm">{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="relative z-30 flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200">
        <button onClick={handlePrev} disabled={currentQuestion === 0} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed text-sm transition-colors">
          <HiArrowLeft size={16} /><span>နောက်</span>
        </button>
        <motion.button onClick={handleNext} disabled={!hasAnswered} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: grade.color, boxShadow: `0 4px 16px ${grade.color}44` }}>
          <span>{currentQuestion + 1 < assessment.questions.length ? 'နောက်တစ်ခု' : 'ပြီးပါပြီ'}</span>
          <HiArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
