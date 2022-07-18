import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Setting from './pages/Setting/Setting';
import Gdpr from './pages/GDPR/GDPR';
import CookiePolicy from './pages/CookiePolicy/CookiePolicy';
import TermsOfService from './pages/TermsOfService/TermsOfServices';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import PrivacyStatement from './pages/PrivacyStatement/PrivacyStatement';
import UserPage from './pages/SettingPage/UserPage/UserPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Access from './pages/Access/Access';
import Project from './pages/Project/Project';
import CreateProject from './pages/CreateProject/CreateProject';
import AccountSettings from './pages/AccountSetting/AccountSetting';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import BoardPage from './pages/BoardPage/BoardPage';
import About from './pages/About/About';
import './App.css';
import { ProjectProvider } from './context/ProjectProvider';
import { UserProvider } from './context/UserInfoProvider';

function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/register/:token" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings/:projectId" element={<Setting />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/gdpr" element={<Gdpr />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-statement" element={<PrivacyStatement />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/user-page" element={<UserPage />} />
          <Route path="/access" element={<Access />} />
          <Route path="/projects/:projectId/board/:boardId" element={<BoardPage />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/create-projects" element={<CreateProject />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ProjectProvider>
    </UserProvider>
  );
}
export default App;
