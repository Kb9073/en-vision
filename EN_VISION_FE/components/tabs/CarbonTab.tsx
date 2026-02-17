"use client"

import { motion } from "framer-motion"
import { KPICard } from "@/components/dashboard/kpi-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  useCarbonMetrics,
  useCarbonBreakdown,
} from "@/hooks/use-dashboard-data"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

/* =========================
   COLORS
========================= */

const COLORS = [
  "oklch(0.65 0.2 25)",
  "oklch(0.7 0.18 85)",
  "oklch(0.6 0.15 195)",
  "oklch(0.7 0.12 260)",
]

/* =========================
   MAIN TAB
========================= */

export function CarbonTab() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useCarbonMetrics()

  const {
    data: breakdown,
    isLoading: breakdownLoading,
    error: breakdownError,
  } = useCarbonBreakdown()

  /* =========================
     LOADING
  ========================= */

  if (metricsLoading || breakdownLoading) {
    return (
      <div className="p-6">
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  /* =========================
     ERROR / EMPTY
  ========================= */

  if (metricsError || breakdownError || !metrics || !breakdown?.length) {
    return <EmptyState type="api-error" />
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Carbon Emissions
        </h2>
        <p className="text-muted-foreground">
          Current emissions and category-wise distribution
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Emissions"
          value={metrics.totalEmissions}
          delta={metrics.delta}
          unit="t CO₂"
          glowColor="red"
        />
      </div>

      {/* BREAKDOWN */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium mb-4">
          Emissions by Source
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="value"
                nameKey="source"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {breakdown.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
