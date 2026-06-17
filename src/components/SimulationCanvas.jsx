import { useRef, useEffect } from 'react';
import {
  drawSky,
  drawBuildings,
  generateBuildings,
  drawSidewalk,
  drawRoad,
  drawGrass,
  drawStudent,
  drawCar,
  drawMotorcycle,
  drawBicycle,
  drawTricycle,
  drawRedFlash,
  drawGreenFlash,
  drawSchool,
  drawHome,
} from '../utils/canvasRenderer.js';

export default function SimulationCanvas({ moduleConfig, mode, duration = 5000 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const buildingsRef = useRef(null);

  useEffect(() => {
    if (!mode || !canvasRef.current) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Generate buildings once per canvas setup
    if (!buildingsRef.current) {
      buildingsRef.current = generateBuildings(w, h);
    }
    const buildings = buildingsRef.current;

    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Draw scene
      ctx.clearRect(0, 0, w, h);
      drawSky(ctx, w, h);
      drawBuildings(ctx, buildings, h);

      if (moduleConfig.hasSidewalk) {
        drawSidewalk(ctx, w, h);
      }

      drawRoad(ctx, w, h);
      drawGrass(ctx, w, h);

      const isWrong = mode === 'wrong';
      const roadY = h * 0.59;
      const sidewalkTopY = h * 0.51;

      // Student position
      const studentX = w * 0.2 + progress * w * 0.5;
      const studentY = isWrong ? roadY : sidewalkTopY;

      // Vehicle position
      const vehicleX = w * 0.9 - progress * w * 0.6;
      const vehicleY = roadY;

      const cfg = moduleConfig;

      if (cfg.vehicleType === 'motorcycle' || cfg.vehicleType === 'sidecar') {
        if (cfg.vehicleType === 'sidecar') {
          drawMotorcycle(ctx, vehicleX, vehicleY, true);
          const count = isWrong ? 3 : 2;
          for (let i = 0; i < count; i++) {
            drawStudent(ctx, vehicleX + 5 + i * 8, vehicleY - 12, 0.5);
          }
          if (isWrong && progress > 0.5) {
            drawStudent(ctx, vehicleX + 15, vehicleY + 20, 0.5);
          }
        } else {
          drawMotorcycle(ctx, vehicleX, vehicleY, false);
          drawStudent(ctx, vehicleX - 2, vehicleY - 12, 0.6);
          drawStudent(ctx, vehicleX + 6, vehicleY - 12, 0.6, { wearingHelmet: !isWrong });
        }
      } else if (cfg.vehicleType === 'bicycle') {
        drawBicycle(ctx, vehicleX - (isWrong ? 0 : 15), vehicleY);
        drawStudent(ctx, vehicleX - (isWrong ? 2 : 13), vehicleY - 18, 0.5);
        drawBicycle(ctx, vehicleX + (isWrong ? 15 : 15), vehicleY);
        drawStudent(ctx, vehicleX + (isWrong ? 13 : 28), vehicleY - 18, 0.5);
        drawStudent(ctx, studentX, isWrong ? roadY : sidewalkTopY, 0.8);
      } else if (cfg.vehicleType === 'tricycle') {
        drawTricycle(ctx, vehicleX, vehicleY);
        if (isWrong) {
          drawStudent(ctx, vehicleX + 15, vehicleY - 20, 0.6);
        } else {
          drawStudent(ctx, vehicleX + 10, vehicleY - 5, 0.5);
        }
        drawStudent(ctx, studentX, isWrong ? roadY : sidewalkTopY, 0.8);
      } else {
        drawCar(ctx, vehicleX, vehicleY);
        drawStudent(ctx, studentX, studentY, 0.8);
      }

      // Draw school on right
      drawSchool(ctx, w * 0.88, h * 0.42, 0.7);
      // Draw home on left
      drawHome(ctx, w * 0.08, h * 0.42, 0.7);

      // Flash effects
      if (isWrong && progress > 0.55 && progress < 0.7) {
        drawRedFlash(ctx, w, h);
      }
      if (!isWrong && progress > 0.8) {
        drawGreenFlash(ctx, w, h);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [mode, moduleConfig, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-t-2xl"
      style={{ height: '380px', display: 'block' }}
    />
  );
}
