# Redesign: Scrollable Flip Card Feed

## Goal
Remove the topic selection screen. Show all cards in a vertical scrollable feed with snap scrolling. Improve visual design significantly.

## What Changes

### New Flow
- User opens app → sees first flip card immediately
- Scroll down → next card snaps into view
- Each topic has a colorful section header
- Tap card to flip between wrong/right sides
- No buttons, no two-screen navigation

### New Component: `CardDeck.jsx`
- Takes all FLIP_CARDS and TOPICS
- Groups cards by topic
- Renders a vertical scrollable container with `scroll-snap-type: y mandatory`
- Each card section snaps into view
- Topic headers appear before each topic's cards
- Shows progress indicator (e.g., "3/12")

### Redesigned: `FlipCard.jsx`
- More vibrant design
- Larger, bolder emoji/X/✓ marks
- Better color contrast
- Smoother 3D flip
- Card fills more of the viewport
- Subtle gradient backgrounds instead of plain white
- Better typography hierarchy

### Redesigned: Topic section headers
- Each topic gets a colored header with emoji + title
- Separates card groups visually
- Clean, modern look

### Removed Components
- HomeScreen.jsx → delete
- TopicGrid.jsx → delete
- FlipCardScreen.jsx → delete
- Header.jsx → delete (no back button needed)
- ProgressDots.jsx → integrate into CardDeck

### Simplified: `App.jsx`
- No more `selectedTopicId` state
- Directly renders CardDeck with all cards

### Visual Design Improvements
- Warmer, friendlier color palette
- Softer shadows and rounded corners
- Better use of whitespace
- More engaging card surfaces (subtle gradients, not flat white)
- Larger touch targets
- Smoother transitions
- Cards feel more like beautiful flashcards, less like a basic form
