# Developer Prompt — Motukarara Crew Management System

Use this document as a brief when hiring a developer or when prompting an AI to build the application.

---

## Project Brief

Build a **crew tracking web application** for a powerline vegetation contract on Banks Peninsula, New Zealand. The system manages 264 jobs across 4 crews over 24 working days (Feb 9 - Mar 12, 2026). It replaces Excel tracking with a real-time, mobile-first web app.

### Tech Stack (Required)

- **Framework:** Next.js 14+ (App Router)
- **Database:** Airtable (via REST API)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Language:** TypeScript

### Project Stats

- **264 jobs**, 498.5 total work hours, 24 working days
- **4 crews:** Jade, Ryan, Jamie, Hedge & Shelter Trimmer
- **4 feeders:** MOTU 111, 112, 113, 114
- **Location:** Banks Peninsula, New Zealand

### Core Features (Priority Order)

1. **Job List** — View all 264 jobs, filter by date/crew/feeder/status
2. **Tap-to-Complete** — Mark jobs as complete with a single tap/click
3. **Dashboard** — Real-time stats (total jobs, completed, hours, completion %)
4. **Daily Crew Sheet** — Who goes where today, auto-selects today's date
5. **Calendar View** — Navigate jobs by date
6. **Crew Summary** — Per-crew progress and performance

### Pages Required

```
/                     → Dashboard (stats, today's assignments, progress)
/jobs                 → Job list with search/filter/sort
/jobs?date=2026-02-17 → Jobs filtered by date
/jobs?crew=jade       → Jobs filtered by crew
/schedule             → Calendar view of jobs by date
/schedule/daily       → Daily crew sheet (printable)
/crew                 → Crew overview and performance
/crew/[name]          → Individual crew detail
```

### Database Schema (Airtable)

**Jobs Table:**

| Field | Type |
|-------|------|
| job_id | Auto Number (primary key) |
| date | Date |
| crew_name | Single Select: Jade, Ryan, Jamie, Hedge & Shelter Trimmer |
| full_address | Long Text |
| address_number | Single Line Text |
| feeder | Single Select: MOTU 111, MOTU 112, MOTU 113, MOTU 114 |
| job_duration_hours | Number (decimal) |
| spans | Number |
| start_time | Single Line Text |
| end_time | Single Line Text |
| status | Single Select: Pending, In Progress, Completed |
| completion_date | Date |
| completed_by | Single Line Text |
| notes | Long Text |
| additional_crews_required | Checkbox |

**Crews Table:**

| Field | Type |
|-------|------|
| crew_id | Auto Number (primary key) |
| crew_name | Single Line Text |
| crew_lead | Single Line Text |
| contact_info | Single Line Text |
| active | Checkbox |
| color_code | Single Line Text |

**Pre-fill crews:**
- Jade (#2E86AB), Ryan (#A23B72), Jamie (#F18F01), Hedge & Shelter Trimmer (#6C757D)

### API Layer

Create a service layer in `lib/airtable.ts`:

```typescript
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const jobsTable = base('Jobs');
export const crewsTable = base('Crews');
```

Service functions needed:

```typescript
// Jobs
getJobs(filters?: { date?: string; crew?: string; feeder?: string; status?: string }): Promise<Job[]>
getJobById(id: string): Promise<Job>
updateJobStatus(id: string, status: 'Pending' | 'In Progress' | 'Completed', completedBy?: string): Promise<Job>

// Stats
getDashboardStats(): Promise<{ total: number; completed: number; hours: number; byCrewname: object; byFeeder: object }>
getJobsByDate(date: string): Promise<Job[]>
getJobsByCrew(crewName: string): Promise<Job[]>
```

### Environment Variables

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
```

### UI Design Requirements

**Critical: Mobile-first.** 80% of usage is on phones in the field.

- Large tap targets (minimum 44x44px)
- Minimal text entry — mostly taps and selections
- Must work on 3G networks (rural Banks Peninsula)
- Initial load < 2 seconds
- Job status update < 500ms

**Color Scheme:**

- Crew colors: Jade (#2E86AB teal), Ryan (#A23B72 purple), Jamie (#F18F01 orange)
- Feeder backgrounds: MOTU 111 (#ffa07a20), MOTU 112 (#ff6b6b20), MOTU 113 (#45b7d120), MOTU 114 (#4ecdc420)
- Status: Completed (#d4edda green), In Progress (yellow), Pending (white)

**Daily Crew Member Flow:**
1. Open app on phone → auto-shows today
2. Filter to their crew
3. See list of assigned jobs
4. Tap job card when arriving at site
5. Tap again when complete
6. Progress updates automatically

### Deliverables

1. Working Next.js application with all pages above
2. Airtable integration with read + status updates
3. Mobile-responsive, touch-friendly UI
4. Deployed to Vercel
5. README with setup instructions
6. Clean, well-organized TypeScript code

### Performance Requirements

- Initial load: < 2 seconds
- Job status update: < 500ms
- Support 500+ jobs without lag
- Work on 3G networks
- Respect Airtable rate limit: 5 requests/second

### Budget Guidance

- Upwork/Fiverr range: $500-1,500
- Suggested milestone payments:
  - 30% — Project setup + Job list with filtering
  - 30% — Dashboard + Daily crew sheet
  - 40% — Calendar view + Deployment + Polish

### Timeline

- Expected: 1-2 weeks for an experienced developer
- Maximum: 4 weeks
