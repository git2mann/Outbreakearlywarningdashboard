import { MapPin, AlertTriangle, Droplet, Bug } from 'lucide-react';
import { DiseaseFilter, UserRole } from '../App';
import { getTopRiskySubCounties } from '../data/mockData';
import { KenyaMap } from './KenyaMap';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sliders } from 'lucide-react';
import { useLoading } from '../contexts/LoadingContext';
import { Skeleton } from './ui/skeleton';

interface MainDashboardProps {
  onCountyClick: (county: string) => void;
  diseaseFilter: DiseaseFilter;
  onFilterChange: (filter: DiseaseFilter) => void;
  userRole: UserRole;
}

export function MainDashboard({ onCountyClick, diseaseFilter, onFilterChange, userRole }: MainDashboardProps) {
  const { isLoading } = useLoading();
  const diseaseParam = diseaseFilter === 'all' ? undefined : diseaseFilter;
  const topRisks = getTopRiskySubCounties(5, diseaseParam);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Role-specific header skeleton */}
          {userRole === 'chv' && (
            <Card className="dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
            </Card>
          )}

          {/* Filters skeleton */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-40" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map skeleton */}
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[500px] w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>

            {/* High Alert List skeleton */}
            <div className="lg:col-span-1">
              <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-56" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-3 w-24 mt-2" />
                          </div>
                          <Skeleton className="h-5 w-16 rounded" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-6 w-12 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Legend skeleton */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Role-specific header message */}
        {userRole === 'chv' && (
          <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-green-200 dark:border-green-700 shadow-lg hover-lift animate-fadeIn">
            <CardContent className="pt-4">
              <p className="text-green-900 dark:text-green-100">
                <strong>Welcome, Community Health Volunteer!</strong> View disease risks in your area and submit case reports using the "Submit Case" tab.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="glass-card shadow-xl hover-lift animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-lg shadow-md animate-float">
                <Sliders className="h-4 w-4 text-white" />
              </div>
              Filter by Disease
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={diseaseFilter === 'all' ? 'default' : 'outline'}
                onClick={() => onFilterChange('all')}
                className={`transition-all duration-300 transform hover:scale-105 ${diseaseFilter === 'all' 
                  ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:to-gray-700 dark:from-white dark:via-gray-100 dark:to-white dark:text-gray-900 shadow-lg shadow-gray-500/30' 
                  : 'dark:border-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/50 hover:shadow-md'}`}
              >
                All Risks
              </Button>
              <Button
                variant={diseaseFilter === 'cholera' ? 'default' : 'outline'}
                onClick={() => onFilterChange('cholera')}
                className={`transition-all duration-300 transform hover:scale-105 ${diseaseFilter === 'cholera' 
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30' 
                  : 'dark:border-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md'}`}
              >
                <Droplet className="h-4 w-4 mr-1" />
                Cholera Only
              </Button>
              <Button
                variant={diseaseFilter === 'malaria' ? 'default' : 'outline'}
                onClick={() => onFilterChange('malaria')}
                className={`transition-all duration-300 transform hover:scale-105 ${diseaseFilter === 'malaria' 
                  ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-700 hover:to-red-600 shadow-lg shadow-orange-500/30' 
                  : 'dark:border-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:shadow-md'}`}
              >
                <Bug className="h-4 w-4 mr-1" />
                Malaria Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <Card className="glass-card shadow-2xl hover-lift">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-md">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Kenya County Risk Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KenyaMap onCountyClick={onCountyClick} diseaseFilter={diseaseFilter} />
              </CardContent>
            </Card>
          </div>

          {/* High Alert List */}
          <div className="lg:col-span-1 animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <Card className="h-full glass-card shadow-2xl hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-lg shadow-md animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Top 5 Riskiest Sub-Counties
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRisks.map((risk, index) => (
                    <div
                      key={`${risk.name}-${risk.disease}`}
                      className="p-4 glass-card rounded-lg hover-lift cursor-pointer transform transition-all duration-300 hover:scale-105"
                      onClick={() => onCountyClick(risk.county)}
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 dark:text-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                              {index + 1}
                            </span>
                            <span className="text-gray-900 dark:text-white font-semibold">{risk.name}</span>
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