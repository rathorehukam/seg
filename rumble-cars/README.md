# Rumble Cars – Self Drive & Bike Rentals

A comprehensive, production-ready self-drive car and bike rental platform built for the Indian market with modern technology stack and mobile-first design.

## 🚀 Features

### Customer Features
- **Vehicle Search & Booking**: Search by city, date, vehicle type with real-time availability
- **Dynamic Pricing**: Demand-based pricing with weekend/holiday multipliers
- **Keyless Pickup**: App-based vehicle unlock when in geofence
- **Multiple Payment Options**: Razorpay integration with wallet system
- **KYC Verification**: OCR + Liveness detection for driver license verification
- **E-Sign Integration**: Digital contract signing for legal compliance
- **Trip Management**: Real-time tracking, extend/shorten bookings
- **Loyalty Program**: Points-based rewards and referral system
- **24/7 Support**: In-app chat and SOS emergency features

### Staff Features
- **Dashboard**: Today's handovers, returns, KYC queue
- **Booking Management**: QR scan for quick booking access
- **Handover/Return**: Photo checklists, damage assessment, e-signatures
- **Device Control**: Remote lock/unlock, immobilize, horn, flash
- **Valet Services**: Schedule delivery/pickup jobs
- **RSA Management**: Roadside assistance case handling

### Admin Features
- **Fleet Management**: Vehicle inventory, calendar blocks, maintenance
- **Pricing & Campaigns**: Dynamic pricing rules, coupons, promotions
- **Analytics Dashboard**: Revenue, utilization, active trips KPIs
- **User Management**: KYC approvals, fraud detection
- **Financial Reports**: Host payouts, revenue tracking, outstanding dues

### Host Features
- **Vehicle Onboarding**: Add vehicles with documentation
- **Earnings Dashboard**: Revenue tracking and payout statements
- **Device Health**: IoT device monitoring and diagnostics
- **Booking Management**: View upcoming reservations and availability

## 🛠 Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + OTP (SMS-based)
- **Payments**: Razorpay integration
- **File Storage**: AWS S3
- **Maps**: Google Maps API
- **UI Components**: Radix UI, Lucide React

## 🏗 Architecture

### Database Schema
Comprehensive data model with 25+ entities covering:
- User management and KYC
- Vehicle inventory and IoT devices
- Booking lifecycle and pricing
- Payment processing and wallets
- Loyalty and referral systems
- Audit logs and analytics

### API Structure
- **Public APIs**: Search, booking, payments
- **Authenticated APIs**: User dashboard, trip management
- **Staff APIs**: Handover/return, device control
- **Admin APIs**: Fleet management, analytics
- **Webhooks**: Payment processing, telematics events

### Security Features
- Role-based access control (Customer, Staff, Admin, Host)
- JWT authentication with HTTP-only cookies
- Request rate limiting and audit logging
- Data encryption at rest and in transit

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Razorpay account for payments
- Google Maps API key

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd rumble-cars
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Update the .env file with your configuration
```

3. **Database setup**
```bash
# Set up your PostgreSQL database and update DATABASE_URL in .env
npx prisma migrate dev
npx prisma generate
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rumble_cars"

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Payments
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# External Services
GOOGLE_MAPS_API_KEY="your-maps-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
```

## 📱 Mobile-First Design

The platform is built with mobile-first principles:
- Responsive design across all screen sizes
- Touch-optimized interfaces
- Progressive Web App (PWA) ready
- Offline capability for critical features
- App-like navigation and interactions

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API endpoints
│   ├── admin/          # Admin dashboard
│   ├── staff/          # Staff interface
│   └── host/           # Host portal
├── components/         # Reusable UI components
├── lib/               # Utilities and configurations
│   ├── auth.ts        # Authentication logic
│   ├── db.ts          # Database connection
│   ├── pricing.ts     # Dynamic pricing engine
│   └── utils.ts       # Helper functions
└── prisma/            # Database schema and migrations
```

### Key APIs

#### Vehicle Search
```http
GET /api/vehicles/search?from=2024-01-01T10:00&to=2024-01-02T10:00&city=Mumbai&type=CAR
```

#### Create Booking
```http
POST /api/bookings/hold
{
  "vehicleId": "vehicle-id",
  "startTs": "2024-01-01T10:00:00Z",
  "endTs": "2024-01-02T10:00:00Z",
  "addons": [{"code": "GPS", "qty": 1}]
}
```

#### Confirm Booking
```http
POST /api/bookings/{id}/confirm
```

### Database Operations

```bash
# Create migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🔒 Security & Compliance

- **PCI DSS**: Payment processing through Razorpay
- **Data Privacy**: GDPR-compliant data handling
- **Legal Compliance**: E-sign integration for rental agreements
- **Audit Trail**: Comprehensive logging for all actions
- **Fraud Detection**: ML-based risk scoring for bookings

## 📊 Analytics & Monitoring

- Real-time business metrics dashboard
- Revenue and utilization tracking
- Customer behavior analytics
- Fleet performance monitoring
- Predictive maintenance alerts

## 🌟 Indian Market Optimizations

- **Multi-language support** (Hindi, English)
- **Indian payment methods** (UPI, Net Banking, Cards)
- **Local compliance** (GST, TDS handling)
- **Regional pricing** (city-wise multipliers)
- **Indian holidays** and festival calendar integration
- **Fuel policy management** (Full-to-Full, As-Is)

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Payment webhook endpoints secured
- [ ] Monitoring and alerting setup
- [ ] Backup strategy implemented

### Recommended Infrastructure
- **Database**: AWS RDS PostgreSQL
- **Application**: Vercel or AWS ECS
- **Storage**: AWS S3 for documents
- **CDN**: CloudFront for static assets
- **Monitoring**: DataDog or AWS CloudWatch

## 📞 Support

For technical support or business inquiries:
- Email: support@rumblecars.com
- Documentation: [docs.rumblecars.com](https://docs.rumblecars.com)
- Status Page: [status.rumblecars.com](https://status.rumblecars.com)

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for the Indian mobility ecosystem.
