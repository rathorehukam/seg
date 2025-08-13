# Rumble Cars - Self Drive & Bike Rentals Platform

A comprehensive car and bike rental platform built for the Indian market with Next.js, TypeScript, and modern web technologies.

## 🚗 Features

### Multi-Role System
- **Customer**: Browse, book, pay, manage trips
- **Staff**: Handle pickups, returns, KYC verification
- **Admin**: Fleet management, pricing, reports  
- **Host**: Vehicle onboarding, earnings management

### Core Functionality
- **Vehicle Search**: Real-time availability with dynamic pricing
- **Booking Flow**: Search → Select → Pay → KYC → E-Sign → Confirm
- **Payment Integration**: Razorpay with webhook support
- **KYC Verification**: Document upload with OCR and liveness detection
- **Trip Management**: Keyless pickup/return with geofencing
- **Pricing Engine**: Dynamic pricing with demand, weekend, holiday multipliers
- **Device Integration**: Vehicle control commands (lock/unlock/immobilize)

### Indian Market Features
- **OTP-based Authentication**: SMS-based signup and login
- **Multi-language Support**: Hindi and English
- **INR Currency**: Formatted pricing in Indian Rupees
- **Indian Cities**: Pre-configured metro cities
- **GST Calculation**: 18% tax computation
- **Indian Phone Validation**: 10-digit mobile number support

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Styling**: Tailwind CSS with mobile-first design
- **Payments**: Razorpay integration
- **File Storage**: AWS S3 compatible
- **Maps**: Google Maps API
- **Notifications**: SMS, Email, WhatsApp

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rumble-cars
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rumble_cars"
   NEXTAUTH_SECRET="your-secret-key"
   RAZORPAY_KEY_ID="your-razorpay-key"
   RAZORPAY_KEY_SECRET="your-razorpay-secret"
   # Add other environment variables
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:3000`

## 🗂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (customer)/        # Customer portal
│   ├── (staff)/           # Staff dashboard
│   ├── (admin)/           # Admin panel
│   ├── (host)/            # Host portal
│   ├── api/               # API routes
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── layouts/           # Layout components
├── lib/                   # Core libraries
│   └── prisma.ts          # Database client
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
│   ├── auth.ts            # Authentication utilities
│   └── pricing.ts         # Pricing calculations
└── hooks/                 # Custom React hooks
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
- JWT-based authentication with refresh tokens
- Role hierarchy: Admin > Staff > Host > Customer
- Permission-based route protection
- API middleware for request validation

### OTP Flow
1. User enters phone number
2. OTP sent via SMS
3. Verification creates account
4. JWT token issued

## 💳 Payment Integration

### Razorpay Setup
- Order creation with webhook verification
- Payment status tracking
- Refund processing
- Subscription management

### Pricing Engine
- Base hourly/daily rates
- Dynamic demand multipliers
- Weekend/holiday pricing
- Subscription discounts
- Tax calculations (GST)

## 🚙 Vehicle Management

### Fleet Operations
- Real-time availability tracking
- Calendar blocking for maintenance
- Document expiry monitoring
- Utilization reporting

### Device Integration
- BLE/OBD device support
- Remote lock/unlock commands
- Telematics data collection
- Geofencing for pickup/return

## 📱 Mobile-First Design

- Responsive design for all screen sizes
- Touch-friendly interfaces
- Progressive Web App (PWA) support
- Offline capability for key features

## 🔧 API Endpoints

### Public APIs
- `GET /api/vehicles/search` - Search available vehicles
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Protected APIs
- `POST /api/bookings/hold` - Create booking hold
- `POST /api/bookings/:id/confirm` - Confirm booking
- `POST /api/payments/webhook` - Payment webhooks

### Admin APIs
- `POST /api/admin/vehicles` - Add vehicle
- `GET /api/admin/reports` - Generate reports
- `POST /api/admin/pricing` - Update pricing rules

## 🎨 UI Components

Built with Tailwind CSS and custom components:
- `Button` - Multi-variant button component
- `Input` - Form input with validation
- `Card` - Content containers
- `Modal` - Overlay dialogs
- `Table` - Data tables with sorting

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support
```bash
docker build -t rumble-cars .
docker run -p 3000:3000 rumble-cars
```

### Environment Variables
Ensure all production environment variables are set:
- Database connections
- API keys (Razorpay, SMS, Maps)
- File storage credentials
- Security secrets

## 🔒 Security

- JWT token encryption
- Rate limiting on APIs
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- SQL injection prevention

## 📊 Monitoring

- Application performance monitoring
- Error tracking and logging
- Analytics integration
- Health check endpoints
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@rumblecars.com
- Phone: 1800-RUMBLE
- Documentation: https://docs.rumblecars.com

## 🗺 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered pricing
- [ ] IoT device integration
- [ ] Blockchain-based loyalty program

---

Built with ❤️ for the Indian mobility market
