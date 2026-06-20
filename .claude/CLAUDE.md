# Road Safety Flip Cards — Claude Code Instructions

## Project Overview

A mobile-first Burmese road safety learning app for Myanmar students ages 6–17 and their parents.

The app teaches road safety through a **horizontal story-feed** of visual flip cards — like Instagram Stories but for road safety education.

## Core Interaction Model

**One interaction model everywhere**: Tap the card to flip it. Tap nav buttons to move between cards.

The user sees the wrong behavior first (red, ❌), then taps to reveal the correct behavior (green, ✅). Each card is one scenario in a continuous swipeable feed.

## 4 Design Principles

### 1. Flip/Reveal Comparison Card

- Show the "wrong" scene first with a red badge and ❌ mark
- User taps the card to reveal the "right" version with a green badge, ✅ mark, and one-line caption
- Same dopamine loop as before/after content on social media
- Zero reading needed — red vs green, X vs check teaches the core point
- Caption is optional depth for those who want it

### 2. Horizontal Story-Feed

- Continuous feed of cards, NOT a menu of rules
- Filter chips at top for categories (not separate pages)
- No multi-screen navigation tree
- "Look up and exit" behavior — keep swiping or leave whenever satisfied
- Categories: All, Walking, Helmet, Sidecar, Bicycle, Tricycle

### 3. Color and Iconography Carry Meaning

- Universal red/green plus X/check icons
- Consistent positioning — wrong always shown first, right always second
- Large tap targets
- Burmese captions stay short — a single clause, not a sentence
- The image does the teaching

### 4. Optional Gamified Quiz Mode

- Lightweight "Which one is safe?" toggle
- Child taps one of two images (wrong vs right from current card)
- Instant visual feedback — correct = green pulse, incorrect = red pulse
- Turns passive viewing into active recall for habit building

## Tech Stack

Use:

- React with Vite
- Tailwind CSS
- Framer Motion (for flip animation and transitions)
- React local state only
- Burmese Unicode text
- Noto Sans Myanmar font

Do not use:

- Phaser
- Canvas simulation
- Zustand
- react-confetti
- quiz engine
- score system
- authentication
- backend API

## Project Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── data/
│   └── flipCards.js
├── components/
│   ├── FlipCard.jsx
│   ├── FilterChips.jsx
│   ├── ProgressDots.jsx
│   └── QuizToggle.jsx
└── assets/
    ├── wrong_walking_with_adult.png
    └── right_walking_with_adult.png
```

## Required User Flow

1. User opens the app.
2. Single screen appears with filter chips at top.
3. First card shows wrong behavior (red side, ❌).
4. User taps card → flips to correct behavior (green side, ✅).
5. User taps prev/next to navigate between cards.
6. When changing cards, new card resets to wrong/front side.
7. User can filter by topic using chips at top.
8. User can toggle quiz mode ("which one is safe?").

## Component Specifications

### App.jsx

Main controller. Single-screen layout:

- Fixed header with app title
- FilterChips row
- Story card area (FlipCard)
- Instruction text
- ProgressDots
- Prev/next navigation
- Quiz mode toggle

State:
- `activeFilter` (null = all, or topic ID)
- `currentIndex` (position in filtered cards)
- `isFlipped` (card flip state)
- `isQuizMode` (quiz mode active)

### FilterChips.jsx

Horizontally scrollable row of filter chips:
- First chip: "အားလုံး" (All) with 🚦
- 5 topic chips: 🚶‍♂️ လူသွား, ⛑️ ဦးထုပ်, 🛵 ဘေးတွဲ, 🚲 စက်ဘီး, 🛺 သုံးဘီး
- Active chip = filled teal/dark, inactive = outline
- Smooth scroll selected chip into view
- Changing filter resets currentIndex to 0 and isFlipped to false

### FlipCard.jsx

Story-card format. Uses Framer Motion 3D flip:

Front side (wrong):
- Red gradient header strip with ❌ + "မလုပ်ရ" badge
- Large image area showing wrong behavior
- Short Burmese description at bottom

Back side (correct):
- Green gradient header strip with ✅ + "လုပ်ရမယ်" badge
- Large image area showing correct behavior
- Short Burmese rule at bottom

Requirements:
- `aspectRatio: 3/4` for vertical story card feel
- `whileTap={{ scale: 0.97 }}` for tactile feedback
- Keyboard accessible with Burmese aria-label
- `backface-visibility: hidden` on both sides
- 3D perspective wrapper

### ProgressDots.jsx

Shows dot indicators for current card position within filtered set. Active dot = teal with glow, inactive = gray.

### QuizToggle.jsx

Toggleable quiz mode overlay:
- Shows two images side by side (wrong vs right from current card)
- Child taps which one is safe
- Correct → green pulse + ✅
- Incorrect → red pulse + ❌, try again
- Uses same card data (wrongImage/rightImage)
- Lightweight, not a full quiz engine

## Data File

`src/data/flipCards.js` exports:
- `TOPICS` — 5 topic objects with id, title, emoji
- `FLIP_CARDS` — 14+ card objects with topicId, frontLabel, backLabel, shortRule, frontVisual, backVisual, wrongImage, rightImage

Data shape:

```js
export const TOPICS = [
  { id: "walking", title: "လူသွားစင်္ကြံ စည်းကမ်း", emoji: "🚶‍♂️" },
  // ...
];

