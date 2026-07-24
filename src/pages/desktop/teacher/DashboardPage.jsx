import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TOPICS } from '../../../data/flipCards.js';

const MOCK_STUDENTS = [
  { name: 'မောင်ကျော်မင်း', score: 4, total: 5, weak: ['helmet'], status: 'good' },
  { name: 'မအိမ့်ခိုင်', score: 3, total: 5, weak: ['walking', 'helmet'], status: 'needs-review' },
  { name: 'မောင်ရာဇာ', score: 5, total: 5, weak: [], status: 'excellent' },
  { name: 'မစုစု', score: 2, total: 5, weak: ['bicycle', 'tricycle'], status: 'needs-help' },
  { name: 'မောင်ထွန်းထွန်း', score: 4, total: 5, weak: ['bicycle'], status: 'good' },
];

const STATUS_STYLES = {
  excellent: 'bg-road-green/10 text-road-green-dark border-road-green/20',
  good: 'bg-road-yellow/10 text-road-yellow-dark border-road-yellow/20',
  'needs-review': 'bg-road-gray-100 text-road-gray-600 border-road-gray-200',
  'needs-help': 'bg-road-red/10 text-road-red border-road-red/20',
};

const STATUS_LABELS = {
  excellent: '🌟 ကောင်းမွန်',
  good: '👍 အိုကေ',
  'needs-review': '📋 ပြန်သုံးသပ်',
  'needs-help': '⚠️ အကူအညီလို',
};

function TopicBadge({ topicId }) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-road-gray-100 text-road-gray-600">
      {topic.emoji} {topic.title}
    </span>
  );
}

// ── Chart SVG (simple bar chart, no library needed) ──
function SimpleBarChart({ data, title }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <h3 className="text-sm font-semibold text-road-gray-700 mb-3">{title}</h3>
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-road-gray-600">{d.value}%</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="w-full max-w-[40px] rounded-t-lg"
              style={{ backgroundColor: d.color || '#FBBF24' }}
            />
            <span className="text-[10px] text-road-gray-400 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeacherDashboard({ section = 'dashboard' }) {
  // ── CLASSES SECTION ──
  if (section === 'classes') {
    return (
      <div className="p-8 max-w-5xl">
        <h1 className="text-heading text-road-black mb-1">My Classes</h1>
        <p className="text-road-gray-400 text-sm mb-6">Manage your classes and students</p>
        <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-road-gray-700">Grade K-1 (အတန်း K-1)</h2>
            <span className="text-xs text-road-gray-400">5 students</span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-road-gray-400 text-xs uppercase">
              <tr>
                <th className="pb-2 font-semibold">Student</th>
                <th className="pb-2 font-semibold">Latest Score</th>
                <th className="pb-2 font-semibold">Weak Topics</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-road-gray-100">
              {MOCK_STUDENTS.map((s, i) => (
                <tr key={i} className="text-road-gray-700">
                  <td className="py-3 font-semibold">{s.name}</td>
                  <td className="py-3">{s.score}/{s.total}</td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {s.weak.length > 0 ? s.weak.map((w) => <TopicBadge key={w} topicId={w} />) : <span className="text-road-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── CONTENT LIBRARY ──
  if (section === 'content') {
    return (
      <div className="p-8 max-w-5xl">
        <h1 className="text-heading text-road-black mb-1">Content Library</h1>
        <p className="text-road-gray-400 text-sm mb-6">Browse and manage rule cards</p>
        <div className="grid grid-cols-3 gap-4">
          {TOPICS.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-road-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{topic.emoji}</div>
              <h3 className="font-bold text-road-gray-700 text-sm">{topic.title}</h3>
              <p className="text-xs text-road-gray-400 mt-1">Topic cards</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── ASSESSMENTS ──
  if (section === 'assessments') {
    return (
      <div className="p-8 max-w-5xl">
        <h1 className="text-heading text-road-black mb-1">Assessments</h1>
        <p className="text-road-gray-400 text-sm mb-6">View quiz results and manage questions</p>
        <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
          <h2 className="font-bold text-road-gray-700 mb-4">Recent Quiz Attempts</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-road-gray-400 text-xs uppercase">
              <tr>
                <th className="pb-2 font-semibold">Student</th>
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Score</th>
                <th className="pb-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-road-gray-100">
              {MOCK_STUDENTS.map((s, i) => (
                <tr key={i} className="text-road-gray-700">
                  <td className="py-3 font-semibold">{s.name}</td>
                  <td className="py-3 text-road-gray-400">2026-07-{20 - i}</td>
                  <td className="py-3">{s.score}/{s.total}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-road-gray-100 text-road-gray-600">
                      Post-test
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── REPORTS ──
  if (section === 'reports') {
    const topicData = TOPICS.slice(0, 5).map((t) => ({
      label: t.emoji,
      value: Math.floor(Math.random() * 50) + 30,
      color: '#FBBF24',
    }));

    return (
      <div className="p-8 max-w-5xl">
        <h1 className="text-heading text-road-black mb-1">Reports</h1>
        <p className="text-road-gray-400 text-sm mb-6">Class performance overview</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
            <SimpleBarChart data={topicData} title="Class Average by Topic (%)" />
          </div>
          <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
            <h3 className="text-sm font-semibold text-road-gray-700 mb-3">Class Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-road-black">5</div>
                <div className="text-xs text-road-gray-400">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-road-green-dark">3.6</div>
                <div className="text-xs text-road-gray-400">Average Score (out of 5)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-road-red">2</div>
                <div className="text-xs text-road-gray-400">Students Needing Help</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT: DASHBOARD ──
  const topicData = TOPICS.slice(0, 5).map((t, i) => ({
    label: t.emoji,
    value: Math.floor(Math.random() * 50) + 30,
    color: i % 2 === 0 ? '#FBBF24' : '#F59E0B',
  }));

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-heading text-road-black">Dashboard</h1>
        <p className="text-road-gray-400 text-sm">Welcome back, Teacher! 👨‍🏫</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Students', value: '5', icon: '👨‍🎓', color: 'bg-road-yellow/20' },
          { label: 'Avg Score', value: '72%', icon: '📊', color: 'bg-road-green/10' },
          { label: 'Classes', value: '2', icon: '👨‍🏫', color: 'bg-road-red/10' },
          { label: 'Cards', value: '14', icon: '📖', color: 'bg-road-black/5' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`${stat.color} rounded-2xl p-5`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-road-black">{stat.value}</div>
            <div className="text-xs text-road-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Class roster */}
        <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-road-gray-700">Class Roster</h2>
            <button className="text-xs font-semibold text-road-yellow-dark hover:text-road-yellow transition-colors">
              View All →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-road-gray-400 text-xs uppercase">
              <tr>
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Score</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-road-gray-100">
              {MOCK_STUDENTS.slice(0, 4).map((s, i) => (
                <tr key={i} className="text-road-gray-700">
                  <td className="py-3 font-semibold">{s.name}</td>
                  <td className="py-3">{s.score}/{s.total}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Topic chart + actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-road-gray-200 p-6">
            <SimpleBarChart data={topicData} title="Class Average by Topic" />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-road-black text-white rounded-xl text-sm font-semibold hover:bg-road-gray-800 transition-colors">
              👨‍🏫 Present to Class
            </button>
            <button className="flex-1 py-3 bg-road-yellow text-road-black rounded-xl text-sm font-semibold hover:bg-road-yellow-dark transition-colors">
              📋 Assign Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
