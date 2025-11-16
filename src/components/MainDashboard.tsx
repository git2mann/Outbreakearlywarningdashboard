import { MapPin, AlertTriangle } from 'lucide-react';
import { DiseaseFilter } from '../App';
import { getTopRiskySubCounties } from '../data/mockData';
import { KenyaMap } from './KenyaMap';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface MainDashboardProps {
  onCountyClick: (county: string) => void;
  diseaseFilter: DiseaseFilter;
  onFilterChange: (filter: DiseaseFilter) => void;
}

export function MainDashboard({ onCountyClick, diseaseFilter, onFilterChange }: MainDashboardProps) {
  const diseaseParam = diseaseFilter === 'all' ? undefined : diseaseFilter;
  const topRisks = getTopRiskySubCounties(5, diseaseParam);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filter by Disease</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={diseaseFilter === 'all' ? 'default' : 'outline'}
                onClick={() => onFilterChange('all')}
                className={diseaseFilter === 'all' ? 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100' : 'dark:border-gray-600 dark:text-gray-300'}
              >
                All Risks
              </Button>
              <Button
                variant={diseaseFilter === 'cholera' ? 'default' : 'outline'}
                onClick={() => onFilterChange('cholera')}
                className={diseaseFilter === 'cholera' ? 'bg-blue-600 hover:bg-blue-700' : 'dark:border-gray-600 dark:text-gray-300'}
              >
                Cholera Only
              </Button>
              <Button
                variant={diseaseFilter === 'malaria' ? 'default' : 'outline'}
                onClick={() => onFilterChange('malaria')}
                className={diseaseFilter === 'malaria' ? 'bg-orange-600 hover:bg-orange-700' : 'dark:border-gray-600 dark:text-gray-300'}
              >
                Malaria Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Kenya County Risk Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KenyaMap onCountyClick={onCountyClick} diseaseFilter={diseaseFilter} />
              </CardContent>
            </Card>
          </div>

          {/* High Alert List */}
          <div className="lg:col-span-1">
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Top 5 Riskiest Sub-Counties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRisks.map((risk, index) => (
                    <div
                      key={`${risk.name}-${risk.disease}`}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900"
                      onClick={() => onCountyClick(risk.county)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span className="text-gray-900 dark:text-white">{risk.name}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{risk.county} County</p>
                        </div>
                        <Badge className={risk.disease === 'cholera' ? 'bg-blue-600' : 'bg-orange-600'}>
                          {risk.disease === 'cholera' ? 'Cholera' : 'Malaria'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score:</span>
                        <span className={`${getRiskColor(risk.riskScore)} px-3 py-1 rounded`}>
                          {risk.riskScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Risk Level Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Low Risk (0.00 - 0.33)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Moderate Risk (0.34 - 0.66)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">High Risk (0.67 - 1.00)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getRiskColor(risk: number): string {
  if (risk < 0.34) return 'bg-green-100 text-green-800';
  if (risk < 0.67) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}