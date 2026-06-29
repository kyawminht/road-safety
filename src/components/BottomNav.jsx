import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentText, HiBookOpen, HiPlay } from 'react-icons/hi2';

const tabs = [
  { to: '/', label: 'စည်းကမ်း', icon: HiDocumentText },
  { to: '/learn', label: 'လေ့လာရန်', icon: HiBookOpen },
  { to: '/simulator', label: 'ကစားရန်', icon: HiPlay },
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
              <motion.div
                className="relative"
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <tab.icon
                  className="text-2xl leading-none mb-0.5"
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.6))'
                      : 'none',
                  }}
                />
              </motion.div>
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
