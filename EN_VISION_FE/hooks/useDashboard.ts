"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getKPIs,
  getEnergyTrend,
  getDeviations,
  getAnomalies,
  getForecast,
  getCarbonMetrics,
  getCarbonBreakdown,
  getAIInsights,
  getRecommendations,
} from "@/lib/api/dashboard"

const REFRESH_INTERVAL = 20_000
const STALE_TIME = 10_000

// ==========================
// KPI
// ==========================
export const useDashboardKPIs = () =>
  useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getKPIs,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// ENERGY TREND
// ==========================
export const useEnergyTrend = () =>
  useQuery({
    queryKey: ["dashboard", "energy-trend"],
    queryFn: getEnergyTrend,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// DEVIATIONS
// ==========================
export const useDeviations = () =>
  useQuery({
    queryKey: ["dashboard", "deviations"],
    queryFn: getDeviations,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

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

// ==========================
// FORECAST
// ==========================
export const useForecast = () =>
  useQuery({
    queryKey: ["dashboard", "forecast"],
    queryFn: getForecast,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// CARBON
// ==========================
export const useCarbonMetrics = () =>
  useQuery({
    queryKey: ["dashboard", "carbon-metrics"],
    queryFn: getCarbonMetrics,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

export const useCarbonBreakdown = () =>
  useQuery({
    queryKey: ["dashboard", "carbon-breakdown"],
    queryFn: getCarbonBreakdown,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// AI INSIGHTS
// ==========================
export const useAIInsights = () =>
  useQuery({
    queryKey: ["dashboard", "ai-insights"],
    queryFn: getAIInsights,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })

// ==========================
// RECOMMENDATIONS
// ==========================
export const useRecommendations = () =>
  useQuery({
    queryKey: ["dashboard", "recommendations"],
    queryFn: getRecommendations,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_TIME,
  })
