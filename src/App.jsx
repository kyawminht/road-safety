import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from './components/BottomNav.jsx';
import RulesPage from './pages/RulesPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import BeBrightBeSeenGame from './pages/Games/BeBrightBeSeen/BeBrightBeSeenGame.jsx';

export default function App() {
  const [showNav, setShowNav] = useState(true);

  return (
    <BrowserRouter>
      <div className="h-dvh flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<RulesPage onScrollChange={setShowNav} />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/games/be-bright-be-seen" element={<BeBrightBeSeenGame onNavChange={setShowNav} />} />
        </Routes>
        <motion.div
          initial={false}
          animate={{
            height: showNav ? 'auto' : 0,
            opacity: showNav ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <BottomNav />
        </motion.div>
      </div>
    </BrowserRouter>
  );
}
