/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Exams from './pages/Exams';
import Career from './pages/Career';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/practice" element={
            <ProtectedRoute>
              <Layout>
                <Practice />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/exams" element={
            <ProtectedRoute>
              <Layout>
                <Exams />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/career" element={
            <ProtectedRoute>
              <Layout>
                <Career />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

