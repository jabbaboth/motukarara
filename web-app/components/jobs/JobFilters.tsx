"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CREW_NAMES, FEEDER_NAMES, STATUS_OPTIONS } from "@/lib/constants";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDate = searchParams.get("date") || "";
  const currentCrew = searchParams.get("crew") || "";
  const currentFeeder = searchParams.get("feeder") || "";
  const currentStatus = searchParams.get("status") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jobs?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/jobs");
  }

  function setToday() {
    const today = new Date().toISOString().split("T")[0];
    updateFilter("date", today);
  }

  const hasFilters = currentDate || currentCrew || currentFeeder || currentStatus;

  return (
    <div className="card p-4 mb-4 no-print">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Date filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Date
          </label>
          <div className="flex gap-1">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => updateFilter("date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={setToday}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            Today
          </button>
        </div>

        {/* Crew filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Crew
          </label>
          <select
            value={currentCrew}
            onChange={(e) => updateFilter("crew", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Crews</option>
            {CREW_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Feeder filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Feeder
          </label>
          <select
            value={currentFeeder}
            onChange={(e) => updateFilter("feeder", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Feeders</option>
            {FEEDER_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 text-sm text-red-600 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
