"use client"
import { Calendar } from "lucide-react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar as CalendarIcon,
  Building2,
  Cpu,
  ChevronDown,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* =========================
   TYPES
   ========================= */

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "custom"

export interface CustomDateRange {
  startDate: string
  endDate: string
}

interface FilterControlsProps {
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void

  customDateRange?: CustomDateRange
  onCustomDateRangeChange?: (range: CustomDateRange) => void

  department: string
  onDepartmentChange: (dept: string) => void

  device: string
  onDeviceChange: (device: string) => void

  /** Optional – useful for backend-driven filters */
  availableDepartments?: string[]
  availableDevices?: string[]
}

/* =========================
   CONSTANTS
   ========================= */

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: "24h", label: "24 Hours" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "custom", label: "Custom Range" },
]

const DEFAULT_DEPARTMENTS = [
  "All Departments",
  "Building A",
  "Building B",
  "Building C",
  "HVAC",
  "Lighting",
]

const DEFAULT_DEVICES = [
  "All Devices",
  "HVAC Units",
  "Lighting Systems",
  "Equipment",
  "Sensors",
]

/* =========================
   DROPDOWN
   ========================= */

interface DropdownProps {
  icon: typeof Calendar
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function Dropdown({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-sm hover:bg-secondary/80 transition-colors"
      >
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground hidden sm:inline">
          {value}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-0 top-full mt-1 w-48 glass-card border border-border z-50 py-1"
              role="listbox"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center justify-between",
                    "hover:bg-secondary/80 transition-colors",
                    value === option
                      ? "text-primary"
                      : "text-foreground"
                  )}
                  role="option"
                  aria-selected={value === option}
                >
                  {option}
                  {value === option && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =========================
   CUSTOM DATE RANGE PICKER
   ========================= */

interface CustomDatePickerProps {
  isOpen: boolean
  onClose: () => void
  customDateRange?: CustomDateRange
  onChange: (range: CustomDateRange) => void
}

function CustomDatePicker({
  isOpen,
  onClose,
  customDateRange,
  onChange,
}: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState(customDateRange?.startDate || "")
  const [endDate, setEndDate] = useState(customDateRange?.endDate || "")

  const handleApply = () => {
    if (startDate && endDate) {
      onChange({ startDate, endDate })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute right-0 top-full mt-2 w-80 glass-card border border-border z-50 p-4 rounded-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* =========================
   MAIN COMPONENT
   ========================= */

export function FilterControls({
  timeRange,
  onTimeRangeChange,
  customDateRange,
  onCustomDateRangeChange,
  department,
  onDepartmentChange,
  device,
  onDeviceChange,
  availableDepartments = DEFAULT_DEPARTMENTS,
  availableDevices = DEFAULT_DEVICES,
}: FilterControlsProps) {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Time Range Selector */}
        <div className="glass-card p-1 inline-flex gap-0.5">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => {
                onTimeRangeChange(range.id)
                if (range.id === "custom") {
                  setIsCustomDateOpen(true)
                }
              }}
              className={cn(
                "relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                timeRange === range.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {timeRange === range.id && (
                <motion.div
                  layoutId="time-range-bg"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.4,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                {range.id === "custom" && <CalendarIcon className="w-3 h-3" />}
                {range.label}
              </span>
            </button>
          ))}
        </div>

        {/* Department */}
        <Dropdown
          icon={Building2}
          label="Department"
          value={department}
          options={availableDepartments}
          onChange={onDepartmentChange}
        />

        {/* Device */}
        <Dropdown
          icon={Cpu}
          label="Device"
          value={device}
          options={availableDevices}
          onChange={onDeviceChange}
        />
      </div>

      {/* Custom Date Range Display */}
      {timeRange === "custom" && customDateRange && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground flex items-center justify-between"
        >
          <span>
            {customDateRange.startDate} to {customDateRange.endDate}
          </span>
          <button
            type="button"
            onClick={() => setIsCustomDateOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Custom Date Picker Modal */}
      <AnimatePresence>
        {isCustomDateOpen && onCustomDateRangeChange && (
          <CustomDatePicker
            isOpen={isCustomDateOpen}
            onClose={() => setIsCustomDateOpen(false)}
            customDateRange={customDateRange}
            onChange={onCustomDateRangeChange}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
