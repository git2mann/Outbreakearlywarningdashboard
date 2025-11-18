import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MainDashboard } from './components/MainDashboard';
import { Analytics } from './components/AnalyticsTabbed';
import { Predictions } from './components/Predictions';
import { ResourceOptimization } from './components/ResourceOptimization';
import { Alerts } from './components/Alerts';
import { Reports } from './components/ReportsTabbed';
import { DataCollection } from './components/DataCollection';
import { Settings } from './components/SettingsTabbed';
import { Profile } from './components/Profile';
import { RegionDrillDown } from './components/RegionDrillDown';
import { LoadingProvider } from './contexts/LoadingContext';
import './styles/globals.css';

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
export type NavigationTab = 'dashboard' | 'data-collection' | 'predictions' | 'resources' | 'analytics' | 'reports' | 'alerts' | 'settings' | 'profile';
export type UserRole = 'chv' | 'official';

function App() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [diseaseFilter, setDiseaseFilter] = useState<DiseaseFilter>('all');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('official');

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
            userRole={userRole}
          />
        );
      case 'data-collection':
        return <DataCollection userRole={userRole} />;
      case 'predictions':
        return <Predictions />;
      case 'resources':
        return <ResourceOptimization />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'alerts':
        return <Alerts userRole={userRole} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile userRole={userRole} />;
      default:
        return null;
    }
  };

  return (
    <LoadingProvider>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        onRoleChange={setUserRole}
      >
        {renderContent()}
      </Layout>
    </LoadingProvider>
  );
}

export default App;