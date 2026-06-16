# Road Safety for Myanmar students - Claude Code Instructions

## Project Overview
A mobile-first web application that teaches road safety to children (ages 6-17) in Myanmar. The app uses a cute dog character and interactive questions to make learning fun.

## Tech Stack
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Confetti:** react-confetti
- **State Management:** Zustand
- **Storage:** LocalStorage (no authentication)
- **Language:** 100% Burmese (Unicode, not Zawgyi)

## Project Structure

src/
├── components/
│ ├── Home/
│ │ ├── HomeScreen.jsx
│ │ ├── ModuleSelector.jsx
│ │ └── ProgressDisplay.jsx
│ ├── Game/
│ │ ├── DogGame.jsx
│ │ ├── GameCanvas.jsx
│ │ ├── QuestionCard.jsx
│ │ └── modules/
│ │ ├── module1_walking.js
│ │ ├── module2_helmet.js
│ │ ├── module3_sidecar.js
│ │ ├── module4_bicycle.js
│ │ └── module5_tricycle.js
│ ├── Results/
│ │ ├── WinScreen.jsx
│ │ └── FailScreen.jsx
│ └── Shared/
│ ├── Button.jsx
│ ├── Card.jsx
│ └── Header.jsx
├── hooks/
│ ├── useGameState.js
│ ├── useProgress.js
│ └── useRandomModule.js
├── data/
│ └── modules.json
└── utils/
├── canvasHelpers.js
└── confettiHelpers.js


## Key Features
1. **5 Learning Modules:** Walking, Helmet, Sidecar, Bicycle, Tricycle
2. **3 Questions per Module:** Each with 2 choices (tap only)
3. **Random Module Selection:** Different module on each launch
4. **Confetti Celebration:** Visual reward for winning
5. **No Authentication:** All progress saved in LocalStorage
6. **Mobile-First:** Optimized for 320px - 428px screens
7. **100% Burmese:** All text in Unicode Burmese

## Design Guidelines
- **Colors:** Primary Blue (#1E3A5F), Success Green (#10B981), Danger Red (#EF4444)
- **Typography:** Noto Sans Myanmar (Google Fonts)
- **Touch Targets:** Minimum 48px × 48px
- **Max Steps:** 3 questions per game session

## Development Workflow
1. Make small, frequent commits
2. Test on mobile devices (320px - 428px)
3. Keep all text in Burmese
4. Use functional React components with hooks
5. Follow mobile-first design principles

## Important Notes
- ✅ No authentication/login required
- ✅ Confetti is the only reward system
- ✅ All content must be in Burmese
- ✅ Touch interactions only (no drag & drop)
- ✅ Maximum 3 steps per game
