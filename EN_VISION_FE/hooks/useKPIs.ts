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

const REFRESH = 20_000
const STALE = 10_000

export const useDashboardKPIs = () =>
  useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: getKPIs,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useEnergyTrend = (params: Record<string, any> = {}) =>
  useQuery({
    queryKey: ["energy-trend", params],
    queryFn: () => getEnergyTrend(params),
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useDeviations = () =>
  useQuery({
    queryKey: ["energy-deviations"],
    queryFn: getDeviations,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useAnomalies = () =>
  useQuery({
    queryKey: ["energy-anomalies"],
    queryFn: getAnomalies,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })



export const useForecast = () => {
  return useQuery({
    queryKey: ["energy-forecast"],
    queryFn: getForecast,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })
}

export const useCarbonMetrics = () =>
  useQuery({
    queryKey: ["carbon-metrics"],
    queryFn: getCarbonMetrics,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useCarbonBreakdown = () =>
  useQuery({
    queryKey: ["carbon-breakdown"],
    queryFn: getCarbonBreakdown,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useAIInsights = () =>
  useQuery({
    queryKey: ["ai-insights"],
    queryFn: getAIInsights,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })

export const useRecommendations = () =>
  useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    refetchInterval: REFRESH,
    staleTime: STALE,
  })
