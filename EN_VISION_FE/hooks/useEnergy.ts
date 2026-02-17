"use client"

import { useQuery } from "@tanstack/react-query"
import { getKPIs } from "@/lib/api/dashboard"

export const useKPIs = () =>
  useQuery({
    queryKey: ["kpis"],
    queryFn: () => getKPIs(),
    refetchInterval: 20_000,
    staleTime: 10_000,
  })
