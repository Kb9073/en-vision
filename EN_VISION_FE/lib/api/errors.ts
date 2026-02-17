/**
 * Centralized error handling utilities for API calls
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Extract meaningful error message from various error sources
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'An unknown error occurred. Please try again.'
}

/**
 * Extract status code from error
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (error instanceof APIError) {
    return error.statusCode
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response
    if (response?.status) {
      return response.status
    }
  }

  return undefined
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const statusCode = getErrorStatusCode(error)

  if (!statusCode) {
    return true // Network errors are retryable
  }

  // Retry on server errors and rate limiting
  return statusCode >= 500 || statusCode === 429 || statusCode === 408
}

/**
 * Log error for debugging
 */
export function logError(context: string, error: unknown): void {
  const message = getErrorMessage(error)
  const statusCode = getErrorStatusCode(error)

  console.error(`[${context}] Error:`, {
    message,
    statusCode,
    error,
  })
}
