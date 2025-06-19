'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, FileText, Eye, Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function ComplianceDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Pending Reviews',
      value: '8',
      icon: <Clock className="h-6 w-6 text-orange-500" />,
    },
    {
      label: 'Approved Today',
      value: '15',
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      label: 'Flagged Transactions',
      value: '3',
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    },
    {
      label: 'Compliance Score',
      value: '98.2%',
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    },
  ];

  const quickActions = [
    {
      label: 'Review Transactions',
      icon: <Eye className="h-5 w-5" />,
      href: '/compliance/reviews',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Generate Reports',
      icon: <FileText className="h-5 w-5" />,
      href: '/reports',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Risk Assessment',
      icon: <Shield className="h-5 w-5" />,
      href: '/compliance/risk',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const pendingReviews = [
    {
      id: '1',
      type: 'High Value Transfer',
      amount: '$25,000',
      customer: 'John Smith',
      time: '2 hours ago',
      risk: 'Medium',
    },
    {
      id: '2',
      type: 'Multiple Transactions',
      amount: '$8,500',
      customer: 'Sarah Johnson',
      time: '4 hours ago',
      risk: 'Low',
    },
    {
      id: '3',
      type: 'New Customer',
      amount: '$12,000',
      customer: 'Mike Davis',
      time: '6 hours ago',
      risk: 'High',
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Compliance Officer'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/compliance/reviews">
              <Eye className="w-4 h-4 mr-2" />
              Review Pending
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
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

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{review.type}</p>
                    <p className="text-sm text-muted-foreground">{review.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{review.amount}</p>
                    <p className="text-sm text-muted-foreground">{review.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(review.risk)}`}>
                    {review.risk}
                  </span>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Large Transfers</span>
                <span className="font-medium text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Customers</span>
                <span className="font-medium text-green-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Currency Exchanges</span>
                <span className="font-medium text-green-600">25</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Low Risk</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Medium Risk</span>
                <span className="font-medium text-orange-600">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>High Risk</span>
                <span className="font-medium text-red-600">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 