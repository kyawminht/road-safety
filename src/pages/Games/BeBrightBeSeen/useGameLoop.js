import { useRef, useCallback, useEffect } from "react";
import {
  drawSceneFallback,
  drawCharacterImg,
  drawCharacterSilhouette,
} from "./gameData";

const CHAR_SPEED = 0.14; // fraction of canvas width per second
const STOP_X_RATIO = 0.5; // stop at center of road

export function useGameLoop(canvasRef, canvasSize) {
  const animRef = useRef(null);
  const stateRef = useRef({
    // Character animation
    charX: 0,
    charWalking: false,
    charStopped: false,
    charVisible: false,
    charExiting: false,

    // Background
    background: "day",
    nightProgress: 0,

    // Current character data
    charImage: null,
    charSilhouetteColor: "#333",

    // Background images (injected from outside)
    bgDay: null,
    bgNight: null,

    // Callbacks
    onStop: null,
    onExit: null,
    onWalkStart: null,
    onWalkStop: null,

    // Canvas dimensions
    width: 0,
    height: 0,
  });

  useEffect(() => {
    stateRef.current.width = canvasSize.width;
    stateRef.current.height = canvasSize.height;
  }, [canvasSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;
    const w = s.width;
    const h = s.height;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // Draw background — full generated image on all screen sizes
    if (s.background === "day" && s.nightProgress === 0) {
      if (s.bgDay) {
        ctx.drawImage(s.bgDay, 0, 0, w, h);
      } else {
        drawSceneFallback(ctx, w, h, false, 0);
      }
    } else if (s.background === "night" && s.nightProgress >= 1) {
      if (s.bgNight) {
        ctx.drawImage(s.bgNight, 0, 0, w, h);
      } else {
        drawSceneFallback(ctx, w, h, true, 1);
      }
    } else {
      const np = s.nightProgress;
      if (s.bgDay && s.bgNight) {
        ctx.drawImage(s.bgDay, 0, 0, w, h);
        ctx.globalAlpha = np;
        ctx.drawImage(s.bgNight, 0, 0, w, h);
        ctx.globalAlpha = 1;
      } else {
        drawSceneFallback(ctx, w, h, np >= 0.5, np);
      }
    }

    // Draw character on the road
    if (s.charVisible) {
      const charW = Math.min(w * 0.18, 90);
      const charH = charW * 2;
      // Character feet at ROAD_BOTTOM (72%) — on the zebra crossing
      const groundY = h * 0.72;
      const walkAreaRight = w * 0.9;
      const walkAreaLeft = w * 0.1;
      const charXPos = walkAreaLeft + s.charX * (walkAreaRight - walkAreaLeft);

      if (s.charImage) {
        drawCharacterImg(ctx, s.charImage, charXPos, groundY, charW, charH);
      } else {
        drawCharacterSilhouette(ctx, charXPos, groundY, charW, charH, s.charSilhouetteColor);
      }
    }
  }, [canvasRef]);

  const tick = useCallback(
    () => {
      const s = stateRef.current;

      // Night transition animation
      if (s.background === "transitioning") {
        s.nightProgress = Math.min(1, s.nightProgress + 0.008);
        if (s.nightProgress >= 1) s.background = "night";
      }

      // Character movement (walking left → right toward center)
      if (s.charWalking && !s.charStopped && s.charVisible) {
        const dt = 1 / 60;
        s.charX += CHAR_SPEED * dt;

        if (s.charX >= STOP_X_RATIO && !s.charExiting) {
          s.charX = STOP_X_RATIO;
          s.charStopped = true;
          s.charWalking = false;
          if (s.onWalkStop) s.onWalkStop();
          if (s.onStop) s.onStop();
        }

        if (s.charX > 1.1) {
          s.charVisible = false;
          s.charWalking = false;
          s.charExiting = false;
          if (s.onWalkStop) s.onWalkStop();
          if (s.onExit) s.onExit();
        }
      }

      // Exiting after feedback (continues right)
      if (s.charWalking && s.charExiting && s.charVisible) {
        const dt = 1 / 60;
        s.charX += CHAR_SPEED * dt;
        if (s.charX > 1.1) {
          s.charVisible = false;
          s.charWalking = false;
          s.charExiting = false;
          if (s.onWalkStop) s.onWalkStop();
          if (s.onExit) s.onExit();
        }
      }

      draw();
      animRef.current = requestAnimationFrame(tick);
    },
    [draw]
  );

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [tick]);

  // --- Public API ---
  const setBackgroundImages = useCallback((bgDay, bgNight) => {
    stateRef.current.bgDay = bgDay || null;
    stateRef.current.bgNight = bgNight || null;
  }, []);

  const startCharacter = useCallback((charImage, silhouetteColor) => {
    const s = stateRef.current;
    s.charX = -0.1;
    s.charWalking = true;
    s.charStopped = false;
    s.charVisible = true;
    s.charExiting = false;
    s.charImage = charImage || null;
    s.charSilhouetteColor = silhouetteColor || "#333";
    if (s.onWalkStart) s.onWalkStart();
  }, []);

  const continueWalking = useCallback(() => {
    const s = stateRef.current;
    s.charStopped = false;
    s.charWalking = true;
    s.charExiting = true;
    if (s.onWalkStart) s.onWalkStart();
  }, []);

  const setNightTransition = useCallback(() => {
    stateRef.current.background = "transitioning";
    stateRef.current.nightProgress = 0;
  }, []);

  const setOnStop = useCallback((cb) => { stateRef.current.onStop = cb; }, []);
  const setOnExit = useCallback((cb) => { stateRef.current.onExit = cb; }, []);
  const setOnWalkStart = useCallback((cb) => { stateRef.current.onWalkStart = cb; }, []);
  const setOnWalkStop = useCallback((cb) => { stateRef.current.onWalkStop = cb; }, []);

  const reset = useCallback(() => {
    const s = stateRef.current;
    s.charX = -0.1;
    s.charWalking = false;
    s.charStopped = false;
    s.charVisible = false;
    s.charExiting = false;
    s.background = "day";
    s.nightProgress = 0;
    s.charImage = null;
  }, []);

  return {
    setBackgroundImages,
    startCharacter,
    continueWalking,
    setNightTransition,
    setOnStop,
    setOnExit,
    setOnWalkStart,
    setOnWalkStop,
    reset,
  };
}
