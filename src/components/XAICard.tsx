import { XAIExplanation } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface XAICardProps {
  disease: string;
  xaiData: XAIExplanation;
  color: 'orange' | 'blue';
}

export function XAICard({ disease, xaiData, color }: XAICardProps) {
  const maxContribution = Math.max(...xaiData.features.map(f => Math.abs(f.contribution)));
  
  return (
    <Card className="border-2 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-sm shadow-xl overflow-hidden" style={{ borderColor: color === 'orange' ? '#ea580c' : '#2563eb' }}>
      <CardHeader className={`${color === 'orange' ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50'} border-b border-gray-200 dark:border-gray-700`}>
        <CardTitle className={`flex items-center gap-2 ${color === 'orange' ? 'text-orange-900 dark:text-orange-200' : 'text-blue-900 dark:text-blue-200'}`}>
          <div className={`p-2 ${color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-lg`}>
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          Why the {disease} Risk?
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Base Risk */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-gray-700 dark:text-gray-200 font-medium">Base Risk (Historical Average)</span>
          <span className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:text-gray-100 px-4 py-2 rounded-lg font-bold shadow-sm">{xaiData.baseRisk.toFixed(2)}</span>
        </div>

        {/* Feature Contributions */}
        <div className="space-y-4">
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Feature Contributions
          </h4>
          {xaiData.features.map((feature) => {
            const isPositive = feature.contribution > 0;
            const barWidth = (Math.abs(feature.contribution) / maxContribution) * 100;
            
            return (
              <div key={feature.name} className="space-y-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{formatFeatureName(feature.name)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">= {feature.displayValue}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feature.description}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap shadow-md ${
                    isPositive ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/70 dark:to-red-800/70 dark:text-red-200' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/70 dark:to-blue-800/70 dark:text-blue-200'
                  }`}>
                    {isPositive ? '+' : ''}{feature.contribution.toFixed(2)}
                  </span>
                </div>
                
                {/* Contribution bar with gradient */}
                <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${isPositive ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} shadow-lg transition-all duration-300`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Risk */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-blue-600 dark:to-purple-600 text-white rounded-xl shadow-xl">
          <span className="text-lg font-semibold">Final Risk Score</span>
          <span className="text-3xl font-bold">{xaiData.finalRisk.toFixed(2)}</span>
        </div>

        {/* Calculation breakdown */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl text-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-200 mb-2 font-semibold">Calculation:</p>
          <p className="text-gray-600 dark:text-gray-300 font-mono text-xs leading-relaxed">
            {xaiData.baseRisk.toFixed(2)} (base) 
            {xaiData.features.map(f => ` ${f.contribution >= 0 ? '+' : ''}${f.contribution.toFixed(2)}`).join('')}
            {' = '}
            <span className={`font-bold ${xaiData.finalRisk >= 0.67 ? 'text-red-600 dark:text-red-300' : xaiData.finalRisk >= 0.34 ? 'text-yellow-600 dark:text-yellow-300' : 'text-green-600 dark:text-green-300'}`}>
              {xaiData.finalRisk.toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatFeatureName(name: string): string {
  const names: Record<string, string> = {
    avg_temp: 'Average Temperature',
    mean_ndvi: 'Vegetation Index (NDVI)',
    avg_rainfall: 'Average Rainfall',
    unimproved_sanitation_rate: 'Unimproved Sanitation Rate',
    population_density: 'Population Density',
    coastal_proximity: 'Coastal Proximity',
    altitude: 'Altitude'
  };
  return names[name] || name;
}