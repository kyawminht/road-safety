import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import RulesPage from './pages/RulesPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<RulesPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
