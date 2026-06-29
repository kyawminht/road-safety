import { motion } from "framer-motion";
import { useEffect } from "react";

export default function StartScreen({ onStart, onIntro }) {
  useEffect(() => {
    if (onIntro) onIntro();
  }, [onIntro]);

  return (
    <div className="start-screen-overlay">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ကားလမ်းအနီးမှာ ဘာလို့{"\n"}
        အရောင်တောက်တဲ့အင်္ကျီ ဝတ်သင့်သလဲ?
      </motion.h1>

      <motion.div
        className="subtitle"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        ✨ Be Bright Be Seen ✨
      </motion.div>

      <motion.button
        className="play-btn"
        onClick={onStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileTap={{ scale: 0.95 }}
        aria-label="ကစားမည်"
      >
        ▶ ကစားမည်
      </motion.button>
    </div>
  );
}
