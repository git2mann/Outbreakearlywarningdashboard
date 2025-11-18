import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useLoading } from '../contexts/LoadingContext';
import { SettingsSkeleton } from './skeletons/SettingsSkeleton';
import { Sliders, Bell, Database, Download, Upload, Shield, Key, Users } from 'lucide-react';

export function Settings() {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system parameters, security, and integrations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Thresholds */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5" />
                  Risk Alert Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Cholera Risk Threshold</label>
                    <Badge className="bg-blue-600">0.50</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.50"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>Low (0.0)</span>
                    <span>Moderate (0.5)</span>
                    <span>High (1.0)</span>
                  </div>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Malaria Risk Threshold</label>
                    <Badge className="bg-orange-600">0.60</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.60"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>Low (0.0)</span>
                    <span>Moderate (0.5)</span>
                    <span>High (1.0)</span>
                  </div>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Temperature Alert Threshold (°C)</label>
                    <Badge className="bg-red-600">30°C</Badge>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    step="0.5"
                    defaultValue="30"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>20°C</span>
                    <span>30°C</span>
                    <span>40°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive critical alerts via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Daily Summary Reports</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automated daily email summary</p>
                  </div>
                  <Switch />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Weekly Analytics Report</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive weekly analysis</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Data Integration */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">Climate Data API</span>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last synced: 5 minutes ago</p>
                  <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600">Configure</Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">DHIS2 Integration</span>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last synced: 1 hour ago</p>
                  <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600">Configure</Button>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">Satellite Imagery API</span>
                    </div>
                    <Badge className="bg-yellow-600">Pending</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Not configured</p>
                  <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600">Setup</Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Export/Import */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data (CSV)
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports (PDF)
                </Button>
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Historical Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Security */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">2FA Enabled</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Session Timeout</span>
                  <span className="text-sm text-gray-900 dark:text-white">30 min</span>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Data Encryption</span>
                  <Badge className="bg-green-600">AES-256</Badge>
                </div>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                  <Key className="h-4 w-4 mr-2" />
                  Manage API Keys
                </Button>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Users</span>
                  <span className="text-sm text-gray-900 dark:text-white">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active CHVs</span>
                  <span className="text-sm text-gray-900 dark:text-white">185</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Officials</span>
                  <span className="text-sm text-gray-900 dark:text-white">62</span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Version</p>
                  <p className="text-gray-900 dark:text-white">2.1.0</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-white">Nov 15, 2025</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Database</p>
                  <p className="text-gray-900 dark:text-white">PostgreSQL 15.2</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">ML Model Version</p>
                  <p className="text-gray-900 dark:text-white">v3.4.2</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}