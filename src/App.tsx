// src/App.tsx
import React, { Suspense } from 'react';
// FIX: Removed BrowserRouter as it's already in index.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// --- Global Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// --- Page Components ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PredictionAndOptimizationPage = React.lazy(() => import('./pages/PredictionAndOptimizationPage'));
const SoilHealthPage = React.lazy(() => import('./pages/SoilHealthPage'));
// FIX: Import the correct page component
const WeatherAnalysisPage = React.lazy(() => import('./pages/WeatherAnalysisPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
    <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} />
  </div>
);

const NotFoundPage = () => (
  <div className="container text-center my-5 py-5">
    <h1 className="display-1 fw-bold">404</h1>
    <p className="lead">Oops! The page you're looking for could not be found.</p>
    <a href="/" className="btn btn-success mt-3">Go to Homepage</a>
  </div>
);

const App: React.FC = () => {
  return (
    // FIX: NO <Router> here. It should only be in your src/index.tsx file.
    <AuthProvider>
      <Navbar />
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prediction" element={<PredictionAndOptimizationPage />} />
              <Route path="/soil-health" element={<SoilHealthPage />} />
              {/* FIX: Use the correctly imported WeatherAnalysisPage component */}
              <Route path="/weather-analysis" element={<WeatherAnalysisPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Chatbot />
      <Footer />
    </AuthProvider>
  );
};

export default App;