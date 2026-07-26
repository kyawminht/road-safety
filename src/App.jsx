import { useState, useCallback, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import HomeDashboard from './pages/mobile/HomeDashboard.jsx';
import RulesScreen from './pages/mobile/RulesScreen.jsx';
import LearnPage from './pages/mobile/LearnPage.jsx';
import QuizScreen from './pages/mobile/QuizScreen.jsx';
import PlayPage from './pages/mobile/PlayPage.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import DesktopSidebar from './components/layout/DesktopSidebar.jsx';
import DesktopHomePage from './pages/desktop/Home/DesktopHomePage.jsx';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function AppContent() {
  const { loading } = useAuth();
  const isMobile = useIsMobile();

  // App state
  const [activeTab, setActiveTab] = useState('home');
  const [filterTopic, setFilterTopic] = useState(null);

  // Navigate handler (from HomePage quick actions)
  const handleNavigate = useCallback((target, topicId) => {
    if (topicId) setFilterTopic(topicId);
    setActiveTab(target);
  }, []);

  // Back to home from quiz
  const handleQuizComplete = useCallback(() => {
    setActiveTab('home');
  }, []);

  // Don't render until we know auth state
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-road-white">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">🚦</div>
          <p className="text-road-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ── DESKTOP: SHOW HOME PAGE (skip onboarding) ──
  // if (isDesktop) {
  //   return <DesktopHomePage />;
  // }

  // ── ONBOARDING (hidden for now) ──
  // if (!onboarded) {
  //   return <OnboardingPage onComplete={handleOnboarding} />;
  // }

  // ── DESKTOP: TEACHER (hidden for now) ──
  // if (!isMobile && role === 'teacher') {
  //   return (
  //     <div className="min-h-dvh flex bg-road-gray-50">
  //       <TeacherSidebar activeTab={desktopTab} onTabChange={setDesktopTab} />
  //       <div className="flex-1 overflow-y-auto">
  //         {desktopTab === 'dashboard' && <TeacherDashboard />}
  //         {desktopTab === 'classes' && <TeacherDashboard section="classes" />}
  //         {desktopTab === 'content' && <TeacherDashboard section="content" />}
  //         {desktopTab === 'assessments' && <TeacherDashboard section="assessments" />}
  //         {desktopTab === 'reports' && <TeacherDashboard section="reports" />}
  //       </div>
  //     </div>
  //   );
  // }

  // ── DESKTOP: PARENT (hidden for now) ──
  // if (!isMobile && role === 'parent') {
  //   return (
  //     <div className="min-h-dvh flex bg-road-gray-50">
  //       <ParentSidebar activeTab={desktopTab} onTabChange={setDesktopTab} />
  //       <div className="flex-1 overflow-y-auto">
  //         {desktopTab === 'dashboard' && <ParentDashboard />}
  //         {desktopTab === 'history' && <ParentDashboard section="history" />}
  //         {desktopTab === 'resources' && <ParentDashboard section="resources" />}
  //       </div>
  //     </div>
  //   );
  // }

  // ── Render page based on tab ──
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return isMobile 
          ? <HomeDashboard onNavigate={handleNavigate} />
          : <DesktopHomePage onNavigate={handleNavigate} />;
      case 'rules':
        return <RulesScreen onNavigate={handleNavigate} />;
      case 'learn':
        return (
          <LearnPage
            key={filterTopic || 'all'}
            filterTopic={filterTopic}
            onNavigate={handleNavigate}
          />
        );
      case 'assess':
      case 'quiz':
        return <QuizScreen onComplete={handleQuizComplete} onNavigate={handleNavigate} />;
      case 'game':
        return <PlayPage />;
      case 'play':
        return <PlayPage />;
      default:
        return isMobile 
          ? <HomeDashboard onNavigate={handleNavigate} />
          : <DesktopHomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-road-white w-full">
      {/* ── Desktop: Sidebar + Content row ── */}
      {!isMobile ? (
        <div className="flex-1 flex flex-row overflow-hidden w-full">
          <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden w-full">
            {renderPage()}
          </div>
        </div>
      ) : (
        <>
          {/* ── Mobile: Main content ── */}
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {renderPage()}
          </div>

          {/* ── Mobile: Bottom nav ── */}
          {activeTab !== 'assess' && (
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MemoryRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </MemoryRouter>
  );
}
