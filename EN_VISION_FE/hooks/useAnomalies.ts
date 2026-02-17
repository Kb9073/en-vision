"use client"

import { useQuery } from "@tanstack/react-query"
import { getAnomalies } from "@/lib/api/dashboard"

const REFRESH_INTERVAL = 20_000
const STALE_TIME = 10_000

// ==========================
// ANOMALIES
// ==========================
export const useAnomalies = () =>
  useQuery({
    queryKey: ["dashboard", "anomalies"],
    queryFn: getAnomalies,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })
