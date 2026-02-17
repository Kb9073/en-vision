"use client"

import { useState } from "react"
import { Bell, Search } from "lucide-react"
import { motion } from "framer-motion"
import { FilterControls, type TimeRange } from "./filter-controls"
import { LiveIndicator } from "./live-indicator"

/* =========================
   TYPES
   ========================= */

interface HeaderProps {
  title: string
  subtitle?: string

  filters: {
    timeRange: TimeRange
    department: string
    device: string
  }

  onFiltersChange: (filters: {
    timeRange: TimeRange
    department: string
    device: string
  }) => void

  /** Optional UI controls */
  showFilters?: boolean
  onSearch?: (query: string) => void
  notificationCount?: number

  /** Backend freshness */
  lastUpdated?: string | Date
}

/* =========================
   COMPONENT
   ========================= */

export function Header({
  title,
  filters,
  subtitle,
  onFiltersChange,
  showFilters = true,
  onSearch,
  notificationCount = 0,
  lastUpdated,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="border-b border-border px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {lastUpdated && (
              <LiveIndicator lastUpdated={lastUpdated} />
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-wrap">

          {/* Filters */}
          {showFilters && (
            <FilterControls
              timeRange={filters.timeRange}
              onTimeRangeChange={(timeRange) =>
                onFiltersChange({ ...filters, timeRange })
              }
              department={filters.department}
              onDepartmentChange={(department) =>
                onFiltersChange({ ...filters, department })
              }
              device={filters.device}
              onDeviceChange={(device) =>
                onFiltersChange({ ...filters, device })
              }
            />
          )}

          {/* Search + Notifications */}
          <div className="flex items-center gap-3">

            {/* Search */}
            {onSearch && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    onSearch(e.target.value)
                  }}
                  placeholder="Search…"
                  className="w-48 h-9 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-chart-4 rounded-full" />
              )}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                JD
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
