# EEE Association — Frontend

Next.js frontend for the **EEE Department Association Management System** at Sylhet Engineering College. Role-based dashboards for Super Admin, Admin, CR, Moderator, and Member — connected to the Express/Prisma backend API.

---

## Tech Stack

| Category  | Stack                         |
|-----------|-------------------------------|
| Framework | Next.js 16 (App Router)       |
| Runtime   | React 19                      |
| Language  | TypeScript                    |
| Styling   | Tailwind CSS v4               |
| Icons     | Lucide React                  |
| Tooling   | Turbopack (dev), ESLint       |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:4000`

### Install & Run

```bash
cd eee-association-frontend
npm install
npm run dev        # Turbopack dev server → http://localhost:3000
```

### Build & Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── (marketing)/
│   │   └── page.tsx            # Landing page (home)
│   ├── dashboard/
│   │   ├── layout.tsx          # Shared dashboard layout (sidebar + header)
│   │   ├── admin/              # Admin role pages
│   │   ├── cr/                 # CR (Class Representative) pages
│   │   ├── member/             # Student/member pages
│   │   ├── moderator/          # Moderator pages
│   │   └── super-admin/        # Super admin pages
│   ├── globals.css
│   └── layout.tsx              # Root layout
├── components/
│   ├── layouts/                # DashboardLayout, Sidebar, Header
│   └── ui/                     # Shared UI primitives
└── lib/
    ├── api.ts                  # All API functions + TypeScript types
    ├── constants.ts            # API_BASE, DASHBOARD_NAV, ROUTES
    └── utils.ts
```

---

## Routes Reference

### Public & Auth

| Route      | Description                                             |
|------------|---------------------------------------------------------|
| `/`        | Marketing landing page — hero, achievements, clubs, events |
| `/login`   | Login with email + password → stores JWT in localStorage |

---

### Admin Dashboard (`/dashboard/admin/*`)

| Route                              | Page                  | API Connected |
|------------------------------------|-----------------------|:---:|
| `/dashboard/admin`                 | Overview dashboard    | ✓   |
| `/dashboard/admin/notice-board`    | Notice board          | ✓   |
| `/dashboard/admin/students`        | Student directory     | ✓   |
| `/dashboard/admin/fee-management`  | Fee tracking          | ✓   |
| `/dashboard/admin/events`          | Events management     | ✓   |
| `/dashboard/admin/attendance`      | Attendance records    | ✓   |
| `/dashboard/admin/certificates`    | Certificate issuance  | ✓   |
| `/dashboard/admin/clubs`           | Club management       | ✓   |
| `/dashboard/admin/documents`       | Document repository   | ✓   |
| `/dashboard/admin/feedback`        | Feedback inbox        | ✓   |
| `/dashboard/admin/leave-requests`  | Leave request review  | ✓   |
| `/dashboard/admin/notifications`   | Send notifications    | ✓   |
| `/dashboard/admin/reports`         | Reports & analytics   | ✓   |
| `/dashboard/admin/settings`        | Admin settings        | —   |

---

### CR Dashboard (`/dashboard/cr/*`)

CR pages are automatically batch-scoped — the backend reads the CR's `UserProfile.batch` and filters all queries to that batch only.

| Route                           | Page                  | API Connected |
|---------------------------------|-----------------------|:---:|
| `/dashboard/cr`                 | CR overview dashboard | ✓   |
| `/dashboard/cr/notice-board`    | Batch notice board    | ✓   |
| `/dashboard/cr/students`        | Batch student list    | ✓   |
| `/dashboard/cr/fee-management`  | Batch fee tracking    | ✓   |
| `/dashboard/cr/events`          | Events (batch view)   | ✓   |
| `/dashboard/cr/attendance`      | Attendance (QR scan)  | ✓   |
| `/dashboard/cr/certificates`    | Issue certificates    | ✓   |
| `/dashboard/cr/feedback`        | Batch feedback        | ✓   |
| `/dashboard/cr/leave-requests`  | Leave approvals       | ✓   |
| `/dashboard/cr/notifications`   | Send notifications    | ✓   |
| `/dashboard/cr/resources`       | Approve resources     | ✓   |
| `/dashboard/cr/settings`        | CR settings           | —   |

---

### Member Dashboard (`/dashboard/member/*`)

| Route                          | Page                     | API Connected |
|--------------------------------|--------------------------|:---:|
| `/dashboard/member`            | Member overview          | ✓   |
| `/dashboard/member/notices`    | Notice board (read-only) | ✓   |
| `/dashboard/member/events`     | Events + RSVP            | ✓   |
| `/dashboard/member/payments`   | My fee history           | ✓   |
| `/dashboard/member/attendance` | My attendance records    | ✓   |
| `/dashboard/member/resources`  | Study resources          | ✓   |
| `/dashboard/member/clubs`      | Clubs (join/leave)       | ✓   |
| `/dashboard/member/projects`   | Project showcase         | ✓   |
| `/dashboard/member/forum`      | Discussion forum         | ✓   |
| `/dashboard/member/feedback`   | Submit feedback          | ✓   |
| `/dashboard/member/leave`      | Leave requests           | ✓   |
| `/dashboard/member/mentorship` | Mentorship sessions      | ✓   |
| `/dashboard/member/certificates` | My certificates        | ✓   |
| `/dashboard/member/profile`    | Edit profile             | ✓   |
| `/dashboard/member/settings`   | Member settings          | —   |

