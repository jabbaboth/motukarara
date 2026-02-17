import { CrewName, FeederName, JobStatus } from "@/types";

export const CREW_COLORS: Record<CrewName, string> = {
  Jade: "#2E86AB",
  Ryan: "#A23B72",
  Jamie: "#F18F01",
  "Hedge & Shelter Trimmer": "#6C757D",
};

export const CREW_NAMES: CrewName[] = [
  "Jade",
  "Ryan",
  "Jamie",
  "Hedge & Shelter Trimmer",
];

export const FEEDER_COLORS: Record<FeederName, string> = {
  "MOTU 111": "rgba(255, 160, 122, 0.13)",
  "MOTU 112": "rgba(255, 107, 107, 0.13)",
  "MOTU 113": "rgba(69, 183, 209, 0.13)",
  "MOTU 114": "rgba(78, 205, 196, 0.13)",
};

export const FEEDER_NAMES: FeederName[] = [
  "MOTU 111",
  "MOTU 112",
  "MOTU 113",
  "MOTU 114",
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Completed: "#d4edda",
  "In Progress": "#fff3cd",
  Pending: "#ffffff",
};

export const STATUS_OPTIONS: JobStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

export const PROJECT_STATS = {
  totalJobs: 264,
  totalHours: 498.5,
  workingDays: 24,
  startDate: "2026-02-09",
  endDate: "2026-03-12",
};
