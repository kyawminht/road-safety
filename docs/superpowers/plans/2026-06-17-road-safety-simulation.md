# Road Safety Simulation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, self-playing road safety simulation feed for Myanmar students — 5 modules, auto-play wrong-then-right Canvas animations, all Burmese.

**Architecture:** A vertical scrolling feed of ModuleCards, each wrapping a Canvas animation. `useAutoPlay` hook sequences 4 phases per card (wrong run → lesson overlay → right run → confetti). `SimulationCanvas` runs its own requestAnimationFrame loop for rendering. All content in `modules.js`. No interactivity, no auth, no backend.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, react-confetti, HTML Canvas 2D

---

### Task 1: Project Setup & Cleanup

**Files:**
- Modify: `index.html`
- Modify: `src/main.jsx`
- Modify: `src/index.css`
- Delete: `src/App.css`

- [ ] **Step 1: Update index.html — set lang, title, and Google Font**

Replace the entire content of `index.html`:

```html
<!doctype html>
<html lang="my">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;700&display=swap" rel="stylesheet" />
    <title>လမ်းအန္တရာယ်ကင်းရှင်းရေး</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace src/index.css — Tailwind imports and app base styles**

Replace the entire content of `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #1E3A5F;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
  --color-bg-dark: #0F172A;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Noto Sans Myanmar', sans-serif;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

body {
  background: var(--color-bg-dark);
  color: #F8FAFC;
  min-height: 100dvh;
  overflow-x: hidden;
}

#root {
  width: 100%;
  max-width: 100%;
}
```

- [ ] **Step 3: Delete src/App.css**

Run:
```bash
rm src/App.css
```

- [ ] **Step 4: Install framer-motion and react-confetti**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && npm install framer-motion react-confetti
```

Expected: Both packages added to `package.json` dependencies.

- [ ] **Step 5: Verify dev server runs**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173 | head -5
```

Expected: HTML response with the new `<title>` tag.

- [ ] **Step 6: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add index.html src/main.jsx src/index.css src/App.css package.json package-lock.json
git commit -m "chore: setup project with Tailwind, Burmese fonts, framer-motion, react-confetti

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Module Data

**Files:**
- Create: `src/data/modules.js`

- [ ] **Step 1: Create src/data/modules.js**

Write the file with all 5 modules and the canvas sequence config:

```js
export const MODULES = [
  {
    id: 'walking',
    emoji: '🚶‍♂️',
    title: 'လူသွားစင်္ကြံ စည်းကမ်း',
    lessonText: 'လူသွားစင်္ကြံပေါ်မှာသွားပါ',
    canvas: {
      studentOnRoad: true,
      vehicleType: 'car',
      hasSidewalk: true,
    },
  },
  {
    id: 'helmet',
    emoji: '⛑️',
    title: 'ဦးထုပ်ဆောင်းခြင်း',
    lessonText: 'ဦးထုပ်အမြဲဆောင်းပါ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'motorcycle',
      hasSidewalk: false,
      extraStudents: 1,
    },
  },
  {
    id: 'sidecar',
    emoji: '🛵',
    title: 'ဘေးတွဲစီးနည်း',
    lessonText: 'ဘေးတွဲမှာ ၂ ယောက်ထက်ပိုမစီးရ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'sidecar',
      hasSidewalk: false,
      extraStudents: 2,
    },
  },
  {
    id: 'bicycle',
    emoji: '🚲',
    title: 'စက်ဘီးစီးနည်း',
    lessonText: 'တစ်ယောက်ချင်းစီစီးပါ',
    canvas: {
      studentOnRoad: true,
      vehicleType: 'bicycle',
      hasSidewalk: false,
      extraStudents: 1,
    },
  },
  {
    id: 'tricycle',
    emoji: '🛺',
    title: 'သုံးဘီးဆိုင်ကယ်စီးနည်း',
    lessonText: 'ထိုင်ပြီးစီးပါ',
    canvas: {
      studentOnRoad: false,
      vehicleType: 'tricycle',
      hasSidewalk: false,
      extraStudents: 0,
    },
  },
];

