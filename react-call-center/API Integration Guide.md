# API Integration Guide

This document maps the Postman collection to the frontend, lists what's left to integrate, and provides a step-by-step integration plan.

---

## Postman vs Frontend: Coverage Matrix

### ✅ Already Wired (Frontend → API)

| Postman Endpoint | Frontend Usage | File |
|------------------|----------------|------|
| `GET /dashboard/kpis` | Dashboard KPIs | Dashboard.tsx, useKPICards |
| `GET /dashboard/call-volume` | Call volume chart | Dashboard.tsx, useCallVolumeData |
| `GET /dashboard/call-duration` | Duration chart | Dashboard.tsx, useCallDurationData |
| `GET /call-logs` | Call logs list | CallLogs.tsx, useCallLogs |
| `GET /call-logs/:id/transcript` | Transcript view | CallTranscript.tsx |
| `GET /call-logs/:id/details` | Call details | CallTranscript.tsx |
| `POST /call-logs/:id/flag` | Flag for review | CallTranscript.tsx |
| `GET /performance/calls-processed` | Performance chart | PerformanceMetrics.tsx |
| `GET /performance/error-rate` | Error rate chart | PerformanceMetrics.tsx |
| `GET /performance/error-types` | Error types chart | PerformanceMetrics.tsx |
| `GET /institutions/:slug/settings` | Settings load | Settings.tsx |
| `PUT /institutions/:slug/settings` | Settings save | Settings.tsx |
| `POST /ai/analyze` | AI summarize/sentiment/action-items | CallLogs.tsx |
| `GET /ai/query` | Query by category | CallLogs.tsx |
| `GET /audio/:call_id` | Audio playback | CallTranscript.tsx |

### ⚠️ Gaps (Postman has, frontend doesn't)

| Postman Endpoint | Gap | Priority |
|------------------|-----|----------|
| `institution` query param | Dashboard, call-logs, performance don't pass `?institution=slug` | Medium |
| `period` on call-volume | Frontend doesn't pass day/week/month/year | Low |
| `page`, `per_page`, `status`, `date_from`, `date_to` on call-logs | No pagination or date filters | Medium |
| Institution CRUD | No admin UI for institutions | Low (admin only) |
| Knowledge Base | No UI for get/create/upload KB | Medium |
| `GET /call-center/call-stats` | Could enhance dashboard | Low |
| `GET /call-center/health` | No health indicator in UI | Low |

### ❌ Not in Postman (Frontend expects)

| Frontend | Endpoint | Notes |
|----------|----------|-------|
| Auth | `POST /auth/login` | Must implement on backend |
| Auth | `POST /auth/register` | Must implement on backend |
| Auth | `POST /auth/forgot-password` | Must implement on backend |
| Auth | `POST /auth/enterprise-contact` | Must implement on backend |
| Billing | `GET /billing/plan` | Must implement on backend |
| Billing | `POST /billing/upgrade` | Must implement on backend |

---

## What's Left on the Frontend

### 1. Switch from Mock to Real API

**Current behavior:** In development (`npm run dev`), `useApi` uses `mockApiService` — no real API calls.

**Options:**
- **A)** Use `apiService` when `VITE_API_BASE_URL` is set (recommended)
- **B)** Always use `apiService` in production builds

### 2. Response Shape Handling

Backend may return `{ data: [...], message: "..." }` instead of raw arrays. The frontend expects raw arrays. Add normalization in `api.ts` `fetchData` if needed.

### 3. Institution Filter

Postman uses `?institution={{institution_slug}}` on dashboard, call-logs, performance. The frontend uses `INSTITUTION_SLUG` from env but doesn't pass it as a query param. Add `institution` to relevant API calls.

### 4. Call Logs: Pagination & Filters

Postman supports:
- `page`, `per_page`
- `status` (completed, active, failed, queued)
- `date_from`, `date_to`

Frontend only has search. Add pagination controls and date/status filters to CallLogs.

