'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Bell,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react'
import { formatCurrency, formatDate, getGradeColor, getAttendanceColor } from '@/lib/utils'

// Mock student data
const studentData = {
  name: 'John Doe',
  studentId: 'ST2024001',
  semester: 3,
  batch: '2023-2027',
  department: 'Computer Science',
  cgpa: 8.5,
  avatar: '👨‍🎓'
}

// Mock courses data
const courses = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Smith',
    credits: 4,
    attendance: 85,
    grade: 'A',
    nextClass: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    code: 'CS302',
    name: 'Database Management Systems',
    instructor: 'Prof. Johnson',
    credits: 3,
    attendance: 92,
    grade: 'A+',
    nextClass: '2024-01-15T14:00:00Z'
  },
  {
    id: '3',
    code: 'CS303',
    name: 'Computer Networks',
    instructor: 'Dr. Brown',
    credits: 3,
    attendance: 78,
    grade: 'B+',
    nextClass: '2024-01-16T09:00:00Z'
  },
  {
    id: '4',
    code: 'MT301',
    name: 'Discrete Mathematics',
    instructor: 'Prof. Wilson',
    credits: 4,
    attendance: 88,
    grade: 'A-',
    nextClass: '2024-01-16T11:00:00Z'
  }
]

// Mock recent grades
const recentGrades = [
  {
    id: '1',
    course: 'CS301',
    examType: 'Quiz 1',
    marksObtained: 18,
    totalMarks: 20,
    grade: 'A',
    date: new Date('2024-01-10')
  },
  {
    id: '2',
    course: 'CS302',
    examType: 'Assignment 2',
    marksObtained: 28,
    totalMarks: 30,
    grade: 'A+',
    date: new Date('2024-01-08')
  },
  {
    id: '3',
    course: 'CS303',
    examType: 'Midterm',
    marksObtained: 42,
    totalMarks: 50,
    grade: 'B+',
    date: new Date('2024-01-05')
  }
]

// Mock fee information
const feeInfo = {
  totalFees: 125000,
  paidAmount: 75000,
  pendingAmount: 50000,
  nextDueDate: new Date('2024-02-15'),
  status: 'Partial'
}

// Mock announcements
const announcements = [
  {
    id: '1',
    title: 'Mid-Semester Examinations',
    content: 'Mid-semester exams will be conducted from February 20-28, 2024.',
    isUrgent: true,
    date: new Date('2024-01-12')
  },
  {
    id: '2',
    title: 'Library Hours Extended',
    content: 'Library will remain open until 10 PM during exam period.',
    isUrgent: false,
    date: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Project Submission Deadline',
    content: 'Final year project submissions due by January 30, 2024.',
    isUrgent: true,
    date: new Date('2024-01-08')
  }
]

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const calculateAttendancePercentage = () => {
    const totalClasses = courses.reduce((sum, course) => sum + 100, 0) // Assuming 100 classes per course
    const attendedClasses = courses.reduce((sum, course) => sum + course.attendance, 0)
    return Math.round((attendedClasses / courses.length))
  }

  const getUpcomingClass = () => {
    return courses
      .sort((a, b) => new Date(a.nextClass).getTime() - new Date(b.nextClass).getTime())[0]
  }

  const upcomingClass = getUpcomingClass()
  const overallAttendance = calculateAttendancePercentage()
  const feePercentage = (feeInfo.paidAmount / feeInfo.totalFees) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                {studentData.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {studentData.name}</h1>
                <p className="text-gray-600">
                  {studentData.studentId} | Semester {studentData.semester} | {studentData.department}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studentData.cgpa}</div>
                <div className="text-sm text-gray-500">CGPA</div>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
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
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                {courses.reduce((sum, course) => sum + course.credits, 0)} Total Credits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAttendance}%</div>
              <p className={`text-xs ${getAttendanceColor(overallAttendance)}`}>
                {overallAttendance >= 75 ? 'Good Standing' : 'Below Requirement'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(feeInfo.pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">
                Due by {formatDate(feeInfo.nextDueDate)}
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
          {/* Left Column - Courses & Grades */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Current Courses</CardTitle>
                <CardDescription>Your enrolled courses for Semester {studentData.semester}</CardDescription>
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
                          <p className="text-sm text-gray-600">{course.code} | {course.instructor}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{course.credits}</div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>

                        <div className="text-center">
                          <div className={`text-sm font-medium ${getAttendanceColor(course.attendance)}`}>
                            {course.attendance}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance</div>
                        </div>

                        <Badge className={getGradeColor(course.grade)}>
                          {course.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Grades</CardTitle>
                    <CardDescription>Your latest examination results</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{grade.course} - {grade.examType}</div>
                        <div className="text-sm text-gray-600">{formatDate(grade.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {grade.marksObtained}/{grade.totalMarks}
                        </div>
                        <Badge className={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Fee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Payment Progress</span>
                    <span>{Math.round(feePercentage)}%</span>
                  </div>
                  <Progress value={feePercentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Fees</span>
                    <span className="font-medium">{formatCurrency(feeInfo.totalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paid Amount</span>
                    <span className="font-medium text-green-600">{formatCurrency(feeInfo.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-medium text-red-600">{formatCurrency(feeInfo.pendingAmount)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600 mb-2">
                    Next Due: {formatDate(feeInfo.nextDueDate)}
                  </div>
                  <Button className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        {announcement.isUrgent && (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                      <div className="text-xs text-gray-500">{formatDate(announcement.date)}</div>
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
                    <Download className="h-4 w-4 mr-2" />
                    Download Transcript
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Timetable
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Course Materials
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Faculty
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