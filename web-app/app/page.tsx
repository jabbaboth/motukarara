import { getDashboardStats, getJobs } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import StatsOverview from "@/components/dashboard/StatsOverview";
import CrewProgress from "@/components/dashboard/CrewProgress";
import FeederBreakdown from "@/components/dashboard/FeederBreakdown";
import JobList from "@/components/jobs/JobList";
import Link from "next/link";

export const revalidate = 30;

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  let stats;
  let todaysJobs;

  try {
    [stats, todaysJobs] = await Promise.all([
      getDashboardStats(),
      getJobs({ date: today }),
    ]);
  } catch {
    return (
      <div>
        <Header
          title="Dashboard"
          subtitle="Motukarara Crew Management"
        />
        <div className="card p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Connect to Airtable
          </h2>
          <p className="text-gray-500 mb-4">
            Set your <code className="bg-gray-100 px-1 rounded">AIRTABLE_API_KEY</code> and{" "}
            <code className="bg-gray-100 px-1 rounded">AIRTABLE_BASE_ID</code> environment
            variables to get started.
          </p>
          <p className="text-sm text-gray-400">
            See QUICK_START.md for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Motukarara Crew Management"
      />

      <StatsOverview stats={stats} />

      <div className="grid md:grid-cols-2 gap-6">
        <CrewProgress stats={stats} />
        <FeederBreakdown stats={stats} />
      </div>

      {/* Today's jobs */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            Today&apos;s Jobs ({todaysJobs.length})
          </h2>
          <Link
            href={`/jobs?date=${today}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        {todaysJobs.length > 0 ? (
          <JobList initialJobs={todaysJobs} compact pollUrl={`/api/jobs?date=${today}`} />
        ) : (
          <div className="card p-6 text-center text-gray-500">
            No jobs scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
}
