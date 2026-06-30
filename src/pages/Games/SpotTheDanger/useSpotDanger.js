import { useRef, useCallback, useEffect } from "react";
import {
  SCENE_IMAGE,
  HAZARDS,
  DESIGN_W,
  DESIGN_H,
  buildHazards,
  checkHit,
} from "./spotDangerData";

/**
 * "Contain" transform: scales the design area to fit inside the canvas
 * while preserving aspect ratio. Returns the draw rect and scale.
 */
function getContainTransform(designW, designH, canvasW, canvasH) {
  const scale = Math.min(canvasW / designW, canvasH / designH);
  const drawW = designW * scale;
  const drawH = designH * scale;
  const offsetX = (canvasW - drawW) / 2;
  const offsetY = (canvasH - drawH) / 2;
  return { scale, drawW, drawH, offsetX, offsetY };
}

export function useSpotDanger(canvasRef, canvasSize) {
  const animRef = useRef(null);

  // Loaded images
  const bgImg = useRef(null);
  const hazardImgs = useRef({}); // { id: Image }
  const allLoaded = useRef(false);

  const stateRef = useRef({
    width: 0,
    height: 0,
    hazards: [],
    foundCount: 0,
    total: 3,
    feedbackMarkers: [],
    started: false,
    done: false,
  });

  useEffect(() => {
    stateRef.current.width = canvasSize.width;
    stateRef.current.height = canvasSize.height;
  }, [canvasSize]);

  // Preload all images
  useEffect(() => {
    let cancelled = false;

    const toLoad = [
      { id: "bg", src: SCENE_IMAGE },
      ...HAZARDS.map((h) => ({ id: h.id, src: h.image })),
    ];

    let loaded = 0;
    toLoad.forEach(({ id, src }) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        loaded++;
        if (id === "bg") bgImg.current = img;
        else hazardImgs.current[id] = img;
        if (loaded >= toLoad.length) allLoaded.current = true;
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded++;
        if (loaded >= toLoad.length) allLoaded.current = true;
      };
      img.src = src;
    });

    return () => { cancelled = true; };
  }, []);

  // Init
  const init = useCallback(() => {
    const s = stateRef.current;
    s.hazards = buildHazards();
    s.foundCount = 0;
    s.feedbackMarkers = [];
    s.started = true;
    s.done = false;
  }, []);

  // Handle tap — convert canvas coords to design-fraction coords
  const handleTap = useCallback((canvasX, canvasY) => {
    const s = stateRef.current;
    if (!s.started || s.done) return null;

    const t = getContainTransform(DESIGN_W, DESIGN_H, s.width, s.height);
    const fracX = (canvasX - t.offsetX) / t.drawW;
    const fracY = (canvasY - t.offsetY) / t.drawH;

    // Ignore taps outside the design area (letterbox zone)
    if (fracX < 0 || fracX > 1 || fracY < 0 || fracY > 1) {
      return { correct: false };
    }

    const hit = checkHit(s.hazards, fracX, fracY);
    if (!hit) {
      s.feedbackMarkers.push({ x: canvasX, y: canvasY, correct: false, timer: 35 });
      return { correct: false };
    }

    hit.found = true;
    s.foundCount++;
    // Feedback marker at center of the hazard in canvas coords
    const hitCx = t.offsetX + (hit.x + hit.w / 2) * t.drawW;
    const hitCy = t.offsetY + (hit.y + hit.h / 2) * t.drawH;
    s.feedbackMarkers.push({
      x: hitCx,
      y: hitCy,
      correct: true,
      type: hit.type,
      timer: 35,
    });

    if (s.foundCount >= s.total) {
      s.done = true;
    }

    return { correct: true, type: hit.type, label: hit.label, emoji: hit.emoji };
  }, []);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;
    const w = s.width;
    const h = s.height;
    if (w === 0 || h === 0) return;

    const t = getContainTransform(DESIGN_W, DESIGN_H, w, h);

    // 0) Clear & fill letterbox bars
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0A1628";
    ctx.fillRect(0, 0, w, h);

    // 1) Background scene (contain — preserves aspect ratio)
    if (bgImg.current) {
      ctx.drawImage(bgImg.current, t.offsetX, t.offsetY, t.drawW, t.drawH);
    } else {
      ctx.font = "16px 'Noto Sans Myanmar', sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.textAlign = "center";
      ctx.fillText("ပုံခေါ်နေသည်...", w / 2, h / 2);
    }

    // 2) Hazard images (only if not yet found)
    if (allLoaded.current) {
      s.hazards.forEach((hz) => {
        if (hz.found) return;
        const img = hazardImgs.current[hz.id];
        if (img) {
          const px = t.offsetX + hz.x * t.drawW;
          const py = t.offsetY + hz.y * t.drawH;
          const pw = hz.w * t.drawW;
          const ph = hz.h * t.drawH;
          ctx.drawImage(img, px, py, pw, ph);
        }
      });
    }

    // 3) Checkmarks on found hazards
    s.hazards.forEach((hz) => {
      if (!hz.found) return;
      const cx = t.offsetX + (hz.x + hz.w / 2) * t.drawW;
      const cy = t.offsetY + (hz.y + hz.h / 2) * t.drawH;
      const radius = Math.min(hz.w * t.drawW, hz.h * t.drawH) * 0.35;
      ctx.fillStyle = "rgba(34, 197, 94, 0.85)";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF";
      ctx.font = `bold ${Math.round(radius * 0.9)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✓", cx, cy);
    });

    // 4) Feedback markers
    const alive = [];
    s.feedbackMarkers.forEach((m) => {
      m.timer--;
      if (m.timer <= 0) return;
      const alpha = m.timer / 35;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (m.correct) {
        ctx.strokeStyle = "#22C55E";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#22C55E";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✓", m.x, m.y);
      } else {
        ctx.fillStyle = "#EF4444";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✕", m.x, m.y);
      }
      ctx.restore();
      alive.push(m);
    });
    s.feedbackMarkers = alive;

    // 5) Header bar (inside the design area)
    if (s.started && !s.done) {
      const barW = t.drawW * 0.4;
      const barH = 32;
      const barX = t.offsetX + (t.drawW - barW) / 2;
      const barY = t.offsetY + 8;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 16);
      ctx.fill();
      ctx.font = "600 14px 'Noto Sans Myanmar', sans-serif";
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.fillText(`အန္တရာယ် ${s.foundCount}/${s.total} ခုရှာပါ`, t.offsetX + t.drawW / 2, barY + 21);
    }
  }, [canvasRef]);

  const tick = useCallback(() => {
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [tick]);

  const reset = useCallback(() => {
    const s = stateRef.current;
    s.hazards = [];
    s.foundCount = 0;
    s.feedbackMarkers = [];
    s.started = false;
    s.done = false;
  }, []);

  return { init, handleTap, reset };
}
