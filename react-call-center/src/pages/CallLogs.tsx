import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import {
  useCallLogs,
  useAnalyzeCall,
  useQueryCallsByCategory,
} from "../hooks/useApi"

const CallLogs = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const navigate = useNavigate()
  const {
    data: callLogs,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useCallLogs(debouncedSearchQuery)
  const { mutate: analyzeCall, loading: analyzeLoading } = useAnalyzeCall()
  const { mutate: queryCalls, loading: queryLoading } =
    useQueryCallsByCategory()

  const handleAnalyzeCall = async (
    type: "summarize" | "sentiment" | "action-items",
  ) => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeCall({ type })
      setAnalysisResult(result.result)
    } catch (error) {
      console.error("Analysis failed:", error)
      setAnalysisResult("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Debounce search query changes by 300ms
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(handle)
  }, [searchQuery])

  const handleQueryCalls = async () => {
    if (!selectedCategory.trim()) return

    try {
      const results = await queryCalls(selectedCategory)
      console.log("Query results:", results)
      // In a real app, you might want to display these results in a modal or separate section
      alert(
        `Found ${results.length} calls matching category: ${selectedCategory}`,
      )
    } catch (error) {
      console.error("Query failed:", error)
      alert("Query failed. Please try again.")
    }
  }

  const handleViewTranscript = (callId: string | number) => {
    navigate(`/transcript/${callId}`)
  }

  // Show loading state
  if (logsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Call Logs & Transcripts
          </h1>
          <p className="mt-2 font-sans text-secondary-900/70">
            View and analyze call history and transcripts
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 font-sans text-secondary-900/70">Loading call logs...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (logsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Call Logs & Transcripts
          </h1>
          <p className="mt-2 font-sans text-secondary-900/70">
            View and analyze call history and transcripts
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
              Error Loading Call Logs
            </h3>
            <p className="font-sans text-secondary-900/70 mb-4">{logsError}</p>
            <button onClick={refetchLogs} className="btn-primary">
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
          Call Logs & Transcripts
        </h1>
        <p className="mt-2 font-sans text-secondary-900/70">
          View and analyze call history and transcripts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Call Logs Panel */}
        <div className="lg:col-span-2 space-y-4 min-h-0">
          <div className="card flex flex-col max-h-[calc(140vh-9rem)] min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 shrink-0">
              <h2 className="text-xl font-semibold text-secondary-900">
                Call Logs
              </h2>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-900/40" />
                <input
                  type="text"
                  placeholder="Search by user ID, timestamp, or duration"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-secondary-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full bg-bg-paper font-sans text-secondary-900 placeholder:text-secondary-900/40"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-md border border-secondary-900/10 -mx-1 px-1">
              <table className="min-w-full divide-y divide-secondary-900/15">
                <thead className="bg-bg-sand sticky top-0 z-10 shadow-[0_1px_0_0_rgba(17,17,17,0.08)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-secondary-900/50 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-secondary-900/50 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-secondary-900/50 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-secondary-900/50 uppercase tracking-wider">
                      Transcript
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-secondary-900/50 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-bg-paper divide-y divide-secondary-900/15">
                  {callLogs?.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-secondary-900/[0.04] cursor-pointer"
                      onClick={() => handleViewTranscript(log.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-secondary-900">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-secondary-900">
                        {log.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-secondary-900">
                        {log.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-secondary-900/70">
                        {log.transcript}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // handle play preview here if needed
                          }}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewTranscript(log.id)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Transcript Assistant Panel */}
        <div className="space-y-4 min-h-0">
          <div className="card max-h-[calc(140vh-9rem)] overflow-y-auto">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              AI Transcript Assistant
            </h2>
            <p className="font-sans text-secondary-900/70 mb-6">
              Get the most out of your calls. With our AI assistant, you can
              summarize key points, analyze customer sentiment, and even
              generate a list of action items. Maximize your understanding and
              efficiency.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleAnalyzeCall("summarize")}
                disabled={isAnalyzing || analyzeLoading}
                className="w-full btn-primary flex items-center justify-center !px-4 !py-2.5 !font-sans !text-xs !font-medium !normal-case !tracking-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing && analyzeLoading
                  ? "Analyzing..."
                  : "Summarize the calls"}
              </button>
              <button
                onClick={() => handleAnalyzeCall("sentiment")}
                disabled={isAnalyzing || analyzeLoading}
                className="w-full btn-primary flex items-center justify-center !px-4 !py-2.5 !font-sans !text-xs !font-medium !normal-case !tracking-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing && analyzeLoading
                  ? "Analyzing..."
                  : "Analyze customers' sentiments"}
              </button>
              <button
                onClick={() => handleAnalyzeCall("action-items")}
                disabled={isAnalyzing || analyzeLoading}
                className="w-full btn-primary flex items-center justify-center !px-4 !py-2.5 !font-sans !text-xs !font-medium !normal-case !tracking-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing && analyzeLoading
                  ? "Analyzing..."
                  : "List action items"}
              </button>
            </div>

            {analysisResult && (
              <div className="mt-4 p-4 bg-bg-sand rounded-lg border border-secondary-900/10">
                <h4 className="font-sans font-medium text-secondary-900 mb-2">
                  Analysis Result:
                </h4>
                <p className="text-sm font-sans text-secondary-900/80">
                  {analysisResult}
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-sans font-medium text-secondary-900/80 mb-2">
                Ask something about the calls
              </label>
              <input
                type="text"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
                placeholder="e.g., complaints, orders, support"
              />
              <button
                onClick={handleQueryCalls}
                disabled={queryLoading || !selectedCategory.trim()}
                className="w-full btn-primary mt-3 !px-4 !py-2.5 !font-sans !text-xs !font-medium !normal-case !tracking-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {queryLoading ? "Querying..." : "Query Calls"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallLogs
