import { getJobs } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { CREW_COLORS } from "@/lib/constants";
import { CrewName } from "@/types";

export const revalidate = 30;

export default async function SchedulePage() {
  let jobs;
  try {
    jobs = await getJobs();
  } catch {
    return (
      <div>
        <Header title="Schedule" subtitle="Calendar view" />
        <div className="card p-8 text-center text-gray-500">
          Unable to load schedule. Check your Airtable connection.
        </div>
      </div>
    );
  }

  // Group jobs by date
  const jobsByDate: Record<string, typeof jobs> = {};
  for (const job of jobs) {
    if (!jobsByDate[job.date]) {
      jobsByDate[job.date] = [];
    }
    jobsByDate[job.date].push(job);
  }

  const sortedDates = Object.keys(jobsByDate).sort();

  // Generate calendar weeks
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <Header
        title="Schedule"
        subtitle="Jobs by date"
        action={
          <Link href="/schedule/daily" className="btn-primary text-sm">
            Daily Sheet
          </Link>
        }
      />

      <div className="space-y-2">
        {sortedDates.map((date) => {
          const dateJobs = jobsByDate[date];
          const completed = dateJobs.filter(
            (j) => j.status === "Completed"
          ).length;
          const totalHours = dateJobs.reduce(
            (sum, j) => sum + j.jobDurationHours,
            0
          );
          const isToday = date === today;
          const isPast = date < today;

          // Count jobs per crew
          const crewCounts: Record<string, number> = {};
          for (const j of dateJobs) {
            crewCounts[j.crewName] = (crewCounts[j.crewName] || 0) + 1;
          }

          const dateObj = new Date(date + "T12:00:00");
          const dayName = dateObj.toLocaleDateString("en-NZ", {
            weekday: "short",
          });
          const displayDate = dateObj.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
          });

          return (
            <Link
              key={date}
              href={`/jobs?date=${date}`}
              className={`card p-4 block hover:shadow-md transition-shadow ${
                isToday ? "ring-2 ring-blue-500" : ""
              } ${isPast && completed === dateJobs.length ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[48px]">
                    <p className="text-xs text-gray-500 uppercase">{dayName}</p>
                    <p className="text-lg font-bold">{displayDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {dateJobs.length} jobs &middot; {totalHours.toFixed(1)}h
                    </p>
                    <div className="flex gap-1 mt-1">
                      {Object.entries(crewCounts).map(([crew, count]) => (
                        <span
                          key={crew}
                          className="text-xs text-white px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor:
                              CREW_COLORS[crew as CrewName] || "#6C757D",
                          }}
                        >
                          {crew === "Hedge & Shelter Trimmer" ? "H&S" : crew}{" "}
                          {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {completed}/{dateJobs.length}
                  </p>
                  <p className="text-xs text-gray-400">done</p>
                </div>
              </div>
              {isToday && (
                <span className="mt-2 inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  TODAY
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
