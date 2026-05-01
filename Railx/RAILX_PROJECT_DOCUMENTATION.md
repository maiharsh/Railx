# RailX

## INTRODUCTION:
RailX is a full-stack railway ticket booking platform designed to simplify train discovery, booking, payment, and journey management for passengers while providing a dedicated administration panel for railway operations. The platform offers a modern, responsive web interface with a dark-themed UI and role-based workflows for users and admins.

For passengers, RailX supports account creation, authentication, train search by station/date, booking with passenger details, booking confirmation, ticket download (PDF), QR generation, cancellation, and notification tracking. For administrators, the system provides centralized management of trains, schedules, and bookings through a secure dashboard with operational metrics.

The project is implemented using a modern architecture:
- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- Database: MongoDB with Mongoose ODM
- Security/Identity: JWT-based authentication with session handling

This architecture ensures scalability, modularity, and maintainability while enabling a production-ready flow for real-time railway booking operations.

## SCENARIO Based Case Study:
Meet Azam, a regular traveler who frequently commutes between major Indian cities for work and family visits. He wants a platform that helps him quickly search trains, complete bookings without friction, and manage his tickets from one place.

Azam discovers RailX and starts by creating an account with personal details. After logging in, he lands on his dashboard where he can see booking summaries and upcoming journeys. He searches for trains from New Delhi to Mumbai, filters by date, and books an available train by entering passenger details.

Once payment is completed, RailX instantly generates a booking confirmation with a unique PNR. Azam can download his ticket in PDF format, view a QR code for verification, and receive booking communication through in-app notifications/email workflow.

In case of plan changes, Azam can view booking history and submit cancellation requests. Status updates are reflected in his dashboard and booking records.

On the operations side, an admin logs in through the RailX Admin panel and manages:
- Train inventory
- Travel schedules
- Booking records and statuses
- Overview statistics (bookings, passengers, trains, revenue)

Through this end-to-end flow, RailX improves travel planning efficiency for passengers and operational control for administrators.

## SYSTEM REQUIREMENTS:

### Software Requirements:
To ensure smooth development, testing, and deployment of RailX, the following software components are required:

1. **Operating System**
   - Windows 10/11, macOS, or Linux

2. **Runtime & Package Managers**
   - Node.js (v18+ recommended)
   - npm (v8+)

3. **Frontend Stack**
   - Next.js (v15)
   - React (v19)
   - TypeScript
   - Tailwind CSS

4. **Backend Stack**
   - Express.js
   - TypeScript
   - Mongoose

5. **Database**
   - MongoDB (local or cloud)

6. **Development Tools**
   - Visual Studio Code
   - Postman (API testing)
   - Git/GitHub

7. **Browser**
   - Latest Google Chrome / Firefox / Edge

### Hardware Requirements:
- **Processor:** Intel Core i5 (8th Gen+) / AMD Ryzen 5+
- **RAM:** Minimum 8 GB (16 GB recommended)
- **Storage:** At least 2 GB free for dependencies, build files, and database data
- **Display:** 1366x768 or above (Full HD recommended)

## PROJECT ARCHITECTURE:
RailX follows a client-server architecture with clear separation between presentation, API/business logic, and persistence layers.

- **Client Layer (Next.js Frontend):**
  Handles UI rendering, route-based navigation, authenticated pages, admin pages, and user interactions.

- **API Layer (Express Backend):**
  Exposes REST APIs for authentication, train/station/schedule operations, booking lifecycle, payments, cancellation, notifications, profile, and QR-related operations.

- **Data Layer (MongoDB):**
  Stores normalized entities such as passengers, sessions, trains, stations, schedules, bookings, seats, payments, cancellations, notifications, and admins.

- **Integration Layer:**
  Includes email/notification utilities and PDF/QR generation used during booking confirmation and ticketing.

## TECHNICAL ARCHITECTURE:
In this architecture, the flow begins with a user interacting with the RailX frontend. The frontend sends authenticated/unauthenticated requests to the backend API depending on the action.

