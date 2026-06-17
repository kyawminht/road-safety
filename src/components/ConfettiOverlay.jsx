import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function ConfettiOverlay({ active, duration = 2000 }) {
  const [show, setShow] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (active) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [active, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={150}
        recycle={false}
        colors={['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6']}
        gravity={0.15}
        initialVelocityY={-10}
        tweenDuration={100}
      />
    </div>
  );
}
