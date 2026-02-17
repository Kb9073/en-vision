"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Calendar, Target } from "lucide-react"
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
} from "recharts"

/* =========================
   FRONTEND SCENARIO MODES
   (Simulation only)
   ========================= */

const scenarioMultipliers: Record<ScenarioMode, number> = {
  normal: 1,
  "high-load": 1.35,
  "energy-saving": 0.78,
}

/* =========================
   TOOLTIP (READ-ONLY)
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
          {entry.value ? Number(entry.value).toLocaleString() : "N/A"} kWh
        </p>
      ))}
    </div>
  )
}

/* =========================
   MAIN TAB
   ========================= */

export function ForecastingTab() {
  const { data: forecast, isLoading, error, refetch } = useForecast()
  const [scenarioMode, setScenarioMode] =
    useState<ScenarioMode>("normal")

  const multiplier = scenarioMultipliers[scenarioMode]

  /* -------------------------
     BACKEND-DRIVEN DATA
     ------------------------- */

  const chartData =
  forecast?.values?.map((point: any) => ({
      ...point,
      date: new Date(point.forecast_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      isFuture: point.is_forecast === true,
      actual: point.actual_kwh ?? null,
      forecast: point.predicted_kwh * multiplier,
      lowerBound: point.predicted_kwh * 0.9 * multiplier,
      upperBound: point.predicted_kwh * 1.1 * multiplier,
    })) ?? []

  const todayIndex = chartData.findIndex((d) => d.isFuture)
  const todayDate =
    todayIndex > 0 ? chartData[todayIndex - 1]?.date : null

  const futureData = chartData.filter((d) => d.isFuture)

  /* -------------------------
     KPI CALCULATIONS
     (Display only)
     ------------------------- */

  const avgForecast =
    futureData.length > 0
      ? futureData.reduce((sum, d) => sum + d.forecast, 0) /
        futureData.length
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
      <div className="p-6 space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState type="api-error" onRetry={() => refetch()} />
      </div>
    )
  }

  if (!forecast || forecast.length === 0) {
    return <EmptyState type="no-data" />
  }

  /* =========================
     RENDER
     ========================= */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-foreground">
            Energy Forecasting
          </h2>
          <p className="text-muted-foreground mt-1">
            7-day ahead energy demand prediction
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ScenarioToggle
            activeMode={scenarioMode}
            onModeChange={setScenarioMode}
          />
        </motion.div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Avg Forecast (7 Days)"
          value={avgForecast}
          unit="kWh"
          glowColor="cyan"
          icon={<TrendingUp className="w-4 h-4" />}
          formatValue={(v) => (v / 1_000).toFixed(0) + "K"}
        />

        <KPICard
          title="Peak Expected"
          value={peakForecast}
          unit="kWh"
          glowColor="amber"
          icon={<Target className="w-4 h-4" />}
          formatValue={(v) => (v / 1_000).toFixed(0) + "K"}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-4">
          Historical vs Forecast
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="confidenceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="oklch(0.7 0.18 160)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.7 0.18 160)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.03 260 / 0.3)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "oklch(0.6 0.02 260)" }}
                tickLine={false}
                axisLine={{ stroke: "oklch(0.25 0.03 260 / 0.3)" }}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.6 0.02 260)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1_000).toFixed(0)}k`}
              />

              <Tooltip content={<CustomTooltip />} />

              {todayDate && (
                <ReferenceLine
                  x={todayDate}
                  stroke="oklch(0.6 0.02 260)"
                  strokeDasharray="4 4"
                  label={{
                    value: "Today",
                    position: "top",
                    fill: "oklch(0.6 0.02 260)",
                    fontSize: 10,
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#confidenceGradient)"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="transparent"
              />

              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="oklch(0.75 0.15 195)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="oklch(0.7 0.18 160)"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Forecast Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-4">
          7-Day Forecast Details
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {futureData.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="text-center p-3 rounded-lg bg-secondary/50"
            >
              <p className="text-xs text-muted-foreground mb-1">
                {day.date}
              </p>
              <p className="text-sm font-semibold text-chart-2">
                {(day.forecast / 1_000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
