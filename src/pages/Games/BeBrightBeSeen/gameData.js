export const CHARACTERS = [
  {
    id: 1,
    name: "ကျောင်းသား",
    image: "/images/games/char-boy-dark.png",
    background: "day",
    question: "ဒီကျောင်းသားက အရောင်တောက်တဲ့အင်္ကျီ ဝတ်ထားသလား?",
    correctAnswer: "no",
    feedbackCorrect: "မှန်ပါတယ်! အနက်ရောင်အင်္ကျီက မြင်ရခက်ပါတယ်",
    feedbackWrong: "မှားပါတယ်! ဒီအင်္ကျီက အရောင်တောက်တောက် မဟုတ်ပါဘူး",
    silhouetteColor: "#2D3748",
  },
  {
    id: 2,
    name: "အဘိုး",
    image: "/images/games/char-oldman-bright.png",
    background: "day",
    question: "ဒီအဘိုးက အရောင်တောက်တဲ့အင်္ကျီ ဝတ်ထားသလား?",
    correctAnswer: "yes",
    feedbackCorrect: "မှန်ပါတယ်! အဖြူရောင်နဲ့အရောင်တောက်တောက်က ရှင်းရှင်းမြင်ရပါတယ်",
    feedbackWrong: "မှားပါတယ်! ဒီအဘိုးက အရောင်တောက်တောက် ဝတ်ထားပါတယ်",
    silhouetteColor: "#F5F5DC",
  },
  {
    id: 3,
    name: "အဒေါ်",
    image: "/images/games/char-woman-dark.png",
    background: "night",
    question: "ညအချိန်မှာ ဒီအဒေါ်ကို ကားမောင်းသူက ရှင်းရှင်းမြင်ရသလား?",
    correctAnswer: "no",
    feedbackCorrect: "မှန်ပါတယ်! ညအချိန် အနက်ရောင်ဝတ်ရင် လုံးဝမမြင်ရပါဘူး",
    feedbackWrong: "မှားပါတယ်! ညအချိန်မှာ ဒီအင်္ကျီက မြင်ရခက်ပါတယ်",
    silhouetteColor: "#1A1A2E",
  },
  {
    id: 4,
    name: "ကျောင်းသူ",
    image: "/images/games/char-girl-bright.png",
    background: "night",
    question: "ညအချိန်မှာ ဒီကျောင်းသူကို ကားမောင်းသူက ရှင်းရှင်းမြင်ရသလား?",
    correctAnswer: "yes",
    feedbackCorrect: "မှန်ပါတယ်! အရောင်တောက်တောက်အင်္ကျီက ညအချိန်မှာ အသက်ကယ်ပါတယ်",
    feedbackWrong: "မှားပါတယ်! ဒီကျောင်းသူက အရောင်တောက်တောက် ဝတ်ထားတာကို ရှင်းရှင်းမြင်ရပါတယ်",
    silhouetteColor: "#FFD700",
  },
];

// Image paths (loaded by useImagePreloader)
export const BG_DAY = "/images/games/day.png";
export const BG_NIGHT = "/images/games/night.png";
export const CAR_INTERIOR = "/images/games/car_interior.png";

// --- Procedural Background Fallback ---
// Used when bg_day.png / bg_night.png aren't loaded yet

function lerpColor(a, b, t) {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 0xff,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff;
  const br = (bh >> 16) & 0xff,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff;
  return `rgb(${Math.round(ar + (br - ar) * t)}, ${Math.round(ag + (bg - ag) * t)}, ${Math.round(ab + (bb - ab) * t)})`;
}

