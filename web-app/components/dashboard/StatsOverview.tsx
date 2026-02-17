import { DashboardStats } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

function StatCard({ label, value, subtext, color }: StatCardProps) {
  return (
    <div className="card p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1" style={color ? { color } : {}}>
        {value}
      </p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function StatsOverview({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Jobs"
        value={stats.totalJobs}
        subtext={`${stats.totalHours.toFixed(1)} hours`}
      />
      <StatCard
        label="Completed"
        value={stats.completedJobs}
        subtext={`${stats.completedHours.toFixed(1)} hours done`}
        color="#16a34a"
      />
      <StatCard
        label="Remaining"
        value={stats.pendingJobs + stats.inProgressJobs}
        subtext={`${stats.inProgressJobs} in progress`}
      />
      <StatCard
        label="Progress"
        value={`${stats.completionPercentage}%`}
        subtext={`${stats.completedJobs} of ${stats.totalJobs} jobs`}
        color="#2E86AB"
      />
    </div>
  );
}