### 5. Optional: New Pages

- **Institution Management** — List/create/edit institutions (admin)
- **Knowledge Base** — View/edit KB, upload documents (Settings or separate page)

---

## Where to Start: Integration Checklist

### Step 1: Environment Setup

```bash
# In react-call-center/.env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_INSTITUTION_SLUG=safaricom-customer-care
```

Ensure your backend runs at `http://localhost:8000` (or adjust the URL).

### Step 2: Use Real API Instead of Mock ✅ Done

The app now uses the real API when `VITE_API_BASE_URL` is set. Updated files:
- `src/hooks/useApi.ts` — Dashboard, Call Logs, Settings, Performance, AI, etc.
- `src/App.tsx` — Login
- `src/pages/ForgotPassword.tsx`, `Register.tsx`, `EnterpriseContact.tsx` — Auth flows
- `src/pages/Payment.tsx`, `UpgradeCheckout.tsx` — Billing

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to enable real API.

### Step 3: Test Dashboard First

1. Start backend
2. Log in (or use mock auth if backend auth isn't ready)
3. Open Dashboard
4. Confirm KPIs, call volume, and call duration load from the API
5. If you see errors, check:
   - CORS
   - Response shape (`{ data: [...] }` vs `[...]`)
   - Auth token

### Step 4: Response Normalization (if needed)

If the backend wraps responses:

```typescript
// In api.ts fetchData, after response.json():
const body = await response.json()
return (body.data !== undefined ? body.data : body) as T
```

### Step 5: Add Institution Param

In `api.ts`, append `institution` to dashboard, call-logs, and performance calls:

```typescript
// Example for getKPICards
async getKPICards(): Promise<KPICard[]> {
  const params = new URLSearchParams()
  if (INSTITUTION_SLUG) params.set('institution', INSTITUTION_SLUG)
  const qs = params.toString()
  return this.fetchData<KPICard[]>(`/dashboard/kpis${qs ? `?${qs}` : ''}`)
}
```

### Step 6: Integrate Remaining Pages

| Order | Page | Endpoints | Notes |
|-------|------|-----------|-------|
| 1 | Dashboard | kpis, call-volume, call-duration | Already wired |
| 2 | Settings | institutions/:slug/settings | Already wired |
| 3 | Call Logs | call-logs | Add pagination later |
| 4 | Call Transcript | transcript, details, flag, audio | Already wired |
| 5 | Performance | calls-processed, error-rate, error-types | Already wired |

### Step 7: Auth Flow (Backend Required)

Backend must implement:
- `POST /auth/login` → `{ token, user }`
- `POST /auth/register` → `{ token, user }`
- `POST /auth/forgot-password`
- `POST /auth/enterprise-contact`

Until then, keep using mock auth in dev.

---

## Quick Reference: API Paths

| Category | Path | Method |
|----------|------|--------|
| Dashboard | `/dashboard/kpis` | GET |
| Dashboard | `/dashboard/call-volume` | GET |
| Dashboard | `/dashboard/call-duration` | GET |
| Call Logs | `/call-logs` | GET |
| Call Logs | `/call-logs/:id/transcript` | GET |
| Call Logs | `/call-logs/:id/details` | GET |
| Call Logs | `/call-logs/:id/flag` | POST |
| Performance | `/performance/calls-processed` | GET |
| Performance | `/performance/error-rate` | GET |
| Performance | `/performance/error-types` | GET |
| Settings | `/institutions/:slug/settings` | GET, PUT |
| AI | `/ai/analyze` | POST |
| AI | `/ai/query` | GET |
| Audio | `/audio/:call_id` | GET |

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| CORS errors | Backend CORS allows frontend origin |
| 401 on all requests | Token in localStorage, valid Bearer header |
| Empty/wrong data | Response shape (wrapped vs raw), field names |
| Mock still used | `VITE_API_BASE_URL` set, useApi logic |
