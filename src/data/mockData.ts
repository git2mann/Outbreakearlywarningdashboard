import { CountyData, SubCountyData } from '../App';

// Mock data representing what the Flask backend would provide
export const KENYA_COUNTIES: CountyData[] = [
  {
    name: 'Baringo',
    riskLevel: 'high',
    choleraRisk: 0.15,
    malariaRisk: 0.88,
    subCounties: [
      {
        name: 'Baringo_Sub1',
        county: 'Baringo',
        choleraRisk: 0.12,
        malariaRisk: 0.75,
        weeklyData: generateWeeklyData([28, 27, 29, 30, 29, 28, 27, 29], [0.25, 0.28, 0.30, 0.32, 0.31, 0.29, 0.28, 0.30], [45, 50, 42, 38, 40, 48, 52, 45]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.03, description: 'Slightly elevated' },
              { name: 'avg_rainfall', value: 45, displayValue: '45mm', contribution: 0.02, description: 'Moderate' },
              { name: 'unimproved_sanitation_rate', value: 0.42, displayValue: '42%', contribution: 0.02, description: 'Poor sanitation' },
              { name: 'mean_ndvi', value: 0.25, displayValue: '0.25', contribution: -0.01, description: 'Low vegetation' },
            ],
            finalRisk: 0.12
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.65, description: 'Ideal range for vectors' },
              { name: 'mean_ndvi', value: 0.30, displayValue: '0.30', contribution: -0.08, description: 'Low vegetation' },
              { name: 'avg_rainfall', value: 45, displayValue: '45mm', contribution: 0.13, description: 'Creates breeding sites' },
              { name: 'unimproved_sanitation_rate', value: 0.42, displayValue: '42%', contribution: 0.00, description: 'Minimal impact' },
            ],
            finalRisk: 0.75
          }
        }
      },
      {
        name: 'Baringo_Sub2',
        county: 'Baringo',
        choleraRisk: 0.18,
        malariaRisk: 0.88,
        weeklyData: generateWeeklyData([29, 28, 30, 31, 30, 29, 28, 29], [0.28, 0.30, 0.32, 0.35, 0.33, 0.31, 0.29, 0.30], [48, 52, 45, 40, 42, 50, 55, 48]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.04, description: 'Elevated' },
              { name: 'avg_rainfall', value: 48, displayValue: '48mm', contribution: 0.03, description: 'Higher rainfall' },
              { name: 'unimproved_sanitation_rate', value: 0.42, displayValue: '42%', contribution: 0.06, description: 'Poor sanitation access' },
              { name: 'mean_ndvi', value: 0.30, displayValue: '0.30', contribution: 0.00, description: 'Neutral' },
            ],
            finalRisk: 0.18
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.75, description: 'Ideal range for vectors' },
              { name: 'mean_ndvi', value: 0.30, displayValue: '0.30', contribution: -0.12, description: 'Low vegetation' },
              { name: 'avg_rainfall', value: 48, displayValue: '48mm', contribution: 0.20, description: 'Significant breeding sites' },
              { name: 'unimproved_sanitation_rate', value: 0.42, displayValue: '42%', contribution: 0.00, description: 'Minimal impact' },
            ],
            finalRisk: 0.88
          }
        }
      }
    ]
  },
  {
    name: 'Turkana',
    riskLevel: 'high',
    choleraRisk: 0.72,
    malariaRisk: 0.25,
    subCounties: [
      {
        name: 'Turkana_Sub1',
        county: 'Turkana',
        choleraRisk: 0.72,
        malariaRisk: 0.25,
        weeklyData: generateWeeklyData([32, 33, 34, 33, 32, 31, 32, 33], [0.15, 0.14, 0.16, 0.15, 0.14, 0.13, 0.15, 0.16], [15, 18, 12, 10, 14, 20, 22, 18]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'unimproved_sanitation_rate', value: 0.65, displayValue: '65%', contribution: 0.45, description: 'Very poor sanitation' },
              { name: 'avg_temp', value: 33, displayValue: '33°C', contribution: 0.15, description: 'High temperature' },
              { name: 'avg_rainfall', value: 18, displayValue: '18mm', contribution: 0.07, description: 'Limited water' },
              { name: 'mean_ndvi', value: 0.15, displayValue: '0.15', contribution: 0.00, description: 'Arid conditions' },
            ],
            finalRisk: 0.72
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 33, displayValue: '33°C', contribution: -0.10, description: 'Too hot for vectors' },
              { name: 'mean_ndvi', value: 0.15, displayValue: '0.15', contribution: -0.08, description: 'Very low vegetation' },
              { name: 'avg_rainfall', value: 18, displayValue: '18mm', contribution: 0.38, description: 'Limited breeding sites' },
              { name: 'unimproved_sanitation_rate', value: 0.65, displayValue: '65%', contribution: 0.00, description: 'Not relevant' },
            ],
            finalRisk: 0.25
          }
        }
      }
    ]
  },
  {
    name: 'Kisumu',
    riskLevel: 'high',
    choleraRisk: 0.68,
    malariaRisk: 0.82,
    subCounties: [
      {
        name: 'Kisumu_Central',
        county: 'Kisumu',
        choleraRisk: 0.68,
        malariaRisk: 0.82,
        weeklyData: generateWeeklyData([26, 27, 26, 25, 26, 27, 28, 27], [0.45, 0.48, 0.50, 0.52, 0.51, 0.49, 0.47, 0.48], [85, 90, 88, 82, 87, 92, 95, 88]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'unimproved_sanitation_rate', value: 0.55, displayValue: '55%', contribution: 0.38, description: 'Poor sanitation' },
              { name: 'avg_rainfall', value: 88, displayValue: '88mm', contribution: 0.18, description: 'High rainfall' },
              { name: 'avg_temp', value: 27, displayValue: '27°C', contribution: 0.07, description: 'Moderate temp' },
              { name: 'mean_ndvi', value: 0.48, displayValue: '0.48', contribution: 0.00, description: 'Good vegetation' },
            ],
            finalRisk: 0.68
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 27, displayValue: '27°C', contribution: 0.52, description: 'Optimal for vectors' },
              { name: 'mean_ndvi', value: 0.48, displayValue: '0.48', contribution: 0.12, description: 'Good vegetation' },
              { name: 'avg_rainfall', value: 88, displayValue: '88mm', contribution: 0.13, description: 'Abundant breeding sites' },
              { name: 'unimproved_sanitation_rate', value: 0.55, displayValue: '55%', contribution: 0.00, description: 'Not relevant' },
            ],
            finalRisk: 0.82
          }
        }
      }
    ]
  },
  {
    name: 'Kilifi',
    riskLevel: 'moderate',
    choleraRisk: 0.45,
    malariaRisk: 0.62,
    subCounties: [
      {
        name: 'Kilifi_North',
        county: 'Kilifi',
        choleraRisk: 0.45,
        malariaRisk: 0.62,
        weeklyData: generateWeeklyData([28, 29, 28, 27, 28, 29, 30, 29], [0.38, 0.40, 0.42, 0.43, 0.41, 0.39, 0.38, 0.40], [62, 65, 60, 58, 63, 68, 70, 65]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'water_access', value: 0.58, displayValue: '58%', contribution: 0.22, description: 'Moderate access' },
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.10, description: 'Warm conditions' },
              { name: 'coastal_proximity', value: 1, displayValue: 'Coastal', contribution: 0.08, description: 'Coastal area' },
            ],
            finalRisk: 0.45
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 29, displayValue: '29°C', contribution: 0.38, description: 'Good for vectors' },
              { name: 'mean_ndvi', value: 0.40, displayValue: '0.40', contribution: 0.08, description: 'Moderate vegetation' },
              { name: 'avg_rainfall', value: 65, displayValue: '65mm', contribution: 0.11, description: 'Moderate breeding sites' },
            ],
            finalRisk: 0.62
          }
        }
      }
    ]
  },
  {
    name: 'Nairobi',
    riskLevel: 'low',
    choleraRisk: 0.28,
    malariaRisk: 0.18,
    subCounties: [
      {
        name: 'Nairobi_Westlands',
        county: 'Nairobi',
        choleraRisk: 0.28,
        malariaRisk: 0.18,
        weeklyData: generateWeeklyData([22, 23, 22, 21, 22, 23, 24, 23], [0.35, 0.36, 0.38, 0.37, 0.36, 0.35, 0.34, 0.36], [55, 58, 52, 50, 54, 60, 62, 58]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'water_access', value: 0.82, displayValue: '82%', contribution: -0.12, description: 'Good access' },
              { name: 'population_density', value: 2500, displayValue: '2500/km²', contribution: 0.28, description: 'Very high density' },
              { name: 'sanitation', value: 0.75, displayValue: '75%', contribution: 0.07, description: 'Decent sanitation' },
            ],
            finalRisk: 0.28
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 23, displayValue: '23°C', contribution: 0.08, description: 'Cooler, less favorable' },
              { name: 'altitude', value: 1795, displayValue: '1795m', contribution: -0.15, description: 'High altitude' },
              { name: 'mean_ndvi', value: 0.36, displayValue: '0.36', contribution: 0.20, description: 'Urban greenery' },
            ],
            finalRisk: 0.18
          }
        }
      }
    ]
  },
  {
    name: 'Machakos',
    riskLevel: 'low',
    choleraRisk: 0.22,
    malariaRisk: 0.25,
    subCounties: [
      {
        name: 'Machakos_Town',
        county: 'Machakos',
        choleraRisk: 0.22,
        malariaRisk: 0.25,
        weeklyData: generateWeeklyData([24, 25, 24, 23, 24, 25, 26, 25], [0.32, 0.34, 0.36, 0.35, 0.34, 0.32, 0.31, 0.34], [48, 50, 45, 42, 47, 52, 55, 50]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'water_access', value: 0.72, displayValue: '72%', contribution: -0.05, description: 'Adequate access' },
              { name: 'avg_temp', value: 25, displayValue: '25°C', contribution: 0.08, description: 'Moderate' },
              { name: 'population_density', value: 450, displayValue: '450/km²', contribution: 0.14, description: 'Medium density' },
            ],
            finalRisk: 0.22
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 25, displayValue: '25°C', contribution: 0.12, description: 'Moderate for vectors' },
              { name: 'mean_ndvi', value: 0.34, displayValue: '0.34', contribution: 0.05, description: 'Low-moderate vegetation' },
              { name: 'avg_rainfall', value: 50, displayValue: '50mm', contribution: 0.03, description: 'Limited breeding sites' },
            ],
            finalRisk: 0.25
          }
        }
      }
    ]
  },
  {
    name: 'Mombasa',
    riskLevel: 'moderate',
    choleraRisk: 0.52,
    malariaRisk: 0.48,
    subCounties: [
      {
        name: 'Mombasa_Island',
        county: 'Mombasa',
        choleraRisk: 0.52,
        malariaRisk: 0.48,
        weeklyData: generateWeeklyData([29, 30, 29, 28, 29, 30, 31, 30], [0.28, 0.30, 0.32, 0.31, 0.30, 0.28, 0.27, 0.30], [58, 62, 55, 52, 57, 63, 65, 60]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'water_access', value: 0.62, displayValue: '62%', contribution: 0.18, description: 'Limited in some areas' },
              { name: 'population_density', value: 1800, displayValue: '1800/km²', contribution: 0.22, description: 'Very crowded' },
              { name: 'coastal_proximity', value: 1, displayValue: 'Coastal', contribution: 0.07, description: 'Coastal city' },
            ],
            finalRisk: 0.52
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 30, displayValue: '30°C', contribution: 0.28, description: 'Warm conditions' },
              { name: 'mean_ndvi', value: 0.30, displayValue: '0.30', contribution: 0.05, description: 'Urban, low vegetation' },
              { name: 'avg_rainfall', value: 60, displayValue: '60mm', contribution: 0.10, description: 'Some breeding sites' },
            ],
            finalRisk: 0.48
          }
        }
      }
    ]
  },
  {
    name: 'Kakamega',
    riskLevel: 'moderate',
    choleraRisk: 0.38,
    malariaRisk: 0.58,
    subCounties: [
      {
        name: 'Kakamega_Central',
        county: 'Kakamega',
        choleraRisk: 0.38,
        malariaRisk: 0.58,
        weeklyData: generateWeeklyData([25, 26, 25, 24, 25, 26, 27, 26], [0.52, 0.54, 0.56, 0.55, 0.54, 0.52, 0.51, 0.54], [78, 82, 75, 72, 77, 85, 88, 80]),
        xaiData: {
          cholera: {
            baseRisk: 0.05,
            features: [
              { name: 'water_access', value: 0.65, displayValue: '65%', contribution: 0.12, description: 'Moderate access' },
              { name: 'avg_rainfall', value: 80, displayValue: '80mm', contribution: 0.15, description: 'High rainfall' },
              { name: 'population_density', value: 680, displayValue: '680/km²', contribution: 0.06, description: 'Medium-high density' },
            ],
            finalRisk: 0.38
          },
          malaria: {
            baseRisk: 0.05,
            features: [
              { name: 'avg_temp', value: 26, displayValue: '26°C', contribution: 0.35, description: 'Good for vectors' },
              { name: 'mean_ndvi', value: 0.54, displayValue: '0.54', contribution: 0.08, description: 'High vegetation' },
              { name: 'avg_rainfall', value: 80, displayValue: '80mm', contribution: 0.10, description: 'Many breeding sites' },
            ],
            finalRisk: 0.58
          }
        }
      }
    ]
  }
];

