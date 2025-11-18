import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Bell, 
  User, 
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  Package,
  Settings as SettingsIcon,
  Users
} from 'lucide-react';
import { NavigationTab, UserRole } from '../App';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Layout({ children, activeTab, onTabChange, userRole, onRoleChange }: LayoutProps) {
  const officialNavItems: { id: NavigationTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const chvNavItems: { id: NavigationTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-collection', label: 'Submit Case', icon: ClipboardList },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = userRole === 'official' ? officialNavItems : chvNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/20 shadow-xl animate-slideInRight">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
              <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-2 sm:p-2.5 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-base sm:text-lg bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent truncate font-bold">Outbreak EWS</h1>
                <p className="text-xs text-gray-600 truncate">Kenya Ministry of Health</p>
              </div>
            </div>

            {/* Navigation Tabs - Desktop - Compact */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center mx-4 overflow-x-auto scrollbar-hide">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-300 text-xs font-medium whitespace-nowrap hover-lift ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 scale-105'
                        : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="hidden 2xl:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Role Switcher */}
              <div className="hidden lg:flex items-center gap-1 p-0.5 sm:p-1 bg-white/40 backdrop-blur-lg rounded-lg border border-white/20">
                <Button
                  variant={userRole === 'official' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('official')}
                  className={`text-xs px-2 py-1 h-7 transition-all duration-300 ${userRole === 'official' ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30' : 'hover:bg-white/50'}`}
                >
                  <Users className="h-3 w-3 sm:mr-1" />
                  <span className="hidden xl:inline">Official</span>
                </Button>
                <Button
                  variant={userRole === 'chv' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('chv')}
                  className={`text-xs px-2 py-1 h-7 ${userRole === 'chv' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md' : 'hover:bg-white/50'}`}
                >
                  <ClipboardList className="h-3 w-3 sm:mr-1" />
                  <span className="hidden xl:inline">CHV</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Mobile/Tablet - Scrollable */}
          <nav className="xl:hidden flex items-center gap-1 overflow-x-auto pb-2 pt-1 scrollbar-hide -mx-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role Badge - Mobile */}
          <div className="lg:hidden pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => onRoleChange('official')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'official' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Users className="h-3 w-3 inline mr-1" />
                Official
              </button>
              <button
                onClick={() => onRoleChange('chv')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'chv' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <ClipboardList className="h-3 w-3 inline mr-1" />
                CHV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}