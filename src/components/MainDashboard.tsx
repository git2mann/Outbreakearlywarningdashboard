import { MapPin, AlertTriangle } from 'lucide-react';
import { DiseaseFilter } from '../App';
import { useEffect, useState } from 'react';
import { fetchOutbreakData } from '../api';
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
  const [outbreakData, setOutbreakData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutbreakData().then(data => {
      setOutbreakData(data);
      setLoading(false);
    });
  }, []);

  // Filter and get top 5 risks by disease
  const filtered = diseaseFilter === 'all'
    ? outbreakData
    : outbreakData.filter(d => d.disease && d.disease.toLowerCase() === diseaseFilter);

  // Calculate the total cases for each unique sub-county
  type SubCountyAggregate = {
    sub_county: string;
    county: string;
    totalCases: number;
    disease: string;
    outbreak: number;
  };

  const subCountyAggregates = filtered.reduce((acc, row) => {
    const key = row.sub_county;
    if (!acc.has(key)) {
      acc.set(key, {
        sub_county: row.sub_county,
        county: row.county,
        totalCases: 0,
        disease: diseaseFilter === 'all'
          ? 'Multiple'
          : row.disease
            ? row.disease.charAt(0).toUpperCase() + row.disease.slice(1)
            : diseaseFilter,
        outbreak: 1
      } as SubCountyAggregate);
    }
    acc.get(key)!.totalCases += Number(row.cases);
    return acc;
  }, new Map<string, SubCountyAggregate>());

  const topRisks = (Array.from(subCountyAggregates.values()) as SubCountyAggregate[])
    .sort((a, b) => b.totalCases - a.totalCases)
    .slice(0, 5)
    .map((risk) => ({
      ...risk,
      cases: risk.totalCases,
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {loading && <div className="text-center py-8">Loading outbreak data...</div>}
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
                  {topRisks.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No data available.</div>
                  ) : (
                    topRisks.map((risk, index) => (
                      <div
                        key={`${risk.sub_county}-${risk.disease}`}
                        className="p-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900"
                        onClick={() => onCountyClick(risk.county)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              <span className="text-gray-900 dark:text-white font-semibold">{risk.sub_county}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{risk.county} County</p>
                          </div>
                          <Badge className={risk.disease === 'cholera' ? 'bg-blue-600' : 'bg-orange-600'}>
                            {risk.disease.charAt(0).toUpperCase() + risk.disease.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Cases:</span>
                          <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded font-mono">
                            {risk.cases.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Outbreak:</span>
                          <span className={risk.outbreak ? "bg-red-100 text-red-800 px-3 py-1 rounded" : "bg-green-100 text-green-800 px-3 py-1 rounded"}>
                            {risk.outbreak ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
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