"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EnergyTrendChart } from "@/components/dashboard/energy-trend-chart"
import { SystemStatus } from "@/components/dashboard/system-status"
import { AIInsightsFeed } from "@/components/dashboard/ai-insights-feed"
import { TrendingUp, Zap, AlertCircle, Leaf, Activity, X } from "lucide-react"

import {
  useDashboardKPIs,
  useEnergyTrend,
  useAIInsights,
} from "@/hooks/use-dashboard-data"

import type { TimeRange } from "@/components/dashboard/filter-controls"

interface HomeTabProps {
  filters: {
    timeRange: TimeRange
    department: string
    device: string
  }
}

export function HomeTab({ filters }: HomeTabProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs({
    range: filters.timeRange,
  })

  const { data: energyTrend, isLoading: trendLoading } = useEnergyTrend({
    range: filters.timeRange,
  })

  const { data: insights, isLoading: insightsLoading } = useAIInsights()

  const metrics = [
    {
      id: "consumption",
      label: "Total Consumption",
      icon: Zap,
      iconColor: "from-blue-400 to-blue-600",
      value: kpis?.totalEnergyConsumption.value ?? 0,
      unit: "kWh",
      trend: kpis?.totalEnergyConsumption.delta ?? 0,
      gradient: "from-blue-50 to-blue-100",
      accentColor: "#3B82F6",
      details: "Peak load: 850 kW | Average: 625 kW | Min: 320 kW",
    },
    {
      id: "saved",
      label: "Energy Saved",
      icon: TrendingUp,
      iconColor: "from-green-400 to-green-600",
      value: kpis?.energySaved.value ?? 0,
      unit: "kWh",
      trend: kpis?.energySaved.delta ?? 0,
      gradient: "from-green-50 to-green-100",
      accentColor: "#10B981",
      details: "vs. last period | Efficiency gain: 12.5%",
    },
    {
      id: "overconsumption",
      label: "Over Consumption",
      icon: AlertCircle,
      iconColor: "from-orange-400 to-orange-600",
      value: kpis?.overConsumptionPercent.value ?? 0,
      unit: "%",
      trend: kpis?.overConsumptionPercent.delta ?? 0,
      gradient: "from-orange-50 to-orange-100",
      accentColor: "#F97316",
      details: "Threshold: 2000 kWh | Current: 2450 kWh",
    },
    {
      id: "emissions",
      label: "CO₂ Emissions",
      icon: Leaf,
      iconColor: "from-emerald-400 to-emerald-600",
      value: kpis?.co2Emissions.value ?? 0,
      unit: "t",
      trend: kpis?.co2Emissions.delta ?? 0,
      gradient: "from-emerald-50 to-emerald-100",
      accentColor: "#059669",
      details: "Carbon footprint: 2.3 kg CO₂/kWh",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white">System Overview</h1>
          <p className="text-slate-400 mt-2">Live energy intelligence & sustainability metrics</p>
        </motion.div>

        {/* Premium KPI Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-left group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl cursor-pointer"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/30 rounded-2xl" />

                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                    backgroundSize: "200% 200%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-500"
                  style={{ background: metric.accentColor }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.15 }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.iconColor} p-2.5 transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Label */}
                  <div>
                    <p className="text-slate-300 text-sm font-medium">{metric.label}</p>
                    <motion.p
                      className="text-3xl font-bold text-white mt-2"
                      layout
                    >
                      {typeof metric.value === "number"
                        ? metric.value.toLocaleString("en-US", {
                            maximumFractionDigits: 1,
                          })
                        : metric.value}
                      <span className="text-lg ml-1 text-slate-400 font-normal">
                        {metric.unit}
                      </span>
                    </motion.p>
                  </div>

                  {/* Trend indicator */}
                  <motion.div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      metric.trend > 0
                        ? "bg-red-500/20 text-red-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {metric.trend > 0 ? "+" : ""}
                    {metric.trend.toFixed(1)}% vs last period
                  </motion.div>
                </div>

                {/* Border shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )
          })}
        </motion.div>

        {/* Energy Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40"
        >
          <motion.div
            className="absolute inset-0 opacity-0 blur-xl rounded-2xl transition-opacity duration-500"
            style={{ background: "linear-gradient(45deg, #3B82F6, #10B981)" }}
            initial={{ opacity: 0 }}
          />
          <div className="relative z-10">
            <EnergyTrendChart
              data={energyTrend ?? []}
              isLoading={trendLoading}
              title="Energy Consumption Trend"
              showBaseline
            />
          </div>
        </motion.div>

        {/* System Status & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40"
          >
            <div className="relative z-10">
              <SystemStatus
                systemStatus={kpis?.systemStatus}
                sustainabilityStatus={kpis?.sustainabilityStatus}
                lastUpdated={kpis?.lastIngestionTimestamp}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-slate-600/30 bg-gradient-to-br from-slate-700/40 to-slate-800/40"
          >
            <div className="relative z-10">
              <AIInsightsFeed insights={insights ?? []} isLoading={insightsLoading} />
            </div>
          </motion.div>
        </div>

        {/* Additional KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Cost Metrics", value: "£2,450", icon: "💰", color: "from-amber-500 to-orange-500" },
            { label: "Energy Metrics", value: "8.5 MWh", icon: "⚡", color: "from-blue-500 to-cyan-500" },
            { label: "Active Appliances", value: "24/32", icon: "🔌", color: "from-green-500 to-emerald-500" },
          ].map((item, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedMetric(`metric-${i}`)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 rounded-2xl transition-all duration-300" />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
              />
              <div className="relative z-10">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-slate-300 text-sm font-medium">{item.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Metric Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMetric(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl relative overflow-hidden"
            >
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 opacity-20 blur-2xl"
                style={{
                  background: "radial-gradient(circle at center, #3B82F6, transparent)",
                }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                {/* Close button */}
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>

                {(() => {
                  const metric = metrics.find((m) => m.id === selectedMetric)
                  if (!metric) return null

                  const Icon = metric.icon
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${metric.iconColor} p-3 flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{metric.label}</h3>
                          <p className="text-slate-400 text-sm">Current value</p>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <p className="text-5xl font-bold text-white">
                          {typeof metric.value === "number"
                            ? metric.value.toLocaleString("en-US", {
                                maximumFractionDigits: 1,
                              })
                            : metric.value}
                        </p>
                        <p className="text-slate-400 text-sm mt-2">{metric.unit}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-200">Details</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{metric.details}</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMetric(null)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                      >
                        Close
                      </motion.button>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
