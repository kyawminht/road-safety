# UI/UX Redesign Plan

## Source: `.claude/skills/ui-ux-designer/SKILL.md`

## Problems Found vs Skill Guidelines

| Area | Skill Says | Current App | Problem |
|------|-----------|-------------|---------|
| Heading size | 24-32px Bold | 14px | Way too small |
| Body text | 18-20px Regular | 14px | Kids can't read |
| Touch targets | ≥48px minimum | ~32px badges | Too small to tap |
| Card design | White bg + shadow | Colored gradient bg | Muted, not popping |
| Animation speed | 300ms | 550ms | Feels sluggish |
| Colors | #EF4444, #10B981 vibrant | red-50, emerald-50 muted | Not engaging for kids |
| Button height | ≥56px | ~40px | Too small for kids |
| Card radius | 20px | 24px | Close, OK |

## Changes

### 1. FlipCard.jsx — Complete Redesign
- White card background with strong shadow (per skill spec)
- Large color accent bar at top: red for wrong, green for right
- ❌✅ icons at 48px (text-5xl) — big enough for kids
- Labels မလုပ်ရ / လုပ်ရမယ် at 22px bold
- Image area takes up most of card
- Bottom text at 18px (text-lg) minimum
- Flip animation 0.35s (matches skill's 300ms guideline)
- Card border-radius 20px to match skill spec
- All touch targets verified ≥48px

### 2. CardDeck.jsx — Playful & Simple
- Larger fixed top bar with 22px title
- Each card entry: topic badge bigger (20px emoji + 16px label)
- Floating hint: larger, brighter, auto-fades after 5s
- End screen: bigger emoji, larger congratulation text
- Smoother scroll experience

### 3. index.css — Typography
- Ensure Noto Sans Myanmar is applied
- Set comfortable base font size for mobile

### Files to change:
- `src/components/FlipCard.jsx` — full redesign
- `src/components/CardDeck.jsx` — typography & polish
- `src/index.css` — base font tweaks
