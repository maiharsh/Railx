# RailX

RailX is a full-stack railway ticket booking platform that helps passengers discover trains, book tickets, manage journeys, and receive notifications, while also providing administrators with a dashboard to manage trains, schedules, and bookings.

## Features

### Passenger
- User registration and login
- Train search by source, destination, and travel date
- Multi-passenger booking flow
- Booking confirmation with generated PNR
- Ticket actions (PDF download, QR code view, email send workflow)
- Booking history and status tracking
- Booking cancellation flow
- Notifications and profile management

### Admin
- Secure admin login
- Dashboard with operational metrics
- Train management (create, update, delete)
- Schedule management (create, update, delete)
- Booking monitoring and status oversight

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Express.js, TypeScript, Mongoose
- **Database:** MongoDB
- **Auth/Security:** JWT-based authentication with session handling

## Architecture Overview

RailX follows a layered client-server architecture:

- **Client Layer:** Next.js frontend for passenger and admin interfaces
- **API Layer:** Express REST APIs for auth, booking lifecycle, payments, cancellations, and admin operations
- **Data Layer:** MongoDB collections managed via Mongoose models
- **Integration Layer:** QR generation, PDF ticket generation, and notification/email utilities

## Core Domain Models

The backend centers on the following entities:

- `Passenger`
- `UserSession`
- `Train`
- `Station`
- `Schedule`
- `Booking`
- `Seat`
- `Payment`
- `Cancellation`
- `Notification`
- `Admin`

## Getting Started

## Prerequisites

- Node.js 18+
- npm 8+
- MongoDB (local or cloud)

## Installation

1. Install frontend/root dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

## Environment Variables

Create a `backend/.env` file (and root `.env` if your frontend requires it).

Example backend configuration:

```env
PORT=5001
DB_HOST=mongodb://localhost:27017
DB_NAME=railway_booking
JWT_SECRET=your_secret_here
```

## Run the Project

### Option 1: Run frontend and backend separately

Frontend (from root):

```bash
npm run dev
```

Backend (from `backend`):

```bash
npm run dev
```

### Option 2: Run full stack from root

```bash
npm run dev:full
```

## Useful Backend Commands

From `backend`:

```bash
npm run seed
npm run build
npm run start
```

## Suggested Project Structure

### Frontend (selected routes)
- `src/app/page.tsx` - landing page
- `src/app/register/page.tsx` - user registration
- `src/app/login/page.tsx` - user login
- `src/app/(protected)/dashboard/page.tsx` - passenger dashboard
- `src/app/(protected)/search/page.tsx` - train search
- `src/app/(protected)/booking/page.tsx` - booking flow
- `src/app/(protected)/confirmation/page.tsx` - booking confirmation
- `src/app/admin/login/page.tsx` - admin login
- `src/app/admin/dashboard/page.tsx` - admin dashboard

### Backend (selected modules)
- `backend/src/server.ts` - app bootstrap and middleware
- `backend/src/lib/db.ts` - MongoDB connection
- `backend/src/middleware/auth.ts` - JWT/session auth middleware
- `backend/src/routes/auth.ts` - passenger auth routes
- `backend/src/routes/admin-auth.ts` - admin auth routes
- `backend/src/routes/admin.ts` - admin management routes
- `backend/src/routes/trains.ts` - train APIs
- `backend/src/routes/stations.ts` - station APIs
- `backend/src/routes/schedules.ts` - schedule APIs
- `backend/src/routes/bookings.ts` - booking APIs
- `backend/src/routes/payments.ts` - payment APIs
- `backend/src/routes/cancellations.ts` - cancellation APIs
- `backend/src/routes/notifications.ts` - notification APIs
- `backend/src/routes/profile.ts` - profile APIs
- `backend/src/routes/qr.ts` - QR APIs

## User Flows

### Passenger Flow
1. Register/Login
2. Search trains
3. Select schedule and enter passenger details
4. Confirm booking and complete payment
5. Receive PNR and manage ticket actions (PDF/QR/email)
6. Track bookings and notifications
7. Cancel booking if required

### Admin Flow
1. Login
2. View dashboard metrics
3. Manage trains and schedules
4. Monitor bookings

## API Modules

- Authentication (passenger/admin)
- Trains, stations, and schedules
- Booking lifecycle and status
- Seat and fare mapping
- Payments and refunds metadata
- Cancellations
- Notifications and profile
