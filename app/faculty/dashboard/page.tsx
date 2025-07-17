'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Users,
  Calendar,
  ClipboardCheck,
  FileText,
  Upload,
  MessageSquare,
  Plus,
  Search,
  Eye,
  Edit,
  Clock,
  TrendingUp,
  Award,
  Bell
} from 'lucide-react'
import { formatDate, getAttendanceColor } from '@/lib/utils'

// Mock faculty data
const facultyData = {
  name: 'Dr. Sarah Johnson',
  employeeId: 'EMP001',
  department: 'Computer Science',
  designation: 'Associate Professor',
  avatar: '👩‍🏫'
}

// Mock courses data
const courses = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    semester: 3,
    students: 45,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    room: 'A-201',
    attendanceRate: 87,
    nextClass: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    code: 'CS402',
    name: 'Machine Learning',
    semester: 4,
    students: 32,
    schedule: 'Tue, Thu - 2:00 PM',
    room: 'B-105',
    attendanceRate: 91,
    nextClass: '2024-01-16T14:00:00Z'
  },
  {
    id: '3',
    code: 'CS501',
    name: 'Advanced Algorithms',
    semester: 5,
    students: 28,
    schedule: 'Mon, Wed - 11:00 AM',
    room: 'A-301',
    attendanceRate: 89,
    nextClass: '2024-01-15T11:00:00Z'
  }
]

// Mock recent activities
const recentActivities = [
  {
    id: '1',
    type: 'attendance',
    description: 'Marked attendance for CS301',
    time: '2 hours ago',
    course: 'CS301'
  },
  {
    id: '2',
    type: 'grade',
    description: 'Updated grades for Assignment 2',
    time: '1 day ago',
    course: 'CS402'
  },
  {
    id: '3',
    type: 'material',
    description: 'Uploaded lecture notes for Week 3',
    time: '2 days ago',
    course: 'CS301'
  },
  {
    id: '4',
    type: 'announcement',
    description: 'Posted announcement about midterm exam',
    time: '3 days ago',
    course: 'CS501'
  }
]

// Mock pending tasks
const pendingTasks = [
  {
    id: '1',
    task: 'Grade Assignment 3 submissions',
    course: 'CS301',
    deadline: new Date('2024-01-20'),
    priority: 'High'
  },
  {
    id: '2',
    task: 'Prepare midterm question paper',
    course: 'CS402',
    deadline: new Date('2024-01-25'),
    priority: 'Medium'
  },
  {
    id: '3',
    task: 'Update course syllabus',
    course: 'CS501',
    deadline: new Date('2024-01-30'),
    priority: 'Low'
  }
]

// Mock student queries
const studentQueries = [
  {
    id: '1',
    student: 'John Smith',
    course: 'CS301',
    subject: 'Clarification on Binary Search Trees',
    time: '1 hour ago',
    status: 'unread'
  },
  {
    id: '2',
    student: 'Emma Wilson',
    course: 'CS402',
    subject: 'Project submission guidelines',
    time: '3 hours ago',
    status: 'read'
  },
  {
    id: '3',
    student: 'Michael Brown',
    course: 'CS301',
    subject: 'Request for grade review',
    time: '1 day ago',
    status: 'replied'
  }
]

export default function FacultyDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const averageAttendance = Math.round(
    courses.reduce((sum, course) => sum + course.attendanceRate, 0) / courses.length
  )

  const getUpcomingClass = () => {
    return courses
      .sort((a, b) => new Date(a.nextClass).getTime() - new Date(b.nextClass).getTime())[0]
  }

  const upcomingClass = getUpcomingClass()

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800'
      case 'read':
        return 'bg-yellow-100 text-yellow-800'
      case 'replied':
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
                {facultyData.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {facultyData.name}</h1>
                <p className="text-gray-600">
                  {facultyData.employeeId} | {facultyData.designation} | {facultyData.department}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Active this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendance}%</div>
              <p className={`text-xs ${getAttendanceColor(averageAttendance)}`}>
                {averageAttendance >= 85 ? 'Excellent' : averageAttendance >= 75 ? 'Good' : 'Needs Attention'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{upcomingClass.code}</div>
              <p className="text-xs text-muted-foreground">
                {new Date(upcomingClass.nextClass).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Courses & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Courses you're teaching this semester</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">{course.code} | Semester {course.semester}</p>
                          <p className="text-xs text-gray-500">{course.schedule} | {course.room}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{course.students}</div>
                          <div className="text-xs text-gray-500">Students</div>
                        </div>

                        <div className="text-center">
                          <div className={`text-sm font-medium ${getAttendanceColor(course.attendanceRate)}`}>
                            {course.attendanceRate}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance</div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {activity.type === 'attendance' && <ClipboardCheck className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'grade' && <Award className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'material' && <Upload className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'announcement' && <Bell className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.description}</div>
                        <div className="text-xs text-gray-500">{activity.course} • {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.task}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{task.course}</div>
                      <div className="text-xs text-gray-500">Due: {formatDate(task.deadline)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Student Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentQueries.map((query) => (
                    <div
                      key={query.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{query.subject}</h4>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        From: {query.student} ({query.course})
                      </div>
                      <div className="text-xs text-gray-500">{query.time}</div>
                    </div>
                  ))}
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
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Enter Grades
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
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