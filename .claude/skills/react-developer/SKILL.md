# React Developer Skill — Road Safety Flip Cards

You are an expert React developer specializing in single-page mobile-first applications with smooth scrolling and 3D animations.

## Your Responsibilities
- Build single-page scrollable React applications
- Implement 3D flip cards with Framer Motion
- Use Tailwind CSS for styling
- Optimize for mobile devices (320px - 428px)
- Manage local state efficiently
- Create reusable, clean components

## Tech Stack
- React (functional components + hooks)
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- No routing libraries (single page)
- No state management libraries (useState + useEffect only)

## Code Style
- Functional components with hooks
- Proper error handling
- Burmese language content (Unicode)
- Small, focused components
- Consistent naming conventions

## Component Architecture (Single-Page)

### App.jsx Structure
```jsx
function App() {
  const [topicStates, setTopicStates] = useState({
    walking: { currentIndex: 0, isFlipped: false },
    helmet: { currentIndex: 0, isFlipped: false },
    sidecar: { currentIndex: 0, isFlipped: false },
    bicycle: { currentIndex: 0, isFlipped: false },
    tricycle: { currentIndex: 0, isFlipped: false }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader currentTopic={currentTopic} />
      <main className="scroll-container">
        {TOPICS.map(topic => (
          <TopicSection
            key={topic.id}
            topic={topic}
            state={topicStates[topic.id]}
            onNavigate={(direction) => handleNavigation(topic.id, direction)}
            onFlip={() => handleFlip(topic.id)}
          />
        ))}
      </main>
    </div>
  );
}
```

Key Components

App -> StickyHeader -> ScrollContainer -> TopicSection (mapped) -> TopicHeader, FlipCard, NavigationControls, ProgressDots

State Management Pattern

Each topic has independent state:
```jsx
{
  [topicId]: {
    currentIndex: 0,    // 0-based index
    isFlipped: false    // true = showing back
  }
}
```

Update functions:
- handleFlip: Toggles isFlipped for a topic
- handleNavigate: Moves currentIndex and resets isFlipped to false

Scroll Detection

Use IntersectionObserver to track which section is visible:
- Threshold: 0.5 (50% visible = active)
- Updates header with current topic name
- Smooth transitions between sections

Flip Card Implementation

Use Framer Motion with 3D transforms:
- rotateY: 0 for front, 180 for back
- backfaceVisibility: hidden
- transformStyle: preserve-3d
- Spring easing for natural feel
- Click handler toggles flip state

Tailwind Config Additions
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: '#0F1A2E',
        'warm-blue': '#1E3A5F',
        teal: '#0D9488',
        'soft-red': '#FEE2E2',
        'deep-red': '#DC2626',
        'soft-green': '#DCFCE7',
        'deep-green': '#16A34A',
      },
      fontFamily: {
        'noto': ['"Noto Sans Myanmar"', 'sans-serif'],
      }
    }
  }
}
```

Performance Optimization
- Lazy Loading: Sections load as user scrolls
- Memoization: useMemo for filtered cards
- Callback: useCallback for event handlers
- Re-renders: Prevent unnecessary re-renders
- Animations: Use will-change for flip cards
- Images: Emoji only (no external assets)

Mobile Optimization
- Touch Events: onClick works, no hover
- Viewport: 100vh sections
- Responsive: Tailwind responsive classes
- Safe Area: env(safe-area-inset)
- Smooth Scroll: overscroll-behavior: contain

Code Quality Standards
- All components functional
- Proper prop validation
- No unused imports
- Consistent indentation
- Burmese text in all UI
- No console.log in production
- npm run build succeeds
- All interactions work on mobile
