import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { useLoading } from '../contexts/LoadingContext';
import { AnalyticsSkeleton } from './skeletons/AnalyticsSkeleton';
import { Download, Filter, Activity, TrendingUp, MapPin, BarChart3, Calendar } from 'lucide-react';

export function Analytics() {
  const { isLoading } = useLoading();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedDisease, setSelectedDisease] = useState<'all' | 'cholera' | 'malaria'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

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

    // Apply county multiplier
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

    // Apply county filter
    if (selectedCounty !== 'all') {
      const multiplier = selectedCounty === 'baringo' ? 0.15 : 
        selectedCounty === 'turkana' ? 0.18 :
        selectedCounty === 'kisumu' ? 0.12 :
        selectedCounty === 'nairobi' ? 0.05 : 0.08;
      choleraValue = Math.round(choleraValue * multiplier);
      malariaValue = Math.round(malariaValue * multiplier);
    }

    // Apply disease filter
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
      // Show sub-counties when a specific county is selected
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

    // Show counties when "all" is selected
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

  // Calculate KPIs based on filters
  const getKPIs = () => {
    // Base values for a week
    const baseCholeraWeek = 312;
    const baseMalariaWeek = 487;
    const baseOutbreaksWeek = 2;
    const baseReportsWeek = 85;

    // Scale based on time range
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
    let outbreaks = Math.round(baseOutbreaksWeek * timeMultiplier);
    let reports = Math.round(baseReportsWeek * timeMultiplier);

    // Apply county filter
    if (selectedCounty !== 'all') {
      const countyMultiplier = selectedCounty === 'baringo' ? 0.15 : 
        selectedCounty === 'turkana' ? 0.18 :
        selectedCounty === 'kisumu' ? 0.12 :
        selectedCounty === 'nairobi' ? 0.05 : 0.08;
      
      choleraValue = Math.round(choleraValue * countyMultiplier);
      malariaValue = Math.round(malariaValue * countyMultiplier);
      outbreaks = Math.max(1, Math.round(outbreaks * countyMultiplier));
      reports = Math.round(reports * countyMultiplier);
    }

    // Apply disease filter for outbreaks and reports
    if (selectedDisease === 'cholera') {
      outbreaks = Math.max(1, Math.round(outbreaks * 0.4)); // Cholera typically has fewer outbreaks
      reports = Math.round(reports * 0.45); // Adjust reports for cholera only
    } else if (selectedDisease === 'malaria') {
      outbreaks = Math.max(1, Math.round(outbreaks * 0.6)); // Malaria has more outbreaks
      reports = Math.round(reports * 0.55); // Adjust reports for malaria only
    }

    // Apply disease filter for total cases
    let totalCases = 0;
    if (selectedDisease === 'cholera') {
      totalCases = choleraValue;
    } else if (selectedDisease === 'malaria') {
      totalCases = malariaValue;
    } else {
      totalCases = choleraValue + malariaValue;
    }

    return {
      totalCases,
      activeOutbreaks: outbreaks,
      avgRisk: selectedDisease === 'cholera' ? 0.62 : selectedDisease === 'malaria' ? 0.75 : 0.68,
      reportsSubmitted: reports,
      periodLabel
    };
  };

  const weeklyTrends = getWeeklyTrends();
  const monthlyComparison = getMonthlyComparison();
  const diseaseDistribution = getDiseaseDistribution();
  const countyData = getCountyData();
  const environmentalData = getEnvironmentalData();
  const kpis = getKPIs();

  const counties = ['All Counties', 'Baringo', 'Turkana', 'Kisumu', 'Kilifi', 'Nairobi', 'Machakos', 'Mombasa', 'Kakamega'];

  const exportData = () => {
    alert('Exporting analytics data as CSV...');
    // TODO: Implement actual CSV export
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive disease outbreak analytics and trends</p>
          </div>
          <Button onClick={exportData} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Filters */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Filter className="h-4 w-4 text-white" />
              </div>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Range */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Time Range</label>
                <div className="flex flex-wrap gap-2">
                  {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className={timeRange === range ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'dark:border-gray-600'}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Disease Filter */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Disease</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'cholera', 'malaria'] as const).map((disease) => (
                    <Button
                      key={disease}
                      variant={selectedDisease === disease ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDisease(disease)}
                      className={selectedDisease === disease ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'dark:border-gray-600'}
                    >
                      {disease.charAt(0).toUpperCase() + disease.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* County Filter */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">County</label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                  {counties.map(county => (
                    <option key={county} value={county.toLowerCase().replace(' ', '-')}>{county}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Cases ({timeRange})</CardTitle>
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.totalCases.toLocaleString()}</div>
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-2 font-medium">
                <TrendingUp className="h-3 w-3" />
                {selectedCounty === 'all' ? '+12.5%' : '+8.2%'} from last period
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Active Outbreaks</CardTitle>
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.activeOutbreaks}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {selectedCounty === 'all' ? 'Across 5 counties' : 'In selected area'}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Avg Risk Score</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.avgRisk.toFixed(2)}</div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                {kpis.avgRisk >= 0.67 ? 'High Risk' : kpis.avgRisk >= 0.34 ? 'Moderate-High Risk' : 'Low Risk'}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Reports Submitted</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpis.reportsSubmitted}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">This {kpis.periodLabel}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Trends */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Weekly Case Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#9ca3af" />
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
                  <Line type="monotone" dataKey="cholera" stroke="#3b82f6" strokeWidth={3} name="Cholera" />
                  <Line type="monotone" dataKey="malaria" stroke="#f97316" strokeWidth={3} name="Malaria" />
                  <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#9ca3af" />
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
                  <Bar dataKey="cholera" fill="#3b82f6" name="Cholera" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="malaria" fill="#f97316" name="Malaria" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disease Distribution */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Disease Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {diseaseDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${entry.name === 'Cholera' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{entry.name}: {entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* County Distribution */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">
                {selectedCounty === 'all' ? 'Top Counties by Cases' : `${counties.find(c => c.toLowerCase().replace(' ', '-') === selectedCounty)} Sub-Counties`}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="cases" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
                    {countyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Correlations */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">
              Environmental Factor Correlations
              {selectedDisease !== 'all' && ` - ${selectedDisease.charAt(0).toUpperCase() + selectedDisease.slice(1)}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={environmentalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="factor" stroke="#9ca3af" />
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
                {selectedDisease !== 'malaria' && (
                  <Bar dataKey="cholera" fill="#3b82f6" name="Cholera Correlation" radius={[8, 8, 0, 0]} />
                )}
                {selectedDisease !== 'cholera' && (
                  <Bar dataKey="malaria" fill="#f97316" name="Malaria Correlation" radius={[8, 8, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Correlation coefficient: 0 = no correlation, 1 = perfect positive correlation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}