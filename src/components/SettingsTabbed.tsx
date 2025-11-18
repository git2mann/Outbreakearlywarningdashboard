import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLoading } from '../contexts/LoadingContext';
import { SettingsSkeleton } from './skeletons/SettingsSkeleton';
import { Sliders, Bell, Database, Download, Upload, Shield, Key, Users, Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const { isLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('thresholds');

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-gray-900 dark:text-white flex items-center gap-2">
                <SettingsIcon className="h-7 w-7" />
                System Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system parameters, security, and integrations</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger value="thresholds" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Sliders className="h-4 w-4 mr-2" />
              Thresholds
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" />
              Data & Access
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Thresholds Tab */}
          <TabsContent value="thresholds" className="space-y-6">
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

                <Separator className="dark:bg-gray-700" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Rainfall Alert Threshold (mm)</label>
                    <Badge className="bg-cyan-600">100mm</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    defaultValue="100"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0mm</span>
                    <span>100mm</span>
                    <span>200mm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
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
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">High-Risk County Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Immediate alerts for high-risk regions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Alert Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Add email address"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <Button>Add</Button>
                </div>
                <div className="space-y-2">
                  {['admin@health.gov.ke', 'alerts@ministry.gov.ke', 'surveillance@health.gov.ke'].map((email, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">{email}</span>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Access Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Automatic Data Backup</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily automated backups at 2:00 AM</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <p className="text-gray-900 dark:text-white mb-2">Export System Data</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <p className="text-gray-900 dark:text-white mb-2">Import Data</p>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Access Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'Dr. Jane Mutua', role: 'National Official', status: 'Active' },
                    { name: 'John Kamau', role: 'CHV - Baringo', status: 'Active' },
                    { name: 'Mary Wanjiru', role: 'CHV - Turkana', status: 'Active' },
                    { name: 'Peter Omondi', role: 'Data Analyst', status: 'Pending' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
                      </div>
                      <Badge className={user.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Session Timeout</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Auto-logout after 30 minutes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">IP Whitelist</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Audit Logging</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track all system activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys & Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Weather API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">NDVI Satellite API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">SMS Gateway API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
