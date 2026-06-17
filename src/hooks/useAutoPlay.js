import { useState, useEffect, useRef } from 'react';
import { TIMING } from '../data/modules.js';

/**
 * @param {boolean} isActive - Whether this card should be playing
 * @param {function} onComplete - Called when all phases finish
 * @returns {{ phase: 'wrong-run'|'lesson'|'right-run'|'confetti'|'done'|'waiting' }}
 */
const PHASES = [
  { name: 'wrong-run', duration: TIMING.wrongRun },
  { name: 'lesson', duration: TIMING.lesson },
  { name: 'right-run', duration: TIMING.rightRun },
  { name: 'confetti', duration: TIMING.confetti },
];

export function useAutoPlay(isActive, onComplete) {
  const [phase, setPhase] = useState('waiting');
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isActive) {
      setPhase('waiting');
      return;
    }

    let currentIdx = 0;

    const advance = () => {
      if (currentIdx < PHASES.length) {
        setPhase(PHASES[currentIdx].name);
        timerRef.current = setTimeout(() => {
          currentIdx++;
          advance();
        }, PHASES[currentIdx].duration);
      } else {
        setPhase('done');
        onCompleteRef.current?.();
      }
    };

    advance();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  return { phase };
}
