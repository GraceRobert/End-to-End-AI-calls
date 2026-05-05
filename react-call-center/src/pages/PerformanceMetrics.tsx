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
          <h1 className="text-3xl font-bold text-secondary-900">
            Performance Metrics
          </h1>
          <p className="mt-2 text-secondary-900/70">
            Track and analyze your call center performance
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-900/70">Loading performance data...</p>
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
          <h1 className="text-3xl font-bold text-secondary-900">
            Performance Metrics
          </h1>
          <p className="mt-2 text-secondary-900/70">
            Track and analyze your call center performance
          </p>
        </div>
        <div className="card">
          <div className="text-center py-8">
            <div className="text-primary-600 mb-4">
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
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Error Loading Performance Data
            </h3>
            <p className="text-secondary-900/70 mb-4">
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
        <h1 className="text-3xl font-bold text-secondary-900">
          Performance Metrics
        </h1>
        <p className="mt-2 text-secondary-900/70">
          Track and analyze your call center performance
        </p>
      </div>

      {/* Calls Processed Over Time */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Calls Processed Over Time
            </h2>
            <div className="flex items-center mt-2">
              <span className="font-stat text-3xl text-secondary-900">1,200</span>
              <div className="flex items-center text-primary-600 ml-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-sans font-medium">+15%</span>
              </div>
              <span className="text-sm text-secondary-900/70 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={callsProcessedData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ece8e3" />
            <XAxis dataKey="time" stroke="#5c5855" />
            <YAxis stroke="#5c5855" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(17,17,17,0.12)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#cc6622"
              strokeWidth={3}
              dot={{ fill: "#cc6622", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Error Rate Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Error Rate Trend
            </h2>
            <div className="flex items-center mt-2">
              <span className="font-stat text-3xl text-secondary-900">2.5%</span>
              <div className="flex items-center text-primary-700 ml-3">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-sans font-medium">+0.2%</span>
              </div>
              <span className="text-sm text-secondary-900/70 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={errorRateData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ece8e3" />
            <XAxis dataKey="time" stroke="#5c5855" />
            <YAxis stroke="#5c5855" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(17,17,17,0.12)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#843c10"
              strokeWidth={3}
              dot={{ fill: "#843c10", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown by Error Type */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Breakdown by Error Type
            </h2>
            <div className="flex items-center mt-2">
              <span className="font-stat text-3xl text-secondary-900">100</span>
              <div className="flex items-center text-primary-700 ml-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-sans font-medium">+10%</span>
              </div>
              <span className="text-sm text-secondary-900/70 ml-2">
                in the last 24 hours
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={errorTypeData || []} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#ece8e3" />
            <XAxis type="number" stroke="#5c5855" />
            <YAxis
              dataKey="type"
              type="category"
              stroke="#5c5855"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(17,17,17,0.12)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="#a54f15" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PerformanceMetrics
