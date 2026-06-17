# Road Safety Simulation — Design Spec

**Date:** 2026-06-17
**Status:** Approved

## Overview

A mobile-first, Burmese-language web app that teaches road safety to Myanmar students (ages 6-17) through self-playing 2D simulations. The student opens a link, watches the simulation feed, and learns road safety rules — no taps, clicks, or interaction required.

**Core insight:** Students don't read safety rules. They scroll through content on their phones. This app meets them where they are — a vertical feed of auto-playing road safety lessons.

## App Flow

The app is a **single vertical feed of 5 module cards**. Each card auto-plays a wrong-then-right simulation. When one finishes, the feed auto-scrolls to the next.

### The 4-Phase Auto-Play Sequence (per module)

1. **Phase 1: Wrong Way** (4-6 sec) — Canvas animation. Student character does the dangerous action. Vehicle collision. Red flash.
2. **Phase 2: Lesson Overlay** (3 sec) — Burmese text overlay explains what went wrong and the correct rule. Big emoji, short text.
3. **Phase 3: Right Way** (4-6 sec) — Canvas replays. Student does the correct action. Arrives safely. Green flash.
4. **Phase 4: Celebrate** (2 sec) — Confetti burst, module fades as "complete", auto-scroll to next card.

**No buttons. No choices. No tapping needed.** The student just watches.

### When All 5 Finish

A gentle completion message at the bottom: "သင်ခန်းစာအားလုံးပြီးပါပြီ" (All lessons complete). Scrolling back up replays modules.

## The 5 Learning Modules

### Module 1: 🚶‍♂️ လူသွားစင်္ကြံ စည်းကမ်း (Sidewalk Rule)
- **Wrong:** Student walks on the road, car hits
- **Lesson:** "လူသွားစင်္ကြံပေါ်မှာသွားပါ" (Walk on the sidewalk)
- **Right:** Student walks on sidewalk, arrives safely

### Module 2: ⛑️ ဦးထုပ်ဆောင်းခြင်း (Helmet Challenge)
- **Wrong:** Student on motorcycle without helmet, accident
- **Lesson:** "ဦးထုပ်အမြဲဆောင်းပါ" (Always wear a helmet)
- **Right:** Student wears helmet with tight strap, safe ride

### Module 3: 🛵 ဘေးတွဲစီးနည်း (Sidecar Rules)
- **Wrong:** 3+ people crowded on sidecar, one falls
- **Lesson:** "ဘေးတွဲမှာ ၂ ယောက်ထက်ပိုမစီးရ" (Max 2 people in sidecar)
- **Right:** 2 people sitting properly, safe ride

### Module 4: 🚲 စက်ဘီးစီးနည်း (Bicycle Rules)
- **Wrong:** Two students riding side-by-side on road
- **Lesson:** "တစ်ယောက်ချင်းစီစီးပါ" (Ride single file)
- **Right:** Single file on right side of road

### Module 5: 🛺 သုံးဘီးဆိုင်ကယ်စီးနည်း (Tricycle/Tuk-Tuk Rules)
- **Wrong:** Student standing on back of moving tricycle, falls
- **Lesson:** "ထိုင်ပြီးစီးပါ" (Sit properly while riding)
- **Right:** Student sitting inside properly, safe ride

## Component Architecture

```
src/
├── App.jsx                    ← Root: renders SimulationFeed
├── components/
│   ├── SimulationFeed.jsx     ← Vertical scroll container, manages module sequencing
│   ├── ModuleCard.jsx         ← One card = one module. Orchestrates Canvas + Overlay
│   ├── SimulationCanvas.jsx   ← Canvas element. Renders wrong/right runs
│   ├── LessonOverlay.jsx      ← Slides in after wrong run. Burmese text + emoji
│   └── ConfettiOverlay.jsx    ← Confetti burst on correct completion
├── data/
│   └── modules.js             ← 5 modules: id, emoji, title, lesson text, canvas config
├── hooks/
│   ├── useAutoPlay.js         ← Timer-based sequencing: wrong→lesson→right→confetti→done
│   └── useSimulation.js       ← Canvas animation loop per module scenario
└── utils/
    └── canvasRenderer.js      ← Drawing functions: student, vehicles, road, buildings
```

### Component Responsibilities

**SimulationFeed** — Renders all 5 ModuleCards in a vertical scroll. Tracks which index is currently playing. When a ModuleCard signals "done", advances to next index and programmatically scrolls.

**ModuleCard** — Wraps SimulationCanvas + LessonOverlay + ConfettiOverlay. Uses useAutoPlay to sequence the 4 phases. Each card has its own play lifecycle; only one card plays at a time.

**SimulationCanvas** — A `<canvas>` element. Receives module config + play phase. Uses useSimulation to run requestAnimationFrame drawing. Two modes: "wrong" and "right" based on current phase.

**LessonOverlay** — Positioned absolutely over the canvas. Slides in with Framer Motion after wrong run. Shows emoji, Burmese lesson text (max 2 lines). Slides out before right run.

**ConfettiOverlay** — Uses react-confetti. Fires on right run completion. 2-second burst then fades.

### Separation of Concerns

- **Canvas only handles drawing** — no UI, no text, no DOM interaction
- **React handles all UI** — lesson text, overlays, scroll management, timing
- **Data lives in `modules.js`** — all module-specific content in one place
- **Hooks encapsulate timing and animation logic** — components stay thin

## Data Flow & State

### LocalStorage (minimal)

```
Key: "road-safety-seen"
Value: { "module-1": true, "module-2": false, ... }
Purpose: On revisit, shuffle unseen modules to the top
```

### State Ownership

