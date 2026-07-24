import { motion } from 'framer-motion';

export default function ProgressDots({ total, current }) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i === current ? 1.2 : 1,
            backgroundColor: i === current ? '#FBBF24' : '#D1D5DB',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );
}
