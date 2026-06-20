# Plan: Impressive V1 Launch — Road Safety Flip Cards

## Diagnosis: Why Users Won't Use the Current Version

| # | Problem | Severity |
|---|---------|----------|
| 1 | **Same 2 images for all 12 cards** — helmet card shows walking photo. Makes the app feel fake/broken. | 🔴 Critical |
| 2 | **No real flip animation** — just an opacity fade. The "flip card" promise isn't delivered. | 🔴 Critical |
| 3 | **Press button, not card** — user must hit a button at bottom instead of tapping the card itself. | 🔴 Critical |
| 4 | **No filter chips** — all 12 cards in one undifferentiated scroll. Can't browse by topic. | 🟠 High |
| 5 | **No quiz mode** — no active recall. Just passive viewing. | 🟠 High |
| 6 | **No onboarding** — user lands with no guidance on how to interact. | 🟡 Medium |
| 7 | **ProgressDots component unused** — built but not rendered. | 🟡 Medium |

## Solution: 3-Tier Plan

---

## Tier 1 — Fix the Broken Core (must ship)

### 1A. Rich Emoji-Scene Illustrations Per Card

Replace the 2 reused PNGs with **unique, colorful emoji-based scene illustrations** for each of the 12 cards. Each card gets its own distinct wrong/right visual using large emojis, CSS gradients, and layered composition.

**Why emoji scenes instead of PNGs/SVGs:**
- Zero external assets needed — no artist, no stock photos
- Large, colorful, immediately recognizable to kids 6-17
- Works offline, tiny bundle size
- Each card looks genuinely different from the others

**Scene designs per card (sketched):**

| Card | Wrong Scene | Right Scene |
|------|------------|-------------|
| walking-1 | 🚗 person on road, red bg | 🚶 person on sidewalk, green bg |
| walking-2 | ⚽ kids playing on road, red bg | 🏠 kids in safe yard, green bg |
| walking-3 | 👧 child on traffic side, red bg | 👨‍👧 adult holding child safe side, green bg |
| walking-4 | 🚶 back to 🚗, red bg | 🚶 facing 🚗 direction, green bg |
| helmet-1 | 🏍️ rider no helmet, red bg | 🏍️⛑️ rider with helmet, green bg |
| helmet-2 | ⛑️ unbuckled strap, red bg | ⛑️ buckled strap, green bg |
| sidecar-1 | 🛵 many stick figures, red bg | 🛵 2 stick figures, green bg |
| sidecar-2 | 🧍 standing on sidecar, red bg | 🧎 sitting properly, green bg |
| bicycle-1 | 🚲🚲 side by side, red bg | 🚲🚲 single file line, green bg |
| bicycle-2 | 🚲 rider no helmet, red bg | 🚲⛑️ rider with helmet, green bg |
| tricycle-1 | 🛺🧍 standing behind, red bg | 🛺🧎 sitting inside, green bg |
| tricycle-2 | 🛺👥👥👥 overcrowded, red bg | 🛺👥 safe capacity, green bg |

**Implementation:** New component `SceneIllustration.jsx` that takes a `scene` prop and renders the appropriate emoji composition with gradient backgrounds, animated subtle float, and large emojis.

### 1B. Proper 3D Card Flip

Replace the current opacity crossfade with a genuine 3D card flip using Framer Motion `rotateY`.

- Card wrapper with `perspective: 1200px`
- Front side: `rotateY: 0` → shows wrong behavior
- Back side: `rotateY: 180` → shows correct behavior
- Both sides have `backfaceVisibility: 'hidden'`
- Tap anywhere on the card to trigger the flip
- `whileTap={{ scale: 0.97 }}` for tactile feedback
- Smooth 0.5s animation with spring physics

### 1C. Tap Card, Not Button

Remove the "အမှန်ကိုကြည့်ရန် နှိပ်ပါ" button. The entire card is the tap target. An instruction hint ("👆 ကတ်ကိုနှိပ်ပါ") fades after first use.

---

## Tier 2 — Complete the Spec (should ship)

### 2A. Filter Chips

Horizontally scrollable row of 6 chips:
- 🚦 အားလုံး (All)
- 🚶‍♂️ လူသွား
- ⛑️ ဦးထုပ်
- 🛵 ဘေးတွဲ
- 🚲 စက်ဘီး
- 🛺 သုံးဘီး

Active chip = filled teal bg with white text. Inactive = white/transparent outline. Changing filter resets to card 0, wrong side.

### 2B. Progress Dots

Render the existing `ProgressDots` component in the UI. Shows dot indicators for current position within the filtered set. Active dot = teal glow, inactive = gray.

