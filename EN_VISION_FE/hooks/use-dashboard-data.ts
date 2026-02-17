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
  getDeviationOverTime,
} from "@/lib/api/dashboard"

import type { TimeRange } from "@/components/dashboard/filter-controls"

/* =========================
   CONSTANTS
========================= */

const REFRESH_INTERVAL = 20_000
const STALE_TIME = 10_000

/* =========================
   FILTER TYPE
========================= */

export interface DashboardFilters {
  range?: TimeRange
  start_date?: string
  end_date?: string
}

/* =========================
   DASHBOARD KPIs
========================= */

export const useDashboardKPIs = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["dashboard-kpis", filters],
    queryFn: async () => {
      const res = await getKPIs(filters)

      return {
        totalEnergyConsumption: {
          value: res.total_energy,
          delta: 0,
        },
        avgConsumption: {
          value: res.avg_daily,
          delta: 0,
        },
        peakConsumption: {
          value: res.peak_kwh,
          delta: 0,
        },
        energySaved: {
          value: res.energy_saved,
          delta: 0,
        },
        overConsumptionPercent: {
          value: res.over_consumption_percent,
          delta: 0,
        },
        co2Emissions: {
          value: res.co2_emissions,
          delta: 0,
        },
        systemStatus: res.system_status,
        sustainabilityStatus: res.sustainability_status,
        lastUpdated: res.last_updated,
      }
    },
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

/* =========================
   ENERGY TREND
========================= */

export const useEnergyTrend = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["energy-trend", filters],
    queryFn: () => getEnergyTrend(filters),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

/* =========================
   DEVIATION OVER TIME
========================= */

export const useDeviationOverTime = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["deviation-over-time", filters],
    queryFn: () => getDeviationOverTime(filters),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

/* =========================
   ⚠ TEMP: ZONE ENERGY USING ENERGY TREND
   (Until backend zone endpoint exists)
========================= */

export const useZoneEnergyDistribution = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["zone-energy-distribution", filters],
    queryFn: async () => {
      try {
        // Using energy trend temporarily
        const data = await getEnergyTrend(filters)

        // Convert to fake zone grouping for now
        return data?.slice(0, 4).map((item: any, index: number) => ({
          zone: `Zone ${index + 1}`,
          energy: item.value,
        }))
      } catch (error) {
        console.error("Zone fallback used", error)

        return [
          { zone: "North", energy: 12000 },
          { zone: "South", energy: 9500 },
          { zone: "East", energy: 14300 },
          { zone: "West", energy: 8700 },
        ]
      }
    },
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

/* =========================
   SIMPLE DEVIATIONS LIST
========================= */

export const useDeviations = () =>
  useQuery({
    queryKey: ["energy-deviations"],
    queryFn: getDeviations,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

/* =========================
   OTHER DATA
========================= */

export const useAnomalies = () =>
  useQuery({
    queryKey: ["energy-anomalies"],
    queryFn: getAnomalies,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

export const useForecast = () =>
  useQuery({
    queryKey: ["energy-forecast"],
    queryFn: getForecast,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

export const useCarbonMetrics = () =>
  useQuery({
    queryKey: ["carbon-metrics"],
    queryFn: getCarbonMetrics,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

export const useCarbonBreakdown = () =>
  useQuery({
    queryKey: ["carbon-breakdown"],
    queryFn: getCarbonBreakdown,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

export const useAIInsights = () =>
  useQuery({
    queryKey: ["ai-insights"],
    queryFn: getAIInsights,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })

export const useRecommendations = () =>
  useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  })
