import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { trackEvent } from '../utils/mixpanel.js';

export default function SimulatorPage() {
  useEffect(() => {
    trackEvent('Simulator Page Opened');
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <span className="text-6xl block mb-6">🎮</span>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-3">စမ်းသပ်ကစားရန်</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-2">
          လမ်းစည်းကမ်းများကို အပြန်အလှန် ကစားရင်း လေ့လာနိုင်ပါမည်
        </p>
        <p className="text-teal-600 text-xs font-semibold">မကြာမီ ရောက်ရှိလာပါမည်...</p>
      </motion.div>
    </div>
  );
}
