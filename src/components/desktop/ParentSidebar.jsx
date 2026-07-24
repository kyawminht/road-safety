import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'history', label: 'Quiz History', icon: '📝' },
  { id: 'resources', label: 'Resources', icon: '📖' },
];

export default function ParentSidebar({ activeTab, onTabChange }) {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 bg-road-black text-white min-h-dvh flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚦</span>
          <div>
            <div className="font-bold text-sm">Road Safety</div>
            <div className="text-xs text-white/50">Parent Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-road-yellow text-road-black'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-road-yellow/20 flex items-center justify-center text-sm font-bold text-road-yellow">
            {user?.email?.[0]?.toUpperCase() || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user?.email || 'Parent'}</div>
            <div className="text-xs text-white/50">မိဘ</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
