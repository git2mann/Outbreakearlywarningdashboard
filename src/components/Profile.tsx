import { User, Mail, Phone, MapPin, Building, Shield, Settings, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-red-600 dark:bg-red-700 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-gray-900 dark:text-white">Dr. Sarah Kamau</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Public Health Officer</p>
                  <Badge className="bg-green-600 mt-3">Active</Badge>
                  
                  <Separator className="my-4 dark:bg-gray-700" />
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">s.kamau@health.go.ke</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">+254 712 345 678</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Ministry of Health</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Nairobi, Kenya</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">First Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">Sarah</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Last Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">Kamau</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Employee ID</label>
                    <p className="text-gray-900 dark:text-white mt-1">MOH-2024-1523</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Department</label>
                    <p className="text-gray-900 dark:text-white mt-1">Disease Surveillance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions & Access */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissions & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">View All Counties</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-gray-800">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">Generate Reports</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-gray-800">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">Create Alerts</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-gray-800">Granted</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">System Administration</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-gray-800">Denied</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 45 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-600">
                    Change
                  </Button>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-600">
                    Enable
                  </Button>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Active Sessions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your active sessions</p>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-600">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Viewed Baringo County details', time: '2 hours ago' },
                    { action: 'Downloaded weekly report', time: '5 hours ago' },
                    { action: 'Updated alert thresholds', time: '1 day ago' },
                    { action: 'Generated custom report', time: '2 days ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">{activity.action}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
