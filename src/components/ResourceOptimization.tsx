import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, TruckIcon, Users, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLoading } from '../contexts/LoadingContext';
import { ResourceOptimizationSkeleton } from './skeletons/ResourceOptimizationSkeleton';

export function ResourceOptimization() {
  const { isLoading } = useLoading();
  const [optimizationMode, setOptimizationMode] = useState<'current' | 'predicted'>('current');
  const [isOptimized, setIsOptimized] = useState(false);

  if (isLoading) {
    return <ResourceOptimizationSkeleton />;
  }

  // Resource inventory
  const resources = [
    { name: 'ORS Packets', available: 15000, needed: 22000, unit: 'packets', priority: 'high' },
    { name: 'Antimalarial Drugs', available: 8500, needed: 12000, unit: 'doses', priority: 'high' },
    { name: 'Water Purification', available: 450, needed: 600, unit: 'tablets (1000s)', priority: 'medium' },
    { name: 'Mosquito Nets', available: 3200, needed: 4800, unit: 'nets', priority: 'medium' },
    { name: 'IV Fluids', available: 1200, needed: 1500, unit: 'bags', priority: 'high' },
    { name: 'Rapid Test Kits', available: 2800, needed: 3500, unit: 'kits', priority: 'low' },
  ];

  // Allocation recommendations - changes based on mode and optimization
  const getAllocations = () => {
    const baseAllocations = [
      { county: 'Turkana', risk: 0.89, currentAlloc: 18, recommendedAlloc: 28, population: 926976, gap: 10 },
      { county: 'Baringo', risk: 0.78, currentAlloc: 15, recommendedAlloc: 22, population: 666763, gap: 7 },
      { county: 'Kisumu', risk: 0.72, currentAlloc: 20, recommendedAlloc: 25, population: 1155574, gap: 5 },
      { county: 'Kilifi', risk: 0.68, currentAlloc: 12, recommendedAlloc: 18, population: 1453787, gap: 6 },
      { county: 'Machakos', risk: 0.35, currentAlloc: 10, recommendedAlloc: 7, population: 1421932, gap: -3 },
    ];

    if (optimizationMode === 'predicted') {
      // Predictive mode shows higher allocations for counties with rising risk trends
      return baseAllocations.map(alloc => {
        if (alloc.county === 'Turkana') {
          const newRecommended = isOptimized ? 32 : 32;
          const newCurrent = isOptimized ? 32 : alloc.currentAlloc;
          return { ...alloc, risk: 0.92, currentAlloc: newCurrent, recommendedAlloc: newRecommended, gap: isOptimized ? 0 : 14 };
        } else if (alloc.county === 'Baringo') {
          const newRecommended = 26;
          const newCurrent = isOptimized ? 26 : alloc.currentAlloc;
          return { ...alloc, risk: 0.82, currentAlloc: newCurrent, recommendedAlloc: newRecommended, gap: isOptimized ? 0 : 11 };
        } else if (alloc.county === 'Kisumu') {
          const newRecommended = 27;
          const newCurrent = isOptimized ? 27 : alloc.currentAlloc;
          return { ...alloc, risk: 0.75, currentAlloc: newCurrent, recommendedAlloc: newRecommended, gap: isOptimized ? 0 : 7 };
        } else if (alloc.county === 'Kilifi') {
          const newRecommended = 10;
          const newCurrent = isOptimized ? 10 : alloc.currentAlloc;
          return { ...alloc, risk: 0.52, currentAlloc: newCurrent, recommendedAlloc: newRecommended, gap: isOptimized ? 0 : -2 };
        } else if (alloc.county === 'Machakos') {
          const newRecommended = 5;
          const newCurrent = isOptimized ? 5 : alloc.currentAlloc;
          return { ...alloc, risk: 0.28, currentAlloc: newCurrent, recommendedAlloc: newRecommended, gap: isOptimized ? 0 : -5 };
        }
        return alloc;
      });
    }

    if (isOptimized) {
      // After optimization, current allocation matches recommended
      return baseAllocations.map(alloc => ({
        ...alloc,
        currentAlloc: alloc.recommendedAlloc,
        gap: 0
      }));
    }

    return baseAllocations;
  };

  const allocations = getAllocations();

  // Supply chain status
  const supplyChain = [
    { route: 'Nairobi → Turkana', status: 'in-transit', eta: '2 days', cargo: 'ORS, Antimalarials' },
    { route: 'Mombasa → Kilifi', status: 'delayed', eta: '4 days', cargo: 'IV Fluids, Test Kits' },
    { route: 'Kisumu → Baringo', status: 'delivered', eta: 'Completed', cargo: 'Water Purification' },
    { route: 'Nairobi → Machakos', status: 'scheduled', eta: '5 days', cargo: 'Mosquito Nets' },
  ];

  // Resource efficiency metrics - changes based on optimization
  const efficiencyData = [
    { category: 'Stock Levels', score: isOptimized ? 85 : 68 },
    { category: 'Distribution', score: isOptimized ? 88 : 72 },
    { category: 'Utilization', score: isOptimized ? 92 : 85 },
    { category: 'Response Time', score: isOptimized ? 78 : 58 },
    { category: 'Cost Efficiency', score: isOptimized ? 84 : 76 },
  ];

  const overallEfficiency = efficiencyData.reduce((sum, d) => sum + d.score, 0) / efficiencyData.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'in-transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'scheduled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
    }
  };

  const optimizeDistribution = () => {
    setIsOptimized(true);
    // Show success message
    setTimeout(() => {
      alert('✅ Distribution Optimized!\n\n' +
        '• Resources reallocated based on risk scores\n' +
        '• High-priority counties prioritized\n' +
        '• Efficiency improved by 18%\n' +
        '• All allocation gaps addressed\n\n' +
        'New shipments will be scheduled automatically.');
    }, 300);
  };

  const resetOptimization = () => {
    setIsOptimized(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Resource Optimization</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Optimize resource allocation based on outbreak risk</p>
          </div>
          <div className="flex gap-2">
            {isOptimized && (
              <Button onClick={resetOptimization} variant="outline" className="dark:border-gray-600">
                Reset to Original
              </Button>
            )}
            <Button 
              onClick={optimizeDistribution} 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
              disabled={isOptimized}
            >
              <TruckIcon className="h-4 w-4 mr-2" />
              {isOptimized ? '✓ Optimized' : 'Optimize Distribution'}
            </Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Allocation Strategy</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {optimizationMode === 'current' 
                    ? 'Based on current week risk assessments' 
                    : 'Based on predicted next-week risk (Early Warning System)'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={optimizationMode === 'current' ? 'default' : 'outline'}
                  onClick={() => { setOptimizationMode('current'); setIsOptimized(false); }}
                  className={optimizationMode === 'current' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'dark:border-gray-600'}
                >
                  Current Risk-Based
                </Button>
                <Button
                  variant={optimizationMode === 'predicted' ? 'default' : 'outline'}
                  onClick={() => { setOptimizationMode('predicted'); setIsOptimized(false); }}
                  className={optimizationMode === 'predicted' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'dark:border-gray-600'}
                >
                  Predictive Allocation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Status Banner */}
        {isOptimized && (
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-green-900 dark:text-green-300 font-semibold">Distribution Optimized Successfully!</p>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Resources have been reallocated based on {optimizationMode === 'current' ? 'current risk levels' : 'predicted outbreak trends'}. 
                    Overall efficiency improved to {overallEfficiency.toFixed(1)}%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mode Info Banner */}
        {optimizationMode === 'predicted' && !isOptimized && (
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-purple-900 dark:text-purple-300 font-semibold">Predictive Mode Active</p>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    Allocation recommendations are based on next-week ML predictions. Risk scores and recommended allocations 
                    reflect anticipated outbreak trends, enabling proactive resource positioning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Inventory */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
              National Resource Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {resources.map((resource) => {
                const percentage = (resource.available / resource.needed) * 100;
                const shortage = resource.needed - resource.available;
                
                return (
                  <div key={resource.name} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{resource.name}</h3>
                          <Badge className={getPriorityColor(resource.priority)}>
                            {resource.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.available.toLocaleString()} / {resource.needed.toLocaleString()} {resource.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${percentage >= 100 ? 'text-green-600 dark:text-green-400' : percentage >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {percentage.toFixed(0)}%
                        </div>
                        {shortage > 0 && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Short: {shortage.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          percentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Allocation Recommendations */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Recommended Resource Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">County</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Risk Score</th>
                    <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Current %</th>
                    <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Recommended %</th>
                    <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Change</th>
                    <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc) => (
                    <tr key={alloc.county} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{alloc.county}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Pop: {alloc.population.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${
                          alloc.risk >= 0.67 ? 'bg-gradient-to-r from-red-600 to-red-700' :
                          alloc.risk >= 0.34 ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
                          'bg-gradient-to-r from-green-600 to-green-700'
                        }`}>
                          {alloc.risk.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{alloc.currentAlloc}%</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">{alloc.recommendedAlloc}%</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${
                          alloc.gap > 0 ? 'text-green-600 dark:text-green-400' :
                          alloc.gap < 0 ? 'text-red-600 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {alloc.gap > 0 ? '+' : ''}{alloc.gap}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isOptimized ? (
                          <Badge className="bg-green-600">
                            ✓ Applied
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="dark:border-gray-600">
                            {alloc.gap > 0 ? 'Increase' : alloc.gap < 0 ? 'Decrease' : 'No Change'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={allocations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="county" stroke="#9ca3af" />
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
                  <Bar dataKey="currentAlloc" fill="#94a3b8" name="Current %" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="recommendedAlloc" fill="#22c55e" name="Recommended %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Supply Chain Status */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <TruckIcon className="h-4 w-4 text-white" />
                </div>
                Supply Chain Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {supplyChain.map((route, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <TruckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">{route.route}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{route.cargo}</p>
                      </div>
                      <Badge className={`${getStatusColor(route.status)} border`}>
                        {route.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {route.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Metrics */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                Resource Efficiency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={efficiencyData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar name="Efficiency Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Efficiency Score</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{overallEfficiency.toFixed(1)}%</p>
                {isOptimized && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+18% improvement</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="dark:bg-gray-800/50 dark:border-gray-700 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {isOptimized ? 'Optimization Actions Completed' : 'Recommended Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isOptimized ? (
              <ul className="space-y-2 text-green-900 dark:text-green-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>✓ ORS packet allocation to Turkana increased by 35%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>✓ Expedited shipment to Kilifi scheduled - ETA reduced to 2 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>✓ 15% of Machakos resources redistributed to Baringo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>✓ Procurement order generated for 7,000 additional antimalarial doses</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-orange-900 dark:text-orange-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Increase ORS packet allocation to Turkana by 35% within 48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Expedite delayed shipment to Kilifi - critical shortage of IV fluids</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Redistribute 15% of Machakos allocation to Baringo based on risk prediction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Procure additional 7,000 antimalarial doses for national stockpile</span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}