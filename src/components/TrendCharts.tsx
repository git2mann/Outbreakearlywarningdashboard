import { WeeklyData } from '../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TrendChartsProps {
  weeklyData: WeeklyData[];
}

export function TrendCharts({ weeklyData }: TrendChartsProps) {
  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Average Temperature (°C)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <YAxis 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => `Week ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="avg_temp" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Avg Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NDVI Chart */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Vegetation Index (NDVI)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <YAxis 
                label={{ value: 'NDVI', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => `Week ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="mean_ndvi" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                name="NDVI"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rainfall Chart */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Average Rainfall (mm)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <YAxis 
                label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => `Week ${value}`}
              />
              <Bar 
                dataKey="avg_rainfall" 
                fill="#3b82f6" 
                name="Avg Rainfall"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}