import { useEffect, useMemo, useState } from 'react'
import AuthContext from './authContext'
import { loginUser, logoutUser } from '../services/api'

const AUTH_STORAGE_KEY = 'pharmacy-auth-session'
const USER_STORAGE_KEY = 'pharmacy-user-data'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem(USER_STORAGE_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    // If not authenticated, ensure we don't hold bad memory.
    if (!user) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  const login = async ({ username, password }) => {
    try {
      const data = await loginUser({ username, password })
      setUser(data.user)
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
      return data.user
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Invalid username or password.')
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (e) {
        // ignore network error on logout
    }
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  const updateLoginCredentials = ({ username, password }) => {
    // Legacy support to fake it until they log in again
    // But since they are successfully verifed, we just sign them out to force login.
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout, updateLoginCredentials }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}