function drawSky(ctx, w, h, np) {
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.35);
  grad.addColorStop(0, lerpColor("#4A90D9", "#0A1628", np));
  grad.addColorStop(1, lerpColor("#87CEEB", "#162544", np));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.35);

  // Clouds (fade out at night)
  if (np < 0.5) {
    const a = 1 - np * 2;
    ctx.fillStyle = `rgba(255,255,255,${a * 0.6})`;
    [[0.15, 0.08, 0.18], [0.5, 0.05, 0.22], [0.8, 0.1, 0.15]].forEach(([cx, cy, cw]) => {
      ctx.beginPath();
      ctx.ellipse(w * cx, h * cy, w * cw * 0.4, h * 0.03, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * cx + w * cw * 0.2, h * cy - h * 0.01, w * cw * 0.3, h * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Stars
  if (np > 0.4) {
    const sa = Math.min(1, (np - 0.4) / 0.6);
    ctx.fillStyle = `rgba(255,255,255,${sa * 0.8})`;
    [[11, 3], [27, 8], [41, 2], [56, 11], [72, 5], [88, 13], [17, 14], [63, 16], [34, 6], [79, 3], [93, 9], [6, 11]].forEach(
      ([sx, sy]) => {
        ctx.beginPath();
        ctx.arc((w * sx) / 100, (h * sy) / 100, 1.2 + ((sx * 3) % 5) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    );
  }
}

function drawBuildings(ctx, w, h, np) {
  const groundY = h * 0.35;
  const defs = [
    [0, 0.14, 0.14, "#6B7280"],
    [0.12, 0.1, 0.18, "#9CA3AF"],
    [0.24, 0.12, 0.1, "#78909C"],
    [0.38, 0.09, 0.15, "#78866B"],
    [0.5, 0.13, 0.11, "#94A3B8"],
    [0.65, 0.1, 0.19, "#64748B"],
    [0.77, 0.11, 0.12, "#9CA3AF"],
    [0.9, 0.14, 0.08, "#7C8B9D"],
  ];
  defs.forEach(([xr, bw, bh, color]) => {
    const bx = w * xr;
    const bwidth = w * bw;
    const bheight = h * bh;
    const by = groundY - bheight;
    ctx.fillStyle = np > 0.5 ? lerpColor(color, "#111", (np - 0.5) * 2) : color;
    ctx.fillRect(bx, by, bwidth, bheight);

    // Windows
    const cols = Math.max(1, Math.floor(bwidth / (w * 0.025)));
    const rows = Math.max(1, Math.floor(bheight / (h * 0.035)));
    const winW = bwidth * 0.1;
    const winH = bheight * 0.07;
    const gx = (bwidth - cols * winW) / (cols + 1);
    const gy = (bheight - rows * winH) / (rows + 1);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const wx = bx + gx + c * (winW + gx);
        const wy = by + gy + r * (winH + gy);
        ctx.fillStyle = np > 0.3 && (r + c) % 3 !== 2 ? `rgba(255,240,160,${0.3 + ((r + c) % 3) * 0.2})` : np > 0.3 ? "rgba(20,30,50,0.4)" : "#E0F2FE";
        ctx.fillRect(wx, wy, winW, winH);
      }
  });
}

function drawRoad(ctx, w, h) {
  // Perspective road: wider at bottom, narrows toward horizon
  const topY = h * 0.35;
  const bottomY = h * 0.72;

  // Road surface with perspective
  ctx.fillStyle = "#4A4A4A";
  ctx.beginPath();
  ctx.moveTo(0, bottomY);
  ctx.lineTo(w, bottomY);
  ctx.lineTo(w, topY);
  ctx.lineTo(0, topY);
  ctx.closePath();
  ctx.fill();

  // Perspective road markings (center dashes narrowing toward horizon)
  ctx.strokeStyle = "#FFF";
  ctx.setLineDash([]);
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    const y1 = topY + (bottomY - topY) * t;
    const y2 = topY + (bottomY - topY) * (t + 0.06);
    const halfW = w * 0.01 + (w * 0.12) * (1 - t);
    ctx.lineWidth = 2 + 2 * (1 - t);
    ctx.beginPath();
    ctx.moveTo(w / 2 - halfW, y1);
    ctx.lineTo(w / 2 - halfW, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 + halfW, y1);
    ctx.lineTo(w / 2 + halfW, y2);
    ctx.stroke();
  }

  // Curbs
  ctx.fillStyle = "#888";
  ctx.fillRect(0, topY - 2, w, 2);
  ctx.fillRect(0, bottomY, w, 2);
}

function drawZebraCrossing(ctx, w, h) {
  // REALISTIC ZEBRA CROSSING: white stripes run LEFT↔RIGHT across the road
  // Driver's POV: road goes forward (bottom→top), stripes go side-to-side
  // Like what you see stopped at a traffic light
  const topY = h * 0.40;       // far end of crossing (nearer horizon)
  const bottomY = h * 0.70;    // near end of crossing (closer to viewer)
  const leftEdge = w * 0.08;   // left curb
  const rightEdge = w * 0.92;  // right curb
  const numStripes = 8;

  // Darker road patch under the crossing for contrast
  ctx.fillStyle = "#3A3A3A";
  ctx.fillRect(leftEdge, topY, rightEdge - leftEdge, bottomY - topY);

  ctx.fillStyle = "#FFFFFF";
  const totalDepth = bottomY - topY;
  for (let i = 0; i < numStripes; i++) {
    // Each stripe is a horizontal band spanning the road width
    // Stripes stack top-to-bottom along the road, getting wider with perspective
    const stripeTop = topY + totalDepth * (i / numStripes);
    const stripeBottom = topY + totalDepth * ((i + 0.55) / numStripes);

    // Perspective taper: far stripes are narrower than near stripes
    const progress = (stripeTop - topY) / totalDepth; // 0 = far, 1 = near
    const shrink = 0.70 + 0.30 * progress; // far end 70% width, near end full width
    const centerX = w * 0.5;
    const farHalfW = (rightEdge - centerX) * shrink;
    const nearHalfW = rightEdge - centerX;

    ctx.beginPath();
    ctx.moveTo(centerX - farHalfW, stripeTop);     // top-left
    ctx.lineTo(centerX + farHalfW, stripeTop);     // top-right
    ctx.lineTo(centerX + nearHalfW, stripeBottom);  // bottom-right
    ctx.lineTo(centerX - nearHalfW, stripeBottom);   // bottom-left
    ctx.closePath();
    ctx.fill();
  }
}

function drawTrafficLight(ctx, w, h, isRed) {
  const x = w * 0.78;
  const groundY = h * 0.72;

  ctx.fillStyle = "#444";
  ctx.fillRect(x - 3, h * 0.05, 6, groundY - h * 0.05);

  const boxW = 16;
  const boxH = 40;
  const boxX = x - boxW / 2;
  const boxY = h * 0.02;
  ctx.fillStyle = "#2A2A2A";
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 4);
  ctx.fill();

  // Red
  ctx.beginPath();
  ctx.arc(x, boxY + 9, 4, 0, Math.PI * 2);
  ctx.fillStyle = isRed ? "#EF4444" : "#3A0A0A";
  ctx.fill();
  if (isRed) {
    ctx.shadowColor = "rgba(239,68,68,0.6)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Yellow
  ctx.beginPath();
  ctx.arc(x, boxY + 20, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#4A3A0A";
  ctx.fill();

  // Green
  ctx.beginPath();
  ctx.arc(x, boxY + 31, 4, 0, Math.PI * 2);
  ctx.fillStyle = isRed ? "#0A3A0A" : "#22C55E";
  ctx.fill();
  if (!isRed) {
    ctx.shadowColor = "rgba(34,197,94,0.6)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawLamps(ctx, w, h) {
  [[0.15, 0.72], [0.5, 0.72], [0.85, 0.72]].forEach(([lx, ly]) => {
    const px = w * lx;
    const py = h * ly;
    ctx.fillStyle = "#444";
    ctx.fillRect(px - 2, py - h * 0.22, 3, h * 0.22);
    ctx.fillStyle = "#555";
    ctx.fillRect(px, py - h * 0.22 - 1, 20, 2);
    ctx.fillStyle = "#FFF8DC";
    ctx.beginPath();
    ctx.arc(px + 18, py - h * 0.22 - 1, 4, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    const glow = ctx.createRadialGradient(px + 18, py - h * 0.22 - 1, 1, px + 18, py - h * 0.22 - 1, 25);
    glow.addColorStop(0, "rgba(255,248,220,0.3)");
    glow.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px + 18, py - h * 0.22 - 1, 25, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawSceneFallback(ctx, w, h, isNight, nightProgress = 0) {
  const np = isNight ? 1 : nightProgress;

  // Below road (covered by dashboard)
  ctx.fillStyle = isNight ? "#050A14" : "#111";
  ctx.fillRect(0, h * 0.72, w, h * 0.28);

  drawSky(ctx, w, h, np);
  drawBuildings(ctx, w, h, np);
  drawRoad(ctx, w, h);
  drawZebraCrossing(ctx, w, h);
  drawTrafficLight(ctx, w, h, np < 0.5);
  if (np > 0.5) drawLamps(ctx, w, h);
}

// --- Character Drawing ---

export function drawCharacterImg(ctx, img, x, y, charW, charH) {
  ctx.drawImage(img, x - charW / 2, y - charH, charW, charH);
}

export function drawCharacterSilhouette(ctx, x, y, charW, charH, color) {
  ctx.fillStyle = color;
  const headR = charW * 0.18;
  const bodyW = charW * 0.45;
  const bodyH = charH * 0.4;
  const legH = charH * 0.35;

  ctx.beginPath();
  ctx.arc(x, y - charH + headR + 6, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - bodyW / 2, y - charH + headR * 2 + 6, bodyW, bodyH);
  ctx.fillRect(x - bodyW * 0.32, y - legH, bodyW * 0.28, legH);
  ctx.fillRect(x + bodyW * 0.04, y - legH, bodyW * 0.28, legH);
}