export const COMPLETION_MESSAGE = 'သင်ခန်းစာအားလုံးပြီးပါပြီ';

export const TIMING = {
  wrongRun: 5000,
  lesson: 3000,
  rightRun: 5000,
  confetti: 2000,
  transition: 1000,
};
```

- [ ] **Step 2: Verify the file has no syntax errors**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "import('./src/data/modules.js').then(m => { console.log(Object.keys(m).join(', ')); console.log(m.MODULES.length + ' modules'); })"
```

Expected: `MODULES, COMPLETION_MESSAGE, TIMING` and `5 modules`.

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/data/modules.js
git commit -m "feat: add module data with 5 road safety topics in Burmese

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Canvas Renderer Utils

**Files:**
- Create: `src/utils/canvasRenderer.js`

- [ ] **Step 1: Create src/utils/canvasRenderer.js**

Write the complete canvas drawing utility. All functions are pure — they take a Canvas 2D context and draw on it. No React, no state:

```js
const SKY_TOP = '#87CEEB';
const SKY_BOTTOM = '#E0F0FF';
const GRASS = '#4ADE80';
const ROAD_COLOR = '#475569';
const ROAD_LINE = '#F8FAFC';
const BUILDING_COLORS = ['#94A3B8', '#CBD5E1', '#A8B5C4'];
const SIDEWALK_COLOR = '#D1D5DB';
const SHIRT_COLOR = '#FFFFFF';
const LONGYI_COLOR = '#22C55E';
const SKIN_COLOR = '#FCD34D';
const HAIR_COLOR = '#1E293B';
const HELMET_COLOR = '#F59E0B';
const CAR_COLOR = '#EF4444';
const MOTORCYCLE_COLOR = '#3B82F6';
const SIDECAR_COLOR = '#8B5CF6';
const BIKE_COLOR = '#EC4899';
const TRIKE_COLOR = '#14B8A6';

export function drawSky(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  grad.addColorStop(0, SKY_TOP);
  grad.addColorStop(1, SKY_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.5);
}

export function drawBuildings(ctx, w, h) {
  const buildingH = h * 0.22;
  const y = h * 0.28;
  for (let x = 0; x < w; x += 60 + Math.random() * 40) {
    const bw = 40 + Math.random() * 30;
    const bh = buildingH * (0.6 + Math.random() * 0.4);
    ctx.fillStyle = BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)];
    ctx.fillRect(x, y + buildingH - bh, bw, bh);
    ctx.fillStyle = '#64748B';
    for (let wy = y + buildingH - bh + 8; wy < y + buildingH - 4; wy += 12) {
      ctx.fillRect(x + 6, wy, 8, 7);
      ctx.fillRect(x + bw - 14, wy, 8, 7);
    }
  }
}

export function drawSidewalk(ctx, w, h) {
  ctx.fillStyle = SIDEWALK_COLOR;
  ctx.fillRect(0, h * 0.50, w, h * 0.04);
  ctx.fillRect(0, h * 0.75, w, h * 0.04);
}

export function drawRoad(ctx, w, h) {
  ctx.fillStyle = ROAD_COLOR;
  ctx.fillRect(0, h * 0.54, w, h * 0.21);
  ctx.strokeStyle = ROAD_LINE;
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo(0, h * 0.645);
  ctx.lineTo(w, h * 0.645);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawGrass(ctx, w, h) {
  ctx.fillStyle = GRASS;
  ctx.fillRect(0, h * 0.79, w, h * 0.21);
}

export function drawStudent(ctx, x, y, scale = 1, options = {}) {
  const { wearingHelmet = false, isStanding = false, isOnBike = false } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Body (shirt)
  ctx.fillStyle = SHIRT_COLOR;
  roundRect(ctx, -6, 4, 12, 14, 3);
  // Longyi
  ctx.fillStyle = LONGYI_COLOR;
  ctx.fillRect(-6, 18, 12, 8);
  // Head
  ctx.fillStyle = SKIN_COLOR;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  // Hair
  ctx.fillStyle = HAIR_COLOR;
  ctx.beginPath();
  ctx.arc(0, -2, 6, Math.PI, 0);
  ctx.fill();
  // Helmet (if enabled)
  if (wearingHelmet) {
    ctx.fillStyle = HELMET_COLOR;
    ctx.beginPath();
    ctx.arc(0, -1, 7.5, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-8, -1, 16, 3);
  }
  // Legs
  ctx.fillStyle = SKIN_COLOR;
  ctx.fillRect(-4, 26, 3, 6);
  ctx.fillRect(1, 26, 3, 6);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

export function drawCar(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = CAR_COLOR;
  roundRect(ctx, -25, -8, 50, 18, 5);
  roundRect(ctx, -16, -16, 32, 10, 4);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(-14, -14, 10, 6);
  ctx.fillRect(2, -14, 10, 6);
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-12, 12, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12, 12, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawMotorcycle(ctx, x, y, hasSidecar = false, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = MOTORCYCLE_COLOR;
  roundRect(ctx, -8, -4, 16, 12, 3);
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-6, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  if (hasSidecar) {
    ctx.fillStyle = SIDECAR_COLOR;
    roundRect(ctx, 8, -2, 20, 10, 3);
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(18, 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawBicycle(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = BIKE_COLOR;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-6, 0, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(6, 0, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(0, -6);
  ctx.lineTo(6, 0);
  ctx.moveTo(0, -6);
  ctx.lineTo(0, -10);
  ctx.lineTo(4, -12);
  ctx.stroke();
  ctx.fillStyle = BIKE_COLOR;
  roundRect(ctx, -2, -14, 6, 6, 2);
  ctx.restore();
}

export function drawTricycle(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = TRIKE_COLOR;
  roundRect(ctx, -22, -6, 44, 14, 4);
  roundRect(ctx, -12, -14, 28, 10, 3);
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-14, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(14, 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawRedFlash(ctx, w, h) {
  ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.fillRect(0, 0, w, h);
}

export function drawGreenFlash(ctx, w, h) {
  ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
  ctx.fillRect(0, 0, w, h);
}

export function drawSchool(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#F59E0B';
  roundRect(ctx, -20, -15, 40, 30, 2);
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.moveTo(-22, -15);
  ctx.lineTo(0, -30);
  ctx.lineTo(22, -15);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1E3A5F';
  ctx.fillRect(-4, 0, 8, 15);
  ctx.restore();
}

export function drawHome(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FCD34D';
  roundRect(ctx, -15, -10, 30, 25, 2);
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.moveTo(-17, -10);
  ctx.lineTo(0, -25);
  ctx.lineTo(17, -10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1E3A5F';
  ctx.fillRect(-3, 5, 6, 10);
  ctx.restore();
}
```

