"use client"

import { useQuery } from "@tanstack/react-query"
import { getForecast } from "@/lib/api/dashboard"

export const useForecast = () =>
  useQuery({
    queryKey: ["forecast"],
    queryFn: getForecast,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
