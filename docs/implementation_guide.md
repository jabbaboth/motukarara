# Implementation Guide — 2-Week DIY Build Plan

Follow this guide step-by-step to build the Motukarara crew management system yourself.

---

## Prerequisites

- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- Git installed
- A code editor (VS Code recommended)
- Airtable account with the base set up (see `QUICK_START.md`)
- GitHub account
- Vercel account ([vercel.com](https://vercel.com))

---

## Week 1: Foundation

### Day 1-2: Project Setup

```bash
# Clone and enter the project
git clone https://github.com/jabbaboth/Motu.git
cd Motu

# Run the setup script
bash setup-repo.sh

# Initialize Next.js in the web-app directory
cd web-app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
npm install airtable

# Create environment file
cp ../.env.local.example .env.local
# Edit .env.local with your Airtable credentials
```

**Project structure:**

```
web-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard
│   ├── jobs/
│   │   └── page.tsx          # Job list with filters
│   ├── schedule/
│   │   ├── page.tsx          # Calendar view
│   │   └── daily/page.tsx    # Daily crew sheet
│   ├── crew/
│   │   ├── page.tsx          # Crew overview
│   │   └── [name]/page.tsx   # Individual crew detail
│   └── api/
│       ├── jobs/route.ts
│       └── stats/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx       # Individual job with tap-to-complete
│   │   ├── JobList.tsx       # Filtered list of jobs
│   │   └── JobFilters.tsx    # Date/crew/feeder/status filters
│   ├── dashboard/
│   │   ├── StatsOverview.tsx # Top-level numbers
│   │   ├── CrewProgress.tsx  # Per-crew progress bars
│   │   └── FeederBreakdown.tsx
│   └── ui/
│       ├── StatusBadge.tsx
│       └── ProgressBar.tsx
├── lib/
│   ├── airtable.ts           # Airtable client setup
│   ├── jobs.ts               # Job service functions
│   └── stats.ts              # Dashboard stats
├── hooks/
│   └── useJobs.ts            # Client-side data fetching
└── types/
    └── index.ts              # TypeScript type definitions
```

### Day 2-3: Airtable Service Layer

Create `lib/airtable.ts`:

```typescript
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const jobsTable = base('Jobs');
export const crewsTable = base('Crews');
```

Create type definitions in `types/index.ts`:

```typescript
export interface Job {
  id: string;
  date: string;
  crewName: 'Jade' | 'Ryan' | 'Jamie' | 'Hedge & Shelter Trimmer';
  fullAddress: string;
  addressNumber: string;
  feeder: 'MOTU 111' | 'MOTU 112' | 'MOTU 113' | 'MOTU 114';
  jobDurationHours: number;
  spans: number;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completionDate?: string;
  completedBy?: string;
  notes?: string;
  additionalCrewsRequired: boolean;
}

export interface Crew {
  id: string;
  crewName: string;
  crewLead: string;
  contactInfo: string;
  active: boolean;
  colorCode: string;
}

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  totalHours: number;
  completedHours: number;
  completionPercentage: number;
  byCrewname: Record<string, { total: number; completed: number }>;
  byFeeder: Record<string, { total: number; completed: number }>;
}
```

### Day 3-4: Job List & Filtering

Build in this order:
1. Job list page showing all 264 jobs
2. Filter by date (auto-select today)
3. Filter by crew (Jade, Ryan, Jamie, Hedge & Shelter Trimmer)
4. Filter by feeder (MOTU 111-114)
5. Filter by status (Pending, In Progress, Completed)
6. Color-coded crew and feeder indicators

### Day 4-5: Tap-to-Complete

The core interaction — marking a job as complete:
1. JobCard component with large tap target (44x44px minimum)
2. Tap once → status changes to "In Progress"
3. Tap again → status changes to "Completed" + records completion_date
4. Optimistic UI update (don't wait for API response)
5. Visual feedback: status color changes immediately

---

## Week 2: Dashboard & Polish

### Day 6-7: Dashboard

1. Stats overview: total jobs (264), completed, remaining, hours (498.5)
2. Overall completion percentage with progress bar
3. Per-crew progress bars with crew colors
4. Per-feeder breakdown
5. Today's jobs summary

### Day 8-9: Calendar & Daily View

1. Calendar component — navigate by date
2. Show job count per date
3. Click date to see that day's jobs
4. Daily crew sheet — one card per crew showing their jobs
5. Printable daily sheet (use `@media print` CSS)

### Day 10: Crew Views

1. Crew overview page — all 4 crews with their stats
2. Individual crew page — jobs assigned to that crew
3. Crew-colored headers and progress indicators

### Day 11-12: Mobile Polish & Deploy

1. Test on phones (iOS Safari, Android Chrome)
2. Ensure large tap targets everywhere
3. Fix any responsive layout issues
4. Add loading states
5. Deploy to Vercel:
   ```bash
   npm install -g vercel
   vercel
   # Add environment variables in Vercel dashboard
   ```

### Day 13-14: Testing & Launch

1. Test all filtering combinations
2. Test tap-to-complete on mobile
3. Test with spotty network (3G simulation)
4. Soft launch with 1 crew
5. Full launch with all crews

---

## Tips

- **Start simple** — Get the job list and tap-to-complete working first. That's the core value.
- **Mobile first** — Test on your phone constantly. If it works on mobile, desktop will be fine.
- **Commit often** — Small, frequent commits make it easy to undo mistakes.
- **Use Airtable's UI** — For quick data fixes, use the Airtable interface directly.
- **Don't perfectionism** — A working app on day 3 beats a perfect app on day 14.
- **Respect rate limits** — Airtable allows 5 requests/second. Batch where possible.
