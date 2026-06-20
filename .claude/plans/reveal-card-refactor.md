# Reveal Card Refactor Plan

## Overview

Replace the 3D-flip card system with a **button-based wrong/right reveal card** system using smooth fade transitions. Add a home screen with topic grid. Add vertical scroll feed with scroll-to navigation.

## Architecture Changes

```
App.jsx
├── Home Screen (selectedTopic === null)
│   ├── Header banner
│   ├── Title + subtitle
│   └── 5 topic cards (grid)
│
└── Topic Feed (selectedTopic !== null)
    ├── Simple header (title + back button)
    ├── Topic title + progress
    └── Vertical scroll of RevealCards
        └── RevealCard (× N cards)
            ├── Image area (wrongImage or rightImage, fade trans)
            ├── Status pill (မလုပ်ရ / လုပ်ရမယ်)
            ├── Main text (frontVisual / shortRule)
            ├── Big reveal button
            └── Prev/next nav buttons
```

## Files

| File | Action | Notes |
|------|--------|-------|
| `RevealCard.jsx` | CREATE | Replaces FlipCard.jsx with reveal-button model |
| `TopicFeed.jsx` | CREATE | Vertical card feed with scrollIntoView nav |
| `App.jsx` | REWRITE | 2-screen mode: home vs topic feed |
| `ProgressDots.jsx` | KEEP | Works as-is, may be used in TopicFeed |
| `index.css` | UPDATE | Minor additions |
| `data/flipCards.js` | KEEP | No data changes needed |
| `main.jsx` | KEEP | No changes |
| `FlipCard.jsx` | DELETE | Replaced by RevealCard |
| `FilterChips.jsx` | DELETE | No more horizontal category bar |
| `QuizToggle.jsx` | DELETE | Focus is reveal flow, not quiz |

## RevealCard Design

- Card: white bg, rounded-[28px], shadow-xl, min-h-[75dvh], max-w-[390px], mx-auto
- Image: 60% height, object-cover, fades between wrongImage/rightImage via AnimatePresence
- Status pill: bg-red-50/text-red-600 (မလုပ်ရ) or bg-green-50/text-green-600 (လုပ်ရမယ်)
- Main text: card.frontVisual (wrong) or card.shortRule (right), text-xl font-bold
- Reveal button: full-width, h-[52px], rounded-2xl, green bg (wrong state) or slate/red outline (right state)
- Nav: two equal buttons at bottom (ရှေ့တစ်ခု / နောက်တစ်ခု), bg-slate-100

## Interaction Flow

1. User sees wrong image + red status + "အမှန်ကိုကြည့်ရန် နှိပ်ပါ" button
2. Taps button → smooth fade to right image + green status + "အမှားကိုပြန်ကြည့်ရန်" button
3. Taps again → fades back to wrong image
4. Scrolls down → next card in vertical feed (starts unrevealed)
5. Nav buttons → scrollIntoView to prev/next card

## No Swipe — Buttons Only

Skip drag/swipe to avoid conflict with vertical scroll. Vertical scroll + prev/next buttons is sufficient.

## State Model

- `selectedTopic` (App level): null or topic ID
- Each RevealCard has internal `isRevealed` state
- Navigation via scrollIntoView using refs, not centralized index
