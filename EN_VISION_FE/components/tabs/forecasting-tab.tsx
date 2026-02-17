"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Calendar, Target, Cloud, Wind, Sun, Zap } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import {
  ScenarioToggle,
  type ScenarioMode,
} from "@/components/dashboard/scenario-toggle"
import { EmptyState } from "@/components/dashboard/empty-state"
import { useForecast } from "@/hooks/use-dashboard-data"

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
  BarChart,
  Bar,
} from "recharts"

/* =========================
   TYPES (MATCH BACKEND)
   ========================= */

interface ForecastPoint {
  forecast_date: string
  predicted_kwh: number
  actual_kwh?: number | null
  is_forecast: boolean
}

interface ForecastResponse {
  values: ForecastPoint[]
}

/* =========================
   SCENARIO MODES
   ========================= */

const scenarioMultipliers: Record<ScenarioMode, number> = {
  normal: 1,
  "high-load": 1.35,
  "energy-saving": 0.78,
}

/* =========================
   TOOLTIP
   ========================= */

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="glass-card p-3 border border-border">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p
          key={index}
          className="text-sm font-medium"
          style={{ color: entry.color }}
        >
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString()
            : "N/A"}{" "}
          kWh
        </p>
      ))}
    </div>
  )
}

/* =========================
   MAIN COMPONENT
   ========================= */

export function ForecastingTab() {
  const { data, isLoading, error, refetch } =
    useForecast<ForecastResponse>()

  const forecast = data?.values ?? []

  const [scenarioMode, setScenarioMode] =
    useState<ScenarioMode>("normal")

  const multiplier = scenarioMultipliers[scenarioMode]

  /* -------------------------
     RENEWABLE DATA (SAFE)
     ------------------------- */

  const renewableData = Array.from({ length: 24 }, (_, i) => {
    const base =
      forecast[i]?.predicted_kwh ??
      100 + Math.random() * 150

    return {
      hour: `${i.toString().padStart(2, "0")}:00`,
      solarForecast: Math.max(
        0,
        base * 0.6 + Math.sin((i / 24) * Math.PI) * 30
      ),
      windForecast:
        base * 0.4 + (Math.random() - 0.5) * 20,
    }
  })

  /* -------------------------
     CHART DATA
     ------------------------- */

  const chartData = forecast.map((point) => ({
    date: new Date(point.forecast_date).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" }
    ),
    isFuture: point.is_forecast,
    actual: point.actual_kwh ?? null,
    forecast: point.predicted_kwh * multiplier,
    lowerBound: point.predicted_kwh * 0.9 * multiplier,
    upperBound: point.predicted_kwh * 1.1 * multiplier,
  }))

  const todayIndex = chartData.findIndex((d) => d.isFuture)
  const todayDate =
    todayIndex > 0 ? chartData[todayIndex - 1]?.date : null

  const futureData = chartData.filter((d) => d.isFuture)

  /* -------------------------
     KPI CALCULATIONS
     ------------------------- */

  const avgForecast =
    futureData.length > 0
      ? futureData.reduce(
          (sum: number, d) => sum + d.forecast,
          0
        ) / futureData.length
      : 0

  const peakForecast =
    futureData.length > 0
      ? Math.max(...futureData.map((d) => d.forecast))
      : 0

  /* -------------------------
     STATES
     ------------------------- */

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState type="api-error" onRetry={refetch} />
      </div>
    )
  }

  if (forecast.length === 0) {
    return <EmptyState type="no-data" />
  }

  /* =========================
     RENDER
     ========================= */

  return (
    <div className="p-6 space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Avg Forecast (7 Days)"
          value={avgForecast}
          unit="kWh"
          glowColor="cyan"
          icon={<TrendingUp className="w-4 h-4" />}
          formatValue={(v: number) =>
            (v / 1_000).toFixed(0) + "K"
          }
        />

        <KPICard
          title="Peak Expected"
          value={peakForecast}
          unit="kWh"
          glowColor="amber"
          icon={<Target className="w-4 h-4" />}
          formatValue={(v: number) =>
            (v / 1_000).toFixed(0) + "K"
          }
        />

        <KPICard
          title="Forecast Horizon"
          value={7}
          unit="days"
          glowColor="green"
          icon={<Calendar className="w-4 h-4" />}
          clickable={false}
        />
      </div>

      {/* Forecast Chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium mb-4">
          Historical vs Forecast
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis
                tickFormatter={(v: number) =>
                  `${(v / 1_000).toFixed(0)}k`
                }
              />

              <Tooltip content={<CustomTooltip />} />

              {todayDate && (
                <ReferenceLine
                  x={todayDate}
                  strokeDasharray="4 4"
                />
              )}

              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fillOpacity={0.1}
              />

              <Line
                type="monotone"
                dataKey="actual"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
