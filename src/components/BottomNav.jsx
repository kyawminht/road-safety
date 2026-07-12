import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiChatBubbleLeftRight, HiPlay } from 'react-icons/hi2';

const tabs = [
  { to: '/', label: 'Home', icon: HiHome, end: true },
  { to: '/comments', label: 'Feedback', icon: HiChatBubbleLeftRight },
  { to: '/simulator', label: 'Games', icon: HiPlay },
];

export default function BottomNav() {
  return (
    <nav
      className="flex items-stretch bg-white border-t border-gray-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className="flex-1"
        >
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.92 }}
              className={`flex flex-col items-center justify-center py-2.5 transition-colors ${
                isActive
                  ? 'text-teal-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <motion.div
                className="relative"
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <tab.icon className="text-xl leading-none mb-0.5" />
              </motion.div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-teal-500 rounded-full"
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
