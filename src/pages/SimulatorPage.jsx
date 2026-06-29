import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/mixpanel.js';

export default function SimulatorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('Simulator Page Opened');
  }, []);

  const games = [
    {
      id: 'be-bright-be-seen',
      title: 'Be Bright Be Seen',
      subtitle: 'အရောင်တောက်တဲ့အင်္ကျီ ဝတ်သင့်သလဲ',
      emoji: '✨',
      color: 'from-yellow-400 to-orange-500',
      path: '/games/be-bright-be-seen',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <span className="text-4xl block mb-3">🎮</span>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">စမ်းသပ်ကစားရန်</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          လမ်းစည်းကမ်းများကို အပြန်အလှန် ကစားရင်း လေ့လာနိုင်ပါမည်
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(game.path)}
            className={`w-full bg-gradient-to-r ${game.color} rounded-2xl p-5 text-left shadow-lg active:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{game.emoji}</span>
              <div>
                <h2 className="text-lg font-bold text-white">{game.title}</h2>
                <p className="text-white/80 text-sm">{game.subtitle}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
