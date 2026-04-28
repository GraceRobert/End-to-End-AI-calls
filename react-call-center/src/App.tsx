import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import PlanSelection from "./pages/PlanSelection"
import Register from "./pages/Register"
import EnterpriseContact from "./pages/EnterpriseContact"
import Dashboard from "./pages/Dashboard"
import CallLogs from "./pages/CallLogs"
import PerformanceMetrics from "./pages/PerformanceMetrics"
import Settings from "./pages/Settings"
import CallTranscript from "./pages/CallTranscript"
import Payment from "./pages/Payment"
import UpgradeCheckout from "./pages/UpgradeCheckout"
import { apiService } from "./services/api"
import { mockApiService } from "./services/mockApiService"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const loginFn = apiBaseUrl
  ? apiService.login.bind(apiService)
  : mockApiService.login.bind(mockApiService)

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider loginFn={loginFn}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/plans" element={<PlanSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enterprise-contact" element={<EnterpriseContact />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path="/performance" element={<PerformanceMetrics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/payment/upgrade/:planId"
            element={<UpgradeCheckout />}
          />
          <Route path="/transcript/:id" element={<CallTranscript />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
