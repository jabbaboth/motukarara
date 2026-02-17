# CLAUDE.md — AI Assistant Guide for Motu

This file provides context and conventions for AI assistants (such as Claude) working in this repository.

## Project Overview

**Motu** (Motukarara Powerline Vegetation Contract Crew Management System) is a web-based real-time crew tracking and project management system for the `jabbaboth` GitHub organization.

- **Location:** Banks Peninsula, New Zealand
- **Timeline:** Feb 9 - Mar 12, 2026 (24 working days)
- **Total Jobs:** 264
- **Total Work Hours:** 498.5
- **Crews:** Jade's crew, Ryan's crew, Jamie's crew, Hedge & Shelter Trimmer
- **Feeders:** MOTU 111, 112, 113, 114

### Current State

- **Legacy system:** `crew_tracking_calendar.html` — 161 jobs hardcoded, browser localStorage only, no multi-device sync, limited to 3 crews
- **Data source:** `Motukarara_Delivery_Standardised_With_Addresses.xlsx` — 264 jobs (source of truth), covers full timeline, includes 4 crews

### Target System

- Real-time sync, mobile-responsive, offline-capable
- 3-4 field crews + managers
- Budget: $20/month (Airtable) + $0 (Vercel hosting)

### Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Database:** Airtable (via REST API)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Phase 2)
- **Deployment:** Vercel

## Repository Structure

```
Motu/
├── CLAUDE.md                          # This file — AI assistant guide
├── ACTION_PLAN.md                     # Project roadmap with three build paths
├── QUICK_START.md                     # 1-hour getting started guide
├── setup-repo.sh                      # Automated directory structure setup
├── package.json.template              # Pre-configured dependencies
├── docs/
│   ├── crew_management_system_requirements.md  # Full requirements & data model
│   ├── developer_prompt.md            # Brief for hiring devs or prompting AI
│   ├── implementation_guide.md        # 2-week DIY build plan
│   └── github_setup_guide.md          # Repo organization & deployment
├── scripts/
│   └── import-excel-to-airtable.js    # CSV-to-Airtable data import tool
├── data/                              # Source data
│   ├── excel/                         # Excel files
│   ├── schemas/                       # Data schemas
│   └── backups/                       # Regular exports
├── legacy/                            # Current HTML-based system
│   └── crew_tracking_calendar.html
└── web-app/                           # Next.js application
    ├── app/                           # Next.js App Router pages
    ├── components/                    # React components
    ├── lib/                           # Service layer (Airtable API)
    ├── hooks/                         # Custom React hooks
    └── package.json                   # Dependencies
```

## Database Schema

### Jobs Table

| Field | Type | Notes |
|-------|------|-------|
| job_id | Primary key | Auto-generated |
| date | Date | Scheduled date |
| crew_name | Single Select | Jade, Ryan, Jamie, Hedge & Shelter Trimmer |
| full_address | Text | Job site address |
| address_number | Text | Street number |
| feeder | Single Select | MOTU 111, 112, 113, 114 |
| job_duration_hours | Number | Estimated hours |
| spans | Number | Number of spans |
| start_time | Text | Planned start |
| end_time | Text | Planned end |
| status | Single Select | Pending, In Progress, Completed |
| completion_date | Date | When marked complete |
| completed_by | Text | Who completed it |
| notes | Long Text | Additional details |
| additional_crews_required | Checkbox | Needs extra crew |

### Crews Table

| Field | Type | Notes |
|-------|------|-------|
| crew_id | Primary key | Auto-generated |
| crew_name | Text | Jade, Ryan, Jamie, etc. |
| crew_lead | Text | Lead person name |
| contact_info | Text | Phone/email |
| active | Checkbox | Currently active |
| color_code | Text | UI color hex code |

## UI Design

### Color Scheme

- **Crew colors:** Jade (#2E86AB teal), Ryan (#A23B72 purple), Jamie (#F18F01 orange)
- **Feeder colors:** MOTU 112 (#ff6b6b20 light red), MOTU 114 (#4ecdc420 light teal), MOTU 113 (#45b7d120 light blue), MOTU 111 (#ffa07a20 light orange)
- **Status colors:** Completed (#d4edda light green), In Progress (light yellow), Pending (white)

## Getting Started

### Prerequisites

- Git
- Node.js 18+
- An Airtable account

### Setup

```bash
git clone https://github.com/jabbaboth/Motu.git
cd Motu
bash setup-repo.sh
cp .env.local.example .env.local
# Edit .env.local with your Airtable credentials
npm install
npm run dev
```

See `QUICK_START.md` for the full getting-started guide.

## Development Workflow

### Branch Naming

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`

### Commit Messages

- Use clear, imperative-mood messages (e.g., "Add crew calendar view")
- Keep the subject line under 72 characters
- Reference issue numbers when applicable (e.g., "Fix job filter (#42)")

### Pull Requests

- Provide a clear description of changes
- Reference related issues
- Ensure all checks pass before requesting review

## Coding Conventions

- **Language:** TypeScript (strict mode)
- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS — utility-first, mobile-first responsive design
- **Linting:** ESLint with `eslint-config-next`
- **File naming:** kebab-case for files, PascalCase for React components
- **Import ordering:** React/Next imports, third-party libraries, local modules, types
- **Error handling:** Try/catch at API boundaries, user-friendly error messages in UI

## Testing

> To be defined as the application is built. Planned:
> - Testing framework: Jest + React Testing Library
> - Run tests: `npm test`
> - Test file convention: `*.test.ts` / `*.test.tsx` alongside source files

## Build & Deploy

- **Dev server:** `npm run dev` (localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Deploy:** Vercel (auto-deploys from `main` branch)
- **CI/CD:** GitHub Actions workflow at `.github/workflows/ci.yml`

## Key Architectural Decisions

1. **Airtable as database** — Easy setup, visual interface, built-in API. Free tier supports 1,200 records (we have 264). Migration path to PostgreSQL (Supabase) exists.
2. **Next.js App Router** — SSR for fast loads, API routes in the same project.
3. **Service layer pattern** — All Airtable calls go through `lib/` service modules, not called directly from components.
4. **Mobile-first design** — 80% of usage will be on phones in the field. Large tap targets, minimal text entry.
5. **Excel as source of truth** — 264 jobs from the Excel file (not 161 from the legacy HTML version).

## Critical Success Factors

1. **Mobile-First:** 80% of usage on phones
2. **Simple UX:** Large tap targets, minimal text entry
3. **Real-Time Sync:** Changes visible within 1 second
4. **Reliability:** Must work in rural areas with spotty connection
5. **Speed:** App must load in under 2 seconds
6. **Data Integrity:** Never lose completion records

## Performance Requirements

- Initial load: < 2 seconds
- Job status update: < 500ms
- Support 500+ jobs without lag
- Work on 3G networks
- Airtable API: 5 requests/second rate limit

## AI Assistant Guidelines

When working in this repository, AI assistants should:

1. **Read before editing** — Always read a file before proposing changes to it
2. **Minimal changes** — Only modify what is directly requested; avoid unnecessary refactoring
3. **No over-engineering** — Keep solutions simple and focused on the task at hand
4. **Security first** — Never introduce vulnerabilities (XSS, SQL injection, command injection, etc.)
5. **Update this file** — When new conventions, tools, or architecture decisions are established, update this CLAUDE.md accordingly
6. **Test changes** — Run existing tests after making changes; add tests for new functionality
7. **Respect existing patterns** — Follow the conventions already established in the codebase
8. **Reference docs** — Use ACTION_PLAN.md for direction, developer_prompt.md for specs, implementation_guide.md for steps
