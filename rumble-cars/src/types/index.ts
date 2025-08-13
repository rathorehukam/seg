import { 
  User, 
  Vehicle, 
  Booking, 
  Location, 
  KYC, 
  Payment, 
  Review,
  UserRole,
  VehicleType,
  VehicleStatus,
  BookingStatus,
  PaymentStatus,
  KycStatus
} from '@prisma/client'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Search and Filter types
export interface VehicleSearchParams {
  city?: string
  startDate?: string
  endDate?: string
  vehicleType?: VehicleType
  minPrice?: number
  maxPrice?: number
  seats?: number
  features?: string[]
  sortBy?: 'price' | 'rating' | 'distance'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface VehicleWithLocation extends Vehicle {
  pickupLoc: Location
  dropLoc: Location
  reviews: Review[]
  _count: {
    reviews: number
  }
  averageRating?: number
}

// Booking flow types
export interface BookingHoldRequest {
  vehicleId: string
  startTs: string
  endTs: string
  pickupLocId: string
  dropLocId: string
  addons?: Array<{
    addonCode: string
    name: string
    qty: number
    unitPrice: number
  }>
  couponCode?: string
}

export interface PriceBreakdown {
  baseRate: number
  durationHours: number
  subtotal: number
  taxes: number
  addons: number
  discount: number
  deposit: number
  total: number
  extraCharges?: {
    weekendMultiplier?: number
    holidayMultiplier?: number
    demandMultiplier?: number
  }
}

export interface BookingWithDetails extends Booking {
  user: User
  vehicle: VehicleWithLocation
  pickupLoc: Location
  dropLoc: Location
  payments: Payment[]
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  isActive: boolean
  profilePicture?: string
}

export interface LoginRequest {
  phone: string
  otp?: string
}

export interface SignupRequest {
  name: string
  email: string
  phone: string
  role?: UserRole
}

// KYC types
export interface KYCUploadRequest {
  dlNumber: string
  dlExpiry: string
  idDocType: 'AADHAAR' | 'PASSPORT' | 'OTHER'
  idDocNo: string
  dlFront: File
  dlBack: File
  idDoc: File
  selfie: File
}

export interface KYCWithUser extends KYC {
  user: User
  verifiedBy?: User
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number
  activeTrips: number
  totalBookings: number
  utilizationRate: number
  averageRating: number
  pendingKyc: number
  maintenanceDue: number
}

// Fleet management types
export interface VehicleFormData {
  plateNo: string
  make: string
  model: string
  year: number
  type: VehicleType
  color: string
  seats: number
  rcNo: string
  insuranceNo: string
  insuranceExpiry: string
  pucExpiry: string
  fuelPolicy: 'FULL_TO_FULL' | 'AS_IS'
  kmLimitDay: number
  baseDailyRate: number
  baseHourlyRate: number
  deposit: number
  photos: File[]
  pickupLocId: string
  dropLocId: string
  description?: string
  features?: Record<string, any>
}

// Device command types
export interface DeviceCommandRequest {
  vehicleId: string
  command: 'LOCK' | 'UNLOCK' | 'IMMOBILIZE' | 'HORN' | 'FLASH'
}

// Pricing types
export interface PricingRuleData {
  scope: 'GLOBAL' | 'VEHICLE_TYPE' | 'VEHICLE' | 'CITY'
  scopeRef: string
  ruleType: 'WEEKEND' | 'HOLIDAY' | 'SEASON' | 'DEMAND'
  pattern: string
  multiplier: number
  delta: number
}

// Reports types
export interface RevenueReport {
  date: string
  revenue: number
  bookings: number
  utilizationRate: number
}

export interface VehicleUtilization {
  vehicleId: string
  plateNo: string
  totalHours: number
  bookedHours: number
  utilizationRate: number
  revenue: number
}

// Handover/Return types
export interface HandoverData {
  odometerOut: number
  fuelOut: 'E' | 'F' | 'QUARTER' | 'HALF' | 'THREE_QUARTER'
  exteriorPhotos: File[]
  notes?: string
  keyless: boolean
}

export interface ReturnData {
  odometerIn: number
  fuelIn: 'E' | 'F' | 'QUARTER' | 'HALF' | 'THREE_QUARTER'
  exteriorPhotos: File[]
  newDamageNotes?: string
  extraKm: number
  extraFuelCharge: number
  damageCharge: number
  lateFee: number
  cleaningFee: number
}

// Notification types
export interface NotificationData {
  type: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH'
  recipient: string
  template: string
  data: Record<string, any>
}

// Payment types
export interface RazorpayOrderData {
  amount: number
  currency: string
  bookingId: string
  customerId: string
}

export interface PaymentWebhookData {
  event: string
  paymentId: string
  orderId: string
  status: string
  amount: number
  errorCode?: string
  errorDescription?: string
}

// Location types
export interface LocationData {
  name: string
  address: string
  lat: number
  lng: number
}

// Host types
export interface HostOnboardingData {
  gstNumber?: string
  panNumber: string
  bankAccount: {
    accountNumber: string
    ifscCode: string
    accountHolderName: string
  }
  upiId?: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
}

export interface HostEarningsReport {
  month: string
  year: number
  grossRevenue: number
  commissionRate: number
  commission: number
  netPayout: number
  bookings: number
  utilizationRate: number
}

// Telematics types
export interface TelematicsEventData {
  vehicleId: string
  tripId?: string
  timestamp: string
  lat: number
  lng: number
  speed: number
  event: 'NORMAL' | 'HARSH_BRAKE' | 'OVERSPEED' | 'GEOFENCE' | 'IDLE'
  metadata?: Record<string, any>
}

// Trip types
export interface TripData {
  bookingId: string
  vehicleId: string
  startGeo: { lat: number; lng: number }
  endGeo?: { lat: number; lng: number }
  distanceKm?: number
  avgSpeed?: number
  maxSpeed?: number
  violations?: Array<{
    type: string
    timestamp: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    location: { lat: number; lng: number }
  }>
}

// Common UI component props
export interface SelectOption {
  value: string
  label: string
}

export interface TableColumn<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Form validation types
export interface FormError {
  field: string
  message: string
}

export interface FormState<T = any> {
  data: T
  errors: FormError[]
  isSubmitting: boolean
  isValid: boolean
}