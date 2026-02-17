"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getCarbonMetrics,
  getCarbonBreakdown,
} from "@/lib/api/dashboard"

const REFRESH_INTERVAL = 20_000
const STALE_TIME = 10_000

// ==========================
// CARBON METRICS
// ==========================
export const useCarbonMetrics = () =>
  useQuery({
    queryKey: ["dashboard", "carbon-metrics"],
    queryFn: getCarbonMetrics,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// CARBON BREAKDOWN
// ==========================
export const useCarbonBreakdown = () =>
  useQuery({
    queryKey: ["dashboard", "carbon-breakdown"],
    queryFn: getCarbonBreakdown,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })
