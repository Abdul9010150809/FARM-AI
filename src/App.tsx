// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PredictionPage from './components/PredictionPage';
import WeatherAnalysis from './components/WeatherAnalysis';
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    localStorage.getItem('appLanguage') || 'en'
  );

  const applyTranslation = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('appLanguage', lang);
    setCookie('googtrans', `/en/${lang}`, 1);
    window.location.reload();
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    if (document.cookie.indexOf('googtrans') === -1) {
      setCookie('googtrans', `/en/${savedLang}`, 1);
    }
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
    };
    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      {/* <Navbar currentLanguage={currentLanguage} applyTranslation={applyTranslation} /> */}
      <main>
        <Routes>
          {/* 👇 FIX: Pass the required props to the HomePage component here */}
          <Route
            path="/"
            element={<HomePage applyTranslation={applyTranslation} currentLanguage={currentLanguage} />}
          />
          <Route path="/prediction" element={<PredictionPage />} />
          
          {/* This route is commented out until you create the ProfilePage.tsx file */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Routes>
      </main>
    </AuthProvider>
  );
};

export default App;