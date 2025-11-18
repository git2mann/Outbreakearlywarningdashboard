import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLoading } from '../contexts/LoadingContext';
import { ReportsSkeleton } from './skeletons/ReportsSkeleton';

export function Reports() {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  const reports = [
    {
      id: 1,
      title: 'Weekly Outbreak Risk Summary',
      date: '2025-11-10',
      type: 'Weekly',
      status: 'Published',
      description: 'Comprehensive weekly analysis of disease outbreak risks across all counties'
    },
    {
      id: 2,
      title: 'Monthly Epidemiological Report',
      date: '2025-11-01',
      type: 'Monthly',
      status: 'Published',
      description: 'Detailed monthly breakdown of cholera and malaria incidence rates'
    },
    {
      id: 3,
      title: 'High-Risk Region Assessment - Baringo',
      date: '2025-11-08',
      type: 'Special',
      status: 'Published',
      description: 'In-depth analysis of elevated malaria risk in Baringo County'
    },
    {
      id: 4,
      title: 'Intervention Effectiveness Report Q3',
      date: '2025-10-15',
      type: 'Quarterly',
      status: 'Published',
      description: 'Evaluation of public health intervention programs and outcomes'
    },
    {
      id: 5,
      title: 'Environmental Risk Factors Analysis',
      date: '2025-11-12',
      type: 'Special',
      status: 'Draft',
      description: 'Analysis of climate and environmental factors contributing to disease risk'
    },
    {
      id: 6,
      title: 'Annual Disease Surveillance Report 2024',
      date: '2025-01-15',
      type: 'Annual',
      status: 'Published',
      description: 'Comprehensive annual overview of disease surveillance activities'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-gray-900 dark:text-white">Reports & Documentation</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Access and download outbreak analysis reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">127</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">8</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">1,432</p>
                </div>
                <Download className="h-8 w-8 text-orange-600 dark:text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-gray-900 dark:text-white">{report.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-8">
                        <Badge variant="outline" className="dark:border-gray-600">
                          {report.type}
                        </Badge>
                        <Badge 
                          className={report.status === 'Published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }
                        >
                          {report.status}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(report.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="dark:border-gray-600 dark:text-gray-300"
                      disabled={report.status === 'Draft'}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Weekly Summary', 'Monthly Analysis', 'Outbreak Alert', 'Custom Report'].map((template) => (
                <div
                  key={template}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-600 dark:hover:border-red-500 transition-colors cursor-pointer text-center"
                >
                  <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{template}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}