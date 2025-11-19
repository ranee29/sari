# 🛒 Sari Grocery Reservation System

A complete mobile-first e-commerce reservation system built with Next.js 14, Supabase, and modern web technologies.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd sari

# Copy environment variables
cp .env.local.example .env.local

# Update your Supabase credentials in .env.local

# Start with Docker
docker-compose up -d

# Or start locally
npm install
npm run dev
```

## 📱 Features

### Customer Experience
- 📱 **Mobile-first design** - Optimized for phones and tablets
- 🔍 **Product browsing** - Search, filter, and categorize products
- 🛒 **Shopping cart** - Add items with real-time stock validation
- 📋 **Order placement** - Create regular orders and pre-orders
- 📦 **Order tracking** - Track order status in real-time
- 👤 **User accounts** - Secure authentication and profile management

### Admin Dashboard
- 📊 **Dashboard analytics** - Sales, orders, and inventory insights
- 📦 **Product management** - Add, edit, and manage inventory
- 📋 **Order management** - Process orders and update status
- 📈 **Real-time updates** - Live stock and order monitoring
- 🎨 **Mobile-friendly admin** - Works perfectly on all devices

### Technical Features
- 🔐 **Secure authentication** - JWT-based auth with role management
- 📊 **Real-time sync** - Live stock updates using Supabase channels
- 🎯 **Form validation** - React Hook Form + Zod schemas
- 🎨 **Custom UI** - Beautiful components with Tailwind CSS
- 🐳 **Docker support** - Containerized development environment
- 📱 **Responsive design** - Mobile-first approach throughout

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS with custom color palette
- React Hook Form + Zod validation
- Radix UI components
- Lucide React icons

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Next.js API routes
- Row Level Security (RLS)

**DevOps:**
- Docker & Docker Compose
- ESLint + Prettier
- TypeScript strict mode

## 🎨 Design System

**Brand Colors:**
- Primary (Green): `#23CE6B`
- Accent (Purple): `#A846A0`
- Background: `#F6F8FF`
- Text Primary: `#272D2D`
- Text Secondary: `#50514F`

**Components:**
- Mobile-first responsive design
- Custom button variants (primary, accent, secondary, outline)
- Form inputs with validation
- Toast notifications
- Loading states
- Mobile bottom navigation

## 📁 Project Structure

```
sari/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   │   ├── admin/         # Admin routes
│   │   └── customer/      # Customer routes
│   ├── products/          # Product pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/
│   ├── supabase/         # Supabase client and config
│   ├── auth/             # Authentication helpers
│   ├── utils/            # Utility functions
│   └── validators/       # Form validation schemas
├── styles/
│   └── globals.css       # Global styles with Tailwind
├── public/               # Static assets
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Production container
└── README.md
```

## 🗄️ Database Schema

The system uses a comprehensive database schema with:

- **Users** - Customer and admin accounts with roles
- **Product Types** - Categories for organizing products
- **Products** - Product catalog with inventory tracking
- **Orders** - Customer orders with status tracking
- **Order Items** - Line items for orders
- **Pre-orders** - Reservation system for future pickups
- **Pre-order Items** - Line items for pre-orders
- **Inventory Transactions** - Audit trail for stock changes

## 🔐 Security Features

- **Row Level Security (RLS)** on all tables
- **JWT-based authentication** with Supabase Auth
- **Role-based access control** (customer/admin)
- **Input validation** with Zod schemas
- **SQL injection protection** through parameterized queries
- **XSS protection** with proper data sanitization

## 🛠️ Development

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret

# App Configuration
NEXT_PUBLIC_APP_NAME=Sari Grocery Reservation
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 Mobile Features

- **Bottom navigation bar** for easy thumb access
- **Touch-friendly buttons** with proper sizing
- **Swipe gestures** for navigation
- **Progressive enhancement** - Works on any device
- **Fast loading** with optimized assets
- **Offline support** with service workers (planned)

## 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (Recommended for Next.js)
- **AWS Amplify**
- **Netlify**
- **Docker containers**
- **VPS with Docker Compose**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

For support, please contact support@sari-grocery.com or create an issue in the repository.