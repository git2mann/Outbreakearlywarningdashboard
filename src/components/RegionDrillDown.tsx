import { ArrowLeft, Droplet, Bug } from 'lucide-react';
import { getCountyByName } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RiskGauge } from './RiskGauge';
import { XAICard } from './XAICard';
import { TrendCharts } from './TrendCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface RegionDrillDownProps {
  countyName: string;
  onBack: () => void;
}

export function RegionDrillDown({ countyName, onBack }: RegionDrillDownProps) {
  const county = getCountyByName(countyName);
  
  if (!county) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <p className="mt-4">County not found</p>
      </div>
    );
  }

  // Get data from the first sub-county for display
  const subCounty = county.subCounties[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onBack} variant="outline" className="mb-3 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
            ← Back to Map
          </Button>
          <h1 className="text-gray-900 dark:text-white">{county.name} County - Weekly Risk Assessment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sub-County: {subCounty.name}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Risk Gauges */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-500 flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                Cholera Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskGauge value={subCounty.choleraRisk} disease="cholera" />
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-orange-600 dark:text-orange-500 flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Malaria Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskGauge value={subCounty.malariaRisk} disease="malaria" />
            </CardContent>
          </Card>
        </div>

        {/* XAI Explanations */}
        <Tabs defaultValue="malaria" className="w-full">
          <TabsList className="grid w-full md:w-96 grid-cols-2 dark:bg-gray-800">
            <TabsTrigger value="malaria" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              Malaria Analysis
            </TabsTrigger>
            <TabsTrigger value="cholera" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Cholera Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="malaria" className="mt-6">
            <XAICard
              disease="Malaria"
              xaiData={subCounty.xaiData.malaria}
              color="orange"
            />
          </TabsContent>
          
          <TabsContent value="cholera" className="mt-6">
            <XAICard
              disease="Cholera"
              xaiData={subCounty.xaiData.cholera}
              color="blue"
            />
          </TabsContent>
        </Tabs>

        {/* Trend Charts */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Environmental Data Trends (Last 8 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendCharts weeklyData={subCounty.weeklyData} />
          </CardContent>
        </Card>

        {/* Sub-Counties Overview */}
        {county.subCounties.length > 1 && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">All Sub-Counties in {county.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {county.subCounties.map((sub) => (
                  <div key={sub.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                    <h3 className="text-gray-900 dark:text-white mb-3">{sub.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                          Cholera
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${getRiskColorClass(sub.choleraRisk)}`}>
                          {sub.choleraRisk.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Bug className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                          Malaria
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${getRiskColorClass(sub.malariaRisk)}`}>
                          {sub.malariaRisk.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function getRiskColorClass(risk: number): string {
  if (risk < 0.34) return 'bg-green-100 text-green-800';
  if (risk < 0.67) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}