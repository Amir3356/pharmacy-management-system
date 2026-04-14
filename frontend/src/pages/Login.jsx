import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@pharmacy.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const destination = location.state?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await login({ email, password })
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError?.message ?? 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="login-shell">
      <div className="login-card">
        <div className="login-hero">
          <h1>Pharmacy Management System</h1>
        </div>

        <form className="medicine-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@pharmacy.com"
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
              required
            />
          </label>

          {error ? <div className="alert error">{error}</div> : null}

          <div className="form-footer">
            <button className="button" type="submit" disabled={busy}>
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}