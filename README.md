# 🏦 SecureBank - Modern Banking Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)

> A cutting-edge, full-stack banking application built with modern technologies. Experience secure, real-time financial management with an intuitive interface and robust backend architecture.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Rate limiting** to prevent abuse
- **Password hashing** with bcrypt
- **CORS protection** and input validation
- **Idempotent transfers** to prevent duplicate transactions

### 💳 Account Management
- **Multiple account support** per user
- **Real-time balance tracking** with decimal precision
- **Account creation** with initial deposits
- **Secure account numbering** system

### 💸 Money Transfers
- **Instant transfers** between accounts
- **Transaction history** with detailed records
- **Transfer validation** (insufficient funds, same account checks)
- **Descriptive transactions** for better tracking

### 📊 Dashboard & Analytics
- **Interactive charts** showing transaction trends
- **Real-time metrics** (total balance, account count, recent activity)
- **Responsive data tables** with sorting capabilities
- **Dark/Light theme** support

### 🎨 Modern UI/UX
- **shadcn/ui components** for consistent design
- **Responsive design** that works on all devices
- **Loading states** and error handling
- **Toast notifications** for user feedback

## 🏗️ Architecture

```
SecureBank/
├── 🐍 backend/ (FastAPI)
│   ├── Authentication & Authorization
│   ├── Account Management
│   ├── Transfer Processing
│   └── Database Models (SQLAlchemy)
├── ⚛️ frontend/ (Next.js)
│   ├── Dashboard Interface
│   ├── API Proxy Layer
│   ├── State Management (Zustand + TanStack Query)
│   └── Component Library (shadcn/ui)
└── 🐘 database/ (PostgreSQL)
    ├── User Accounts
    ├── Financial Transactions
    └── Audit Logs
```

## 🚀 Tech Stack

### Backend
- **FastAPI** - High-performance async web framework
- **SQLAlchemy** - Modern ORM with async support
- **PostgreSQL** - Robust relational database
- **Alembic** - Database migration tool
- **Pydantic** - Data validation and serialization
- **JWT** - JSON Web Tokens for authentication

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data fetching

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Docker & Docker Compose** (optional)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/abdulwasea89/The-Bank.git
cd The-Bank
```

### 2. Backend Setup

#### Using Docker (Recommended)
```bash
cd banking\ app
docker-compose up -d
```

#### Manual Setup
```bash
cd banking\ app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Run database migrations
alembic upgrade head

# Start the server
uvicorn src.banking_app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add BACKEND_URL=http://localhost:8000

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 API Documentation

The backend provides comprehensive API documentation at `/docs` when running.

### Key Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Accounts
- `GET /accounts/` - List user accounts
- `POST /accounts/` - Create new account
- `GET /accounts/transactions` - Get transaction history
- `POST /accounts/transfer` - Transfer money

## 🎯 Usage

### First Time Setup
1. **Register** a new account or **login** with existing credentials
2. **Create your first account** with an initial deposit
3. **Explore the dashboard** to see your financial overview

### Managing Finances
1. **View balances** across all your accounts
2. **Transfer money** between accounts instantly
3. **Track transactions** with detailed history
4. **Analyze spending** with interactive charts

### Security Best Practices
- Use strong, unique passwords
- Enable two-factor authentication (future feature)
- Regularly monitor transaction history
- Log out when using public devices

## 🧪 Testing

### Backend Tests
```bash
cd banking\ app
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Deployment

#### Backend (Railway, Heroku, etc.)
```bash
# Set environment variables
export DATABASE_URL=postgresql://...
export SECRET_KEY=your-secret-key
export BACKEND_CORS_ORIGINS=https://yourdomain.com

# Deploy with your preferred platform
```

#### Frontend (Vercel, Netlify, etc.)
```bash
# Set environment variable
export BACKEND_URL=https://your-backend-url.com

# Deploy with your preferred platform
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** team for the amazing framework
- **shadcn** for the beautiful UI components
- **Vercel** for hosting inspiration
- **Open source community** for the tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/abdulwasea89/The-Bank/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abdulwasea89/The-Bank/discussions)
- **Email**: abdulwasea853@gmail.com

---

**Built with ❤️ by Abdul Wasea**

*Experience the future of banking today!* 🚀