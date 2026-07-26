import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight, FiEye, FiMoon, FiNavigation, FiPlayCircle } from 'react-icons/fi';

// Lazy-load existing games
const BeBrightBeSeenGame = lazy(() => import('../Games/BeBrightBeSeen/BeBrightBeSeenGame.jsx'));
const SpotTheDangerGame = lazy(() => import('../Games/SpotTheDanger/SpotTheDangerGame.jsx'));
const PedestrianFirstGame = lazy(() => import('../Games/PedestrianFirst/PedestrianFirstGame.jsx'));

const GAMES = [
  {
    id: 'pedestrian-first',
    title: 'Crossing Roads',
    subtitle: 'Pedestrian First',
    icon: FiNavigation,
    color: 'from-road-green-dark to-road-green',
    textColor: 'text-white',
    action: 'Start crossing practice',
    desc: 'Stop, look, listen, then cross safely.',
  },
  {
    id: 'be-bright',
    title: 'Be Bright',
    subtitle: 'Wear Bright Clothes',
    icon: FiMoon,
    color: 'from-road-yellow to-orange-400',
    textColor: 'text-road-black',
    action: 'Start night safety',
    desc: 'Choose clothes drivers can see at night.',
  },
  {
    id: 'spot-danger',
    title: 'Spot Danger',
    subtitle: 'Find Danger on the Road',
    icon: FiEye,
    color: 'from-road-red to-road-red-dark',
    textColor: 'text-white',
    action: 'Start danger hunt',
    desc: 'Tap the unsafe places in the scene.',
  },
];

function GameFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-road-gray-900">
      <div className="text-center text-white/30">
        <div className="text-4xl mb-2 animate-pulse">🎮</div>
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function PlayPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  // ── Pedestrian First Game ──
  if (selectedGame === 'pedestrian-first') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-road-black">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-white/70 text-sm font-semibold"
          >
            ← Back
          </button>
          <span className="text-white/50 text-xs">Pedestrian First</span>
          <div className="w-12" />
        </div>
        <Suspense fallback={<GameFallback />}>
          <PedestrianFirstGame />
        </Suspense>
      </div>
    );
  }

  // ── Be Bright Be Seen ──
  if (selectedGame === 'be-bright') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-road-black">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-white/70 text-sm font-semibold"
          >
            ← Back
          </button>
          <span className="text-white/50 text-xs">Be Bright</span>
          <div className="w-12" />
        </div>
        <Suspense fallback={<GameFallback />}>
          <BeBrightBeSeenGame />
        </Suspense>
      </div>
    );
  }

  // ── Spot The Danger ──
  if (selectedGame === 'spot-danger') {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-road-black">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-white/70 text-sm font-semibold"
          >
            ← Back
          </button>
          <span className="text-white/50 text-xs">Spot Danger</span>
          <div className="w-12" />
        </div>
        <Suspense fallback={<GameFallback />}>
          <SpotTheDangerGame />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-road-white px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-heading text-road-black">Practice Games</h1>
        <p className="text-road-gray-500 text-sm">Pick one safety skill to practice.</p>
      </motion.div>

      {/* Game cards */}
      <div className="space-y-4">
        {GAMES.map((game, i) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedGame(game.id)}
              className={`w-full rounded-2xl overflow-hidden text-left ${game.textColor} shadow-sm`}
            >
              <div className={`bg-gradient-to-br ${game.color} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: 'rgba(255,255,255,0.24)',
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={23} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-lg leading-tight">{game.title}</div>
                      <div className={`text-sm opacity-80 ${game.textColor}`}>{game.subtitle}</div>
                    </div>
                  </div>
                  <FiChevronRight className="shrink-0 opacity-70" size={22} aria-hidden="true" />
                </div>
              </div>
              <div className="bg-road-gray-50 p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-road-gray-500">{game.desc}</p>
                <span className="text-xs font-bold text-road-green-dark whitespace-nowrap">{game.action}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Road crossing simulator placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 rounded-2xl border-2 border-dashed border-road-gray-300 text-center"
      >
        <FiPlayCircle className="mx-auto mb-2 text-road-gray-400" size={24} aria-hidden="true" />
        <p className="text-sm font-semibold text-road-gray-500">Road Crossing Simulator (Coming Soon)</p>
        <p className="text-xs text-road-gray-400 mt-1">2D Canvas road-crossing game — coming soon</p>
      </motion.div>

      <div className="h-4" />
    </div>
  );
}
