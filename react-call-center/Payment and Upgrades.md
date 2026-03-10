# Payment and Plan Upgrades

This document describes the payment page, upgrade flow, and related API endpoints.

---

## Overview

The Billing & Payment page allows users to:

1. View their current plan
2. See available upgrade options (plans above their current tier)
3. Initiate an upgrade to a higher plan
4. For Enterprise: contact sales instead of self-serve upgrade

---

## Plan Hierarchy

| Order | Plan       | Price        | Self-serve upgrade? |
|-------|------------|--------------|---------------------|
| 1     | Basic      | KSh 6,000/mo | —                   |
| 2     | Essentials | KSh 10,000/mo | Yes                 |
| 3     | Pro        | KSh 19,000/mo | Yes                 |
| 4     | Enterprise | Custom       | No (contact required) |

---

## User Flows

### View current plan and upgrades

1. User navigates to **Billing & Payment** (sidebar or `/payment`)
2. Page fetches current plan via `GET /billing/plan`
3. Displays current plan details
4. Shows upgrade options (only plans above current tier)

### Upgrade to Essentials, Pro

1. User clicks **Upgrade to [Plan]** on the Payment page
2. Navigates to `/payment/upgrade/essentials` or `/payment/upgrade/pro`
3. Upgrade checkout page shows plan details and **Pay via M-Pesa** button
4. User clicks → `POST /billing/upgrade` with `{ targetPlanId }`
5. Backend returns `{ checkoutUrl }` → redirect to M-Pesa checkout
6. After payment, plan is updated

### Upgrade to Enterprise

1. User clicks **Contact us** on the Enterprise upgrade card
2. Navigates to `/enterprise-contact`
3. Fills contact form → `POST /auth/enterprise-contact`
4. Sales team follows up

---

## Routes

| Route                     | Page            | Auth required |
|---------------------------|-----------------|---------------|
| `/payment`                | Payment         | Yes           |
| `/payment/upgrade/:planId` | UpgradeCheckout | Yes           |
| `/enterprise-contact`     | EnterpriseContact | No          |

---

## API Endpoints

### GET `/billing/plan`

Returns the authenticated user's current billing plan.

**Response:**

```json
{
  "planId": "basic",
  "planName": "Basic",
  "price": "6,000",
  "currency": "KSh",
  "period": "month"
}
```

### POST `/billing/upgrade`

Initiates an upgrade to a target plan. Creates a payment session (e.g. M-Pesa STK push) and returns the checkout URL if applicable.

**Request:**

```json
{
  "targetPlanId": "essentials"
}
```

**Response:**

```json
{
  "checkoutUrl": "https://..."
}
```

Or, if using M-Pesa STK push (no redirect):

```json
{
  "success": true,
  "message": "M-Pesa prompt sent"
}
```

---

## File Structure

```
src/
├── data/
│   └── plans.ts              # Plan definitions, getUpgradeablePlans()
├── pages/
│   ├── Payment.tsx           # Billing page, current plan, upgrade cards
│   └── UpgradeCheckout.tsx   # Upgrade confirmation, M-Pesa payment
└── services/
    └── api.ts                # getCurrentPlan(), initiateUpgrade()
```

---

## Mock Behavior (Development)

- `getCurrentPlan()` returns Basic plan
- `initiateUpgrade()` returns `{}` (no checkoutUrl); shows alert and redirects to `/payment`

---

## Backend Implementation Checklist

- [ ] `GET /billing/plan` — return user's plan from database
- [ ] `POST /billing/upgrade` — validate target plan, create payment, return checkout URL or trigger M-Pesa
- [ ] M-Pesa webhook — handle payment confirmation, update user plan
- [ ] Store `planId` on user/institution record

---

## Payment Methods

| Plan       | Payment terms (from IMLA2 Rev B) |
|------------|----------------------------------|
| Basic      | M-Pesa auto-debit, month-to-month |
| Essentials | M-Pesa auto-debit, month-to-month |
| Pro        | M-Pesa/Bank transfer, 3 months min |
| Enterprise | Invoice, net-15 days, 12 months min |
