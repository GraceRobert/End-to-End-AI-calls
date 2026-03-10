 # Authentication and Authorization

This document outlines the implementation order for authentication and authorization in the Call Center application.

---

## Implementation Order

### Phase 1: Authentication (Core)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | **Auth context & state** | ✅ Done | `AuthContext` with login, logout, token storage in localStorage |
| 2 | **Login page** | ✅ Done | Email/password form, password visibility toggle |
| 3 | **API service auth** | ✅ Done | Bearer token attached to requests; 401 triggers logout |
| 4 | **Protected routes** | ✅ Done | `ProtectedRoute` redirects unauthenticated users to `/login` |
| 5 | **Logout** | ✅ Done | Sign out in sidebar and header |
| 6 | **Password recovery** | ✅ Done | Forgot password flow; `POST /auth/forgot-password` |
| 7 | **Backend login endpoint** | Pending | Implement `POST /auth/login` returning `{ token, user }` |
| 8 | **Backend forgot-password** | Pending | Implement `POST /auth/forgot-password` |

### Phase 2: Registration & Onboarding

| # | Task | Status | Notes |
|---|------|--------|-------|
| 9 | **Plan selection page** | ✅ Done | Essentials, Pro, Enterprise tiers |
| 10 | **Registration page** | ✅ Done | Full form (name, email, password, company, phone); calls `POST /auth/register`; auto-login on success |
| 11 | **Enterprise contact form** | ✅ Done | Full form (company, contact, email, phone, use case, message); calls `POST /auth/enterprise-contact`; success state |
| 12 | **Backend register endpoint** | Pending | `POST /auth/register` with plan tier; returns `{ token, user }` |
| 13 | **Backend enterprise-contact** | Pending | Store leads; notify sales |
| 14 | **Payment integration** | Pending | M-Pesa for Essentials/Pro sign-up |

### Phase 3: Authorization (Roles & Permissions)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 15 | **Define roles** | Pending | e.g. `admin`, `manager`, `agent`, `viewer` |
| 16 | **Role model in backend** | Pending | Add `role` to user; role-permission mapping |
| 17 | **Permission model** | Pending | e.g. `call_logs:read`, `settings:write`, `institutions:manage` |
| 18 | **Backend permission checks** | Pending | Middleware/guards on protected endpoints |
| 19 | **Auth context roles** | Pending | Include `user.role` and `user.permissions` in context |
| 20 | **Frontend role-based UI** | Pending | Hide/disable features by role |
| 21 | **Route-level authorization** | Pending | e.g. `/settings` only for admin/manager |

### Phase 4: Session & Security

| # | Task | Status | Notes |
|---|------|--------|-------|
| 22 | **Token refresh** | Pending | Refresh token flow before expiry |
| 23 | **Session timeout** | Pending | Auto-logout after inactivity |
| 24 | **Secure token storage** | Pending | Consider httpOnly cookies for production |
| 25 | **Multi-institution context** | Pending | Institution slug from user/session |
| 26 | **SSO (optional)** | Pending | For Enterprise tier |

---

## Suggested Implementation Sequence

```
Phase 1 (Auth)     → Phase 2 (Registration) → Phase 3 (Authorization) → Phase 4 (Security)
     │                        │                          │
     └── Backend login        └── Register + Enterprise  └── Roles + permissions
         Forgot password          Payment (M-Pesa)           Route guards
```

---

## API Endpoints Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | No | Login; returns `{ token, user }` |
| `/auth/register` | POST | No | Register with plan tier; returns `{ token, user }` |
| `/auth/forgot-password` | POST | No | Request password reset |
| `/auth/enterprise-contact` | POST | No | Submit Enterprise lead |
| `/auth/me` | GET | Yes | Validate token; return current user |
| `/auth/refresh` | POST | Yes | Refresh access token |

### Request schemas

**POST /auth/register**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "company": "string",
  "phone": "string",
  "plan": "basic" | "essentials" | "pro"
}
```

**POST /auth/enterprise-contact**
```json
{
  "companyName": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "useCase": "string (optional)",
  "message": "string (optional)"
}
```

---

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_INSTITUTION_SLUG=safaricom-customer-care  # Default institution
```

---

## Related Documentation

- **Payment and Upgrades** — See `Payment and Upgrades.md` for billing, plan upgrades, and payment flows.

---

## File Structure (Auth-Related)

```
src/
├── contexts/
│   └── AuthContext.tsx       # login, logout, setAuth
├── components/
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── ForgotPassword.tsx
│   ├── PlanSelection.tsx
│   ├── Register.tsx         # Full form; plan from ?plan=essentials|pro
│   └── EnterpriseContact.tsx # Full form; success state
└── services/
    └── api.ts  # login, register, requestPasswordReset, submitEnterpriseContact
```

---

## Phase 2 Implementation Details

### Registration flow
- **Route:** `/register?plan=basic`, `/register?plan=essentials`, or `/register?plan=pro`
- **Redirect:** `/register?plan=enterprise` → `/enterprise-contact`
- **Fields:** name, email, password, company, phone
- **On success:** `setAuth(token, user)` → redirect to `/`

### Enterprise contact flow
- **Route:** `/enterprise-contact`
- **Fields:** companyName, contactName, email, phone, useCase, message
- **On success:** Show thank-you message; "Our team will contact you within 4 hours"
