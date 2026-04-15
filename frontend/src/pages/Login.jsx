import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { requestCredentialRecovery } from '../services/api'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@pharmacy.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [recoveryError, setRecoveryError] = useState('')

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

  const handleForgotSubmit = async (event) => {
    event.preventDefault()
    setRecoveryBusy(true)
    setRecoveryMessage('')
    setRecoveryError('')

    try {
      const response = await requestCredentialRecovery(recoveryEmail)
      setRecoveryMessage(response?.message ?? 'Verification email sent successfully.')
    } catch (requestError) {
      const message = requestError?.response?.data?.message ?? 'Unable to send verification email.'
      setRecoveryError(message)
    } finally {
      setRecoveryBusy(false)
    }
  }

  return (
    <section className="login-shell">
      <Card className="login-card w-full max-w-xl">
        <CardHeader className="login-hero">
          <CardTitle>Pharmacy Management System</CardTitle>
          <CardDescription>Sign in to access your inventory dashboard.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="medicine-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@pharmacy.com"
                required
              />
            </div>

            <div className="form-field">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="admin123"
                required
              />
            </div>

            {error ? <div className="alert error">{error}</div> : null}

            <div className="form-footer">
              <Button type="submit" disabled={busy}>
                {busy ? 'Signing in...' : 'Sign in'}
              </Button>

              <button
                type="button"
                className="button-ghost"
                onClick={() => setShowForgot((current) => !current)}
              >
                {showForgot ? 'Hide recovery' : 'Forgot email or password?'}
              </button>
            </div>
          </form>

          {showForgot ? (
            <form className="medicine-form forgot-panel" onSubmit={handleForgotSubmit}>
              <div className="form-field">
                <Label htmlFor="recoveryEmail">Recovery Email</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                  placeholder="amirsiraj1995@gmail.com"
                  required
                />
                <p className="form-help">We will send a verification code to this email using Gmail SMTP.</p>
              </div>

              {recoveryMessage ? <div className="alert success">{recoveryMessage}</div> : null}
              {recoveryError ? <div className="alert error">{recoveryError}</div> : null}

              <div className="form-footer">
                <Button type="submit" disabled={recoveryBusy}>
                  {recoveryBusy ? 'Sending...' : 'Send verification email'}
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}