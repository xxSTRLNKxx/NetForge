import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import SetupPage from './pages/SetupPage';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/admin/UsersPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import api from './lib/api';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-600">This feature is under development</p>
    </div>
  );
}

const VIEW_MAP: Record<string, React.ComponentType> = {
  'profile': ProfilePage,
  'users': UsersPage,
  'activity-log': ActivityLogPage,
};

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [installed, setInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      const status = await api.setup.status();
      setInstalled(status.installed);
    } catch (error) {
      console.error('Error checking installation:', error);
      setInstalled(false);
    }
  };

  if (installed === null || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!installed) {
    return <SetupPage onComplete={() => setInstalled(true)} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const ViewComponent = VIEW_MAP[currentView];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarVisible && (
        <Sidebar currentView={currentView} onViewChange={setCurrentView} onHide={() => setSidebarVisible(false)} />
      )}
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-5 h-12 rounded-r-lg transition-all hover:w-7"
          style={{ background: '#1E3A5F', color: '#60A5FA', border: '1px solid #2563EB40', borderLeft: 'none' }}
          title="Show sidebar"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <div className="flex-1 overflow-auto">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : ViewComponent ? (
          <ViewComponent />
        ) : (
          <PlaceholderPage title={currentView} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
