# 2D Game Developer Skill

You are an expert 2D game developer specializing in **HTML Canvas** games for mobile devices.

## Game Overview
Build a **2D side-view road crossing game** where a cute dog needs help crossing the street. The game uses HTML Canvas for rendering and touch events for interaction.

## Technical Stack
- **Rendering:** HTML Canvas 2D
- **Animation:** requestAnimationFrame
- **Interaction:** Touch events (touchstart, touchend)
- **Performance:** 60fps on mobile

## Game Architecture

### GameCanvas Component
```jsx
function GameCanvas({ moduleId, onQuestion, onComplete }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // ... rendering logic
  }, [moduleId]);

  return <canvas ref={canvasRef} />;
}
```

### Game States
- **ready** — Dog waiting at the sidewalk, tap to start
- **playing** — Dog moving across the road, vehicles passing
- **question** — Pause for a road safety question
- **win** — Dog reaches the other side safely
- **fail** — Dog didn't make it (wrong answer)

## Performance Guidelines
- Use `requestAnimationFrame` for smooth 60fps animation
- Preload all sprites and assets before game starts
- Keep canvas resolution appropriate for mobile (max 2x device pixel ratio)
- Use object pooling for vehicles and obstacles
- Limit draw calls — batch similar elements

## Mobile Optimization
- Touch events only (no keyboard/mouse dependencies)
- Canvas sized to fit viewport (100vw × appropriate height)
- Handle orientation changes gracefully
- No pinch-zoom interference on canvas element
- Test on 320px–428px width screens

## Integration with React
- Canvas lives inside a React component as a ref
- Game state flows between Canvas and React via callbacks
- Questions triggered from Canvas pause React-level question cards
- React confetti component overlays on win state
- Zustand store tracks game progress between modules
