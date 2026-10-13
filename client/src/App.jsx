import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewAdvisoryPage } from './pages/NewAdvisoryPage';
import { AdvisoryDetailsPage } from './pages/AdvisoryDetailsPage';
import { VisualInspectorPage } from './pages/VisualInspectorPage';
import { MarketInsightsPage } from './pages/MarketInsightsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <LandingPage />
          </div>
        }
      />
      <Route
        path="/auth"
        element={
          <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <AuthPage />
          </div>
        }
      />

      {/* Protected Agronomic App Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/new"
        element={
          <ProtectedRoute>
            <NewAdvisoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/:id"
        element={
          <ProtectedRoute>
            <AdvisoryDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspector"
        element={
          <ProtectedRoute>
            <VisualInspectorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/market"
        element={
          <ProtectedRoute>
            <MarketInsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
