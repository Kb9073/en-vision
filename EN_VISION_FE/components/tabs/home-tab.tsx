"use client"

import { motion } from "framer-motion"
import { KPICard } from "@/components/dashboard/kpi-card"
import { EnergyTrendChart } from "@/components/dashboard/energy-trend-chart"
import { SystemStatus } from "@/components/dashboard/system-status"
import { AIInsightsFeed } from "@/components/dashboard/ai-insights-feed"

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
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs({
    range: filters.timeRange,
  })

  const { data: energyTrend, isLoading: trendLoading } = useEnergyTrend({
    range: filters.timeRange,
  })

  const { data: insights, isLoading: insightsLoading } = useAIInsights()

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-semibold text-foreground">
          System Overview
        </h2>
        <p className="text-muted-foreground mt-1">
          Live energy intelligence & sustainability metrics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard
          title="Total Consumption"
          value={kpis?.totalEnergyConsumption.value ?? 0}
          delta={kpis?.totalEnergyConsumption.delta}
          unit="kWh"
          isLoading={kpisLoading}
        />

        <KPICard
          title="Energy Saved"
          value={kpis?.energySaved.value ?? 0}
          delta={kpis?.energySaved.delta}
          unit="kWh"
        />

        <KPICard
          title="Over Consumption"
          value={kpis?.overConsumptionPercent.value ?? 0}
          delta={kpis?.overConsumptionPercent.delta}
          unit="%"
        />

        <KPICard
          title="CO₂ Emissions"
          value={kpis?.co2Emissions.value ?? 0}
          delta={kpis?.co2Emissions.delta}
          unit="t"
        />
      </div>

      <EnergyTrendChart
        data={energyTrend ?? []}
        isLoading={trendLoading}
        title="Energy Consumption Trend"
        showBaseline
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SystemStatus
          systemStatus={kpis?.systemStatus}
          sustainabilityStatus={kpis?.sustainabilityStatus}
          lastUpdated={kpis?.lastIngestionTimestamp}
        />

        <div className="lg:col-span-2">
          <AIInsightsFeed insights={insights ?? []} isLoading={insightsLoading} />
        </div>
      </div>
    </div>
  )
}