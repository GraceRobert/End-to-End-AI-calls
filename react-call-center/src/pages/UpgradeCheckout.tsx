import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { getPlanById, type PlanId } from "../data/plans"
import { apiService, userFacingError } from "../services/api"
import { mockApiService } from "../services/mockApiService"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const initiateUpgrade = apiBaseUrl
  ? apiService.initiateUpgrade.bind(apiService)
  : mockApiService.initiateUpgrade.bind(mockApiService)

const UpgradeCheckout = () => {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plan = planId ? getPlanById(planId as PlanId) : null

  if (!plan || plan.isEnterprise) {
    return (
      <div className="space-y-6">
        <p className="text-secondary-900/70">
          Invalid plan or Enterprise upgrades require{" "}
          <Link
            to="/enterprise-contact"
            className="text-primary-600 hover:text-primary-700"
          >
            contacting us
          </Link>
          .
        </p>
        <Link to="/payment" className="btn-secondary inline-block">
          ← Back to Billing
        </Link>
      </div>
    )
  }

  const handleUpgrade = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await initiateUpgrade(plan.id)
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        // Mock: simulate success
        alert(
          `Upgrade to ${plan.name} initiated. In production, you would be redirected to M-Pesa checkout.`,
        )
        navigate("/payment", { replace: true })
      }
    } catch (err) {
      setError(
        userFacingError(
          err instanceof Error ? err.message : null,
          "Upgrade failed. Please try again.",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link
          to="/payment"
          className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Billing
        </Link>
        <h1 className="text-3xl font-bold text-secondary-900">
          Upgrade to {plan.name}
        </h1>
        <p className="mt-2 text-secondary-900/70">{plan.bestFor}</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-stat text-2xl text-secondary-900">
              {plan.currency} {plan.price}
              {plan.period && `/${plan.period}`}
            </p>
            <p className="text-sm text-secondary-900/50">Billed monthly</p>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-secondary-900/70"
            >
              <span className="text-primary-500">✓</span>
              {f}
            </li>
          ))}
        </ul>

        {error && (
          <div className="p-3 rounded-lg bg-primary-500/10 text-primary-600 border border-primary-500/20 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleUpgrade}
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Pay via M-Pesa"}
          </button>
          <p className="text-xs text-secondary-900/50 text-center">
            You will receive an M-Pesa prompt to complete the payment. Your plan
            will upgrade immediately after payment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UpgradeCheckout
