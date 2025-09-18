import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const backgroundImages = [
    'https://images.unsplash.com/photo-1627920519370-4275133642d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Drone over a green field
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', // Lush cornfield rows
    'https://images.unsplash.com/photo-1623594235334-39c4701a2c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'  // Hands holding soil with a seedling
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section id="home" className="hero-section">
      <div className="hero-background">
        {backgroundImages.map((image, index) => (
          <div 
            key={index}
            className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        {/* The overlay is now just for a subtle vignette effect */}
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="title-line">AI-Powered</span>
                <span className="title-line">Crop Yield Prediction</span>
              </h1>
              <p className="hero-subtitle">
                Maximize your harvest with our advanced machine learning models that predict 
                crop yields with <span className="highlight">95% accuracy</span>
              </p>
              <div className="hero-cta">
                <Link to="/prediction" className="btn btn-primary btn-lg cta-button">
                  <span>Get Prediction</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a href="#features" className="btn btn-outline-light btn-lg">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll Down</span>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          overflow: hidden;
          color: white;
        }
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .hero-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
        }
        .hero-bg-image.active {
          opacity: 1;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* CHANGE 1: Removed the green tint, now it's a subtle dark vignette */
          background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
        }
        .hero-content {
          padding: 2rem;
          animation: fadeInUp 1s ease-out;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          /* CHANGE 2: Added text-shadow for readability */
          text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.7);
        }
        .title-line {
          display: block;
        }
        .hero-subtitle {
          font-size: 1.35rem;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
          /* CHANGE 3: Added text-shadow for readability */
          text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.7);
        }
        .highlight {
          color: #7ae582;
          font-weight: 600;
        }
        /* ... rest of your CSS remains the same ... */
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 50px;
          background-color: #7ae582;
          border: none;
          color: #104231;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .cta-button:hover {
          background-color: #63d46b;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          color: #104231;
          text-decoration: none;
        }
        .btn-outline-light {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .btn-outline-light:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          text-decoration: none;
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        .scroll-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), transparent);
          margin-bottom: 10px;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;