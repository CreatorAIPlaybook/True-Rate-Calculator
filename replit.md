# Deal Margin Simulator

## Overview

A single-page React application designed for solopreneurs to calculate whether fixed-price sponsorship deals are actually profitable. The app functions as a financial calculator that factors in taxes, expenses, time investment, and revisions to determine effective hourly rates and deal viability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local form state
- **Styling**: Tailwind CSS with a custom FinTech design system
- **Component Library**: shadcn/ui components (Radix UI primitives + custom styling)
- **Icons**: Lucide React

### Design System
The application follows a "Clean FinTech" aesthetic:
- Background: Soft gray (slate-50), never pure white or dark mode
- Cards: White with rounded corners, subtle shadows, slate borders
- Primary action color: Blue-600
- Typography: System sans-serif (Inter style)
- Result states: Green for approved deals, Red for rejected deals

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES Modules)
- **Build Tool**: esbuild for server bundling, Vite for client
- **Development**: tsx for TypeScript execution

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Current Implementation**: In-memory storage (MemStorage class) as fallback
- **Database Config**: Requires DATABASE_URL environment variable for PostgreSQL

### Project Structure
```
├── client/           # Frontend React application
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── pages/          # Route pages (home, not-found)
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage interface
│   └── static.ts     # Static file serving
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations (Drizzle)
```

### Core Calculator Logic
The deal margin calculation involves:
1. **Inputs**: Deal amount, estimated hours, revisions (each adds 2 hours), expenses, tax rate
2. **Standards**: Minimum hourly floor (default $100/hr)
3. **Calculations**: Net Revenue = Deal Amount - Expenses - (Deal Amount × Tax Rate / 100)
4. **Modes**: "Quick Check" (basic) vs "Deep Dive" (includes software subscriptions, agency fees)

## External Dependencies

### Frontend Libraries
- React 18 with React DOM
- @tanstack/react-query for data fetching
- Radix UI primitives (full suite: dialog, popover, select, slider, etc.)
- class-variance-authority for component variants
- date-fns for date formatting
- embla-carousel-react for carousels
- react-day-picker for calendar components
- recharts for charts
- vaul for drawer components
- wouter for routing
- zod for validation

### Backend Libraries
- Express.js for HTTP server
- Drizzle ORM with drizzle-zod for database operations
- connect-pg-simple for session storage
- express-session for session management

### Build Tools
- Vite with React plugin
- esbuild for server bundling
- TypeScript
- PostCSS with Tailwind CSS and Autoprefixer

### Replit-Specific
- @replit/vite-plugin-runtime-error-modal
- @replit/vite-plugin-cartographer (dev only)
- @replit/vite-plugin-dev-banner (dev only)