import { CaseReport, ModelFeatures } from '../data/mockData';

/**
 * Format data for Flask ML model prediction API
 * Endpoint: POST /api/predict
 */
export interface PredictionRequest {
  county: string;
  sub_county: string;
  disease: 'Cholera' | 'Malaria';
  features: ModelFeatures;
}

export interface PredictionResponse {
  county: string;
  sub_county: string;
  disease: string;
  outbreak_probability: number;
  outbreak_prediction: 0 | 1;
  risk_score: number;
  xai_explanation: {
    base_risk: number;
    feature_contributions: Array<{
      feature: string;
      value: number;
      contribution: number;
      description: string;
    }>;
    final_risk: number;
  };
}

/**
 * Submit a case report to Flask backend
 * Endpoint: POST /api/cases/submit
 */
export interface CaseSubmission {
  year: number;
  week: string;
  county: string;
  sub_county: string;
  disease: 'Cholera' | 'Malaria';
  unimproved_sanitation_rate: number;
  avg_rainfall: number;
  mean_ndvi: number;
  avg_temp: number;
  cases: number;
  patient_age?: number;
  patient_gender?: string;
  symptoms?: string[];
  notes?: string;
}

/**
 * Get predictions for a specific county/sub-county
 */
export async function getPrediction(data: PredictionRequest): Promise<PredictionResponse> {
  // TODO: Replace with actual Flask API call
  // const response = await fetch('/api/predict', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();
  
  // Mock response for now
  return {
    county: data.county,
    sub_county: data.sub_county,
    disease: data.disease,
    outbreak_probability: 0.85,
    outbreak_prediction: 1,
    risk_score: 0.85,
    xai_explanation: {
      base_risk: 0.05,
      feature_contributions: [
        { feature: 'avg_temp', value: data.features.avg_temp, contribution: 0.45, description: 'High temperature' },
        { feature: 'avg_rainfall', value: data.features.avg_rainfall, contribution: 0.20, description: 'Moderate rainfall' },
        { feature: 'mean_ndvi', value: data.features.mean_ndvi, contribution: 0.10, description: 'Vegetation index' },
        { feature: 'unimproved_sanitation_rate', value: data.features.unimproved_sanitation_rate, contribution: 0.05, description: 'Sanitation conditions' }
      ],
      final_risk: 0.85
    }
  };
}

/**
 * Submit a case report
 */
export async function submitCaseReport(data: CaseSubmission): Promise<{ success: boolean; report_id: number }> {
  // TODO: Replace with actual Flask API call
  // const response = await fetch('/api/cases/submit', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();
  
  // Mock response for now
  console.log('Case report submitted:', data);
  return {
    success: true,
    report_id: Date.now()
  };
}

/**
 * Get historical data for a county
 */
export async function getHistoricalData(county: string, disease?: string): Promise<CaseReport[]> {
  // TODO: Replace with actual Flask API call
  // const params = new URLSearchParams({ county, ...(disease && { disease }) });
  // const response = await fetch(`/api/cases/history?${params}`);
  // return response.json();
  
  return [];
}

/**
 * Format week string for the model (YYYY-MM-DD/YYYY-MM-DD format)
 */
export function getCurrentWeekRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  return `${formatDate(monday)}/${formatDate(sunday)}`;
}

/**
 * Get current sanitation rate for a county (would come from backend)
 */
export async function getSanitationRate(county: string): Promise<number> {
  // TODO: Replace with actual API call
  const rates: Record<string, number> = {
    'Baringo': 0.42,
    'Turkana': 0.65,
    'Kisumu': 0.55,
    'Kilifi': 0.48,
    'Nairobi': 0.18,
    'Machakos': 0.28,
    'Mombasa': 0.38,
    'Kakamega': 0.35
  };
  
  return rates[county] || 0.50;
}
