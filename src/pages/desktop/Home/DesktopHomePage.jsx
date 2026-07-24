import bannerImage from '../../../assets/illustrations/banner-1.png';

const COLORS = {
  primaryGreen: '#147A4F',
};

export default function DesktopHomePage({ onNavigate }) {
  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{ padding: 32 }}
    >
      <img
        src={bannerImage}
        alt="Road Safety Myanmar"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 16,
        }}
      />

      {/* ── Let's start button ── */}
      <button
        type="button"
        onClick={() => onNavigate?.('rules')}
        className="absolute flex items-center justify-center font-bold cursor-pointer active:scale-[0.97] transition-transform"
        style={{
          bottom: 36,
          right: 60,
          height: 52,
          padding: '0 36px',
          background: 'linear-gradient(135deg, #147A4F 0%, #0F6640 50%, #0A4F30 100%)',
          color: '#FFFFFF',
          fontSize: 16,
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(20, 122, 79, 0.35)',
        }}
      >
        Let's start →
      </button>
    </div>
  );
}
