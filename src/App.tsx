import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Setting from './pages/Setting/Setting';
import Gdpr from './pages/GDPR/GDPR';
import CookiePolicy from './pages/CookiePolicy/CookiePolicy';
import TermsOfService from './pages/TermsOfService/TermsOfServices';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import PrivacyStatement from './pages/PrivacyStatement/PrivacyStatement';
import UserPage from './pages/SettingPage/UserPage/UserPage';
import Access from './pages/Access/Access';
import Search from './pages/Search/Search';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Setting />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/gdpr" element={<Gdpr />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-statement" element={<PrivacyStatement />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/user-page" element={<UserPage />} />
      <Route path="/access" element={<Access />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}
export default App;
