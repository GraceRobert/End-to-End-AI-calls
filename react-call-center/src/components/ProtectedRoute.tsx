import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { isOnboardingComplete } from "../utils/onboardingStorage"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-sand flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 font-sans text-secondary-900/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const plan = user?.plan
  const needsOnboarding =
    !!user?.id &&
    (plan === "basic" || plan === "essentials" || plan === "pro") &&
    !isOnboardingComplete(user.id)

  if (
    needsOnboarding &&
    location.pathname !== "/complete-registration"
  ) {
    return <Navigate to="/complete-registration" replace />
  }

  return <>{children}</>
}
