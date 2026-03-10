import { Link } from "react-router-dom"
import { Check, Building2, Zap, Crown, Sparkles } from "lucide-react"

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "6,000",
    period: "month",
    currency: "KSh",
    bestFor: "Businesses with low call volume",
    icon: Sparkles,
    features: [
      "10 pre-built intents",
      "Swahili + English",
      "Voice calls included",
      "15-day call logs",
      "WhatsApp support",
      "24-hour response",
    ],
    cta: "Get started",
    href: "/register?plan=basic",
    highlight: false,
  },
  {
    id: "essentials",
    name: "Essentials",
    price: "10,000",
    period: "month",
    currency: "KSh",
    bestFor: "Growing SMEs",
    icon: Zap,
    features: [
      "20 pre-built intents",
      "Swahili + English",
      "Voice calls + WhatsApp basic",
      "2 concurrent calls",
      "30-day call logs",
      "Email + WhatsApp support",
    ],
    cta: "Get started",
    href: "/register?plan=essentials",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "19,000",
    period: "month",
    currency: "KSh",
    bestFor: "Expanding Businesses",
    icon: Building2,
    features: [
      "40 pre-built intents",
      "Swahili + English + Sheng",
      "Voice + WhatsApp + SMS",
      "7 concurrent calls",
      "90-day logs + transcripts",
      "8-hour support response",
    ],
    cta: "Get started",
    href: "/register?plan=pro",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    currency: "",
    bestFor: "Established Enterprises",
    icon: Crown,
    features: [
      "Unlimited intents",
      "Custom complex workflows",
      "Full CRM + API access",
      "10+ concurrent calls",
      "Unlimited storage",
      "Dedicated account manager",
    ],
    cta: "Contact us",
    href: "/enterprise-contact",
    highlight: false,
  },
]

const PlanSelection = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            ← Back to sign in
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Choose your plan
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your business. Basic, Essentials, and
            Pro are available for immediate sign-up. Enterprise includes a
            dedicated account manager—our team will contact you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`card flex flex-col ${
                  plan.highlight ? "ring-2 ring-primary-500 shadow-lg" : ""
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block w-fit px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      plan.highlight ? "bg-primary-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        plan.highlight ? "text-primary-600" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="text-sm text-gray-500">{plan.bestFor}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.currency ? `${plan.currency} ` : ""}{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                    plan.highlight
                      ? "btn-primary"
                      : "btn-secondary hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlanSelection
