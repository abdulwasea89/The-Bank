# SecureBank - Banking Application Frontend

A modern, secure banking application built with Next.js, featuring account management, transfers, and transaction tracking.

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Account Management**: Create and manage multiple bank accounts
- **Money Transfers**: Transfer funds between accounts with validation
- **Transaction History**: View detailed transaction history with filtering
- **Dashboard Analytics**: Visual charts and cards showing account balances and activity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand, TanStack Query
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Tabler Icons
- **Backend**: FastAPI (separate repository)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see backend repository)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
BACKEND_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

This frontend requires a FastAPI backend. See the backend repository for setup instructions.

## Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials.
2. **Dashboard**: View account balances, recent transactions, and analytics.
3. **Create Account**: Add new bank accounts through the sidebar.
4. **Select Account**: Use the sidebar selector to filter data by account.
5. **Transfer Money**: Initiate transfers between accounts.
6. **View Transactions**: Browse transaction history with filtering options.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (proxy to backend)
│   ├── dashboard/         # Dashboard page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── providers/        # Context providers
│   └── *.tsx             # Feature components
├── lib/                  # Utilities and stores
├── hooks/                # Custom hooks
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
