# Story Feed Redesign Plan

## Summary

Redesign the app from a vertical-scrolling multi-section layout into a **horizontal story-feed** (Instagram Stories-style) with filter chips at top. One interaction model everywhere: **tap to flip, swipe/navigate to advance**.

## User's 4 Design Principles

1. **Flip/reveal comparison card** — Wrong scene first (red badge), tap to reveal right version (green badge + one-line caption). Social-media dopamine loop. Zero reading needed (red vs green, X vs check).
2. **Horizontal story-feed** — Continuous feed like Instagram Stories. Filter chips at top for categories. No multi-screen navigation tree. "Look up and exit" behavior.
3. **Color and iconography carry meaning** — Red/green + X/check. Consistent positioning. Burmese captions short (single clause).
4. **Optional gamified quiz mode** — "Which one is safe?" with two images, instant feedback. Active recall for habit building.

**Core UX principle**: One interaction model everywhere. Never vary whether "right" is left or right.

## New Architecture

### Single-Screen App

```
┌──────────────────────────┐
│  🚦 App Title            │  ← Fixed header
│  မှားတာကိုကြည့်...       │
├──────────────────────────┤
│  [All] [🚶] [⛑️] [🛵].. │  ← Horizontal scrollable filter chips
├──────────────────────────┤
│                          │
│   ┌──────────────────┐   │
│   │   ❌  မလုပ်ရ      │   │
│   │                  │   │
│   │   [WRONG IMAGE]  │   │  ← Story card (full card area)
│   │                  │   │
│   │  Description     │   │
│   └──────────────────┘   │
│                          │
│  👆 ကတ်ကိုနှိပ်ပါ         │  ← Instruction
│                          │
│  ● ○ ○ ○                │  ← Progress dots
│  ◀ ရှေ့တစ်ခု   နောက်တစ်ခု ▶ │  ← Navigation
│                          │
│  [🎮 Quiz Mode]          │  ← Optional quiz toggle
└──────────────────────────┘
```

### State

| State | Type | Description |
|-------|------|-------------|
| `activeFilter` | `string \| null` | `null` = all, or topic ID |
| `currentIndex` | `number` | Position in filtered cards |
| `isFlipped` | `boolean` | Card flip state |
| `isQuizMode` | `boolean` | Quiz mode active |

### Filtered Cards

```js
const filteredCards = activeFilter === null 
  ? FLIP_CARDS 
  : FLIP_CARDS.filter(c => c.topicId === activeFilter)
```

## Component Changes

### DELETE (6 files)

- `HeroSection.jsx` — replaced by filter chips header
- `TopicSection.jsx` — replaced by single-card story feed
- `StickyHeader.jsx` — simplified inline header
- `FooterSection.jsx` — no more vertical scrolling
- `NavigationControls.jsx` — replaced by inline nav in story feed

### CREATE (2 files)

- `FilterChips.jsx` — Horizontal scrollable filter chips (All + 5 topics)
- `QuizToggle.jsx` — Quiz mode with "which one is safe?" two-image comparison

### MODIFY (4 files)

- `App.jsx` — Complete rewrite: single screen with story feed
- `FlipCard.jsx` — Simplify for story-card format, keep 3D flip
- `ProgressDots.jsx` — Minor tweaks for new context
- `.claude/CLAUDE.md` — Update with new specs

### KEEP (4 files)

- `main.jsx` — No changes
- `index.css` — Minor additions only
- `data/flipCards.js` — Keep structure, enhance with quiz fields
- `package.json` — No changes

## FlipCard Redesign

Simplify to a story-card format:

- **Front (wrong)**: Red top strip with ❌ badge + "မလုပ်ရ", large image area, short description
- **Back (correct)**: Green top strip with ✅ badge + "လုပ်ရမယ်", large image area, short rule
- Keep Framer Motion 3D flip animation
- Keep `whileTap={{ scale: 0.97 }}` for tactile feedback
- Use `aspectRatio: '3/4'` for vertical story card feel
- Ensure keyboard accessibility with aria-label in Burmese

## Filter Chips Design

- Horizontally scrollable row
- First chip = "အားလုံး" (All) with 🚦 emoji
- Then 5 topic chips with emoji + short name
- Active chip = filled/solid, inactive = outline
- Smooth scroll to selected chip
- Chips are: အားလုံး, 🚶‍♂️ လူသွား, ⛑️ ဦးထုပ်, 🛵 ဘေးတွဲ, 🚲 စက်ဘီး, 🛺 သုံးဘီး

## Quiz Mode

Toggleable mode:
- Show two images side by side (wrong vs right from current card)
- Child taps which one is safe
- Correct = green pulse + ✅
- Incorrect = red pulse + try again
- Uses the same card's wrongImage/rightImage
- Simple and lightweight, not a full quiz engine

## Implementation Order

1. Update CLAUDE.md with new specs
2. Update `data/flipCards.js` if needed
3. Create `FilterChips.jsx`
4. Create `QuizToggle.jsx`
5. Rewrite `FlipCard.jsx` (story-card format)
6. Rewrite `App.jsx` (story feed main screen)
7. Tweak `ProgressDots.jsx` and `index.css`
8. Delete old components
9. `npm run build` to verify
10. Verify all 16 checkpoints from CLAUDE.md
