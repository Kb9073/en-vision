"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp, Activity } from "lucide-react"

import { KPICard } from "@/components/dashboard/kpi-card"

import {
  useDashboardKPIs,
  useDeviationOverTime,
  useZoneEnergyDistribution,
} from "@/hooks/use-dashboard-data"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const deviationChartConfig = {
  gradient: "deviationGradient"
}

/* =========================
   COMPONENT
========================= */

export function EnergyTab({ filters }: { filters: any }) {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs({
    range: filters.timeRange,
  })

  const { data: deviationOverTime = [], isLoading: deviationTimeLoading } =
    useDeviationOverTime({ range: filters.timeRange })

  const { data: zoneEnergyData = [], isLoading: zoneLoading } =
    useZoneEnergyDistribution({ range: filters.timeRange })

  return (
    <div className="p-6 space-y-6">
      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Consumption"
          value={kpis?.totalEnergyConsumption?.value ?? 0}
          unit="kWh"
          icon={<Zap className="w-4 h-4" />}
          isLoading={kpisLoading}
        />

        <KPICard
          title="Average Daily"
          value={kpis?.avgConsumption?.value ?? 0}
          unit="kWh"
          glowColor="green"
          icon={<TrendingUp className="w-4 h-4" />}
          isLoading={kpisLoading}
          formatValue={(v) =>
            v >= 1000 ? (v / 1000).toFixed(1) + "K" : v.toFixed(0)
          }
        />

        <KPICard
          title="Peak Demand"
          value={kpis?.peakConsumption?.value ?? 0}
          unit="kWh"
          glowColor="amber"
          icon={<Activity className="w-4 h-4" />}
          isLoading={kpisLoading}
          formatValue={(v) => v.toFixed(2)}
        />
      </div>

      {/* ================= CHART 1: DAILY DEVIATION (IMPROVED) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium mb-4">
          Daily Deviation from Baseline
        </h3>

        {deviationTimeLoading ? (
          <div className="h-64 bg-muted rounded animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deviationOverTime} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="deviationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                  tickLine={false}
                  axisLine={false}
                  style={{ marginTop: "10px" }}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v.toFixed(0)}`}
                  width={50}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                  }}
                  labelStyle={{ color: "rgba(255, 255, 255, 0.9)" }}
                  formatter={(v: number) => [`${v.toFixed(2)} kWh`, "Deviation"]}
                  cursor={{ stroke: "rgba(20, 184, 166, 0.2)", strokeWidth: 1 }}
                />

                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

                <Line
                  type="monotone"
                  dataKey="deviation"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={600}
                  fill="url(#deviationGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* ================= CHART 2 ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium mb-4">
          Energy Consumption by Zone
        </h3>

        {zoneLoading ? (
          <div className="h-64 bg-muted rounded animate-pulse" />
        ) : zoneEnergyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No zone data available
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zoneEnergyData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="rgba(255,255,255,0.05)"
                />

                {/* 🔥 FIXED X AXIS */}
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${v.toFixed(0)}`}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="zone"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(v: number) => [`${v.toFixed(2)} kWh`, "Energy"]}
                />

                <Bar
                  dataKey="energy"
                  fill="#14b8a6"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  )
}
