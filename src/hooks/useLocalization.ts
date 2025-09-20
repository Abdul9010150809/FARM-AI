// src/hooks/useLocalization.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLocalization = () => {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isGreetingPlayed, setGreetingPlayed] = useState(false);

    useEffect(() => {
        const detectAndSetLanguage = async (lat: number, lon: number) => {
            try {
                const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
                const state = (data.address.state || "").toLowerCase();
                let lang = "en";
                if (state.includes("andhra") || state.includes("telangana")) lang = "te";
                setCurrentLanguage(lang);
            } catch {
                setCurrentLanguage('en'); // Default on error
            }
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => detectAndSetLanguage(pos.coords.latitude, pos.coords.longitude),
            () => setCurrentLanguage('en') // Default on permission denied
        );
    }, []);

    const playGreeting = (lang: string) => {
        if (isGreetingPlayed || !('speechSynthesis' in window)) return;

        const greetings: Record<string, string> = {
            te: "నమస్కారం! పంట అంచనా డాష్‌బోర్డ్‌కు స్వాగతం.",
            hi: "नमस्ते! फसल पूर्वानुमान डैशबोर्ड में आपका स्वागत है।",
            en: "Welcome to the Prediction Dashboard."
        };

        const utterance = new SpeechSynthesisUtterance(greetings[lang] || greetings.en);
        utterance.lang = `${lang}-IN`;
        window.speechSynthesis.speak(utterance);
        setGreetingPlayed(true);
    };

    useEffect(() => {
        playGreeting(currentLanguage);
    }, [currentLanguage]);

    return { currentLanguage, setCurrentLanguage };
};