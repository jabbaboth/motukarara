"use client";

import { useState, useEffect } from "react";
import { Job, JobStatus } from "@/types";
import { usePolling } from "@/hooks/use-polling";
import JobCard from "./JobCard";

interface JobListProps {
  initialJobs: Job[];
  compact?: boolean;
  /** API URL to poll for updates (enables real-time sync) */
  pollUrl?: string;
  /** Polling interval in ms (default: 10000) */
  pollInterval?: number;
}

export default function JobList({
  initialJobs,
  compact = false,
  pollUrl,
  pollInterval = 10000,
}: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  // Real-time polling when pollUrl is provided
  const { data: polledJobs, lastUpdated } = usePolling<Job[]>({
    url: pollUrl || "",
    interval: pollInterval,
    enabled: !!pollUrl,
  });

  // Update from polling (merge with optimistic local changes)
  useEffect(() => {
    if (polledJobs) {
      setJobs(polledJobs);
    }
  }, [polledJobs]);

  // Reset when initialJobs changes (e.g. filter change)
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  function handleStatusChange(jobId: string, newStatus: JobStatus) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: newStatus,
              completionDate:
                newStatus === "Completed"
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
            }
          : j
      )
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500">No jobs found for these filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          {" — "}
          {jobs.filter((j) => j.status === "Completed").length} completed,{" "}
          {jobs.filter((j) => j.status === "In Progress").length} in progress,{" "}
          {jobs.filter((j) => j.status === "Pending").length} pending
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-400">
            Synced {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onStatusChange={handleStatusChange}
          compact={compact}
        />
      ))}
    </div>
  );
}
