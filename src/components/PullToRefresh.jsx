import { useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);
  const controls = useAnimation();

  const THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = useCallback((e) => {
    if (refreshing) return;
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    setPulling(true);
  }, [refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling || refreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      // Apply resistance
      const distance = Math.min(diff * 0.5, MAX_PULL);
      setPullDistance(distance);
    }
  }, [pulling, refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(40);

      try {
        await onRefresh();
      } catch (e) {
        // Silently handle refresh errors
      }

      setRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
  }, [pulling, pullDistance, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="flex items-center justify-center overflow-hidden"
        animate={{
          height: pullDistance > 0 ? pullDistance : refreshing ? 40 : 0,
          opacity: pullDistance > 0 || refreshing ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{ rotate: refreshing ? 360 : progress * 180 }}
          transition={{ duration: refreshing ? 1 : 0, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
        >
          <span className="text-xl">
            {refreshing ? '🔄' : progress >= 1 ? '✅' : '↓'}
          </span>
          <span className="text-xs text-white/50 font-medium">
            {refreshing ? 'ဖတ်နေတယ်...' : progress >= 1 ? 'လွှတ်ပါ' : 'ဆွဲဆွဲပါ'}
          </span>
        </motion.div>
      </motion.div>

      {children}
    </div>
  );
}
