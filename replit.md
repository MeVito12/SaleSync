# replit.md

## Overview

This is a full-stack web application built with React, TypeScript, and Express.js. It appears to be a comprehensive business management system focused on sales, client management, and financial operations, likely for a B2B sales representative or distributor environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for authentication, React Query for server state
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Supabase Auth with role-based access control
- **API Pattern**: RESTful API with `/api` prefix

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend application
- `shared/` - Shared TypeScript types and schemas
- `migrations/` - Database migration files

## Key Components

### Authentication System
- Supabase authentication with JWT tokens
- Role-based access control (master, admin, representante)
- Protected routes with automatic redirects
- Session management with automatic cleanup

### Database Schema
- **Users**: Basic user authentication via Supabase
- **Profiles**: Extended user information linked to Supabase users
- **Clients**: Customer management with company details
- **Industries**: Manufacturing/supplier companies
- **Products**: Product catalog with pricing and commission rules
- **Sales**: Sales orders with product line items
- **Commission Rules**: Configurable commission structures
- **Payment Methods**: Payment terms and conditions
- **Receivables**: Payment tracking and reconciliation

### Business Logic
- **Sales Management**: Complete sales order processing from quote to invoice
- **Commission Calculation**: Automated commission calculations based on configurable rules
- **Product Cart**: Shopping cart functionality for building sales orders
- **Financial Tracking**: Payment method management and receivables tracking
- **Inventory Management**: Product catalog with category and industry relationships

## Data Flow

1. **User Authentication**: Supabase handles authentication, user profile stored in database
2. **Sales Process**: 
   - Representative selects client and industry
   - Adds products to cart with automatic commission calculation
   - Saves sale with line items to database
   - Can generate invoices and track payments
3. **Commission Flow**: Rules engine calculates commissions based on representative, industry, and category
4. **Financial Flow**: Tracks receivables, payment methods, and commission payouts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection to Neon PostgreSQL
- **@supabase/supabase-js**: Authentication and additional database operations
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Data visualization
- **sonner**: Toast notifications

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for running TypeScript server with hot reload
- Drizzle Kit for database migrations
- Replit-specific plugins for development environment

### Production Build
- Vite builds frontend to `dist/public`
- esbuild bundles server to `dist/index.js`
- Static file serving through Express
- Database migrations run via `drizzle-kit push`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string for Neon
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `NODE_ENV`: Environment setting

### Key Features
- Server-side rendering preparation with Vite SSR setup
- Error handling middleware
- Request logging and monitoring
- CORS configuration for API endpoints
- Session management with PostgreSQL session store