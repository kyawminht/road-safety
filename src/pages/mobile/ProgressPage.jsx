import { motion } from 'framer-motion';
import { TOPICS } from '../../data/flipCards.js';

const MOCK_HISTORY = [
  { date: '2026-07-20', score: 4, total: 5, label: 'အကြိုစစ်ဆေးမှု' },
  { date: '2026-07-18', score: 3, total: 5, label: 'အကြိုစစ်ဆေးမှု' },
  { date: '2026-07-15', score: 2, total: 5, label: 'အကြိုစစ်ဆေးမှု' },
];

export default function ProgressPage() {
  // Per-topic progress (simulated)
  const topicProgress = TOPICS.map((topic) => ({
    ...topic,
    progress: Math.floor(Math.random() * 60) + 20,
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-road-white px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-heading text-road-black">တိုးတက်မှု</h1>
        <p className="text-road-gray-400 text-sm">My Progress</p>
      </motion.div>

      {/* Streak + Stats */}
      <div className="flex gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-road-yellow/20 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-road-black">3</div>
          <div className="text-xs text-road-gray-500">ရက်ဆက်တိုက်</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="flex-1 bg-road-green/10 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-road-green-dark">5</div>
          <div className="text-xs text-road-gray-500">တာဝန်ပြီးဆုံး</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-road-red/10 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl mb-1">📝</div>
          <div className="text-2xl font-bold text-road-red">3</div>
          <div className="text-xs text-road-gray-500">စစ်ဆေးပြီး</div>
        </motion.div>
      </div>

      {/* Per-topic progress */}
      <div className="mb-6">
        <h2 className="text-subheading text-road-black mb-3">ဘာသာရပ်အလိုက် တိုးတက်မှု</h2>
        <div className="space-y-3">
          {topicProgress.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-road-gray-50 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span>{topic.emoji}</span>
                  <span className="font-semibold text-sm text-road-gray-700">{topic.title}</span>
                </div>
                <span className="text-sm font-bold text-road-gray-600">{topic.progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-road-gray-200 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-road-yellow"
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent quiz history */}
      <div>
        <h2 className="text-subheading text-road-black mb-3">နောက်ဆုံးရလဒ်များ</h2>
        <div className="space-y-2">
          {MOCK_HISTORY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between p-3 rounded-xl bg-road-gray-50 border border-road-gray-200"
            >
              <div>
                <div className="text-sm font-semibold text-road-gray-700">{item.label}</div>
                <div className="text-xs text-road-gray-400">{item.date}</div>
              </div>
              <div className={`text-lg font-bold ${
                item.score >= 4 ? 'text-road-green-dark' : item.score >= 3 ? 'text-road-yellow-dark' : 'text-road-red'
              }`}>
                {item.score}/{item.total}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