| State | Owner | Description |
|-------|-------|-------------|
| `activeIndex` | SimulationFeed | Which card is currently playing (0-4) |
| `phase` | ModuleCard (via useAutoPlay) | wrong → lesson → right → confetti → done |
| `animationFrame` | SimulationCanvas (via useSimulation) | Canvas frame loop, local to each card |

No global store needed. State flows down through props. ModuleCard signals up via `onComplete` callback.

**App.jsx renders exactly one thing:**
```jsx
function App() {
  return <SimulationFeed />;
}
```

## Canvas Simulation Design

### Common Visual Elements

- **Student:** White shirt (အင်္ကျီဖြူ), green longyi (ပုဆိုးစိမ်း), simple 2D figure
- **Road:** Horizontal strip with dashed center line
- **Background:** Sky gradient, simple buildings/trees
- **Vehicles:** Simple car, motorcycle, tricycle shapes depending on module

### Drawing Strategy

All elements are drawn with simple shapes (rectangles, circles, arcs) — no image assets needed:
- Student: Rounded rectangle body + circle head + simple limbs
- Vehicles: Rectangles with circles for wheels
- Road: Filled rectangle with dashed line
- Buildings: Simple rectangle blocks

### Canvas Configuration

- Width: 100vw (responsive to device)
- Height: 350-400px (fixed per card)
- Device pixel ratio: Capped at 2x for performance
- Frame rate: 60fps via requestAnimationFrame

### Wrong Run Flow (4-6 seconds)

```
Frame 0-60:  Student enters from left, walking on road
Frame 60-90: Vehicle approaches from right
Frame 90-120: Collision — screen flashes red, student knocked back
Frame 120-180: Scene freezes, LessonOverlay takes over
```

### Right Run Flow (4-6 seconds)

```
Frame 0-60:  Student enters from left, doing correct action
Frame 60-120: Vehicle passes safely or student avoids
Frame 120-180: Student exits right, green flash, ConfettiOverlay fires
```

### Module Canvas Variations

Each module has different entity positions via config in `modules.js`:

| Module | Entities in Scene | Wrong Behavior | Right Behavior |
|--------|-------------------|----------------|----------------|
| Walking | Student, car, sidewalk | Student on road | Student on sidewalk |
| Helmet | Student+driver on motorcycle | No helmet | Helmet visible |
| Sidecar | Student, motorcycle+sidecar, 3 people | Overcrowded | 2 people sitting |
| Bicycle | 2 students on bikes | Side-by-side | Single file |
| Tricycle | Student, tricycle | Standing on back | Sitting inside |

## Auto-Play Timing

```
Phase         Duration    Action
─────────────────────────────────────
wrong-run     5 sec       Canvas plays wrong scenario
lesson        3 sec       LessonOverlay slides in, stays
right-run     5 sec       Canvas plays right scenario  
confetti      2 sec       Confetti bursts
transition    1 sec       Auto-scroll to next card
─────────────────────────────────────
Total         16 sec      Per module
```

All 5 modules play in ~80 seconds total. The user watches the entire feed in under 2 minutes.

## Technology Choices

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2+ | Component framework |
| Vite | 8.0+ | Build tool |
| Tailwind CSS | 4.3+ | Styling |
| Framer Motion | Latest | LessonOverlay slide-in, scroll transitions |
| react-confetti | Latest | Confetti celebration |
| HTML Canvas 2D | Native | Simulation rendering |

**No added:** Zustand, React Router, image assets, authentication, backend

## Design System

### Colors
- Primary Blue: `#1E3A5F` — card backgrounds, headers
- Success Green: `#10B981` — right run indicator
- Danger Red: `#EF4444` — wrong run flash, lesson emphasis
- Warning Yellow: `#F59E0B` — lesson overlay background
- Background: `#0F172A` — feed background
- Card: `#FFFFFF` — module cards

### Typography
- Font: `'Noto Sans Myanmar', sans-serif`
- Lesson text: 20px, Bold
- Module title: 22px, Bold
- Module emoji: 32px+ for visual impact

### Mobile-First Constraints
- Target: 320px–428px width screens
- Touch targets: Not applicable (no interaction needed)
- Card size: Full width, ~450px height (canvas + lesson area)
- No horizontal scroll
- Respect device safe areas (notch, home indicator)

## Error Handling

- **Canvas fails to render:** Show fallback card with static lesson content
- **Browser doesn't support Canvas:** Degrade to animated CSS scene cards
- **JavaScript disabled:** Show static Burmese text lessons (basic HTML)
- **Slow network:** All content is in JS bundle — no network calls needed after initial load

## 🌐 Language: 100% Burmese (ျမန္မာလို)

**Every piece of user-facing text MUST be in Burmese.** This includes:

- Module titles (e.g., "လူသွားစင်္ကြံ စည်းကမ်း")
- Lesson overlay text (e.g., "လူသွားစင်္ကြံပေါ်မှာသွားပါ")
- Completion message ("သင်ခန်းစာအားလုံးပြီးပါပြီ")
- Any labels, titles, or visible text

**Technical requirement:** Use Unicode Burmese, NOT Zawgyi. The `Noto Sans Myanmar` font handles this correctly.

**No English fallback.** The app has no language switcher, no English translations. If a module data field exists, its value must be in Burmese.

## What This App Does NOT Include

- No authentication or user accounts
- No badges, points, or gamification
- No buttons or interactive choices
- No sound or audio
- No backend or API calls
- No install/PWA requirement
- No image assets (all drawn with Canvas primitives)

## Success Metrics

1. **Time to first lesson:** Under 3 seconds from link open
2. **Completion rate:** Students watch all 5 modules without dropping off
3. **Bundle size:** Under 150KB gzipped (works on slow Myanmar mobile data)
4. **Performance:** 60fps Canvas on mid-range phones
