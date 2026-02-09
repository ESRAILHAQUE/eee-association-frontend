# EEE Association — Frontend

Frontend for the **EEE Department Batch 2024** association: role-based dashboards (Admin, Super Admin, CR, Moderator, Member), notice board, fee management, student directory, and events. Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

---

## Tech Stack

| Category   | Stack                    |
|-----------|---------------------------|
| Framework | Next.js 16 (App Router)   |
| UI        | React 19, Tailwind CSS 4 |
| Icons     | Lucide React              |
| Tooling   | TypeScript, Turbopack     |

---

## Getting Started

### Prerequisites

- **Node.js** 18+  
- **npm** (or yarn/pnpm)

### Install & run

```bash
# Install dependencies
npm install

# Development (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & production

```bash
# Production build
npm run build

# Start production server
npm start
```

### Lint

```bash
npm run lint
```

---

## Routes Reference

All routes and what each page shows.

### Public & auth

| Route       | Description |
|------------|-------------|
| `/`        | **Home** — Marketing landing: hero, achievements, clubs, events, newsletter. |
| `/login`   | **Login** — Full-page login screen (email/password). |

---

### Dashboard (role-based)

Layout and sidebar depend on the path: `/dashboard/admin/*`, `/dashboard/cr/*`, etc. So from CR dashboard, “Notice Board” goes to `/dashboard/cr/notice-board` (CR sidebar), not admin.

#### Admin

| Route | Page | Content |
|-------|------|--------|
| `/dashboard/admin` | Admin Dashboard | Overview: total students, fees collected, active batches, recent notices; quick links to Notice Board, Batch Management, Fee Tracking. |
| `/dashboard/admin/notice-board` | Notice Board | Pinned and latest notices; search; “Post Notice” CTA. |
| `/dashboard/admin/students` | Student Directory / Batch Management | Student list (name, reg, batch, year, contact); search, filters, export. |
| `/dashboard/admin/fee-management` | Fee Tracking | Fee collection overview, batch-wise status, payment list. |
| `/dashboard/admin/events` | Events | Department events list and management. |
| `/dashboard/admin/settings` | Admin Settings | Batch & directory defaults, admin notifications, approval rules. |

#### CR (Class Representative)

| Route | Page | Content |
|-------|------|--------|
| `/dashboard/cr` | CR Dashboard | Stats: total students, fees pending, active notices; fee table; batch notices; quick links to Notice Board, Fee Management. |
| `/dashboard/cr/notice-board` | Notice Board | Notices for the batch; view and follow notices. |
| `/dashboard/cr/students` | Student Directory | Batch students list and search. |
| `/dashboard/cr/fee-management` | Fee Management | Fee status and pending list for the batch. |
| `/dashboard/cr/settings` | CR Settings | Batch info, CR-specific notifications and task list preferences. |

#### Member

| Route | Page | Content |
|-------|------|--------|
| `/dashboard/member` | Member Dashboard | Status, contribution, points; upcoming events; quick links to Events. |
| `/dashboard/member/events` | Events | Upcoming and past events; register / view details. |
| `/dashboard/member/payments` | Payments | Personal membership / event payment history and upcoming dues. |
| `/dashboard/member/resources` | Resources | Study materials, question banks and important documents. |
| `/dashboard/member/profile` | Profile | General student profile (basic info for a single member). |
| `/dashboard/member/settings` | Member Settings | Notifications, appearance and language/region preferences. |

#### Moderator

| Route | Page | Content |
|-------|------|--------|
| `/dashboard/moderator` | Moderator Dashboard | Overview and placeholders for Event Proposals, Resources, Forum, Users. |
| `/dashboard/moderator/settings` | Moderator Settings | Preferences for event approvals, resources and forum moderation. |

#### Super Admin

| Route | Page | Content |
|-------|------|--------|
| `/dashboard/super-admin` | Super Admin Dashboard | System overview; Users, Payments, Events, Logs, Settings (sidebar). |
| `/dashboard/super-admin/events` | Events | System-wide events management. |
| `/dashboard/super-admin/users` | Users | Manage all roles (Super Admin, Admin, CR, Moderator, Member). |
| `/dashboard/super-admin/payments` | Payments | Consolidated payment overview and recent transactions. |
| `/dashboard/super-admin/logs` | Logs | Activity log for security, user and payment events. |
| `/dashboard/super-admin/settings` | System Settings | Global platform, security and notifications configuration. |

---

## Route summary (quick list)

```
/                          → Home (marketing)
/login                     → Login

/dashboard/admin           → Admin dashboard
/dashboard/admin/notice-board
/dashboard/admin/students
/dashboard/admin/fee-management
/dashboard/admin/events
/dashboard/admin/settings

/dashboard/cr              → CR dashboard
/dashboard/cr/notice-board
/dashboard/cr/students
/dashboard/cr/fee-management
/dashboard/cr/settings

/dashboard/member          → Member dashboard
/dashboard/member/events
/dashboard/member/payments
/dashboard/member/resources
/dashboard/member/profile
/dashboard/member/settings

/dashboard/moderator       → Moderator dashboard
/dashboard/moderator/settings

/dashboard/super-admin     → Super Admin dashboard
/dashboard/super-admin/events
/dashboard/super-admin/users
/dashboard/super-admin/payments
/dashboard/super-admin/logs
/dashboard/super-admin/settings
```

---

## Project structure (main)

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (marketing)/           # Home layout + landing page
│   ├── dashboard/             # Role-prefixed dashboard routes
│   │   ├── admin/
│   │   ├── cr/
│   │   ├── member/
│   │   ├── moderator/
│   │   ├── super-admin/
│   │   └── layout.tsx         # Role from path → DashboardLayout
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layouts/               # DashboardLayout, Sidebar, Header
│   └── ui/                    # Button, etc.
└── lib/
    ├── constants.ts           # ROUTES, DASHBOARD_NAV, THEME
    └── utils.ts
```

---

## Design & routing notes

- **Role from URL:** Dashboard layout uses the first segment after `/dashboard/` (e.g. `admin`, `cr`, `member`) to pick the sidebar and title. So always use role-prefixed URLs (e.g. `/dashboard/cr/notice-board`) so the correct panel stays active.
- **Theme:** CSS variables in `globals.css`; primary `#135bec`, light/dark surfaces and text.
- **Placeholder links:** Some sidebar items use `#` (Reports, Settings, etc.) and are not implemented yet.

---

## License

Private — EEE Association project.
