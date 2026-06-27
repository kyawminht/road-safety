import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/', label: 'စည်းကမ်း', emoji: '📄' },
  { to: '/learn', label: 'လေ့လာရန်', emoji: '📚' },
  { to: '/simulator', label: 'ကစားရန်', emoji: '🎮' },
];

export default function BottomNav() {
  return (
    <nav
      className="flex items-stretch bg-[#0F1A2E] border-t border-white/10"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className="flex-1"
        >
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.92 }}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                isActive
                  ? 'text-teal-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{tab.emoji}</span>
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-teal-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
