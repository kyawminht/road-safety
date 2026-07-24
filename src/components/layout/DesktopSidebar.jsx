const TABS = [
  { id: 'home', label: 'Home', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { id: 'rules', label: 'Rules', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )},
  { id: 'quiz', label: 'Quiz', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )},
  { id: 'game', label: 'Game', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  )},
];

const COLORS = {
  primaryGreen: '#147A4F',
  primaryText: '#2B2B2B',
  secondaryText: '#7A817D',
  border: '#E6EAE8',
  inactiveNav: '#DDE3E0',
  sidebarBg: '#FFFFFF',
};

export default function DesktopSidebar({ activeTab, onTabChange }) {
  return (
    <nav
      className="flex flex-col border-r"
      style={{
        width: 140,
        backgroundColor: COLORS.sidebarBg,
        borderColor: COLORS.border,
        paddingTop: 24,
        paddingBottom: 24,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center"
        style={{
          height: 40,
          marginBottom: 32,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: COLORS.primaryGreen,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Nav items */}
      <div className="flex flex-col" style={{ gap: 4, paddingLeft: 12, paddingRight: 12 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-3 transition-colors duration-150"
              style={{
                height: 40,
                borderRadius: 10,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: isActive ? COLORS.primaryGreen : 'transparent',
                color: isActive ? '#FFFFFF' : COLORS.primaryText,
                cursor: 'pointer',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {tab.icon}
              </span>
              <span
                className="font-semibold"
                style={{
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
