# Action Plan — Motukarara Powerline Crew Management System

This is your complete roadmap for building the Motu crew management system.

## Project Summary

**Motu** is a web-based real-time crew tracking system for a powerline vegetation contract on Banks Peninsula, New Zealand. It replaces an Excel spreadsheet and a basic HTML tracker with a modern, mobile-friendly application.

- **264 jobs** across 24 working days (Feb 9 - Mar 12, 2026)
- **498.5 total work hours**
- **4 crews:** Jade, Ryan, Jamie, Hedge & Shelter Trimmer
- **4 feeders:** MOTU 111, 112, 113, 114

---

## Current Status (Feb 17, 2026)

**Completed:**
- Requirements analysis
- Technical architecture defined
- Complete documentation created
- GitHub repository created
- All planning documents ready

**In Progress:**
- Organizing GitHub repository
- Setting up Airtable database

**Next Steps:**
1. Run `setup-repo.sh`
2. Create Airtable base
3. Import Excel data
4. Choose implementation path
5. Start development

---

## Three Paths Forward

### Path 1: DIY — Build It Yourself (Recommended)

- **Timeline:** 1-2 weeks
- **Cost:** ~$20/month (Airtable)
- **Best for:** Anyone with basic coding knowledge

**Steps:**
1. Follow `QUICK_START.md` to set up Airtable and import your 264 jobs
2. Follow `docs/implementation_guide.md` for the 2-week build plan
3. Use Next.js + Airtable as the tech stack
4. Deploy to Vercel (free tier)

### Path 2: Hire a Developer

- **Timeline:** ~1 week
- **Cost:** $500-1,500 + $20/month ongoing
- **Best for:** Non-technical users who want a professional result

**Steps:**
1. Post on Upwork or Fiverr
2. Share `docs/developer_prompt.md` as the project brief
3. Budget: $800-1,200 is a reasonable range
4. Review deliverables against `docs/crew_management_system_requirements.md`

### Path 3: Use AI to Generate

- **Timeline:** 2-3 days
- **Cost:** ~$20/month (hosting)
- **Best for:** Users comfortable iterating with AI tools

**Steps:**
1. Open Claude or ChatGPT
2. Paste the contents of `docs/developer_prompt.md`
3. Ask it to build the app step by step
4. Deploy the result to Vercel

---

## Project Timeline

| Week | Focus | Status |
|------|-------|--------|
| Week 1 (Feb 9-14) | Planning & Setup | YOU ARE HERE |
| Week 2 (Feb 17-21) | Development | Next |
| Week 3 (Feb 24-28) | Testing & Deployment | Upcoming |
| Week 4 (Mar 3-7) | Go Live | Upcoming |

### Go-Live Plan

1. Soft launch with 1 crew
2. Full launch with all crews
3. Monitor and support

---

## Key Features — Phase 1 (Must-Have)

- [ ] View all 264 jobs in database
- [ ] Filter by date and crew
- [ ] Mark jobs complete with tap/click
- [ ] Real-time statistics dashboard
- [ ] Mobile-responsive design
- [ ] Automatic sync across devices
- [ ] Works on iOS and Android browsers

## Key Features — Phase 2 (Nice-to-Have)

- [ ] User authentication
- [ ] Photo upload for completed jobs
- [ ] GPS location tracking
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Advanced reporting
- [ ] Excel export
- [ ] Email summaries

---

## Files in This Repository

| File | Purpose |
|------|---------|
| `ACTION_PLAN.md` | This file — your roadmap |
| `QUICK_START.md` | Get running in 1 hour |
| `CLAUDE.md` | AI assistant guide for this repo |
| `setup-repo.sh` | Automated repo setup script |
| `package.json.template` | Pre-configured dependencies |
| `docs/crew_management_system_requirements.md` | Full system analysis and requirements |
| `docs/developer_prompt.md` | Ready-to-use brief for hiring or AI |
| `docs/implementation_guide.md` | 2-week DIY build plan |
| `docs/github_setup_guide.md` | Repository organization guide |
| `scripts/import-excel-to-airtable.js` | Excel-to-Airtable data import |

---

## Data Decision

The Excel spreadsheet (`Motukarara_Delivery_Standardised_With_Addresses.xlsx`) with 264 jobs is the **source of truth**, not the legacy HTML tracker (which only has 161 jobs for a shorter date range).
