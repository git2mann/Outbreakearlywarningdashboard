import { useState } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { RegionDrillDown } from './components/RegionDrillDown';

export interface CountyData {
  name: string;
  riskLevel: 'low' | 'moderate' | 'high';
  choleraRisk: number;
  malariaRisk: number;
  subCounties: SubCountyData[];
}

export interface SubCountyData {
  name: string;
  county: string;
  choleraRisk: number;
  malariaRisk: number;
  weeklyData: WeeklyData[];
  xaiData: {
    cholera: XAIExplanation;
    malaria: XAIExplanation;
  };
}

export interface WeeklyData {
  week: number;
  avg_temp: number;
  mean_ndvi: number;
  avg_rainfall: number;
}

export interface XAIExplanation {
  baseRisk: number;
  features: FeatureContribution[];
  finalRisk: number;
}

export interface FeatureContribution {
  name: string;
  value: number;
  displayValue: string;
  contribution: number;
  description: string;
}

export type DiseaseFilter = 'all' | 'cholera' | 'malaria';

function App() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [diseaseFilter, setDiseaseFilter] = useState<DiseaseFilter>('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedCounty ? (
        <RegionDrillDown
          countyName={selectedCounty}
          onBack={() => setSelectedCounty(null)}
        />
      ) : (
        <MainDashboard
          onCountyClick={setSelectedCounty}
          diseaseFilter={diseaseFilter}
          onFilterChange={setDiseaseFilter}
        />
      )}
    </div>
  );
}

export default App;
