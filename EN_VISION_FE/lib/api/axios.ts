import axios, { AxiosError, AxiosResponse } from 'axios';
import { config } from '@/lib/config';

/**
 * Enhanced API Client with error handling, retry logic, and timeout
 */
export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, Rate Limit, Server Errors
};

/**
 * Request Interceptor - Add authorization headers if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available (implement based on your auth system)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach retry metadata
    config.metadata = config.metadata || {};
    config.metadata.retries = 0;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle errors and retries
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as any;

    if (!config) {
      return Promise.reject(error);
    }

    const { maxRetries, retryDelay, retryableStatuses } = defaultRetryConfig;
    const retries = config.metadata?.retries || 0;

    // Check if error is retryable
    const isRetryable =
      retries < maxRetries &&
      (retryableStatuses.includes(error.response?.status || 0) ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ECONNREFUSED' ||
        !error.response); // Network error

    if (isRetryable) {
      config.metadata.retries = retries + 1;

      // Calculate exponential backoff: 1s, 2s, 4s
      const delay = retryDelay * Math.pow(2, retries);

      console.log(
        `[API] Retrying request to ${config.url} (attempt ${config.metadata.retries}/${maxRetries}) after ${delay}ms`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      return apiClient(config);
    }

    // If not retryable, reject with formatted error
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unknown error occurred';

    const enhancedError = new Error(errorMessage) as AxiosError;
    enhancedError.response = error.response;
    enhancedError.config = error.config;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
