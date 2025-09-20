// src/hooks/usePredictionApi.ts
import { useState } from 'react';
import { PredictionResult } from '../types';

export const usePredictionApi = (showNotification: (msg: string, type: 'success' | 'error') => void) => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPrediction = async (payload: any) => {
    setIsLoading(true);
    setResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const plantingMonth = new Date(payload.formData.plantingDate).getMonth();
      let plantingWarning = "";
      if (payload.formData.crop === 'rice' && (plantingMonth < 5 || plantingMonth > 7)) {
        plantingWarning = "Warning: Planting date is outside the optimal Kharif season (June-August), which may affect yield.";
      }

      // **FIX**: The mock result now perfectly matches the PredictionResult type
      const mockResult: PredictionResult = {
        yield: 2450,
        confidence: 96.2,
        roi: 185,
        sustainabilityScore: 88,
        recommendations: {
          irrigation: "Apply 5cm of water every 7 days. Use drip irrigation to save 40% water.",
          fertilization: `Based on soil NPK, apply a 120:60:60 kg/ha ratio. ${plantingWarning}`,
          pestControl: "High humidity increases risk of Blast disease. Proactively spray Tricyclazole.",
          market: `Current mandi price in ${payload.location.city} is ₹2,100/quintal. Prices may rise 5%.`
        },
        diseaseAlert: { risk: 'Medium', details: 'Weather is favorable for Brown Spot. Monitor lower leaves.' },
        yieldHistory: [2200, 2350, 2100, 2400, 2450],
        costBreakdown: { seeds: 2500, fertilizers: 4800, labor: 6200, irrigation: 3200, other: 2800 },
        optimizationScenarios: [
          {
            title: 'High ROI Focus',
            description: 'Reduce fertilizer costs and adjust irrigation for maximum profitability.',
            changes: { Yield: '-3%', Cost: '-15%', ROI: '+25%' },
            icon: 'fas fa-dollar-sign'
          },
          {
            title: 'Water Saver',
            description: 'Utilize advanced drip irrigation timing to reduce water usage with minimal impact on yield.',
            changes: { Yield: '-5%', Cost: '+5%', 'Water Usage': '-40%' },
            icon: 'fas fa-tint-slash'
          },
          {
            title: 'Organic Approach',
            description: 'Switch to organic fertilizers. Higher labor cost but premium market price.',
            changes: { Yield: '-15%', Cost: '+20%', 'Market Price': '+50%' },
            icon: 'fas fa-leaf'
          }
        ]
      };
      
      setResult(mockResult);
      showNotification('Prediction & Optimization complete!', 'success');
    } catch (err) {
      showNotification("Prediction request failed.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, getPrediction };
};