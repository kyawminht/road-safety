import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import rightWalking from '../../assets/right_walking.png';
import wrongWalking from '../../assets/wrong_walking.png';
import rightHelmet from '../../assets/right_helmet.png';
import wrongHelmet from '../../assets/wrong_helmet.png';
import rightSidewalk from '../../assets/right_sidewalk.png';
import wrongSidewalk from '../../assets/wrong_sidewalk.png';
import rightSidecar from '../../assets/right_sidecar.png';
import wrongSidecar from '../../assets/wrong_sidecar.png';
import rightBicycle from '../../assets/right_bicycle.png';
import wrongBicycle from '../../assets/wrong_bicycle.png';
import rightPassenger from '../../assets/right_passenger.png';
import wrongPassenger from '../../assets/wrong_passenger.png';
import rightFerry from '../../assets/right_ferry.png';
import wrongFerry from '../../assets/wrong_ferry.png';
import rightGroup from '../../assets/right_group.png';
import wrongGroup from '../../assets/wrong_group.png';
import rightUmbrella from '../../assets/right_umbrella.png';
import wrongUmbrella from '../../assets/wrong1_umbrella.png';
import rightAdult from '../../assets/right_walking_with_adult.png';
import wrongAdult from '../../assets/wrong_walking_with_adult.png';

/* ── Design tokens ── */
const COLORS = {
  background: '#F5F8F6',
  cardBackground: '#FFFFFF',
  primaryGreen: '#147A4F',
  primaryText: '#2B2B2B',
  secondaryText: '#7A817D',
  border: '#E6EAE8',
  progressTrack: '#E0E7E3',
  selectedBorder: '#147A4F',
};

/* ── Quiz data ── */
const QUESTIONS = [
  {
    id: 'q1',
    question: 'When should you cross the road?',
    options: [
      { id: 'a', label: 'A', image: wrongWalking, correct: false, accessibility: 'Child walking alone on the road unsafely' },
      { id: 'b', label: 'B', image: wrongSidewalk, correct: false, accessibility: 'Child walking on the road instead of the sidewalk' },
      { id: 'c', label: 'C', image: rightSidewalk, correct: true, accessibility: 'Child walking safely on the sidewalk' },
    ],
  },
  {
    id: 'q2',
    question: 'Which rider is wearing a helmet correctly?',
    options: [
      { id: 'a', label: 'A', image: wrongHelmet, correct: false, accessibility: 'Rider not wearing a helmet' },
      { id: 'b', label: 'B', image: rightHelmet, correct: true, accessibility: 'Rider wearing a helmet properly' },
      { id: 'c', label: 'C', image: wrongSidecar, correct: false, accessibility: 'Rider in an overloaded sidecar' },
    ],
  },
  {
    id: 'q3',
    question: 'Which child is using the seatbelt correctly?',
    options: [
      { id: 'a', label: 'A', image: rightPassenger, correct: true, accessibility: 'Child buckled up safely in the car' },
      { id: 'b', label: 'B', image: wrongPassenger, correct: false, accessibility: 'Child not wearing a seatbelt' },
      { id: 'c', label: 'C', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely' },
    ],
  },
  {
    id: 'q4',
    question: 'Who is crossing at the right place?',
    options: [
      { id: 'a', label: 'A', image: rightAdult, correct: true, accessibility: 'Child crossing the road with an adult safely' },
      { id: 'b', label: 'B', image: wrongAdult, correct: false, accessibility: 'Child crossing the road alone unsafely' },
      { id: 'c', label: 'C', image: wrongGroup, correct: false, accessibility: 'Group of children crossing unsafely' },
    ],
  },
  {
    id: 'q5',
    question: 'Which picture shows safe road behavior?',
    options: [
      { id: 'a', label: 'A', image: wrongWalking, correct: false, accessibility: 'Child walking alone on the road' },
      { id: 'b', label: 'B', image: rightGroup, correct: true, accessibility: 'Group of children crossing safely together' },
      { id: 'c', label: 'C', image: wrongGroup, correct: false, accessibility: 'Group of children running across the road' },
    ],
  },
  {
    id: 'q6',
    question: 'Which bicycle rider is safe?',
    options: [
      { id: 'a', label: 'A', image: rightBicycle, correct: true, accessibility: 'Child riding bicycle safely on the correct side' },
      { id: 'b', label: 'B', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely on the road' },
      { id: 'c', label: 'C', image: wrongHelmet, correct: false, accessibility: 'Rider without a helmet' },
    ],
  },
  {
    id: 'q7',
    question: 'Who is following the traffic signal?',
    options: [
      { id: 'a', label: 'A', image: rightSidewalk, correct: true, accessibility: 'Child crossing at the pedestrian crossing safely' },
      { id: 'b', label: 'B', image: wrongSidewalk, correct: false, accessibility: 'Child walking on the road' },
      { id: 'c', label: 'C', image: wrongPassenger, correct: false, accessibility: 'Child not using seatbelt in the car' },
    ],
  },
  {
    id: 'q8',
    question: 'Which picture shows safe ferry behavior?',
    options: [
      { id: 'a', label: 'A', image: wrongFerry, correct: false, accessibility: 'People on an overloaded ferry unsafely' },
      { id: 'b', label: 'B', image: rightFerry, correct: true, accessibility: 'People riding safely on a ferry' },
      { id: 'c', label: 'C', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely' },
    ],
  },
  {
    id: 'q9',
    question: 'How should you walk in the rain?',
    options: [
      { id: 'a', label: 'A', image: rightUmbrella, correct: true, accessibility: 'Child holding umbrella while walking safely' },
      { id: 'b', label: 'B', image: wrongUmbrella, correct: false, accessibility: 'Child using umbrella unsafely blocking view' },
      { id: 'c', label: 'C', image: wrongWalking, correct: false, accessibility: 'Child running in the rain on the road' },
    ],
  },
  {
    id: 'q10',
    question: 'Which sidecar ride is safe?',
    options: [
      { id: 'a', label: 'A', image: wrongSidecar, correct: false, accessibility: 'Overloaded sidecar with too many passengers' },
      { id: 'b', label: 'B', image: rightSidecar, correct: true, accessibility: 'Sidecar with proper number of passengers riding safely' },
      { id: 'c', label: 'C', image: wrongAdult, correct: false, accessibility: 'Child crossing the road unsafely' },
    ],
  },
];

/* ── Framer Motion variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -60 }),
};

/* ── Sub-components ── */

function TopBar({ currentQ, totalQ, onBack, isHome }) {
  return (
    <div
      className="flex items-center justify-between px-[14px]"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
        height: 'max(env(safe-area-inset-top, 0px) + 44px, 52px)',
        backgroundColor: COLORS.background,
      }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex items-center justify-center cursor-pointer"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Question counter */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.primaryText,
        }}
      >
        {currentQ + 1} / {totalQ}
      </span>

      {/* Spacer for balance */}
      <div style={{ width: 32 }} />
    </div>
  );
}

