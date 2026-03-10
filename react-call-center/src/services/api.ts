// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"
const INSTITUTION_SLUG =
    import.meta.env.VITE_INSTITUTION_SLUG || "safaricom-customer-care"
    
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
  id: number
  timestamp: string
  userId: string
  duration: string
  transcript: string
  status: string
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

export interface AuthUser {
  id: string
  email: string
  name: string
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
  plan: "basic" | "essentials" | "pro"
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

  // Generic fetch method with error handling
  private async fetchData<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
        window.location.href = "/login"
        throw new Error("Session expired. Please log in again.")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw error
    }
  }

  // Auth APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(
        (err as { message?: string }).message ||
          `Login failed: ${response.status}`,
      )
    }

    const data = (await response.json()) as Record<string, unknown>
    const token =
      (data.token as string) ?? (data.access_token as string) ?? ""
    const rawUser = data.user as Record<string, unknown> | undefined
    const user: AuthUser = {
      id: String(rawUser?.id ?? ""),
      email: String(rawUser?.email ?? email),
      name: String(rawUser?.name ?? rawUser?.username ?? email.split("@")[0]),
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
      throw new Error(
        (err as { message?: string }).message ||
          `Request failed: ${response.status}`,
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
      throw new Error(
        (err as { message?: string }).message ||
          `Registration failed: ${response.status}`,
      )
    }

    const res = (await response.json()) as Record<string, unknown>
    const token =
      (res.token as string) ?? (res.access_token as string) ?? ""
    const rawUser = res.user as Record<string, unknown> | undefined
    const user: AuthUser = {
      id: String(rawUser?.id ?? ""),
      email: String(rawUser?.email ?? data.email),
      name: String(rawUser?.name ?? data.name),
    }
    return { token, user }
  }

  async submitEnterpriseContact(data: EnterpriseContactRequest): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/auth/enterprise-contact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(
        (err as { message?: string }).message ||
          `Request failed: ${response.status}`,
      )
    }
  }

  // Dashboard APIs
  async getKPICards(): Promise<KPICard[]> {
    return this.fetchData<KPICard[]>("/dashboard/kpis")
  }

  async getCallVolumeData(): Promise<CallVolumeData[]> {
    return this.fetchData<CallVolumeData[]>("/dashboard/call-volume")
  }

  async getCallDurationData(): Promise<CallDurationData[]> {
    return this.fetchData<CallDurationData[]>("/dashboard/call-duration")
  }

  // Call Logs APIs
  async getCallLogs(searchQuery?: string): Promise<CallLog[]> {
    const params = searchQuery
      ? `?search=${encodeURIComponent(searchQuery)}`
      : ""
    return this.fetchData<CallLog[]>(`/call-logs${params}`)
  }

  async getCallTranscript(callId: string): Promise<CallTranscriptEntry[]> {
    return this.fetchData<CallTranscriptEntry[]>(
      `/call-logs/${callId}/transcript`,
    )
  }

  async getCallDetails(callId: string): Promise<CallDetails> {
    return this.fetchData<CallDetails>(`/call-logs/${callId}/details`)
  }

  // Performance Metrics APIs
  async getCallsProcessedData(): Promise<PerformanceData[]> {
    return this.fetchData<PerformanceData[]>("/performance/calls-processed")
  }

  async getErrorRateData(): Promise<PerformanceData[]> {
    return this.fetchData<PerformanceData[]>("/performance/error-rate")
  }

  async getErrorTypeData(): Promise<ErrorTypeData[]> {
    return this.fetchData<ErrorTypeData[]>("/performance/error-types")
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
    return this.fetchData<CallLog[]>(
      `/ai/query?category=${encodeURIComponent(category)}`,
    )
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

  async initiateUpgrade(targetPlanId: PlanId): Promise<{ checkoutUrl?: string }> {
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
