'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Crown,
  Globe,
  Calendar,
  Activity
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for institutions
const institutions = [
  {
    id: '1',
    name: 'Springfield University',
    domain: 'springfield.edu',
    plan: 'ENTERPRISE',
    students: 5420,
    revenue: 25000,
    status: 'active',
    joinedDate: new Date('2023-01-15'),
    logo: '🎓'
  },
  {
    id: '2',
    name: 'Riverside High School',
    domain: 'riverside.edu',
    plan: 'PRO',
    students: 1200,
    revenue: 2999,
    status: 'active',
    joinedDate: new Date('2023-03-20'),
    logo: '🏫'
  },
  {
    id: '3',
    name: 'Tech Academy',
    domain: 'techacademy.edu',
    plan: 'BASIC',
    students: 450,
    revenue: 999,
    status: 'trial',
    joinedDate: new Date('2024-01-10'),
    logo: '💻'
  },
  {
    id: '4',
    name: 'Green Valley School',
    domain: 'greenvalley.edu',
    plan: 'PRO',
    students: 800,
    revenue: 2999,
    status: 'active',
    joinedDate: new Date('2023-09-05'),
    logo: '🌳'
  }
]

// Mock analytics data
const analytics = {
  totalRevenue: 156780,
  totalInstitutions: 247,
  totalStudents: 125340,
  growth: 23.5,
  revenueGrowth: 18.2,
  institutionGrowth: 12.8,
  studentGrowth: 15.6
}

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || institution.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800'
      case 'PRO':
        return 'bg-blue-100 text-blue-800'
      case 'BASIC':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'trial':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage institutions and monitor platform performance</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Institution
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.revenueGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalInstitutions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.institutionGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{analytics.studentGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.growth}%</div>
              <p className="text-xs text-muted-foreground">
                Overall platform growth rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Institutions Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Institutions</CardTitle>
                <CardDescription>Manage all institutions on the platform</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search institutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInstitutions.map((institution) => (
                <div
                  key={institution.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {institution.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{institution.domain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {institution.students.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(institution.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">Monthly</div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <Badge className={getPlanColor(institution.plan)}>
                        {institution.plan}
                      </Badge>
                      <Badge className={getStatusColor(institution.status)}>
                        {institution.status}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(institution.joinedDate)}
                      </div>
                      <div className="text-xs text-gray-500">Joined</div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Server Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <span className="text-sm text-gray-600">125ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm text-gray-600">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">New institution added</div>
                  <div className="text-gray-500">Tech Academy - 2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Subscription upgraded</div>
                  <div className="text-gray-500">Springfield University - 1 day ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Payment received</div>
                  <div className="text-gray-500">₹25,000 - Riverside High - 2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Institution
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Billing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  System Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}