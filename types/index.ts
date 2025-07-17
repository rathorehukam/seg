export type UserRole = 'SUPER_ADMIN' | 'INSTITUTION_ADMIN' | 'FACULTY' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  isActive: boolean;
  
  // Institution relation
  institutionId?: string;
  institution?: Institution;
  
  // Student specific
  studentId?: string;
  semester?: number;
  batch?: string;
  
  // Faculty specific
  employeeId?: string;
  department?: string;
  designation?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Institution {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  
  // Subscription
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscriptionEndsAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  semester: number;
  department: string;
  academicYear: string;
  isActive: boolean;
  
  institutionId: string;
  institution?: Institution;
  
  instructorId?: string;
  instructor?: User;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  student?: User;
  courseId: string;
  course?: Course;
  enrolledAt: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
}

export interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  studentId: string;
  student?: User;
  courseId: string;
  course?: Course;
  markedAt: Date;
  markedBy?: string;
}

export interface Grade {
  id: string;
  examType: 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL' | 'PROJECT';
  marksObtained: number;
  totalMarks: number;
  grade?: string;
  studentId: string;
  student?: User;
  courseId: string;
  course?: Course;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  description?: string;
  isRecurring: boolean;
  semester?: number;
  batch?: string;
  institutionId: string;
  institution?: Institution;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE' | 'UPI';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  studentId: string;
  student?: User;
  feeStructureId: string;
  feeStructure?: FeeStructure;
  institutionId: string;
  institution?: Institution;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  targetAudience: ('ALL' | 'STUDENTS' | 'FACULTY' | 'ADMINS')[];
  semester?: number;
  batch?: string;
  department?: string;
  institutionId: string;
  institution?: Institution;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'GRADE_UPDATED' | 'ATTENDANCE_MARKED' | 'FEE_DUE' | 'ASSIGNMENT_DUE' | 'GENERAL';
  isRead: boolean;
  sentById: string;
  sentBy?: User;
  userId: string;
  user?: User;
  createdAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalRevenue: number;
  attendanceRate: number;
  pendingFees: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

export interface GradeStats {
  averageGrade: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface InstitutionForm {
  name: string;
  domain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export interface UserForm {
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  
  // Student specific
  studentId?: string;
  semester?: number;
  batch?: string;
  
  // Faculty specific
  employeeId?: string;
  department?: string;
  designation?: string;
}

export interface CourseForm {
  code: string;
  name: string;
  description?: string;
  credits: number;
  semester: number;
  department: string;
  academicYear: string;
  instructorId?: string;
}

export interface FeeStructureForm {
  name: string;
  amount: number;
  dueDate: string;
  description?: string;
  isRecurring: boolean;
  semester?: number;
  batch?: string;
}

export interface AnnouncementForm {
  title: string;
  content: string;
  isUrgent: boolean;
  targetAudience: ('ALL' | 'STUDENTS' | 'FACULTY' | 'ADMINS')[];
  semester?: number;
  batch?: string;
  department?: string;
}