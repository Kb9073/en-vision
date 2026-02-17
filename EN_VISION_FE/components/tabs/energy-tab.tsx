"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp, Activity, Leaf, Plug, Wind } from "lucide-react"
import { KPICard } from "@/components/dashboard/kpi-card"
import { DistributionChart } from "@/components/dashboard/distribution-chart"

import {
  useDashboardKPIs,
  useDeviationOverTime,
  useZoneEnergyDistribution,
  useCostMetrics,
  useEnergyIntensity,
  useActiveAppliances,
} from "@/hooks/use-dashboard-data"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const COLORS = ["#14b8a6", "#eab308", "#f43f5e", "#8b5cf6", "#06b6d4"]

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

  const { data: costData = {}, isLoading: costLoading } = useCostMetrics({
    range: filters.timeRange,
  })

  const { data: intensityData = {}, isLoading: intensityLoading } =
    useEnergyIntensity({ range: filters.timeRange })

  const { data: appliancesData = [], isLoading: appliancesLoading } =
    useActiveAppliances({ range: filters.timeRange })

  return (
    <div className="p-6 space-y-6">
      {/* ================= TOP KPIs ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <KPICard
          title="CO₂ Emissions"
          value={kpis?.co2Emissions?.value ?? 0}
          unit="t"
          glowColor="green"
          icon={<Leaf className="w-4 h-4" />}
          isLoading={kpisLoading}
        />
      </div>

      {/* ================= MAIN METRICS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Predicted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-6 text-foreground">
            Cost Predicted
          </h3>

          {costLoading ? (
            <div className="h-48 bg-muted rounded animate-pulse" />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Electricity",
                        value: costData?.electricityCost ?? 214,
                      },
                      { name: "Gas", value: costData?.gasCost ?? 86 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                  >
                    <Cell fill="#14b8a6" />
                    <Cell fill="#eab308" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-chart-1">
                  ${costData?.totalCost ?? 300}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Cost Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-6 text-foreground">
            Change in Cost
          </h3>

          {costLoading ? (
            <div className="h-48 bg-muted rounded animate-pulse" />
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      month: costData?.previousMonth ?? "May",
                      cost: costData?.previousCost ?? 203,
                    },
                    {
                      month: costData?.currentMonth ?? "Jun",
                      cost: costData?.currentCost ?? 214,
                    },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(20, 184, 166, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="cost" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 text-center">
            <div className="text-lg font-bold text-red-500">
              ▲ {costData?.costChangePercent ?? 5.42}%
            </div>
            <div className="text-xs text-muted-foreground">Increase in Cost</div>
          </div>
        </motion.div>

        {/* Usage Estimate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-4 text-foreground">
            Usage Estimate
          </h3>

          <div className="mb-6 flex justify-between text-sm">
            <span className="text-muted-foreground">Till Now</span>
            <span className="font-semibold text-foreground">
              {intensityData?.currentUsage ?? 164.1} kWh
            </span>
          </div>

          <div className="text-right mb-4">
            <span className="text-muted-foreground text-sm">Predicted</span>
            <div className="font-semibold text-foreground">
              {intensityData?.predictedUsage ?? 439} kWh
            </div>
          </div>

          {intensityLoading ? (
            <div className="h-32 bg-muted rounded animate-pulse" />
          ) : (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={intensityData?.usageHistory ?? [
                    { date: "Jun", value: 100 },
                    { date: "Jun 15", value: 300 },
                    { date: "Jun 22", value: 200 },
                    { date: "Jun 29", value: 439 },
                  ]}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ fill: "#f43f5e", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* ================= SECONDARY METRICS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Appliances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-6 text-foreground">
            Active Appliances
          </h3>

          {appliancesLoading ? (
            <div className="h-40 bg-muted rounded animate-pulse" />
          ) : (
            <div className="space-y-4">
              {appliancesData?.map((appliance: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {appliance.name}
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-chart-1 rounded-full"
                        style={{
                          width: `${(appliance.usage / (appliance.maxUsage || 2)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-chart-1 whitespace-nowrap">
                    {appliance.usage} kWh
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Energy Intensity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-6 text-foreground">
            Energy Intensity
          </h3>

          {intensityLoading ? (
            <div className="h-48 bg-muted rounded animate-pulse" />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        value: intensityData?.intensity ?? 47,
                        name: "Intensity",
                      },
                      {
                        value: 100 - (intensityData?.intensity ?? 47),
                        name: "Remaining",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    <Cell fill="#14b8a6" />
                    <Cell fill="rgba(255,255,255,0.1)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="text-4xl font-bold text-chart-1">
                  {intensityData?.intensity ?? 47}
                </div>
                <div className="text-xs text-muted-foreground">
                  kWh/Sqft
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Carbon Footprint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-medium mb-6 text-foreground">
            Carbon Footprint
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Till Date</span>
                <span className="font-semibold">Predicted</span>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {intensityData?.carbonTillDate ?? 36.4}
                  </div>
                  <div className="text-xs text-muted-foreground">Kg of CO₂</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {intensityData?.carbonPredicted ?? 181.8}
                  </div>
                  <div className="text-xs text-muted-foreground">Kg of CO₂</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground mb-2">
                Green Energy Generated
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2"
                  style={{
                    width: `${(intensityData?.greenEnergyPercent ?? 60)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {intensityData?.greenEnergyPercent ?? 60}% - Goal
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= DETAILED CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Deviation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
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
                <LineChart
                  data={deviationOverTime}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="deviationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
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
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ color: "rgba(255, 255, 255, 0.9)" }}
                    formatter={(v: number) => [`${v.toFixed(2)} kWh`, "Deviation"]}
                    cursor={{
                      stroke: "rgba(20, 184, 166, 0.2)",
                      strokeWidth: 1,
                    }}
                  />

                  <ReferenceLine
                    y={0}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1}
                  />

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

        {/* Energy by Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-medium mb-4">Energy Consumption by Zone</h3>

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
                  margin={{ left: 80 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(255,255,255,0.05)"
                  />

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

                  <Bar dataKey="energy" fill="#14b8a6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