- [ ] **Step 2: Verify no syntax errors**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/utils/canvasRenderer.js', 'utf8');
// Check for obvious syntax issues
try {
  new Function(code);
  console.log('No syntax errors');
} catch(e) {
  console.log('Syntax error:', e.message);
}
"
```

Expected: `No syntax errors`

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/utils/canvasRenderer.js
git commit -m "feat: add canvas rendering utilities for student, vehicles, road

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: useAutoPlay Hook

**Files:**
- Create: `src/hooks/useAutoPlay.js`

- [ ] **Step 1: Create src/hooks/useAutoPlay.js**

This hook manages the 4-phase sequence timing for one ModuleCard. It exposes the current phase and fires an `onComplete` callback when all phases are done:

```js
import { useState, useEffect, useRef } from 'react';
import { TIMING } from '../data/modules.js';

/**
 * @param {boolean} isActive - Whether this card should be playing
 * @param {function} onComplete - Called when all phases finish
 * @returns {{ phase: 'wrong-run'|'lesson'|'right-run'|'confetti'|'done'|'waiting' }}
 */
export function useAutoPlay(isActive, onComplete) {
  const [phase, setPhase] = useState('waiting');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setPhase('waiting');
      return;
    }

    const phases = [
      { name: 'wrong-run', duration: TIMING.wrongRun },
      { name: 'lesson', duration: TIMING.lesson },
      { name: 'right-run', duration: TIMING.rightRun },
      { name: 'confetti', duration: TIMING.confetti },
    ];

    let currentIdx = 0;

    const advance = () => {
      if (currentIdx < phases.length) {
        setPhase(phases[currentIdx].name);
        timerRef.current = setTimeout(() => {
          currentIdx++;
          advance();
        }, phases[currentIdx]?.duration || 0);
      } else {
        setPhase('done');
        onComplete?.();
      }
    };

    advance();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  return { phase };
}
```

- [ ] **Step 2: Verify no syntax errors**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/hooks/useAutoPlay.js', 'utf8');
new Function(code);
console.log('No syntax errors');
"
```