function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;
  return (
    <div
      style={{
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 4,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 5,
          backgroundColor: COLORS.progressTrack,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            backgroundColor: COLORS.primaryGreen,
            borderRadius: 3,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function QuestionTitle({ text }) {
  return (
    <div
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      <h2
        className="font-bold"
        style={{
          fontSize: 15,
          color: COLORS.primaryText,
          lineHeight: 1.4,
        }}
      >
        {text}
      </h2>
    </div>
  );
}

function ImageAnswerOption({ option, isSelected, isCorrect, showFeedback, onSelect }) {
  let borderColor = COLORS.border;
  let bgColor = 'transparent';
  let shadow = '0 1px 3px rgba(0,0,0,0.04)';

  if (showFeedback && isCorrect) {
    borderColor = '#22C55E';
    bgColor = 'rgba(34, 197, 94, 0.05)';
    shadow = '0 2px 8px rgba(34, 197, 94, 0.2)';
  } else if (showFeedback && isSelected && !isCorrect) {
    borderColor = '#EF4444';
    bgColor = 'rgba(239, 68, 68, 0.05)';
    shadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
  } else if (isSelected) {
    borderColor = COLORS.selectedBorder;
    shadow = '0 2px 8px rgba(20, 122, 79, 0.15)';
  }

  return (
    <motion.button
      variants={cardVariants}
      type="button"
      onClick={() => onSelect(option.id)}
      className="flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
      style={{
        flex: '1 1 0',
        minWidth: 0,
      }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1.1',
          borderRadius: 12,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor,
          backgroundColor: bgColor,
          overflow: 'hidden',
          boxShadow: shadow,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
          position: 'relative',
        }}
      >
        <img
          src={option.image}
          alt={option.accessibility}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {showFeedback && isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>✓</span>
          </motion.div>
        )}
        {showFeedback && isSelected && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>✗</span>
          </motion.div>
        )}
      </div>
      <span
        className="font-bold"
        style={{
          fontSize: 12,
          color: COLORS.primaryText,
          marginTop: 6,
        }}
      >
        {option.label}
      </span>
    </motion.button>
  );
}

