"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UsePollingOptions {
  /** URL to poll */
  url: string;
  /** Polling interval in ms (default: 10000 = 10s) */
  interval?: number;
  /** Whether polling is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Hook that polls an API endpoint and calls onUpdate when data changes.
 * Pauses when the tab is hidden, resumes when visible.
 */
export function usePolling<T>({ url, interval = 10000, enabled = true }: UsePollingOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastJsonRef = useRef<string>("");

  const poll = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const jsonStr = JSON.stringify(json);

      // Only update state if data actually changed
      if (jsonStr !== lastJsonRef.current) {
        lastJsonRef.current = jsonStr;
        setData(json);
        setLastUpdated(new Date());
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fetch failed");
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    poll();

    function schedule() {
      timerRef.current = setTimeout(async () => {
        await poll();
        if (document.visibilityState === "visible") {
          schedule();
        }
      }, interval);
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        // Immediate poll on tab focus, then resume schedule
        poll();
        schedule();
      } else {
        // Pause polling when tab hidden
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    }

    schedule();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [poll, interval, enabled]);

  return { data, error, lastUpdated, refresh: poll };
}
