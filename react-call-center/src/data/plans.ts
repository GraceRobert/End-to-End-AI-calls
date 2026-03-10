export type PlanId = "basic" | "essentials" | "pro" | "enterprise"

export const PLAN_ORDER: PlanId[] = ["basic", "essentials", "pro", "enterprise"]

export interface Plan {
  id: PlanId
  name: string
  price: string
  period: string
  currency: string
  bestFor: string
  features: string[]
  isEnterprise: boolean
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "6,000",
    period: "month",
    currency: "KSh",
    bestFor: "Businesses with low call volume",
    features: [
      "10 pre-built intents",
      "Swahili + English",
      "Voice calls included",
      "15-day call logs",
      "WhatsApp support",
    ],
    isEnterprise: false,
  },
  {
    id: "essentials",
    name: "Essentials",
    price: "10,000",
    period: "month",
    currency: "KSh",
    bestFor: "Growing SMEs",
    features: [
      "20 pre-built intents",
      "Voice + WhatsApp basic",
      "2 concurrent calls",
      "30-day call logs",
      "Email + WhatsApp support",
    ],
    isEnterprise: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "19,000",
    period: "month",
    currency: "KSh",
    bestFor: "Expanding Businesses",
    features: [
      "40 pre-built intents",
      "Voice + WhatsApp + SMS",
      "7 concurrent calls",
      "90-day logs + transcripts",
      "8-hour support response",
    ],
    isEnterprise: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    currency: "",
    bestFor: "Established Enterprises",
    features: [
      "Unlimited intents",
      "Full CRM + API access",
      "10+ concurrent calls",
      "Unlimited storage",
      "Dedicated account manager",
    ],
    isEnterprise: true,
  },
]

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}

export function getUpgradeablePlans(currentPlanId: PlanId): Plan[] {
  const currentIndex = PLAN_ORDER.indexOf(currentPlanId)
  if (currentIndex < 0) return []
  return PLANS.slice(currentIndex + 1)
}