---

### Moderator Dashboard (`/dashboard/moderator/*`)

| Route                              | Page                    | API Connected |
|------------------------------------|-------------------------|:---:|
| `/dashboard/moderator`             | Moderator overview      | ✓   |
| `/dashboard/moderator/events`      | Moderate events         | ✓   |
| `/dashboard/moderator/resources`   | Approve/reject resources| ✓   |
| `/dashboard/moderator/forum`       | Moderate forum posts    | ✓   |
| `/dashboard/moderator/clubs`       | Manage clubs            | ✓   |
| `/dashboard/moderator/notifications` | Send notifications    | ✓   |
| `/dashboard/moderator/settings`    | Moderator settings      | —   |

---

### Super Admin Dashboard (`/dashboard/super-admin/*`)

| Route                                | Page                     | API Connected |
|--------------------------------------|--------------------------|:---:|
| `/dashboard/super-admin`             | System overview          | ✓   |
| `/dashboard/super-admin/users`       | User & role management   | ✓   |
| `/dashboard/super-admin/events`      | All events management    | ✓   |
| `/dashboard/super-admin/payments`    | All fee records          | ✓   |
| `/dashboard/super-admin/analytics`   | System analytics         | ✓   |
| `/dashboard/super-admin/logs`        | Login & audit logs       | ✓   |
| `/dashboard/super-admin/newsletter`  | Newsletter compose/send  | ✓   |
| `/dashboard/super-admin/documents`   | Official documents       | ✓   |
| `/dashboard/super-admin/roles`       | Role assignments         | ✓   |
| `/dashboard/super-admin/backup`      | DB backup tools          | —   |
| `/dashboard/super-admin/settings`    | System settings          | —   |

---

## Route Quick List

```
/                                     → Landing page
/login                                → Login

/dashboard/admin                      → Admin home
/dashboard/admin/notice-board
/dashboard/admin/students
/dashboard/admin/fee-management
/dashboard/admin/events
/dashboard/admin/attendance
/dashboard/admin/certificates
/dashboard/admin/clubs
/dashboard/admin/documents
/dashboard/admin/feedback
/dashboard/admin/leave-requests
/dashboard/admin/notifications
/dashboard/admin/reports
/dashboard/admin/settings

/dashboard/cr                         → CR home
/dashboard/cr/notice-board
/dashboard/cr/students
/dashboard/cr/fee-management
/dashboard/cr/events
/dashboard/cr/attendance
/dashboard/cr/certificates
/dashboard/cr/feedback
/dashboard/cr/leave-requests
/dashboard/cr/notifications
/dashboard/cr/resources
/dashboard/cr/settings

/dashboard/member                     → Member home
/dashboard/member/notices
/dashboard/member/events
/dashboard/member/payments
/dashboard/member/attendance
/dashboard/member/resources
/dashboard/member/clubs
/dashboard/member/projects
/dashboard/member/forum
/dashboard/member/feedback
/dashboard/member/leave
/dashboard/member/mentorship
/dashboard/member/certificates
/dashboard/member/profile
/dashboard/member/settings

/dashboard/moderator                  → Moderator home
/dashboard/moderator/events
/dashboard/moderator/resources
/dashboard/moderator/forum
/dashboard/moderator/clubs
/dashboard/moderator/notifications
/dashboard/moderator/settings

/dashboard/super-admin                → Super Admin home
/dashboard/super-admin/users
/dashboard/super-admin/events
/dashboard/super-admin/payments
/dashboard/super-admin/analytics
/dashboard/super-admin/logs
/dashboard/super-admin/newsletter
/dashboard/super-admin/documents
/dashboard/super-admin/roles
/dashboard/super-admin/backup
/dashboard/super-admin/settings
```

---

## Authentication Flow

1. User submits email/password at `/login`
2. Backend returns JWT — stored in `localStorage` as `accessToken`
3. All API calls inject `Authorization: Bearer <token>` via the shared `apiRequest()` helper in `src/lib/api.ts`
4. Dashboard layout reads role from token and renders the correct sidebar
5. On logout, token is cleared and user is redirected to `/login`

---

## Role System

| Role          | Dashboard Prefix       | Access                                             |
|---------------|------------------------|----------------------------------------------------|
| `student`     | `/dashboard/member`    | Read notices/events, submit feedback/leave/projects |
| `cr`          | `/dashboard/cr`        | Batch-scoped: attendance, fees, leave review, notices |
| `moderator`   | `/dashboard/moderator` | Moderate events, resources, forum, clubs           |
| `admin`       | `/dashboard/admin`     | Full department management                         |
| `super_admin` | `/dashboard/super-admin` | System-wide: users, analytics, logs, newsletter  |

---

## Design Notes

- **Primary color:** `#135bec` (CSS variable `--color-primary`)
- **Theme:** CSS variables in `globals.css` — light mode surfaces and text
- **Role from URL:** Dashboard layout derives sidebar from the first path segment after `/dashboard/` (e.g. `cr`, `admin`)
- **CR batch scoping:** Handled entirely server-side — CR pages call the same endpoints as admin pages but the backend auto-filters by the CR's batch
- **CSV export:** Fee, event, and user pages have client-side CSV export using `Blob` + anchor click

---

## License

Private — EEE Association, Sylhet Engineering College. All rights reserved.
