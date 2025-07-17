'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  GraduationCap,
  UserCheck,
  FileText,
  Bell,
  Shield,
  Building,
  Award,
  ClipboardCheck,
  Eye
} from 'lucide-react'
import { formatCurrency, formatDate, getAttendanceColor } from '@/lib/utils'

// Mock institution data
const institutionData = {
  name: 'Springfield University',
  domain: 'springfield.edu',
  address: '123 University Ave, Springfield, ST 12345',
  phone: '+1 (555) 123-4567',
  email: 'admin@springfield.edu',
  established: '1985',
  accreditation: 'NAAC A+',
  logo: '🏛️'
}

// Mock dashboard stats
const dashboardStats = {
  totalStudents: 1245,
  totalFaculty: 67,
  totalCourses: 89,
  totalRevenue: 2850000,
  pendingAdmissions: 45,
  activeEnrollments: 1200,
  averageAttendance: 85.6,
  feeCollectionRate: 92.3,
  monthlyGrowth: {
    students: 8.2,
    revenue: 12.5,
    attendance: 3.1
  }
}

// Mock recent activities
const recentActivities = [
  {
    id: '1',
    type: 'admission',
    description: 'New student admission completed',
    details: 'John Doe - Computer Science',
    time: '2 hours ago'
  },
  {
    id: '2',
    type: 'payment',
    description: 'Fee payment received',
    details: '₹25,000 - Semester 3 fees',
    time: '4 hours ago'
  },
  {
    id: '3',
    type: 'faculty',
    description: 'New faculty member added',
    details: 'Dr. Sarah Wilson - Mathematics Dept.',
    time: '1 day ago'
  },
  {
    id: '4',
    type: 'course',
    description: 'Course schedule updated',
    details: 'CS301 - Data Structures',
    time: '2 days ago'
  }
]

// Mock quick stats by department
const departmentStats = [
  {
    name: 'Computer Science',
    students: 425,
    faculty: 18,
    courses: 32,
    avgAttendance: 87
  },
  {
    name: 'Mathematics',
    students: 280,
    faculty: 12,
    courses: 24,
    avgAttendance: 89
  },
  {
    name: 'Physics',
    students: 195,
    faculty: 10,
    courses: 18,
    avgAttendance: 84
  },
  {
    name: 'Chemistry',
    students: 220,
    faculty: 14,
    courses: 20,
    avgAttendance: 86
  },
  {
    name: 'English',
    students: 125,
    faculty: 13,
    courses: 15,
    avgAttendance: 91
  }
]

// Mock pending approvals
const pendingApprovals = [
  {
    id: '1',
    type: 'admission',
    title: 'Student Admission Applications',
    count: 15,
    priority: 'High'
  },
  {
    id: '2',
    type: 'fee',
    title: 'Fee Waiver Requests',
    count: 8,
    priority: 'Medium'
  },
  {
    id: '3',
    type: 'faculty',
    title: 'Faculty Leave Applications',
    count: 5,
    priority: 'Medium'
  },
  {
    id: '4',
    type: 'course',
    title: 'Course Addition Requests',
    count: 3,
    priority: 'Low'
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState('overview')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                {institutionData.logo}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{institutionData.name}</h1>
                <p className="text-gray-600">Institution Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Academic Year 2023-24</div>
                <div className="text-xs text-gray-500">Est. {institutionData.established}</div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardStats.monthlyGrowth.students}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalFaculty}</div>
              <p className="text-xs text-muted-foreground">
                Active teaching staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardStats.monthlyGrowth.revenue}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.averageAttendance}%</div>
              <p className={`text-xs ${getAttendanceColor(dashboardStats.averageAttendance)}`}>
                Institution-wide average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Department Overview & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Statistics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Overview</CardTitle>
                    <CardDescription>Statistics by academic department</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                          <p className="text-sm text-gray-600">{dept.courses} courses offered</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{dept.students}</div>
                          <div className="text-xs text-gray-500">Students</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-medium">{dept.faculty}</div>
                          <div className="text-xs text-gray-500">Faculty</div>
                        </div>

                        <div className="text-center">
                          <div className={`text-sm font-medium ${getAttendanceColor(dept.avgAttendance)}`}>
                            {dept.avgAttendance}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance</div>
                        </div>

                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates and activities across the institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {activity.type === 'admission' && <GraduationCap className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'faculty' && <UserCheck className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'course' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.description}</div>
                        <div className="text-xs text-gray-600">{activity.details}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{approval.title}</h4>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{approval.count}</span>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Institution Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Institution Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">Address</div>
                  <div className="text-sm text-gray-600">{institutionData.address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Contact</div>
                  <div className="text-sm text-gray-600">{institutionData.phone}</div>
                  <div className="text-sm text-gray-600">{institutionData.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Accreditation</div>
                  <Badge className="bg-green-100 text-green-800">{institutionData.accreditation}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Domain</div>
                  <div className="text-sm text-gray-600">{institutionData.domain}</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Courses</span>
                  <span className="font-medium">{dashboardStats.totalCourses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Admissions</span>
                  <span className="font-medium text-orange-600">{dashboardStats.pendingAdmissions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fee Collection Rate</span>
                  <span className="font-medium text-green-600">{dashboardStats.feeCollectionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Enrollments</span>
                  <span className="font-medium">{dashboardStats.activeEnrollments}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Manage Faculty
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Course Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Fee Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}