import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterEntryPage } from './pages/auth/RegisterEntryPage';
import { ContractorRegisterPage } from './pages/auth/ContractorRegisterPage';
import { HomeownerRegisterPage } from './pages/auth/HomeownerRegisterPage';
import { WorkerRegisterPage } from './pages/auth/WorkerRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterEntryPage />} />
        <Route path="/register/contractor" element={<ContractorRegisterPage />} />
        <Route path="/register/homeowner" element={<HomeownerRegisterPage />} />
        <Route path="/register/worker" element={<WorkerRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
