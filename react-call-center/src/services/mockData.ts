// Mock data for development and testing
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
  AIAnalysisResponse,
} from "./api"

// Mock KPI Cards
export const mockKPICards: KPICard[] = [
  {
    title: "Active Calls",
    value: "125",
    change: "+10%",
    isPositive: true,
    color: "text-green-600",
  },
  {
    title: "System Load",
    value: "75%",
    change: "-5%",
    isPositive: false,
    color: "text-blue-600",
  },
  {
    title: "Error Rate",
    value: "2%",
    change: "+1%",
    isPositive: false,
    color: "text-red-600",
  },
]

// Mock Call Volume Data
export const mockCallVolumeData: CallVolumeData[] = [
  { day: "Monday", calls: 120 },
  { day: "Tuesday", calls: 135 },
  { day: "Wednesday", calls: 150 },
  { day: "Thursday", calls: 140 },
  { day: "Friday", calls: 160 },
  { day: "Saturday", calls: 90 },
  { day: "Sunday", calls: 75 },
]

// Mock Call Duration Data
export const mockCallDurationData: CallDurationData[] = [
  { range: "0-10 min", calls: 45, percentage: 45 },
  { range: "10-20 min", calls: 30, percentage: 30 },
  { range: "20-30 min", calls: 20, percentage: 20 },
  { range: "30+ min", calls: 5, percentage: 5 },
]

// Mock Call Logs
export const mockCallLogs: CallLog[] = [
  {
    id: 1,
    timestamp: "2024-08-16 10:30 AM",
    userId: "user123",
    duration: "8 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 2,
    timestamp: "2024-08-16 09:15 AM",
    userId: "user456",
    duration: "12 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 3,
    timestamp: "2024-08-16 08:45 AM",
    userId: "user789",
    duration: "5 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 4,
    timestamp: "2024-08-15 11:20 PM",
    userId: "user321",
    duration: "15 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 5,
    timestamp: "2024-08-15 10:10 PM",
    userId: "user654",
    duration: "6 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 6,
    timestamp: "2024-08-15 09:30 PM",
    userId: "user987",
    duration: "10 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 7,
    timestamp: "2024-08-15 08:15 PM",
    userId: "user111",
    duration: "7 min",
    transcript: "Transcript available",
    status: "completed",
  },
  {
    id: 8,
    timestamp: "2024-08-15 07:45 PM",
    userId: "user222",
    duration: "13 min",
    transcript: "Transcript available",
    status: "completed",
  },
]

// Mock Call Transcript
export const mockCallTranscript: CallTranscriptEntry[] = [
  {
    speaker: "Caller",
    time: "10:01 AM",
    message: "Hello, I'm calling to inquire about my recent order.",
  },
  {
    speaker: "AI",
    time: "10:02 AM",
    message:
      "Hello! I'd be happy to help you with your order. Could you please provide your order number?",
  },
  {
    speaker: "Caller",
    time: "10:03 AM",
    message: "Yes, my order number is 12345.",
  },
  {
    speaker: "AI",
    time: "10:04 AM",
    message:
      "Thank you! I've found your order. Your order is currently being processed and is expected to ship within 3 business days.",
  },
  {
    speaker: "Caller",
    time: "10:05 AM",
    message: "That's great! Can you tell me what items I ordered?",
  },
  {
    speaker: "AI",
    time: "10:06 AM",
    message:
      "Of course! You ordered a wireless Bluetooth headset and a phone charging cable. The total was $89.99.",
  },
  {
    speaker: "Caller",
    time: "10:07 AM",
    message:
      "Perfect! Thank you for the information. Is there anything else I should know?",
  },
  {
    speaker: "AI",
    time: "10:08 AM",
    message:
      "You'll receive a shipping confirmation email once your order ships, and you can track it using the tracking number provided. Is there anything else I can help you with today?",
  },
  {
    speaker: "Caller",
    time: "10:09 AM",
    message: "No, that's all I needed. Thank you for your help!",
  },
  {
    speaker: "AI",
    time: "10:09 AM",
    message: "You're welcome! Have a great day!",
  },
]

// Mock Call Details
export const mockCallDetails: CallDetails = {
  id: "987654",
  dateTime: "2024-01-16 10:00 AM",
  duration: "8 minutes",
  nlpIntent: "Order inquiry and status check",
  audioUrl: "/api/audio/987654",
}

// Mock Performance Data
export const mockCallsProcessedData: PerformanceData[] = [
  { time: "12 AM", calls: 45 },
  { time: "3 AM", calls: 32 },
  { time: "6 AM", calls: 28 },
  { time: "9 AM", calls: 89 },
  { time: "12 PM", calls: 156 },
  { time: "3 PM", calls: 134 },
  { time: "6 PM", calls: 98 },
  { time: "9 PM", calls: 67 },
]

export const mockErrorRateData: PerformanceData[] = [
  { time: "12 AM", rate: 1.2 },
  { time: "3 AM", rate: 0.8 },
  { time: "6 AM", rate: 1.5 },
  { time: "9 AM", rate: 2.1 },
  { time: "12 PM", rate: 3.2 },
  { time: "3 PM", rate: 2.8 },
  { time: "6 PM", rate: 2.3 },
  { time: "9 PM", rate: 1.9 },
]

export const mockErrorTypeData: ErrorTypeData[] = [
  { type: "Network Error", count: 35, percentage: 35 },
  { type: "Timeout", count: 28, percentage: 28 },
  { type: "Invalid Input", count: 22, percentage: 22 },
  { type: "Other", count: 15, percentage: 15 },
]

// Mock Settings
export const mockSettings: Settings = {
  callCentreName: "AI Call Center Pro",
  callCentreDescription: "Advanced AI-powered call center solution",
  defaultLanguage: "English",
  defaultVoice: "en-US-Standard-A",
  defaultGreeting: "Hello! Thank you for calling. How can I assist you today?",
  crmIntegrationKey: "sk-1234567890abcdef",
}

// Mock AI Analysis Responses
export const mockAIAnalysisResponses: Record<string, AIAnalysisResponse> = {
  summarize: {
    result:
      "Customer called to inquire about order status. Order #12345 is being processed and will ship within 3 business days. Customer ordered wireless Bluetooth headset and phone charging cable for $89.99. Customer was satisfied with the information provided.",
    confidence: 0.95,
  },
  sentiment: {
    result:
      "Overall sentiment: Positive (85% confidence). Customer showed satisfaction with the service, expressed gratitude, and ended the call on a positive note. No signs of frustration or dissatisfaction detected.",
    confidence: 0.85,
  },
  "action-items": {
    result:
      "1. Send shipping confirmation email when order ships\n2. Provide tracking number to customer\n3. Follow up on customer satisfaction after delivery\n4. Update CRM with call notes and customer preferences",
    confidence: 0.9,
  },
}

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to filter call logs by search query
export const filterCallLogs = (
  logs: CallLog[],
  searchQuery: string
): CallLog[] => {
  if (!searchQuery.trim()) return logs

  const query = searchQuery.toLowerCase()
  return logs.filter(
    (log) =>
      log.userId.toLowerCase().includes(query) ||
      log.timestamp.toLowerCase().includes(query) ||
      log.duration.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query)
  )
}

// Helper function to get call log by ID
export const getCallLogById = (
  logs: CallLog[],
  id: string | number
): CallLog | undefined => {
  return logs.find((log) => String(log.id) === String(id))
}
