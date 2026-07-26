import { motion } from 'framer-motion';
import { FiBookOpen, FiEdit3, FiHome, FiPlayCircle } from 'react-icons/fi';

const TABS = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'rules', label: 'Rules', icon: FiBookOpen },
  { id: 'quiz', label: 'Response', icon: FiEdit3 },
  { id: 'game', label: 'Games', icon: FiPlayCircle },
];

const COLORS = {
  primaryGreen: '#147A4F',
  secondaryText: '#7A817D',
  border: '#E6EAE8',
  inactiveNav: '#DDE3E0',
};

export default function MobileNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="shrink-0 flex items-stretch bg-white border-t"
      style={{
        borderColor: COLORS.border,
        height: 50,
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-[2px] relative"
          >
            <motion.div
              animate={{
                y: isActive ? -1 : 0,
                scale: isActive ? 1.06 : 1,
              }}
              style={{
                width: 28,
                height: 24,
                borderRadius: 10,
                backgroundColor: isActive ? '#E8F6F1' : 'transparent',
                color: isActive ? COLORS.primaryGreen : COLORS.secondaryText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={16} aria-hidden="true" />
            </motion.div>
            <span
              style={{
                fontSize: 9,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? COLORS.primaryGreen : COLORS.secondaryText,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
