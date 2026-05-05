const COMPLETE_KEY = "callCenterOnboarding_complete_"
const PROFILE_KEY = "callCenterOnboarding_profile_"

export interface OnboardingProfile {
  assignedNumber: string
  intents: string[]
}

export function isOnboardingComplete(userId: string): boolean {
  try {
    return localStorage.getItem(`${COMPLETE_KEY}${userId}`) === "1"
  } catch {
    return false
  }
}

export function markOnboardingComplete(userId: string): void {
  localStorage.setItem(`${COMPLETE_KEY}${userId}`, "1")
}

export function saveOnboardingProfile(
  userId: string,
  profile: OnboardingProfile,
): void {
  localStorage.setItem(`${PROFILE_KEY}${userId}`, JSON.stringify(profile))
}

export function getOnboardingProfile(
  userId: string,
): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY}${userId}`)
    if (!raw) return null
    const p = JSON.parse(raw) as OnboardingProfile
    if (
      typeof p?.assignedNumber !== "string" ||
      !Array.isArray(p?.intents)
    ) {
      return null
    }
    return p
  } catch {
    return null
  }
}
