// API Configuration (trim: avoid leading space after "=" in .env)
const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
).trim()
const INSTITUTION_SLUG =
  import.meta.env.VITE_INSTITUTION_SLUG || "safaricom-customer-care"

/** Laravel Sanctum: use with dev proxy — VITE_API_BASE_URL=/api, VITE_SANCTUM_CSRF=true */
const USE_SANCTUM_CSRF = import.meta.env.VITE_SANCTUM_CSRF === "true"

function sanctumCsrfCookieUrl(baseUrl: string): string {
  const override = String(import.meta.env.VITE_SANCTUM_CSRF_URL || "").trim()
  if (override.startsWith("/")) {
    return typeof window !== "undefined"
      ? `${window.location.origin}${override}`
      : override
  }
  if (override.startsWith("http")) {
    return override
  }
  // Same-origin only works with Vite proxy (/sanctum → API); cross-origin cannot set cookies for localhost.
  if (baseUrl.startsWith("http")) {
    const origin = baseUrl.replace(/\/api\/?$/, "")
    return `${origin}/sanctum/csrf-cookie`
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/sanctum/csrf-cookie`
  }
  return "/sanctum/csrf-cookie"
}

function xsrfHeader(): Record<string, string> {
  if (typeof document === "undefined") return {}
  const row = document.cookie
    .split("; ")
    .find((r) => r.startsWith("XSRF-TOKEN="))
  if (!row) return {}
  const raw = row.slice("XSRF-TOKEN=".length)
  try {
    return { "X-XSRF-TOKEN": decodeURIComponent(raw) }
  } catch {
    return { "X-XSRF-TOKEN": raw }
  }
}

/** Remove HTTP status codes from text shown in the UI (log status separately). */
function sanitizeUserErrorMessage(msg: string | undefined | null): string {
  if (msg == null || !String(msg).trim()) return ""
  return String(msg)
    .replace(/\(\d{3}\)/g, "")
    .replace(/\bstatus:?\s*\d{3}\b/gi, "")
    .replace(/\bHTTP error!?\.?\s*status:?\s*\d{3}\b/gi, "")
    .replace(/\s+\d{3}\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.:]+|[\s.:]+$/g, "")
    .trim()
}

export function userFacingError(
  serverMessage: string | undefined | null,
  fallback: string,
): string {
  const cleaned = sanitizeUserErrorMessage(serverMessage)
  return cleaned || fallback
}

// Types for API responses
export interface KPICard {
  title: string
  value: string
  change: string
  isPositive: boolean
  color: string
}

export interface CallVolumeData {
  day: string
  calls: number
}

export interface CallDurationData {
  range: string
  calls: number
  percentage: number
}

export interface CallLog {
  id: string | number
  timestamp: string
  userId: string
  duration: string
  transcript: string
  status: string
}

/** Laravel / common JSON envelopes: `{ data: [...] }`, nested `data.data`, or `calls` / `items`. */
export function normalizeApiArray<T>(raw: unknown): T[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as T[]
  if (typeof raw !== "object") return []
  const o = raw as Record<string, unknown>
  const d = o.data
  if (Array.isArray(d)) return d as T[]
  if (d != null && typeof d === "object") {
    const inner = (d as Record<string, unknown>).data
    if (Array.isArray(inner)) return inner as T[]
  }
  for (const key of ["calls", "logs", "items", "results"]) {
    const v = o[key]
    if (Array.isArray(v)) return v as T[]
  }
  return []
}

function mapCallLogFromApi(row: unknown, index: number): CallLog {
  if (!row || typeof row !== "object") {
    return {
      id: `__row_${index}`,
      timestamp: "",
      userId: "",
      duration: "",
      transcript: "",
      status: "",
    }
  }
  const r = row as Record<string, unknown>
  const idRaw = r.id ?? r.call_id
  const id: string | number =
    typeof idRaw === "number" || typeof idRaw === "string"
      ? idRaw
      : idRaw != null
        ? String(idRaw)
        : `__row_${index}`

  return {
    id,
    timestamp: String(
      r.timestamp ?? r.created_at ?? r.started_at ?? r.date ?? "",
    ),
    userId: String(
      r.userId ??
        r.user_id ??
        r.caller_number ??
        r.caller_id ??
        r.customer_name ??
        "",
    ),
    duration: String(
      r.duration ?? r.call_duration ?? r.duration_seconds ?? "",
    ),
    transcript: String(
      r.transcript ?? r.summary ?? r.preview ?? r.notes ?? "",
    ),
    status: String(r.status ?? ""),
  }
}

export interface CallTranscriptEntry {
  speaker: string
  time: string
  message: string
}

export interface CallDetails {
  id: string
  dateTime: string
  duration: string
  nlpIntent?: string
  audioUrl?: string
}

export interface PerformanceData {
  time: string
  calls?: number
  rate?: number
}

export interface ErrorTypeData {
  type: string
  count: number
  percentage: number
}

export interface Settings {
  callCentreName: string
  callCentreDescription: string
  defaultLanguage: string
  defaultVoice: string
  defaultGreeting: string
  crmIntegrationKey: string
}

export interface AIAnalysisRequest {
  type: "summarize" | "sentiment" | "action-items"
  callId?: string
  category?: string
}

export interface AIAnalysisResponse {
  result: string
  confidence?: number
}

export type RegisteredPlanId = "basic" | "essentials" | "pro"

export interface AuthUser {
  id: string
  email: string
  name: string
  /** Set after sign-up; used for onboarding (intent limits, etc.). */
  plan?: RegisteredPlanId
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  company: string
  phone: string
  plan: RegisteredPlanId
}

export interface EnterpriseContactRequest {
  companyName: string
  contactName: string
  email: string
  phone: string
  useCase?: string
  message?: string
}

export type PlanId = "basic" | "essentials" | "pro" | "enterprise"

export interface BillingPlan {
  planId: PlanId
  planName: string
  price: string
  currency: string
  period: string
}

// API Service Class
class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /** Laravel Sanctum: refresh CSRF cookie before POST/PUT/PATCH/DELETE when using session cookies. */
  private async applySanctumBeforeMutate(): Promise<void> {
    if (!USE_SANCTUM_CSRF) return
    const csrfRes = await fetch(sanctumCsrfCookieUrl(this.baseUrl), {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    if (!csrfRes.ok && csrfRes.status !== 204) {
      console.warn("Sanctum CSRF preflight returned", csrfRes.status)
    }
  }

  private static isMutatingRequest(method: string): boolean {
    return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
  }

  // Generic fetch method with error handling
  private async fetchData<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null

      const method = (options?.method ?? "GET").toUpperCase()
      const needsSanctum = USE_SANCTUM_CSRF && ApiService.isMutatingRequest(method)

      if (needsSanctum) {
        await this.applySanctumBeforeMutate()
      }

      const extraHeaders: Record<string, string> = needsSanctum
        ? {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...xsrfHeader(),
          }
        : {}

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        credentials: needsSanctum
          ? "include"
          : (options?.credentials ?? "same-origin"),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options?.headers as Record<string, string> | undefined),
          ...extraHeaders,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
        window.location.href = "/login"
        throw new Error("Session expired. Please log in again.")
      }

      if (!response.ok) {
        if (response.status === 419) {
          const err = await response.json().catch(() => ({}))
          const msg = (err as { message?: string }).message
          console.warn(
            "[419] Session verification failed — devs: check CSRF / Sanctum and API proxy config.",
            endpoint,
          )
          throw new Error(
            userFacingError(
              msg,
              "We couldn’t complete this action. Refresh the page and try again. If it keeps happening, sign out and sign back in.",
            ),
          )
        }
        const errBody = await response.json().catch(() => ({}))
        const msg = (errBody as { message?: string }).message
        console.error(
          `API Error for ${endpoint}: HTTP ${response.status}`,
          errBody,
        )
        throw new Error(
          userFacingError(msg, "Something went wrong. Please try again."),
        )
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw error
    }
  }

  private async fetchArray<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T[]> {
    const raw = await this.fetchData<unknown>(endpoint, options)
    return normalizeApiArray<T>(raw)
  }

  /** Login URL: same prefix rules as fetchData (/api in base vs bare origin). */
  private loginUrl(): string {
    const base = this.baseUrl.replace(/\/$/, "")
    if (base.endsWith("/api")) {
      return `${base}/call-center/auth/login`
    }
    return `${base}/api/call-center/auth/login`
  }

  // Auth APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    const jsonHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }

    if (USE_SANCTUM_CSRF) {
      await this.applySanctumBeforeMutate()
    }

    const response = await fetch(this.loginUrl(), {
      method: "POST",
      headers: {
        ...jsonHeaders,
        ...xsrfHeader(),
      },
      credentials: USE_SANCTUM_CSRF ? "include" : "same-origin",
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = (err as { message?: string }).message
      if (response.status === 419) {
        console.warn(
          "[419] Login verification failed — devs: check CSRF / Sanctum and API proxy config.",
        )
        throw new Error(
          userFacingError(
            msg,
            "We couldn’t sign you in right now. Refresh the page and try again, or contact support if the problem continues.",
          ),
        )
      }
      console.error("Login failed", response.status, err)
      throw new Error(userFacingError(msg, "Login failed. Please try again."))
    }

    const data = (await response.json()) as Record<string, unknown>
    const token = (data.token as string) ?? (data.access_token as string) ?? ""
    const rawUser = data.user as Record<string, unknown> | undefined
    const rawPlan = rawUser?.plan as string | undefined
    const planFromApi =
      rawPlan === "basic" || rawPlan === "essentials" || rawPlan === "pro"
        ? rawPlan
        : undefined
    const user: AuthUser = {
      id: String(rawUser?.id ?? ""),
      email: String(rawUser?.email ?? email),
      name: String(rawUser?.name ?? rawUser?.username ?? email.split("@")[0]),
      ...(planFromApi ? { plan: planFromApi } : {}),
    }
    return { token, user }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = (err as { message?: string }).message
      console.error("Forgot password request failed", response.status, err)
      throw new Error(
        userFacingError(msg, "Request failed. Please try again."),
      )
    }
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = (err as { message?: string }).message
      console.error("Registration failed", response.status, err)
      throw new Error(
        userFacingError(msg, "Registration failed. Please try again."),
      )
    }

    const res = (await response.json()) as Record<string, unknown>
    const token = (res.token as string) ?? (res.access_token as string) ?? ""
    const rawUser = res.user as Record<string, unknown> | undefined
    const rawPlan = rawUser?.plan as string | undefined
    const planFromApi =
      rawPlan === "basic" || rawPlan === "essentials" || rawPlan === "pro"
        ? rawPlan
        : data.plan
    const user: AuthUser = {
      id: String(rawUser?.id ?? ""),
      email: String(rawUser?.email ?? data.email),
      name: String(rawUser?.name ?? data.name),
      plan: planFromApi,
    }
    return { token, user }
  }

  async submitEnterpriseContact(data: EnterpriseContactRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/enterprise-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = (err as { message?: string }).message
      console.error("Enterprise contact failed", response.status, err)
      throw new Error(
        userFacingError(msg, "Request failed. Please try again."),
      )
    }
  }

  // Dashboard APIs
  async getKPICards(): Promise<KPICard[]> {
    return this.fetchArray<KPICard>("/dashboard/kpis")
  }

  async getCallVolumeData(): Promise<CallVolumeData[]> {
    return this.fetchArray<CallVolumeData>("/dashboard/call-volume")
  }

  async getCallDurationData(): Promise<CallDurationData[]> {
    return this.fetchArray<CallDurationData>("/dashboard/call-duration")
  }

  // Call Logs APIs
  async getCallLogs(searchQuery?: string): Promise<CallLog[]> {
    const params = searchQuery
      ? `?search=${encodeURIComponent(searchQuery)}`
      : ""
    const rows = await this.fetchArray<unknown>(`/call-logs${params}`)
    return rows.map((row, i) => mapCallLogFromApi(row, i))
  }

  async getCallTranscript(callId: string): Promise<CallTranscriptEntry[]> {
    return this.fetchArray<CallTranscriptEntry>(
      `/call-logs/${callId}/transcript`,
    )
  }

  async getCallDetails(callId: string): Promise<CallDetails> {
    return this.fetchData<CallDetails>(`/call-logs/${callId}/details`)
  }

  // Performance Metrics APIs
  async getCallsProcessedData(): Promise<PerformanceData[]> {
    return this.fetchArray<PerformanceData>("/performance/calls-processed")
  }

  async getErrorRateData(): Promise<PerformanceData[]> {
    return this.fetchArray<PerformanceData>("/performance/error-rate")
  }

  async getErrorTypeData(): Promise<ErrorTypeData[]> {
    return this.fetchArray<ErrorTypeData>("/performance/error-types")
  }

  // Settings APIs
  async getSettings(): Promise<Settings> {
    return this.fetchData<Settings>(
      `/institutions/${INSTITUTION_SLUG}/settings`,
    )
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    return this.fetchData<Settings>(
      `/institutions/${INSTITUTION_SLUG}/settings`,
      {
        method: "PUT",
        body: JSON.stringify(settings),
      },
    )
  }

  // AI Analysis APIs
  async analyzeCall(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return this.fetchData<AIAnalysisResponse>("/ai/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async queryCallsByCategory(category: string): Promise<CallLog[]> {
    const rows = await this.fetchArray<unknown>(
      `/ai/query?category=${encodeURIComponent(category)}`,
    )
    return rows.map((row, i) => mapCallLogFromApi(row, i))
  }

  // Audio APIs
  async getCallAudio(callId: string): Promise<{ audioUrl: string }> {
    return this.fetchData<{ audioUrl: string }>(`/audio/${callId}`)
  }

  // Flagging APIs
  async flagCallForReview(
    callId: string,
    reason?: string,
  ): Promise<{ success: boolean }> {
    return this.fetchData<{ success: boolean }>(`/call-logs/${callId}/flag`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  // Billing & Payment APIs
  async getCurrentPlan(): Promise<BillingPlan> {
    return this.fetchData<BillingPlan>("/billing/plan")
  }

  async initiateUpgrade(
    targetPlanId: PlanId,
  ): Promise<{ checkoutUrl?: string }> {
    return this.fetchData<{ checkoutUrl?: string }>("/billing/upgrade", {
      method: "POST",
      body: JSON.stringify({ targetPlanId }),
    })
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()

// Export the class for testing or custom instances
export default ApiService
