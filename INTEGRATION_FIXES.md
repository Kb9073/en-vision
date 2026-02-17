# Frontend-Backend Integration Fixes

This document outlines all the integration issues that were fixed and how to use the new system.

## Changes Made

### 1. Environment Configuration System ✅
**Files Modified:**
- Created: `EN_VISION_FE/.env.local.example`
- Created: `EN_VISION_FE/lib/config.ts`

**What Changed:**
- Removed hardcoded `http://localhost:8000` from all API calls
- Implemented environment-based configuration using `NEXT_PUBLIC_*` variables
- Added timeout configuration

**How to Setup:**
```bash
# Frontend - Copy the example file
cp EN_VISION_FE/.env.local.example EN_VISION_FE/.env.local

# Edit .env.local and set your backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Change for production
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

```bash
# Backend - Copy the example file
cp EN_VISION_BE/.env.example EN_VISION_BE/.env

# Edit .env and configure CORS for your frontend URL
ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

### 2. Type-Safe API Layer with Validation ✅
**Files Created:**
- `EN_VISION_FE/lib/api/schemas.ts` - Zod schemas for all API responses
- `EN_VISION_FE/lib/api/client.ts` - Type-safe wrapper around axios

**What Changed:**
- All API calls now include response validation
- Consistent error handling across all API methods
- Type safety ensures TypeScript catches mismatches early

**Example Usage:**
```typescript
import { apiClient_ } from '@/lib/api/client';
import { DashboardResponseSchema } from '@/lib/api/schemas';

const dashboard = await apiClient_.get(
  '/dashboard',
  DashboardResponseSchema,
  { showErrors: true }
);
```

---

### 3. Enhanced Error Handling & Retry Logic ✅
**Files Modified:**
- Updated: `EN_VISION_FE/lib/api/axios.ts`
- Created: `EN_VISION_FE/lib/api/errors.ts`

**What Changed:**
- Automatic retry for failed requests with exponential backoff
- Retry configuration: up to 3 attempts, 1s → 2s → 4s delays
- Handles network timeouts, connection errors, and server errors
- Centralized error logging

**Configuration:**
Default retry settings in `axios.ts`:
```typescript
const defaultRetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};
```

**Error Handling:**
```typescript
import { getErrorMessage, isRetryableError, logError } from '@/lib/api/errors';

try {
  const data = await apiClient_.get('/dashboard');
} catch (error) {
  const message = getErrorMessage(error); // Consistent error messages
  const retryable = isRetryableError(error); // Check if should retry
  logError('DashboardComponent', error); // Log for debugging
}
```

---

### 4. CORS Configuration in Backend ✅
**Files Modified:**
- Updated: `EN_VISION_BE/main.py`
- Created: `EN_VISION_BE/.env.example`

**What Changed:**
- CORS now configurable via environment variables
- Supports multiple origins for different environments
- Automatic duplicate removal
- More HTTP methods allowed (PATCH added)
- Improved preflight caching (1 hour)

**Backend CORS Setup:**
```python
# main.py now reads from environment
ENV = os.getenv("ENV", "development")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "...").split(",")

# Development mode allows all origins with "*"
# Production should use specific origins only
```

---

### 5. React Query Provider Enhancement ✅
**Files Modified:**
- Updated: `EN_VISION_FE/components/providers.tsx`

**What Changed:**
- Better default cache configurations
- Automatic retry with exponential backoff
- React Query Devtools for development
- Optimized stale time and garbage collection

**Configuration:**
```typescript
{
  queries: {
    staleTime: 30 * 1000,        // 30 seconds
    gcTime: 5 * 60 * 1000,        // 5 minutes (old cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  },
  mutations: {
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  },
}
```

---

### 6. Dashboard API Updates ✅
**Files Modified:**
- Updated: `EN_VISION_FE/lib/api/dashboard.ts`

**What Changed:**
- All API functions now use the new `apiClient_` with proper error handling
- Consistent error logging for each API call
- Type-safe return values

