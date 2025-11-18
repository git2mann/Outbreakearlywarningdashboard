import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { UserRole } from '../App';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Activity,
  TrendingUp,
  FileText,
  Edit,
  Camera,
  Shield,
  Bell
} from 'lucide-react';

interface ProfileProps {
  userRole: UserRole;
}

export function Profile({ userRole }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data based on role
  const userData = userRole === 'official' ? {
    name: 'Dr. Jane Mutua',
    role: 'National Health Official',
    email: 'jane.mutua@health.gov.ke',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    department: 'Disease Surveillance Unit',
    joinDate: 'January 2022',
    employeeId: 'MOH-2022-1234',
    stats: {
      reportsReviewed: 1247,
      alertsManaged: 342,
      regionsOverseen: 12,
      activeAlerts: 8
    }
  } : {
    name: 'John Kamau',
    role: 'Community Health Volunteer',
    email: 'john.kamau@chv.health.gov.ke',
    phone: '+254 723 456 789',
    location: 'Baringo County',
    community: 'Marigat Sub-County',
    joinDate: 'March 2023',
    volunteerId: 'CHV-BAR-2023-0567',
    stats: {
      casesReported: 89,
      householdsVisited: 456,
      trainingsAttended: 12,
      commendations: 5
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Premium Profile Header */}
        <div className="mb-6 animate-fadeIn">
          <Card className="glass-card border-0 shadow-2xl overflow-hidden relative">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            
            <CardContent className="pt-6 pb-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-white text-3xl font-bold mb-2">{userData.name}</h1>
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-xl hover:bg-white/30">
                      {userData.role}
                    </Badge>
                    <Badge className="bg-emerald-500/90 text-white border-0 hover:bg-emerald-600/90">
                      <Shield className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1 text-white/90">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Joined {userData.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(userData.stats).map(([key, value], index) => (
            <Card 
              key={key}
              className="glass-card hover-lift animate-scaleIn border-0 shadow-xl relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="pt-6 relative z-10">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-3 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card border-0 p-1 shadow-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <User className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Bell className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="glass-card border-0 shadow-xl hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Full Name</Label>
                    <Input 
                      value={userData.name} 
                      disabled={!isEditing}
                      className="mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Email Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <Input 
                        value={userData.email} 
                        disabled={!isEditing}
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Phone Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <Input 
                        value={userData.phone} 
                        disabled={!isEditing}
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <Input 
                        value={userData.location} 
                        disabled={!isEditing}
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card className="glass-card border-0 shadow-xl hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID Number</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white">
                      {userRole === 'official' ? userData.employeeId : userData.volunteerId}
                    </p>
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Role & Department</p>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {userData.role}
                    </Badge>
                    {userRole === 'official' && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {userData.department}
                      </p>
                    )}
                    {userRole === 'chv' && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {userData.community}
                      </p>
                    )}
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active & Verified</span>
                    </div>
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Member Since</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{userData.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Submitted weekly report', time: '2 hours ago', icon: FileText, color: 'from-blue-500 to-cyan-500' },
                    { action: 'Reviewed 12 case submissions', time: '5 hours ago', icon: Activity, color: 'from-purple-500 to-pink-500' },
                    { action: 'Updated profile information', time: '1 day ago', icon: User, color: 'from-green-500 to-emerald-500' },
                    { action: 'Attended training session', time: '3 days ago', icon: Award, color: 'from-orange-500 to-red-500' },
                  ].map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 glass-card rounded-lg hover-lift"
                    >
                      <div className={`p-3 bg-gradient-to-br ${activity.color} rounded-xl shadow-lg`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Email Notifications', description: 'Receive updates via email' },
                  { label: 'SMS Alerts', description: 'Get urgent alerts via SMS' },
                  { label: 'Push Notifications', description: 'Browser push notifications' },
                  { label: 'Weekly Summary', description: 'Receive weekly activity summary' },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg hover-lift">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{setting.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}