1. Passenger/Admin performs action on UI (login, search, booking, manage train, etc.)
2. Next.js frontend calls Express API endpoints (JWT in headers for protected routes)
3. Backend validates request data and authorization
4. Controllers invoke Mongoose models for data access and business rules
5. MongoDB persists and returns state changes
6. Backend returns JSON response to frontend
7. Frontend updates dashboard, booking status, ticket confirmation, and administrative views

For ticketing operations, backend also triggers:
- QR code generation
- Ticket PDF generation flow
- Notification/email handling

## ER DIAGRAM:
The Entity-Relationship model for RailX includes the following core entities:

1. **Passenger**
   - Stores user profile and authentication fields
   - Linked to sessions, bookings, notifications, and cancellations

2. **UserSession**
   - Maintains active session tokens and expiry metadata
   - References Passenger

3. **Train**
   - Stores train metadata (number, name, type, total seats)

4. **Station**
   - Stores station code, city, and state information

5. **Schedule**
   - Connects train + source station + destination station + travel date
   - Tracks seat availability and base fare

6. **Booking**
   - References Passenger and Schedule
   - Contains PNR, status, passenger list, fare, and booking date

7. **Seat**
   - Seat-level details linked to a booking
   - Includes class, berth type, and fare allocation

8. **Payment**
   - Linked to booking
   - Stores method, transaction ID, status, refund metadata

9. **Cancellation**
   - Linked to booking and passenger
   - Stores reason, charges, and refund status

10. **Notification**
    - Linked to passenger and optionally booking
    - Stores notification type/message/read status and delivery markers

11. **Admin**
    - Stores admin credentials, role, and activity fields

### Relationship Summary:
- Passenger 1:N Booking
- Booking 1:N Seat
- Booking 1:1 Payment (logical)
- Booking 0..1:1 Cancellation
- Passenger 1:N Notification
- Train 1:N Schedule
- Station 1:N Schedule (as source/destination roles)
- Passenger 1:N UserSession

## Key Features:
1. User registration, login, and authenticated dashboard
2. Admin login and role-specific management console
3. Train search by source, destination, and travel date
4. Dynamic schedule listing with seat availability and fares
5. Multi-passenger booking form and fare summary
6. PNR generation and booking confirmation workflow
7. Ticket utilities: PDF download, QR view, email send action
8. Booking history and booking status tracking (Confirmed/Cancelled/Pending)
9. Booking cancellation with refund/cancellation metadata support
10. Notification center for booking and system alerts
11. Profile management for passenger account details
12. Admin CRUD operations for trains and schedules + booking overview

## ROLES AND RESPONSIBILITIES:

### User (Passenger):
- Register and securely manage account credentials
- Search trains and select suitable schedules
- Enter accurate passenger details while booking
- Complete payment and retain generated PNR
- Track bookings and initiate cancellation when needed
- Access ticket outputs (PDF/QR) and notifications

### Admin:
- Securely access admin panel
- Manage trains (create/update/delete)
- Manage schedules (create/update/delete)
- Monitor booking records and statuses
- Monitor key operational metrics (bookings, passengers, trains, revenue)
- Ensure correctness of operational railway data

## User Flow:

### Passenger Flow:
1. Landing Page -> Register/Login
2. Dashboard -> Search Trains
3. Select Schedule -> Fill Passenger Details
4. Confirm Booking -> Payment/Confirmation
5. Receive PNR -> Download PDF / View QR / Send Email
6. View booking history, status, and notifications
7. Cancel booking if required

### Admin Flow:
1. Admin Login
2. Dashboard Overview
3. Manage Trains
4. Manage Schedules
5. Monitor Bookings

## MVC PATTERN:
RailX backend follows an MVC-style layered structure:

### Model Layer:
Mongoose schemas define all major entities (`Passenger`, `Train`, `Station`, `Schedule`, `Booking`, `Seat`, `Payment`, `Cancellation`, `Notification`, `Admin`, `UserSession`) and handle data persistence.

