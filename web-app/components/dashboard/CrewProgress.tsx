import { DashboardStats } from "@/types";
import { CREW_COLORS, CREW_NAMES } from "@/lib/constants";
import { CrewName } from "@/types";
import ProgressBar from "@/components/ui/ProgressBar";

export default function CrewProgress({ stats }: { stats: DashboardStats }) {
  return (
    <div className="card p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Crew Progress</h2>
      <div className="space-y-4">
        {CREW_NAMES.map((name) => {
          const crew = stats.byCrew[name];
          if (!crew) return null;
          const color = CREW_COLORS[name as CrewName];
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color }}
                >
                  {name}
                </span>
                <span className="text-xs text-gray-500">
                  {crew.hours.toFixed(1)}h
                </span>
              </div>
              <ProgressBar
                completed={crew.completed}
                total={crew.total}
                color={color}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
