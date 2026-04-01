# Complaint Tracker System

A comprehensive web-based Issue/Complaint Tracker System built with Next.js, TypeScript, PostgreSQL, and Prisma ORM.

## Features

### User Management
- User registration & email verification
- Email/password authentication
- OAuth (Google, Microsoft)
- JWT-based sessions
- Role-based access control (RBAC)

### Issue Management
- Create, read, update issues
- Issue lifecycle tracking (New → Assigned → In Progress → Resolved → Closed → Reopened)
- Comment system
- File attachments
- Ticket ID auto-generation
- Status and priority management

### Assignment System
- Manual assignment by admins
- Auto-assignment based on category and workload
- Agent workload tracking

### Notifications
- In-app notifications
- Email notifications
- Event-based alerts (status changes, assignments, comments)

### Dashboard & Analytics
- Real-time statistics
- Charts and graphs (Priority, Status, Category distribution)
- Performance metrics
- Average resolution time tracking
- Resolution rate analysis

### Search & Filters
- Search by Ticket ID, Title, Description
- Filter by Status, Priority, Category
- Pagination support

### Administration
- User management
- System configuration
- Audit logs
- Permission management

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Email:** Nodemailer
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** AWS S3 / Cloudinary (optional)

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

## Installation

1. **Clone the repository**
```bash
cd Complaint_System
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

Configure the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/complaint_system
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@complaintsystem.com
```

4. **Setup Database**
```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/login` - Get current user session

### Issues
- `GET /api/issues` - List all issues (with filters)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue details
- `PATCH /api/issues/:id` - Update issue

### Comments
- `GET /api/issues/:id/comments` - Get issue comments
- `POST /api/issues/:id/comments` - Add comment

### Users
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user details
- `DELETE /api/users/:id` - Delete user (admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin only)

## Project Structure

```
complaint-system/
├── app/
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── issues/            # Issues pages
│   ├── admin/             # Admin pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # UI components
│   ├── Header.tsx         # Header component
│   ├── Sidebar.tsx        # Sidebar component
│   ├── Dashboard.tsx      # Dashboard component
│   ├── IssueList.tsx      # Issue list component
│   ├── IssueDetail.tsx    # Issue detail component
│   └── CreateIssueForm.tsx # Create issue form
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Authentication helpers
│   ├── email.ts           # Email utilities
│   ├── notifications.ts   # Notification system
│   ├── audit.ts           # Audit log utilities
│   └── utils.ts           # General utilities
├── prisma/
│   ├── schema.prisma      # Prisma schema
│   └── seed.js            # Database seed
├── public/                # Static files
├── .env.local             # Environment variables
├── next.config.js         # Next.js config
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── package.json           # Dependencies
```

## User Roles

- **Customer:** Can create, view, and comment on their own issues
- **Agent:** Can view and work on assigned issues
- **Manager:** Can view analytics and manage team performance
- **Admin:** Full system access, user management, system configuration

## Running in Production

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## Development

### Run with hot reload
```bash
npm run dev
```

### Check for type errors
```bash
npm run lint
```

### Database migration
```bash
npm run db:migrate
```

### Generate Prisma client
```bash
npm run db:generate
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check database user permissions

### Email Not Sending
- Verify SMTP credentials
- Check GMAIL "Less secure app access" is enabled or use App Password
- Review Nodemailer logs

### Authentication Issues
- Clear browser cookies and cache
- Verify NEXTAUTH_SECRET is set
- Check session expiration settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for your needs.

## Support

For issues and questions, please create an issue in the repository.

## Future Enhancements

- [ ] Advanced analytics and reporting
- [ ] File attachment preview
- [ ] Real-time notifications with WebSockets
- [ ] AI-powered issue categorization
- [ ] Mobile application
- [ ] Integration with third-party services
- [ ] Performance optimization
- [ ] Multi-language support
