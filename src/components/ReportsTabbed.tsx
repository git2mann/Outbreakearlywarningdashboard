import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, Eye, Calendar, TrendingUp, FileBarChart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLoading } from '../contexts/LoadingContext';
import { ReportsSkeleton } from './skeletons/ReportsSkeleton';

export function Reports() {
  const { isLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('recent');

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  const weeklyReports = [
    {
      id: 1,
      title: 'Weekly Outbreak Risk Summary - Week 46',
      date: '2025-11-10',
      type: 'Weekly',
      status: 'Published',
      description: 'Comprehensive weekly analysis of disease outbreak risks across all counties'
    },
    {
      id: 2,
      title: 'Weekly Outbreak Risk Summary - Week 45',
      date: '2025-11-03',
      type: 'Weekly',
      status: 'Published',
      description: 'Weekly disease surveillance and risk assessment report'
    },
    {
      id: 3,
      title: 'Weekly Outbreak Risk Summary - Week 44',
      date: '2025-10-27',
      type: 'Weekly',
      status: 'Published',
      description: 'Disease trends and emerging risk hotspots'
    },
  ];

  const monthlyReports = [
    {
      id: 4,
      title: 'Monthly Epidemiological Report - November',
      date: '2025-11-01',
      type: 'Monthly',
      status: 'Published',
      description: 'Detailed monthly breakdown of cholera and malaria incidence rates'
    },
    {
      id: 5,
      title: 'Monthly Epidemiological Report - October',
      date: '2025-10-01',
      type: 'Monthly',
      status: 'Published',
      description: 'Monthly surveillance summary with county-level analysis'
    },
    {
      id: 6,
      title: 'Monthly Epidemiological Report - September',
      date: '2025-09-01',
      type: 'Monthly',
      status: 'Published',
      description: 'Disease burden assessment and intervention outcomes'
    },
  ];

  const specialReports = [
    {
      id: 7,
      title: 'High-Risk Region Assessment - Baringo',
      date: '2025-11-08',
      type: 'Special',
      status: 'Published',
      description: 'In-depth analysis of elevated malaria risk in Baringo County'
    },
    {
      id: 8,
      title: 'Intervention Effectiveness Report Q3',
      date: '2025-10-15',
      type: 'Quarterly',
      status: 'Published',
      description: 'Evaluation of public health intervention programs and outcomes'
    },
    {
      id: 9,
      title: 'Environmental Risk Factors Analysis',
      date: '2025-10-20',
      type: 'Special',
      status: 'Published',
      description: 'Correlation study between environmental data and disease outbreaks'
    },
    {
      id: 10,
      title: 'Cholera Outbreak Response - Turkana',
      date: '2025-09-12',
      type: 'Special',
      status: 'Published',
      description: 'Post-outbreak analysis and recommendations for Turkana County'
    },
  ];

  const renderReportCard = (report: any) => (
    <Card key={report.id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-gray-900 dark:text-white">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {report.date}
              </div>
              <Badge variant="outline" className="text-xs">
                {report.type}
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                {report.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-gray-900 dark:text-white flex items-center gap-2">
                <FileBarChart className="h-7 w-7" />
                Reports & Publications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Access epidemiological reports and analytics</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Weekly Reports</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">{weeklyReports.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Reports</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">{monthlyReports.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Special Reports</p>
                <p className="text-2xl text-gray-900 dark:text-white mt-1">{specialReports.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="special" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Special
            </TabsTrigger>
          </TabsList>

          {/* Weekly Tab */}
          <TabsContent value="recent" className="space-y-4">
            {weeklyReports.map(renderReportCard)}
          </TabsContent>

          {/* Monthly Tab */}
          <TabsContent value="monthly" className="space-y-4">
            {monthlyReports.map(renderReportCard)}
          </TabsContent>

          {/* Special Tab */}
          <TabsContent value="special" className="space-y-4">
            {specialReports.map(renderReportCard)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
