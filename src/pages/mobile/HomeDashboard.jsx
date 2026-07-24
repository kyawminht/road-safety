import bg from '../../assets/illustrations/bg.png';
/* ── Main Home Tab ── */

export default function HomeDashboard({ onNavigate }) {
  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* ── Background Image ── */}
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* ── Bottom Action Buttons ── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 40px, 56px)',
        }}
      >
        <div className="flex items-center" style={{ gap: 28 }}>
          {/* Rules Button */}
          <button
            type="button"
            onClick={() => onNavigate('rules')}
            aria-label="Rules"
            className="flex items-center justify-center font-bold cursor-pointer active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{
              width: 160,
              height: 64,
              borderRadius: 18,
              backgroundColor: '#FFC83D',
              color: '#FFFFFF',
              fontSize: 21,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            Rules
          </button>

          {/* Game Button */}
          <button
            type="button"
            onClick={() => onNavigate('game')}
            aria-label="Game"
            className="flex items-center justify-center font-bold cursor-pointer active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{
              width: 160,
              height: 64,
              borderRadius: 18,
              backgroundColor: '#2FBF9B',
              color: '#FFFFFF',
              fontSize: 21,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            Game
          </button>
        </div>
      </div>
    </div>
  );
}
