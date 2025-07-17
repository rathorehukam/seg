# 🎓 EduVerse - Multi-Tenant University Management System (UMS) SaaS

A comprehensive, modern, and scalable School/University Management System built as a multi-tenant SaaS platform. EduVerse empowers educational institutions with all the tools they need to streamline their academic and administrative operations.

![EduVerse Logo](https://via.placeholder.com/800x200/0ea5e9/ffffff?text=EduVerse+-+University+Management+System)

## ✨ Features

### 🏢 **Super Admin Dashboard**
- **Institution Management**: Add, edit, and manage multiple institutions
- **Subscription Management**: Handle different pricing tiers (Basic, Pro, Enterprise)
- **Global Analytics**: Platform-wide statistics and performance metrics
- **System Monitoring**: Real-time health checks and usage analytics

### 🏛️ **Institution Admin Dashboard**
- **User Management**: Comprehensive student and faculty management
- **Course Management**: Create courses, assign faculty, manage academic calendar
- **Fee Management**: Set fee structures, track payments, automated billing
- **Reporting**: Generate detailed reports on attendance, grades, finances
- **Communication**: Institution-wide announcements and notifications

### 👩‍🏫 **Faculty Dashboard**
- **Course Teaching**: Manage assigned courses and student enrollments
- **Attendance Management**: Digital attendance marking with real-time sync
- **Grade Management**: Enter and track student grades across different exam types
- **Material Upload**: Share course materials, assignments, and resources
- **Student Communication**: Handle student queries and messages

### 🎓 **Student Dashboard**
- **Course Overview**: View enrolled courses, schedules, and instructors
- **Attendance Tracking**: Real-time attendance percentage and history
- **Grade Monitoring**: Track grades, CGPA, and academic performance
- **Fee Management**: View fee status, make online payments
- **Announcements**: Receive important updates from faculty and administration

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management
- **Zustand** - Client state management

### **Backend & Database**
- **Next.js API Routes** - Serverless backend functions
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Primary database with multi-tenant schema
- **Redis** - Caching and session management

### **Authentication & Security**
- **Auth0** - Multi-tenant authentication
- **Role-based Access Control** - Granular permissions system
- **Data Isolation** - Complete tenant data separation

### **Integrations**
- **Stripe/Razorpay** - Payment processing
- **SendGrid** - Email notifications
- **Twilio** - SMS notifications
- **Cloudinary** - File and image management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- Redis 6+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/eduverse-ums.git
   cd eduverse-ums
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Demo Credentials

Use these credentials to explore different user roles:

| Role | Email | Password |
|------|--------|----------|
| Super Admin | admin@eduverse.com | admin123 |
| Institution Admin | principal@school.edu | principal123 |
| Faculty | faculty@school.edu | faculty123 |
| Student | student@school.edu | student123 |

## 📋 Multi-Tenant Architecture

### **Schema-Per-Tenant**
- Each institution gets isolated database schemas
- Complete data separation and security
- Scalable performance per tenant

### **Custom Domains**
- Each institution can have custom subdomains
- Branded experience: `university.eduverse.com`
- White-label support with custom logos and colors

### **Subscription Management**
- Flexible pricing tiers with feature restrictions
- Automated billing and subscription handling
- Usage-based scaling

## 🔧 Configuration

### **Database Setup**
```sql
-- Create database
CREATE DATABASE eduverse;

-- Create user
CREATE USER eduverse_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eduverse TO eduverse_user;
```

### **Environment Variables**
Key environment variables to configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/eduverse"
AUTH0_SECRET="your-auth0-secret"
AUTH0_BASE_URL="http://localhost:3000"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

## 🎯 Key Features in Detail

### **Student Management**
- Bulk import via CSV
- Comprehensive profiles with photos
- Academic history tracking
- Parent/guardian information
- Automated ID generation

### **Course Management**
- Flexible course creation
- Faculty assignment
- Timetable management
- Credit system
- Prerequisites handling

### **Attendance System**
- Digital attendance marking
- Real-time synchronization
- Attendance analytics
- Automated reports
- Parent notifications

### **Fee Management**
- Flexible fee structures
- Multiple payment methods
- Automated reminders
- Payment tracking
- Receipt generation

### **Communication**
- Role-based announcements
- Email/SMS notifications
- In-app messaging
- Event calendar
- Emergency alerts

## 📊 API Documentation

### **Authentication**
```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Get current user
GET /api/auth/me
Authorization: Bearer <token>
```

### **Student Management**
```javascript
// Get students
GET /api/students?page=1&limit=10&search=john

// Create student
POST /api/students
{
  "name": "John Doe",
  "email": "john@example.com",
  "semester": 1,
  "department": "Computer Science"
}
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📈 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Docker**
```bash
# Build image
docker build -t eduverse .

# Run container
docker run -p 3000:3000 eduverse
```

### **Database Migration**
```bash
# Production migration
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@eduverse.com
- 📖 Documentation: [docs.eduverse.com](https://docs.eduverse.com)
- 💬 Discord: [Join our community](https://discord.gg/eduverse)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/eduverse-ums/issues)

## 🗺️ Roadmap

### **Q1 2024**
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with Google Classroom
- [ ] Automated timetable generation

### **Q2 2024**
- [ ] Library management system
- [ ] Hostel management
- [ ] Transport management
- [ ] Alumni portal

### **Q3 2024**
- [ ] AI-powered insights
- [ ] Chatbot integration
- [ ] Advanced reporting
- [ ] API marketplace

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://radix-ui.com/) - Low-level UI primitives
- [Auth0](https://auth0.com/) - Identity platform
- [Stripe](https://stripe.com/) - Payment processing

---

**Built with ❤️ for educational institutions worldwide**

*EduVerse - Transforming Education Through Technology*