### Controller/Service Logic Layer:
Route handlers and business logic validate input, enforce auth rules, process booking/payment/cancellation workflows, and orchestrate model operations.

### View/Route Layer:
REST endpoints in `routes` expose API contracts consumed by the frontend (GET/POST/PUT/DELETE patterns).

### Advantages in this project:
- Separation of concerns
- Easy feature extension
- Cleaner testing and debugging
- Better team collaboration across frontend/backend

## Project Setup And Configuration.

### 1) Clone and install root (frontend)
```bash
npm install
```

### 2) Install backend dependencies
```bash
cd backend
npm install
```

### 3) Configure environment variables
Create `.env` files:

- **Root `.env`** for frontend API base usage if required.
- **`backend/.env`** for backend runtime values, for example:
```env
PORT=5001
DB_HOST=mongodb://localhost:27017
DB_NAME=railway_booking
JWT_SECRET=your_secret_here
```

### 4) Run development servers
Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

Or use integrated dev workflow from root:
```bash
npm run dev:full
```

### 5) Optional backend utilities
```bash
cd backend
npm run seed
npm run build
npm run start
```

## BACKEND DEVELOPMENT:

### Backend Structure:
- `backend/src/server.ts` -> Express app bootstrap, CORS, middleware, route mounting
- `backend/src/lib/db.ts` -> MongoDB connection with Mongoose
- `backend/src/middleware/auth.ts` -> JWT/session auth middleware
- `backend/src/routes/auth.ts` -> Passenger auth routes
- `backend/src/routes/admin-auth.ts` -> Admin auth routes
- `backend/src/routes/admin.ts` -> Admin dashboard and management routes
- `backend/src/routes/stations.ts` -> Station APIs
- `backend/src/routes/trains.ts` -> Train APIs
- `backend/src/routes/schedules.ts` -> Schedule APIs
- `backend/src/routes/bookings.ts` -> Booking APIs
- `backend/src/routes/payments.ts` -> Payment APIs
- `backend/src/routes/cancellations.ts` -> Cancellation APIs
- `backend/src/routes/notifications.ts` -> Notification APIs
- `backend/src/routes/profile.ts` -> User profile APIs
- `backend/src/routes/qr.ts` -> QR generation APIs

### Implemented API Modules:
1. Authentication (user/admin)
2. Master data (trains/stations/schedules)
3. Booking lifecycle (create/read/status)
4. Seat and fare mapping
5. Payment and refund metadata
6. Cancellation processing
7. Notifications and profile services

## DATABASE DEVELOPMENT:

### Database: MongoDB + Mongoose
RailX uses MongoDB collections defined via TypeScript Mongoose models.

### Core Schemas:
1. `Passenger`
2. `UserSession`
3. `Train`
4. `Station`
5. `Schedule`
6. `Booking`
7. `Seat`
8. `Payment`
9. `Cancellation`
10. `Notification`
11. `Admin`

### Database Notes:
- Unique constraints used on key identity fields (e.g., train number, station code, PNR/transaction IDs where applicable)
- ObjectId references enforce relational consistency between entities
- Enum constraints enforce valid status/type values
- Timestamps and date fields support reporting, auditing, and lifecycle handling

## FRONT-END DEVELOPMENT:

### Frontend Stack:
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

### Frontend Structure:
- `src/app/page.tsx` -> Public landing page
- `src/app/register/page.tsx` -> Passenger registration
- `src/app/login/page.tsx` -> Passenger login
- `src/app/(protected)/dashboard/page.tsx` -> User dashboard
- `src/app/(protected)/search/page.tsx` -> Train search
- `src/app/(protected)/booking/page.tsx` -> Booking form
- `src/app/(protected)/confirmation/page.tsx` -> Booking confirmation + ticket actions
- `src/app/(protected)/notifications/page.tsx` -> Notification center
- `src/app/(protected)/profile/page.tsx` -> Profile page
- `src/app/(protected)/cancellation/page.tsx` -> Cancellation view
- `src/app/admin/login/page.tsx` -> Admin login
- `src/app/admin/dashboard/page.tsx` -> Admin dashboard
- `src/app/admin/trains/[id]/page.tsx` -> Admin train management pages
- `src/app/admin/schedules/[id]/page.tsx` -> Admin schedule management pages

