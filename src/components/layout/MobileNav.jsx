import { motion } from 'framer-motion';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'rules', label: 'Rules' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'game', label: 'Game' },
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
      className="flex items-stretch bg-white border-t"
      style={{
        borderColor: COLORS.border,
        height: 50,
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-[2px] relative"
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: isActive ? COLORS.primaryGreen : COLORS.inactiveNav,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: 7,
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
