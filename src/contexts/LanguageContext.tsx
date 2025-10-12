import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
  availableLanguages: Array<{ code: string; name: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [translateInitialized, setTranslateInitialized] = useState(false);

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' },
  ];

  // Simple Google Translate initialization without infinite loops
  useEffect(() => {
    if (translateInitialized) return;

    const initializeTranslate = () => {
      // Remove any existing instances
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Clean up any existing translate elements
      const existingFrames = document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame');
      existingFrames.forEach(frame => frame.remove());

      window.googleTranslateElementInit = () => {
        try {
          if (window.google?.translate?.TranslateElement) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,te,hi,ta,mr',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_element'
            );
            console.log('Google Translate initialized');
            setTranslateInitialized(true);
          }
        } catch (error) {
          console.error('Error in Google Translate initialization:', error);
          setTranslateInitialized(true); // Mark as initialized even if failed
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
        setTranslateInitialized(true);
      };
      
      document.head.appendChild(script);
    };

    // Initialize with delay to prevent conflicts
    const timer = setTimeout(initializeTranslate, 1000);
    return () => clearTimeout(timer);
  }, [translateInitialized]);

  // Initialize language from cookie
  useEffect(() => {
    const cookieLang = Cookies.get('googtrans');
    if (cookieLang) {
      const langCode = cookieLang.replace('/en/', '');
      setCurrentLanguage(langCode || 'en');
    }
  }, []);

  const changeLanguage = useCallback((langCode: string) => {
    console.log(`Changing language to: ${langCode}`);
    
    // Set the cookie
    Cookies.set('googtrans', `/en/${langCode}`, { 
      expires: 365,
      path: '/',
      sameSite: 'Lax'
    });
    setCurrentLanguage(langCode);

    // Simple language change without complex Google Translate API calls
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      availableLanguages,
    }}>
      {children}
      {/* Google Translate Element - Hidden */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
