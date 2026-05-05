import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  User,
  Menu,
  X,
  Home,
  Phone,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  CreditCard,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const hideAppChrome = location.pathname === "/complete-registration"

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Call Logs and Transcripts", href: "/call-logs", icon: Phone },
    { name: "Performance Metrics", href: "/performance", icon: BarChart3 },
    { name: "Billing & Payment", href: "/payment", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ]

  if (hideAppChrome) {
    return (
      <div className="min-h-screen bg-bg-sand">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-sand">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-secondary-900/60"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-paper shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-secondary-900/15">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/images/map.png"
              alt="App Logo"
              className="h-8 w-8 rounded"
            />
            <span className="text-xl font-display font-bold tracking-tight text-secondary-900">
              Call Center
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-secondary-900/40 hover:text-secondary-900/60 hover:bg-secondary-900/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col min-h-0 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-sans font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-secondary-900/70 hover:bg-secondary-900/[0.05] hover:text-secondary-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? "text-primary-600"
                        : "text-secondary-900/40 group-hover:text-secondary-900/55"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-secondary-900/15 flex-shrink-0">
            <button
              onClick={() => {
                logout()
                setUserMenuOpen(false)
              }}
              className="w-full flex items-center px-3 py-2 text-sm font-sans font-medium text-secondary-900/70 hover:bg-secondary-900/[0.05] hover:text-secondary-900 rounded-md transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-secondary-900/40" />
              Sign out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-bg-paper shadow-sm border-b border-secondary-900/15">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-secondary-900/40 hover:text-secondary-900/60 hover:bg-secondary-900/[0.06]"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <button
                onClick={logout}
                className="hidden lg:flex items-center px-3 py-2 text-sm font-sans font-medium text-secondary-900/70 hover:bg-secondary-900/[0.07] hover:text-secondary-900 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-secondary-900/[0.06] hover:bg-secondary-900/10 transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-secondary-900/70" />
                  <span className="hidden sm:inline text-sm font-sans font-medium text-secondary-900/80">
                    {user?.name || user?.email || "User"}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 py-1 bg-bg-paper rounded-lg shadow-lg border border-secondary-900/15 z-20">
                      <div className="px-4 py-2">
                        <p className="text-sm font-sans font-medium text-secondary-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-secondary-900/50 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout
