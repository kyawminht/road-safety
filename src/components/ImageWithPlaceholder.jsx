import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageWithPlaceholder({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  fetchPriority = 'auto',
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full" style={style}>
      {/* Skeleton placeholder */}
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <span className="text-white/20 text-3xl">📷</span>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
      />
    </div>
  );
}
