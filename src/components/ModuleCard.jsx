import { useAutoPlay } from '../hooks/useAutoPlay.js';
import SimulationCanvas from './SimulationCanvas.jsx';
import LessonOverlay from './LessonOverlay.jsx';
import ConfettiOverlay from './ConfettiOverlay.jsx';
import { TIMING } from '../data/modules.js';

export default function ModuleCard({ module, isActive, onComplete }) {
  const { phase } = useAutoPlay(isActive, onComplete);

  const isWrongRun = phase === 'wrong-run';
  const isRightRun = phase === 'right-run';
  const isLesson = phase === 'lesson';
  const isConfetti = phase === 'confetti';
  const isDone = phase === 'done';

  const canvasMode = isWrongRun ? 'wrong' : isRightRun ? 'right' : null;
  const canvasDuration = isWrongRun ? TIMING.wrongRun : TIMING.rightRun;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0 w-full"
      style={{
        minHeight: '480px',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Header */}
      <div className="bg-primary px-5 py-3 flex items-center gap-3">
        <span className="text-3xl">{module.emoji}</span>
        <h2 className="text-lg font-bold text-white leading-snug">
          {module.title}
        </h2>
        {isDone && (
          <span className="ml-auto text-success text-xl">✅</span>
        )}
      </div>

      {/* Canvas area */}
      <div className="relative" style={{ height: '380px' }}>
        <SimulationCanvas
          moduleConfig={module.canvas}
          mode={canvasMode}
          duration={canvasDuration}
        />
        <LessonOverlay
          visible={isLesson}
          emoji={module.emoji}
          lessonText={module.lessonText}
        />
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
        {isWrongRun && (
          <span className="text-sm text-danger font-bold">❌ မှားယွင်းနေပါသည်</span>
        )}
        {isLesson && (
          <span className="text-sm text-warning font-bold">📋 သင်ခန်းစာ</span>
        )}
        {isRightRun && (
          <span className="text-sm text-success font-bold">✅ မှန်ကန်သောနည်းလမ်း</span>
        )}
        {isConfetti && (
          <span className="text-sm text-success font-bold">🎉 ပြီးမြောက်ပါပြီ</span>
        )}
        {isDone && (
          <span className="text-sm text-primary font-bold">✔️ ပြီးဆုံး</span>
        )}
      </div>

      <ConfettiOverlay active={isConfetti} duration={TIMING.confetti} />
    </div>
  );
}
