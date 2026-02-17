"use client";

export default function DailyControls({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-2 no-print">
      <input
        type="date"
        defaultValue={date}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = `/schedule/daily?date=${e.target.value}`;
          }
        }}
      />
      <button
        onClick={() => window.print()}
        className="btn-secondary text-sm"
      >
        Print
      </button>
    </div>
  );
}
