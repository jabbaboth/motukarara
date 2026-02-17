import { getJobs } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import JobList from "@/components/jobs/JobList";
import ProgressBar from "@/components/ui/ProgressBar";
import { CREW_COLORS } from "@/lib/constants";
import { CrewName } from "@/types";
import Link from "next/link";

export const revalidate = 0;

interface CrewDetailPageProps {
  params: { name: string };
}

export default async function CrewDetailPage({ params }: CrewDetailPageProps) {
  const crewName = decodeURIComponent(params.name);
  const color = CREW_COLORS[crewName as CrewName] || "#6C757D";

  let jobs;
  try {
    jobs = await getJobs({ crew: crewName });
  } catch {
    return (
      <div>
        <Header title={crewName} />
        <div className="card p-8 text-center text-gray-500">
          Unable to load crew jobs. Check your Airtable connection.
        </div>
      </div>
    );
  }

  const completed = jobs.filter((j) => j.status === "Completed").length;
  const inProgress = jobs.filter((j) => j.status === "In Progress").length;
  const totalHours = jobs.reduce((sum, j) => sum + j.jobDurationHours, 0);
  const completedHours = jobs
    .filter((j) => j.status === "Completed")
    .reduce((sum, j) => sum + j.jobDurationHours, 0);

  // Group by date
  const jobsByDate: Record<string, typeof jobs> = {};
  for (const job of jobs) {
    if (!jobsByDate[job.date]) {
      jobsByDate[job.date] = [];
    }
    jobsByDate[job.date].push(job);
  }
  const sortedDates = Object.keys(jobsByDate).sort();

  return (
    <div>
      <Header
        title={`${crewName}'s Crew`}
        subtitle={`${jobs.length} jobs assigned`}
        action={
          <Link href="/crew" className="btn-secondary text-sm">
            &larr; All Crews
          </Link>
        }
      />

      {/* Stats */}
      <div className="card p-4 mb-6" style={{ borderTopWidth: 4, borderTopColor: color }}>
        <div className="grid grid-cols-4 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold">{jobs.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-gray-500">Done</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Hours</p>
          </div>
        </div>
        <ProgressBar
          completed={completed}
          total={jobs.length}
          color={color}
        />
        <p className="text-xs text-gray-500 mt-2">
          {completedHours.toFixed(1)} of {totalHours.toFixed(1)} hours completed
        </p>
      </div>

      {/* Jobs grouped by date */}
      <div className="space-y-4">
        {sortedDates.map((date) => {
          const dateJobs = jobsByDate[date];
          const dateObj = new Date(date + "T12:00:00");
          const displayDate = dateObj.toLocaleDateString("en-NZ", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          const dateCompleted = dateJobs.filter(
            (j) => j.status === "Completed"
          ).length;

          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  {displayDate}
                </h3>
                <span className="text-xs text-gray-500">
                  {dateCompleted}/{dateJobs.length} done
                </span>
              </div>
              <JobList initialJobs={dateJobs} compact />
            </div>
          );
        })}
      </div>
    </div>
  );
}
