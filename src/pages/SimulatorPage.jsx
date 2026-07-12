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
      title: 'ထွန်းလင်းပါ',
      subtitle: 'အရောင်တောက်တဲ့အင်္ကျီ ဝတ်သင့်သလဲ',
      emoji: '✨',
      color: 'from-yellow-400 to-orange-500',
      path: '/games/be-bright-be-seen',
    },
    {
      id: 'spot-the-danger',
      title: 'အန္တရာယ်ရှာပါ',
      subtitle: 'လမ်းပေါ်က အန္တရာယ်တွေကို ရှာဖွေပါ',
      emoji: '🔍',
      color: 'from-red-400 to-rose-600',
      path: '/games/spot-the-danger',
    },
    {
      id: 'pedestrian-first',
      title: 'လူသွားဦးစားပေး',
      subtitle: 'လူသွားသူကို ဦးစားပေးပါ',
      emoji: '🚶‍♂️',
      color: 'from-green-400 to-teal-600',
      path: '/games/pedestrian-first',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">ကစားနည်းများ</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          လမ်းစည်းကမ်းများကို အပြန်အလှန် ကစားရင်း လေ့လာပါ
        </p>
      </motion.div>

      <div className="max-w-sm mx-auto flex flex-col" style={{ gap: '20px' }}>
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(game.path)}
            className={`w-full bg-gradient-to-r ${game.color} rounded-xl py-5 px-6 text-center shadow-md hover:shadow-lg active:shadow transition-all duration-200`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-lg font-bold text-white">{game.title}</h2>
              <p className="text-white/80 text-sm">{game.subtitle}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
