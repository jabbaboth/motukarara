import { DashboardStats } from "@/types";
import { FEEDER_NAMES } from "@/lib/constants";
import ProgressBar from "@/components/ui/ProgressBar";

const feederBarColors: Record<string, string> = {
  "MOTU 111": "#ffa07a",
  "MOTU 112": "#ff6b6b",
  "MOTU 113": "#45b7d1",
  "MOTU 114": "#4ecdc4",
};

export default function FeederBreakdown({ stats }: { stats: DashboardStats }) {
  return (
    <div className="card p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Feeder Breakdown</h2>
      <div className="space-y-4">
        {FEEDER_NAMES.map((name) => {
          const feeder = stats.byFeeder[name];
          if (!feeder) return null;
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs text-gray-500">
                  {feeder.hours.toFixed(1)}h
                </span>
              </div>
              <ProgressBar
                completed={feeder.completed}
                total={feeder.total}
                color={feederBarColors[name] || "#6C757D"}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
