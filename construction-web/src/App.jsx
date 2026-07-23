import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterEntryPage } from './pages/auth/RegisterEntryPage';
import { ContractorRegisterPage } from './pages/auth/ContractorRegisterPage';
import { HomeownerRegisterPage } from './pages/auth/HomeownerRegisterPage';
import { WorkerRegisterPage } from './pages/auth/WorkerRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Layout & Guards
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { RoleRoute } from './components/auth/RoleRoute';

// Dashboards
import { ContractorDashboard } from './pages/contractor/ContractorDashboard';
import { ContractorProjects } from './pages/contractor/ContractorProjects';
import { ContractorWorkers } from './pages/contractor/ContractorWorkers';
import { ContractorAttendance } from './pages/contractor/ContractorAttendance';
import { ContractorMaterials } from './pages/contractor/ContractorMaterials';
import { ContractorExpenses } from './pages/contractor/ContractorExpenses';
import { ContractorProgress } from './pages/contractor/ContractorProgress';
import { ContractorReports } from './pages/contractor/ContractorReports';
import { ContractorNotifications } from './pages/contractor/ContractorNotifications';
import { ContractorSettings } from './pages/contractor/ContractorSettings';

import { HomeownerDashboard } from './pages/homeowner/HomeownerDashboard';
import { HomeownerProjects } from './pages/homeowner/HomeownerProjects';
import { HomeownerProgress } from './pages/homeowner/HomeownerProgress';
import { HomeownerExpenses } from './pages/homeowner/HomeownerExpenses';
import { HomeownerDocuments } from './pages/homeowner/HomeownerDocuments';
import { HomeownerNotifications } from './pages/homeowner/HomeownerNotifications';
import { HomeownerSettings } from './pages/homeowner/HomeownerSettings';

import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { WorkerProjects } from './pages/worker/WorkerProjects';
import { WorkerUploadProgress } from './pages/worker/WorkerUploadProgress';
import { WorkerAttendance } from './pages/worker/WorkerAttendance';
import { WorkerNotifications } from './pages/worker/WorkerNotifications';
import { WorkerSettings } from './pages/worker/WorkerSettings';
import { WorkerProfileCompletion } from './pages/worker/WorkerProfileCompletion';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Redirect to dashboard if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterEntryPage />} />
          <Route path="/register/contractor" element={<ContractorRegisterPage />} />
          <Route path="/register/homeowner" element={<HomeownerRegisterPage />} />
          <Route path="/register/worker" element={<WorkerRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          
          {/* Worker Profile Completion Flow (No Sidebar) */}
          <Route element={<RoleRoute allowedRoles={['Worker']} />}>
            <Route path="/worker/complete-profile" element={<WorkerProfileCompletion />} />
          </Route>

          {/* Shared Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            
            {/* Contractor Routes */}
            <Route element={<RoleRoute allowedRoles={['Contractor']} />}>
              <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
              <Route path="/contractor/projects" element={<ContractorProjects />} />
              <Route path="/contractor/workers" element={<ContractorWorkers />} />
              <Route path="/contractor/attendance" element={<ContractorAttendance />} />
              <Route path="/contractor/materials" element={<ContractorMaterials />} />
              <Route path="/contractor/expenses" element={<ContractorExpenses />} />
              <Route path="/contractor/progress" element={<ContractorProgress />} />
              <Route path="/contractor/reports" element={<ContractorReports />} />
              <Route path="/contractor/notifications" element={<ContractorNotifications />} />
              <Route path="/contractor/settings" element={<ContractorSettings />} />
              <Route path="/contractor/*" element={<ContractorDashboard />} />
            </Route>

            {/* Homeowner Routes */}
            <Route element={<RoleRoute allowedRoles={['Homeowner']} />}>
              <Route path="/homeowner/dashboard" element={<HomeownerDashboard />} />
              <Route path="/homeowner/projects" element={<HomeownerProjects />} />
              <Route path="/homeowner/progress" element={<HomeownerProgress />} />
              <Route path="/homeowner/expenses" element={<HomeownerExpenses />} />
              <Route path="/homeowner/documents" element={<HomeownerDocuments />} />
              <Route path="/homeowner/notifications" element={<HomeownerNotifications />} />
              <Route path="/homeowner/settings" element={<HomeownerSettings />} />
              <Route path="/homeowner/*" element={<HomeownerDashboard />} />
            </Route>

            {/* Worker Routes */}
            <Route element={<RoleRoute allowedRoles={['Worker']} />}>
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/worker/profile" element={<WorkerProfile />} />
              <Route path="/worker/projects" element={<WorkerProjects />} />
              <Route path="/worker/upload-progress" element={<WorkerUploadProgress />} />
              <Route path="/worker/attendance" element={<WorkerAttendance />} />
              <Route path="/worker/notifications" element={<WorkerNotifications />} />
              <Route path="/worker/settings" element={<WorkerSettings />} />
              <Route path="/worker/*" element={<WorkerDashboard />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
