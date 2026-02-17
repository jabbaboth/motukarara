# Crew Management System — Requirements & Analysis

## Executive Summary

Motu (Motukarara Powerline Vegetation Contract Crew Management System) is a web-based real-time crew tracking system for a powerline vegetation contract on Banks Peninsula, New Zealand. It replaces manual Excel-based tracking and a basic HTML tracker with a modern, mobile-friendly application.

- **264 jobs** across 24 working days (Feb 9 - Mar 12, 2026)
- **498.5 total work hours**
- **4 crews** and **4 feeders** (MOTU 111-114)

---

## Business Requirements

### Core Problem

- The Excel spreadsheet (`Motukarara_Delivery_Standardised_With_Addresses.xlsx`) has 264 jobs but is not accessible to crews in the field
- The legacy HTML tracker (`crew_tracking_calendar.html`) only covers 161 jobs with browser localStorage — no multi-device sync
- No real-time visibility into crew progress or job completion
- Crews work in rural areas on Banks Peninsula and need mobile access

### Current Systems

| System | Jobs | Storage | Sync | Crews |
|--------|------|---------|------|-------|
| Excel spreadsheet | 264 | Local file | None | 4 |
| HTML tracker | 161 | localStorage | None | 3 |
| **Target app** | **264+** | **Airtable** | **Real-time** | **4** |

**Decision:** The Excel spreadsheet with 264 jobs is the source of truth.

### Key Users

1. **Crew Members (Field)** — View assignments, mark jobs complete on their phones
2. **Crew Leads (Jade, Ryan, Jamie)** — Manage their crew's daily work
3. **Managers** — Overview of all crews, progress tracking, reporting

---

## Project Statistics

- **Total Jobs:** 264
- **Total Work Hours:** 498.5
- **Working Days:** 24
- **Crews:**
  - Jade's crew
  - Ryan's crew
  - Jamie's crew
  - Hedge & Shelter Trimmer (specialized)
- **Feeders:** MOTU 111, 112, 113, 114
- **Location:** Banks Peninsula, New Zealand

---

## Functional Requirements

### 1. Job Management (Phase 1 — Must Have)

- View all 264 jobs in database
- Filter by date, crew, feeder, and status
- Mark jobs as complete with tap/click
- Job details: address, feeder, crew, duration, spans, start/end time
- Status tracking: Pending, In Progress, Completed

### 2. Crew Views (Phase 1 — Must Have)

- Filter jobs by crew (Jade, Ryan, Jamie, Hedge & Shelter Trimmer)
- Daily crew sheet — who goes where today
- Auto-select today's date on load
- Color-coded crew assignments

### 3. Dashboard (Phase 1 — Must Have)

- Overall statistics: total jobs, completed, remaining
- Hours worked vs. allocated
- Completion percentage
- Crew-by-crew progress
- Feeder-by-feeder breakdown

### 4. Real-Time Sync (Phase 1 — Must Have)

- Changes visible within 1 second across devices
- Works on iOS and Android browsers
- Mobile-responsive design with large tap targets

### 5. Reporting (Phase 2 — Nice to Have)

- Jobs completed per day/week
- Crew utilization metrics
- Average time per job
- Excel/CSV export
- Email summaries

### 6. Advanced Features (Phase 2 — Nice to Have)

- User authentication
- Photo upload for completed jobs
- GPS location tracking
- Offline mode with sync
- Push notifications

---

## Non-Functional Requirements

### Performance

- Initial load: < 2 seconds
- Job status update: < 500ms
- Support 500+ jobs without lag
- Must work on 3G networks (rural Banks Peninsula)

### Security

- Environment variables for API keys (never committed to repo)
- HTTPS everywhere
- Validate all user input
- Never commit `.env` files

### Availability

- Must work on iOS Safari and Android Chrome
- Mobile-first design (80% of usage on phones)
- Large tap targets, minimal text entry
- Print-friendly daily crew sheet

---

## Recommended Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | Next.js 14 (React) with TypeScript | Modern, fast, SSR for quick loads |
| Backend/API | Next.js API Routes | Single project, no separate backend |
| Database | Airtable (REST API) | Easy setup, visual interface, API included |
| Hosting | Vercel | Free tier, auto-deploys from GitHub |
| Styling | Tailwind CSS | Rapid UI, mobile-first by default |
| Auth (Phase 2) | NextAuth.js | Simple auth for Next.js |

