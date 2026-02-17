"use client"

import { motion } from "framer-motion"
import { Zap, Flame, Droplet, TrendingDown, AlertCircle } from "lucide-react"
import { useDashboardKPIs } from "@/hooks/use-dashboard-data"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
} from "recharts"

export function EnergyTab({ filters }: { filters: any }) {
  const { data: kpis } = useDashboardKPIs({ range: filters.timeRange })

  // Cost data
  const costData = {
    total: 58.37,
    budget: 210.0,
    usage: 237,
  }

  // Consumption data
  const consumptionData = [
    { day: "SUN", electricity: 120, gas: 45 },
    { day: "MON", electricity: 145, gas: 52 },
    { day: "TUE", electricity: 132, gas: 48 },
    { day: "WED", electricity: 165, gas: 58 },
    { day: "THU", electricity: 128, gas: 46 },
    { day: "FRI", electricity: 142, gas: 50 },
    { day: "SAT", electricity: 125, gas: 44 },
  ]

  // Hourly consumption
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    heating: 200 + Math.random() * 100,
    fridge: 150 + Math.random() * 30,
    dishwasher: 80 + (i >= 18 && i <= 22 ? Math.random() * 150 : Math.random() * 20),
    oven: 120 + (i >= 17 && i <= 20 ? Math.random() * 200 : Math.random() * 30),
  }))

  // Consumption mix
  const consumptionMix = [
    { name: "Heating", value: 32, color: "#EF4444" },
    { name: "Fridge", value: 26, color: "#3B82F6" },
    { name: "Dishwasher", value: 19, color: "#10B981" },
    { name: "Oven", value: 23, color: "#F59E0B" },
  ]

  const tariffInfo = [
    { label: "Postcode", value: "NW1 4FH", icon: "📍" },
    { label: "Energy supplier", value: "British Gas", icon: "🔋" },
    { label: "Tariff type", value: "Fixed Dual Fuel", icon: "📋" },
    { label: "Tariff ends on", value: "31/08/2022", icon: "📅" },
    { label: "Electricity Rate", value: "20.493p per kWh", icon: "⚡" },
    { label: "Gas Rate", value: "4.123p per kWh", icon: "💨" },
  ]

  const recommendations = [
    {
      title: "Bulb",
      savings: "Save £20.87 per month",
      energy: "Use 40.2kWh green energy",
      badge: "Save Money",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Octopus",
      savings: "Optimal savings available",
      energy: "Use 40.2kWh green energy",
      badge: "Green Energy",
      color: "from-purple-400 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Energy</h1>
          <p className="text-slate-400 text-sm mt-1">01 July 2022 09:21</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Cost & Consumption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Cost Section */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-xl"
              whileHover={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Cost</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">£{costData.total.toFixed(2)}</span>
                    <span className="text-slate-400 text-sm">Pounds</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
                    ☑ Weekly
                  </button>
                  <button className="px-4 py-2 text-slate-400 text-sm rounded-lg border border-slate-600/30 hover:bg-slate-700/20 transition-colors">
                    Monthly
                  </button>
                </div>
              </div>

              {/* Budget gauge */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Budget</span>
                  <span className="text-2xl font-bold">£ {costData.budget.toFixed(2)}</span>
                </div>
                <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(costData.total / costData.budget) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-slate-400 text-xs">
                  {Math.round((costData.total / costData.budget) * 100)}% used | £
                  {(costData.budget - costData.total).toFixed(2)} remaining
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/30 flex justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Usage</p>
                  <p className="text-2xl font-bold">{costData.usage} kWh</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">26/06/2022-02/07/2022</p>
                </div>
              </div>
            </motion.div>

            {/* Weekly Consumption */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-xl"
              whileHover={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
            >
              <h3 className="text-sm font-semibold mb-4">Daily Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #475569", borderRadius: "8px" }} />
                    <Bar dataKey="electricity" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="gas" stackId="a" fill="#F97316" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Individual Appliances */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { name: "Electricity", value: "£0.26", trend: "+1.2%", color: "from-blue-500 to-blue-600", icon: "⚡" },
                { name: "Gas", value: "£0.05", trend: "-0.3%", color: "from-orange-500 to-orange-600", icon: "💨" },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700/30 backdrop-blur-xl group hover:border-slate-600/50 transition-all cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.trend.startsWith("+") ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
                      {item.trend} than last week
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mb-1">{item.name}</p>
                  <p className="text-2xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-600 group-hover:bg-clip-text transition-all">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Consumption Mix & Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Consumption Mix */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-xl"
              whileHover={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
            >
              <h3 className="text-sm font-semibold mb-4">Energy Consumption</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consumptionMix}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {consumptionMix.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  {consumptionMix.map((item) => (
                    <motion.div
                      key={item.name}
                      className="flex items-center gap-2"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-300">{item.name}</span>
                      <span className="text-sm font-semibold text-white ml-auto">{item.value}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/30">
                <p className="text-slate-400 text-xs mb-3">Detailed hourly breakdown</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" tick={{ fill: "#94A3B8", fontSize: 9 }} />
                      <YAxis tick={{ fill: "#94A3B8", fontSize: 9 }} />
                      <Line type="monotone" dataKey="heating" stroke="#EF4444" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="fridge" stroke="#3B82F6" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Current Tariff */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-xl"
              whileHover={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
            >
              <h3 className="text-sm font-semibold mb-4">Current Tariff</h3>
              <div className="grid grid-cols-2 gap-3">
                {tariffInfo.map((info) => (
                  <motion.div key={info.label} className="space-y-1">
                    <p className="text-slate-400 text-xs">{info.label}</p>
                    <p className="text-sm font-medium text-slate-100">{info.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-xl"
              whileHover={{ borderColor: "rgba(100, 116, 139, 0.5)" }}
            >
              <h3 className="text-sm font-semibold mb-4">Recommendation based on your energy usage</h3>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.title}
                    className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 group hover:border-slate-600/50 transition-all cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${rec.color} text-white`}>
                        {rec.badge}
                      </span>
                    </div>
                    <p className="text-green-400 text-sm font-medium mb-1">{rec.savings}</p>
                    <p className="text-slate-400 text-xs mb-4">{rec.energy}</p>
                    <motion.button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Switch to this supplier
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
