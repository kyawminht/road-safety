// Background image (clean scene, no hazards)
export const SCENE_IMAGE = "/images/games/spot-danger-scene.png";

// Design resolution — matches the background image aspect ratio.
// All positions are fractions of this design area, NOT the canvas.
export const DESIGN_W = 1532;
export const DESIGN_H = 1026;

// 3 hazards — position & size as fractions (0–1) of the design area
export const HAZARDS = [
  {
    id: "no-helmet",
    type: "no-helmet",
    image: "/images/games/no-helmet.png",
    label: "ဦးထုပ်မဆောင်းဘဲ ဆိုင်ကယ်စီးခြင်း",
    labelEn: "Riding without helmet",
    emoji: "🏍️",
    x: 0.38, y: 0.42, w: 0.12, h: 0.18,
  },
  {
    id: "jaywalking",
    type: "jaywalking",
    image: "/images/games/jaywalking.png",
    label: "ဇီဘရားကူးမှ မဟုတ်ဘဲ လမ်းဖြတ်ကူးခြင်း",
    labelEn: "Crossing not at zebra",
    emoji: "🚶",
    x: 0.92, y: 0.46, w: 0.08, h: 0.16,
  },
  {
    id: "kids-football",
    type: "kids-football",
    image: "/images/games/kids-football.png",
    label: "လူသွားစင်္ကြံပေါ်တွင် ဘောလုံးကန်ခြင်း",
    labelEn: "Playing football on sidewalk",
    emoji: "⚽",
    x: 0.10, y: 0.30, w: 0.09, h: 0.22,
  },
];

// Build runtime hazard objects (no pixel conversion — done at draw time)
export function buildHazards() {
  return HAZARDS.map((hz) => ({
    ...hz,
    found: false,
  }));
}

// Check hit using design-fraction coordinates
export function checkHit(hazards, fracX, fracY) {
  for (const hz of hazards) {
    if (hz.found) continue;
    if (fracX >= hz.x && fracX <= hz.x + hz.w && fracY >= hz.y && fracY <= hz.y + hz.h) {
      return hz;
    }
  }
  return null;
}
