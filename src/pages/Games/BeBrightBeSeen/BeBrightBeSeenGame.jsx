import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CHARACTERS, BG_DAY, BG_NIGHT, drawSceneFallback } from "./gameData";
import { useImagePreloader } from "./useImagePreloader";
import { useGameLoop } from "./useGameLoop";
import StartScreen from "./StartScreen";
import QuestionModal from "./QuestionModal";
import EndScreen from "./EndScreen";
import "./styles.css";

function calcCanvasSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export default function BeBrightBeSeenGame({ onNavChange }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Hide bottom nav
  useEffect(() => {
    if (onNavChange) onNavChange(false);
    return () => { if (onNavChange) onNavChange(true); };
  }, [onNavChange]);

  // Preload all images: backgrounds + 4 characters
  const imageSrcs = useMemo(
    () => [
      BG_DAY,
      BG_NIGHT,
      ...CHARACTERS.map((c) => c.image),
    ],
    []
  );
  const { images, loading, progress } = useImagePreloader(imageSrcs);

  const bgDayImg = images[BG_DAY] || null;
  const bgNightImg = images[BG_NIGHT] || null;

  // Responsive canvas
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 375 });

  useEffect(() => {
    const update = () => setCanvasSize(calcCanvasSize());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Set canvas resolution for retina
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    // Draw initial scene
    if (bgDayImg) {
      ctx.drawImage(bgDayImg, 0, 0, canvasSize.width, canvasSize.height);
    } else {
      drawSceneFallback(ctx, canvasSize.width, canvasSize.height, false, 0);
    }
  }, [canvasSize, bgDayImg]);

  // Game state
  const [gameState, setGameState] = useState("start");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);
  const charStartedRef = useRef(false);

  // Game loop
  const {
    setBackgroundImages,
    startCharacter,
    continueWalking,
    setNightTransition,
    setOnStop,
    setOnExit,
    reset,
  } = useGameLoop(canvasRef, canvasSize);

  // Pass background images to game loop once loaded
  useEffect(() => {
    setBackgroundImages(bgDayImg, bgNightImg);
  }, [bgDayImg, bgNightImg, setBackgroundImages]);

  const startCharByIndex = useCallback(
    (index) => {
      const char = CHARACTERS[index];
      const img = images[char.image] || null;
      startCharacter(img, char.silhouetteColor);
      charStartedRef.current = true;
    },
    [images, startCharacter]
  );

  const handleCharacterStop = useCallback(() => {
    setGameState("paused");
  }, []);

  const handleCharacterExit = useCallback(() => {
    const nextIndex = currentCharIndex + 1;
    if (nextIndex >= CHARACTERS.length) {
      setGameState("end");
    } else {
      if (nextIndex === 2 && CHARACTERS[nextIndex].background === "night") {
        setNightTransition();
      }
      setCurrentCharIndex(nextIndex);
      charStartedRef.current = false;
      setGameState("playing");
    }
  }, [currentCharIndex, setNightTransition]);

  useEffect(() => {
    setOnStop(handleCharacterStop);
    setOnExit(handleCharacterExit);
  }, [handleCharacterStop, handleCharacterExit, setOnStop, setOnExit]);

  useEffect(() => {
    if (gameState !== "playing" || charStartedRef.current) return;
    startCharByIndex(currentCharIndex);
  }, [gameState, currentCharIndex, startCharByIndex]);

  const handleStart = useCallback(() => {
    reset();
    setCurrentCharIndex(0);
    setScore(0);
    setAnswers([]);
    charStartedRef.current = false;
    setGameState("playing");
  }, [reset]);

  const handleAnswer = useCallback(
    (answer) => {
      const char = CHARACTERS[currentCharIndex];
      const correct = answer === char.correctAnswer;
      if (correct) setScore((s) => s + 1);
      setAnswers((a) => [...a, correct]);
      setFeedbackText(correct ? char.feedbackCorrect : char.feedbackWrong);
      setFeedbackIsCorrect(correct);
      setGameState("feedback");

      setTimeout(() => {
        continueWalking();
        setGameState("playing");
      }, 2000);
    },
    [currentCharIndex, continueWalking]
  );

  const handlePlayAgain = useCallback(() => {
    reset();
    setCurrentCharIndex(0);
    setScore(0);
    setAnswers([]);
    charStartedRef.current = false;
    setGameState("start");
  }, [reset]);

  const handleBack = useCallback(() => {
    navigate("/simulator");
  }, [navigate]);

  return (
    <div className="be-bright-game-container">
      {/* Layer 1: Canvas — road scene + characters */}
      <div className="be-bright-canvas-wrapper">
        <canvas ref={canvasRef} className="be-bright-canvas" />
      </div>

      {/* Overlays */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p className="loading-text">ပုံများ ခေါ်နေသည်... {progress}%</p>
        </div>
      )}

      {!loading && gameState === "start" && (
        <StartScreen onStart={handleStart} />
      )}

      {gameState === "paused" && (
        <QuestionModal
          question={CHARACTERS[currentCharIndex].question}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === "feedback" && (
        <QuestionModal
          question=""
          onAnswer={() => {}}
          feedback={feedbackText}
          isCorrect={feedbackIsCorrect}
        />
      )}

      {gameState === "end" && (
        <EndScreen
          score={score}
          answers={answers}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
