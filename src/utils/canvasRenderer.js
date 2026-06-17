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

export function generateBuildings(w, h) {
  const buildingH = h * 0.22;
  const y = h * 0.28;
  const buildings = [];
  for (let x = 0; x < w; x += 60 + Math.random() * 40) {
    const bw = 40 + Math.random() * 30;
    const bh = buildingH * (0.6 + Math.random() * 0.4);
    buildings.push({
      x,
      bw,
      bh,
      color: BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)],
    });
  }
  return buildings;
}

export function drawBuildings(ctx, buildings, h) {
  const buildingH = h * 0.22;
  const y = h * 0.28;
  for (const b of buildings) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, y + buildingH - b.bh, b.bw, b.bh);
    ctx.fillStyle = '#64748B';
    for (let wy = y + buildingH - b.bh + 8; wy < y + buildingH - 4; wy += 12) {
      ctx.fillRect(b.x + 6, wy, 8, 7);
      ctx.fillRect(b.x + b.bw - 14, wy, 8, 7);
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
  const { wearingHelmet = false } = options;
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
