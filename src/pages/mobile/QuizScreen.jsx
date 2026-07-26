import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiRefreshCw, FiHome, FiCheckCircle } from 'react-icons/fi';

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

const COLORS = {
  background: '#F5F8F6',
  cardBackground: '#FFFFFF',
  primaryGreen: '#147A4F',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E1E8E4',
  progressTrack: '#DDE7E1',
};

const QUESTIONS = [
  {
    id: 'walking-sidewalk',
    topic: 'Walking',
    question: 'Choose the safest place to walk.',
    options: [
      { id: 'a', label: 'A', image: wrongWalking, correct: false, accessibility: 'Child walking alone on the road unsafely' },
      { id: 'b', label: 'B', image: wrongSidewalk, correct: false, accessibility: 'Child walking on the road instead of the sidewalk' },
      { id: 'c', label: 'C', image: rightSidewalk, correct: true, accessibility: 'Child walking safely on the sidewalk' },
    ],
  },
  {
    id: 'motorcycle-helmet',
    topic: 'Helmet',
    question: 'Which rider is wearing a helmet correctly?',
    options: [
      { id: 'a', label: 'A', image: wrongHelmet, correct: false, accessibility: 'Rider not wearing a helmet' },
      { id: 'b', label: 'B', image: rightHelmet, correct: true, accessibility: 'Rider wearing a helmet properly' },
      { id: 'c', label: 'C', image: wrongSidecar, correct: false, accessibility: 'Rider in an overloaded sidecar' },
    ],
  },
  {
    id: 'car-seatbelt',
    topic: 'Passenger',
    question: 'Which child is using the seatbelt correctly?',
    options: [
      { id: 'a', label: 'A', image: rightPassenger, correct: true, accessibility: 'Child buckled up safely in the car' },
      { id: 'b', label: 'B', image: wrongPassenger, correct: false, accessibility: 'Child not wearing a seatbelt' },
      { id: 'c', label: 'C', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely' },
    ],
  },
  {
    id: 'cross-with-adult',
    topic: 'Crossing',
    question: 'Who is crossing at the right place?',
    options: [
      { id: 'a', label: 'A', image: rightAdult, correct: true, accessibility: 'Child crossing the road with an adult safely' },
      { id: 'b', label: 'B', image: wrongAdult, correct: false, accessibility: 'Child crossing the road alone unsafely' },
      { id: 'c', label: 'C', image: wrongGroup, correct: false, accessibility: 'Group of children crossing unsafely' },
    ],
  },
  {
    id: 'group-crossing',
    topic: 'Crossing',
    question: 'Which picture shows safe road behavior?',
    options: [
      { id: 'a', label: 'A', image: wrongWalking, correct: false, accessibility: 'Child walking alone on the road' },
      { id: 'b', label: 'B', image: rightGroup, correct: true, accessibility: 'Group of children crossing safely together' },
      { id: 'c', label: 'C', image: wrongGroup, correct: false, accessibility: 'Group of children running across the road' },
    ],
  },
  {
    id: 'bicycle-safe',
    topic: 'Bicycle',
    question: 'Which bicycle rider is safe?',
    options: [
      { id: 'a', label: 'A', image: rightBicycle, correct: true, accessibility: 'Child riding bicycle safely on the correct side' },
      { id: 'b', label: 'B', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely on the road' },
      { id: 'c', label: 'C', image: wrongHelmet, correct: false, accessibility: 'Rider without a helmet' },
    ],
  },
  {
    id: 'traffic-signal',
    topic: 'Signals',
    question: 'Who is following the traffic signal?',
    options: [
      { id: 'a', label: 'A', image: rightSidewalk, correct: true, accessibility: 'Child crossing at the pedestrian crossing safely' },
      { id: 'b', label: 'B', image: wrongSidewalk, correct: false, accessibility: 'Child walking on the road' },
      { id: 'c', label: 'C', image: wrongPassenger, correct: false, accessibility: 'Child not using seatbelt in the car' },
    ],
  },
  {
    id: 'ferry-safe',
    topic: 'School Ferry',
    question: 'Which picture shows safe ferry behavior?',
    options: [
      { id: 'a', label: 'A', image: wrongFerry, correct: false, accessibility: 'People on an overloaded ferry unsafely' },
      { id: 'b', label: 'B', image: rightFerry, correct: true, accessibility: 'People riding safely on a ferry' },
      { id: 'c', label: 'C', image: wrongBicycle, correct: false, accessibility: 'Child riding bicycle unsafely' },
    ],
  },
  {
    id: 'rain-walking',
    topic: 'Rain',
    question: 'How should you walk in the rain?',
    options: [
      { id: 'a', label: 'A', image: rightUmbrella, correct: true, accessibility: 'Child holding umbrella while walking safely' },
      { id: 'b', label: 'B', image: wrongUmbrella, correct: false, accessibility: 'Child using umbrella unsafely blocking view' },
      { id: 'c', label: 'C', image: wrongWalking, correct: false, accessibility: 'Child running in the rain on the road' },
    ],
  },
  {
    id: 'sidecar-safe',
    topic: 'Sidecar',
    question: 'Which sidecar ride is safe?',
    options: [
      { id: 'a', label: 'A', image: wrongSidecar, correct: false, accessibility: 'Overloaded sidecar with too many passengers' },
      { id: 'b', label: 'B', image: rightSidecar, correct: true, accessibility: 'Sidecar with proper number of passengers riding safely' },
      { id: 'c', label: 'C', image: wrongAdult, correct: false, accessibility: 'Child crossing the road unsafely' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -60 }),
};

function TopBar({ currentQ, totalQ, score, onBack }) {
  return (
    <div
      className="px-[16px]"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 10px, 18px)',
        backgroundColor: COLORS.background,
      }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center"
          style={{
            width: 38,
            height: 38,
            borderRadius: 13,
            backgroundColor: COLORS.cardBackground,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.primaryText,
          }}
        >
          <FiChevronLeft size={21} aria-hidden="true" />
        </button>
        <div className="text-center">
          <p className="font-bold text-road-gray-500" style={{ fontSize: 11 }}>
            Student Response
          </p>
          <p className="font-black text-road-gray-900" style={{ fontSize: 14 }}>
            {currentQ + 1} / {totalQ}
          </p>
        </div>
        <div
          className="flex items-center justify-center font-black"
          style={{
            minWidth: 38,
            height: 38,
            borderRadius: 13,
            backgroundColor: '#E8F6F1',
            color: COLORS.primaryGreen,
            fontSize: 13,
          }}
        >
          {score}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;
  return (
    <div style={{ padding: '12px 16px 0' }}>
      <div
        style={{
          width: '100%',
          height: 7,
          backgroundColor: COLORS.progressTrack,
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{ height: '100%', backgroundColor: COLORS.primaryGreen, borderRadius: 999 }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function ImageAnswerOption({ option, isSelected, isCorrect, showFeedback, onSelect }) {
  let borderColor = COLORS.border;
  let bgColor = COLORS.cardBackground;
  let status = null;

  if (showFeedback && isCorrect) {
    borderColor = '#22C55E';
    bgColor = '#EFFDF4';
    status = 'Correct';
  } else if (showFeedback && isSelected && !isCorrect) {
    borderColor = '#EF4444';
    bgColor = '#FEF2F2';
    status = 'Try again';
  } else if (isSelected) {
    borderColor = COLORS.primaryGreen;
    bgColor = '#E8F6F1';
  }

  return (
    <motion.button
      variants={cardVariants}
      type="button"
      onClick={() => onSelect(option.id)}
      className="flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147A4F]"
      style={{ flex: '1 1 0', minWidth: 0 }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1.18',
          borderRadius: 16,
          borderWidth: 3,
          borderStyle: 'solid',
          borderColor,
          backgroundColor: bgColor,
          overflow: 'hidden',
          boxShadow: '0 8px 18px rgba(31, 41, 55, 0.08)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          position: 'relative',
        }}
      >
        <img
          src={option.image}
          alt={option.accessibility}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          className="absolute left-2 top-2 flex items-center justify-center font-black"
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            color: COLORS.primaryText,
            fontSize: 13,
            boxShadow: '0 4px 10px rgba(31,41,55,0.14)',
          }}
        >
          {option.label}
        </div>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-2 right-2 bottom-2 text-center font-black"
            style={{
              borderRadius: 12,
              padding: '7px 6px',
              backgroundColor: isCorrect ? '#22C55E' : '#EF4444',
              color: '#FFFFFF',
              fontSize: 11,
            }}
          >
            {status}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

function QuizResults({ score, total, responses, onRetake, onHome }) {
  const percent = Math.round((score / total) * 100);
  const needsReview = responses.filter((response) => !response.correct);

  return (
    <div
      className="min-h-dvh overflow-y-auto"
      style={{
        backgroundColor: COLORS.background,
        padding: 'max(env(safe-area-inset-top, 0px) + 24px, 34px) 20px max(env(safe-area-inset-bottom, 0px) + 24px, 34px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="text-center"
        style={{
          borderRadius: 24,
          backgroundColor: COLORS.cardBackground,
          padding: 22,
          boxShadow: '0 16px 34px rgba(31, 41, 55, 0.10)',
        }}
      >
        <FiCheckCircle className="mx-auto mb-3" size={48} color={COLORS.primaryGreen} aria-hidden="true" />
        <p className="font-bold text-road-gray-500" style={{ fontSize: 12 }}>
          Response Saved
        </p>
        <h1 className="font-black text-road-gray-900" style={{ fontSize: 34, lineHeight: 1 }}>
          {score}/{total}
        </h1>
        <p className="text-road-gray-500 mt-2" style={{ fontSize: 13 }}>
          Teacher data collected: {percent}% correct
        </p>

        {needsReview.length > 0 && (
          <div className="mt-5 text-left">
            <p className="font-black text-road-gray-800 mb-2" style={{ fontSize: 13 }}>
              Review these topics
            </p>
            <div className="flex flex-wrap gap-2">
              {needsReview.map((response) => (
                <span
                  key={response.questionId}
                  className="font-bold"
                  style={{
                    borderRadius: 999,
                    backgroundColor: '#FEF2F2',
                    color: '#B91C1C',
                    padding: '7px 10px',
                    fontSize: 11,
                  }}
                >
                  {response.topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onRetake}
            className="flex items-center justify-center gap-2 font-bold"
            style={{
              height: 48,
              borderRadius: 15,
              backgroundColor: '#E8F6F1',
              color: COLORS.primaryGreen,
              fontSize: 13,
            }}
          >
            <FiRefreshCw size={16} aria-hidden="true" />
            Retake
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex items-center justify-center gap-2 font-bold"
            style={{
              height: 48,
              borderRadius: 15,
              backgroundColor: COLORS.primaryGreen,
              color: '#FFFFFF',
              fontSize: 13,
            }}
          >
            <FiHome size={16} aria-hidden="true" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuizScreen({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = QUESTIONS[currentQ];
  const totalQ = QUESTIONS.length;
  const isLast = currentQ === totalQ - 1;

  const responses = useMemo(() => {
    return QUESTIONS.map((item, index) => {
      const selected = answers[index]?.selected ?? null;
      const selectedOption = item.options.find((option) => option.id === selected);
      const correctOption = item.options.find((option) => option.correct);

      return {
        questionId: item.id,
        topic: item.topic,
        question: item.question,
        selectedOptionId: selected,
        correctOptionId: correctOption?.id,
        correct: Boolean(selectedOption?.correct),
      };
    }).filter((response) => response.selectedOptionId);
  }, [answers]);

  const score = useMemo(() => {
    return responses.filter((response) => response.correct).length;
  }, [responses]);

  useEffect(() => {
    if (!finished) return;

    const saved = JSON.parse(localStorage.getItem('studentQuizResponses') || '[]');
    localStorage.setItem(
      'studentQuizResponses',
      JSON.stringify([
        ...saved,
        {
          id: `response-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          score,
          total: totalQ,
          responses,
        },
      ]),
    );
  }, [finished, responses, score, totalQ]);

  const advanceQuestion = useCallback(() => {
    if (isLast) {
      setFinished(true);
      return;
    }

    setDirection(1);
    setCurrentQ((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [isLast]);

  const handleSelect = useCallback((optionId) => {
    if (showFeedback || answers[currentQ] !== undefined) return;

    const selectedOption = question.options.find((option) => option.id === optionId);

    setSelectedAnswer(optionId);
    setShowFeedback(true);
    setAnswers((prev) => ({
      ...prev,
      [currentQ]: {
        questionId: question.id,
        selected: optionId,
        correct: Boolean(selectedOption?.correct),
      },
    }));

    window.setTimeout(advanceQuestion, 950);
  }, [advanceQuestion, answers, currentQ, question, showFeedback]);

  const handleBack = useCallback(() => {
    if (currentQ === 0) {
      onComplete();
      return;
    }

    setDirection(-1);
    setCurrentQ((prev) => prev - 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [currentQ, onComplete]);

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
        responses={responses}
        onRetake={handleRetake}
        onHome={onComplete}
      />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: COLORS.background }}>
      <TopBar currentQ={currentQ} totalQ={totalQ} score={score} onBack={handleBack} />
      <ProgressBar current={currentQ} total={totalQ} />

      <div className="px-4 pt-5">
        <p className="font-black text-road-green-dark mb-2" style={{ fontSize: 12 }}>
          {question.topic}
        </p>
        <h1 className="font-black text-road-gray-900" style={{ fontSize: 24, lineHeight: 1.18 }}>
          {question.question}
        </h1>
        <p className="text-road-gray-500 mt-2" style={{ fontSize: 13 }}>
          Tap one picture. Your answer will be saved for your teacher.
        </p>
      </div>

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
            <motion.div
              className="flex flex-row"
              style={{ padding: '20px 14px 0', gap: 10 }}
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
