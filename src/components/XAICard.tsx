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
    <Card className="border-2 dark:bg-gray-800 dark:border-gray-700" style={{ borderColor: color === 'orange' ? '#ea580c' : '#2563eb' }}>
      <CardHeader className={color === 'orange' ? 'bg-orange-50 dark:bg-orange-950' : 'bg-blue-50 dark:bg-blue-950'}>
        <CardTitle className={`flex items-center gap-2 ${color === 'orange' ? 'text-orange-900 dark:text-orange-300' : 'text-blue-900 dark:text-blue-300'}`}>
          <AlertCircle className="h-5 w-5" />
          Why the {disease} Risk?
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Base Risk */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300">Base Risk (Historical Average)</span>
          <span className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded">{xaiData.baseRisk.toFixed(2)}</span>
        </div>

        {/* Feature Contributions */}
        <div className="space-y-4">
          <h4 className="text-gray-900 dark:text-white">Feature Contributions</h4>
          {xaiData.features.map((feature) => {
            const isPositive = feature.contribution > 0;
            const barWidth = (Math.abs(feature.contribution) / maxContribution) * 100;
            
            return (
              <div key={feature.name} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white">{formatFeatureName(feature.name)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">= {feature.displayValue}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm whitespace-nowrap ${
                    isPositive ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {isPositive ? '+' : ''}{feature.contribution.toFixed(2)}
                  </span>
                </div>
                
                {/* Contribution bar */}
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isPositive ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Risk */}
        <div className="flex items-center justify-between p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg">
          <span className="text-lg">Final Risk Score</span>
          <span className="text-2xl">{xaiData.finalRisk.toFixed(2)}</span>
        </div>

        {/* Calculation breakdown */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
          <p className="text-gray-700 dark:text-gray-300 mb-2">Calculation:</p>
          <p className="text-gray-600 dark:text-gray-400 font-mono">
            {xaiData.baseRisk.toFixed(2)} (base) 
            {xaiData.features.map(f => ` ${f.contribution >= 0 ? '+' : ''}${f.contribution.toFixed(2)}`).join('')}
            {' = '}
            <span className={xaiData.finalRisk >= 0.67 ? 'text-red-600 dark:text-red-400' : xaiData.finalRisk >= 0.34 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>
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
    water_access: 'Water Access',
    population_density: 'Population Density',
    sanitation: 'Sanitation Coverage',
    coastal_proximity: 'Coastal Proximity',
    altitude: 'Altitude'
  };
  return names[name] || name;
}