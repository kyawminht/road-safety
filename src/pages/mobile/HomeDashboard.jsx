import bg from '../../assets/illustrations/bg.png';
import { FiBookOpen, FiEdit3, FiPlayCircle } from 'react-icons/fi';
/* ── Main Home Tab ── */

const ACTIONS = [
  {
    id: 'rules',
    label: 'Learn Rules',
    helper: 'Picture cards',
    icon: FiBookOpen,
    background: '#FFC83D',
    color: '#1F2937',
  },
  {
    id: 'game',
    label: 'Play Games',
    helper: 'Practice safely',
    icon: FiPlayCircle,
    background: '#24BFA3',
    color: '#FFFFFF',
  },
  {
    id: 'quiz',
    label: 'Student Response',
    helper: 'Tell teacher',
    icon: FiEdit3,
    background: '#FFFFFF',
    color: '#147A4F',
  },
];

export default function HomeDashboard({ onNavigate }) {
  return (
    <div
      className="relative flex-1 min-h-[calc(100dvh-50px)] w-full overflow-hidden"
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

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, rgba(20,122,79,0.72) 100%)',
        }}
      />

      {/* ── Opening message ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 'max(env(safe-area-inset-top, 0px) + 20px, 30px)',
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <p className="font-bold text-white drop-shadow" style={{ fontSize: 15 }}>
          Road Safety Curriculum
        </p>
        <h1
          className="font-black text-white drop-shadow"
          style={{ fontSize: 34, lineHeight: 1.05, maxWidth: 280 }}
        >
          Learn. Practice. Report.
        </h1>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          paddingLeft: 18,
          paddingRight: 18,
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 14px, 22px)',
        }}
      >
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {ACTIONS.slice(0, 2).map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate(action.id)}
                className="flex items-center gap-3 font-bold cursor-pointer active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{
                  minHeight: 74,
                  borderRadius: 18,
                  backgroundColor: action.background,
                  color: action.color,
                  padding: '12px 14px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
                }}
              >
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.28)',
                  }}
                  aria-hidden="true"
                >
                  <Icon size={21} />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block" style={{ fontSize: 16, lineHeight: 1.15 }}>
                    {action.label}
                  </span>
                  <span className="block font-semibold opacity-75" style={{ fontSize: 11 }}>
                    {action.helper}
                  </span>
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onNavigate(ACTIONS[2].id)}
            className="col-span-2 flex items-center gap-3 font-bold cursor-pointer active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{
              minHeight: 64,
              borderRadius: 18,
              backgroundColor: ACTIONS[2].background,
              color: ACTIONS[2].color,
              padding: '12px 14px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.20)',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: '#E8F6F1',
              }}
              aria-hidden="true"
            >
              <FiEdit3 size={21} />
            </span>
            <span className="min-w-0 text-left">
              <span className="block" style={{ fontSize: 16, lineHeight: 1.15 }}>
                {ACTIONS[2].label}
              </span>
              <span className="block font-semibold opacity-75" style={{ fontSize: 11 }}>
                {ACTIONS[2].helper}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
