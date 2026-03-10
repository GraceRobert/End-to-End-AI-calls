// Mock API Service for development and testing
import {
  KPICard,
  CallVolumeData,
  CallDurationData,
  CallLog,
  CallTranscriptEntry,
  CallDetails,
  PerformanceData,
  ErrorTypeData,
  Settings,
  AIAnalysisRequest,
  AIAnalysisResponse,
  LoginResponse,
  RegisterRequest,
  EnterpriseContactRequest,
  BillingPlan,
  PlanId,
} from "./api"
import {
  mockKPICards,
  mockCallVolumeData,
  mockCallDurationData,
  mockCallLogs,
  mockCallTranscript,
  mockCallDetails,
  mockCallsProcessedData,
  mockErrorRateData,
  mockErrorTypeData,
  mockSettings,
  mockAIAnalysisResponses,
  simulateApiDelay,
  filterCallLogs,
  getCallLogById,
} from "./mockData"

class MockApiService {
  // Auth APIs (for development without backend)
  async login(email: string, _password: string): Promise<LoginResponse> {
    await simulateApiDelay(500)
    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: "mock-user-1",
        email,
        name: email.split("@")[0] || "Demo User",
      },
    }
  }

  async requestPasswordReset(_email: string): Promise<void> {
    await simulateApiDelay(800)
    // Mock: always succeeds
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    // Supports basic, essentials, pro
    await simulateApiDelay(800)
    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: "mock-user-new",
        email: data.email,
        name: data.name,
      },
    }
  }

  async submitEnterpriseContact(
    _data: EnterpriseContactRequest
  ): Promise<void> {
    await simulateApiDelay(600)
    // Mock: always succeeds
  }

  async getCurrentPlan(): Promise<BillingPlan> {
    await simulateApiDelay(300)
    return {
      planId: "basic",
      planName: "Basic",
      price: "6,000",
      currency: "KSh",
      period: "month",
    }
  }

  async initiateUpgrade(_targetPlanId: PlanId): Promise<{
    checkoutUrl?: string
  }> {
    await simulateApiDelay(500)
    return { checkoutUrl: undefined }
  }

  // Dashboard APIs
  async getKPICards(): Promise<KPICard[]> {
    await simulateApiDelay(300)
    return [...mockKPICards]
  }

  async getCallVolumeData(): Promise<CallVolumeData[]> {
    await simulateApiDelay(400)
    return [...mockCallVolumeData]
  }

  async getCallDurationData(): Promise<CallDurationData[]> {
    await simulateApiDelay(350)
    return [...mockCallDurationData]
  }

  // Call Logs APIs
  async getCallLogs(searchQuery?: string): Promise<CallLog[]> {
    await simulateApiDelay(500)
    if (searchQuery) {
      return filterCallLogs(mockCallLogs, searchQuery)
    }
    return [...mockCallLogs]
  }

  async getCallTranscript(callId: string): Promise<CallTranscriptEntry[]> {
    await simulateApiDelay(400)
    // In a real app, you'd fetch based on callId
    // For mock, we return the same transcript for all calls
    return [...mockCallTranscript]
  }

  async getCallDetails(callId: string): Promise<CallDetails> {
    await simulateApiDelay(300)
    // In a real app, you'd fetch based on callId
    // For mock, we return the same details for all calls
    return { ...mockCallDetails, id: callId }
  }

  // Performance Metrics APIs
  async getCallsProcessedData(): Promise<PerformanceData[]> {
    await simulateApiDelay(400)
    return [...mockCallsProcessedData]
  }

  async getErrorRateData(): Promise<PerformanceData[]> {
    await simulateApiDelay(400)
    return [...mockErrorRateData]
  }

  async getErrorTypeData(): Promise<ErrorTypeData[]> {
    await simulateApiDelay(350)
    return [...mockErrorTypeData]
  }

  // Settings APIs
  async getSettings(): Promise<Settings> {
    await simulateApiDelay(300)
    return { ...mockSettings }
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    await simulateApiDelay(500)
    // In a real app, you'd save to backend
    // For mock, we just return the updated settings
    const updatedSettings = { ...mockSettings, ...settings }
    return updatedSettings
  }

  // AI Analysis APIs
  async analyzeCall(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    await simulateApiDelay(800) // AI analysis takes longer

    const responseKey = request.type
    if (responseKey in mockAIAnalysisResponses) {
      return mockAIAnalysisResponses[responseKey]
    }

    // Default response for unknown analysis types
    return {
      result: `Analysis completed for ${request.type}`,
      confidence: 0.75,
    }
  }

  async queryCallsByCategory(category: string): Promise<CallLog[]> {
    await simulateApiDelay(600)
    // In a real app, you'd query the backend based on category
    // For mock, we return a filtered subset based on category
    const categoryKeywords: Record<string, string[]> = {
      complaints: ["complaint", "issue", "problem", "dissatisfied"],
      orders: ["order", "purchase", "buy", "shipping"],
      support: ["help", "support", "assistance", "question"],
      billing: ["bill", "payment", "charge", "invoice"],
    }

    const keywords = categoryKeywords[category.toLowerCase()] || [category]
    return mockCallLogs.filter((log) =>
      keywords.some(
        (keyword) =>
          log.userId.toLowerCase().includes(keyword) ||
          log.transcript.toLowerCase().includes(keyword)
      )
    )
  }

  // Audio APIs
  async getCallAudio(callId: string): Promise<{ audioUrl: string }> {
    await simulateApiDelay(200)
    return {
      audioUrl: `/api/audio/${callId}`,
    }
  }

  // Flagging APIs
  async flagCallForReview(
    callId: string,
    reason?: string
  ): Promise<{ success: boolean }> {
    await simulateApiDelay(300)
    console.log(
      `Flagging call ${callId} for review. Reason: ${
        reason || "No reason provided"
      }`
    )
    return { success: true }
  }
}

// Create and export a singleton instance
export const mockApiService = new MockApiService()

// Export the class for testing or custom instances
export default MockApiService
