# Redesign: Modern Flip Cards with SVG Illustrations

## Problem
- Flip cards use full red/green backgrounds with giant emoji — looks amateurish
- Too much text (frontVisual + backVisual paragraphs)
- Not properly responsive on different screen sizes

## Plan

### 1. Reduce text in data file (flipCards.js)
- Remove `frontVisual` and `backVisual` long description fields
- Keep `frontLabel` (မလုပ်ရ), `backLabel` (လုပ်ရမယ်), `shortRule`
- Add `scene` field per card to tell the illustration which scene to render

### 2. Create SVG scene illustrations (`src/components/scenes/`)
- One file per scene or a single `SceneIllustration.jsx` that renders the right SVG
- Simple, clean vector scenes using basic shapes
- Each scene has a wrong variant and right variant
- Scenes needed: walking, playing, child-with-adult, facing-traffic, helmet, helmet-buckle, sidecar-overload, sidecar-standing, bicycle-side-by-side, bicycle-helmet, tricycle-standing, tricycle-overload

### 3. Redesign FlipCard.jsx — Modern Tailwind card
- White card body with `shadow-xl`, `rounded-2xl`
- Thin colored accent bar at top (red for wrong, green for correct)
- SVG illustration fills most of the card (clean, simple scene)
- Small badge: ❌ + မလုပ်ရ or ✅ + လုပ်ရမယ်
- One short rule text at bottom
- Card flips with same 3D animation but looks like a modern card

### 4. Make all screens responsive
- Use `max-w-md mx-auto` consistently
- Ensure proper padding at all breakpoints
- FlipCard should be flexible height, not fixed 420px
- Navigation buttons should be properly spaced

### 5. Polish HomeScreen and TopicGrid
- Cleaner card design for topic cards
- Better spacing and responsive grid

### Files to modify
- `src/data/flipCards.js` — simplify, add scene field
- `src/components/FlipCard.jsx` — complete redesign
- `src/components/FlipCardScreen.jsx` — responsive tweaks
- `src/components/HomeScreen.jsx` — responsive tweaks
- `src/components/TopicGrid.jsx` — cleaner cards
- New: `src/components/scenes/` — SVG illustration components
