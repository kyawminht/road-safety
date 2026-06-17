import { useState, useEffect, useRef } from 'react';
import { TIMING } from '../data/modules.js';

/**
 * @param {boolean} isActive - Whether this card should be playing
 * @param {function} onComplete - Called when all phases finish
 * @returns {{ phase: 'wrong-run'|'lesson'|'right-run'|'confetti'|'done'|'waiting' }}
 */
export function useAutoPlay(isActive, onComplete) {
  const [phase, setPhase] = useState('waiting');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setPhase('waiting');
      return;
    }

    const phases = [
      { name: 'wrong-run', duration: TIMING.wrongRun },
      { name: 'lesson', duration: TIMING.lesson },
      { name: 'right-run', duration: TIMING.rightRun },
      { name: 'confetti', duration: TIMING.confetti },
    ];

    let currentIdx = 0;

    const advance = () => {
      if (currentIdx < phases.length) {
        setPhase(phases[currentIdx].name);
        timerRef.current = setTimeout(() => {
          currentIdx++;
          advance();
        }, phases[currentIdx]?.duration || 0);
      } else {
        setPhase('done');
        onComplete?.();
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