## Output ScreenShots:

### 1) Landing Page
![Landing Page](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_20.58.29-c3c25d19-a470-482b-a294-66adc76f8e88.png)

### 2) User Registration Page
![User Registration](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_20.58.30-eda817a9-9237-4d5d-9d32-5667b8f4c3e4.png)

### 3) User Login Page
![User Login](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_20.58.30__1_-dfb93ffa-d905-4826-a1ba-0911db9775df.png)

### 4) User Dashboard
![User Dashboard](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.27__1_-27edd73b-48a4-4453-8961-0e4bb028ead8.png)

### 5) Train Search / Available Trains
![Available Trains](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.27-fe49e5cf-27c7-4266-9623-4f6fb838e7e8.png)

### 6) Booking Form
![Booking Form](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.01-e21ffe2a-b3d0-47f1-908f-09d04f6bbef1.png)

### 7) Booking Confirmation + Ticket Actions
![Booking Confirmation](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.39__1_-3dcd0a1d-7bce-4393-81e3-2db4d957259b.png)

### 8) Admin Dashboard (Overview)
![Admin Overview](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.11.21-328de4c5-96ed-455c-8772-3ad85634cd90.png)

### 9) Admin Trains Management
![Admin Trains](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.11.21__1_-94635b6d-c4bc-4ec5-93ed-be72731bef4c.png)

### 10) Admin Schedules Management
![Admin Schedules](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.11.21__2_-54392b54-130f-422f-b6ae-cc4b90077ff2.png)

### 11) Admin Bookings View
![Admin Bookings](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.11.22-39af37da-2c6f-491c-9045-43d816078e7b.png)

### 12) Backend Project Structure
![Backend Structure](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.39-f098109e-4f5f-4bd3-a8ea-2d24c83d104d.png)

### 13) Database Connection Snippet
![DB Connection](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.38-1e72285b-ffee-47df-b342-b7ff02003daa.png)

### 14) Example Mongoose Models (Passenger / Booking / Train / Schedule / etc.)
![Passenger Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.28__1_-743767de-226b-4b4b-8e3b-ad7c5ccf4ad1.png)
![Booking Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.00-df6bcb8d-3369-432a-a5aa-ff1e5d15d716.png)
![Train Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.27__2_-c5e72f69-4b4e-47f9-9b1c-95cbaa156708.png)
![Schedule Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.01__1_-1dafc518-7cfa-45a5-8459-c13dcc984ca4.png)
![Station Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.00__1_-23de3ccb-145e-4b29-85c5-748bc1410e50.png)
![Seat Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.26__1_-f58a7a65-e9b8-4698-a157-a3467f75396a.png)
![Payment Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.26-568a6464-edf4-475f-ab23-b7c6156d544b.png)
![Notification Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.00.28-0044c379-0fc2-45e1-b903-c8bfe3166b2a.png)
![Cancellation Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.36__1_-a08c9c84-abe6-40c2-8480-d916392176bc.png)
![Admin Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.36-fd20921c-a4c6-4fd5-9d8d-8abfc9e04356.png)
![UserSession Model](C:/Users/lenovo/.cursor/projects/c-Users-lenovo-Downloads-FullStack-1/assets/c__Users_lenovo_AppData_Roaming_Cursor_User_workspaceStorage_6c1279a333930b78721db321768896fb_images_WhatsApp_Image_2026-04-29_at_21.03.37-4127d4f7-f600-45fd-b562-1e6dcf8f3bae.png)

## Demo Video Link:
Add your working demo video link here.

## Code Repository Link:
Add your GitHub repository link here.

