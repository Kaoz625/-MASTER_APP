# 🎯 MASTER APP

**Universal App Foundation with Authentication, Payments, and Multi-Platform Support**

---

## 📋 Project Overview

MASTER_APP is a comprehensive, production-ready mobile/web application foundation that serves as a reusable template for all future apps. Built for maximum flexibility across 10+ platforms with age-based customization for users aged 2 to 50+.

---

## 🌟 Key Features

### **Authentication (All Methods)**
- ✅ Google OAuth
- ✅ Apple Sign In
- ✅ Email/Password
- ✅ Phone Number (SMS verification)
- ✅ PIN Code (quick login)
- ✅ Biometrics (Touch ID / Face ID)
- ✅ Parent-child linking (ages 2-12)

### **Age-Based Customization (5 Groups)**
- 🧒 **2-5 Years** (Kids): Voice navigation, parent controls, extra-large touch targets
- 👦 **5-12 Years** (Children): Guided experience, simple signup, educational
- 🧑 **12-18 Years** (Teens): Social features, privacy controls, modern UI
- 👨 **18-50 Years** (Adults): Full features, professional design
- 👴 **50+ Years** (Seniors): High contrast, simplified navigation, larger text

### **Monetization**
- 💳 User-to-User Payments (Stripe Connect)
- 📦 Subscription Model (Stripe/Paddle/Apple IAP/Google Play Billing)
- 🔗 Affiliate Tracking (referral codes)
- 💰 Platform Fee (5% on transactions)

### **Real-Time Features**
- 🗺️ **Maps Tab**: GPS location tracking with age-appropriate privacy controls
- 🎤 **Voice Navigation**: Built-in voice commands for all users
- 🔔 **Push Notifications**: Real-time updates and alerts

### **Admin Features**
- 🛡️ **Admin Dashboard**: User management, analytics, configuration
- 🔒 **Hidden Admin Panel**: Only visible to admin users
- 📊 **Analytics**: User activity, payment tracking, referral metrics

### **Platform Support**

| Platform | Technology | Status |
|----------|-----------|--------|
| **Web PWA** | Flutter | ✅ Primary |
| **Android** | Flutter | ✅ Primary |
| **iOS** | Native Swift | ✅ Planned |
| **iPadOS** | Native Swift | ✅ Planned |
| **macOS** | Native Swift | ✅ Planned |
| **watchOS** | Native Swift | ✅ Planned |
| **tvOS** | Native Swift | ✅ Planned |
| **visionOS** | Native Swift | ✅ Planned |
| **React Native + Expo** | React Native | ✅ Backup |
| **Ionic + Capacitor** | Ionic | ✅ Backup |

---

## 🚀 Quick Start

### **Prerequisites**

1. **Node.js** v25+ installed
2. **Xcode** 26.2 installed (macOS only)
3. **Flutter** 3.19+ installed
4. **PostgreSQL** 16+ installed
5. **Firebase** project configured
6. **Supabase** project configured (backup)
7. **Stripe** account configured

### **Installation**

```bash
# Clone repository
git clone https://github.com/Kaoz625/MASTER_APP.git
cd MASTER_APP

# Install backend dependencies
cd backend
npm install

# Install Flutter dependencies
cd ../web-pwa/flutter-web
flutter pub get

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Run database migrations
cd backend
npm run migrate

# Seed initial data (admin account, age groups)
npm run seed

# Start backend server
cd backend
npm start

# In another terminal, start Web PWA
cd web-pwa/flutter-web
flutter run -d chrome
```

### **Access the App**

- **Backend API**: http://localhost:3000
- **Web PWA**: http://localhost:5000
- **API Documentation**: http://localhost:3000/api/docs
- **Admin Dashboard**: http://localhost:3000/admin (requires admin login)

---

## 📁 Project Structure

```
MASTER_APP/
├── backend/              # Node.js Backend API
├── design-system/         # Universal Design System (5 age groups)
├── web-pwa/             # Flutter Web PWA
├── ios-native/            # Native Swift iOS App
├── ipados-native/          # Native Swift iPadOS App
├── macos-native/          # Native Swift macOS App
├── watchos-native/         # Native Swift watchOS App
├── tvos-native/           # Native Swift tvOS App
├── visionos-native/        # Native Swift visionOS App
├── scripts/               # Automation scripts
├── documentation/          # Comprehensive documentation
└── README.md
```

---

## 🔐 Authentication Flow

```
1. Age Selection → Choose age group (2-5, 5-12, 12-18, 18-50, 50+)
2. Auth Options → Google/Apple/Email/Phone (age-appropriate)
3. Quick Login → PIN or Biometrics (optional, available to ages 12+)
4. Main App → "OH YEA WE DID IT BABY" with 6 tabs
5. Maps Tab → Real-time location tracking
6. Voice Nav → Microphone button on every screen
```

---

## 👨 Parent-Child System

**For Ages 2-12**:
- Parents can create linked child accounts
- Parent approval required for purchases
- Parents can view child's activity
- Parents can unlock child's locked account
- Parents can set daily time limits

---

## 💰 Monetization

### **User-to-User Payments**
- Platform fee: 5% on all transactions
- Stripe Connect integration
- Instant transfers between users

### **Subscription Tiers**
- **Free**: Basic features, ads (optional)
- **Premium** ($4.99/month): Full features, no ads
- **Lifetime** ($99.99): One-time payment, all features forever

### **Affiliate Program**
- Referral code for every user
- Earn 10% on referred user's purchases
- Link sharing support

---

## 🔧 Configuration

### **Environment Variables** (backend/.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/master_app
DATABASE_POOL_MAX=10

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=base64-encoded-key
FIREBASE_API_KEY=your-api-key

# Supabase (backup)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whs_your-webhook-secret
PLATFORM_FEE_PERCENTAGE=5

# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Twilio or Firebase Phone Auth)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# JWT (Session Tokens)
JWT_SECRET=your-super-secret-key
JWT_EXPIRE_IN=30m

# Session Timeout
SESSION_MAX_IDLE_TIME=30
SESSION_ABSOLUTE_TIMEOUT=24

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_ATTEMPTS=5

# Admin
ADMIN_EMAIL=admin@masterapp.com
ADMIN_BACKUP_EMAIL=NYCTailblazers@gmail.com
ADMIN_PHONE=+13472608305
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Flutter tests
cd web-pwa/flutter-web
flutter test

# Integration tests
cd backend
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📚️ Documentation

- [Quick Start Guide](documentation/QUICK_START.md)
- [Architecture](documentation/ARCHITECTURE.md)
- [API Documentation](documentation/api/API_OVERVIEW.md)
- [Swift Tutorials](documentation/tutorials/SWIFT_BASICS.md)
- [Deployment Guides](documentation/deployment/WEB_DEPLOYMENT.md)

---

## 🤝 Contributing

This is a reusable foundation template. For contributing:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Others can use this code freely
- ✅ Others can modify and sell apps built from this template
- ✅ You retain copyright and credit
- ✅ No liability for any issues

---

## 📞 Support

For support, questions, or issues:
- Create an issue in GitHub
- Email: support@masterapp.com (future)
- Documentation: See [documentation/](documentation/)

---

## 🎉 Built With Love

**By: Markus Schecher (Kaoz625)**
**For: Universal app foundation**
**Goal: Build once, modify many times, monetize code itself**

*"OH YEA WE DID IT BABY"*
