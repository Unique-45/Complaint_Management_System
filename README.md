# Complaint Tracking System

A modern web application for managing customer complaints and support tickets.

## Features

- User authentication (signup/login)
- Create and manage complaint issues
- Comment on issues
- Real-time notifications
- Role-based dashboards (Admin, Agent, Customer)
- Advanced search and filtering
- Issue priority and status tracking

## Tech Stack

- **Frontend:** React 18, Next.js 14, TypeScript 5, Tailwind CSS 3.3
- **Backend:** Next.js API Routes, Node.js 18+
- **Database:** PostgreSQL 13+
- **ORM:** Prisma 5.7+
- **Authentication:** NextAuth.js 4.24+

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables in `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/complaint_system"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3002"
   ```

4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npx prisma db seed
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/callback/credentials` - Login

### Issues
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get issue details
- `PATCH /api/issues/[id]` - Update issue

### Comments
- `POST /api/comments` - Post comment on issue

## Database Schema

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema.

### Models
- **User:** System users (Admin, Agent, Customer)
- **Issue:** Customer complaints/tickets
- **Comment:** Comments on issues
- **Category:** Issue categories
- **Notification:** User notifications
- **AuditLog:** System audit logs

## Default Test Credentials

Admin:
- Email: admin@example.com
- Password: Admin@123456

Agent:
- Email: agent1@example.com
- Password: Agent@123456

Customer:
- Email: customer@example.com
- Password: Customer@123456

## Project Structure

```
complaint_system/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── issues/
│   │   └── comments/
│   ├── dashboard/
│   ├── issues/
│   ├── login/
│   └── signup/
├── components/
│   └── Header.tsx
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── .env.local
├── package.json
└── README.md
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push and create a Pull Request

## Team Members

- Member 1: Database & Schema
- Member 2: Authentication
- Member 3: Frontend UI
- Member 4: Backend APIs
- Member 5: Documentation