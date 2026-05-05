import { useState } from "react"
import { Link } from "react-router-dom"
import { apiService, userFacingError } from "../services/api"
import { mockApiService } from "../services/mockApiService"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const submitEnterpriseContact = apiBaseUrl
  ? apiService.submitEnterpriseContact.bind(apiService)
  : mockApiService.submitEnterpriseContact.bind(mockApiService)

const USE_CASES = [
  { value: "", label: "Select use case" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "sacco", label: "SACCO / Financial" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
]

const EnterpriseContact = () => {
  const [companyName, setCompanyName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [useCase, setUseCase] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await submitEnterpriseContact({
        companyName,
        contactName,
        email,
        phone,
        useCase: useCase || undefined,
        message: message || undefined,
      })
      setSuccess(true)
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

  if (success) {
    return (
      <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="text-primary-600 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Thank you for your interest
            </h1>
            <p className="text-secondary-900/70 mb-6">
              Our team will contact you within 4 hours to discuss your Enterprise
              plan. We look forward to speaking with you.
            </p>
            <Link to="/plans" className="btn-primary inline-block">
              Back to plans
            </Link>
            <p className="mt-6">
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Already have an account? Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <Link
              to="/plans"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to plans
            </Link>
            <h1 className="text-2xl font-bold text-secondary-900 mt-2">
              Contact us for Enterprise
            </h1>
            <p className="text-secondary-900/70 mt-1">
              Our team will reach out within 4 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg bg-primary-500/10 text-primary-600 border border-primary-500/20 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="input-field"
                placeholder="Your company"
              />
            </div>

            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Contact name
              </label>
              <input
                id="contactName"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+254 7XX XXX XXX"
              />
            </div>

            <div>
              <label
                htmlFor="useCase"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Use case
              </label>
              <select
                id="useCase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="input-field"
              >
                {USE_CASES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Message <span className="text-secondary-900/40">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field resize-none"
                placeholder="Tell us about your needs..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default EnterpriseContact
