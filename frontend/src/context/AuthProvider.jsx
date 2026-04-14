import { useEffect, useMemo, useState } from 'react'
import AuthContext from './authContext'

const AUTH_STORAGE_KEY = 'pharmacy-auth-session'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return savedSession ? JSON.parse(savedSession) : null
  })

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    }
  }, [user])

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail !== 'admin@pharmacy.com' || password !== 'admin123') {
      throw new Error('Invalid email or password.')
    }

    const nextUser = {
      name: 'Pharmacy Admin',
      email: 'admin@pharmacy.com',
    }

    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}