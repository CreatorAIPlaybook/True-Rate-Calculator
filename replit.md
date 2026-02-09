# True Rate Calculator

## Overview

A single-page React application designed for solopreneurs to calculate whether fixed-price sponsorship deals are actually profitable. The app functions as a financial calculator that factors in taxes, expenses, time investment, and revisions to determine effective hourly rates and deal viability.

## Recent Changes
- Renamed app from "Deal Margin Simulator" to "True Rate Calculator"
- Header is now non-sticky (scrolls with page) for more screen space
- RESKIN: Applied "Udaller One" Obsidian Design System (dark theme)
  - Background: #0F1115, Cards: #161B22, Borders: white/10
  - Primary buttons: Gold #F4C430 with dark text, font-bold
  - Secondary buttons: border-white/20, text-white
  - Inputs: dark bg (#0F1115) with white/10 borders, white text
  - Typography: JetBrains Mono (font-mono) on all numbers/currency/percentages
  - Labels remain Inter (font-sans)
  - Green text for profit indicators only, gold for action buttons
  - Footer links hover to gold; Slider uses gold (primary) via CSS variables
- Added tooltips to all financial inputs (Expenses, Tax Rate, Software Subs, Agency Fees)
- Result badges (GREEN LIGHT/RED FLAG) no longer have hover effects
- localStorage key updated to "true-rate-calculator-state"
- Tooltips converted to click/tap popovers for mobile-friendly UX
- Tax Rate minimum changed to 0 (was 1)
- Placeholders for Deal Amount, Estimated Hours, Tax Rate updated to "0"
- Added legal disclaimer in footer above "Built by Udaller" links
- Footer is static (not sticky), only result bar is fixed at bottom

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local form state
- **Styling**: Tailwind CSS with "Udaller One" Obsidian Design System
- **Component Library**: shadcn/ui components (Radix UI primitives + custom styling)
- **Icons**: Lucide React

### Design System
The application follows the "Udaller One" Obsidian dark aesthetic:
- Background: #0F1115 (deep dark blue-gray)
- Cards/Containers: #161B22 with border-white/10
- Primary action color: Gold #F4C430 with dark text (#0F1115), font-bold
- Secondary buttons: border-white/20, text-white
- Inputs: bg-[#0F1115] border-white/10 text-white
- Typography: Inter (font-sans) for labels, JetBrains Mono (font-mono) for all numbers/currency/percentages
- Result states: Green text for profit indicators, Red text for rejection (no green buttons)
- Footer links hover to gold

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
4. **Advanced Costs**: Collapsible "Add Advanced Costs" toggle reveals Software Subs and Agency Fees inputs; collapsed by default, resets to 0 when collapsed
5. **Lock In CTA**: Links to HoneyBook (honeybook.com) for contract creation

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