import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Phone, Sparkles } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import type { RegisteredPlanId } from "../services/api"
import {
  markOnboardingComplete,
  saveOnboardingProfile,
  isOnboardingComplete,
} from "../utils/onboardingStorage"

const PLAN_LABELS: Record<RegisteredPlanId, string> = {
  basic: "Basic",
  essentials: "Essentials",
  pro: "Pro",
}

const PLAN_INTENT_LIMITS: Record<RegisteredPlanId, number> = {
  basic: 10,
  essentials: 20,
  pro: 40,
}

/** Demo inventory — your plan caps how many can be active at once. */
const INTENT_CATALOG: { id: string; label: string }[] = [
  { id: "order-status", label: "Order status & tracking" },
  { id: "returns", label: "Returns & refunds" },
  { id: "billing", label: "Billing questions" },
  { id: "password-reset", label: "Account / password help" },
  { id: "product-info", label: "Product information" },
  { id: "technical-support", label: "Technical troubleshooting" },
  { id: "complaints", label: "Complaints & escalation" },
  { id: "hours-location", label: "Hours & branch locations" },
  { id: "delivery", label: "Delivery scheduling" },
  { id: "warranty", label: "Warranty & repairs" },
  { id: "loyalty", label: "Loyalty & rewards" },
  { id: "promotions", label: "Promotions & coupons" },
  { id: "subscription", label: "Subscription changes" },
  { id: "payment-methods", label: "Payment methods" },
  { id: "fraud-safety", label: "Fraud & safety reports" },
  { id: "feedback", label: "Feedback & surveys" },
  { id: "language-preference", label: "Language preference routing" },
  { id: "sales-new", label: "New sales inquiries" },
  { id: "upgrade-plan", label: "Plan upgrades" },
  { id: "cancellation", label: "Cancellations" },
  { id: "appointment", label: "Appointment booking" },
  { id: "documentation", label: "Send documentation / receipts" },
  { id: "partner-support", label: "Partner / B2B support" },
  { id: "hr-directory", label: "HR / internal directory (IVR)" },
  { id: "emergency", label: "Emergency / urgent flag" },
  { id: "callback", label: "Callback scheduling" },
  { id: "whatsapp-handoff", label: "WhatsApp handoff" },
  { id: "sms-opt-in", label: "SMS notifications opt-in" },
  { id: "identity-verify", label: "Identity verification flow" },
  { id: "loan-status", label: "Loan / finance status" },
  { id: "insurance-claims", label: "Insurance claims intake" },
  { id: "travel-changes", label: "Travel booking changes" },
  { id: "hotel-reservation", label: "Hotel reservation changes" },
  { id: "telehealth-triage", label: "Telehealth triage" },
  { id: "prescription-refill", label: "Prescription refill routing" },
  { id: "utilities-outage", label: "Utilities outage reports" },
  { id: "meter-reading", label: "Meter reading submission" },
  { id: "tariff-info", label: "Tariff & plan comparison" },
  { id: "gov-services", label: "Government service FAQs" },
  { id: "ngo-donations", label: "Donations & NGO inquiries" },
  { id: "education-enrollment", label: "Course enrollment" },
  { id: "event-tickets", label: "Event tickets & seating" },
  { id: "fleet-support", label: "Fleet / driver support" },
  { id: "vendor-onboarding", label: "Vendor onboarding status" },
  { id: "custom-workflow", label: "Custom workflow placeholder" },
]

const VIRTUAL_NUMBERS = [
  "+254 709 112 334",
  "+254 709 445 667",
  "+254 710 223 889",
  "+254 711 556 001",
  "+254 712 778 990",
]

type Step = "welcome" | "number" | "intents"

