import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth.jsx';
import BottomNav from './components/BottomNav.jsx';
import CreatorSection from './components/CreatorSection.jsx';
import HomePage from './pages/HomePage.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import BeBrightBeSeenGame from './pages/Games/BeBrightBeSeen/BeBrightBeSeenGame.jsx';
import SpotTheDangerGame from './pages/Games/SpotTheDanger/SpotTheDangerGame.jsx';
import PedestrianFirstGame from './pages/Games/PedestrianFirst/PedestrianFirstGame.jsx';

function AppShell() {
  const [showNav, setShowNav] = useState(true);
  const { pathname } = useLocation();
  const showCreator = pathname === '/comments';

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-[#0F1A2E]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/games/be-bright-be-seen" element={<BeBrightBeSeenGame onNavChange={setShowNav} />} />
        <Route path="/games/spot-the-danger" element={<SpotTheDangerGame onNavChange={setShowNav} />} />
        <Route path="/games/pedestrian-first" element={<PedestrianFirstGame onNavChange={setShowNav} />} />
      </Routes>

      {showCreator && (
        <div className="shrink-0">
          <CreatorSection />
        </div>
      )}

      <motion.div
        initial={false}
        animate={{ height: showNav ? 'auto' : 0, opacity: showNav ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <BottomNav />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
