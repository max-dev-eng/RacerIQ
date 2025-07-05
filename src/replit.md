# RacerIQ - AI Racing Performance Coach

## Overview

RacerIQ is a web application that provides AI-powered lap time analysis and coaching for racing enthusiasts. Users can upload racing videos, compare them against professional baseline laps, and receive personalized feedback to improve their performance. The application features real-time telemetry analysis, track sector breakdowns, and AI-generated coaching recommendations.

## System Architecture

This is a full-stack web application built with a modern TypeScript stack:

- **Frontend**: React with Vite for fast development and building
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **File Uploads**: Multer for handling video file uploads

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom racing theme colors and utilities
- **Build Tool**: Vite with React plugin and TypeScript support
- **Path Aliases**: Configured for clean imports (@/, @shared, @assets)

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for tracks, cars, videos, and analysis
- **File Handling**: Multer middleware for video uploads with format validation
- **Error Handling**: Centralized error middleware with proper status codes

### Database Schema
- **Users**: Basic authentication with username/password
- **Tracks**: Racing track information with metadata and map data
- **Cars**: Racing car specifications with brand, category, and performance data
- **Lap Videos**: Uploaded video files with metadata (linked to track and car)
- **Lap Analyses**: AI-generated analysis results with telemetry data
- **Baseline Laps**: Professional reference laps for comparison (track and car specific)

### Storage Architecture
- **Interface-Based**: IStorage interface allows for multiple storage implementations
- **Current Implementation**: In-memory storage (MemStorage) for development
- **Production Ready**: Can be easily swapped for PostgreSQL implementation

## Data Flow

1. **Track & Car Selection**: Users select a racing track and specific car for their lap
2. **Video Upload**: Users upload their racing video with track and car context
3. **File Processing**: Server validates format and stores video metadata with associations
4. **Analysis Request**: Client requests AI analysis with comparison format preference
5. **Telemetry Generation**: System processes video to extract performance data
6. **Baseline Comparison**: User's lap data is compared against track/car-specific baseline laps
7. **AI Coaching**: Machine learning algorithms generate personalized improvement suggestions
8. **Visualization**: Results are displayed with interactive track maps and telemetry charts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon Database
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui**: Headless UI primitives for accessibility
- **multer**: File upload handling middleware

### UI Dependencies
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **cmdk**: Command palette component
- **date-fns**: Date utility library

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- **Hot Reload**: Vite development server with HMR
- **TypeScript**: Full type checking in development mode
- **Path Resolution**: Configured aliases for clean imports

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **File Storage**: Local filesystem for development (uploads/ directory)
- **Error Handling**: Graceful degradation with proper error boundaries

## Changelog

Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Added car selection functionality with 10 racing cars (Porsche, Ferrari, Mercedes, Audi, BMW)
- June 28, 2025. Added navigation buttons in hero section that scroll to analysis sections when clicked
- June 28, 2025. Added Track Analysis section with interactive track selection and video learning interface
- June 28, 2025. Removed difficulty tags from track modules and improved track name visibility
- June 28, 2025. Updated selected comparison format modules to have 5% tint (bg-gray-50)
- June 28, 2025. Enhanced telemetry data button to redirect to upload section instead of analysis
- June 28, 2025. Ensured selected track modules maintain white font color for consistency
- June 28, 2025. Verified text color consistency: black text on white/light backgrounds, white text on dark backgrounds

## User Preferences

Preferred communication style: Simple, everyday language.