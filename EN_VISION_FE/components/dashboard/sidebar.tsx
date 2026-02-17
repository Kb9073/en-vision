"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Home,
  Zap,
  AlertTriangle,
  TrendingUp,
  Leaf,
  Settings,
  ChevronLeft,
  BarChart3,
} from "lucide-react"

/* =========================
   TYPES
   ========================= */

export type TabId =
  | "home"
  | "energy"
  | "anomalies"
  | "forecasting"
  | "carbon"
  | "powerbi"

interface SidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

/* =========================
   NAV CONFIG
   ========================= */

const navItems: {
  id: TabId
  label: string
  icon: React.ElementType
  divider?: boolean
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "energy", label: "Energy Dashboard", icon: Zap },
  { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
  { id: "forecasting", label: "Forecasting", icon: TrendingUp },
  { id: "carbon", label: "Carbon Analytics", icon: Leaf },
  { id: "powerbi", label: "BI Explorer", icon: BarChart3, divider: true },
]

/* =========================
   COMPONENT
   ========================= */

export function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>

          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground tracking-tight">
              EN-VISION
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            const Icon = item.icon

            return (
              <li
                key={item.id}
                className={cn(item.divider && "mt-4 pt-4 border-t border-sidebar-border")}
              >
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                    "hover:bg-sidebar-accent group",
                    isActive && "bg-sidebar-accent",
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-sidebar-foreground",
                      item.id === "powerbi" && !isActive && "text-chart-5",
                    )}
                  />

                  {/* Label */}
                  {!collapsed && (
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        isActive
                          ? "text-sidebar-foreground font-medium"
                          : "text-muted-foreground group-hover:text-sidebar-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  )
}
