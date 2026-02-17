"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Info,
  Sparkles,
} from "lucide-react"
import type { AIInsight } from "@/lib/api"

interface AIInsightsFeedProps {
  insights: AIInsight[]
  isLoading?: boolean
}

/* =========================
   ICON & COLOR MAPS
   ========================= */

const iconMap = {
  alert: AlertTriangle,
  improvement: Lightbulb,
  forecast: TrendingUp,
  info: Info,
}

const colorMap = {
  alert: "text-chart-4 bg-chart-4/10",
  improvement: "text-chart-2 bg-chart-2/10",
  forecast: "text-chart-1 bg-chart-1/10",
  info: "text-chart-3 bg-chart-3/10",
}

/* =========================
   COMPONENT
   ========================= */

export function AIInsightsFeed({ insights, isLoading }: AIInsightsFeedProps) {
  /* ---------- Loading State ---------- */
  if (isLoading) {
    return (
      <div className="glass-card p-5 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">
          AI Insights
        </h3>
      </div>

      {/* Empty State */}
      {insights.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No AI insights available at the moment.
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const Icon =
              iconMap[insight.type as keyof typeof iconMap] ?? Info

            const colorClass =
              colorMap[insight.type as keyof typeof colorMap] ??
              "text-muted-foreground bg-muted/10"

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {/* Icon */}
                <div
                  className={cn(
                    "p-1.5 rounded-lg shrink-0",
                    colorClass
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.message}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(insight.timestamp).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>

                  {/* AI Explainability */}
                  {(insight.source || insight.confidence !== undefined) && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {insight.source && (
                        <>Source: {insight.source}</>
                      )}
                      {insight.source &&
                        insight.confidence !== undefined && " • "}
                      {insight.confidence !== undefined && (
                        <>
                          Confidence:{" "}
                          {(insight.confidence * 100).toFixed(0)}%
                        </>
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
