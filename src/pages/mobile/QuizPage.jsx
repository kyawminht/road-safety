import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_DATA = [
  {
    id: 1,
    text: 'လမ်းကူးတဲ့အခါ ဘာအရင်လုပ်ရမလဲ?',
    options: ['ပြေးပြီးကူးမယ်', 'ရပ်ပြီးကြည့်မယ်', 'ဖုန်းကြည့်မယ်'],
    correct: 1,
    topicId: 'walking',
  },
  {
    id: 2,
    text: 'လမ်းလျှောက်တဲ့အခါ ဘယ်နေရာမှာ လျှောက်ရမလဲ?',
    options: ['ကားလမ်းပေါ်', 'လူသွားစင်္ကြံပေါ်', 'လမ်းအလယ်'],
    correct: 1,
    topicId: 'walking',
  },
  {
    id: 3,
    text: 'ဆိုင်ကယ်စီးရင် ဘာဆောင်းရမလဲ?',
    options: ['နားကြပ်', 'ဦးထုပ်', 'ဖိနပ်'],
    correct: 1,
    topicId: 'helmet',
  },
  {
    id: 4,
    text: 'မိုးရွာတဲ့အခါ ထီးကို ဘယ်လိုဆောင်းရမလဲ?',
    options: ['ငုံ့ပြီးဆောင်း', 'ရှေ့ကိုကြည့်ရအောင် မြှင့်ဆောင်း', 'မဆောင်းဘဲနေ'],
    correct: 1,
    topicId: 'walking',
  },
  {
    id: 5,
    text: 'ညဘက်မှာ ဘာအဝတ်အစားဝတ်သင့်သလဲ?',
    options: ['အနက်ရောင်', 'အရောင်တောက်တောက်', 'ဘာမဆိုရတယ်'],
    correct: 1,
    topicId: 'walking',
  },
];

function getTopicSuggestion(topicId) {
  const map = {
    walking: { emoji: '🚶‍♂️', name: 'လူသွားစင်္ကြံ' },
    helmet: { emoji: '⛑️', name: 'ဦးထုပ်' },
    sidecar: { emoji: '🛵', name: 'ဘေးတွဲ' },
    bicycle: { emoji: '🚲', name: 'စက်ဘီး' },
    tricycle: { emoji: '🛺', name: 'သုံးဘီး' },
  };
  return map[topicId] || { emoji: '📖', name: 'စည်းကမ်း' };
}

export default function QuizPage({ onComplete, onNavigate }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null); // { selected, correct }
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState(1);

  const questions = QUIZ_DATA;
  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  const handleAnswer = useCallback((optionIndex) => {
    if (feedback) return; // already answered

    const isCorrect = optionIndex === question.correct;
    setFeedback({ selected: optionIndex, correct: isCorrect });
    setAnswers((prev) => ({ ...prev, [currentQ]: optionIndex }));

    setTimeout(() => {
      setFeedback(null);
      if (currentQ + 1 < questions.length) {
        setDirection(1);
        setCurrentQ((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 1200);
  }, [feedback, question, currentQ, questions.length]);

  // Score + suggestions
  const result = useMemo(() => {
    let correct = 0;
    const wrongTopics = new Set();
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        correct++;
      } else if (answers[i] !== undefined) {
        wrongTopics.add(q.topicId);
      }
    });
    return {
      score: correct,
      total: questions.length,
      percent: Math.round((correct / questions.length) * 100),
      wrongTopics: [...wrongTopics],
    };
  }, [answers, questions]);

  const handleRetake = useCallback(() => {
    setCurrentQ(0);
    setAnswers({});
    setFeedback(null);
    setFinished(false);
  }, []);

  if (finished) {
    return (
      <div className="flex-1 flex flex-col bg-road-white px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          {/* Score gauge */}
          <div className="relative mb-6">
            <svg width="160" height="160" className="transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <motion.circle
                cx="80" cy="80" r="70" fill="none"
                stroke={result.percent >= 80 ? '#22C55E' : result.percent >= 50 ? '#FBBF24' : '#EF4444'}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 70}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - result.percent / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-road-black">
                  {result.score}/{result.total}
                </div>
                <div className="text-sm text-road-gray-400">{result.percent}%</div>
              </div>
            </div>
          </div>

          <h2 className="text-heading text-road-black mb-1">
            {result.percent >= 80 ? 'ဂုဏ်ယူပါတယ်! 🎉' : result.percent >= 50 ? 'ဆက်ကြိုးစားပါ! 💪' : 'ပြန်လေ့လာပါ 📖'}
          </h2>
          <p className="text-road-gray-400 text-sm mb-6">
            {result.score} မှန်ပါတယ်
          </p>

          {/* Weak topic suggestions */}
          {result.wrongTopics.length > 0 && (
            <div className="w-full max-w-sm mb-6">
              <p className="text-sm font-semibold text-road-gray-600 mb-2 text-center">
                ပြန်လေ့လာရန် ဘာသာရပ်များ
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {result.wrongTopics.map((topicId) => {
                  const t = getTopicSuggestion(topicId);
                  return (
                    <button
                      key={topicId}
                      onClick={() => onNavigate('learn', topicId)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-road-gray-100 rounded-full text-sm font-semibold text-road-gray-700 hover:bg-road-yellow hover:text-road-black transition-all"
                    >
                      {t.emoji} {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="w-full max-w-sm space-y-2">
            <button
              onClick={handleRetake}
              className="w-full py-3 rounded-xl bg-road-yellow text-road-black font-bold text-sm active:scale-95 transition-all"
            >
              ပြန်ဖြေမယ် 🔄
            </button>
            <button
              onClick={() => onComplete()}
              className="w-full py-3 rounded-xl bg-road-gray-100 text-road-gray-600 font-semibold text-sm active:scale-95 transition-all"
            >
              ပင်မစာမျက်နှာသို့
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-road-white px-6 pt-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-road-gray-400 mb-1">
          <span>မေးခွန်း {currentQ + 1}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-road-gray-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-road-yellow"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 50 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="text-heading text-road-black mb-6">{question.text}</h2>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              let bg = 'bg-road-gray-100';
              let textColor = 'text-road-gray-700';
              let border = 'border-transparent';

              if (feedback) {
                if (i === question.correct) {
                  bg = 'bg-road-green/10';
                  textColor = 'text-road-green-dark';
                  border = 'border-road-green';
                } else if (i === feedback.selected && !feedback.correct) {
                  bg = 'bg-road-red/10';
                  textColor = 'text-road-red';
                  border = 'border-road-red';
                }
              }

              return (
                <motion.button
                  key={i}
                  whileTap={feedback ? {} : { scale: 0.98 }}
                  onClick={() => handleAnswer(i)}
                  disabled={!!feedback}
                  className={`w-full p-4 rounded-xl text-left font-semibold text-sm transition-all border-2 ${bg} ${textColor} ${border} ${
                    feedback ? 'cursor-default' : 'hover:bg-road-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      feedback && i === question.correct
                        ? 'bg-road-green text-white'
                        : feedback && i === feedback.selected && !feedback.correct
                        ? 'bg-road-red text-white'
                        : 'bg-road-gray-200 text-road-gray-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {feedback && i === question.correct && <span>✅</span>}
                    {feedback && i === feedback.selected && !feedback.correct && <span>❌</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-xl text-center font-semibold text-sm ${
                  feedback.correct ? 'bg-road-green/10 text-road-green-dark' : 'bg-road-red/10 text-road-red'
                }`}
              >
                {feedback.correct ? 'မှန်တယ် ✅' : 'မှားတယ် ❌'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
}
