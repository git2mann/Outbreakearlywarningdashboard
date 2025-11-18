import { useState } from 'react';
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

  const getMonthlyComparison = () => {
    const monthData = timeRange === 'week' ? 
      [
        { month: 'W1', cholera: 58, malaria: 134, outbreaks: 1 },
        { month: 'W2', cholera: 67, malaria: 156, outbreaks: 1 },
        { month: 'W3', cholera: 72, malaria: 142, outbreaks: 2 },
        { month: 'W4', cholera: 89, malaria: 167, outbreaks: 2 },
      ] :
      timeRange === 'quarter' ?
      [
        { month: 'Q1', cholera: 856, malaria: 1678, outbreaks: 12 },
        { month: 'Q2', cholera: 923, malaria: 1834, outbreaks: 15 },
        { month: 'Q3', cholera: 1045, malaria: 2012, outbreaks: 18 },
      ] :
      timeRange === 'year' ?
      [
        { month: '2022', cholera: 3245, malaria: 6234, outbreaks: 42 },
        { month: '2023', cholera: 3567, malaria: 6789, outbreaks: 48 },
        { month: '2024', cholera: 3892, malaria: 7123, outbreaks: 53 },
      ] :
      [
        { month: 'Aug', cholera: 234, malaria: 456, outbreaks: 3 },
        { month: 'Sep', cholera: 312, malaria: 523, outbreaks: 5 },
        { month: 'Oct', cholera: 289, malaria: 601, outbreaks: 4 },
        { month: 'Nov', cholera: 421, malaria: 689, outbreaks: 7 },
      ];

    const countyMultiplier = selectedCounty === 'all' ? 1 : 
      selectedCounty === 'baringo' ? 1.1 : 
      selectedCounty === 'turkana' ? 1.3 :
      selectedCounty === 'kisumu' ? 0.8 :
      selectedCounty === 'nairobi' ? 0.4 : 0.6;

    return monthData.map(item => ({
      ...item,
      cholera: Math.round(item.cholera * countyMultiplier),
      malaria: Math.round(item.malaria * countyMultiplier),
      outbreaks: Math.round(item.outbreaks * countyMultiplier)
    }));
  };

  const getDiseaseDistribution = () => {
    let choleraValue = 1247;
    let malariaValue = 2269;

    if (selectedCounty !== 'all') {
      const multiplier = selectedCounty === 'baringo' ? 0.15 : 
        selectedCounty === 'turkana' ? 0.18 :
        selectedCounty === 'kisumu' ? 0.12 :
        selectedCounty === 'nairobi' ? 0.05 : 0.08;
      choleraValue = Math.round(choleraValue * multiplier);
      malariaValue = Math.round(malariaValue * multiplier);
    }

    if (selectedDisease === 'cholera') {
      return [{ name: 'Cholera', value: choleraValue, color: '#3b82f6' }];
    } else if (selectedDisease === 'malaria') {
      return [{ name: 'Malaria', value: malariaValue, color: '#f97316' }];
    }

    return [
      { name: 'Cholera', value: choleraValue, color: '#3b82f6' },
      { name: 'Malaria', value: malariaValue, color: '#f97316' },
    ];
  };

  const getCountyData = () => {
    if (selectedCounty !== 'all') {
      const subCounties = {
        baringo: [
          { name: 'Baringo_Sub1', cases: 145, color: '#ef4444' },
          { name: 'Baringo_Sub2', cases: 98, color: '#f97316' },
          { name: 'Baringo_Sub3', cases: 67, color: '#f59e0b' },
        ],
        turkana: [
          { name: 'Turkana_Sub1', cases: 198, color: '#ef4444' },
          { name: 'Turkana_Sub2', cases: 156, color: '#f97316' },
          { name: 'Turkana_Sub3', cases: 112, color: '#f59e0b' },
        ],
        kisumu: [
          { name: 'Kisumu_Sub1', cases: 134, color: '#f97316' },
          { name: 'Kisumu_Sub2', cases: 89, color: '#f59e0b' },
          { name: 'Kisumu_Sub3', cases: 56, color: '#eab308' },
        ],
        default: [
          { name: 'Sub1', cases: 120, color: '#ef4444' },
          { name: 'Sub2', cases: 85, color: '#f97316' },
          { name: 'Sub3', cases: 62, color: '#f59e0b' },
        ]
      };
      return subCounties[selectedCounty as keyof typeof subCounties] || subCounties.default;
    }

    return [
      { name: 'Turkana', cases: 245, color: '#ef4444' },
      { name: 'Baringo', cases: 198, color: '#f97316' },
      { name: 'Kisumu', cases: 167, color: '#f59e0b' },
      { name: 'Kilifi', cases: 134, color: '#eab308' },
      { name: 'Others', cases: 503, color: '#94a3b8' },
    ];
  };

  const getEnvironmentalData = () => {
    const data = [
      { factor: 'High Temp', cholera: 0.45, malaria: 0.78 },
      { factor: 'Heavy Rain', cholera: 0.62, malaria: 0.85 },
      { factor: 'Poor Sanitation', cholera: 0.88, malaria: 0.23 },
      { factor: 'High NDVI', cholera: 0.12, malaria: 0.67 },
    ];

    if (selectedDisease === 'cholera') {
      return data.map(d => ({ ...d, malaria: 0 }));
    } else if (selectedDisease === 'malaria') {
      return data.map(d => ({ ...d, cholera: 0 }));
    }

    return data;
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
        {/* Header with Filters */}
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

          {/* Filters Bar */}
          <Card className="glass-card shadow-xl hover-lift animate-slideInRight" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Filters:</span>
                </div>
                
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>

                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer"
                >
                  <option value="all">All Diseases</option>
                  <option value="cholera">Cholera Only</option>
                  <option value="malaria">Malaria Only</option>
                </select>

                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer"
                >
                  <option value="all">All Counties</option>
                  <option value="baringo">Baringo</option>
                  <option value="turkana">Turkana</option>
                  <option value="kisumu">Kisumu</option>
                  <option value="nairobi">Nairobi</option>
                  <option value="kilifi">Kilifi</option>
                </select>

                <Badge variant="outline" className="ml-auto">
                  {selectedCounty === 'all' ? 'National View' : selectedCounty.charAt(0).toUpperCase() + selectedCounty.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
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
              <Card className="glass-card border-0 shadow-premium hover-lift animate-scaleIn" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Disease Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getDiseaseDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getDiseaseDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

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
                  <BarChart data={getMonthlyComparison()}>
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
                  <BarChart data={getCountyData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
                    <YAxis dataKey="name" type="category" className="text-gray-600 dark:text-gray-400" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Bar dataKey="cases" name="Total Cases">
                      {getCountyData().map((entry, index) => (
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
                  <BarChart data={getEnvironmentalData()}>
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