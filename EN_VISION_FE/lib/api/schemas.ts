import { z } from 'zod';

/**
 * API Response Schema - All backend responses follow this structure
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & { data?: T };

/**
 * Dashboard Data Schemas
 */
export const DashboardMetricsSchema = z.object({
  current_consumption: z.number(),
  daily_average: z.number(),
  monthly_average: z.number(),
  last_reading_date: z.string(),
});

export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;

export const EnergyReadingSchema = z.object({
  id: z.number(),
  meter_id: z.number(),
  timestamp: z.string(),
  reading_value: z.number(),
  unit: z.string().optional(),
});

export type EnergyReading = z.infer<typeof EnergyReadingSchema>;

export const DashboardResponseSchema = z.object({
  metrics: DashboardMetricsSchema,
  recent_readings: z.array(EnergyReadingSchema),
  status: z.enum(['ok', 'warning', 'error']),
});

export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;

/**
 * Energy Data Schemas
 */
export const EnergyDataSchema = z.object({
  date: z.string(),
  consumption: z.number(),
  cost: z.number().optional(),
  unit: z.string().optional(),
});

export type EnergyData = z.infer<typeof EnergyDataSchema>;

/**
 * Error Response Schema
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Pagination Schema
 */
export const PaginationSchema = z.object({
  page: z.number().positive(),
  limit: z.number().positive(),
  total: z.number().nonnegative(),
  hasMore: z.boolean(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Paginated Response Schema
 */
export const PaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.unknown()),
  pagination: PaginationSchema.optional(),
  message: z.string().optional(),
});

export type PaginatedResponse<T = unknown> = Omit<z.infer<typeof PaginatedResponseSchema>, 'data'> & {
  data?: T[];
};
