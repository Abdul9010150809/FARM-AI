// src/pages/HomePage.tsx
import React, { Suspense } from 'react';
// Make sure to import all your components
// import StatsSection from '../components/StatsSection';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CropsSection from '../components/CropsSection';
// import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import { WeatherData } from '../types'; // It's good practice to use your type

// Simple loading fallback component for Suspense
const LoadingFallback: React.FC = () => (
  <div className="text-center my-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true); // Start with loading true
  const [error] = React.useState<string | null>(null);
  // Use your defined WeatherData type for better type safety
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);

  React.useEffect(() => {
    // Simulate an async fetch
    const timer = setTimeout(() => {
      // ✅ FIX: Uncomment this line and provide some mock data
      setWeatherData({
        temp: 29,
        humidity: 65,
        wind_speed: 10,
        main: 'Clear',
        description: 'clear sky',
        icon: 'https://openweathermap.org/img/wn/01d@2x.png',
        rainfall: 0,
      });
      setIsLoading(false);
    }, 1500); // Increased time to see the loading spinner

    // Cleanup function to prevent errors if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection greeting="Good Evening" />
        

        <div className="container my-4 text-center">
          {isLoading && (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading weather...</span>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          {/* This will now work because weatherData will be populated */}
          {weatherData && !isLoading && !error && (
            <FeaturesSection weatherData={weatherData} />
          )}
        </div>

        <CropsSection />
        <AboutSection />
        {/* <Footer /> */}
      </Suspense>
    </div>
  );
};

export default HomePage;