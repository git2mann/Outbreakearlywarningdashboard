import { useState } from 'react';
import { getPrediction } from '../utils/apiHelpers';
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
  const [backendRisk, setBackendRisk] = useState<number|null>(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<string|null>(null);
  // Helper to map UI state to model features (matches simulated_outbreak_data_v15.csv)
  const getModelFeatures = () => {
    import React, { useState, useEffect } from "react";
    import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
    import { Button } from "./ui/button";
    import { Badge } from "./ui/badge";
    import { MapPin, Bug, AlertTriangle, TrendingUp, Eye } from "lucide-react";

    // Helper functions for risk color
    function getRiskColor(prob: number) {
      if (prob >= 0.7) return "text-red-600 dark:text-red-400";
      if (prob >= 0.4) return "text-yellow-600 dark:text-yellow-300";
      return "text-green-600 dark:text-green-400";
    }
    function getRiskBgColor(prob: number) {
      if (prob >= 0.7) return "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700";
      if (prob >= 0.4) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700";
      return "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700";
    }

    export function Predictions() {
      const [outbreakData, setOutbreakData] = useState<any[]>([]);
      const [selectedRow, setSelectedRow] = useState<number>(0);
      const [backendProb, setBackendProb] = useState<number | null>(null);
      const [backendOutbreak, setBackendOutbreak] = useState<number | null>(null);
      const [backendLoading, setBackendLoading] = useState(false);
      const [backendError, setBackendError] = useState<string | null>(null);
      const [estimatedCases, setEstimatedCases] = useState<number>(0);

      useEffect(() => {
        fetch("/data/outbreak")
          .then((res) => res.json())
          .then((data) => {
            setOutbreakData(data);
            setSelectedRow(0);
          });
      }, []);

      useEffect(() => {
        if (outbreakData.length > 0) {
          setEstimatedCases(outbreakData[selectedRow]?.cases ?? 0);
        }
      }, [outbreakData, selectedRow]);

      const handleBackendPredict = async () => {
        setBackendLoading(true);
        setBackendError(null);
        setBackendProb(null);
        setBackendOutbreak(null);
        try {
          const row = outbreakData[selectedRow];
          const endpoint = row.disease.toLowerCase() === "cholera" ? "/predict/cholera" : "/predict/malaria";
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
          if (!res.ok) throw new Error("Prediction failed");
          const result = await res.json();
          setBackendProb(result.probability);
          setBackendOutbreak(result.outbreak);
        } catch (err: any) {
          setBackendError(err.message || "Unknown error");
        } finally {
          setBackendLoading(false);
        }
      };

      // Scenario analysis (example logic)
      const scenarios = [
        {
          name: "Rapid Response",
          description: "Immediate intervention, high resource mobilization.",
          color: "green",
          risk: backendProb !== null ? Math.max(0, backendProb - 0.3) : 0,
          casesReduced: backendProb !== null ? Math.round(estimatedCases * 0.4) : 0,
        },
        {
          name: "Moderate Response",
          description: "Intervention within 3-5 days.",
          color: "yellow",
          risk: backendProb !== null ? Math.max(0, backendProb - 0.15) : 0,
          casesReduced: backendProb !== null ? Math.round(estimatedCases * 0.2) : 0,
        },
        {
          name: "Delayed Response",
          description: "Intervention after a week or more.",
          color: "red",
          risk: backendProb !== null ? backendProb : 0,
          casesReduced: 0,
        },
      ];

      const row = outbreakData[selectedRow] || {};

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 font-sans">
          <div className="container mx-auto px-4 py-6 space-y-8 max-w-5xl">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Early Warning Prediction Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">AI-powered next-week outbreak risk predictions for early intervention</p>
            <Card className="dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-sm shadow-xl p-4 md:p-6">
              <CardTitle className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                Analysis Location & Time
              </CardTitle>
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-grow">
                  <label htmlFor="data-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Select Outbreak Data Context
                  </label>
                  <select
                    id="data-selector"
                    value={selectedRow ?? 0}
                    onChange={e => setSelectedRow(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  >
                    {outbreakData.map((r: any, i: number) => (
                      <option key={i} value={i}>
                        {r.county} ({r.sub_county}) | {r.disease} | Week {r.week} ({r.year}) | Current Cases: {r.cases}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleBackendPredict} 
                  disabled={backendLoading}
                  className="w-full md:w-auto mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 transition transform hover:scale-[1.01]"
                >
                  {backendLoading ? 'Predicting...' : 'Get Next Week Prediction'}
                  {backendLoading && <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {backendProb !== null && (
                  <span className={`font-semibold p-2 rounded-lg ${backendOutbreak === 1 ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                    <Bug className="h-4 w-4 inline mr-1" />
                    ML Prediction Status: {backendOutbreak === 1 ? 'OUTBREAK LIKELY' : 'NO OUTBREAK'}
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">(P(Outbreak)={backendProb.toFixed(3)})</span>
                  </span>
                )}
                {backendError && (
                  <span className="font-semibold p-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Error: {backendError}
                  </span>
                )}
              </div>
            </Card>
            <Card className={`dark:border-gray-700 backdrop-blur-sm shadow-xl border-2 ${getRiskBgColor(backendProb ?? 0)} transition duration-500`}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    Prediction Summary: {row.county} - {row.disease}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 w-fit text-white">
                    {backendProb !== null ? `RISK SCORE: ${(backendProb * 100).toFixed(1)}%` : 'No Prediction'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-b pb-6 border-gray-200 dark:border-gray-700">
                  <div className="text-center p-4 border-r dark:border-gray-700 md:border-none">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Predicted Risk Score</p>
                    <div className={`text-6xl font-extrabold ${getRiskColor(backendProb ?? 0)}`}>
                      {backendProb !== null ? backendProb.toFixed(2) : '--'}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Likelihood of Outbreak next week
                    </p>
                  </div>
                  <div className="text-center p-4 border-r dark:border-gray-700 md:border-none">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Estimated Cases</p>
                    <div className="text-6xl font-extrabold text-gray-900 dark:text-white">
                      {estimatedCases}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Expected if conditions continue
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Action Window</p>
                    <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">~7</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Days for rapid intervention
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                  <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center">
                    <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                    <strong>Early Warning Insight:</strong> This model provides a critical 7-day lead time to mobilize resources, deploy community alerts, and implement public health measures.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-gray-900 dark:text-white">Intervention Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Simulated outcomes based on different public health response speeds:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.name}
                      className={`p-6 rounded-xl border-2 transition duration-300 hover:shadow-lg ${
                        scenario.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
                        scenario.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
                        'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      }`}
                    >
                      <h3 className={`text-xl font-bold mb-3 ${
                        scenario.color === 'green' ? 'text-green-800 dark:text-green-300' :
                        scenario.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-300' :
                        'text-red-800 dark:text-red-300'
                      }`}>{scenario.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-12 flex items-center">{scenario.description}</p>
                      <div className="space-y-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Risk Score:</span>
                          <span className={`text-2xl font-extrabold ${getRiskColor(scenario.risk)}`}>{scenario.risk.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Total Cases:</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {Math.max(0, estimatedCases - scenario.casesReduced)}
                          </span>
                        </div>
                        {scenario.casesReduced !== 0 && (
                          <div className="pt-2 border-t border-gray-300 dark:border-gray-600 mt-2">
                            <span className={`text-sm font-semibold flex items-center gap-1 ${
                              scenario.casesReduced > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              <TrendingUp className={`h-4 w-4 transform ${scenario.casesReduced > 0 ? '-rotate-90' : 'rotate-90'}`} />
                              {scenario.casesReduced > 0 ? 'Reduction:' : 'Increase:'} {Math.abs(scenario.casesReduced)} cases
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
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