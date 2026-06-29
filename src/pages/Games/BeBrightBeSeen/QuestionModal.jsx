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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="modal-question-badge">Quiz</div>
            <p className="modal-question">{question}</p>
            <div className="modal-btn-group">
              <button
                className="modal-btn modal-btn-yes"
                onClick={() => onAnswer("yes")}
              >
                Yes
              </button>
              <button
                className="modal-btn modal-btn-no"
                onClick={() => onAnswer("no")}
              >
                No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            className={`feedback-card ${isCorrect ? "correct" : "wrong"}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="feedback-icon-ring">
              {isCorrect ? "✓" : "✕"}
            </div>
            <p className="feedback-text">{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
