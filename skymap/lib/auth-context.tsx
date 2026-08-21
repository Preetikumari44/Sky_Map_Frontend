"use client"

// Frontend-only auth context. It calls lib/api.ts (login/signup/logout/getCurrentUser),
// which in turn expects real endpoints on the backend — none of that is implemented here.
//
// Session handling: on successful login/signup, the backend is expected to set a
// `skymap_session` cookie (httpOnly, set by the server) that `middleware.ts` reads to
// gate /dashboard/*. This context additionally keeps the `User` object in React state
// (and localStorage, for a fast first paint) purely for UI purposes.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as api from "./api"
import type { User } from "./types"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "skymap_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (cached) {
      try { setUser(JSON.parse(cached)) } catch { /* ignore malformed cache */ }
    }
    refresh().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    try {
      const me = await api.getCurrentUser()
      setUser(me)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(me))
    } catch {
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  async function login(email: string, password: string) {
    const { user: loggedInUser } = await api.login(email, password)
    setUser(loggedInUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
  }

  async function signup(name: string, email: string, password: string) {
    const { user: newUser } = await api.signup(name, email, password)
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }

  async function logoutFn() {
    try { await api.logout() } finally {
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout: logoutFn, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
