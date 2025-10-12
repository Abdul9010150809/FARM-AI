import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  greeting: string;
}

const backgroundImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1627920519370-4275133642d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
];

// Language content - moved outside component to prevent recreation
const languageContent = {
  en: {
    welcome: "Welcome to",
    subtitle: "Maximize your harvest with our advanced machine learning models that predict crop yields with 95% accuracy. Get personalized insights for better farming decisions.",
    ctaPrimary: "Get Smart Prediction",
    ctaSecondary: "Explore Features",
    scrollText: "Discover More",
    farmer: "Farmer",
    stats: [
      { number: '12%', label: 'Average Yield Increase', icon: '📈' },
      { number: '8,000+', label: 'Farmers Supported', icon: '👨‍🌾' },
      { number: '18', label: 'Crop Types', icon: '🌱' },
      { number: '95%', label: 'Prediction Accuracy', icon: '🎯' }
    ]
  },
  te: {
    welcome: "స్వాగతం",
    subtitle: "95% ఖచ్చితత్వంతో పంట దిగుబడిని అంచనా వేసే మా అధునాతన మెషిన్ లెర్నింగ్ మోడల్స్ తో మీ పంటను గరిష్టంగా పెంచుకోండి. మెరుగైన వ్యవసాయ నిర్ణయాల కోసం వ్యక్తిగత అంతర్దృష్టులను పొందండి.",
    ctaPrimary: "స్మార్ట్ అంచనా పొందండి",
    ctaSecondary: "విశేషాలు అన్వేషించండి",
    scrollText: "మరింత తెలుసుకోండి",
    farmer: "రైతు",
    stats: [
      { number: '12%', label: 'సగటు దిగుబడి పెరుగుదల', icon: '📈' },
      { number: '8,000+', label: 'రైతులకు మద్దతు', icon: '👨‍🌾' },
      { number: '18', label: 'పంటల రకాలు', icon: '🌱' },
      { number: '95%', label: 'అంచనా ఖచ్చితత్వం', icon: '🎯' }
    ]
  }
};

