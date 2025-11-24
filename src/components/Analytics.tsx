import { useState, useEffect } from 'react';
// Helper to group by key
function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = String(item[key]);
    (acc[groupKey] = acc[groupKey] || []).push(item);
    return acc;
  }, {});
}
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';
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
  const [data, setData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState<any[]>([]);
  const [countyData, setCountyData] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch all analytics data from backend endpoints
    Promise.all([
      fetch('http://localhost:5000/data/outbreak').then(res => res.json()),
      fetch('http://localhost:5000/data/kpis').then(res => res.json()),
      fetch('http://localhost:5000/data/weekly_trends').then(res => res.json()),
      fetch('http://localhost:5000/data/monthly_comparison').then(res => res.json()),
      fetch('http://localhost:5000/data/county_data').then(res => res.json()),
      fetch('http://localhost:5000/data/environmental').then(res => res.json()),
    ])
      .then(([data, kpis, weeklyTrends, monthlyComparison, countyData, environmentalData]) => {
        setData(data);
        setKpis(kpis);
        setWeeklyTrends(weeklyTrends);
        setMonthlyComparison(monthlyComparison);
        setCountyData(countyData);
        setEnvironmentalData(environmentalData);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, []);

  if (isLoading || loading) {
    return <AnalyticsSkeleton />;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  if (!kpis) {
    return null;
  }

  // Real data: Weekly trends (group by week, sum cases by disease)
  const getWeeklyTrends = () => {
    let filtered = data;
    if (selectedCounty !== 'all') filtered = filtered.filter(d => d.county.toLowerCase() === selectedCounty);
    if (selectedDisease !== 'all') filtered = filtered.filter(d => d.disease.toLowerCase() === selectedDisease);
    const byWeek = groupBy(filtered, 'week');
    return Object.entries(byWeek).map(([week, rows]) => {
      const cholera = rows.filter((r: any) => r.disease.toLowerCase() === 'cholera').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      const malaria = rows.filter((r: any) => r.disease.toLowerCase() === 'malaria').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      return { week, cholera, malaria, total: cholera + malaria };
    }).sort((a, b) => a.week.localeCompare(b.week));
  };

  // Real data: Monthly/quarter/year comparison (group by year/month/quarter, sum cases)
  const getMonthlyComparison = () => {
    let filtered = data;
    if (selectedCounty !== 'all') filtered = filtered.filter(d => d.county.toLowerCase() === selectedCounty);
    if (selectedDisease !== 'all') filtered = filtered.filter(d => d.disease.toLowerCase() === selectedDisease);
    if (timeRange === 'year') {
      const byYear = groupBy(filtered, 'year');
      return Object.entries(byYear).map(([year, rows]) => {
        const cholera = rows.filter((r: any) => r.disease.toLowerCase() === 'cholera').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
        const malaria = rows.filter((r: any) => r.disease.toLowerCase() === 'malaria').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
        const outbreaks = rows.reduce((sum: number, r: any) => sum + Number(r.outbreak), 0);
        return { month: year, cholera, malaria, outbreaks };
      });
    }
    // For month/quarter, use week or parse month from week string
    const byMonth = groupBy(filtered, 'week');
    return Object.entries(byMonth).map(([week, rows]) => {
      const cholera = rows.filter((r: any) => r.disease.toLowerCase() === 'cholera').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      const malaria = rows.filter((r: any) => r.disease.toLowerCase() === 'malaria').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      const outbreaks = rows.reduce((sum: number, r: any) => sum + Number(r.outbreak), 0);
      return { month: week, cholera, malaria, outbreaks };
    });
  };

  // Real data: Disease distribution (sum cases by disease, using same time filter as KPIs)
  const getDiseaseDistribution = () => {
    // Use the same periodRows logic as getKPIs
    let filtered = data;
    if (selectedCounty !== 'all') filtered = filtered.filter((d: any) => d.county.toLowerCase() === selectedCounty);
    if (selectedDisease !== 'all') filtered = filtered.filter((d: any) => d.disease.toLowerCase() === selectedDisease);
    let periodRows = filtered;
    if (timeRange === 'week') {
      const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
      const lastWeek = weeks[weeks.length - 1];
      periodRows = filtered.filter((r: any) => r.week === lastWeek);
    } else if (timeRange === 'month') {
      const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
      const last4 = weeks.slice(-4);
      periodRows = filtered.filter((r: any) => last4.includes(r.week));
    } else if (timeRange === 'quarter') {
      const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
      const last12 = weeks.slice(-12);
      periodRows = filtered.filter((r: any) => last12.includes(r.week));
    } else if (timeRange === 'year') {
      periodRows = filtered;
    }
    // Always show both diseases for the Pie chart, regardless of selectedDisease
    const choleraValue = periodRows.filter((r: any) => r.disease.toLowerCase() === 'cholera').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
    const malariaValue = periodRows.filter((r: any) => r.disease.toLowerCase() === 'malaria').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
    return [
      { name: 'Cholera', value: choleraValue, color: '#3b82f6' },
      { name: 'Malaria', value: malariaValue, color: '#f97316' },
    ];
  };

  // Real data: County or sub-county breakdown
  const getCountyData = () => {
    if (selectedCounty !== 'all') {
      // Sub-county breakdown for selected county
      const filtered = data.filter(d => d.county.toLowerCase() === selectedCounty);
      const bySub = groupBy(filtered, 'sub_county');
      return Object.entries(bySub).map(([sub, rows], i) => ({
        name: sub,
        cases: rows.reduce((sum: number, r: any) => sum + Number(r.cases), 0),
        color: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#94a3b8'][i % 5]
      }));
    }
    // County breakdown
    const byCounty = groupBy(data, 'county');
    return Object.entries(byCounty).map(([county, rows], i) => ({
      name: county,
      cases: rows.reduce((sum: number, r: any) => sum + Number(r.cases), 0),
      color: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#94a3b8'][i % 5]
    }));
  };

  // Real data: Environmental factors (average by disease)
  const getEnvironmentalData = () => {
    let filtered = data;
    if (selectedCounty !== 'all') filtered = filtered.filter(d => d.county.toLowerCase() === selectedCounty);
    if (selectedDisease !== 'all') filtered = filtered.filter(d => d.disease.toLowerCase() === selectedDisease);
    // Example: show average of each factor by disease
    const choleraRows = filtered.filter((r: any) => r.disease.toLowerCase() === 'cholera');
    const malariaRows = filtered.filter((r: any) => r.disease.toLowerCase() === 'malaria');
    return [
      {
        factor: 'High Temp',
        cholera: choleraRows.length ? choleraRows.reduce((sum: number, r: any) => sum + Number(r.avg_temp), 0) / choleraRows.length : 0,
        malaria: malariaRows.length ? malariaRows.reduce((sum: number, r: any) => sum + Number(r.avg_temp), 0) / malariaRows.length : 0,
      },
      {
        factor: 'Heavy Rain',
        cholera: choleraRows.length ? choleraRows.reduce((sum: number, r: any) => sum + Number(r.avg_rainfall), 0) / choleraRows.length : 0,
        malaria: malariaRows.length ? malariaRows.reduce((sum: number, r: any) => sum + Number(r.avg_rainfall), 0) / malariaRows.length : 0,
      },
      {
        factor: 'Poor Sanitation',
        cholera: choleraRows.length ? choleraRows.reduce((sum: number, r: any) => sum + Number(r.unimproved_sanitation_rate), 0) / choleraRows.length : 0,
        malaria: malariaRows.length ? malariaRows.reduce((sum: number, r: any) => sum + Number(r.unimproved_sanitation_rate), 0) / malariaRows.length : 0,
      },
      {
        factor: 'High NDVI',
        cholera: choleraRows.length ? choleraRows.reduce((sum: number, r: any) => sum + Number(r.mean_ndvi), 0) / choleraRows.length : 0,
        malaria: malariaRows.length ? malariaRows.reduce((sum: number, r: any) => sum + Number(r.mean_ndvi), 0) / malariaRows.length : 0,
      },
    ];
  };

    // Real data: Calculate KPIs based on filters
    const getKPIs = () => {
      let filtered = data;
      if (selectedCounty !== 'all') filtered = filtered.filter((d: any) => d.county.toLowerCase() === selectedCounty);
      if (selectedDisease !== 'all') filtered = filtered.filter((d: any) => d.disease.toLowerCase() === selectedDisease);
      // Filter by time range (e.g., last N weeks)
      let periodLabel = timeRange;
      let periodRows = filtered;
      if (timeRange === 'week') {
        // Last week only
        const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
        const lastWeek = weeks[weeks.length - 1];
        periodRows = filtered.filter((r: any) => r.week === lastWeek);
        periodLabel = 'week';
      } else if (timeRange === 'month') {
        // Last 4 weeks
        const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
        const last4 = weeks.slice(-4);
        periodRows = filtered.filter((r: any) => last4.includes(r.week));
        periodLabel = 'month';
      } else if (timeRange === 'quarter') {
        // Last 12 weeks
        const weeks = [...new Set(filtered.map((r: any) => r.week))].sort();
        const last12 = weeks.slice(-12);
        periodRows = filtered.filter((r: any) => last12.includes(r.week));
        periodLabel = 'quarter';
      } else if (timeRange === 'year') {
        // All data
        periodRows = filtered;
        periodLabel = 'year';
      }
      const choleraValue = periodRows.filter((r: any) => r.disease.toLowerCase() === 'cholera').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      const malariaValue = periodRows.filter((r: any) => r.disease.toLowerCase() === 'malaria').reduce((sum: number, r: any) => sum + Number(r.cases), 0);
      const outbreaks = periodRows.reduce((sum: number, r: any) => sum + Number(r.outbreak), 0);
      const reports = periodRows.length;
      // Calculate average risk score (example: mean of avg_temp normalized)
      let avgRisk = 0;
      if (periodRows.length > 0) {
        avgRisk = periodRows.reduce((sum: number, r: any) => sum + Number(r.avg_temp), 0) / periodRows.length / 40; // crude normalization
      }
      return {
        cholera: choleraValue,
        malaria: malariaValue,
        totalCases: choleraValue + malariaValue,
        activeOutbreaks: outbreaks,
        reportsSubmitted: reports,
        avgRisk,
        periodLabel
      };
    };

  // All analytics data is now fetched from the backend

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