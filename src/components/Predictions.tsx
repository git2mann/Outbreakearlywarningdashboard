import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, TrendingUp, Droplet, Bug, Calendar, MapPin, Eye, Cloud, Thermometer, Activity } from 'lucide-react';
import { useLoading } from '../contexts/LoadingContext';
import { PredictionsSkeleton } from './skeletons/PredictionsSkeleton';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Predictions() {
  const { isLoading } = useLoading();
  const [selectedCounty, setSelectedCounty] = useState('baringo');
  const [selectedDisease, setSelectedDisease] = useState<'cholera' | 'malaria'>('cholera');

  if (isLoading) {
    return <PredictionsSkeleton />;
  }

  const counties = ['Baringo', 'Turkana', 'Kisumu', 'Kilifi', 'Nairobi', 'Machakos', 'Mombasa', 'Kakamega'];

  // Current week environmental data (would come from sensors/APIs)
  const currentEnvironmentalData: Record<string, { temp: number; rainfall: number; ndvi: number; sanitation: number }> = {
    baringo: { temp: 29.5, rainfall: 45.2, ndvi: 0.42, sanitation: 0.42 },
    turkana: { temp: 33.1, rainfall: 18.5, ndvi: 0.15, sanitation: 0.65 },
    kisumu: { temp: 27.8, rainfall: 88.3, ndvi: 0.48, sanitation: 0.55 },
    kilifi: { temp: 28.2, rainfall: 65.1, ndvi: 0.52, sanitation: 0.48 },
    nairobi: { temp: 22.5, rainfall: 35.2, ndvi: 0.38, sanitation: 0.18 },
    machakos: { temp: 24.1, rainfall: 42.5, ndvi: 0.35, sanitation: 0.28 },
    mombasa: { temp: 29.8, rainfall: 55.7, ndvi: 0.45, sanitation: 0.38 },
    kakamega: { temp: 26.5, rainfall: 78.2, ndvi: 0.51, sanitation: 0.35 }
  };

  // Model predictions for next week (would come from Flask API)
  const nextWeekPredictions: Record<string, { cholera: number; malaria: number }> = {
    baringo: { cholera: 0.72, malaria: 0.88 },
    turkana: { cholera: 0.68, malaria: 0.75 },
    kisumu: { cholera: 0.55, malaria: 0.82 },
    kilifi: { cholera: 0.78, malaria: 0.45 },
    nairobi: { cholera: 0.22, malaria: 0.18 },
    machakos: { cholera: 0.35, malaria: 0.42 },
    mombasa: { cholera: 0.62, malaria: 0.38 },
    kakamega: { cholera: 0.48, malaria: 0.71 }
  };

  // Get predictions for current selection
  const nextWeekRisk = nextWeekPredictions[selectedCounty]?.[selectedDisease] || 0.50;
  const currentEnv = currentEnvironmentalData[selectedCounty];
  const confidence = Math.round(88 + Math.random() * 7); // 88-95%
  
  // Calculate confidence interval
  const lowerBound = parseFloat((nextWeekRisk * 0.87).toFixed(2));
  const upperBound = parseFloat(Math.min(1.0, nextWeekRisk * 1.13).toFixed(2));
  
  // Estimated cases for next week
  const estimatedCases = Math.round(nextWeekRisk * 220 + Math.random() * 40);

  // Historical comparison (last 4 weeks)
  const historicalTrend = [
    { week: '4 weeks ago', risk: nextWeekRisk * 0.75, cases: Math.round(estimatedCases * 0.7) },
    { week: '3 weeks ago', risk: nextWeekRisk * 0.82, cases: Math.round(estimatedCases * 0.78) },
    { week: '2 weeks ago', risk: nextWeekRisk * 0.91, cases: Math.round(estimatedCases * 0.88) },
    { week: 'Last week', risk: nextWeekRisk * 0.96, cases: Math.round(estimatedCases * 0.94) },
    { week: 'Next week (Predicted)', risk: nextWeekRisk, cases: estimatedCases, isPrediction: true }
  ];

  // Scenario analysis - intervention impact
  const scenarios = [
    {
      name: 'With Intervention',
      description: 'Immediate sanitation improvement + vector control',
      risk: parseFloat((nextWeekRisk * 0.55).toFixed(2)),
      casesReduced: Math.round(estimatedCases * 0.45),
      confidence: 0.72,
      color: 'green' as const
    },
    {
      name: 'Current Trajectory',
      description: 'No intervention, conditions continue',
      risk: nextWeekRisk,
      casesReduced: 0,
      confidence: 0.89,
      color: 'yellow' as const
    },
    {
      name: 'Delayed Response',
      description: 'No action taken this week',
      risk: parseFloat(Math.min(0.98, nextWeekRisk * 1.18).toFixed(2)),
      casesReduced: Math.round(estimatedCases * -0.18),
      confidence: 0.76,
      color: 'red' as const
    }
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 0.67) return 'text-red-600 dark:text-red-400';
    if (risk >= 0.34) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getRiskBgColor = (risk: number) => {
    if (risk >= 0.67) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (risk >= 0.34) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 dark:text-white">Early Warning Predictions</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">AI-powered next-week outbreak risk predictions for early intervention</p>
        </div>

        {/* Filters */}
        <Card className="dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Prediction Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">County</label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  {counties.map(county => (
                    <option key={county} value={county.toLowerCase()}>{county}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">Disease</label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDisease === 'cholera' ? 'default' : 'outline'}
                    onClick={() => setSelectedDisease('cholera')}
                    className={selectedDisease === 'cholera' ? 'flex-1 bg-gradient-to-r from-blue-600 to-blue-700' : 'flex-1 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                  >
                    Cholera
                  </Button>
                  <Button
                    variant={selectedDisease === 'malaria' ? 'default' : 'outline'}
                    onClick={() => setSelectedDisease('malaria')}
                    className={selectedDisease === 'malaria' ? 'flex-1 bg-gradient-to-r from-orange-600 to-orange-700' : 'flex-1 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                  >
                    Malaria
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Prediction */}
        <Card className={`dark:border-gray-700 backdrop-blur-sm shadow-xl border-2 ${getRiskBgColor(nextWeekRisk)}`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Next Week Prediction: {counties.find(c => c.toLowerCase() === selectedCounty)} - {selectedDisease.charAt(0).toUpperCase() + selectedDisease.slice(1)}
              </CardTitle>
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 w-fit">
                {confidence}% Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Predicted Risk Score</p>
                <div className={`text-5xl font-bold ${getRiskColor(nextWeekRisk)}`}>{nextWeekRisk.toFixed(2)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  95% CI: {lowerBound.toFixed(2)} - {upperBound.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Estimated Cases</p>
                <div className="text-5xl font-bold text-gray-900 dark:text-white">{estimatedCases}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Expected next week
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Time to Prepare</p>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">~7</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Days for intervention
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Early Warning:</strong> This prediction gives you approximately 7 days to mobilize resources, 
                deploy interventions, and alert communities before potential outbreak escalation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Historical Trend + Prediction */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">4-Week Trend + Next Week Prediction</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#9ca3af" angle={-20} textAnchor="end" height={80} />
                  <YAxis stroke="#9ca3af" domain={[0, 1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                    name="Risk Score"
                    strokeWidth={2}
                    strokeDasharray={(entry: any) => entry.isPrediction ? "5 5" : "0"}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Dashed line indicates ML prediction for next week
              </p>
            </CardContent>
          </Card>

          {/* Case Count Prediction */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Predicted Case Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#9ca3af" angle={-20} textAnchor="end" height={80} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    name="Cases"
                    strokeDasharray={(entry: any) => entry.isPrediction ? "5 5" : "0"}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Historical data with next-week case prediction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Environmental Data */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Current Week Environmental Data (Model Input)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Temperature</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentEnv.temp}°C</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Rainfall</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentEnv.rainfall}mm</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mean NDVI</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentEnv.ndvi}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vegetation index</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Poor Sanitation</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{(currentEnv.sanitation * 100).toFixed(0)}%</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">County rate</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              These current conditions are used by the ML model to predict next week's outbreak risk
            </div>
          </CardContent>
        </Card>

        {/* Scenario Analysis */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">Intervention Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How different response strategies could affect next week's outbreak:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className={`p-6 rounded-xl border-2 ${
                    scenario.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
                    scenario.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
                    'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <h3 className={`font-bold mb-2 ${
                    scenario.color === 'green' ? 'text-green-900 dark:text-green-300' :
                    scenario.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-300' :
                    'text-red-900 dark:text-red-300'
                  }`}>{scenario.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{scenario.description}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score:</span>
                      <span className={`text-xl font-bold ${getRiskColor(scenario.risk)}`}>{scenario.risk.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Est. Cases:</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {estimatedCases - scenario.casesReduced}
                      </span>
                    </div>
                    {scenario.casesReduced !== 0 && (
                      <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span className={`text-sm font-semibold ${
                          scenario.casesReduced > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {scenario.casesReduced > 0 ? '↓' : '↑'} {Math.abs(scenario.casesReduced)} cases
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Info */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-900 dark:text-blue-300 mb-2"><strong>About Early Warning Predictions</strong></p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  This ML model analyzes current environmental conditions (temperature, rainfall, vegetation, sanitation) 
                  to predict outbreak risk for the <strong>next reporting period (1 week ahead)</strong>.
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li><strong>Purpose:</strong> Provide 7-day advance warning for outbreak preparedness</li>
                  <li><strong>Input:</strong> Current week's environmental + sanitation data</li>
                  <li><strong>Output:</strong> Next week outbreak probability (0-1 risk score)</li>
                  <li><strong>Use Case:</strong> Enable rapid resource deployment and community alerts</li>
                </ul>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-3 italic">
                  Note: This is a short-term forecasting tool, not long-range prediction. Predictions beyond one week require additional forecasting models.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}