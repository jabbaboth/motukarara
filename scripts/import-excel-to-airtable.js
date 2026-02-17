#!/usr/bin/env node

/**
 * Import Excel/CSV data into Airtable for the Motu Crew Management System
 *
 * Supports:
 *   - .xlsx / .xls files (Excel)
 *   - .csv files
 *
 * Usage:
 *   node scripts/import-excel-to-airtable.js --file data/excel/Motukarara_Delivery_Standardised_With_Addresses.xlsx
 *   node scripts/import-excel-to-airtable.js --file data/jobs.csv
 *   node scripts/import-excel-to-airtable.js --file data/jobs.csv --dry-run
 *   node scripts/import-excel-to-airtable.js --file data/jobs.csv --sheet "Sheet1"
 *
 * Prerequisites:
 *   npm install airtable xlsx csv-parser
 *
 * Environment variables (in .env.local):
 *   AIRTABLE_API_KEY=pat_your_token
 *   AIRTABLE_BASE_ID=app_your_base_id
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Load environment variables from .env.local
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TABLE_NAME = "Jobs";
const BATCH_SIZE = 10; // Airtable max per request
const RATE_LIMIT_DELAY_MS = 220; // Stay under 5 req/s

const VALID_CREWS = ["Jade", "Ryan", "Jamie", "Hedge & Shelter Trimmer"];
const VALID_FEEDERS = ["MOTU 111", "MOTU 112", "MOTU 113", "MOTU 114"];
const VALID_STATUSES = ["Pending", "In Progress", "Completed"];

// ---------------------------------------------------------------------------
// Column name aliases — maps common Excel/CSV header variations to our fields
// ---------------------------------------------------------------------------
const COLUMN_ALIASES = {
  date: ["date", "scheduled_date", "scheduled date", "job_date", "job date", "work_date", "work date"],
  crew_name: [
    "crew_name", "crew name", "crew", "assigned_crew", "assigned crew",
    "crew_assigned", "crew assigned", "team", "team_name", "team name",
  ],
  full_address: [
    "full_address", "full address", "address", "site_address", "site address",
    "location", "job_address", "job address", "street_address", "street address",
  ],
  address_number: [
    "address_number", "address number", "street_number", "street number",
    "number", "house_number", "house number", "no", "no.",
  ],
  feeder: ["feeder", "feeder_name", "feeder name", "motu", "circuit", "line"],
  job_duration_hours: [
    "job_duration_hours", "job duration hours", "duration_hours", "duration hours",
    "duration", "hours", "estimated_hours", "estimated hours", "time",
    "job_duration", "job duration",
  ],
  spans: ["spans", "span", "span_count", "span count", "number_of_spans", "number of spans"],
  start_time: ["start_time", "start time", "start", "time_start", "time start", "begin"],
  end_time: ["end_time", "end time", "end", "time_end", "time end", "finish"],
  status: ["status", "job_status", "job status", "state"],
  notes: ["notes", "note", "comments", "comment", "description", "details", "remarks"],
  additional_crews_required: [
    "additional_crews_required", "additional crews required", "extra_crew",
    "extra crew", "additional_crew", "additional crew", "extra",
  ],
};

// ---------------------------------------------------------------------------
// Parse CLI arguments
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { file: null, dryRun: false, sheet: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) {
      opts.file = path.resolve(args[++i]);
    } else if (args[i] === "--dry-run") {
      opts.dryRun = true;
    } else if (args[i] === "--sheet" && args[i + 1]) {
      opts.sheet = args[++i];
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Motu — Import Excel/CSV to Airtable

Usage:
  node scripts/import-excel-to-airtable.js --file <path> [--dry-run] [--sheet <name>]

Options:
  --file <path>    Path to .xlsx, .xls, or .csv file (required)
  --dry-run        Preview the import without writing to Airtable
  --sheet <name>   Excel sheet name (default: first sheet)
  -h, --help       Show this help message

Examples:
  node scripts/import-excel-to-airtable.js --file data/excel/Motukarara_Delivery_Standardised_With_Addresses.xlsx
  node scripts/import-excel-to-airtable.js --file data/jobs.csv --dry-run
`);
      process.exit(0);
    }
  }

  if (!opts.file) {
    console.error("Error: --file is required. Use --help for usage.");
    process.exit(1);
  }
  if (!fs.existsSync(opts.file)) {
    console.error(`Error: File not found: ${opts.file}`);
    process.exit(1);
  }

  return opts;
}

// ---------------------------------------------------------------------------
// Read data from file (xlsx or csv)
// ---------------------------------------------------------------------------
async function readFile(filePath, sheetName) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".xlsx" || ext === ".xls") {
    return readExcel(filePath, sheetName);
  } else if (ext === ".csv") {
    return readCSV(filePath);
  } else {
    console.error(`Error: Unsupported file type "${ext}". Use .xlsx, .xls, or .csv`);
    process.exit(1);
  }
}

function readExcel(filePath, sheetName) {
  let XLSX;
  try {
    XLSX = require("xlsx");
  } catch {
    console.error("Error: xlsx package not installed. Run: npm install xlsx");
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const name = sheetName || workbook.SheetNames[0];

  if (!workbook.SheetNames.includes(name)) {
    console.error(`Error: Sheet "${name}" not found. Available sheets: ${workbook.SheetNames.join(", ")}`);
    process.exit(1);
  }

  console.log(`Reading sheet: "${name}"`);
  const sheet = workbook.Sheets[name];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function readCSV(filePath) {
  let csvParser;
  try {
    csvParser = require("csv-parser");
  } catch {
    console.error("Error: csv-parser package not installed. Run: npm install csv-parser");
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Column matching — find the best match for each field
// ---------------------------------------------------------------------------
function buildColumnMap(headers) {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());
  const map = {};

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    let matched = null;
    for (const alias of aliases) {
      const idx = lowerHeaders.indexOf(alias);
      if (idx !== -1) {
        matched = headers[idx]; // Use original case
        break;
      }
    }
    map[field] = matched;
  }

  return map;
}

// ---------------------------------------------------------------------------
// Normalize values
// ---------------------------------------------------------------------------
function normalizeCrewName(raw) {
  if (!raw) return "Jade"; // Default
  const s = String(raw).trim();

  // Direct match
  const direct = VALID_CREWS.find((c) => c.toLowerCase() === s.toLowerCase());
  if (direct) return direct;

  // Partial match
  const lower = s.toLowerCase();
  if (lower.includes("jade")) return "Jade";
  if (lower.includes("ryan")) return "Ryan";
  if (lower.includes("jamie")) return "Jamie";
  if (lower.includes("hedge") || lower.includes("shelter") || lower.includes("h&s") || lower.includes("h & s"))
    return "Hedge & Shelter Trimmer";

  return s; // Return as-is; will be flagged as warning
}

function normalizeFeeder(raw) {
  if (!raw) return "";
  const s = String(raw).trim();

  // Direct match
  const direct = VALID_FEEDERS.find((f) => f.toLowerCase() === s.toLowerCase());
  if (direct) return direct;

  // Extract number
  const numMatch = s.match(/(\d{3})/);
  if (numMatch) {
    const num = numMatch[1];
    if (["111", "112", "113", "114"].includes(num)) {
      return `MOTU ${num}`;
    }
  }

  return s;
}

function normalizeStatus(raw) {
  if (!raw) return "Pending";
  const s = String(raw).trim().toLowerCase();

  if (s === "completed" || s === "done" || s === "finished") return "Completed";
  if (s === "in progress" || s === "active" || s === "started" || s === "in_progress") return "In Progress";
  return "Pending";
}

function normalizeDate(raw) {
  if (!raw) return "";
  // Handle Excel serial date numbers
  if (typeof raw === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + raw * 86400000);
    return date.toISOString().split("T")[0];
  }
  const s = String(raw).trim();
  // Try ISO format already
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // Try DD/MM/YYYY (NZ format)
  const nzMatch = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (nzMatch) {
    const [, day, month, year] = nzMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  // Try Date constructor as fallback
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return s;
}

function normalizeDuration(raw) {
  if (!raw && raw !== 0) return 0;
  const n = parseFloat(String(raw));
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

function normalizeBoolean(raw) {
  if (!raw) return false;
  const s = String(raw).trim().toLowerCase();
  return ["true", "yes", "1", "y", "x"].includes(s);
}

// ---------------------------------------------------------------------------
// Map a row to Airtable fields
// ---------------------------------------------------------------------------
function mapRow(row, columnMap) {
  const get = (field) => {
    const col = columnMap[field];
    return col ? row[col] : undefined;
  };

  const fields = {};

  const date = normalizeDate(get("date"));
  if (date) fields["date"] = date;

  const crew = normalizeCrewName(get("crew_name"));
  if (crew) fields["crew_name"] = crew;

  const address = String(get("full_address") || "").trim();
  if (address) fields["full_address"] = address;

  const addrNum = String(get("address_number") || "").trim();
  if (addrNum) fields["address_number"] = addrNum;

  const feeder = normalizeFeeder(get("feeder"));
  if (feeder) fields["feeder"] = feeder;

  const duration = normalizeDuration(get("job_duration_hours"));
  if (duration > 0) fields["job_duration_hours"] = duration;

  const spans = parseInt(String(get("spans") || "0"), 10);
  if (!isNaN(spans) && spans > 0) fields["spans"] = spans;

  const startTime = String(get("start_time") || "").trim();
  if (startTime) fields["start_time"] = startTime;

  const endTime = String(get("end_time") || "").trim();
  if (endTime) fields["end_time"] = endTime;

  fields["status"] = normalizeStatus(get("status"));

  const notes = String(get("notes") || "").trim();
  if (notes) fields["notes"] = notes;

  const extraCrew = normalizeBoolean(get("additional_crews_required"));
  if (extraCrew) fields["additional_crews_required"] = true;

  return fields;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validate(records) {
  const warnings = [];
  let errors = 0;

  records.forEach((rec, i) => {
    const row = i + 1;
    if (!rec.date) {
      warnings.push(`Row ${row}: Missing date`);
    }
    if (!rec.full_address) {
      warnings.push(`Row ${row}: Missing address`);
    }
    if (rec.crew_name && !VALID_CREWS.includes(rec.crew_name)) {
      warnings.push(`Row ${row}: Unknown crew "${rec.crew_name}" — will be created as-is in Airtable`);
    }
    if (rec.feeder && !VALID_FEEDERS.includes(rec.feeder)) {
      warnings.push(`Row ${row}: Unknown feeder "${rec.feeder}"`);
      errors++;
    }
  });

  return { warnings, errors };
}

// ---------------------------------------------------------------------------
// Import to Airtable
// ---------------------------------------------------------------------------
async function importToAirtable(records) {
  const Airtable = require("airtable");
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    console.error("Error: Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in .env.local");
    process.exit(1);
  }

  const base = new Airtable({ apiKey }).base(baseId);
  let imported = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const airtableRecords = batch.map((fields) => ({ fields }));

    try {
      const created = await base(TABLE_NAME).create(airtableRecords);
      imported += created.length;
      process.stdout.write(`\r  Imported ${imported}/${records.length} records...`);
    } catch (error) {
      console.error(`\nError at batch starting row ${i + 1}: ${error.message}`);
      if (error.message.includes("INVALID_VALUE_FOR_COLUMN")) {
        console.error("  Check that your Airtable table has the correct field types and select options.");
      }
      throw error;
    }

    // Rate limiting
    if (i + BATCH_SIZE < records.length) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY_MS));
    }
  }

  console.log(""); // newline after \r progress
  return imported;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs();

  console.log("=== Motu — Import to Airtable ===\n");
  console.log(`File:      ${opts.file}`);
  console.log(`Table:     ${TABLE_NAME}`);
  console.log(`Dry run:   ${opts.dryRun ? "YES (no data will be written)" : "No"}\n`);

  // Read file
  const rows = await readFile(opts.file, opts.sheet);
  console.log(`Rows read: ${rows.length}\n`);

  if (rows.length === 0) {
    console.error("Error: No data rows found in file.");
    process.exit(1);
  }

  // Detect columns
  const headers = Object.keys(rows[0]);
  console.log("Detected columns:");
  headers.forEach((h) => console.log(`  - ${h}`));
  console.log("");

  const columnMap = buildColumnMap(headers);
  console.log("Column mapping:");
  for (const [field, col] of Object.entries(columnMap)) {
    const status = col ? `"${col}"` : "(not found)";
    console.log(`  ${field.padEnd(30)} → ${status}`);
  }
  console.log("");

  // Map rows
  const records = rows.map((row) => mapRow(row, columnMap));

  // Validate
  const { warnings, errors } = validate(records);
  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w) => console.log(`  ⚠ ${w}`));
    if (warnings.length > 20) {
      console.log(`  ... and ${warnings.length - 20} more`);
    }
    console.log("");
  }

  // Summary
  const withDate = records.filter((r) => r.date).length;
  const withAddress = records.filter((r) => r.full_address).length;
  const crewCounts = {};
  records.forEach((r) => {
    const c = r.crew_name || "(none)";
    crewCounts[c] = (crewCounts[c] || 0) + 1;
  });

  console.log("Import summary:");
  console.log(`  Total records:     ${records.length}`);
  console.log(`  With date:         ${withDate}`);
  console.log(`  With address:      ${withAddress}`);
  console.log(`  By crew:`);
  for (const [crew, count] of Object.entries(crewCounts)) {
    console.log(`    ${crew.padEnd(28)} ${count}`);
  }
  console.log("");

  // Preview first 3 records
  console.log("Preview (first 3 records):");
  records.slice(0, 3).forEach((r, i) => {
    console.log(`  [${i + 1}] ${r.date || "?"} | ${r.crew_name || "?"} | ${r.full_address || "?"} | ${r.feeder || "?"} | ${r.job_duration_hours || 0}h`);
  });
  console.log("");

  if (opts.dryRun) {
    console.log("Dry run complete — no data was written to Airtable.");
    return;
  }

  if (errors > 0) {
    console.error(`Aborting: ${errors} error(s) found. Fix them and retry.`);
    process.exit(1);
  }

  // Import
  console.log("Importing to Airtable...");
  const imported = await importToAirtable(records);
  console.log(`\nDone! ${imported} records imported to "${TABLE_NAME}".`);
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
