interface ProgressBarProps {
  completed: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressBar({
  completed,
  total,
  color = "#2E86AB",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-5" : "h-3";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            {completed} / {total}
          </span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
