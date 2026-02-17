/**
 * Configuration utility for environment variables
 * All public environment variables are prefixed with NEXT_PUBLIC_
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  },
  env: process.env.NEXT_PUBLIC_ENV || 'development',
  isDevelopment: process.env.NEXT_PUBLIC_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
} as const;

// Validate critical configuration
if (!config.api.baseUrl) {
  console.warn('[v0] Warning: API base URL is not configured');
}

export default config;
