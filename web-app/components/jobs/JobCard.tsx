"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import CrewBadge from "@/components/ui/CrewBadge";
import FeederBadge from "@/components/ui/FeederBadge";
import { CREW_COLORS } from "@/lib/constants";

const nextStatus: Record<JobStatus, JobStatus> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: "Pending",
};

interface JobCardProps {
  job: Job;
  onStatusChange?: (jobId: string, newStatus: JobStatus) => void;
  compact?: boolean;
}

export default function JobCard({
  job,
  onStatusChange,
  compact = false,
}: JobCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const crewColor = CREW_COLORS[job.crewName] || "#6C757D";

  async function handleTap() {
    if (isUpdating) return;
    setIsUpdating(true);

    const newStatus = nextStatus[job.status];
    onStatusChange?.(job.id, newStatus);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        onStatusChange?.(job.id, job.status);
      }
    } catch {
      onStatusChange?.(job.id, job.status);
    } finally {
      setIsUpdating(false);
    }
  }

  if (compact) {
    return (
      <div
        onClick={handleTap}
        className={`card p-3 cursor-pointer active:scale-[0.98] transition-transform ${
          job.status === "Completed" ? "opacity-60" : ""
        }`}
        style={{ borderLeftWidth: 4, borderLeftColor: crewColor }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {job.addressNumber} {job.fullAddress}
            </p>
            <p className="text-xs text-gray-500">
              {job.startTime}–{job.endTime} &middot; {job.jobDurationHours}h
              &middot; {job.spans} spans
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleTap}
      className={`card p-4 cursor-pointer active:scale-[0.98] transition-all min-h-[72px] ${
        job.status === "Completed" ? "opacity-60" : ""
      } ${isUpdating ? "animate-pulse" : ""}`}
      style={{ borderLeftWidth: 4, borderLeftColor: crewColor }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">
            {job.addressNumber} {job.fullAddress}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <CrewBadge crew={job.crewName} />
            <FeederBadge feeder={job.feeder} />
            <span className="text-xs text-gray-500">
              {job.startTime}–{job.endTime}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{job.jobDurationHours}h</span>
            <span>{job.spans} spans</span>
            {job.additionalCrewsRequired && (
              <span className="text-orange-600 font-medium">
                + Extra crew needed
              </span>
            )}
          </div>
          {job.notes && (
            <p className="text-xs text-gray-400 mt-1 truncate">{job.notes}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={job.status} />
        </div>
      </div>
      {job.status === "Completed" && job.completionDate && (
        <p className="text-xs text-green-600 mt-2">
          Completed {job.completionDate}
          {job.completedBy ? ` by ${job.completedBy}` : ""}
        </p>
      )}
    </div>
  );
}
