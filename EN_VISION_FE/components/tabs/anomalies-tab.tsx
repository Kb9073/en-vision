"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  ChevronDown,
  Clock,
  Zap,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnomalies } from "@/hooks/use-dashboard-data"
import { WhyTooltip } from "@/components/dashboard/why-tooltip"
import { EmptyState } from "@/components/dashboard/empty-state"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts"

import type { AnomalyPoint } from "@/lib/api/dashboard"

/* =========================
   VISUAL CONFIG
   ========================= */

const severityConfig = {
  low: {
    icon: Info,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    fill: "oklch(0.75 0.15 195)",
  },
  medium: {
    icon: AlertCircle,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    fill: "oklch(0.75 0.15 85)",
  },
  high: {
    icon: AlertTriangle,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    fill: "oklch(0.65 0.2 25)",
  },
  critical: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    fill: "oklch(0.55 0.25 25)",
  },
}

const impactConfig = {
  low: { label: "Low Impact", className: "text-chart-1 bg-chart-1/10" },
  medium: { label: "Medium Impact", className: "text-chart-3 bg-chart-3/10" },
  high: { label: "High Impact", className: "text-chart-4 bg-chart-4/10" },
}

/* =========================
   TOOLTIP
   ========================= */

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="glass-card p-3 border border-border">
      <p className="text-xs text-muted-foreground mb-1">
        {new Date(data.timestamp).toLocaleString()}
      </p>
      <p className="text-sm font-medium text-foreground">
        {data.description}
      </p>
      <p className="text-xs mt-1">
        Value:{" "}
        <span className="text-chart-1">
          {data.value.toLocaleString()}
        </span>
      </p>
      <p className="text-xs capitalize">
        Severity:{" "}
        <span
          className={
            severityConfig[data.severity as keyof typeof severityConfig].color
          }
        >
          {data.severity}
        </span>
      </p>
    </div>
  )
}

/* =========================
   MINI CHART (ILLUSTRATIVE)
   ========================= */

function MiniTimeSeriesChart({ baseValue }: { baseValue: number }) {
  const data = Array.from({ length: 12 }, (_, i) => ({
    time: `${i}:00`,
    value: baseValue * (0.85 + Math.random() * 0.3),
    baseline: baseValue,
  }))

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.25 0.03 260 / 0.3)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: "oklch(0.6 0.02 260)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="oklch(0.5 0.1 260)"
            strokeDasharray="4 4"
            dot={false}
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="oklch(0.65 0.2 25)"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* =========================
   ANOMALY ITEM
   ========================= */

function AnomalyItem({
  anomaly,
  index,
}: {
  anomaly: AnomalyPoint
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const config =
    severityConfig[anomaly.severity as keyof typeof severityConfig]

  const impact =
    impactConfig[anomaly.impact as keyof typeof impactConfig] ??
    impactConfig.low

  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-lg bg-secondary/50 overflow-hidden",
        anomaly.severity === "critical" &&
          "ring-1 ring-destructive/40 animate-border-pulse"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-3 hover:bg-secondary/70 transition-colors"
      >
        <div className={cn("p-2 rounded-lg", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm text-foreground">
              {anomaly.description}
            </p>
            <WhyTooltip
              causes={[anomaly.explanation]}
              severity={anomaly.severity}
              model={anomaly.model}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(anomaly.timestamp).toLocaleString()} •{" "}
            {anomaly.value.toLocaleString()}
          </p>
        </div>

        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            impact.className
          )}
        >
          {impact.label}
        </span>

        <span
          className={cn(
            "text-xs font-medium capitalize px-2 py-1 rounded",
            config.bg,
            config.color
          )}
        >
          {anomaly.severity}
        </span>

        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Energy Pattern During Anomaly (illustrative)
              </p>

              <MiniTimeSeriesChart baseValue={anomaly.value / 10} />

              <div className="grid grid-cols-3 gap-4">
                <div className="flex gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Time Window
                    </p>
                    <p className="text-sm text-foreground">
                      {anomaly.timeWindow}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Affected System
                    </p>
                    <p className="text-sm text-foreground">
                      {anomaly.affectedSystem}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Energy Impact
                    </p>
                    <p className={cn("text-sm font-medium", config.color)}>
                      +{anomaly.energyImpact.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Analysis:{" "}
                  </span>
                  {anomaly.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* =========================
   MAIN TAB
   ========================= */

export function AnomaliesTab() {
  const { data: anomalies, isLoading, error, refetch } = useAnomalies()

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-64 bg-muted rounded animate-pulse" />
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

  if (!anomalies || anomalies.length === 0) {
    return <EmptyState type="no-anomalies" />
  }

  const chartData = anomalies.map((a, i) => ({
    ...a,
    index: i,
    hour: new Date(a.timestamp).getHours(),
  }))

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-semibold text-foreground">
          Anomalies & Deviations
        </h2>
        <p className="text-muted-foreground">
          AI-detected energy anomalies using Isolation Forest
        </p>
      </motion.div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Anomaly Distribution
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="hour" domain={[0, 24]} />
              <YAxis type="number" dataKey="value" name="Magnitude" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      severityConfig[
                        entry.severity as keyof typeof severityConfig
                      ].fill
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Recent Anomalies
        </h3>
        {anomalies.slice(0, 5).map((anomaly, index) => (
          <AnomalyItem
            key={anomaly.timestamp + index}
            anomaly={anomaly}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
