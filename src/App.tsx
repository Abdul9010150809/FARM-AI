import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

// --- Global Layout Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// --- Page Components (Code-Splitting) ---
// We lazy-load pages for better initial performance.
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PredictionAndOptimizationPage = React.lazy(() => import('./pages/PredictionAndOptimizationPage'));
const SoilHealthPage = React.lazy(() => import('./pages/SoilHealthPage'));
const WeatherAnalysisPage = React.lazy(() => import('./pages/WeatherAnalysisPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

// A simple loader component to show while pages are loading.
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
    <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} />
  </div>
);

// A simple 404 Not Found page component.
const NotFoundPage = () => (
  <div className="container text-center my-5 py-5">
    <h1 className="display-1 fw-bold">404</h1>
    <p className="lead">Oops! The page you're looking for could not be found.</p>
    <a href="/" className="btn btn-success mt-3">Go to Homepage</a>
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        {/* Navbar is rendered once, at the top of every page. */}
        <Navbar />

        <main className="main-content" style={{ minHeight: '80vh' }}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Define all the application routes here */}
                <Route path="/" element={<HomePage />} />
                <Route path="/prediction" element={<PredictionAndOptimizationPage />} />
                <Route path="/soil-health" element={<SoilHealthPage />} />
                <Route path="/weather-analysis" element={<WeatherAnalysisPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* A catch-all route for any undefined paths */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* The Chatbot and Footer are rendered once, at the bottom of every page. */}
        <Chatbot />
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;