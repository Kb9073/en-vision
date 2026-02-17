import { AxiosError } from 'axios';
import { ZodSchema } from 'zod';
import apiClient from '@/lib/api/axios';
import { ApiResponse, ErrorResponse } from '@/lib/api/schemas';

/**
 * Type-safe API client wrapper with validation
 * Automatically validates responses against Zod schemas
 */

interface ApiCallOptions {
  validateResponse?: boolean;
  showErrors?: boolean;
}

class APIClient {
  /**
   * Generic GET request with optional response validation
   */
  async get<T>(
    url: string,
    schema?: ZodSchema,
    options: ApiCallOptions = {}
  ): Promise<T> {
    try {
      const { validateResponse = true, showErrors = true } = options;

      const response = await apiClient.get<ApiResponse<T>>(url);

      if (validateResponse && schema) {
        const validated = schema.parse(response.data);
        return validated.data as T;
      }

      return response.data.data as T;
    } catch (error) {
      return this.handleError(error, options.showErrors);
    }
  }

  /**
   * Generic POST request with optional response validation
   */
  async post<T>(
    url: string,
    data?: Record<string, any>,
    schema?: ZodSchema,
    options: ApiCallOptions = {}
  ): Promise<T> {
    try {
      const { validateResponse = true, showErrors = true } = options;

      const response = await apiClient.post<ApiResponse<T>>(url, data);

      if (validateResponse && schema) {
        const validated = schema.parse(response.data);
        return validated.data as T;
      }

      return response.data.data as T;
    } catch (error) {
      return this.handleError(error, options.showErrors);
    }
  }

  /**
   * Generic PUT request with optional response validation
   */
  async put<T>(
    url: string,
    data?: Record<string, any>,
    schema?: ZodSchema,
    options: ApiCallOptions = {}
  ): Promise<T> {
    try {
      const { validateResponse = true, showErrors = true } = options;

      const response = await apiClient.put<ApiResponse<T>>(url, data);

      if (validateResponse && schema) {
        const validated = schema.parse(response.data);
        return validated.data as T;
      }

      return response.data.data as T;
    } catch (error) {
      return this.handleError(error, options.showErrors);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(
    url: string,
    schema?: ZodSchema,
    options: ApiCallOptions = {}
  ): Promise<T> {
    try {
      const { validateResponse = true, showErrors = true } = options;

      const response = await apiClient.delete<ApiResponse<T>>(url);

      if (validateResponse && schema) {
        const validated = schema.parse(response.data);
        return validated.data as T;
      }

      return response.data.data as T;
    } catch (error) {
      return this.handleError(error, options.showErrors);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(error: any, showError: boolean = true): never {
    const axiosError = error as AxiosError;

    let errorMessage = 'An unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (axiosError.response?.data) {
      const data = axiosError.response.data as ErrorResponse;
      errorMessage = data.error || errorMessage;
      errorCode = data.code || `HTTP_${axiosError.response.status}`;
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
      if (axiosError.code) {
        errorCode = axiosError.code;
      }
    }

    const apiError = new Error(errorMessage) as AxiosError & { code: string };
    apiError.code = errorCode;
    apiError.response = axiosError.response;

    if (showError) {
      console.error(`[API Error] ${errorCode}: ${errorMessage}`, {
        status: axiosError.response?.status,
        url: axiosError.config?.url,
        data: axiosError.response?.data,
      });
    }

    throw apiError;
  }
}

export const apiClient_ = new APIClient();
export default apiClient_;
