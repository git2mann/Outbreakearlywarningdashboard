import { useState, useEffect } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { RegionDrillDown } from './components/RegionDrillDown';
import { Layout } from './components/Layout';
import { Analytics } from './components/Analytics';
import { Reports } from './components/Reports';
import { Alerts } from './components/Alerts';
import { Profile } from './components/Profile';

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
export type NavigationTab = 'dashboard' | 'analytics' | 'reports' | 'alerts' | 'profile';

function App() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [diseaseFilter, setDiseaseFilter] = useState<DiseaseFilter>('all');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    if (selectedCounty && activeTab === 'dashboard') {
      return (
        <RegionDrillDown
          countyName={selectedCounty}
          onBack={() => setSelectedCounty(null)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <MainDashboard
            onCountyClick={setSelectedCounty}
            diseaseFilter={diseaseFilter}
            onFilterChange={setDiseaseFilter}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'alerts':
        return <Alerts />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;