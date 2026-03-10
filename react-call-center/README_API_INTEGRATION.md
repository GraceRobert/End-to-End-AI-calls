# API Integration Guide

This guide explains how the Call Center application integrates with backend APIs and how to switch from mock data to real API endpoints.

## Quick Start

### 1. Development Mode (Mock Data)

The application automatically uses mock data in development mode. No configuration needed - just run:

```bash
npm run dev
```

### 2. Production Mode (Real API)

To use real API endpoints, set the environment variable:

```bash
# Create .env file
echo "VITE_API_BASE_URL=https://your-api-domain.com/api" > .env

# Or set in your deployment environment
export VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Architecture Overview

The application uses a layered architecture for API integration:

```
Components → Hooks → API Service → Backend/Mock
```

### 1. API Service Layer (`src/services/api.ts`)

- Handles HTTP requests and responses
- Manages base URL configuration
- Provides error handling and type safety
- Automatically switches between real API and mock data

### 2. Custom Hooks (`src/hooks/useApi.ts`)

- Provides React hooks for data fetching
- Manages loading states and error handling
- Handles caching and refetching
- Provides mutation hooks for POST/PUT/DELETE operations

### 3. Mock Data Service (`src/services/mockApiService.ts`)

- Provides realistic mock data for development
- Simulates API delays and responses
- Includes error simulation for testing

## Environment Configuration

### Development

```bash
# Uses mock data automatically
VITE_API_BASE_URL=http://localhost:3001/api
```

### Production

```bash
# Points to your real API
VITE_API_BASE_URL=https://api.yourdomain.com/v1
```

## API Service Features

### Automatic Mock/Real API Switching

```typescript
// Automatically detects environment
const isDevelopment = import.meta.env.DEV
const api = isDevelopment ? mockApiService : apiService
```

### Error Handling

```typescript
try {
  const data = await api.getCallLogs()
  // Handle success
} catch (error) {
  // Handle error
  console.error("API Error:", error)
}
```

### Type Safety

All API responses are fully typed:

```typescript
interface CallLog {
  id: number
  timestamp: string
  userId: string
  duration: string
  transcript: string
  status: string
}
```

## Using API Hooks in Components

### Data Fetching

```typescript
import { useCallLogs } from "../hooks/useApi"

const CallLogsComponent = () => {
  const { data, loading, error, refetch } = useCallLogs()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data?.map((log) => (
        <div key={log.id}>{log.timestamp}</div>
      ))}
    </div>
  )
}
```

### Mutations

```typescript
import { useUpdateSettings } from "../hooks/useApi"

const SettingsComponent = () => {
  const { mutate: updateSettings, loading } = useUpdateSettings()

  const handleSave = async () => {
    try {
      await updateSettings(newSettings)
      alert("Settings saved!")
    } catch (error) {
      alert("Failed to save settings")
    }
  }

  return (
    <button onClick={handleSave} disabled={loading}>
      {loading ? "Saving..." : "Save"}
    </button>
  )
}
```

## Backend Requirements

Your backend API must implement all endpoints listed in `API_ENDPOINTS.md`. Key requirements:

### 1. CORS Configuration

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
)
```

### 2. Response Format

All endpoints should return JSON with consistent structure:

```json
{
  "data": [...],
  "message": "Success",
  "status": "ok"
}
```

### 3. Error Handling

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details"
}
```

## Authentication Integration

### API Key Authentication

Update `src/services/api.ts`:

```typescript
private async fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VITE_API_KEY}`,
      ...options?.headers,
    },
    ...options,
  })
  // ... rest of implementation
}
```

### JWT Token Authentication

```typescript
// Get token from localStorage or context
const token = localStorage.getItem("authToken")

const response = await fetch(`${this.baseUrl}${endpoint}`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options?.headers,
  },
  ...options,
})
```

## Testing API Integration

### 1. Test Mock Data

```bash
npm run dev
# Verify all features work with mock data
```

### 2. Test Real API

```bash
# Set environment variable
export VITE_API_BASE_URL=https://your-api-domain.com/api

# Run application
npm run dev
```

### 3. Test Error Handling

Temporarily set an invalid API URL to test error states:

```bash
export VITE_API_BASE_URL=https://invalid-url.com/api
```

## Deployment Considerations

### Environment Variables

Set in your deployment platform:

**Vercel:**

```bash
vercel env add VITE_API_BASE_URL
```

**Netlify:**

```bash
netlify env:set VITE_API_BASE_URL https://your-api-domain.com/api
```

**Docker:**

```dockerfile
ENV VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Build Process

The environment variable is embedded at build time:

```bash
npm run build
# VITE_API_BASE_URL is now baked into the build
```

## Monitoring and Debugging

### API Request Logging

Enable detailed logging in development:

```typescript
// In api.ts
console.log(`API Request: ${method} ${endpoint}`, { data, options })
```

### Network Tab

Use browser dev tools to monitor:

- Request/response headers
- Response times
- Error status codes
- Network failures

### Error Boundaries

Implement React error boundaries to catch API errors:

```typescript
class ApiErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("API Error:", error, errorInfo)
    // Send to error reporting service
  }
}
```

## Performance Optimization

### Caching

Implement caching for frequently accessed data:

```typescript
const { data, loading, error } = useCallLogs()
// Data is automatically cached and reused
```

### Pagination

For large datasets, implement pagination:

```typescript
const { data, loading, error } = useCallLogs({ page: 1, limit: 50 })
```

### Debouncing

For search functionality:

```typescript
const debouncedSearch = useDebounce(searchQuery, 300)
const { data } = useCallLogs(debouncedSearch)
```

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend has proper CORS configuration
   - Check that frontend domain is whitelisted

2. **Authentication Failures**

   - Verify API key/token is correct
   - Check token expiration
   - Ensure headers are properly set

3. **Data Format Mismatches**

   - Compare API response with expected TypeScript interfaces
   - Check for missing or extra fields

4. **Network Timeouts**
   - Increase timeout values in API service
   - Implement retry logic for failed requests

### Debug Mode

Enable debug logging:

```typescript
// In api.ts
const DEBUG = import.meta.env.DEV
if (DEBUG) {
  console.log("API Debug:", { endpoint, data, response })
}
```

## Migration Checklist

When switching from mock to real API:

- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Verify all endpoints return expected data format
- [ ] Test authentication (if required)
- [ ] Check CORS configuration
- [ ] Test error handling scenarios
- [ ] Verify loading states work correctly
- [ ] Test all CRUD operations
- [ ] Check performance with real data
- [ ] Monitor for any console errors
- [ ] Test on different devices/browsers

## Support

For issues with API integration:

1. Check browser console for errors
2. Verify network requests in dev tools
3. Compare API responses with expected format
4. Test endpoints independently (Postman/curl)
5. Check backend logs for server-side issues

The application is designed to gracefully handle API failures and provide meaningful error messages to users.
