import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import type { AuthUser } from "../services/api"

const AUTH_TOKEN_KEY = "authToken"
const AUTH_USER_KEY = "authUser"

export type { AuthUser }

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setAuth: (token: string, user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredAuth(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userJson = localStorage.getItem(AUTH_USER_KEY)
    if (token && userJson) {
      const user = JSON.parse(userJson) as AuthUser
      return { token, user }
    }
  } catch {
    // Invalid stored data
  }
  return null
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

function storeAuth(token: string, user: AuthUser) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

interface AuthProviderProps {
  children: ReactNode
  loginFn: (email: string, password: string) => Promise<{ token: string; user: AuthUser }>
}

export function AuthProvider({ children, loginFn }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadStoredAuth()
    if (stored) {
      setToken(stored.token)
      setUser(stored.user)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { token: newToken, user: newUser } = await loginFn(email, password)
      storeAuth(newToken, newUser)
      setToken(newToken)
      setUser(newUser)
    },
    [loginFn]
  )

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }, [])

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    storeAuth(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    setAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