const CompleteRegistration = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const plan = user?.plan

  const [step, setStep] = useState<Step>("welcome")
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
  const [selectedIntentIds, setSelectedIntentIds] = useState<Set<string>>(
    new Set(),
  )

  const intentLimit = plan ? PLAN_INTENT_LIMITS[plan] : 0

  useEffect(() => {
    if (!user) return
    if (!plan) {
      navigate("/", { replace: true })
      return
    }
    if (isOnboardingComplete(user.id)) {
      navigate("/", { replace: true })
    }
  }, [user, plan, navigate])

  const toggleIntent = (id: string) => {
    setSelectedIntentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      if (next.size >= intentLimit) return prev
      next.add(id)
      return next
    })
  }

  const planName = plan ? PLAN_LABELS[plan] : ""

  const canContinueNumber = selectedNumber != null
  const canFinish =
    selectedIntentIds.size > 0 && selectedIntentIds.size <= intentLimit

  const handleFinish = () => {
    if (!user || !plan || !selectedNumber || !canFinish) return
    saveOnboardingProfile(user.id, {
      assignedNumber: selectedNumber,
      intents: [...selectedIntentIds],
    })
    markOnboardingComplete(user.id)
    navigate("/", { replace: true })
  }

  const stepIndicator = useMemo(() => {
    const steps: Step[] = ["welcome", "number", "intents"]
    const idx = steps.indexOf(step)
    return steps.map((s, i) => (
      <div
        key={s}
        className={`h-1 flex-1 rounded-full transition-colors ${
          i <= idx ? "bg-primary-500" : "bg-secondary-900/15"
        }`}
      />
    ))
  }, [step])

  if (!user || !plan) {
    return (
      <div className="min-h-screen bg-bg-sand flex items-center justify-center font-sans text-secondary-900/70">
        Redirecting…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-sand flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-secondary-900/40 backdrop-blur-[2px] z-0"
        aria-hidden
      />

      <div
        className="relative z-10 w-full max-w-lg bg-bg-paper rounded-lg border-2 border-secondary-900 shadow-brutalist p-6 sm:p-8 space-y-6"
        role="dialog"
        aria-labelledby="onboarding-title"
        aria-modal="true"
      >
        <div className="flex gap-1">{stepIndicator}</div>

        {step === "welcome" && (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-primary-100 p-4 border-2 border-secondary-900">
                <Sparkles className="h-10 w-10 text-primary-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1
                id="onboarding-title"
                className="text-2xl font-bold text-secondary-900 tracking-tight"
              >
                Welcome, {user.name}!
              </h1>
              <p className="font-sans text-secondary-900/75 text-sm leading-relaxed">
                Your account is ready. Finish setup in two quick steps: choose
                the business line callers will reach you on, then enable the AI
                intents that match your workflows. Your{" "}
                <span className="font-medium text-secondary-900">
                  {planName}
                </span>{" "}
                plan includes up to{" "}
                <span className="font-medium text-secondary-900">
                  {intentLimit}
                </span>{" "}
                active intents.
              </p>
            </div>
            <button
              type="button"
              className="w-full btn-primary"
              onClick={() => setStep("number")}
            >
              Continue setup
            </button>
          </>
        )}

        {step === "number" && (
          <>
            <div className="flex items-center gap-2 text-secondary-900">
              <Phone className="h-6 w-6 text-primary-600 shrink-0" />
              <h2 className="text-xl font-bold tracking-tight">
                Choose your line
              </h2>
            </div>
            <p className="font-sans text-sm text-secondary-900/75">
              Pick a dedicated virtual number for inbound AI calls. You can
              change routing later in settings.
            </p>
            <ul className="space-y-2 max-h-[min(40vh,280px)] overflow-y-auto pr-1">
              {VIRTUAL_NUMBERS.map((num) => {
                const active = selectedNumber === num
                return (
                  <li key={num}>
                    <button
                      type="button"
                      onClick={() => setSelectedNumber(num)}
                      className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-md border-2 transition-colors font-sans text-sm ${
                        active
                          ? "border-primary-600 bg-primary-50 text-secondary-900"
                          : "border-secondary-900/15 hover:border-secondary-900/30 bg-bg-sand/80"
                      }`}
                    >
                      <span className="font-medium tabular-nums">{num}</span>
                      {active && (
                        <Check className="h-5 w-5 text-primary-600 shrink-0" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 btn-ghost justify-center border border-secondary-900/15 rounded-md py-3"
                onClick={() => setStep("welcome")}
              >
                Back
              </button>
              <button
                type="button"
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canContinueNumber}
                onClick={() => setStep("intents")}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "intents" && (
          <>
            <h2 className="text-xl font-bold text-secondary-900 tracking-tight">
              Enable intents
            </h2>
            <p className="font-sans text-sm text-secondary-900/75">
              Select up to{" "}
              <span className="font-semibold text-secondary-900">
                {intentLimit}
              </span>{" "}
              intents for your {planName} plan. These guide how the assistant
              classifies and handles conversations.
            </p>
            <p className="font-sans text-xs font-medium text-primary-700 bg-primary-500/10 border border-primary-500/25 rounded-md px-3 py-2">
              {selectedIntentIds.size} / {intentLimit} selected
            </p>
            <ul className="space-y-2 max-h-[min(45vh,320px)] overflow-y-auto pr-1 border border-secondary-900/10 rounded-md p-3 bg-bg-sand/50">
              {INTENT_CATALOG.map(({ id, label }) => {
                const on = selectedIntentIds.has(id)
                const atCap =
                  !on && selectedIntentIds.size >= intentLimit
                return (
                  <li key={id}>
                    <label
                      className={`flex items-start gap-3 cursor-pointer font-sans text-sm rounded-md p-2 -m-2 transition-colors ${
                        atCap ? "opacity-50 cursor-not-allowed" : "hover:bg-bg-paper"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={atCap}
                        onChange={() => toggleIntent(id)}
                        className="mt-0.5 rounded border-secondary-900/30 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-secondary-900/90">{label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 btn-ghost justify-center border border-secondary-900/15 rounded-md py-3"
                onClick={() => setStep("number")}
              >
                Back
              </button>
              <button
                type="button"
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canFinish}
                onClick={handleFinish}
              >
                Go to dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CompleteRegistration
