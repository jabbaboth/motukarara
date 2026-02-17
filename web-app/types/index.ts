export type CrewName = "Jade" | "Ryan" | "Jamie" | "Hedge & Shelter Trimmer";

export type FeederName =
  | "MOTU 111"
  | "MOTU 112"
  | "MOTU 113"
  | "MOTU 114";

export type JobStatus = "Pending" | "In Progress" | "Completed";

export interface Job {
  id: string;
  date: string;
  crewName: CrewName;
  fullAddress: string;
  addressNumber: string;
  feeder: FeederName;
  jobDurationHours: number;
  spans: number;
  startTime: string;
  endTime: string;
  status: JobStatus;
  completionDate?: string;
  completedBy?: string;
  notes?: string;
  additionalCrewsRequired: boolean;
}

export interface Crew {
  id: string;
  crewName: string;
  crewLead: string;
  contactInfo: string;
  active: boolean;
  colorCode: string;
}

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  pendingJobs: number;
  totalHours: number;
  completedHours: number;
  completionPercentage: number;
  byCrew: Record<string, { total: number; completed: number; hours: number }>;
  byFeeder: Record<string, { total: number; completed: number; hours: number }>;
}

export interface JobFilters {
  date?: string;
  crew?: CrewName;
  feeder?: FeederName;
  status?: JobStatus;
}
