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
    helper: 'Practice',
    icon: FiPlayCircle,
    background: '#24BFA3',
    color: '#FFFFFF',
  },
  {
    id: 'quiz',
    label: 'Student Response',
    helper: 'Picture quiz',
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
            'linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.02) 34%, rgba(15,23,42,0) 52%, rgba(20,92,66,0.78) 100%)',
        }}
      />

      {/* ── Opening message ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 'max(env(safe-area-inset-top, 0px) + 20px, 30px)',
          paddingLeft: 22,
          paddingRight: 22,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            maxWidth: 270,
            borderRadius: 18,
            padding: '12px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.22)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <h1
            className="font-black"
            style={{ fontSize: 28, lineHeight: 1.03, maxWidth: 230, color: '#FFD84D' }}
          >
            Road Safety
          </h1>
          <p className="font-bold mt-1" style={{ fontSize: 12, lineHeight: 1.35, maxWidth: 220, color: '#FFF3BF' }}>
            Learn before you cross.
          </p>
        </div>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 12px, 18px)',
        }}
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: '1fr 1fr',
            padding: 12,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.20)',
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.20)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {ACTIONS.slice(0, 2).map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate(action.id)}
                className="flex items-center gap-3 font-bold cursor-pointer active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{
                  minHeight: 76,
                  borderRadius: 16,
                  backgroundColor: action.background,
                  color: action.color,
                  padding: '12px',
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.18)',
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
                  <span className="block" style={{ fontSize: 15, lineHeight: 1.12 }}>
                    {action.label}
                  </span>
                  <span className="block font-bold opacity-70" style={{ fontSize: 9, lineHeight: 1.25, marginTop: 3 }}>
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
              minHeight: 66,
              borderRadius: 16,
              backgroundColor: ACTIONS[2].background,
              color: ACTIONS[2].color,
              padding: '12px',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.16)',
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
              <span className="block" style={{ fontSize: 15, lineHeight: 1.15 }}>
                {ACTIONS[2].label}
              </span>
              <span className="block font-bold opacity-70" style={{ fontSize: 10, lineHeight: 1.25, marginTop: 3 }}>
                {ACTIONS[2].helper}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
