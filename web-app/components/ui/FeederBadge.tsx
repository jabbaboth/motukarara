import { FeederName } from "@/types";

const feederBorders: Record<FeederName, string> = {
  "MOTU 111": "border-orange-300 bg-orange-50 text-orange-700",
  "MOTU 112": "border-red-300 bg-red-50 text-red-700",
  "MOTU 113": "border-sky-300 bg-sky-50 text-sky-700",
  "MOTU 114": "border-teal-300 bg-teal-50 text-teal-700",
};

export default function FeederBadge({ feeder }: { feeder: FeederName }) {
  const style = feederBorders[feeder] || "border-gray-300 bg-gray-50 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style}`}
    >
      {feeder}
    </span>
  );
}