### Why Airtable?

- Spreadsheet-like interface (familiar for Excel users)
- Built-in API — no database setup needed
- Visual interface for data management alongside the app
- Free tier: 1,200 records (we have 264 — well within limit)
- Airtable API rate limit: 5 requests/second

### Future Migration Path

If the system outgrows Airtable:
1. Airtable -> Supabase (PostgreSQL)
2. Add real-time subscriptions
3. Scale to unlimited records

---

## Data Model

### Jobs Table

```
- job_id (auto, primary key)
- date (date)
- crew_name (enum: Jade, Ryan, Jamie, Hedge & Shelter Trimmer)
- full_address (text)
- address_number (text)
- feeder (enum: MOTU 111, MOTU 112, MOTU 113, MOTU 114)
- job_duration_hours (number, decimal)
- spans (number)
- start_time (text)
- end_time (text)
- status (enum: Pending, In Progress, Completed)
- completion_date (date)
- completed_by (text)
- notes (text)
- additional_crews_required (boolean)
```

### Crews Table

```
- crew_id (auto, primary key)
- crew_name (text)
- crew_lead (text)
- contact_info (text)
- active (boolean)
- color_code (text, hex)
```

### Pre-filled Crew Data

| crew_name | color_code | active |
|-----------|-----------|--------|
| Jade | #2E86AB | true |
| Ryan | #A23B72 | true |
| Jamie | #F18F01 | true |
| Hedge & Shelter Trimmer | #6C757D | true |

---

## UI/UX Design

### Color Scheme

**Crew Colors:**
- Jade: #2E86AB (teal)
- Ryan: #A23B72 (purple)
- Jamie: #F18F01 (orange)
- Hedge & Shelter Trimmer: #6C757D (grey)

**Feeder Colors:**
- MOTU 111: #ffa07a20 (light orange)
- MOTU 112: #ff6b6b20 (light red)
- MOTU 113: #45b7d120 (light blue)
- MOTU 114: #4ecdc420 (light teal)

**Status Colors:**
- Completed: #d4edda (light green)
- In Progress: light yellow
- Pending: white

### Views

1. **Dashboard** — Overall statistics and KPIs
2. **Calendar View** — Daily job lists with filtering by date/crew
3. **Crew Summary** — Individual crew performance

### Daily User Flow (Crew Member)

1. Open app on phone
2. App shows today's date (auto-selected)
3. Filter to their crew
4. See list of assigned jobs
5. Tap job card when arriving
6. Tap again when complete
7. Progress updates automatically

### Daily Manager Flow

1. Open app on desktop/tablet
2. View dashboard statistics
3. Check crew progress
4. Export reports if needed
5. Adjust assignments in Airtable

---

## Metrics to Track

### Project Metrics

- Jobs completed / total
- Spans completed / total
- Hours worked / allocated
- Completion percentage
- Average time per job

### System Metrics

- Daily active users
- Jobs marked complete per day
- Page load time
- API response time
- Error rate

---

## Phased Delivery

### Phase 1 — Core (Week 1-2)

- Project setup (Next.js, Airtable, Vercel)
- Import 264 jobs from Excel
- Job list with filtering (date, crew, feeder, status)
- Tap-to-complete functionality
- Dashboard with real-time stats
- Mobile-responsive design
- Deploy to Vercel

### Phase 2 — Enhanced (Week 3-4)

- User authentication
- Advanced reporting and exports
- Photo uploads
- Offline mode
- Push notifications

---

## Known Issues & Decisions

### Data Discrepancy

- HTML version: 161 jobs (Feb 12-26)
- Excel version: 264 jobs (Feb 9-Mar 12)
- **Decision:** Use Excel as source of truth

### Crew Naming

- Excel has "Jade's crew" format
- Standardize to "Jade" in database
- Display as "Jade's Crew" in UI

### Feeder Assignment

- Not all jobs have feeder info in Excel
- Will need to assign MOTU codes during import
- Can update in Airtable after import
