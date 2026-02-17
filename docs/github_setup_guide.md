# GitHub Setup Guide — Motu Repository Organization

## Repository Structure

After running the setup script, your repository will look like this:

```
Motu/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── crew_management_system_requirements.md
│   ├── developer_prompt.md
│   ├── implementation_guide.md
│   └── github_setup_guide.md
├── scripts/
│   └── import-excel-to-airtable.js
├── src/                              # Created during implementation
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.local.example
├── .gitignore
├── ACTION_PLAN.md
├── CLAUDE.md
├── QUICK_START.md
├── README.md
├── package.json.template
└── setup-repo.sh
```

---

## Branch Strategy

### Main Branches

- `main` — Production-ready code, always deployable
- `develop` — Integration branch for features in progress

### Feature Branches

Create a branch for each feature:

```bash
git checkout -b feature/job-management
# ... make changes ...
git add .
git commit -m "Add job list and detail pages"
git push -u origin feature/job-management
# Create PR to merge into develop
```

### Branch Naming Convention

- `feature/<description>` — New features
- `fix/<description>` — Bug fixes
- `docs/<description>` — Documentation changes
- `refactor/<description>` — Code refactoring

---

## Environment Setup

### Required Environment Variables

Create `.env.local` (never committed to Git):

```bash
# Airtable
AIRTABLE_API_KEY=pat_your_token_here
AIRTABLE_BASE_ID=app_your_base_id_here

# NextAuth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### .env.local.example (Committed to Git)

```bash
# Copy this file to .env.local and fill in your values
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## Deployment to Vercel

### First-Time Setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import the `jabbaboth/Motu` repository
4. Add environment variables in the Vercel dashboard:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel domain)
5. Deploy

### Automatic Deployments

Once connected, Vercel automatically deploys:
- **Production** — Every push to `main`
- **Preview** — Every push to other branches / every PR

---

## GitHub Issues & Project Board

### Setting Up a Project Board

1. Go to your repo on GitHub
2. Click "Projects" tab
3. Create a new project (Board view)
4. Add columns: `Backlog`, `To Do`, `In Progress`, `Review`, `Done`

### Suggested Initial Issues

Create these issues to track your build:

1. **Set up Next.js project with TypeScript and Tailwind**
2. **Create Airtable service layer**
3. **Build job list and detail pages**
4. **Build crew member list and detail pages**
5. **Implement assignment/scheduling system**
6. **Create daily crew sheet view**
7. **Add calendar view**
8. **Build reporting dashboard**
9. **Set up authentication with NextAuth**
10. **Deploy to Vercel**

---

## CI/CD Pipeline

The `setup-repo.sh` script creates a basic GitHub Actions workflow at `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

This ensures every push and PR is automatically checked for build and lint errors.
