import { useState } from "react"
import { Link } from "react-router-dom"
import { apiService, userFacingError } from "../services/api"
import { mockApiService } from "../services/mockApiService"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const requestPasswordReset = apiBaseUrl
  ? apiService.requestPasswordReset.bind(apiService)
  : mockApiService.requestPasswordReset.bind(mockApiService)

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)

    try {
      await requestPasswordReset(email)
      setMessage(
        "If an account exists for that email, we've sent a password reset link. Please check your inbox.",
      )
    } catch (err) {
      setError(
        userFacingError(
          err instanceof Error ? err.message : null,
          "Something went wrong. Please try again.",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <img
              src="/images/map.png"
              alt="Call Center"
              className="h-12 w-12 rounded mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-secondary-900">
              Reset your password
            </h1>
            <p className="mt-2 text-secondary-900/70">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="p-3 rounded-lg bg-primary-500/10 text-primary-600 border border-primary-500/20 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}
            {message && (
              <div
                className="p-3 rounded-lg bg-primary-500/10 text-primary-700 border border-primary-500/15 text-sm"
                role="status"
              >
                {message}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                disabled={!!message}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!message}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
