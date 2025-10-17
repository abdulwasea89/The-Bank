# SecureBank Frontend - Technical Documentation

This document provides a comprehensive explanation of the codebase, including APIs, components, state management, and application flow.

## Architecture Overview

The application is built with Next.js 15 using the App Router, TypeScript, and follows a component-based architecture with custom hooks and providers for state management.

### Key Technologies

- **Next.js 15**: React framework with App Router for routing and API routes
- **React 19**: UI library with hooks and concurrent features
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Zustand**: Lightweight state management
- **TanStack Query**: Data fetching and caching
- **Zod**: Schema validation for forms and API responses
- **FastAPI Backend**: Separate Python backend for business logic

## Project Structure

```
frontend/
├── app/
│   ├── api/               # Next.js API routes (proxy layer)
│   │   ├── accounts/      # Account-related endpoints
│   │   │   ├── route.ts   # GET/POST accounts
│   │   │   ├── transactions/
│   │   │   │   └── route.ts # GET transactions
│   │   │   └── transfer/
│   │   │       └── route.ts # POST transfers
│   │   └── auth/          # Authentication endpoints
│   │       ├── login/
│   │       ├── me/
│   │       └── signup/
│   ├── dashboard/
│   │   └── page.tsx       # Main dashboard component
│   ├── favicon.ico
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page (redirects to dashboard)
├── components/
│   ├── providers/
│   │   ├── auth-provider.tsx    # Authentication context
│   │   ├── theme-provider.tsx   # Theme context
│   │   └── providers.tsx        # Combined providers wrapper
│   ├── ui/                # shadcn/ui components
│   ├── app-sidebar.tsx     # Main sidebar component
│   ├── auth-modal.tsx      # Login/signup modal
│   ├── create-account-modal.tsx # Account creation modal
│   ├── data-table.tsx      # Transaction history table
│   ├── nav-main.tsx        # Sidebar navigation
│   ├── section-cards.tsx   # Dashboard metric cards
│   ├── transfer-modal.tsx  # Money transfer modal
│   └── chart-area-interactive.tsx # Transaction chart
├── lib/
│   ├── store.ts          # Zustand store (currently minimal)
│   └── utils.ts          # Utility functions
├── hooks/                # Custom hooks (currently empty)
└── public/               # Static assets
```

## API Layer

The frontend uses Next.js API routes as a proxy layer to the FastAPI backend. This provides:

- Centralized request handling
- Authentication token management
- Response transformation
- Error handling

### Authentication APIs

#### POST `/api/auth/login`
- **Purpose**: Authenticate user and receive JWT token
- **Body**: `{ email: string, password: string }`
- **Response**: `{ access_token: string }`
- **Implementation**: Proxies to `BACKEND_URL/auth/login`
- **Token Storage**: Stores token in localStorage

#### POST `/api/auth/signup`
- **Purpose**: Register new user
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: User data + token
- **Implementation**: Proxies to `BACKEND_URL/auth/signup`

#### GET `/api/auth/me`
- **Purpose**: Get current user information
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ id: number, email: string, full_name: string }`
- **Implementation**: Proxies to `BACKEND_URL/auth/me`

### Account APIs

#### GET `/api/accounts`
- **Purpose**: Fetch user's accounts
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of accounts with transformed data
- **Transformation**: Converts balance strings to numbers
- **Implementation**: Proxies to `BACKEND_URL/accounts/`

#### POST `/api/accounts`
- **Purpose**: Create new account
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ account_name: string, initial_deposit: number }`
- **Response**: Created account data
- **Implementation**: Proxies to `BACKEND_URL/accounts/`

#### GET `/api/accounts/transactions`
- **Purpose**: Fetch transactions for account
- **Query Params**: `account_number` (optional)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of transactions with transformed data
- **Transformation**: Maps backend fields to frontend (transfer_id → id, etc.)
- **Implementation**: Proxies to `BACKEND_URL/accounts/transactions`

