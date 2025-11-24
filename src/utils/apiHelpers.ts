// Fetch outbreak predictions from backend model for all sub-counties/diseases
export async function fetchOutbreakPredictions(): Promise<any[]> {
  // Get all sub-counties and their features
  const { getAllSubCounties } = await import('../data/mockData');
  const subCounties = getAllSubCounties();
  // Prepare batch request: for each sub-county, create cholera and malaria prediction requests
  const batchItems: any[] = [];
  subCounties.forEach((sub) => {
    // Cholera: expects unimproved_sanitation_rate, avg_rainfall
    batchItems.push({
      sub_county: sub.name,
      county: sub.county,
      disease: 'cholera',
      features: [
        sub.xaiData.cholera.features.find(f => f.name === 'unimproved_sanitation_rate')?.value ?? 0,
        sub.xaiData.cholera.features.find(f => f.name === 'avg_rainfall')?.value ?? 0,
        sub.xaiData.cholera.features.find(f => f.name === 'mean_ndvi')?.value ?? 0,
        sub.xaiData.cholera.features.find(f => f.name === 'avg_temp')?.value ?? 0,
      ],
    });
    // Malaria: expects mean_ndvi, avg_temp
    batchItems.push({
      sub_county: sub.name,
      county: sub.county,
      disease: 'malaria',
      features: [
        sub.xaiData.malaria.features.find(f => f.name === 'unimproved_sanitation_rate')?.value ?? 0,
        sub.xaiData.malaria.features.find(f => f.name === 'avg_rainfall')?.value ?? 0,
        sub.xaiData.malaria.features.find(f => f.name === 'mean_ndvi')?.value ?? 0,
        sub.xaiData.malaria.features.find(f => f.name === 'avg_temp')?.value ?? 0,
      ],
    });
  });
  // Call the batch endpoint
  const response = await fetch('http://localhost:5000/predict/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batchItems),
  });
  const predictions = await response.json();
  // Attach predictions to the batchItems for easy mapping
  return batchItems.map((item, i) => ({
    ...item,
    riskScore: typeof predictions[i]?.probability === 'number' ? predictions[i].probability : 0,
  }));
}
// Fetch outbreak data (mock implementation, returns sub-county case data)
export async function fetchOutbreakData(): Promise<any[]> {
  // For now, use the mock data from getAllSubCounties and flatten to a row format
  // Each sub-county will be returned as a row for both diseases, with a 'cases' property
  const { getAllSubCounties } = await import('../data/mockData');
  const subCounties = getAllSubCounties();
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // For demo, create mock case numbers for each disease
  const rows: any[] = [];
  subCounties.forEach((sub) => {
    // Cholera row
    rows.push({
      sub_county: sub.name,
      county: sub.county,
      disease: 'cholera',
      cases: Math.round(sub.choleraRisk * 100),
    });
    // Malaria row
    rows.push({
      sub_county: sub.name,
      county: sub.county,
      disease: 'malaria',
      cases: Math.round(sub.malariaRisk * 100),
    });
  });
  return rows;
}
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
  // Determine endpoint based on disease
  let endpoint = '';
  if (data.disease === 'Cholera') {
    endpoint = 'http://localhost:5000/predict/cholera';
  } else if (data.disease === 'Malaria') {
    endpoint = 'http://localhost:5000/predict/malaria';
  } else {
    throw new Error('Unsupported disease type');
  }

  // Prepare features array in the order expected by the model (as in simulated_outbreak_data_v15.csv)
  const features = [
    data.features.unimproved_sanitation_rate,
    data.features.avg_rainfall,
    data.features.mean_ndvi,
    data.features.avg_temp
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features })
  });
  const result = await response.json();

  // Use the 'probability' field from backend as the risk score
  const prob = typeof result.probability === 'number' ? result.probability : 0;
  return {
    county: data.county,
    sub_county: data.sub_county,
    disease: data.disease,
    outbreak_probability: prob,
    outbreak_prediction: prob > 0.5 ? 1 : 0,
    risk_score: prob,
    xai_explanation: {
      base_risk: 0,
      feature_contributions: [
        { feature: 'unimproved_sanitation_rate', value: data.features.unimproved_sanitation_rate, contribution: 0, description: '' },
        { feature: 'avg_rainfall', value: data.features.avg_rainfall, contribution: 0, description: '' },
        { feature: 'mean_ndvi', value: data.features.mean_ndvi, contribution: 0, description: '' },
        { feature: 'avg_temp', value: data.features.avg_temp, contribution: 0, description: '' }
      ],
      final_risk: prob
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