const HeroSection: React.FC<HeroSectionProps> = ({ greeting }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeBasedGreeting, setTimeBasedGreeting] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasAutoSpokenRef = useRef(false);

  // Get current language content - use memo to prevent recreation
  const content = React.useMemo(() => {
    return currentLanguage === 'te' ? languageContent.te : languageContent.en;
  }, [currentLanguage]);

  // Get time-based greeting in different languages
  const getTimeBasedGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    
    if (currentLanguage === 'te') {
      if (hour >= 5 && hour < 12) return 'శుభోదయం';
      if (hour >= 12 && hour < 17) return 'శుభ మద్యాహ్నం';
      if (hour >= 17 && hour < 21) return 'శుభ సాయంత్రం';
      return 'శుభ రాత్రి';
    } else {
      if (hour >= 5 && hour < 12) return 'Good Morning';
      if (hour >= 12 && hour < 17) return 'Good Afternoon';
      if (hour >= 17 && hour < 21) return 'Good Evening';
      return 'Good Night';
    }
  }, [currentLanguage]);

  // Improved speech synthesis with better state management
  const speakGreeting = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Prevent multiple calls
    if (isSpeaking) {
      return;
    }

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;

    // Set language for speech synthesis
    if (currentLanguage === 'te') {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-US';
    }

    speechSynthesisRef.current = utterance;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    // Small delay to ensure everything is ready
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error starting speech synthesis:', error);
        setIsSpeaking(false);
      }
    }, 100);
  }, [isSpeaking, currentLanguage]);

  // Auto-speak greeting only once when component mounts or language changes
  useEffect(() => {
    if (!hasAutoSpokenRef.current) {
      let greetingText = '';
      
      if (currentLanguage === 'te') {
        greetingText = user 
          ? `${timeBasedGreeting}, ${user.name}! ${content.welcome} క్రాప్ యీల్డ్ ప్రో. మీ స్మార్ట్ ఫార్మింగ్ అసిస్టెంట్.`
          : `${timeBasedGreeting}, ${content.farmer}! ${content.welcome} క్రాప్ యీల్డ్ ప్రో. మీ స్మార్ట్ ఫార్మింగ్ అసిస్టెంట్.`;
      } else {
        greetingText = user 
          ? `${timeBasedGreeting}, ${user.name}! ${content.welcome} Crop Yield Pro. Your intelligent farming assistant.`
          : `${timeBasedGreeting}! ${content.welcome} Crop Yield Pro. Your intelligent farming assistant.`;
      }
      
      const timer = setTimeout(() => {
        speakGreeting(greetingText);
        hasAutoSpokenRef.current = true;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [timeBasedGreeting, user, speakGreeting, currentLanguage, content]);

  // Reset auto-speak when language changes
  useEffect(() => {
    hasAutoSpokenRef.current = false;
  }, [currentLanguage]);

  // Background image rotation
  useEffect(() => {
    // Preload images
    backgroundImages.forEach(image => {
      const img = new Image();
      img.src = image;
    });

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 800);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Update time-based greeting
  useEffect(() => {
    const updateGreeting = () => {
      const newGreeting = getTimeBasedGreeting();
      setTimeBasedGreeting(newGreeting);
    };

    updateGreeting();
    const timeInterval = setInterval(updateGreeting, 60000);

    return () => {
      clearInterval(timeInterval);
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [getTimeBasedGreeting]);

  const handleManualSpeak = () => {
    let greetingText = '';
    
    if (currentLanguage === 'te') {
      greetingText = user 
        ? `${timeBasedGreeting}, ${user.name}! ${content.welcome} క్రాప్ యీల్డ్ ప్రో.`
        : `${timeBasedGreeting}, ${content.farmer}! ${content.welcome} క్రాప్ యీల్డ్ ప్రో.`;
    } else {
      greetingText = user 
        ? `${timeBasedGreeting}, ${user.name}! ${content.welcome} Crop Yield Pro.`
        : `${timeBasedGreeting}! ${content.welcome} Crop Yield Pro.`;
    }
    
    speakGreeting(greetingText);
  };

  return (
    <section id="home" className={styles.heroSection}>
      {/* Background Images */}
      <div className={styles.heroBackground}>
        <div className={styles.backgroundContainer}>
          {backgroundImages.map((image, index) => (
            <div 
              key={index}
              className={`${styles.heroBgImage} ${index === currentImage ? styles.active : ''} ${isTransitioning ? styles.transitioning : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.overlayGradient}></div>
      </div>
      
      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.contentContainer}>
          {/* Main Content */}
          <div className={styles.textContent}>
            <div className={styles.greetingContainer}>
              <span className={styles.timeGreeting}>{timeBasedGreeting}</span>
              <span className={styles.welcomeText}>, {user ? user.name : content.farmer}!</span>
              
              {/* Voice Control Button */}
              <button 
                onClick={handleManualSpeak}
                disabled={isSpeaking}
                className={styles.voiceButton}
                title={isSpeaking ? "Speaking..." : "Listen to greeting"}
              >
                {isSpeaking ? '🔊' : '🔈'}
              </button>
            </div>
            
            <h1 className={styles.heroTitle}>
              {content.welcome} <span className={styles.brandName}>CropYieldPro</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              {content.subtitle}
            </p>

            {/* Statistics Grid - FIXED: Using content.stats directly */}
            <div className={styles.heroStats}>
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className={styles.statItem}>
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={styles.statNumber}>{stat.number}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.heroCta}>
              <Link to="/prediction" className={styles.ctaButtonPrimary}>
                <span>{content.ctaPrimary}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/features" className={styles.ctaButtonSecondary}>
                <span>{content.ctaSecondary}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className={styles.heroScrollIndicator}>
        <div className={styles.scrollLine}></div>
        <span className={styles.scrollText}>{content.scrollText}</span>
      </div>
    </section>
  );
};

export default HeroSection;