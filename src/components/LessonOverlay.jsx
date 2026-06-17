import { motion, AnimatePresence } from 'framer-motion';

export default function LessonOverlay({ visible, emoji, lessonText }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 rounded-t-2xl"
          style={{ background: 'rgba(15, 23, 42, 0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-warning/10 border-2 border-warning rounded-2xl px-6 py-5 mx-4 text-center max-w-xs"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="text-5xl mb-3">{emoji}</div>
            <p className="text-xl font-bold text-white leading-relaxed">
              {lessonText}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
