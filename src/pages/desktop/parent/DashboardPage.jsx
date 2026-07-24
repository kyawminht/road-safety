import { useState } from 'react';
import { motion } from 'framer-motion';
import { TOPICS } from '../../../data/flipCards.js';

const MOCK_CHILDREN = [
  { id: '1', name: 'မောင်ကျော်မင်း', grade: 'K-1', emoji: '👦' },
  { id: '2', name: 'မအိမ့်ခိုင်', grade: 'K-1', emoji: '👧' },
];

const MOCK_HISTORY = [
  { date: '2026-07-20', score: 4, total: 5, topic: 'လမ်းလျှောက်ခြင်း', type: 'Post-test' },
  { date: '2026-07-18', score: 3, total: 5, topic: 'လမ်းလျှောက်ခြင်း', type: 'Pre-test' },
  { date: '2026-07-15', score: 2, total: 5, topic: 'ဆိုင်ကယ်စီးခြင်း', type: 'Pre-test' },
];

// ── Simple line chart (SVG) ──
function SimpleLineChart({ data, title }) {
  const w = 300, h = 120;
  const max = Math.max(...data.map((d) => d.score));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (w - 40) + 20;
    const y = h - 20 - ((d.score / max) * (h - 40));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <h3 className="text-sm font-semibold text-road-gray-700 mb-3">{title}</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <line key={i} x1="20" y1={h - 20 - (h - 40) * r} x2={w - 20} y2={h - 20 - (h - 40) * r} stroke="#E5E7EB" strokeWidth="1" />
        ))}
        {/* Line */}
        <polyline points={points} fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * (w - 40) + 20;
          const y = h - 20 - ((d.score / max) * (h - 40));
          return <circle key={i} cx={x} cy={y} r="4" fill="#FBBF24" stroke="white" strokeWidth="2" />;
        })}
      </svg>
    </div>
  );
}

// ── Radar-like progress (simple bar display) ──
function TopicProgress({ data }) {
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-sm w-8">{d.emoji}</span>
          <div className="flex-1 h-3 rounded-full bg-road-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${d.value}%` }}
              transition={{ duration: 0.6, delay: 0.05 * i }}
              className="h-full rounded-full"
              style={{ backgroundColor: d.color || '#FBBF24' }}
            />
          </div>
          <span className="text-xs font-bold text-road-gray-500 w-8 text-right">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ParentDashboard({ section = 'dashboard' }) {
  const [selectedChild, setSelectedChild] = useState(MOCK_CHILDREN[0]?.id || null);
  const child = MOCK_CHILDREN.find((c) => c.id === selectedChild);

  const topicData = TOPICS.slice(0, 5).map((t, i) => ({
    emoji: t.emoji,
    value: Math.floor(Math.random() * 60) + 20,
    color: i % 2 === 0 ? '#FBBF24' : '#F59E0B',
    label: t.title,
  }));

  // ── QUIZ HISTORY ──
  if (section === 'history') {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-heading text-road-black mb-1">Quiz History</h1>
        <p className="text-road-gray-400 text-sm mb-6">View past quiz attempts</p>

        {/* Child selector */}
        <div className="flex gap-2 mb-6">
          {MOCK_CHILDREN.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChild(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedChild === c.id
                  ? 'bg-road-black text-white'
                  : 'bg-road-gray-100 text-road-gray-600'
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* History list */}
        <div className="space-y-3">
          {MOCK_HISTORY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white rounded-2xl border border-road-gray-200 p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-road-gray-700 text-sm">{item.topic}</div>
                <div className="text-xs text-road-gray-400 mt-0.5">
                  {item.date} · {item.type}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                  item.score >= 4 ? 'text-road-green-dark' : item.score >= 3 ? 'text-road-yellow-dark' : 'text-road-red'
                }`}>
                  {item.score}/{item.total}
                </span>
                <button className="px-3 py-1.5 bg-road-yellow text-road-black rounded-xl text-xs font-semibold hover:bg-road-yellow-dark transition-colors">
                  Retake
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── RESOURCES ──
  if (section === 'resources') {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-heading text-road-black mb-1">Resources</h1>
        <p className="text-road-gray-400 text-sm mb-6">Learning materials for your child</p>
        <div className="grid grid-cols-2 gap-4">
          {TOPICS.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-road-gray-200 p-4 flex items-center gap-3 cursor-pointer"
            >
              <span className="text-2xl">{topic.emoji}</span>
              <div>
                <div className="font-semibold text-road-gray-700 text-sm">{topic.title}</div>
                <div className="text-xs text-road-gray-400">Rule cards & tips</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── DEFAULT: DASHBOARD ──
  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-heading text-road-black">Parent Dashboard</h1>
        <p className="text-road-gray-400 text-sm">Monitor your child's progress</p>
      </motion.div>

      {/* Child selector */}
      <div className="flex gap-2 mb-6">
        {MOCK_CHILDREN.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedChild(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedChild === c.id
                ? 'bg-road-black text-white'
                : 'bg-road-gray-100 text-road-gray-600'
            }`}
          >
            {c.emoji} {c.name} ({c.grade})
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Latest Score', value: child ? '4/5' : '—', icon: '📝', color: 'bg-road-yellow/20' },
          { label: 'Streak', value: '🔥 3 days', icon: '🔥', color: 'bg-road-red/10' },
          { label: 'Badges', value: '🏆 2', icon: '🏆', color: 'bg-road-green/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`${stat.color} rounded-2xl p-4`}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-road-black">{stat.value}</div>
            <div className="text-xs text-road-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Score history chart */}
      <div className="bg-white rounded-2xl border border-road-gray-200 p-6 mb-6">
        <SimpleLineChart
          data={MOCK_HISTORY}
          title="Score History (over time)"
        />
      </div>

      {/* Topic mastery */}
      <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
        <h3 className="text-sm font-semibold text-road-gray-700 mb-3">Topic Mastery</h3>
        <TopicProgress data={topicData} />
      </div>
    </div>
  );
}
