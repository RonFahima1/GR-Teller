'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Users, DollarSign, TrendingUp, Send, RefreshCw, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function TellerDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Today\'s Transactions',
      value: '24',
      icon: <ArrowRightLeft className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'Total Volume',
      value: '$12,450',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
    },
    {
      label: 'Active Clients',
      value: '8',
      icon: <Users className="h-6 w-6 text-purple-500" />,
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
    },
  ];

  const quickActions = [
    {
      label: 'Send Money',
      icon: <Send className="h-5 w-5" />,
      href: '/send-money',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Exchange',
      icon: <RefreshCw className="h-5 w-5" />,
      href: '/exchange',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Deposit',
      icon: <PlusCircle className="h-5 w-5" />,
      href: '/deposit',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Teller'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/send-money">
              <Send className="w-4 h-4 mr-2" />
              New Transaction
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
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Money Transfer</p>
                  <p className="text-sm text-muted-foreground">To: John Doe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$500.00</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Currency Exchange</p>
                  <p className="text-sm text-muted-foreground">USD to EUR</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$1,200.00</p>
                <p className="text-sm text-muted-foreground">4 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 