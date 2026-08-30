import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RootRedirect } from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PreviousYearData from './pages/PreviousYearData';
import HodDashboard from './pages/HodDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyTemplates from './pages/FacultyTemplates';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<RootRedirect />} />
            <Route path="dashboard" element={<RootRedirect />} />

            {/* ADMIN / EXECUTIVE ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN']} />}>
              <Route path="admin/dashboard" element={<Dashboard />} />
              <Route path="admin/previous-year-data" element={<PreviousYearData />} />
            </Route>

            {/* HOD ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['HOD', 'ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN']} />}>
              <Route path="hod/dashboard" element={<HodDashboard />} />
            </Route>

            {/* FACULTY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN']} />}>
              <Route path="faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="faculty/templates" element={<Navigate to="/faculty/templates/1" replace />} />
              <Route path="faculty/templates/:step" element={<FacultyTemplates />} />
            </Route>

            {/* SHARED ANALYTICS */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN', 'HOD']} />}>
              <Route path="admin/reports" element={<Reports />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* SETTINGS PLACEHOLDER */}
            <Route path="settings" element={
              <div className="p-8 bg-white rounded-xl shadow-2xs border border-gray-200 text-center">
                <h3 className="text-lg font-bold text-brand-navy mb-1">IQAC Portal System Settings</h3>
                <p className="text-brand-muted text-xs">System configuration, backup options, and user role management.</p>
              </div>
            } />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