function generateWeeklyData(temps: number[], ndvis: number[], rainfalls: number[]) {
  return temps.map((temp, i) => ({
    week: i + 1,
    avg_temp: temp,
    mean_ndvi: ndvis[i],
    avg_rainfall: rainfalls[i]
  }));
}

export function getAllSubCounties(): SubCountyData[] {
  return KENYA_COUNTIES.flatMap(county => county.subCounties);
}

export function getCountyByName(name: string): CountyData | undefined {
  return KENYA_COUNTIES.find(c => c.name === name);
}

export function getTopRiskySubCounties(limit: number = 5, disease?: 'cholera' | 'malaria'): Array<SubCountyData & { disease: 'cholera' | 'malaria', riskScore: number }> {
  const allSubCounties = getAllSubCounties();
  
  const risks = allSubCounties.flatMap(sub => [
    { ...sub, disease: 'cholera' as const, riskScore: sub.choleraRisk },
    { ...sub, disease: 'malaria' as const, riskScore: sub.malariaRisk }
  ]);
  
  const filtered = disease 
    ? risks.filter(r => r.disease === disease)
    : risks;
  
  return filtered
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
}

export interface FeatureContribution {
  name: string;
  value: number;
  displayValue: string;
  contribution: number;
  description: string;
}

// Actual model features based on simulated_outbreak_data_v15.csv
export interface ModelFeatures {
  unimproved_sanitation_rate: number;
  avg_rainfall: number;
  mean_ndvi: number;
  avg_temp: number;
}

export interface CaseReport {
  report_id: number;
  year: number;
  week: string; // e.g., "2023-01-02/2023-01-08"
  county: string;
  sub_county: string;
  disease: 'Cholera' | 'Malaria';
  unimproved_sanitation_rate: number;
  avg_rainfall: number;
  mean_ndvi: number;
  avg_temp: number;
  cases: number;
  outbreak: 0 | 1;
}