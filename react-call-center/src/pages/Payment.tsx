import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Check, CreditCard, ArrowUpRight } from "lucide-react"
import {
  PLANS,
  getPlanById,
  getUpgradeablePlans,
  type PlanId,
} from "../data/plans"
import { apiService } from "../services/api"
import { mockApiService } from "../services/mockApiService"

const isDevelopment = import.meta.env.DEV
const getCurrentPlan = isDevelopment
  ? mockApiService.getCurrentPlan.bind(mockApiService)
  : apiService.getCurrentPlan.bind(apiService)

const Payment = () => {
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>("basic")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentPlan()
      .then((plan) => setCurrentPlanId(plan.planId as PlanId))
      .catch(() => setCurrentPlanId("basic"))
      .finally(() => setLoading(false))
  }, [])

  const currentPlan = getPlanById(currentPlanId)
  const upgradePlans = getUpgradeablePlans(currentPlanId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Billing & Payment</h1>
        <p className="mt-2 text-secondary-900/70">
          Manage your plan and upgrade when you need more features.
        </p>
      </div>

      {/* Current plan */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Current plan
        </h2>
        {currentPlan && (
          <div className="flex items-center justify-between p-4 bg-bg-sand rounded-lg border border-secondary-900/10">
            <div>
              <p className="font-sans font-medium text-secondary-900">
                {currentPlan.name}
              </p>
              <p className="text-sm font-sans text-secondary-900/50">
                {currentPlan.bestFor}
              </p>
              <p className="font-stat mt-1 text-lg text-secondary-900">
                {currentPlan.currency} {currentPlan.price}
                {currentPlan.period && `/${currentPlan.period}`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary-600">
              <Check className="h-5 w-5" />
              <span className="text-sm font-sans font-medium">Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade options */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Upgrade your plan
        </h2>
        <p className="text-secondary-900/70 mb-6">
          Get more intents, concurrent calls, and features as your business
          grows.
        </p>

        {upgradePlans.length === 0 ? (
          <div className="p-6 bg-bg-sand rounded-lg text-center border border-secondary-900/10">
            <p className="text-secondary-900/70">
              You're on the highest self-serve plan. For Enterprise with custom
              pricing,{" "}
              <Link
                to="/enterprise-contact"
                className="text-primary-600 hover:text-primary-700 font-sans font-medium"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upgradePlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-secondary-900/15 rounded-lg p-6 hover:border-primary-500/50 transition-colors"
              >
                <h3 className="font-semibold text-secondary-900">{plan.name}</h3>
                <p className="text-sm text-secondary-900/50 mt-1">{plan.bestFor}</p>
                <p className="font-stat mt-3 text-xl text-secondary-900">
                  {plan.currency} {plan.price}
                  {plan.period && (
                    <span className="text-base font-sans font-normal text-secondary-900/50">
                      /{plan.period}
                    </span>
                  )}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-secondary-900/70"
                    >
                      <Check className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {plan.isEnterprise ? (
                    <Link
                      to="/enterprise-contact"
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      Contact us
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to={`/payment/upgrade/${plan.id}`}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      Upgrade to {plan.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment method
        </h2>
        <p className="text-secondary-900/70 mb-4">
          Plans are billed monthly via M-Pesa auto-debit. You can update your
          payment method in Settings.
        </p>
        <Link
          to="/settings"
          className="text-primary-600 hover:text-primary-700 text-sm font-sans font-medium"
        >
          Manage payment settings →
        </Link>
      </div>
    </div>
  )
}

export default Payment
