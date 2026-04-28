// Custom hook for API calls with loading states and error handling
import { useState, useEffect, useCallback } from "react"
import { apiService, userFacingError } from "../services/api"
import { mockApiService } from "../services/mockApiService"

// Use real API when VITE_API_BASE_URL is set, otherwise use mock
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const api = apiBaseUrl ? apiService : mockApiService

// Generic hook for API calls
export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(
        userFacingError(
          err instanceof Error ? err.message : null,
          "An error occurred",
        ),
      )
      console.error("API Error:", err)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Specific hooks for different API endpoints
export function useKPICards() {
  return useApi(() => api.getKPICards())
}

export function useCallVolumeData() {
  return useApi(() => api.getCallVolumeData())
}

export function useCallDurationData() {
  return useApi(() => api.getCallDurationData())
}

export function useCallLogs(searchQuery?: string) {
  return useApi(() => api.getCallLogs(searchQuery), [searchQuery])
}

export function useCallTranscript(callId: string) {
  return useApi(() => api.getCallTranscript(callId), [callId])
}

export function useCallDetails(callId: string) {
  return useApi(() => api.getCallDetails(callId), [callId])
}

export function useCallsProcessedData() {
  return useApi(() => api.getCallsProcessedData())
}

export function useErrorRateData() {
  return useApi(() => api.getErrorRateData())
}

export function useErrorTypeData() {
  return useApi(() => api.getErrorTypeData())
}

export function useSettings() {
  return useApi(() => api.getSettings())
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(mutationFn: (params: P) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (params: P) => {
      try {
        setLoading(true)
        setError(null)
        const result = await mutationFn(params)
        setData(result)
        return result
      } catch (err) {
        const errorMessage = userFacingError(
          err instanceof Error ? err.message : null,
          "An error occurred",
        )
        setError(errorMessage)
        console.error("Mutation Error:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [mutationFn]
  )

  return { mutate, data, loading, error }
}

// Specific mutation hooks
export function useUpdateSettings() {
  return useMutation((settings: any) => api.updateSettings(settings))
}

export function useAnalyzeCall() {
  return useMutation((request: any) => api.analyzeCall(request))
}

export function useQueryCallsByCategory() {
  return useMutation((category: string) => api.queryCallsByCategory(category))
}

export function useFlagCallForReview() {
  return useMutation(
    ({ callId, reason }: { callId: string; reason?: string }) =>
      api.flagCallForReview(callId, reason)
  )
}

export function useGetCallAudio() {
  return useMutation((callId: string) => api.getCallAudio(callId))
}
