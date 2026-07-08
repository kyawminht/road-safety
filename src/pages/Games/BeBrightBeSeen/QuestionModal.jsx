import { motion, AnimatePresence } from "framer-motion";

export default function QuestionModal({
  question,
  onAnswer,
  feedback,
  isCorrect,
}) {
  return (
    <div className="game-modal-backdrop">
      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key="question"
            className="game-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="modal-quiz-icon">❓</div>
            <div className="modal-question-badge">Quiz</div>
            <p className="modal-question">{question}</p>
            <div className="modal-btn-group">
              <motion.button
                className="modal-btn modal-btn-yes"
                onClick={() => onAnswer("yes")}
                whileTap={{ scale: 0.93 }}
              >
                Yes
              </motion.button>
              <motion.button
                className="modal-btn modal-btn-no"
                onClick={() => onAnswer("no")}
                whileTap={{ scale: 0.93 }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            className={`feedback-card ${isCorrect ? "correct" : "wrong"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="feedback-icon-ring"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
            >
              {isCorrect ? "✓" : "✕"}
            </motion.div>
            <p className="feedback-text">{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