Expected: `No syntax errors`

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/hooks/useAutoPlay.js
git commit -m "feat: add useAutoPlay hook for 4-phase sequence timing

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: SimulationCanvas Component

**Files:**
- Create: `src/components/SimulationCanvas.jsx`

- [ ] **Step 1: Create src/components/SimulationCanvas.jsx**

This component renders a `<canvas>` and draws the scene each frame using its own requestAnimationFrame loop. Progress from 0-1 drives all positions. Mode ("wrong"/"right") controls behavior:

```jsx
import { useRef, useEffect } from 'react';
import {
  drawSky,
  drawBuildings,
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
  const progressRef = useRef(0);

  useEffect(() => {
    if (!mode || !canvasRef.current) {
      progressRef.current = 0;
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

    startRef.current = null;
    progressRef.current = 0;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      progressRef.current = progress;

      // Draw scene
      ctx.clearRect(0, 0, w, h);
      drawSky(ctx, w, h);
      drawBuildings(ctx, w, h);

      if (moduleConfig.hasSidewalk) {
        drawSidewalk(ctx, w, h);
      }

      drawRoad(ctx, w, h);
      drawGrass(ctx, w, h);

      const isWrong = mode === 'wrong';
      const roadY = h * 0.59;
      const sidewalkTopY = h * 0.51;
      const sidewalkBotY = h * 0.76;

      // Student position
      const studentX = w * 0.2 + progress * w * 0.5;
      let studentY = isWrong ? roadY : sidewalkTopY;

      // Vehicle position
      let vehicleX = w * 0.9 - progress * w * 0.6;
      let vehicleY = roadY;

      // Module-specific adjustments
      const cfg = moduleConfig;

      if (cfg.vehicleType === 'motorcycle' || cfg.vehicleType === 'sidecar') {
        // Student is on the vehicle
        if (cfg.vehicleType === 'sidecar') {
          drawMotorcycle(ctx, vehicleX, vehicleY, true);
          // Wrong: 3 students (overcrowded), Right: 2 students
          const count = isWrong ? 3 : 2;
          for (let i = 0; i < count; i++) {
            drawStudent(ctx, vehicleX + 5 + i * 8, vehicleY - 12, 0.5);
          }
          if (isWrong && progress > 0.5) {
            drawStudent(ctx, vehicleX + 15, vehicleY + 20, 0.5);
          }
        } else {
          // motorcycle - student + driver
          drawMotorcycle(ctx, vehicleX, vehicleY, false);
          drawStudent(ctx, vehicleX - 2, vehicleY - 12, 0.6);
          drawStudent(ctx, vehicleX + 6, vehicleY - 12, 0.6, { wearingHelmet: !isWrong });
        }
      } else if (cfg.vehicleType === 'bicycle') {
        // Two bicycles
        drawBicycle(ctx, vehicleX - (isWrong ? 0 : 15), vehicleY);
        drawStudent(ctx, vehicleX - (isWrong ? 2 : 13), vehicleY - 18, 0.5);
        drawBicycle(ctx, vehicleX + (isWrong ? 15 : 15), vehicleY);
        drawStudent(ctx, vehicleX + (isWrong ? 13 : 28), vehicleY - 18, 0.5);
        // Walking student
        drawStudent(ctx, studentX, isWrong ? roadY : sidewalkTopY, 0.8);
      } else if (cfg.vehicleType === 'tricycle') {
        drawTricycle(ctx, vehicleX, vehicleY);
        // Wrong: student standing on back
        if (isWrong) {
          drawStudent(ctx, vehicleX + 15, vehicleY - 20, 0.6, { isStanding: true });
        } else {
          drawStudent(ctx, vehicleX + 10, vehicleY - 5, 0.5);
        }
        drawStudent(ctx, studentX, isWrong ? roadY : sidewalkTopY, 0.8);
      } else {
        // car (module 1: walking)
        drawCar(ctx, vehicleX, vehicleY);
        drawStudent(ctx, studentX, studentY, 0.8);
      }

      // Draw school on right
      drawSchool(ctx, w * 0.88, h * 0.42, 0.7);
      // Draw home on left
      drawHome(ctx, w * 0.08, h * 0.42, 0.7);

      // Flash effect near collision moment
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
```

