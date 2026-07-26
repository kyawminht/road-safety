import { FiBookOpen, FiEdit3, FiHome, FiPlayCircle } from 'react-icons/fi';

const TABS = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'rules', label: 'Rules', icon: FiBookOpen },
  { id: 'quiz', label: 'Response', icon: FiEdit3 },
  { id: 'game', label: 'Games', icon: FiPlayCircle },
];

const COLORS = {
  primaryGreen: '#147A4F',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E1E8E4',
  sidebarBg: '#FFFFFF',
};

export default function DesktopSidebar({ activeTab, onTabChange }) {
  return (
    <nav
      className="shrink-0 flex flex-col border-r"
      style={{
        width: 220,
        backgroundColor: COLORS.sidebarBg,
        borderColor: COLORS.border,
        padding: 20,
        height: '100dvh',
      }}
    >
      <div className="flex items-center gap-3" style={{ padding: '6px 6px 26px' }}>
        <div
          className="flex items-center justify-center font-black"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: COLORS.primaryGreen,
            color: '#FFD84D',
            fontSize: 18,
          }}
          aria-hidden="true"
        >
          RS
        </div>
        <div>
          <div className="font-black" style={{ color: COLORS.primaryText, fontSize: 15, lineHeight: 1.1 }}>
            Road Safety
          </div>
          <div className="font-bold" style={{ color: COLORS.secondaryText, fontSize: 11, marginTop: 3 }}>
            School curriculum
          </div>
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: 6 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-3 transition-colors duration-150"
              style={{
                height: 46,
                borderRadius: 14,
                paddingLeft: 13,
                paddingRight: 13,
                backgroundColor: isActive ? COLORS.primaryGreen : 'transparent',
                color: isActive ? '#FFFFFF' : COLORS.primaryText,
                cursor: 'pointer',
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  color: isActive ? '#FFD84D' : COLORS.secondaryText,
                }}
                aria-hidden="true"
              >
                <Icon size={18} />
              </span>
              <span className="font-bold" style={{ fontSize: 14, lineHeight: 1 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 'auto',
          borderRadius: 18,
          backgroundColor: '#F5F8F6',
          border: `1px solid ${COLORS.border}`,
          padding: 14,
        }}
      >
        <div className="font-black" style={{ color: COLORS.primaryText, fontSize: 13 }}>
          Teacher note
        </div>
        <p className="font-semibold" style={{ color: COLORS.secondaryText, fontSize: 12, lineHeight: 1.45, marginTop: 6 }}>
          Use Response to review wrong and correct picture-card answers.
        </p>
      </div>
    </nav>
  );
}
