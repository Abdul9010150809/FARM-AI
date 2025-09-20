// src/components/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  greeting: string;
}

const backgroundImages = [
  'https://images.unsplash.com/photo-1627920519370-4275133642d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1623594235334-39c4701a2c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
];

const HeroSection: React.FC<HeroSectionProps> = ({ greeting }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();

  // Preload images for smoother transitions
  useEffect(() => {
    backgroundImages.forEach(image => {
      new Image().src = image;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition time
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.heroBackground}>
        {backgroundImages.map((image, index) => (
          <div 
            key={index}
            className={`${styles.heroBgImage} ${index === currentImage ? styles.active : ''} ${isTransitioning ? styles.transitioning : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className={styles.heroOverlay}></div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 text-center">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine}>{greeting}, {user ? user.name : 'Farmer'}!</span>
                <span className={styles.titleLine}>Welcome to CropYieldPro</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Maximize your harvest with our advanced machine learning models that predict 
                crop yields with <span className={styles.highlight}>95% accuracy</span>.
              </p>

              <div className={styles.heroCta}>
                <Link to="/prediction" className={styles.ctaButton}>
                  <span>Get Prediction</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a href="#features" className={`btn btn-outline-light btn-lg ${styles.learnMoreBtn}`}>
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.heroScrollIndicator}>
        <div className={styles.scrollLine}></div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default HeroSection;