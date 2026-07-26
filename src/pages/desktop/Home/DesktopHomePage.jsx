import { FiBookOpen, FiEdit3, FiPlayCircle } from 'react-icons/fi';
import bannerImage from '../../../assets/illustrations/he.png';

const ACTIONS = [
  {
    id: 'rules',
    title: 'Learn Rules',
    helper: 'Picture cards',
    icon: FiBookOpen,
    background: '#FFC83D',
    color: '#1F2937',
  },
  {
    id: 'game',
    title: 'Play Games',
    helper: 'Practice',
    icon: FiPlayCircle,
    background: '#24BFA3',
    color: '#FFFFFF',
  },
  {
    id: 'quiz',
    title: 'Student Response',
    helper: 'Picture quiz',
    icon: FiEdit3,
    background: '#147A4F',
    color: '#FFFFFF',
  },
];

export default function DesktopHomePage({ onNavigate }) {
  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{
        backgroundColor: '#F5F8F6',
        padding: 32,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <section
          style={{
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E1E8E4',
            overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(31, 41, 55, 0.08)',
          }}
        >
          <img
            src={bannerImage}
            alt="Road safety illustration"
            style={{
              width: '100%',
              aspectRatio: '16 / 7',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </section>

        <section
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 16,
            marginTop: 18,
          }}
        >
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onNavigate?.(action.id)}
                className="flex items-center gap-4 text-left active:scale-[0.99] transition-transform"
                style={{
                  minHeight: 98,
                  borderRadius: 20,
                  backgroundColor: action.background,
                  color: action.color,
                  padding: 20,
                  boxShadow: '0 10px 24px rgba(31, 41, 55, 0.08)',
                }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.28)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={24} />
                </span>
                <span className="min-w-0">
                  <span className="block font-black" style={{ fontSize: 20, lineHeight: 1.1 }}>
                    {action.title}
                  </span>
                  <span className="block font-bold" style={{ fontSize: 13, opacity: 0.72, marginTop: 5 }}>
                    {action.helper}
                  </span>
                </span>
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}