#### POST `/api/accounts/transfer`
- **Purpose**: Initiate money transfer
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ from_account_number, to_account_number, amount, description, idempotency_key }`
- **Response**: Transfer confirmation
- **Implementation**: Proxies to `BACKEND_URL/accounts/transfer`

## State Management

### Authentication Provider (`auth-provider.tsx`)
- **Context**: `AuthContext` with user state and auth functions
- **State**: `user`, `isLoading`
- **Functions**:
  - `login(email, password)`: Authenticates and sets user
  - `signup(name, email, password)`: Registers and logs in user
  - `logout()`: Clears token and user state
- **Initialization**: Checks token on mount, fetches user data

### TanStack Query
- **Purpose**: Data fetching, caching, and synchronization
- **Usage**: For accounts and transactions data
- **Configuration**: Default query client in `providers.tsx`

### Zustand Store (`store.ts`)
- **Purpose**: Global state for accounts and transactions
- **State**: `accounts`, `transactions`
- **Actions**: `setAccounts`, `setTransactions`, `addAccount`, `addTransaction`
- **Note**: Currently underutilized, data managed via React state in dashboard

## Components

### Layout and Providers

#### `layout.tsx`
- Root layout with HTML structure
- Includes favicon, fonts (Inter), and providers
- Responsive meta tags

#### `providers.tsx`
- Wraps app with theme, query client, and auth providers
- Ensures proper provider order

### Authentication

#### `auth-modal.tsx`
- **Purpose**: Login and signup interface
- **State**: Form data for login/signup
- **Validation**: Zod schemas for email/password validation
- **Flow**: Tabs for login/signup, redirects to dashboard on success
- **Integration**: Uses auth provider for authentication

### Dashboard Components

#### `dashboard/page.tsx`
- **Purpose**: Main application page
- **State**: `accounts`, `transactions`, `selectedAccount`, modals
- **Effects**: Fetches data on mount and account changes
- **Functions**:
  - `fetchAccounts()`: Loads user accounts
  - `fetchTransactions()`: Loads transactions for selected account
  - `handleTransfer()`: Processes money transfers
- **Rendering**: Sidebar, header, cards, chart, table

#### `section-cards.tsx`
- **Purpose**: Dashboard metric cards
- **Props**: `accounts`, `transactions`, `selectedAccount`, `isLoading`
- **Logic**: Calculates totals based on selected account
- **Cards**: Total balance, account count, recent transactions, average balance

#### `chart-area-interactive.tsx`
- **Purpose**: Transaction visualization
- **Props**: `transactions`
- **Implementation**: Recharts for interactive charts

#### `data-table.tsx`
- **Purpose**: Transaction history display
- **Props**: `data`, `isLoading`
- **Features**: Sortable table with loading states
- **Note**: No longer has account selector, filtered by global selection

### Sidebar Components

#### `app-sidebar.tsx`
- **Purpose**: Main navigation sidebar
- **Props**: `onCreateAccount`, `accounts`, `selectedAccount`, `onAccountChange`
- **Structure**: Header, navigation, footer with user info
- **Integration**: Passes props to child components

#### `nav-main.tsx`
- **Purpose**: Sidebar navigation items
- **Props**: `items`, `onCreateAccount`, `accounts`, `selectedAccount`, `onAccountChange`
- **Features**:
  - Account selector (when accounts exist)
  - Create account button with modal
  - Navigation menu items
- **State**: Modal open/close state

### Modals

#### `create-account-modal.tsx`
- **Purpose**: Account creation form
- **State**: Form data (`account_name`, `account_type`, `initial_balance`)
- **Validation**: Zod schema for required fields and balance validation
- **API**: Calls `/api/accounts` POST
- **Callbacks**: `onAccountCreated` to refresh data

#### `transfer-modal.tsx`
- **Purpose**: Money transfer interface
- **State**: Form data, step (form/confirm)
- **Validation**: Zod schema for transfer fields
- **Steps**:
  1. Form: Select accounts, enter amount/description
  2. Confirm: Review and submit transfer
- **API**: Calls `/api/accounts/transfer` POST
- **Integration**: Uses account list from props

## Form Validation

All forms use Zod for client-side validation:

- **Login**: Email format, password length
- **Signup**: Name, email, password validation
- **Create Account**: Account name, type, positive balance
- **Transfer**: Account selection, positive amount, description

Validation errors are displayed via toast notifications.

## UI Components (shadcn/ui)

### Dialog
- Used for modals (auth, create account, transfer)
- Customized to remove animations for instant appearance

### Select
- Account selection in sidebar and transfer modal
- Consistent styling with primary colors

### Table
- Transaction history with loading states
- Responsive design with mobile considerations

### Button
- Various variants for actions
- Consistent sizing (h-11 for forms)

### Input/Label
- Form inputs with proper labeling
- Consistent styling and focus states

## Application Flow

1. **App Start**: `layout.tsx` loads providers
2. **Authentication Check**: `auth-provider.tsx` checks token, fetches user
3. **Dashboard Load**: If authenticated, load dashboard
4. **Data Fetching**: `dashboard/page.tsx` fetches accounts and transactions
5. **User Interaction**:
   - Select account in sidebar → Updates dashboard data
   - Create account → Opens modal → API call → Refresh data
   - Transfer money → Opens modal → Validation → API call → Refresh data
6. **Navigation**: Sidebar items (Dashboard, Support)

## Error Handling

- **API Errors**: Caught in fetch calls, displayed via toast
- **Validation Errors**: Zod validation with user-friendly messages
- **Authentication**: Redirects to login on token expiry
- **Loading States**: Skeletons and loading indicators throughout

## Performance Considerations

- **React 19**: Concurrent features for better performance
- **TanStack Query**: Caching and background refetching
- **Code Splitting**: Next.js automatic splitting
- **Image Optimization**: Next.js Image component (not used in this app)
- **Bundle Analysis**: Can be added with `@next/bundle-analyzer`

## Security

- **Token Storage**: JWT in localStorage (consider httpOnly cookies for production)
- **API Proxy**: All backend calls go through Next.js API routes
- **Input Validation**: Client and server-side validation
- **CORS**: Configured in backend (not shown)

## Testing

Currently no tests implemented. Recommended:
- Unit tests for components with Vitest
- E2E tests with Playwright
- API integration tests

## Deployment

- **Platform**: Vercel recommended for Next.js
- **Environment Variables**: Set `BACKEND_URL` in deployment
- **Build**: `npm run build`
- **Static Export**: Not suitable due to API routes

## Future Improvements

- Add error boundaries
- Implement proper loading states with Suspense
- Add unit and integration tests
- Implement real-time updates with WebSockets
- Add internationalization
- Improve accessibility (ARIA labels, keyboard navigation)
- Add PWA features (service worker, offline support)