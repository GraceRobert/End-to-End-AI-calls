import { TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  useCallsProcessedData,
  useErrorRateData,
  useErrorTypeData,
} from "../hooks/useApi"

const PerformanceMetrics = () => {
  const {
    data: callsProcessedData,
    loading: callsLoading,
    error: callsError,
  } = useCallsProcessedData()
  const {
    data: errorRateData,
    loading: errorRateLoading,
    error: errorRateError,
  } = useErrorRateData()
  const {
    data: errorTypeData,
    loading: errorTypeLoading,
    error: errorTypeError,
  } = useErrorTypeData()

  // Show loading state
  if (callsLoading || errorRateLoading || errorTypeLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Metrics
          </h1>
          <p className="mt-2 text-gray-600">
            Track and analyze your call center performance
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading performance data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (callsError || errorRateError || errorTypeError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Metrics
          </h1>
          <p className="mt-2 text-gray-600">
            Track and analyze your call center performance
          </p>
        </div>
        <div className="card">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Performance Data
            </h3>
            <p className="text-gray-600 mb-4">
              {callsError || errorRateError || errorTypeError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Performance Metrics
        </h1>
        <p className="mt-2 text-gray-600">
          Track and analyze your call center performance
        </p>
      </div>

      {/* Calls Processed Over Time */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Calls Processed Over Time
            </h2>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900">1,200</span>
              <div className="flex items-center text-green-600 ml-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+15%</span>
              </div>
              <span className="text-sm text-gray-600 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={callsProcessedData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Error Rate Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Error Rate Trend
            </h2>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900">2.5%</span>
              <div className="flex items-center text-red-600 ml-3">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+0.2%</span>
              </div>
              <span className="text-sm text-gray-600 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={errorRateData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown by Error Type */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Breakdown by Error Type
            </h2>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900">100</span>
              <div className="flex items-center text-red-600 ml-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+10%</span>
              </div>
              <span className="text-sm text-gray-600 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={errorTypeData || []} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis
              dataKey="type"
              type="category"
              stroke="#6b7280"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PerformanceMetrics
