import { getDashboardStats } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { CREW_COLORS, CREW_NAMES } from "@/lib/constants";
import { CrewName } from "@/types";
import Link from "next/link";

export const revalidate = 30;

export default async function CrewPage() {
  let stats;
  try {
    stats = await getDashboardStats();
  } catch {
    return (
      <div>
        <Header title="Crews" subtitle="Crew overview" />
        <div className="card p-8 text-center text-gray-500">
          Unable to load crew data. Check your Airtable connection.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Crews" subtitle="Crew overview and performance" />

      <div className="grid md:grid-cols-2 gap-4">
        {CREW_NAMES.map((name) => {
          const crew = stats.byCrew[name];
          if (!crew) return null;
          const color = CREW_COLORS[name as CrewName];
          const percentage =
            crew.total > 0
              ? Math.round((crew.completed / crew.total) * 100)
              : 0;

          return (
            <Link
              key={name}
              href={`/crew/${encodeURIComponent(name)}`}
              className="card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h2 className="text-lg font-semibold">{name}</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{crew.total}</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {crew.completed}
                  </p>
                  <p className="text-xs text-gray-500">Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{crew.hours.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">Hours</p>
                </div>
              </div>
              <ProgressBar
                completed={crew.completed}
                total={crew.total}
                color={color}
                showLabel={false}
                size="md"
              />
              <p className="text-sm text-gray-500 mt-2 text-right">
                {percentage}% complete
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
