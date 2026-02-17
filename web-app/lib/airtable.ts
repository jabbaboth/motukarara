import Airtable from "airtable";
import { Job, CrewName, FeederName, JobStatus } from "@/types";

function getBase() {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error(
      "Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables"
    );
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
}

function mapRecordToJob(record: Airtable.Record<Airtable.FieldSet>): Job {
  const fields = record.fields;
  return {
    id: record.id,
    date: (fields["date"] as string) || "",
    crewName: (fields["crew_name"] as CrewName) || "Jade",
    fullAddress: (fields["full_address"] as string) || "",
    addressNumber: (fields["address_number"] as string) || "",
    feeder: (fields["feeder"] as FeederName) || "MOTU 111",
    jobDurationHours: (fields["job_duration_hours"] as number) || 0,
    spans: (fields["spans"] as number) || 0,
    startTime: (fields["start_time"] as string) || "",
    endTime: (fields["end_time"] as string) || "",
    status: (fields["status"] as JobStatus) || "Pending",
    completionDate: (fields["completion_date"] as string) || undefined,
    completedBy: (fields["completed_by"] as string) || undefined,
    notes: (fields["notes"] as string) || undefined,
    additionalCrewsRequired: (fields["additional_crews_required"] as boolean) || false,
  };
}

export async function getJobs(filters?: {
  date?: string;
  crew?: string;
  feeder?: string;
  status?: string;
}): Promise<Job[]> {
  const base = getBase();
  const filterFormulas: string[] = [];

  if (filters?.date) {
    filterFormulas.push(`IS_SAME({date}, '${filters.date}', 'day')`);
  }
  if (filters?.crew) {
    filterFormulas.push(`{crew_name} = '${filters.crew}'`);
  }
  if (filters?.feeder) {
    filterFormulas.push(`{feeder} = '${filters.feeder}'`);
  }
  if (filters?.status) {
    filterFormulas.push(`{status} = '${filters.status}'`);
  }

  const formula =
    filterFormulas.length > 0
      ? `AND(${filterFormulas.join(", ")})`
      : "";

  const records = await base("Jobs")
    .select({
      filterByFormula: formula,
      sort: [
        { field: "date", direction: "asc" },
        { field: "start_time", direction: "asc" },
      ],
    })
    .all();

  return records.map(mapRecordToJob);
}

export async function getJobById(id: string): Promise<Job> {
  const base = getBase();
  const record = await base("Jobs").find(id);
  return mapRecordToJob(record);
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
  completedBy?: string
): Promise<Job> {
  const base = getBase();
  const updateFields: Airtable.FieldSet = { status };

  if (status === "Completed") {
    updateFields["completion_date"] = new Date().toISOString().split("T")[0];
    if (completedBy) {
      updateFields["completed_by"] = completedBy;
    }
  } else {
    updateFields["completion_date"] = "";
    updateFields["completed_by"] = "";
  }

  const record = await base("Jobs").update(id, updateFields);
  return mapRecordToJob(record);
}

export async function getDashboardStats() {
  const jobs = await getJobs();

  const stats = {
    totalJobs: jobs.length,
    completedJobs: 0,
    inProgressJobs: 0,
    pendingJobs: 0,
    totalHours: 0,
    completedHours: 0,
    completionPercentage: 0,
    byCrew: {} as Record<string, { total: number; completed: number; hours: number }>,
    byFeeder: {} as Record<string, { total: number; completed: number; hours: number }>,
  };

  for (const job of jobs) {
    stats.totalHours += job.jobDurationHours;

    if (job.status === "Completed") {
      stats.completedJobs++;
      stats.completedHours += job.jobDurationHours;
    } else if (job.status === "In Progress") {
      stats.inProgressJobs++;
    } else {
      stats.pendingJobs++;
    }

    // By crew
    if (!stats.byCrew[job.crewName]) {
      stats.byCrew[job.crewName] = { total: 0, completed: 0, hours: 0 };
    }
    stats.byCrew[job.crewName].total++;
    stats.byCrew[job.crewName].hours += job.jobDurationHours;
    if (job.status === "Completed") {
      stats.byCrew[job.crewName].completed++;
    }

    // By feeder
    if (!stats.byFeeder[job.feeder]) {
      stats.byFeeder[job.feeder] = { total: 0, completed: 0, hours: 0 };
    }
    stats.byFeeder[job.feeder].total++;
    stats.byFeeder[job.feeder].hours += job.jobDurationHours;
    if (job.status === "Completed") {
      stats.byFeeder[job.feeder].completed++;
    }
  }

  stats.completionPercentage =
    stats.totalJobs > 0
      ? Math.round((stats.completedJobs / stats.totalJobs) * 100)
      : 0;

  return stats;
}
