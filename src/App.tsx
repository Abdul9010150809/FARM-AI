import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useApiHealth } from './hooks/useApiHealth'; // Import the health check hook

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
    <span className="ms-2">Loading...</span>
  </div>
);

// A simple loading screen for initial API health check
const ApiHealthLoader = () => (
  <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
    <p className="mt-3">Checking server connection...</p>
    <small className="text-muted">This may take a few seconds</small>
  </div>
);

// Demo mode warning banner component
const DemoWarningBanner: React.FC = () => (
  <div className="demo-warning-banner" style={{
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    color: '#856404',
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontSize: '14px'
  }}>
    ⚠️ Demo Mode: Using mock data - Backend server is currently unavailable
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

// Main App Component
const App: React.FC = () => {
  const { isApiHealthy, loading } = useApiHealth();

  // Show loading screen while checking API health
  if (loading) {
    return <ApiHealthLoader />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        {/* Navbar is rendered once, at the top of every page. */}
        <Navbar />

        {/* Demo mode warning banner - shows when backend is unavailable */}
        {!isApiHealthy && <DemoWarningBanner />}

        <main className="main-content" style={{ minHeight: '80vh' }}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Define all the application routes here */}
                <Route path="/" element={
                  <HomePage isApiHealthy={isApiHealthy} />
                } />
                <Route path="/prediction" element={
                  <PredictionAndOptimizationPage isApiHealthy={isApiHealthy} />
                } />
                <Route path="/soil-health" element={
                  <SoilHealthPage isApiHealthy={isApiHealthy} />
                } />
                <Route path="/weather-analysis" element={
                  <WeatherAnalysisPage isApiHealthy={isApiHealthy} />
                } />
                <Route path="/profile" element={
                  <ProfilePage isApiHealthy={isApiHealthy} />
                } />
                <Route path="/about" element={<AboutPage />} />

                {/* A catch-all route for any undefined paths */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* The Chatbot and Footer are rendered once, at the bottom of every page. */}
        <Chatbot isApiHealthy={isApiHealthy} />
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;