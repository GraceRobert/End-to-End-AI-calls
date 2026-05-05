import { useState } from "react"
import { Link, useSearchParams, useNavigate, Navigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { apiService, userFacingError } from "../services/api"
import { mockApiService } from "../services/mockApiService"
import { useAuth } from "../contexts/AuthContext"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const registerFn = apiBaseUrl
  ? apiService.register.bind(apiService)
  : mockApiService.register.bind(mockApiService)

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  basic: { name: "Basic", price: "KSh 6,000/month" },
  essentials: { name: "Essentials", price: "KSh 10,000/month" },
  pro: { name: "Pro", price: "KSh 19,000/month" },
}

const Register = () => {
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get("plan") || "essentials"
  const plan =
    planParam === "basic" ? "basic" : planParam === "pro" ? "pro" : "essentials"
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setAuth } = useAuth()

  if (planParam === "enterprise") {
    return <Navigate to="/enterprise-contact" replace />
  }

  const planInfo = PLAN_LABELS[plan]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { token, user } = await registerFn({
        name,
        email,
        password,
        company,
        phone,
        plan,
      })
      setAuth(token, user)
      navigate("/complete-registration", { replace: true })
    } catch (err) {
      setError(
        userFacingError(
          err instanceof Error ? err.message : null,
          "Registration failed. Please try again.",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
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
              Create your account
            </h1>
            <p className="text-secondary-900/70 mt-1">
              {planInfo.name} &middot; {planInfo.price}
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
                htmlFor="name"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-secondary-900/40 hover:text-secondary-900/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-secondary-900/50 mt-1">
                At least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-sans font-medium text-secondary-900/80 mb-1"
              >
                Company name
              </label>
              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input-field"
                placeholder="Your company"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
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

export default Register