**Usage:**
```typescript
// All dashboard functions now have consistent error handling
const kpis = await getKPIs(filters);      // ✅ Error caught & logged
const trend = await getEnergyTrend(filters); // ✅ Retries automatically
const carbon = await getCarbonMetrics();    // ✅ Type-safe response
```

---

## Checklist Before Running

- [ ] Frontend `.env.local` created with correct `NEXT_PUBLIC_API_BASE_URL`
- [ ] Backend `.env` created with correct `ENV` and `ALLOWED_ORIGINS`
- [ ] Both services have `package.json` dependencies installed
- [ ] Backend is running on the URL specified in frontend `.env.local`
- [ ] Frontend is running (typically `http://localhost:3000`)

## Testing the Integration

### 1. Test API Connection
```typescript
// In any component
import { apiClient_ } from '@/lib/api/client';

const testConnection = async () => {
  try {
    const response = await apiClient_.get('/');
    console.log('[v0] API Connected:', response);
  } catch (error) {
    console.error('[v0] API Connection Failed:', error);
  }
};
```

### 2. Check Console for Errors
Look for these in browser DevTools Console:
- `[API Error]` - API errors with retry attempts
- `[v0]` - Custom debug logs
- Network tab - Check request headers and CORS

### 3. Monitor React Query Devtools
- Open React Query Devtools (visible in development)
- Check cache times and refetch intervals
- Monitor request/response lifecycle

---

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `ALLOWED_ORIGINS` in backend `.env` includes your frontend URL
2. Verify backend is running
3. Check Network tab for `OPTIONS` preflight requests
4. Try: `ALLOWED_ORIGINS=*` in development only

### Issue: 404 Not Found on API Endpoints
**Error:** `404: /dashboard/kpis not found`

**Solution:**
1. Verify backend routes are correctly registered in `main.py`
2. Check endpoint paths match exactly (case-sensitive)
3. Verify backend router files exist and are imported

### Issue: Timeout on API Calls
**Error:** `Request timeout after 30s`

**Solution:**
1. Increase `NEXT_PUBLIC_API_TIMEOUT` in frontend `.env.local`
2. Check backend is running and responding
3. Monitor network latency

### Issue: Authorization Token Not Sent
**Error:** `401: Unauthorized`

**Solution:**
1. Implement token storage in localStorage/cookie
2. Update `apiClient` request interceptor to include token
3. Example is in `axios.ts` with comment: `// Implement based on your auth system`

---

## File Structure Reference

```
EN_VISION_FE/
├── .env.local.example          ← Copy to .env.local
├── lib/
│   ├── config.ts               ← Environment config
│   └── api/
│       ├── axios.ts            ← HTTP client with retries
│       ├── client.ts           ← Type-safe wrapper
│       ├── schemas.ts          ← Zod validation schemas
│       ├── dashboard.ts        ← Dashboard API functions
│       └── errors.ts           ← Error utilities
├── components/
│   └── providers.tsx           ← React Query provider
└── hooks/
    └── use-dashboard-data.ts   ← Hook example

EN_VISION_BE/
├── .env.example                ← Copy to .env
└── main.py                      ← CORS configuration
```

---

## Next Steps

1. **Add Authentication:**
   - Implement token storage
   - Update axios interceptor
   - Add auth guards to protected endpoints

2. **Add Validation:**
   - Define more Zod schemas for each endpoint
   - Validate request payloads
   - Add input sanitization

3. **Add Monitoring:**
   - Setup error tracking (Sentry, etc.)
   - Monitor API response times
   - Track failed requests

4. **Optimize Performance:**
   - Implement request caching strategies
   - Add pagination for large datasets
   - Compress responses

---

## Support

If issues persist after these fixes:
1. Check browser Console for specific error messages
2. Monitor Network tab for failed requests
3. Review `.env` files for correct configuration
4. Verify both services are running on correct ports
