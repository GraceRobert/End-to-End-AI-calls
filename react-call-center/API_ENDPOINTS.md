# API Endpoints Documentation

This document outlines all the required API endpoints for the Call Center application. When your backend is ready, you only need to update the `VITE_API_BASE_URL` environment variable to point to your API.

## Base Configuration

Set the following environment variable:

```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Required Endpoints

### Authentication Endpoints

#### POST `/auth/login`

Authenticates a user and returns a token for subsequent API requests.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response (supports `token` or `access_token`):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

The app stores the token and sends it as `Authorization: Bearer <token>` on all protected API requests.

### Dashboard Endpoints

#### GET `/dashboard/kpis`

Returns KPI cards data for the dashboard.

**Response:**

```json
[
  {
    "title": "Active Calls",
    "value": "125",
    "change": "+10%",
    "isPositive": true,
    "color": "text-green-600"
  },
  {
    "title": "System Load",
    "value": "75%",
    "change": "-5%",
    "isPositive": false,
    "color": "text-blue-600"
  },
  {
    "title": "Error Rate",
    "value": "2%",
    "change": "+1%",
    "isPositive": false,
    "color": "text-red-600"
  }
]
```

#### GET `/dashboard/call-volume`

Returns call volume data over time.

**Response:**

```json
[
  { "day": "Monday", "calls": 120 },
  { "day": "Tuesday", "calls": 135 },
  { "day": "Wednesday", "calls": 150 },
  { "day": "Thursday", "calls": 140 },
  { "day": "Friday", "calls": 160 },
  { "day": "Saturday", "calls": 90 },
  { "day": "Sunday", "calls": 75 }
]
```

#### GET `/dashboard/call-duration`

Returns call duration distribution data.

**Response:**

```json
[
  { "range": "0-10 min", "calls": 45, "percentage": 45 },
  { "range": "10-20 min", "calls": 30, "percentage": 30 },
  { "range": "20-30 min", "calls": 20, "percentage": 20 },
  { "range": "30+ min", "calls": 5, "percentage": 5 }
]
```

### Call Logs Endpoints

#### GET `/call-logs`

Returns list of call logs with optional search filtering.

**Query Parameters:**

- `search` (optional): Search term for filtering logs

**Response:**

```json
[
  {
    "id": 1,
    "timestamp": "2024-08-16 10:30 AM",
    "userId": "user123",
    "duration": "8 min",
    "transcript": "Transcript available",
    "status": "completed"
  }
]
```

#### GET `/call-logs/{callId}/transcript`

Returns transcript for a specific call.

**Response:**

```json
[
  {
    "speaker": "Caller",
    "time": "10:01 AM",
    "message": "Hello, I'm calling to inquire about my recent order."
  },
  {
    "speaker": "AI",
    "time": "10:02 AM",
    "message": "Hello! I'd be happy to help you with your order."
  }
]
```

#### GET `/call-logs/{callId}/details`

Returns detailed information about a specific call.

**Response:**

```json
{
  "id": "987654",
  "dateTime": "2024-01-16 10:00 AM",
  "duration": "8 minutes",
  "nlpIntent": "Order inquiry and status check",
  "audioUrl": "/api/audio/987654"
}
```

### Performance Metrics Endpoints

#### GET `/performance/calls-processed`

Returns calls processed over time data.

**Response:**

```json
[
  { "time": "12 AM", "calls": 45 },
  { "time": "3 AM", "calls": 32 },
  { "time": "6 AM", "calls": 28 },
  { "time": "9 AM", "calls": 89 },
  { "time": "12 PM", "calls": 156 },
  { "time": "3 PM", "calls": 134 },
  { "time": "6 PM", "calls": 98 },
  { "time": "9 PM", "calls": 67 }
]
```

#### GET `/performance/error-rate`

Returns error rate trend data.

**Response:**

```json
[
  { "time": "12 AM", "rate": 1.2 },
  { "time": "3 AM", "rate": 0.8 },
  { "time": "6 AM", "rate": 1.5 },
  { "time": "9 AM", "rate": 2.1 },
  { "time": "12 PM", "rate": 3.2 },
  { "time": "3 PM", "rate": 2.8 },
  { "time": "6 PM", "rate": 2.3 },
  { "time": "9 PM", "rate": 1.9 }
]
```

#### GET `/performance/error-types`

Returns error breakdown by type.

**Response:**

```json
[
  { "type": "Network Error", "count": 35, "percentage": 35 },
  { "type": "Timeout", "count": 28, "percentage": 28 },
  { "type": "Invalid Input", "count": 22, "percentage": 22 },
  { "type": "Other", "count": 15, "percentage": 15 }
]
```

### Settings Endpoints

#### GET `/settings`

Returns current call center settings.

**Response:**

```json
{
  "callCentreName": "AI Call Center Pro",
  "callCentreDescription": "Advanced AI-powered call center solution",
  "defaultLanguage": "English",
  "defaultVoice": "en-US-Standard-A",
  "defaultGreeting": "Hello! Thank you for calling. How can I assist you today?",
  "crmIntegrationKey": "sk-1234567890abcdef"
}
```

#### PUT `/settings`

Updates call center settings.

**Request Body:**

```json
{
  "callCentreName": "Updated Call Center Name",
  "defaultLanguage": "Spanish",
  "defaultVoice": "es-ES-Standard-A"
}
```

**Response:**

```json
{
  "callCentreName": "Updated Call Center Name",
  "callCentreDescription": "Advanced AI-powered call center solution",
  "defaultLanguage": "Spanish",
  "defaultVoice": "es-ES-Standard-A",
  "defaultGreeting": "Hello! Thank you for calling. How can I assist you today?",
  "crmIntegrationKey": "sk-1234567890abcdef"
}
```

### AI Analysis Endpoints

#### POST `/ai/analyze`

Performs AI analysis on call data.

**Request Body:**

```json
{
  "type": "summarize",
  "callId": "12345",
  "category": "orders"
}
```

**Response:**

```json
{
  "result": "Customer called to inquire about order status. Order #12345 is being processed and will ship within 3 business days.",
  "confidence": 0.95
}
```

#### GET `/ai/query?category={category}`

Queries calls by category.

**Query Parameters:**

- `category`: Category to filter by (e.g., "complaints", "orders", "support")

**Response:**

```json
[
  {
    "id": 1,
    "timestamp": "2024-08-16 10:30 AM",
    "userId": "user123",
    "duration": "8 min",
    "transcript": "Transcript available",
    "status": "completed"
  }
]
```

### Audio Endpoints

#### GET `/audio/{callId}`

Returns audio URL for a specific call.

**Response:**

```json
{
  "audioUrl": "https://your-cdn.com/audio/call-12345.mp3"
}
```

### Flagging Endpoints

#### POST `/call-logs/{callId}/flag`

Flags a call for review.

**Request Body:**

```json
{
  "reason": "Manual review requested"
}
```

**Response:**

```json
{
  "success": true
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses should follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Authentication

If your API requires authentication, include the appropriate headers in your API service implementation. Common approaches:

1. **API Key**: Add `Authorization: Bearer YOUR_API_KEY` header
2. **JWT Token**: Add `Authorization: Bearer YOUR_JWT_TOKEN` header
3. **Basic Auth**: Add `Authorization: Basic base64(username:password)` header

Update the `fetchData` method in `src/services/api.ts` to include authentication headers as needed.

## CORS Configuration

Ensure your backend API has CORS configured to allow requests from your frontend domain:

```javascript
// Example for Express.js
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
)
```

## Rate Limiting

Consider implementing rate limiting on your API endpoints to prevent abuse:

```javascript
// Example rate limiting
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

app.use("/api/", limiter)
```

## Testing

You can test your API endpoints using tools like:

- **Postman**: GUI-based API testing
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

Example curl command:

```bash
curl -X GET "https://your-api-domain.com/api/dashboard/kpis" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Migration from Mock Data

When your backend is ready:

1. Set the `VITE_API_BASE_URL` environment variable
2. Ensure all endpoints return data in the expected format
3. Test each endpoint individually
4. Update authentication if required
5. The app will automatically switch from mock data to real API calls

The mock data service will be automatically disabled when a real API URL is configured.