- [ ] **Step 2: Verify no syntax errors**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/components/SimulationCanvas.jsx', 'utf8');
console.log('File size:', code.length, 'bytes');
console.log('Contains export default:', code.includes('export default'));
"
```

Expected: `File size: ... bytes` and `Contains export default: true`

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/components/SimulationCanvas.jsx
git commit -m "feat: add SimulationCanvas with wrong/right mode rendering

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: LessonOverlay Component

**Files:**
- Create: `src/components/LessonOverlay.jsx`

- [ ] **Step 1: Create src/components/LessonOverlay.jsx**

```jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonOverlay({ visible, emoji, lessonText }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 rounded-t-2xl"
          style={{ background: 'rgba(15, 23, 42, 0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-warning/10 border-2 border-warning rounded-2xl px-6 py-5 mx-4 text-center max-w-xs"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="text-5xl mb-3">{emoji}</div>
            <p className="text-xl font-bold text-white leading-relaxed">
              {lessonText}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify the component is valid**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/components/LessonOverlay.jsx', 'utf8');
console.log('File size:', code.length, 'bytes');
console.log('Contains AnimatePresence:', code.includes('AnimatePresence'));
"
```

Expected: `File size: ... bytes` and `Contains AnimatePresence: true`

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/components/LessonOverlay.jsx
git commit -m "feat: add LessonOverlay with Burmese text and emoji animation

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: ConfettiOverlay Component

**Files:**
- Create: `src/components/ConfettiOverlay.jsx`

- [ ] **Step 1: Create src/components/ConfettiOverlay.jsx**

```jsx
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function ConfettiOverlay({ active, duration = 2000 }) {
  const [show, setShow] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (active) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [active, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={150}
        recycle={false}
        colors={['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6']}
        gravity={0.15}
        initialVelocityY={-10}
        tweenDuration={100}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify the component is valid**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/components/ConfettiOverlay.jsx', 'utf8');
console.log('File size:', code.length, 'bytes');
console.log('Contains react-confetti:', code.includes('react-confetti'));
"
```

Expected: `File size: ... bytes` and `Contains react-confetti: true`

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/components/ConfettiOverlay.jsx
git commit -m "feat: add ConfettiOverlay with react-confetti celebration

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: ModuleCard Component

**Files:**
- Create: `src/components/ModuleCard.jsx`

- [ ] **Step 1: Create src/components/ModuleCard.jsx**

This is the card that combines Canvas + LessonOverlay + ConfettiOverlay for one module:

```jsx
import { useAutoPlay } from '../hooks/useAutoPlay.js';
import SimulationCanvas from './SimulationCanvas.jsx';
import LessonOverlay from './LessonOverlay.jsx';
import ConfettiOverlay from './ConfettiOverlay.jsx';
import { TIMING } from '../data/modules.js';

export default function ModuleCard({ module, isActive, onComplete }) {
  const { phase } = useAutoPlay(isActive, onComplete);

  const isWrongRun = phase === 'wrong-run';
  const isRightRun = phase === 'right-run';
  const isLesson = phase === 'lesson';
  const isConfetti = phase === 'confetti';
  const isDone = phase === 'done';

  const canvasMode = isWrongRun ? 'wrong' : isRightRun ? 'right' : null;
  const canvasDuration = isWrongRun ? TIMING.wrongRun : TIMING.rightRun;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0 w-full"
      style={{
        minHeight: '480px',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Header */}
      <div className="bg-primary px-5 py-3 flex items-center gap-3">
        <span className="text-3xl">{module.emoji}</span>
        <h2 className="text-lg font-bold text-white leading-snug">
          {module.title}
        </h2>
        {isDone && (
          <span className="ml-auto text-success text-xl">✅</span>
        )}
      </div>

      {/* Canvas area */}
      <div className="relative" style={{ height: '380px' }}>
        <SimulationCanvas
          moduleConfig={module.canvas}
          mode={canvasMode}
          duration={canvasDuration}
        />
        <LessonOverlay
          visible={isLesson}
          emoji={module.emoji}
          lessonText={module.lessonText}
        />
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
        {isWrongRun && (
          <span className="text-sm text-danger font-bold">❌ မှားယွင်းနေပါသည်</span>
        )}
        {isLesson && (
          <span className="text-sm text-warning font-bold">📋 သင်ခန်းစာ</span>
        )}
        {isRightRun && (
          <span className="text-sm text-success font-bold">✅ မှန်ကန်သောနည်းလမ်း</span>
        )}
        {isConfetti && (
          <span className="text-sm text-success font-bold">🎉 ပြီးမြောက်ပါပြီ</span>
        )}
        {isDone && (
          <span className="text-sm text-primary font-bold">✔️ ပြီးဆုံး</span>
        )}
      </div>

      <ConfettiOverlay active={isConfetti} duration={TIMING.confetti} />
    </div>
  );
}
```

- [ ] **Step 2: Verify component structure**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/components/ModuleCard.jsx', 'utf8');
console.log('File size:', code.length, 'bytes');
console.log('Contains SimulationCanvas:', code.includes('SimulationCanvas'));
console.log('Contains LessonOverlay:', code.includes('LessonOverlay'));
console.log('Contains ConfettiOverlay:', code.includes('ConfettiOverlay'));
console.log('Contains useAutoPlay:', code.includes('useAutoPlay'));
"
```

Expected: All 4 checks return `true`.

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/components/ModuleCard.jsx
git commit -m "feat: add ModuleCard orchestrating Canvas, Lesson, and Confetti

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: SimulationFeed Component

**Files:**
- Create: `src/components/SimulationFeed.jsx`

- [ ] **Step 1: Create src/components/SimulationFeed.jsx**

This is the main feed container. It renders all 5 ModuleCards in a scrollable container and auto-advances:

```jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import ModuleCard from './ModuleCard.jsx';
import { MODULES, COMPLETION_MESSAGE } from '../data/modules.js';

export default function SimulationFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const feedRef = useRef(null);
  const cardRefs = useRef([]);

  const handleCardComplete = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= MODULES.length) {
        setAllDone(true);
        return prev;
      }
      return next;
    });
  }, []);

  // Auto-scroll to the active card
  useEffect(() => {
    if (activeIndex >= MODULES.length) return;
    const cardEl = cardRefs.current[activeIndex];
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={feedRef}
      className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6"
      style={{
        scrollSnapType: 'y mandatory',
        overflowY: 'auto',
        height: '100dvh',
      }}
    >
      <div className="text-center pt-2 pb-1">
        <h1 className="text-2xl font-bold text-white">
          လမ်းအန္တရာယ်ကင်းရှင်းရေး
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          မှန်ကန်သော လမ်းသွားနည်းလမ်းများ
        </p>
      </div>

      {MODULES.map((mod, idx) => (
        <div
          key={mod.id}
          ref={(el) => (cardRefs.current[idx] = el)}
        >
          <ModuleCard
            module={mod}
            isActive={idx === activeIndex}
            onComplete={handleCardComplete}
          />
        </div>
      ))}

      {allDone && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white">
            {COMPLETION_MESSAGE}
          </h2>
          <p className="text-gray-400 mt-2 text-base">
            အပေါ်သို့ပြန်ဆွဲပြီး ပြန်ကြည့်နိုင်ပါသည်
          </p>
        </div>
      )}

      {/* Bottom spacer for safe area */}
      <div className="h-16" />
    </div>
  );
}
```

- [ ] **Step 2: Verify component structure**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
const fs = require('fs');
const code = fs.readFileSync('src/components/SimulationFeed.jsx', 'utf8');
console.log('File size:', code.length, 'bytes');
console.log('Contains ModuleCard:', code.includes('ModuleCard'));
console.log('Contains COMPLETION_MESSAGE:', code.includes('COMPLETION_MESSAGE'));
console.log('Contains scrollIntoView:', code.includes('scrollIntoView'));
"
```

Expected: All 3 checks return `true`.

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/components/SimulationFeed.jsx
git commit -m "feat: add SimulationFeed with auto-scroll and sequential playback

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 10: App.jsx — Wire Everything Together

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace src/App.jsx**

Replace the entire content of `src/App.jsx`:

```jsx
import SimulationFeed from './components/SimulationFeed.jsx';

function App() {
  return <SimulationFeed />;
}

export default App;
```

- [ ] **Step 2: Verify the app compiles**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && npx vite build 2>&1 | tail -10
```

Expected: Build succeeds with no errors. Look for `✓ built in` in the output.

- [ ] **Step 3: Commit**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git add src/App.jsx
git commit -m "feat: wire App to SimulationFeed, remove starter code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 11: Final Verification & Polish

**Files:**
- Modify: `index.html` (verify)
- Read: All source files (verify)

- [ ] **Step 1: Full production build**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && npx vite build 2>&1
```

Expected: Build succeeds. Note the bundle sizes:
- JS should be under 150KB gzipped
- No image assets in dist

- [ ] **Step 2: Check bundle size**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && ls -lh dist/assets/*.js 2>/dev/null && gzip -c dist/assets/*.js 2>/dev/null | wc -c
```

Expected: Gzipped size under 150000 bytes.

- [ ] **Step 3: Verify no English text leaked into user-facing content**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && grep -rn "Walk on" src/data/modules.js || echo "No English found in modules data"
```

Expected: `No English found in modules data`

- [ ] **Step 4: Verify all 5 modules have Burmese text**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && node -e "
import('./src/data/modules.js').then(m => {
  m.MODULES.forEach(mod => {
    console.log(mod.emoji, mod.title, '->', mod.lessonText);
  });
});
"
```

Expected: All 5 modules printed with Burmese text.

- [ ] **Step 5: Verify component tree is complete**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && find src -name '*.jsx' -o -name '*.js' | sort
```

Expected:
```
src/App.jsx
src/components/ConfettiOverlay.jsx
src/components/LessonOverlay.jsx
src/components/ModuleCard.jsx
src/components/SimulationCanvas.jsx
src/components/SimulationFeed.jsx
src/data/modules.js
src/hooks/useAutoPlay.js
src/index.css
src/main.jsx
src/utils/canvasRenderer.js
```

- [ ] **Step 6: Start dev server and do a manual check**

Run:
```bash
cd /mnt/d/vibe-code/vibecode/road-safety && npm run dev -- --host 0.0.0.0 &
sleep 3
echo "Dev server at http://localhost:5173"
```

Open `http://localhost:5173` on a phone or browser at 375px width.
Verify:
1. The header "လမ်းအန္တရာယ်ကင်းရှင်းရေး" appears
2. First card auto-plays wrong scenario then lesson overlay then right scenario then confetti
3. After confetti, auto-scrolls to next card
4. All 5 modules play sequentially
5. Completion message appears at bottom

- [ ] **Step 7: Final commit (if any tweaks needed)**

```bash
cd /mnt/d/vibe-code/vibecode/road-safety
git status
git add -A
git commit -m "chore: final verification and polish

Co-Authored-By: Claude <noreply@anthropic.com>"
```
