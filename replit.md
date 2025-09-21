# Overview

This is a full-stack web application for managing custom templates and monitoring user interactions. The system allows administrators to create customizable templates (like login pages for various services), generate tracking links, and monitor user sessions in real-time through a comprehensive dashboard.

The application features a React frontend with a modern admin dashboard and individual template pages that mimic popular services. The backend provides RESTful APIs and real-time WebSocket communication for live session monitoring. All user interactions with templates are captured and displayed in real-time to administrators.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and bundling
- **Real-time Communication**: WebSocket client with automatic reconnection

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with consistent JSON responses
- **Real-time Features**: WebSocket server for live session updates
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with Vite integration in development mode

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: Neon Database serverless driver for cloud PostgreSQL
- **Data Models**: Type-safe schemas with Zod validation
- **Session Storage**: Database-backed session tracking with IP and user agent capture

## Authentication and Authorization
- **Architecture**: Currently implements storage interfaces for user management
- **Session Management**: Custom session tracking for template interactions
- **Security**: IP address and user agent logging for security monitoring

## External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Component Library**: Radix UI for accessible, unstyled components  
- **Form Management**: React Hook Form with Zod resolvers for validation
- **Date Utilities**: date-fns for date formatting and manipulation
- **Styling System**: Tailwind CSS with class variance authority for component variants
- **Development Tools**: ESBuild for production builds, TSX for development execution