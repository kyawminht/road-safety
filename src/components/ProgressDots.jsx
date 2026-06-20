import { motion } from 'framer-motion';

export default function ProgressDots({ total, current }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4" role="status" aria-label={`ကတ် ${current + 1} / ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 12, height: 12 }}
          animate={{
            scale: i === current ? 1.2 : 1,
            backgroundColor: i === current ? '#0D9488' : '#E2E8F0',
            boxShadow:
              i === current
                ? '0 0 12px rgba(13, 148, 136, 0.4)'
                : '0 0 0px rgba(13, 148, 136, 0)',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
