import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Gdpr from './pages/GDPR/GDPR';
import CookiePolicy from './pages/CookiePolicy/cookiePolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy/refundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy/privacyPolicy';
import PrivacyStatement from './pages/PrivacyStatement/privacyStatement';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/gdpr" element={<Gdpr />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-statement" element={<PrivacyStatement />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
}
export default App;
