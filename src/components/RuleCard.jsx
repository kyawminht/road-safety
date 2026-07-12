import { motion } from 'framer-motion';
import ImageWithPlaceholder from './ImageWithPlaceholder.jsx';

export default function RuleCard({ rule, index, total, color }) {
  return (
    <div className="h-full w-full bg-black flex flex-col relative overflow-hidden">
      {/* Full-screen illustration */}
      <div className="absolute inset-0">
        <ImageWithPlaceholder
          src={rule.image}
          alt={rule.text}
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
      </div>

      {/* Bottom content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-8 px-6">
        {/* Rule badge */}
        <div className="w-full flex items-center justify-center gap-2 py-2.5 mb-4">
          <span className="text-xl leading-none select-none">📋</span>
          <span className="text-sm font-bold tracking-wider" style={{ color: '#93C5FD' }}>
            စည်းကမ်း
          </span>
        </div>

        {/* Rule text */}
        <p className="text-lg font-bold leading-relaxed text-white mb-6 drop-shadow-lg text-center">
          {rule.text}
        </p>

        {/* Counter */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-white/50 tabular-nums font-medium">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