export const FLIP_CARDS = [
  {
    id: "walking-1",
    topicId: "walking",
    frontLabel: "မလုပ်ရ",
    backLabel: "လုပ်ရမယ်",
    shortRule: "လူသွားစင်္ကြံပေါ်မှာ လမ်းလျှောက်ပါ",
    frontVisual: "ကားလမ်းပေါ်မှာ လမ်းလျှောက်နေသည်",
    backVisual: "လူသွားစင်္ကြံပေါ်မှာ လုံခြုံစွာ လျှောက်နေသည်",
    wrongImage: WrongImage,
    rightImage: RightImage,
  },
  // ...
];
```

## Topics

1. Walking Safety (walking) — 🚶‍♂️
2. Helmet Safety (helmet) — ⛑️
3. Sidecar Safety (sidecar) — 🛵
4. Bicycle Safety (bicycle) — 🚲
5. Tricycle/Tuk-Tuk Safety (tricycle) — 🛺

## Flip Card Visual Rules

Front side (wrong):
- Red gradient header strip
- Big ❌ mark overlay
- Label: မလုပ်ရ
- Large emoji
- wrongImage displayed
- frontVisual text (short description)

Back side (correct):
- Green gradient header strip
- Big ✅ mark overlay
- Label: လုပ်ရမယ်
- Large emoji
- rightImage displayed
- shortRule text (the rule to follow)

## Mobile Design

- Target width: 320px to 428px
- Large touch targets (min 48px)
- No horizontal overflow
- Portrait orientation
- min-h-dvh for full-screen feel
- Comfortable spacing

## Tailwind Colors

- Navy: #0F1A2E
- Warm blue: #1E3A5F
- Teal: #0D9488
- Soft red: #FEE2E2
- Deep red: #DC2626
- Soft green: #DCFCE7
- Deep green: #16A34A
- Warm gray bg: #F8FAFC
- Dark text: #1E293B

## Burmese Text Reference

- App title: လမ်းအန္တရာယ်ကင်းရှင်းရေး
- Subtitle: မှားတာကိုကြည့်ပြီး အမှန်ကိုလှန်ကြည့်ပါ
- Wrong label: မလုပ်ရ
- Right label: လုပ်ရမယ်
- Instruction: ကတ်ကိုနှိပ်ပြီး အမှန်ကိုကြည့်ပါ
- Previous: ရှေ့တစ်ခု
- Next: နောက်တစ်ခု
- All filter: အားလုံး
- Quiz mode: ဘယ်ဟာက လုံခြုံသလဲ
- Correct: မှန်တယ်
- Try again: ထပ်ကြိုးစားပါ

## Implementation Notes

- Flip animation uses 3D CSS transform via Framer Motion
- Card starts on front (wrong) side — rotateY: 0
- Flipped = rotateY: 180 on the motion wrapper
- Both sides use `backfaceVisibility: hidden`
- When changing card, reset `isFlipped` to false
- Filter change resets index to 0 and isFlipped to false
- All user-facing text in Burmese Unicode (Noto Sans Myanmar)

## Verification Checklist

1. App opens to single story-feed screen
2. Filter chips visible at top (6 chips: All + 5 topics)
3. First card shows wrong/front side (red, ❌)
4. Tapping card flips to correct/back side (green, ✅)
5. Tapping again flips back to wrong side
6. Next button goes to next card
7. New card resets to wrong/front side
8. Previous button works
9. Filter chips filter cards correctly
10. Changing filter resets to first card (wrong side)
11. Progress dots reflect position in filtered set
12. Quiz toggle shows two-image comparison
13. All visible text is Burmese
14. No quiz/score/game UI in main mode
15. No Canvas simulation
16. `npm run build` succeeds
