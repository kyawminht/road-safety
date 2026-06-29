import { motion } from "framer-motion";
import { CHARACTERS } from "./gameData";

export default function EndScreen({ score, answers, onPlayAgain, onBack }) {
  const total = CHARACTERS.length;
  const perfect = score === total;

  return (
    <div className="end-screen-overlay">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {perfect ? "🎉 အံ့မခန်း! 🎉" : "🏁 ပြီးဆုံးပါပြီ 🏁"}
      </motion.h2>

      <motion.div
        className="score-text"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {score}/{total}
      </motion.div>

      <motion.div
        className="char-thumbnails"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {CHARACTERS.map((char, i) => (
          <div
            key={char.id}
            className={`char-thumb ${answers[i] === false ? "wrong-answer" : ""}`}
          >
            <img src={char.image} alt={char.name} />
          </div>
        ))}
      </motion.div>

      <motion.p
        className="summary-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {perfect
          ? "အရောင်တောက်တဲ့အင်္ကျီ ဝတ်ခြင်းဖြင့် လမ်းပေါ်မှာ လုံခြုံစွာ သွားလာနိုင်ပါတယ်!"
          : "အရောင်တောက်တဲ့အင်္ကျီ ဝတ်ခြင်းဖြင့် ကားမောင်းသူက သင့်ကို ပိုမြင်ရပြီး လမ်းအန္တရာယ် လျော့ကျစေပါတယ်။ အမြဲတမ်း အရောင်တောက်တဲ့အင်္ကျီ ဝတ်ပါ!"}
      </motion.p>

      <motion.div
        className="end-btn-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button className="end-btn end-btn-primary" onClick={onPlayAgain}>
          🔄 ထပ်ကစားမည်
        </button>
        <button className="end-btn end-btn-secondary" onClick={onBack}>
          ← နောက်သို့
        </button>
      </motion.div>
    </div>
  );
}
