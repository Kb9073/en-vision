"use client"

import type React from "react"
import { useState } from "react"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { HomeTab } from "@/components/tabs/home-tab"
import { EnergyTab } from "@/components/tabs/energy-tab"
import { AnomaliesTab } from "@/components/tabs/anomalies-tab"
import { ForecastingTab } from "@/components/tabs/forecasting-tab"
import { CarbonTab } from "@/components/tabs/CarbonTab"
import { PowerBITab } from "@/components/tabs/power-bi-tab"
import {
  RecommendationsPanel,
  RecommendationsButton,
} from "@/components/dashboard/recommendations-panel"
import { useRecommendations } from "@/hooks/use-dashboard-data"
import { AnimatePresence, motion } from "framer-motion"
import type { TimeRange, CustomDateRange } from "@/components/dashboard/filter-controls"

type TabId =
  | "home"
  | "energy"
  | "anomalies"
  | "forecasting"
  | "carbon"
  | "powerbi"

const tabConfig: Record<
  TabId,
  { title: string; subtitle: string; component: React.ComponentType<any> }
> = {
  home: {
    title: "Mission Control",
    subtitle: "Real-time energy intelligence",
    component: HomeTab,
  },
  energy: {
    title: "Energy Dashboard",
    subtitle: "Consumption analytics",
    component: EnergyTab,
  },
  anomalies: {
    title: "Anomalies",
    subtitle: "AI-detected deviations",
    component: AnomaliesTab,
  },
  forecasting: {
    title: "Forecasting",
    subtitle: "7-day demand prediction",
    component: ForecastingTab,
  },
  carbon: {
    title: "Carbon Analytics",
    subtitle: "Emissions tracking",
    component: CarbonTab,
  },
  powerbi: {
    title: "BI Explorer",
    subtitle: "Advanced Power BI analytics",
    component: PowerBITab,
  },
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false)

  // ✅ SINGLE SOURCE OF TRUTH (FILTERS)
  const [filters, setFilters] = useState({
    timeRange: "7d" as TimeRange,
    department: "All Departments",
    device: "All Devices",
  })
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | undefined>()

  const { data: recommendations } = useRecommendations()
  const pendingRecommendations =
    recommendations?.filter(
      (r) => r.severity === "high" || r.severity === "medium"
    ).length ?? 0

  const { title, subtitle, component: TabComponent } = tabConfig[activeTab]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          filters={filters}
          customDateRange={customDateRange}
          onFiltersChange={setFilters}
          onCustomDateRangeChange={setCustomDateRange}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabComponent filters={filters} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <RecommendationsButton
        onClick={() => setIsRecommendationsOpen(true)}
        count={pendingRecommendations}
      />

      <RecommendationsPanel
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
      />
    </div>
  )
}

export default function Page() {
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  )
}
