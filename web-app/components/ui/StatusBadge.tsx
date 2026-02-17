import { JobStatus } from "@/types";

const statusStyles: Record<JobStatus, string> = {
  Completed: "bg-green-100 text-green-800 border-green-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Pending: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
