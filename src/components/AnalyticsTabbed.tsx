import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { useLoading } from '../contexts/LoadingContext';
import { AnalyticsSkeleton } from './skeletons/AnalyticsSkeleton';
import { Download, Filter, Activity, TrendingUp, MapPin, BarChart3, Calendar, Droplets, Users } from 'lucide-react';

export function Analytics() {
  const { isLoading } = useLoading();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedDisease, setSelectedDisease] = useState<'all' | 'cholera' | 'malaria'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  const [activeTab, setActiveTab] = useState('overview');
  const [monthlyComparison, setMonthlyComparison] = useState<any[]>([]);
  const [countyData, setCountyData] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data from backend
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/data/monthly_comparison').then(res => res.json()),
      fetch('http://localhost:5000/data/county_data').then(res => res.json()),
      fetch('http://localhost:5000/data/environmental').then(res => res.json()),
    ])
      .then(([monthlyComparison, countyData, environmentalData]) => {
        setMonthlyComparison(monthlyComparison);
        setCountyData(countyData);
        setEnvironmentalData(environmentalData);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, [timeRange, selectedDisease, selectedCounty]);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  // Generate dynamic data based on filters
  const getWeeklyTrends = () => {
    const baseData = [
      { week: 'W1', cholera: 45, malaria: 120, total: 165 },
      { week: 'W2', cholera: 52, malaria: 145, total: 197 },
      { week: 'W3', cholera: 68, malaria: 132, total: 200 },
      { week: 'W4', cholera: 85, malaria: 158, total: 243 },
    ];

    const countyMultiplier = selectedCounty === 'all' ? 1 : 
      selectedCounty === 'baringo' ? 1.2 : 
      selectedCounty === 'turkana' ? 1.5 :
      selectedCounty === 'kisumu' ? 0.9 :
      selectedCounty === 'nairobi' ? 0.3 : 0.7;

    return baseData.map(item => ({
      ...item,
      cholera: Math.round(item.cholera * countyMultiplier),
      malaria: Math.round(item.malaria * countyMultiplier),
      total: Math.round(item.total * countyMultiplier)
    }));
  };





  const getKPIs = () => {
    const baseCholeraWeek = 312;
    const baseMalariaWeek = 487;
    const baseOutbreaksWeek = 2;
    const baseReportsWeek = 85;

    let timeMultiplier = 1;
    let periodLabel = 'week';
    
    switch (timeRange) {
      case 'week':
        timeMultiplier = 1;
        periodLabel = 'week';
        break;
      case 'month':
        timeMultiplier = 4;
        periodLabel = 'month';
        break;
      case 'quarter':
        timeMultiplier = 12;
        periodLabel = 'quarter';
        break;
      case 'year':
        timeMultiplier = 52;
        periodLabel = 'year';
        break;
    }

    let choleraValue = Math.round(baseCholeraWeek * timeMultiplier);
    let malariaValue = Math.round(baseMalariaWeek * timeMultiplier);
    let outbreaksValue = Math.round(baseOutbreaksWeek * timeMultiplier);
    let reportsValue = Math.round(baseReportsWeek * timeMultiplier);

    const countyMultiplier = selectedCounty === 'all' ? 1 : 
      selectedCounty === 'baringo' ? 0.12 : 
      selectedCounty === 'turkana' ? 0.15 :
      selectedCounty === 'kisumu' ? 0.10 :
      selectedCounty === 'nairobi' ? 0.03 : 0.08;

    if (selectedCounty !== 'all') {
      choleraValue = Math.round(choleraValue * countyMultiplier);
      malariaValue = Math.round(malariaValue * countyMultiplier);
      outbreaksValue = Math.round(outbreaksValue * countyMultiplier) || 1;
      reportsValue = Math.round(reportsValue * countyMultiplier);
    }

    if (selectedDisease === 'cholera') {
      malariaValue = 0;
    } else if (selectedDisease === 'malaria') {
      choleraValue = 0;
    }

    return {
      cholera: choleraValue,
      malaria: malariaValue,
      outbreaks: outbreaksValue,
      reports: reportsValue,
      periodLabel
    };
  };

  const kpis = getKPIs();

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 animate-fadeIn">
            <div>
              <h1 className="text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg animate-float">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive disease surveillance analytics</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card hover-lift animate-scaleIn relative overflow-hidden group" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cholera Cases</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1 font-bold">{kpis.cholera.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">this {kpis.periodLabel}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Activity className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift animate-scaleIn relative overflow-hidden group" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Malaria Cases</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1 font-bold">{kpis.malaria.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">this {kpis.periodLabel}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Activity className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift animate-scaleIn relative overflow-hidden group" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Outbreaks</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1 font-bold">{kpis.outbreaks}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">this {kpis.periodLabel}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg animate-pulse">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift animate-scaleIn relative overflow-hidden group" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Reports</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1 font-bold">{kpis.reports}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">this {kpis.periodLabel}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card border-0 p-1 shadow-xl grid w-full grid-cols-4">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger 
              value="geographic" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Geographic
            </TabsTrigger>
            <TabsTrigger 
              value="environmental" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Droplets className="h-4 w-4 mr-2" />
              Environmental
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Case Trends */}
              <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn" style={{ animationDelay: '0.7s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Weekly Case Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getWeeklyTrends()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="week" className="text-gray-600 dark:text-gray-400" />
                      <YAxis className="text-gray-600 dark:text-gray-400" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                      {(selectedDisease === 'all' || selectedDisease === 'cholera') && (
                        <Line type="monotone" dataKey="cholera" stroke="#3b82f6" strokeWidth={2} name="Cholera" />
                      )}
                      {(selectedDisease === 'all' || selectedDisease === 'malaria') && (
                        <Line type="monotone" dataKey="malaria" stroke="#f97316" strokeWidth={2} name="Malaria" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              {/* Pie Chart for Weekly Distribution */}
              <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn" style={{ animationDelay: '0.8s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                      <PieChart className="h-5 w-5 text-white" />
                    </div>
                    Weekly Disease Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          // Sum up cholera and malaria cases for the latest week
                          const weekly = getWeeklyTrends();
                          if (!weekly.length) return [];
                          const last = weekly[weekly.length - 1];
                          return [
                            { name: 'Cholera', value: last.cholera, color: '#3b82f6' },
                            { name: 'Malaria', value: last.malaria, color: '#f97316' },
                          ];
                        })()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(() => {
                          const weekly = getWeeklyTrends();
                          if (!weekly.length) return null;
                          const last = weekly[weekly.length - 1];
                          return [
                            <Cell key="cell-cholera" fill="#3b82f6" />,
                            <Cell key="cell-malaria" fill="#f97316" />,
                          ];
                        })()}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Historical Trends & Outbreaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Legend />
                    {(selectedDisease === 'all' || selectedDisease === 'cholera') && (
                      <Bar dataKey="cholera" fill="#3b82f6" name="Cholera Cases" />
                    )}
                    {(selectedDisease === 'all' || selectedDisease === 'malaria') && (
                      <Bar dataKey="malaria" fill="#f97316" name="Malaria Cases" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  {selectedCounty === 'all' ? 'County Distribution' : 'Sub-County Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={countyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
                    <YAxis dataKey="name" type="category" className="text-gray-600 dark:text-gray-400" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Bar dataKey="cases" name="Total Cases">
                      {countyData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environmental Tab */}
          <TabsContent value="environmental" className="space-y-6">
            <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg">
                    <Droplets className="h-5 w-5 text-white" />
                  </div>
                  Environmental Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={environmentalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="factor" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Legend />
                    {(selectedDisease === 'all' || selectedDisease === 'cholera') && (
                      <Bar dataKey="cholera" fill="#3b82f6" name="Cholera Correlation" />
                    )}
                    {(selectedDisease === 'all' || selectedDisease === 'malaria') && (
                      <Bar dataKey="malaria" fill="#f97316" name="Malaria Correlation" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}