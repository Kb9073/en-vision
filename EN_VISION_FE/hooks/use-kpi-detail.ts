import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/axios"
import type { KPIDetailData } from "@/components/dashboard/kpi-detail-panel"


type TrendPoint = { date: string; value: number }

export function useKPIDetail(metric: "total" | "average" | "peak") {
  return useQuery({
    queryKey: ["kpi-detail", metric],
    queryFn: async (): Promise<KPIDetailData> => {
      const [trendRes, breakdownRes, deviationRes] = await Promise.all([
        apiClient.get("/dashboard/energy-trend"),
        apiClient.get("/dashboard/carbon-breakdown"),
        apiClient.get("/dashboard/deviations"),
      ])

      /* ---------- TREND ---------- */
      const trend: TrendPoint[] = trendRes.data.map((d: any) => ({
        date: d.date,
        value: d.actual,
      }))

      /* ---------- BREAKDOWN ---------- */
      const total = breakdownRes.data.reduce(
        (sum: number, b: any) => sum + b.value,
        0
      )

      const breakdown = breakdownRes.data.map((b: any) => ({
        name: b.source,
        value: b.value,
        percentage: total > 0 ? (b.value / total) * 100 : 0,
      }))

      /* ---------- PEAK POINT ---------- */
      const peakPoint = trend.reduce<TrendPoint>(
        (max, t) => (t.value > max.value ? t : max),
        { date: "-", value: 0 }
)
      /* ---------- FINAL ---------- */
      return {
        trend,
        breakdown,
        context: {
          affectedDepartments: ["Manufacturing", "Operations"],
          peakHour: peakPoint.date,
          comparedToBaseline: deviationRes.data?.avgDeviation ?? 0,
          lastUpdated: new Date().toISOString(),
        },
      }
    },
  })
}
