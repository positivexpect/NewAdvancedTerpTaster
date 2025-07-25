# 🌿 TerpTaster - Cannabis Review Platform

A comprehensive cannabis strain review application with photo upload, terpene analysis, and detailed scoring system.

## ✨ Features

### 🔥 **New in v2.0**

- **📸 Photo Upload**: Upload up to 5 photos per review with automatic optimization
- **🔍 Enhanced Search**: Search by strain, location, reviewer, terpenes, and score range
- **📊 Analytics**: View stats, top strains, popular terpenes, and trends
- **⚡ Performance**: Optimized with compression, caching, and security headers
- **🗄️ Neon PostgreSQL**: Modern serverless database with automatic scaling
- **🚀 Vercel Ready**: Configured for easy deployment

### 📋 Core Features

- **Basic Reviews**: Quick strain reviews with essential info
- **Master Reviews**: Detailed reviews with terpene profiles, effects, and scoring
- **Terpene Training**: Learn about terpene profiles and effects
- **Quick Scoring**: Fast rating system for experienced users
- **Search & Filter**: Find reviews by multiple criteria

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### 1. Clone and Install

```bash
git clone <your-repo>
cd terptaster

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Database Setup

Your Neon PostgreSQL database is already configured! The schema is automatically created.

### 3. Environment Setup

```bash
# Backend environment (already configured)
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend environment
cd ../frontend
cp .env.example .env
# Set REACT_APP_API_BASE_URL if needed
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend (API server)
cd backend
npm run dev    # Runs on http://localhost:3001

# Terminal 2: Frontend (React app)
cd frontend
npm start      # Runs on http://localhost:3000
```

## 📱 Usage

1. **Quick Review**: Simple strain review with photo upload
2. **Master Review**: Comprehensive review with terpene analysis
3. **Search**: Find reviews using enhanced search filters
4. **Analytics**: View platform statistics and trends

## 🛠️ Tech Stack

### Frontend

- **React 18** with Hooks
- **Tailwind CSS** for styling
- **Material-UI** components
- **React Router** for navigation
- **React Dropzone** for photo uploads

### Backend

- **Node.js** with Express
- **PostgreSQL** (Neon serverless)
- **Multer + Sharp** for image processing
- **Helmet** for security
- **Compression** for performance

### Database

- **Neon PostgreSQL** - Serverless, auto-scaling
- **Connection pooling** for optimal performance
- **Full-text search** with GIN indexes
- **JSON/Array support** for terpene data

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Vercel

```bash
# Deploy backend
cd backend
npx vercel --prod

# Deploy frontend
cd frontend
npx vercel --prod
```

## 📊 API Endpoints

### Reviews

- `GET /reviews` - Get all reviews
- `POST /reviews` - Create master review
- `POST /basic-reviews` - Create basic review
- `GET /reviews/:id` - Get specific review
- `DELETE /reviews/:id` - Delete review

### Search & Analytics

- `GET /search?strain=&location=&reviewer=&terpene=` - Enhanced search
- `GET /stats` - Platform statistics
- `GET /terpenes/popular` - Popular terpenes analysis

### Media

- `POST /upload` - Upload photos (max 5, 5MB each)
- `GET /uploads/:filename` - Serve uploaded images

## 🔧 Configuration

### Environment Variables

**Backend:**

```env
POSTGRES_USER=neondb_owner
POSTGRES_HOST=your-neon-host
POSTGRES_DB=neondb
POSTGRES_PASSWORD=your-password
POSTGRES_PORT=5432
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

**Frontend:**

```env
REACT_APP_API_BASE_URL=https://your-backend.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Neon** for serverless PostgreSQL
- **Vercel** for deployment platform
- **Cannabis community** for inspiration and feedback

---

**Built with ❤️ for the cannabis community** 🌱
