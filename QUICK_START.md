# Quick Start — Get Running in 1 Hour

This guide gets you from zero to a working crew management prototype as fast as possible.

---

## Step 1: Set Up Airtable (15 minutes)

1. Go to [airtable.com](https://airtable.com) and create a free account
2. Create a new base called **"Motukarara Crew Management"**
3. Create the following tables:

### Jobs Table

| Field Name | Field Type | Notes |
|-----------|-----------|-------|
| job_id | Auto Number | Primary key |
| date | Date | Scheduled date |
| crew_name | Single Select | Options: `Jade`, `Ryan`, `Jamie`, `Hedge & Shelter Trimmer` |
| full_address | Long Text | Job site address |
| address_number | Single Line Text | Street number |
| feeder | Single Select | Options: `MOTU 111`, `MOTU 112`, `MOTU 113`, `MOTU 114` |
| job_duration_hours | Number (decimal) | Estimated hours |
| spans | Number | Number of spans |
| start_time | Single Line Text | Planned start |
| end_time | Single Line Text | Planned end |
| status | Single Select | Options: `Pending`, `In Progress`, `Completed` |
| completion_date | Date | When marked complete |
| completed_by | Single Line Text | Who completed it |
| notes | Long Text | Additional details |
| additional_crews_required | Checkbox | Needs extra crew |

### Crews Table

| Field Name | Field Type | Notes |
|-----------|-----------|-------|
| crew_id | Auto Number | Primary key |
| crew_name | Single Line Text | e.g., Jade, Ryan, Jamie |
| crew_lead | Single Line Text | Lead person name |
| contact_info | Single Line Text | Phone or email |
| active | Checkbox | Currently active |
| color_code | Single Line Text | Hex color for UI (e.g., #2E86AB) |

**Pre-fill Crews table:**

| crew_name | color_code | active |
|-----------|-----------|--------|
| Jade | #2E86AB | Yes |
| Ryan | #A23B72 | Yes |
| Jamie | #F18F01 | Yes |
| Hedge & Shelter Trimmer | #6C757D | Yes |

---

## Step 2: Import Your Jobs from Excel (15 minutes)

### Option A: Manual Import (Easiest)

1. Open `Motukarara_Delivery_Standardised_With_Addresses.xlsx`
2. Save/export as CSV
3. In Airtable, click the **"+"** on the Jobs table toolbar
4. Select **"CSV file"** import
5. Map your Excel columns to the Airtable fields above
6. Review and confirm the import

### Option B: Scripted Import

1. Export your Excel file as CSV
2. Install Node.js if you don't have it: [nodejs.org](https://nodejs.org)
3. Run:
   ```bash
   cd Motu
   npm install airtable csv-parser
   node scripts/import-excel-to-airtable.js --file data/excel/your-jobs.csv
   ```

---

## Step 3: Get API Credentials (10 minutes)

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a new personal access token
3. Give it these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
4. Select your "Motukarara Crew Management" base
5. Copy the token

Get your Base ID:
1. Go to [airtable.com/api](https://airtable.com/api)
2. Click on your "Motukarara Crew Management" base
3. The Base ID starts with `app...` — copy it

Create a `.env.local` file:
```bash
AIRTABLE_API_KEY=pat...your_token_here
AIRTABLE_BASE_ID=app...your_base_id_here
NEXTAUTH_SECRET=any_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

---

## Step 4: Run the App Locally (20 minutes)

```bash
# Clone the repo (if you haven't already)
git clone https://github.com/jabbaboth/Motu.git
cd Motu

# Set up directory structure
bash setup-repo.sh

# Install dependencies (copy template first if no package.json yet)
cp package.json.template package.json
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Airtable credentials

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## What You Should See

After completing these steps:

- A dashboard showing project stats (264 jobs, 498.5 hours, etc.)
- Today's jobs for each crew
- Ability to filter by crew and date
- Tap/click to mark jobs as complete
- Real-time progress tracking

---

## Daily User Flow (Crew Member)

1. Open app on phone
2. App shows today's date (auto-selected)
3. Filter to their crew
4. See list of assigned jobs
5. Tap job card when arriving
6. Tap again when complete
7. Progress updates automatically

---

## Next Steps

- **Want to build more features?** See `docs/implementation_guide.md`
- **Want to hire a developer?** See `docs/developer_prompt.md`
- **Want the full requirements?** See `docs/crew_management_system_requirements.md`
- **Need to deploy?** See `docs/github_setup_guide.md` for deployment instructions
