import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import HomePage from './pages/HomePage.jsx';
import LessonView from './pages/LessonView.jsx';
import AssessmentView from './pages/AssessmentView.jsx';
import ParentTipsView from './pages/ParentTipsView.jsx';
import WorksheetsView from './pages/WorksheetsView.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import BeBrightBeSeenGame from './pages/Games/BeBrightBeSeen/BeBrightBeSeenGame.jsx';
import SpotTheDangerGame from './pages/Games/SpotTheDanger/SpotTheDangerGame.jsx';
import PedestrianFirstGame from './pages/Games/PedestrianFirst/PedestrianFirstGame.jsx';

function AppShell() {
  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grade/:gradeId/lesson/:id" element={<LessonView />} />
          <Route path="/grade/:gradeId/assessment" element={<AssessmentView />} />
          <Route path="/grade/:gradeId/parent-tips" element={<ParentTipsView />} />
          <Route path="/grade/:gradeId/worksheets" element={<WorksheetsView />} />
          <Route path="/comments" element={<CommentsPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/games/be-bright-be-seen" element={<BeBrightBeSeenGame />} />
          <Route path="/games/spot-the-danger" element={<SpotTheDangerGame />} />
          <Route path="/games/pedestrian-first" element={<PedestrianFirstGame />} />
        </Routes>
      </div>
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
