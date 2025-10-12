import React from 'react';
// This import works because when you import from a folder,
// the build system automatically looks for a file named 'index.tsx' inside it.
// FIX: Using an absolute path from the project's source directory.
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    // You can add page-specific containers or titles here if needed.
    // The main content comes from the imported section component.
    <AboutSection />
  );
};

export default AboutPage;
