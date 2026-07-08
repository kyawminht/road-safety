import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSounds } from "../BeBrightBeSeen/useSounds";
import { SCENARIOS } from "./pedestrianFirstData";
import "./styles.css";

// ── Frame image ──
const FRAME_SCENE = "/images/games/frame2.png";
const POLICE_SCENE = "/images/games/police.png";
const IMG_W = 1672;
const IMG_H = 941;

// ── Character images ──
const CHAR_IMAGES = {
  pedestrian: "/images/games/char-girl-bright.png",
  oldman: "/images/games/char-oldman-bright.png",
};

/**
 * Contain rect — same math as BeBrightBeSeen background scaling.
 * Works for any screen size: the image always fits fully inside the viewport.
 */
function getContainRect(cw, ch) {
  const scale = Math.min(cw / IMG_W, ch / IMG_H);
  return {
    w: IMG_W * scale,
    h: IMG_H * scale,
    left: (cw - IMG_W * scale) / 2,
    top: (ch - IMG_H * scale) / 2,
    scale,
  };
}

export default function PedestrianFirstGame({ onNavChange }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("start"); // start | walking | question | feedback | done
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);

  // Contain rect (updated on resize)
  const [rect, setRect] = useState(() => getContainRect(window.innerWidth, window.innerHeight));

  // Character pixel position (computed each frame via rAF, like BeBrightBeSeen)
  const [charPos, setCharPos] = useState({ x: 0, y: 0, w: 45, h: 90 });
  const [showChar, setShowChar] = useState(false);
  const [showPolice, setShowPolice] = useState(false);

  const startTimeRef = useRef(0);
  const walkRafRef = useRef(null);

  const { playCorrect, playWrong, playIntro, playPoliceSiren } = useSounds();

  // ── Resize ──
  useEffect(() => {
    const update = () => setRect(getContainRect(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Hide bottom nav ──
  useEffect(() => {
    if (onNavChange) onNavChange(false);
    return () => { if (onNavChange) onNavChange(true); };
  }, [onNavChange]);

  // ── Walk animation (BeBrightBeSeen style: viewport-fraction based) ──
  const startWalking = useCallback(() => {
    setShowChar(true);
    setShowPolice(false);
    startTimeRef.current = performance.now();

    const scenario = SCENARIOS[currentScenario];
    const walkDuration = 2200;

    // Like BeBrightBeSeen: char size = min(18% of wrapper width, 90px)
    // and character height = 2 × width (~2:1 aspect)
    const charW = Math.min(rect.w * 0.14, 80);
    const charH = charW * 2;

    // Walk area is 10%–90% of the wrapper width (like BeBrightBeSeen)
    const walkLeft = rect.left + rect.w * 0.08;
    const walkRight = rect.left + rect.w * 0.92;

    // Ground — feet at 70% of viewport (road surface Y)
    const groundY = window.innerHeight * 0.55;

    const walk = (ts) => {
      const elapsed = ts - startTimeRef.current;
      const raw = Math.min(elapsed / walkDuration, 1.0);

      // easeOutCubic for smooth deceleration at stop
      const t = 1 - Math.pow(1 - raw, 3);

      // All characters walk left → right
      const centerX = rect.left + rect.w * 0.50;
      const px = walkLeft + t * (centerX - walkLeft);

      // Character bottom at groundY
      const py = groundY - charH;
      setCharPos({ x: px, y: py, w: charW, h: charH });

      if (raw >= 1.0) {
        setGameState("question");
        return;
      }
      walkRafRef.current = requestAnimationFrame(walk);
    };

    // Initial position — always start from left
    const initX = walkLeft;
    const initY = groundY - charH;
    setCharPos({ x: initX, y: initY, w: charW, h: charH });

    walkRafRef.current = requestAnimationFrame(walk);
  }, [currentScenario, rect]);

  // ── Trigger walk ──
  useEffect(() => {
    if (gameState === "walking") {
      startWalking();
    }
    return () => {
      if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    };
  }, [gameState, startWalking]);

  // ── Handlers ──
  const handleStart = useCallback(() => {
    setCurrentScenario(0);
    setScore(0);
    setAnswers([]);
    setShowChar(false);
    setShowPolice(false);
    setGameState("walking");
  }, []);

  const handleAnswer = useCallback(
    (answer) => {
      const scenario = SCENARIOS[currentScenario];
      const correct = answer === scenario.correctAnswer;

      if (correct) {
        setScore((s) => s + 1);
        playCorrect();
        setShowPolice(false);
      } else {
        playWrong();
        playPoliceSiren();
        if (scenario.id === "zebra") setShowPolice(true);
      }

      setAnswers((a) => [...a, correct]);
      setFeedbackText(correct ? scenario.feedbackCorrect : scenario.feedbackWrong);
      setFeedbackIsCorrect(correct);
      setGameState("feedback");
    },
    [currentScenario, playCorrect, playWrong]
  );

  // Tap feedback to continue
  const handleFeedbackTap = useCallback(() => {
    const next = currentScenario + 1;
    if (next >= SCENARIOS.length) {
      setGameState("done");
    } else {
      setCurrentScenario(next);
      setGameState("walking");
    }
  }, [currentScenario]);

  const handlePlayAgain = useCallback(() => {
    setCurrentScenario(0);
    setScore(0);
    setAnswers([]);
    setShowChar(false);
    setShowPolice(false);
    setGameState("start");
  }, []);

  const handleBack = useCallback(() => navigate("/simulator"), [navigate]);

  useEffect(() => {
    if (gameState === "start") playIntro();
  }, [gameState, playIntro]);

  // ── Derived ──
  const scenario = SCENARIOS[currentScenario];
  const charImage = scenario.drawMode === "oldman" ? CHAR_IMAGES.oldman : CHAR_IMAGES.pedestrian;
  const showScene = gameState !== "start";
  // Show police catching scene instead of regular scene
  const showPoliceScene = showPolice && gameState === "feedback";
  // Hide pedestrian character when police scene is showing
  const showCharacter =
    showChar &&
    (gameState === "walking" || gameState === "question" || gameState === "feedback") &&
    !showPoliceScene;

  return (
    <div className="pedestrian-first-container">
      {/* ── Letterbox fill ── */}
      {showScene && (
        <>
          {/* Background — frame2, crossfades to police scene when caught */}
          <div
            style={{
              position: "absolute",
              left: rect.left,
              top: rect.top,
              width: rect.w,
              height: rect.h,
              zIndex: 1,
            }}
          >
            {/* Frame2 (always present, fades out when police scene appears) */}
            <motion.img
              src={FRAME_SCENE}
              alt=""
              className="pf-scene-image"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              animate={{ opacity: showPoliceScene ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Police catching scene (fades in on top of frame2) */}
            <AnimatePresence>
              {showPoliceScene && (
                <motion.img
                  src={POLICE_SCENE}
                  alt=""
                  className="pf-scene-image"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── Character ── */}
          {showCharacter && (
            <img
              src={charImage}
              alt=""
              className="pf-char-image"
              style={{
                position: "absolute",
                left: charPos.x,
                top: charPos.y,
                width: charPos.w,
                height: charPos.h,
                zIndex: 5,
              }}
            />
          )}
        </>
      )}

      {/* ── Overlays ── */}

      {gameState === "start" && (
        <motion.div className="pf-overlay pf-overlay-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            လမ်းကူးသူကို ဦးစားပေးပါ
          </motion.h1>
          <motion.div className="pf-subtitle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            🚗 Pedestrian First
          </motion.div>
          <motion.p className="pf-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            သင်သည် ကားမောင်းသူ တစ်ဦးဖြစ်ပါသည်။
            လူသွားသူများ လမ်းဖြတ်ကူးတိုင်း သင်မည်သို့ ပြုမူမည်နည်း?
          </motion.p>
          <motion.button className="pf-btn pf-btn-primary" onClick={handleStart} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} whileTap={{ scale: 0.95 }}>
            ▶ ကစားမည်
          </motion.button>
        </motion.div>
      )}

      {gameState === "question" && (
        <div className="pf-modal-backdrop">
          <motion.div className="pf-modal-card" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div className="pf-modal-quiz-icon">{scenario.emoji}</div>
            <div className="pf-question-badge">Quiz</div>
            <p className="pf-question-text">{scenario.question}</p>
            <div className="pf-btn-group">
              <motion.button className="pf-answer-btn pf-btn-yes" onClick={() => handleAnswer("yes")} whileTap={{ scale: 0.93 }}>Yes</motion.button>
              <motion.button className="pf-answer-btn pf-btn-no" onClick={() => handleAnswer("no")} whileTap={{ scale: 0.93 }}>No</motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {gameState === "feedback" && (
        <div className="pf-modal-backdrop">
          <motion.div
            className={`pf-feedback-card ${feedbackIsCorrect ? "correct" : "wrong"}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={handleFeedbackTap}
          >
            <div className="pf-feedback-icon">{feedbackIsCorrect ? "✓" : "✕"}</div>
            <p className="pf-feedback-text">{feedbackText}</p>
            <p className="pf-feedback-tap-hint">နှိပ်ပါ ဆက်ရန်</p>
          </motion.div>
        </div>
      )}

      {gameState === "done" && (
        <motion.div className="pf-overlay pf-overlay-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            {score >= SCENARIOS.length ? "🎉 ကောင်းလိုက်တာ! 🎉" : "🏁 ပြီးဆုံးပါပြီ"}
          </motion.h1>
          <motion.div className="pf-score" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            {score}/{SCENARIOS.length}
          </motion.div>
          <motion.div className="pf-scenario-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            {SCENARIOS.map((s, i) => (
              <div key={s.id} className={`pf-summary-item ${answers[i] ? "correct" : "wrong"}`}>
                <span className="pf-summary-emoji">{s.emoji}</span>
                <span className="pf-summary-label">{s.title}</span>
                <span className="pf-summary-mark">{answers[i] ? "✓" : "✕"}</span>
              </div>
            ))}
          </motion.div>
          <motion.p className="pf-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {score >= SCENARIOS.length
              ? "လမ်းကူးသူတွေကို အမြဲတမ်း ဦးစားပေးပါ။ သင်က စံပြ ကားမောင်းသူ တစ်ဦးပါ!"
              : "လမ်းကူးသူတွေကို ဦးစားပေးဖို့ မမေ့ပါနဲ့။ နောက်တစ်ခေါက် ထပ်ကစားကြည့်ပါ!"}
          </motion.p>
          <motion.div className="pf-end-btn-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <motion.button className="pf-btn pf-btn-primary" onClick={handlePlayAgain} whileTap={{ scale: 0.95 }}>🔄 ထပ်ကစားမည်</motion.button>
            <motion.button className="pf-btn pf-btn-secondary" onClick={handleBack} whileTap={{ scale: 0.95 }}>← နောက်သို့</motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
