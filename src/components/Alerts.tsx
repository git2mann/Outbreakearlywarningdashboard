import { Bell, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function Alerts() {
  const alerts = [
    {
      id: 1,
      title: 'Critical: High Malaria Risk in Baringo County',
      message: 'Malaria risk has reached 0.88 in Baringo_Sub2. Immediate intervention recommended.',
      severity: 'critical',
      timestamp: '2025-11-16 08:30',
      status: 'active',
      county: 'Baringo'
    },
    {
      id: 2,
      title: 'Warning: Cholera Risk Increasing in Turkana',
      message: 'Cholera risk has increased to 0.72. Monitor water access and sanitation closely.',
      severity: 'warning',
      timestamp: '2025-11-16 07:15',
      status: 'active',
      county: 'Turkana'
    },
    {
      id: 3,
      title: 'Alert: Temperature Spike in Kisumu',
      message: 'Average temperature has risen to 28°C, increasing vector breeding potential.',
      severity: 'warning',
      timestamp: '2025-11-15 18:45',
      status: 'acknowledged',
      county: 'Kisumu'
    },
    {
      id: 4,
      title: 'Info: Vaccination Campaign Completed',
      message: 'Cholera vaccination campaign in Mombasa reached 85% coverage target.',
      severity: 'info',
      timestamp: '2025-11-15 14:20',
      status: 'resolved',
      county: 'Mombasa'
    },
    {
      id: 5,
      title: 'Warning: Rainfall Increase in Kakamega',
      message: 'Heavy rainfall (88mm) detected. Monitor for increased breeding sites.',
      severity: 'warning',
      timestamp: '2025-11-15 11:30',
      status: 'active',
      county: 'Kakamega'
    },
    {
      id: 6,
      title: 'Critical: Water Contamination Alert',
      message: 'Water quality concerns reported in Kilifi North. Immediate testing required.',
      severity: 'critical',
      timestamp: '2025-11-14 22:10',
      status: 'acknowledged',
      county: 'Kilifi'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-gray-900 dark:text-white">Alert Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and respond to outbreak alerts</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Bell className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">2</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">2</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Today</p>
                  <p className="text-2xl text-gray-900 dark:text-white mt-1">1</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">All Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-lg ${getSeverityColor(alert.severity)} bg-white dark:bg-gray-900`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-gray-900 dark:text-white">{alert.title}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge 
                            variant="outline"
                            className="capitalize dark:border-gray-600"
                          >
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Badge variant="secondary" className="dark:bg-gray-800">
                            {alert.county}
                          </Badge>
                        </span>
                        <span>{alert.timestamp}</span>
                      </div>
                      {alert.status === 'active' && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="dark:border-gray-600">
                            Acknowledge
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Configuration */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Cholera Risk Alert</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Trigger when risk score exceeds threshold
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Threshold:</span>
                    <Badge className="bg-yellow-500">0.50</Badge>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Malaria Risk Alert</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Trigger when risk score exceeds threshold
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Threshold:</span>
                    <Badge className="bg-yellow-500">0.60</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
