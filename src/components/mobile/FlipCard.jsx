import { motion } from 'framer-motion';

export default function FlipCard({ card, isFlipped, onFlip, className = '' }) {
  return (
    <div
      className={`perspective-1000 w-full ${className}`}
      style={{ aspectRatio: '3/4' }}
    >
      <motion.div
        onClick={() => onFlip(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip(!isFlipped);
          }
        }}
        aria-label={isFlipped ? 'အမှန်ကိုကြည့်ရန်' : 'အမှန်ကိုလှန်ကြည့်ရန်'}
      >
        {/* ── Front: Wrong side ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Red header */}
          <div className="h-[25%] bg-gradient-to-br from-road-red to-road-red-dark p-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❌</span>
              <span className="font-bold text-white text-lg">{card.frontLabel || 'မလုပ်ရ'}</span>
            </div>
            <span className="text-4xl opacity-30">⚠️</span>
          </div>

          {/* Image area */}
          <div className="flex-1 bg-road-gray-50 flex items-center justify-center p-4" style={{ height: '55%' }}>
            {card.wrongImage ? (
              <img
                src={card.wrongImage}
                alt={card.frontVisual}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-6xl opacity-30">❌</div>
            )}
          </div>

          {/* Caption */}
          <div className="h-[20%] bg-road-gray-100 p-3 flex items-center">
            <p className="text-road-gray-600 text-xs line-clamp-2">{card.frontVisual}</p>
          </div>
        </div>

        {/* ── Back: Right side ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Green header */}
          <div className="h-[25%] bg-gradient-to-br from-road-green to-road-green-dark p-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="font-bold text-white text-lg">{card.backLabel || 'လုပ်ရမယ်'}</span>
            </div>
            <span className="text-4xl opacity-30">💡</span>
          </div>

          {/* Image area */}
          <div className="flex-1 bg-road-gray-50 flex items-center justify-center p-4" style={{ height: '55%' }}>
            {card.rightImage ? (
              <img
                src={card.rightImage}
                alt={card.backVisual}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-6xl opacity-30">✅</div>
            )}
          </div>

          {/* Caption */}
          <div className="h-[20%] bg-road-gray-100 p-3 flex items-center">
            <p className="text-road-green-dark font-semibold text-xs line-clamp-2">{card.shortRule}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