### 2C. Quiz Mode Toggle

A toggle button that switches to quiz mode for the current card:
- Shows wrong and right images side-by-side
- "ဘယ်ဟာက လုံခြုံသလဲ" prompt
- Tap the correct one → green pulse + ✅ + "မှန်တယ်"
- Tap the wrong one → red pulse + ❌ + "ထပ်ကြိုးစားပါ"
- Uses data already in flipCards (wrongImage/rightImage fields will be mapped to scene components)

---

## Tier 3 — Delight & Retention (makes it impressive)

### 3A. Onboarding Flow

Before the first card, show 3 quick onboarding screens:
1. "ကတ်ကိုနှိပ်ပါ" — animated tap demo (card flips)
2. "အပေါ်ကိုဆွဲတင်ပါ" — animated swipe demo (next card)
3. "ဘယ်ဟာက လုံခြုံသလဲ" — quiz mode preview

Swipe through onboarding, then enter the feed. Skip button available. Only shown on first launch (localStorage flag).

### 3B. Category Completion Sparkle

When the user flips the last card in a filtered category, show a subtle sparkle/celebration overlay (no react-confetti — use pure Framer Motion particles). Text: "အားလုံးပြီးပါပြီ! 🎉"

### 3C. Share Card

After flipping a card, a small share icon appears. Tapping it generates a shareable image (using Canvas API to compose the right scene + rule text) that can be shared to Facebook Messenger, Viber, etc. This is the viral growth loop for Myanmar.

### 3D. Sound Cues (Web Audio API)

Tiny synthesized sounds (no audio files):
- Flip whoosh: short noise burst, 80ms
- Correct ding: two-tone ascending blip, 150ms
- Wrong buzz: low-frequency pulse, 200ms

Sound is off by default, toggleable. Uses Web Audio API oscillator — zero bytes of audio assets.

---

## Component Architecture (Final)

```
src/
├── App.jsx                    ← Main controller (rewrite)
├── main.jsx                   ← No changes
├── index.css                  ← Add scene animation keyframes
├── data/
│   └── flipCards.js           ← Add scene IDs, keep existing structure
├── components/
│   ├── FlipCard.jsx           ← 3D flip with SceneIllustration (rewrite)
│   ├── SceneIllustration.jsx  ← NEW: emoji scene renderer
│   ├── FilterChips.jsx        ← NEW: horizontal filter chips
│   ├── ProgressDots.jsx       ← Existing, minor tweaks
│   ├── QuizToggle.jsx         ← NEW: quiz mode overlay
│   ├── OnboardingSlides.jsx   ← NEW: 3-slide onboarding
│   ├── SparkleOverlay.jsx     ← NEW: celebration particles
│   └── ShareButton.jsx        ← NEW: share card as image
├── hooks/
│   └── useSound.js            ← NEW: Web Audio API sound cues
└── assets/
    └── (keep existing PNGs as fallback, not primary)
```

---

## Implementation Order

1. **Create `SceneIllustration.jsx`** — the visual foundation everything depends on
2. **Update `flipCards.js`** — add `sceneId` field per card
3. **Rewrite `FlipCard.jsx`** — 3D flip with SceneIllustration, tap-to-flip
4. **Create `FilterChips.jsx`** — topic navigation
5. **Create `QuizToggle.jsx`** — quiz mode
6. **Rewrite `App.jsx`** — wire everything together, render ProgressDots
7. **Create `OnboardingSlides.jsx`** — first-launch guidance
8. **Create `useSound.js` + wire sounds** — audio feedback
9. **Create `SparkleOverlay.jsx`** — category completion
10. **Create `ShareButton.jsx`** — shareable cards
11. **Final polish** — `index.css`, animation tuning, responsive checks
12. **`npm run build`** — verify production build succeeds

---

## Verification Checklist

- [ ] Each of 12 cards shows a unique, distinct visual scene
- [ ] Card flips with 3D rotateY animation when tapped anywhere
- [ ] Filter chips filter cards by topic
- [ ] Changing filter resets to card 0, wrong side
- [ ] Progress dots reflect current position in filtered set
- [ ] Quiz mode shows side-by-side comparison
- [ ] Correct answer = green pulse, incorrect = red pulse + retry
- [ ] Onboarding appears on first launch, skippable
- [ ] Category completion shows sparkle celebration
- [ ] Share button generates shareable card image
- [ ] Sound cues play on flip/correct/incorrect (off by default)
- [ ] All user-facing text in Burmese
- [ ] `npm run build` succeeds with zero errors
- [ ] Works on 320px–428px mobile viewport
