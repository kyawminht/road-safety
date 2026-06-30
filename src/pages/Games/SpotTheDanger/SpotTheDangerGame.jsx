import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSpotDanger } from "./useSpotDanger";
import { HAZARDS } from "./spotDangerData";
import "./spotDanger.css";

export default function SpotTheDangerGame({ onNavChange }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [gameState, setGameState] = useState("start"); // start | playing | done
  const [wrongTaps, setWrongTaps] = useState(0);
  const [foundList, setFoundList] = useState([]);
  const foundRef = useRef([]); // track already-found types to avoid dupe animation

  // Hide bottom nav
  useEffect(() => {
    if (onNavChange) onNavChange(false);
    return () => { if (onNavChange) onNavChange(true); };
  }, [onNavChange]);

  // Responsive canvas — use actual wrapper size so logical coords match displayed pixels
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCanvasSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(wrapper);
      return () => ro.disconnect();
    } else {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, []);

  // Canvas setup (retina)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  }, [canvasSize]);

  const { init, handleTap, reset } = useSpotDanger(canvasRef, canvasSize);

  // Start game
  const handleStart = useCallback(() => {
    reset();
    setWrongTaps(0);
    setFoundList([]);
    foundRef.current = [];
    setGameState("playing");
    requestAnimationFrame(() => init());
  }, [reset, init]);

  // Done — show result
  const finishGame = useCallback((list) => {
    setFoundList(list);
    setGameState("done");
  }, []);

  // Canvas click/tap
  const handleCanvasClick = useCallback(
    (e) => {
      if (gameState !== "playing") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize.width / rect.width;
      const scaleY = canvasSize.height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;
      const result = handleTap(px, py);

      if (result && result.correct && result.type) {
        const already = foundRef.current.includes(result.type);
        if (!already) {
          foundRef.current.push(result.type);
          const updated = [...foundRef.current];
          // Small delay to see the checkmark appear on canvas
          setTimeout(() => {
            if (updated.length >= 3) {
              finishGame(updated);
            }
          }, 400);
        }
      } else if (result && !result.correct) {
        setWrongTaps((w) => w + 1);
      }
    },
    [gameState, canvasSize, handleTap, finishGame]
  );

  const handlePlayAgain = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleBack = useCallback(() => {
    navigate("/simulator");
  }, [navigate]);

  const score = Math.max(0, 3 - wrongTaps); // max 3 pts = no wrong taps

  return (
    <div className="spot-danger-container">
      <div ref={wrapperRef} className="spot-danger-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="spot-danger-canvas"
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const t = e.touches[0];
              handleCanvasClick({ clientX: t.clientX, clientY: t.clientY });
            }
          }}
        />
      </div>

      {/* Start overlay */}
      {gameState === "start" && (
        <motion.div
          className="spot-danger-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            အန္တရာယ်ကိုရှာပါ
          </motion.h1>
          <motion.div
            className="spot-danger-subtitle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            Spot the Danger
          </motion.div>
          <motion.p
            className="spot-danger-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            လမ်းပေါ်က အန္တရာယ် ၃ ခုကို နှိပ်ပြီး ရှာဖွေပါ!
          </motion.p>
          <motion.div
            className="spot-danger-hints"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {HAZARDS.map((h) => (
              <span key={h.id}>
                {h.emoji} {h.labelEn}
              </span>
            ))}
          </motion.div>
          <motion.button
            className="spot-danger-start-btn"
            onClick={handleStart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            whileTap={{ scale: 0.95 }}
          >
            ▶ ကစားမည်
          </motion.button>
        </motion.div>
      )}

      {/* Done overlay */}
      {gameState === "done" && (
        <motion.div
          className="spot-danger-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {score >= 3 ? "🎉 အံ့မခန်း!" : "✅ တွေ့ပြီ!"}
          </motion.h1>
          <motion.div
            className="spot-danger-final-score"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Score: {score}/3
          </motion.div>
          <motion.p
            className="spot-danger-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {score >= 3
              ? "အန္တရာယ်အားလုံး တစ်ခါတည်းရှာတွေ့ပါတယ်!"
              : `မှားတာ ${wrongTaps} ခါရှိပါတယ်။ နောက်တစ်ခေါက် သေချာကြည့်ပါ!`}
          </motion.p>
          <motion.div
            className="spot-danger-end-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="spot-danger-start-btn"
              onClick={handlePlayAgain}
              whileTap={{ scale: 0.95 }}
            >
              🔄 ထပ်ကစားမည်
            </motion.button>
            <motion.button
              className="spot-danger-back-btn"
              onClick={handleBack}
              whileTap={{ scale: 0.95 }}
            >
              ← နောက်သို့
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