function QuizResults({ score, total, onRetake, onHome }) {
  const percent = Math.round((score / total) * 100);
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center"
      style={{
        backgroundColor: COLORS.background,
        padding: '0 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        {/* Score circle */}
        <div className="relative mb-6">
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="70" cy="70" r="60"
              fill="none"
              stroke={COLORS.progressTrack}
              strokeWidth="10"
            />
            <motion.circle
              cx="70" cy="70" r="60"
              fill="none"
              stroke={percent >= 80 ? '#22C55E' : percent >= 50 ? '#FBBF24' : '#EF4444'}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 60}
              initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - percent / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span
              className="font-bold"
              style={{ fontSize: 28, color: COLORS.primaryText }}
            >
              {score}/{total}
            </span>
            <span
              style={{ fontSize: 11, color: COLORS.secondaryText }}
            >
              {percent}%
            </span>
          </div>
        </div>

        <h2
          className="font-bold text-center"
          style={{ fontSize: 18, color: COLORS.primaryText, marginBottom: 4 }}
        >
          {percent >= 80 ? 'Great Job!' : percent >= 50 ? 'Good Try!' : 'Keep Learning!'}
        </h2>
        <p
          className="text-center"
          style={{ fontSize: 11, color: COLORS.secondaryText, marginBottom: 32 }}
        >
          You got {score} out of {total} questions correct
        </p>

        <div className="w-full" style={{ maxWidth: 280 }}>
          <button
            type="button"
            onClick={onRetake}
            className="w-full font-bold"
            style={{
              height: 44,
              backgroundColor: COLORS.primaryGreen,
              color: '#FFFFFF',
              fontSize: 13,
              borderRadius: 12,
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(20, 122, 79, 0.25)',
            }}
          >
            Retake Quiz
          </button>
          <button
            type="button"
            onClick={onHome}
            className="w-full font-semibold"
            style={{
              height: 44,
              backgroundColor: COLORS.cardBackground,
              color: COLORS.secondaryText,
              fontSize: 13,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Quiz Screen ── */

export default function QuizScreen({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = QUESTIONS;
  const totalQ = questions.length;
  const question = questions[currentQ];
  const isLast = currentQ === totalQ - 1;
  const canGoBack = currentQ > 0;

  const advanceQuestion = useCallback(() => {
    if (isLast) {
      setFinished(true);
    } else {
      setDirection(1);
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [isLast]);

  const handleSelect = useCallback((optionId) => {
    if (showFeedback) return;
    if (answers[currentQ] !== undefined) return;

    setSelectedAnswer(optionId);
    setShowFeedback(true);

    const isCorrect = question.options.find((o) => o.id === optionId)?.correct || false;
    setAnswers((prev) => ({ ...prev, [currentQ]: { selected: optionId, correct: isCorrect } }));

    setTimeout(() => {
      advanceQuestion();
    }, 1000);
  }, [showFeedback, answers, currentQ, question, advanceQuestion]);

  const handleBack = useCallback(() => {
    if (currentQ === 0) {
      onComplete();
    } else {
      setDirection(-1);
      setCurrentQ((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [currentQ, onComplete]);

  const score = useMemo(() => {
    return Object.values(answers).filter((a) => a.correct).length;
  }, [answers]);

  const handleRetake = useCallback(() => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers({});
    setDirection(1);
    setFinished(false);
    setShowFeedback(false);
  }, []);

  if (finished) {
    return (
      <QuizResults
        score={score}
        total={totalQ}
        onRetake={handleRetake}
        onHome={onComplete}
      />
    );
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* ── Top bar with back arrow ── */}
      <TopBar currentQ={currentQ} totalQ={totalQ} onBack={handleBack} />

      {/* ── Progress bar ── */}
      <ProgressBar current={currentQ} total={totalQ} />

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {/* ── Question title ── */}
            <QuestionTitle text={question.question} />

            {/* ── Image answer choices ── */}
            <motion.div
              className="flex flex-row"
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 4,
                gap: 10,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {question.options.map((option) => (
                <ImageAnswerOption
                  key={option.id}
                  option={option}
                  isSelected={selectedAnswer === option.id}
                  isCorrect={option.correct}
                  showFeedback={showFeedback}
                  onSelect={handleSelect}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
