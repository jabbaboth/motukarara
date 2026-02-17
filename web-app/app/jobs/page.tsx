import { getJobs } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import { Suspense } from "react";

export const revalidate = 0;

interface JobsPageProps {
  searchParams: {
    date?: string;
    crew?: string;
    feeder?: string;
    status?: string;
  };
}

async function JobsContent({ searchParams }: JobsPageProps) {
  const filters = {
    date: searchParams.date || undefined,
    crew: searchParams.crew || undefined,
    feeder: searchParams.feeder || undefined,
    status: searchParams.status || undefined,
  };

  let jobs;
  try {
    jobs = await getJobs(filters);
  } catch {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500">
          Unable to load jobs. Check your Airtable connection.
        </p>
      </div>
    );
  }

  const params = new URLSearchParams();
  if (filters.date) params.set("date", filters.date);
  if (filters.crew) params.set("crew", filters.crew);
  if (filters.feeder) params.set("feeder", filters.feeder);
  if (filters.status) params.set("status", filters.status);
  const pollUrl = `/api/jobs?${params.toString()}`;

  return <JobList initialJobs={jobs} pollUrl={pollUrl} />;
}

export default function JobsPage({ searchParams }: JobsPageProps) {
  const activeFilters = [
    searchParams.date,
    searchParams.crew,
    searchParams.feeder,
    searchParams.status,
  ].filter(Boolean);

  return (
    <div>
      <Header
        title="Jobs"
        subtitle={
          activeFilters.length > 0
            ? `Filtered by ${activeFilters.length} criteria`
            : "All 264 jobs"
        }
      />
      <Suspense fallback={null}>
        <JobFilters />
      </Suspense>
      <Suspense
        fallback={
          <div className="card p-8 text-center">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        }
      >
        <JobsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
