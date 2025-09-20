import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // 👈 Import custom matchers
import HeroSection from './HeroSection';
import { AuthProvider } from '../contexts/AuthContext'; // 👈 Import the provider
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for <Link>

test('renders the hero section with a greeting', () => {
  const props = {
    greeting: 'Good Evening',
    weather: {
      temp: 28,
      humidity: 85,
      wind_speed: 10,
      main: 'Cloudy',
      description: 'overcast clouds',
      icon: '04d'
    },
    isLoading: false,
    error: null,
  };

  // 👇 Wrap the component with the provider here
  render(
    <Router>
      <AuthProvider>
        <HeroSection {...props} />
      </AuthProvider>
    </Router>
  );

  // Your test assertions would go here
  expect(screen.getByText(/Good Evening, Farmer!/i)).toBeInTheDocument();
});