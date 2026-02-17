"use client"

import { motion } from "framer-motion"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  useCarbonMetrics,
  useCarbonBreakdown,
} from "@/hooks/use-dashboard-data"
import { Leaf, Zap, Flame, Droplet, Truck, Package, Users, Plane, Briefcase } from "lucide-react"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

const categories = [
  { id: "fleet", name: "Fleet", icon: Truck, color: "#E74C3C", bgColor: "#FADBD8" },
  { id: "gas", name: "Gas", icon: Flame, color: "#F39C12", bgColor: "#FADBA8" },
  { id: "electricity", name: "Electricity", icon: Zap, color: "#3498DB", bgColor: "#D6EAF8" },
  { id: "water", name: "Water", icon: Droplet, color: "#9B59B6", bgColor: "#EBDEF0" },
  { id: "heat", name: "Heat & Steam", icon: Flame, color: "#1ABC9C", bgColor: "#D1F2EB" },
  { id: "goods", name: "Purchase Goods", icon: Package, color: "#2ECC71", bgColor: "#D5F4E6" },
  { id: "employees", name: "Employees", icon: Users, color: "#34495E", bgColor: "#D7DBDD" },
  { id: "travel", name: "Travel", icon: Plane, color: "#E67E22", bgColor: "#FADAB8" },
]

export function CarbonTab() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useCarbonMetrics()
  const { data: breakdown, isLoading: breakdownLoading, error: breakdownError } = useCarbonBreakdown()

  if (metricsLoading || breakdownLoading) {
    return (
      <div className="p-6">
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (metricsError || breakdownError || !metrics || !breakdown?.length) {
    return <EmptyState type="api-error" />
  }

  const categoryData = categories.map((cat) => {
    const breakdownItem = breakdown.find((b) =>
      b.source.toLowerCase().includes(cat.name.toLowerCase())
    )
    return {
      ...cat,
      value: breakdownItem?.value ?? 0,
      percentage: ((breakdownItem?.value ?? 0) / metrics.totalEmissions) * 100,
    }
  })

  const pieChartData = categoryData.map((cat) => ({
    name: cat.name,
    value: cat.value,
    fill: cat.color,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Carbon Footprint</h1>
          <p className="text-slate-400 mt-1">Company Name</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-6 border-b border-slate-700"
        >
          {["Emissions By Scope", "Emissions By Category", "Location Overview", "Year Comparison"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === "Emissions By Category"
                  ? "border-green-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: "Total Emissions", value: metrics.totalEmissions.toFixed(0), unit: "tCO₂e", year: "2023" },
            { title: "Operations", value: (metrics.totalEmissions * 0.35).toFixed(0), unit: "tCO₂e", year: "2023" },
            { title: "Transport & Mobility", value: (metrics.totalEmissions * 0.30).toFixed(0), unit: "tCO₂e", year: "2023" },
            { title: "Supply Chain & Resources", value: (metrics.totalEmissions * 0.35).toFixed(0), unit: "tCO₂e", year: "2023" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-5 backdrop-blur-sm hover:border-slate-600/50 transition-all"
            >
              <p className="text-sm font-medium text-slate-400 mb-2">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-slate-500 mt-2">{card.unit}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
          >
            <h2 className="text-lg font-semibold mb-6">Category Partition</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(0)} tCO₂e`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-lg font-semibold">Emissions by Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categoryData.map((cat) => {
                const Icon = cat.icon
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm hover:border-slate-600/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: cat.color }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{cat.name}</p>
                        <p className="text-xl font-bold mt-1">{cat.value.toFixed(0)}</p>
                        <p className="text-xs text-slate-400">tCO₂e</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
