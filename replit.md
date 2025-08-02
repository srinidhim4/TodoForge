# Todo Application

## Overview

This is a full-stack todo application built with React, Express.js, and PostgreSQL. The application features a modern UI built with shadcn/ui components and Tailwind CSS, with a RESTful API backend for managing todo items. The app includes CRUD operations for todos (create, read, update, delete) with real-time state management using TanStack Query.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Request Handling**: JSON body parsing with URL-encoded form support
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reloading with Vite integration in development mode

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Schema**: Centralized schema definition in shared directory
- **Validation**: Zod schemas for runtime type validation
- **Migrations**: Drizzle Kit for database schema management

### Project Structure
- **Monorepo Layout**: Client, server, and shared code in separate directories
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Path Aliases**: Clean import paths using TypeScript path mapping
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)

### Development Tools
- **Hot Reloading**: Development server with automatic reloading
- **Type Checking**: TypeScript strict mode with comprehensive type checking
- **Code Quality**: ESM modules throughout the application
- **Replit Integration**: Special handling for Replit development environment

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web framework for the backend API
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **wouter**: Lightweight client-side routing

### UI and Styling
- **@radix-ui/react-***: Comprehensive set of unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for conditionally joining class names

### Development and Build Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database schema management and migrations

### Form and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: URL-safe unique string ID generator
- **lucide-react**: Clean and consistent icon library