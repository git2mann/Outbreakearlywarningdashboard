import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

export function Analytics() {
  // Mock data for visualizations
  const monthlyTrends = [
    { month: 'Jan', cholera: 45, malaria: 320 },
    { month: 'Feb', cholera: 52, malaria: 280 },
    { month: 'Mar', cholera: 48, malaria: 310 },
    { month: 'Apr', cholera: 61, malaria: 420 },
    { month: 'May', cholera: 75, malaria: 510 },
    { month: 'Jun', cholera: 88, malaria: 580 },
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 28, color: '#22c55e' },
    { name: 'Moderate Risk', value: 15, color: '#eab308' },
    { name: 'High Risk', value: 4, color: '#ef4444' },
  ];

  const interventionData = [
    { week: 'W1', vaccinations: 450, screenings: 280, treatments: 120 },
    { week: 'W2', vaccinations: 520, screenings: 310, treatments: 145 },
    { week: 'W3', vaccinations: 480, screenings: 295, treatments: 130 },
    { week: 'W4', vaccinations: 610, screenings: 340, treatments: 165 },
  ];

  const regionalComparison = [
    { region: 'Western', risk: 0.72 },
    { region: 'Nyanza', risk: 0.68 },
    { region: 'Rift Valley', risk: 0.55 },
    { region: 'Coast', risk: 0.48 },
    { region: 'Eastern', risk: 0.38 },
    { region: 'Central', risk: 0.28 },
    { region: 'Nairobi', risk: 0.22 },
    { region: 'North Eastern', risk: 0.65 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive disease outbreak analytics and trends</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Cases (MTD)</CardTitle>
              <Activity className="h-4 w-4 text-red-600 dark:text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900 dark:text-white">1,247</div>
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">High Risk Counties</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900 dark:text-white">8</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3" />
                -2 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Population at Risk</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900 dark:text-white">2.4M</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Across 47 counties</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900 dark:text-white">18h</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3" />
                -6h improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Monthly Case Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, #fff)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cholera" 
                    stackId="1"
                    stroke="#2563eb" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Cholera Cases"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="malaria" 
                    stackId="1"
                    stroke="#ea580c" 
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="Malaria Cases"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">County Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Intervention Effectiveness */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Public Health Interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis dataKey="week" stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, #fff)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="vaccinations" fill="#22c55e" name="Vaccinations" />
                  <Bar dataKey="screenings" fill="#3b82f6" name="Screenings" />
                  <Bar dataKey="treatments" fill="#f59e0b" name="Treatments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Comparison */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Regional Risk Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis type="number" domain={[0, 1]} stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis type="category" dataKey="region" stroke="#6b7280" className="dark:stroke-gray-400" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, #fff)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="risk" fill="#ef4444" name="Risk Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Model Performance */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">ML Model Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">94.2%</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Precision</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">91.8%</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Recall</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">89.5%</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">F1 Score</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">90.6%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';
