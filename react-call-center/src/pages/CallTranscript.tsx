import { useParams, Link } from "react-router-dom"
import { Play, Flag, ArrowLeft, Mic } from "lucide-react"
import {
  useCallTranscript,
  useCallDetails,
  useFlagCallForReview,
  useGetCallAudio,
} from "../hooks/useApi"

const CallTranscript = () => {
  const { id } = useParams()
  const callId = id || "1" // Default to "1" if no ID provided

  const {
    data: transcript,
    loading: transcriptLoading,
    error: transcriptError,
  } = useCallTranscript(callId)
  const {
    data: callDetails,
    loading: detailsLoading,
    error: detailsError,
  } = useCallDetails(callId)
  const { mutate: flagCall, loading: flagLoading } = useFlagCallForReview()
  const { mutate: getAudio, loading: audioLoading } = useGetCallAudio()

  const handlePlayAudio = async () => {
    try {
      const audioData = await getAudio(callId)
      console.log("Audio URL:", audioData.audioUrl)
      // In a real app, you would play the audio using the URL
      alert(`Audio URL: ${audioData.audioUrl}`)
    } catch (error) {
      console.error("Failed to get audio:", error)
      alert("Failed to load audio")
    }
  }

  const handleFlagForReview = async () => {
    try {
      await flagCall({ callId, reason: "Manual review requested" })
      alert("Call flagged for review successfully!")
    } catch (error) {
      console.error("Failed to flag call:", error)
      alert("Failed to flag call for review")
    }
  }

  // Show loading state
  if (transcriptLoading || detailsLoading) {
    return (
      <div className="space-y-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link
            to="/call-logs"
            className="hover:text-gray-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Call Logs & Transcripts
          </Link>
          <span>/</span>
          <span className="text-gray-900">Call Transcript</span>
        </nav>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transcript...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (transcriptError || detailsError) {
    return (
      <div className="space-y-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link
            to="/call-logs"
            className="hover:text-gray-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Call Logs & Transcripts
          </Link>
          <span>/</span>
          <span className="text-gray-900">Call Transcript</span>
        </nav>
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
              Error Loading Transcript
            </h3>
            <p className="text-gray-600 mb-4">
              {transcriptError || detailsError}
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
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/call-logs" className="hover:text-gray-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Call Logs & Transcripts
        </Link>
        <span>/</span>
        <span className="text-gray-900">Call Transcript</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript Panel */}
        <div className="lg:col-span-2">
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Call Transcript
            </h1>

            <div className="space-y-4">
              {transcript?.map((entry, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        entry.speaker === "Caller"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {entry.speaker === "Caller" ? "C" : "A"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {entry.speaker}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({entry.time})
                      </span>
                    </div>
                    <p className="text-gray-700">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Details Panel */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Call Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Call ID
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {callDetails?.id || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Date/Time
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {callDetails?.dateTime || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Duration
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {callDetails?.duration || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              NLP Intent
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">
                {callDetails?.nlpIntent || "No NLP intent data available"}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Audio Playback
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Recording
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayAudio}
                    disabled={audioLoading}
                    className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Mic className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">AI Assistant</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFlagForReview}
                disabled={flagLoading}
                className="w-full btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Flag className="h-4 w-4 mr-2" />
                {flagLoading ? "Flagging..." : "Flag for Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallTranscript
