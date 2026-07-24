import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TOPICS } from '../../data/flipCards.js';
import { useAuth } from '../../context/AuthContext.jsx';

const QUICK_ACTIONS = [
  { id: 'learn', icon: '📖', label: 'စည်းကမ်းများ', sublabel: 'Learn Rules', color: 'bg-road-yellow', textColor: 'text-road-black' },
  { id: 'assess', icon: '📝', label: 'စမ်းသပ်စစ်ဆေး', sublabel: 'Take Quiz', color: 'bg-road-red', textColor: 'text-white' },
  { id: 'progress', icon: '📊', label: 'တိုးတက်မှု', sublabel: 'My Progress', color: 'bg-road-black', textColor: 'text-white' },
  { id: 'play', icon: '🎮', label: 'ဂိမ်းကစား', sublabel: 'Play Game', color: 'bg-road-green-dark', textColor: 'text-white' },
];

const GREETINGS = {
  student: 'မင်္ဂလာပါ ကျောင်းသား',
  teacher: 'မင်္ဂလာပါ ဆရာ/ဆရာမ',
  parent: 'မင်္ဂလာပါ မိဘ',
};

export default function HomePage({ onNavigate }) {
  const { role, user } = useAuth();
  const greeting = GREETINGS[role] || 'မင်္ဂလာပါ';

  return (
    <div className="flex-1 overflow-y-auto bg-road-white px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-road-gray-500 text-sm">
              {greeting}
            </p>
            <h1 className="text-heading text-road-black">
              လမ်းအန္တရာယ်ကင်းရှင်းရေး
            </h1>
          </div>
          <div className="text-4xl">🚦</div>
        </div>
        <p className="text-road-gray-400 text-xs">
          မှားတာကိုကြည့်ပြီး အမှန်ကိုလှန်ကြည့်ပါ
        </p>
      </motion.div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(action.id)}
            className={`${action.color} ${action.textColor} rounded-2xl p-4 text-left min-h-[100px] flex flex-col justify-between`}
          >
            <span className="text-2xl">{action.icon}</span>
            <div>
              <div className="font-bold text-base">{action.label}</div>
              <div className="text-xs opacity-70">{action.sublabel}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Topics / Continue Learning */}
      <div>
        <h2 className="text-subheading text-road-black mb-3">ဘာသာရပ်များ</h2>
        <div className="space-y-2">
          {TOPICS.map((topic) => (
            <motion.button
              key={topic.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('learn', topic.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-road-gray-50 border border-road-gray-200 hover:bg-road-gray-100 transition-colors"
            >
              <span className="text-2xl">{topic.emoji}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-road-gray-800 text-sm">{topic.title}</div>
                <div className="text-xs text-road-gray-400">{topic.title}</div>
              </div>
              <span className="text-road-gray-300 text-lg">›</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-4" />
    </div>
  );
}
