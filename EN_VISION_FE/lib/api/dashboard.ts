// lib/api/dashboard.ts
// Dedicated API module for FastAPI dashboard endpoints
// One function per backend endpoint – NO frontend aggregation

import axios from "axios"

/* =========================
   AXIOS INSTANCE
========================= */

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10_000,
})

/* =========================
   KPI TYPES
========================= */

export interface KPIBlock {
  value: number
  delta?: number
}

export interface DashboardKPIs {
  totalEnergyConsumption: KPIBlock
  energySaved: KPIBlock
  overConsumptionPercent: KPIBlock
  co2Emissions: KPIBlock

  avgConsumption: number
  peakConsumption: number
  baselineComparison: number

  systemStatus: "stable" | "at-risk" | "critical"
  sustainabilityStatus: "on-track" | "deviating" | "exceeding"
  lastIngestionTimestamp: string
}

/* =========================
   OTHER TYPES
========================= */

export interface EnergyTrendPoint {
  date: string
  value: number
}

export interface DeviationOverTimePoint {
  date: string
  deviation: number
}

export interface DeviationData {
  zone: string
  actual: number
  baseline: number
  deviation: number
  deviationPercent: number
}

export interface AnomalyPoint {
  timestamp: string
  value: number
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

export interface ForecastPoint {
  timestamp: string
  forecast: number
  lowerBound?: number
  upperBound?: number
}

export interface CarbonMetrics {
  totalEmissions: number
  delta: number
}

export interface CarbonBreakdown {
  source: string
  value: number
}

export interface AIInsight {
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
}

export interface Recommendation {
  title: string
  description: string
  severity: "low" | "medium" | "high"
}

/* =========================
   API FUNCTIONS
========================= */

export const getKPIs = async (params?: any) => {
  const { data } = await api.get("/dashboard/kpis", { params })
  return data
}

export const getDeviationOverTime = async (
  params?: any
): Promise<DeviationOverTimePoint[]> => {
  const { data } = await api.get("/dashboard/deviation-over-time", { params })
  return data
}

export const getEnergyTrend = async (
  params?: any
): Promise<EnergyTrendPoint[]> => {
  const { data } = await api.get("/dashboard/energy-trend", { params })
  return data
}

export const getDeviations = async (): Promise<DeviationData[]> => {
  const { data } = await api.get("/dashboard/deviations")
  return data
}

export const getAnomalies = async (): Promise<AnomalyPoint[]> => {
  const { data } = await api.get("/dashboard/anomalies")
  return data
}

export const getForecast = async (): Promise<ForecastPoint[]> => {
  const { data } = await api.get("/dashboard/forecast")
  return data
}

export const getCarbonMetrics = async (): Promise<CarbonMetrics> => {
  const { data } = await api.get("/dashboard/carbon-metrics")
  return data
}

export const getCarbonBreakdown = async (): Promise<CarbonBreakdown[]> => {
  const { data } = await api.get("/dashboard/carbon-breakdown")
  return data
}

export const getAIInsights = async (): Promise<AIInsight[]> => {
  const { data } = await api.get("/dashboard/ai-insights")
  return data
}

export const getRecommendations = async (): Promise<Recommendation[]> => {
  const { data } = await api.get("/dashboard/recommendations")
  return data
}

/* =========================
   NEW ENDPOINTS - ENERGY DASHBOARD
========================= */

export interface CostMetrics {
  total_cost: number
  electricity_cost: number
  gas_cost: number
  previous_cost: number
  current_cost: number
  previous_month: string
  current_month: string
  cost_change_percent: number
}

export interface EnergyIntensity {
  intensity: number
  current_usage: number
  predicted_usage: number
  usage_history: Array<{ date: string; value: number }>
  carbon_till_date: number
  carbon_predicted: number
  green_energy_percent: number
}

export interface ActiveAppliance {
  name: string
  usage: number
  maxUsage?: number
}

export const getCostMetrics = async (
  params?: any
): Promise<CostMetrics> => {
  const { data } = await api.get("/dashboard/cost-metrics", { params })
  return data
}

export const getEnergyIntensity = async (
  params?: any
): Promise<EnergyIntensity> => {
  const { data } = await api.get("/dashboard/energy-intensity", { params })
  return data
}

export const getActiveAppliances = async (
  params?: any
): Promise<ActiveAppliance[]> => {
  const { data } = await api.get("/dashboard/active-appliances", { params })
  return data
}

export default api
