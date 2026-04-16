import { useEffect, useMemo, useState } from 'react'
import AuthContext from './authContext'

const AUTH_STORAGE_KEY = 'pharmacy-auth-session'
const CREDENTIALS_STORAGE_KEY = 'pharmacy-auth-credentials'
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

export default function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(() => {
    const savedCredentials = window.localStorage.getItem(CREDENTIALS_STORAGE_KEY)
    if (!savedCredentials) {
      return DEFAULT_CREDENTIALS
    }

    const parsedCredentials = JSON.parse(savedCredentials)

    return {
      username: parsedCredentials.username ?? parsedCredentials.email ?? DEFAULT_CREDENTIALS.username,
      password: parsedCredentials.password ?? DEFAULT_CREDENTIALS.password,
    }
  })

  const [user, setUser] = useState(null)

  useEffect(() => {
    // Always start from sign-in when the app loads.
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const login = async ({ username, password }) => {
    const normalizedUsername = username.trim().toLowerCase()
    const savedUsername = credentials.username.trim().toLowerCase()

    if (normalizedUsername !== savedUsername || password !== credentials.password) {
      throw new Error('Invalid username or password.')
    }

    const nextUser = {
      name: 'Pharmacy Admin',
      email: `${credentials.username}@local.user`,
    }

    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const updateLoginCredentials = ({ username, password }) => {
    const nextCredentials = {
      username: username.trim().toLowerCase(),
      password,
    }

    window.localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(nextCredentials))
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setCredentials(nextCredentials)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout, updateLoginCredentials }),
    [user, credentials],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}