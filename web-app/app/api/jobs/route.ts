import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/airtable";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      date: searchParams.get("date") || undefined,
      crew: searchParams.get("crew") || undefined,
      feeder: searchParams.get("feeder") || undefined,
      status: searchParams.get("status") || undefined,
    };

    const jobs = await getJobs(filters);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
