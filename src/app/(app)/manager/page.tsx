'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, TrendingUp, Building2, UserPlus, Settings, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Tellers',
      value: '12',
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'Monthly Volume',
      value: '$245,000',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
    },
    {
      label: 'Active Branches',
      value: '3',
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
    },
    {
      label: 'Growth Rate',
      value: '+12.5%',
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
    },
  ];

  const quickActions = [
    {
      label: 'Manage Users',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Add Teller',
      icon: <UserPlus className="h-5 w-5" />,
      href: '/admin/users',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Reports',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/reports',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const recentActivity = [
    {
      type: 'New Teller Added',
      description: 'Sarah Johnson joined as teller',
      time: '2 hours ago',
      icon: <UserPlus className="w-5 h-5 text-green-600" />,
    },
    {
      type: 'High Volume Transaction',
      description: '$15,000 transfer completed',
      time: '4 hours ago',
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
    },
    {
      type: 'System Update',
      description: 'Exchange rates updated',
      time: '6 hours ago',
      icon: <Settings className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Manager'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/users">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teller
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-muted-foreground">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button key={index} asChild className={`${action.color} text-white`}>
                <Link href={action.href}>
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Main Branch</span>
                <span className="font-medium">$125,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Downtown Branch</span>
                <span className="font-medium">$85,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Westside Branch</span>
                <span className="font-medium">$35,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>John Smith</span>
                <span className="font-medium">$45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sarah Johnson</span>
                <span className="font-medium">$38,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Mike Davis</span>
                <span className="font-medium">$32,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 