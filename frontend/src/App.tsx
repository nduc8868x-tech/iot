import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { Header } from './components/Header';
import { NetworkStatusBanner } from './components/ConnectionStatus';
import { Dashboard } from './pages/Dashboard';
import { EventHistory } from './pages/EventHistory';
import { ActivityLog } from './pages/ActivityLog';
import { Statistics } from './pages/Statistics';
import { Profile } from './pages/Profile';
import { DeviceProvider } from './context/DeviceContext';

export function App() {
  return (
    <DeviceProvider>
      <Router>
        <div className="h-screen overflow-hidden flex flex-col bg-[#f8fafc] font-sans text-slate-900">
          <NetworkStatusBanner />
          <Header />
          <main className="flex-1 min-h-0 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<EventHistory />} />
              <Route path="/activity" element={<ActivityLog />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DeviceProvider>
  );
}