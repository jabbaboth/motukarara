import { getJobs } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import DailyControls from "@/components/layout/DailyControls";
import { CREW_COLORS, CREW_NAMES } from "@/lib/constants";
import { CrewName, Job } from "@/types";
import JobList from "@/components/jobs/JobList";

export const revalidate = 0;

interface DailyPageProps {
  searchParams: { date?: string };
}

export default async function DailyCrewSheet({
  searchParams,
}: DailyPageProps) {
  const date =
    searchParams.date || new Date().toISOString().split("T")[0];

  let jobs: Job[];
  try {
    jobs = await getJobs({ date });
  } catch {
    return (
      <div>
        <Header title="Daily Crew Sheet" />
        <div className="card p-8 text-center text-gray-500">
          Unable to load jobs. Check your Airtable connection.
        </div>
      </div>
    );
  }

  const dateObj = new Date(date + "T12:00:00");
  const displayDate = dateObj.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Group by crew
  const jobsByCrew: Record<string, Job[]> = {};
  for (const name of CREW_NAMES) {
    jobsByCrew[name] = [];
  }
  for (const job of jobs) {
    if (!jobsByCrew[job.crewName]) {
      jobsByCrew[job.crewName] = [];
    }
    jobsByCrew[job.crewName].push(job);
  }

  const totalHours = jobs.reduce((sum, j) => sum + j.jobDurationHours, 0);
  const completed = jobs.filter((j) => j.status === "Completed").length;

  return (
    <div>
      <Header
        title="Daily Crew Sheet"
        subtitle={displayDate}
        action={<DailyControls date={date} />}
      />

      {/* Day summary */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-2xl font-bold">{jobs.length}</p>
            <p className="text-xs text-gray-500">Total Jobs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Hours</p>
          </div>
        </div>
      </div>

      {/* Crew sections */}
      <div className="space-y-6">
        {CREW_NAMES.map((crewName) => {
          const crewJobs = jobsByCrew[crewName];
          if (crewJobs.length === 0) return null;

          const color = CREW_COLORS[crewName as CrewName];
          const crewHours = crewJobs.reduce(
            (sum, j) => sum + j.jobDurationHours,
            0
          );
          const crewCompleted = crewJobs.filter(
            (j) => j.status === "Completed"
          ).length;

          return (
            <div key={crewName}>
              <div
                className="flex items-center justify-between px-3 py-2 rounded-t-lg text-white"
                style={{ backgroundColor: color }}
              >
                <h2 className="font-semibold">
                  {crewName}&apos;s Crew
                </h2>
                <span className="text-sm">
                  {crewJobs.length} jobs &middot; {crewHours.toFixed(1)}h
                  &middot; {crewCompleted} done
                </span>
              </div>
              <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white">
                <div className="p-2">
                  <JobList initialJobs={crewJobs} compact />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <div className="card p-8 text-center text-gray-500">
          No jobs scheduled for this date.
        </div>
      )}
    </div>
  );
}
