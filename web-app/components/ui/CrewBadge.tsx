import { CrewName } from "@/types";
import { CREW_COLORS } from "@/lib/constants";

export default function CrewBadge({ crew }: { crew: CrewName }) {
  const color = CREW_COLORS[crew] || "#6C757D";
  const shortName =
    crew === "Hedge & Shelter Trimmer" ? "H&S" : crew;

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {shortName}
    </span>
  );
}
