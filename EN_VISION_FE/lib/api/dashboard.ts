// lib/api/dashboard.ts
// Dedicated API module for FastAPI dashboard endpoints with type safety and error handling

import apiClient_ from '@/lib/api/client'

/* =========================
   TYPES
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

export interface EnergyTrendPoint {
  timestamp: string
  total_kwh: number
  total_cost: number
  total_emissions: number
  peak_power: number
  baseline_kwh: number
}


export interface DeviationOverTimePoint {
  date: string
  deviation: number
}

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

export interface DeviationData {
  zone: string
  actual: number
  baseline: number
  deviation: number
  deviationPercent: number
}

export interface AnomalyPoint {
  id: string
  timestamp: string
  severity: string
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

/* =========================
   API FUNCTIONS WITH ERROR HANDLING
========================= */

export const getKPIs = async (params?: any): Promise<DashboardKPIs> => {
  try {
    return await apiClient_.get<DashboardKPIs>('/dashboard/kpis', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch KPIs:', error)
    throw error
  }
}

export const getDeviationOverTime = async (
  params?: any
): Promise<DeviationOverTimePoint[]> => {
  try {
    return await apiClient_.get<DeviationOverTimePoint[]>('/dashboard/deviation-over-time', undefined, {
      showErrors: true,
    })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch deviation over time:', error)
    throw error
  }
}

export const getCostMetrics = async (params?: any): Promise<CostMetrics> => {
  try {
    return await apiClient_.get<CostMetrics>('/dashboard/cost-metrics', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch cost metrics:', error)
    throw error
  }
}

export const getEnergyIntensity = async (params?: any): Promise<EnergyIntensity> => {
  try {
    return await apiClient_.get<EnergyIntensity>('/dashboard/energy-intensity', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch energy intensity:', error)
    throw error
  }
}

export const getActiveAppliances = async (params?: any): Promise<ActiveAppliance[]> => {
  try {
    return await apiClient_.get<ActiveAppliance[]>('/dashboard/active-appliances', undefined, {
      showErrors: true,
    })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch active appliances:', error)
    throw error
  }
}

export const getEnergyTrend = async (params?: any): Promise<EnergyTrendPoint[]> => {
  try {
    return await apiClient_.get<EnergyTrendPoint[]>('/dashboard/energy-trend', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch energy trend:', error)
    throw error
  }
}

export const getDeviations = async (params?: any): Promise<DeviationData[]> => {
  try {
    return await apiClient_.get<DeviationData[]>('/dashboard/deviations', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch deviations:', error)
    throw error
  }
}

export const getAnomalies = async (params?: any): Promise<AnomalyPoint[]> => {
  try {
    return await apiClient_.get<AnomalyPoint[]>('/dashboard/anomalies', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch anomalies:', error)
    throw error
  }
}

export const getForecast = async (params?: any): Promise<ForecastPoint[]> => {
  try {
    const response = await apiClient_.get<{ values: ForecastPoint[] }>('/dashboard/forecast', undefined, {
      showErrors: true,
    })
    return response?.values || []
  } catch (error) {
    console.error('[Dashboard] Failed to fetch forecast:', error)
    throw error
  }
}

export const getCarbonMetrics = async (params?: any): Promise<CarbonMetrics> => {
  try {
    return await apiClient_.get<CarbonMetrics>('/dashboard/carbon-metrics', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch carbon metrics:', error)
    throw error
  }
}

export const getCarbonBreakdown = async (params?: any): Promise<CarbonBreakdown[]> => {
  try {
    return await apiClient_.get<CarbonBreakdown[]>('/dashboard/carbon-breakdown', undefined, {
      showErrors: true,
    })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch carbon breakdown:', error)
    throw error
  }
}

export const getAIInsights = async (params?: any): Promise<AIInsight[]> => {
  try {
    return await apiClient_.get<AIInsight[]>('/dashboard/ai-insights', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch AI insights:', error)
    throw error
  }
}

export const getRecommendations = async (params?: any): Promise<Recommendation[]> => {
  try {
    return await apiClient_.get<Recommendation[]>('/dashboard/recommendations', undefined, { showErrors: true })
  } catch (error) {
    console.error('[Dashboard] Failed to fetch recommendations:', error)
    throw error
  }
}
