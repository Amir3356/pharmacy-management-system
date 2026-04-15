import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { requestCredentialRecovery, verifyCredentialRecovery } from '../services/api'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, updateLoginCredentials } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [recoveryStep, setRecoveryStep] = useState('request')
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [recoveryError, setRecoveryError] = useState('')

  const destination = location.state?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      await login({ username, password })
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError?.message ?? 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  const handleForgotSubmit = async (event) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setRecoveryMessage('')
      setRecoveryError('Password and confirm password must match.')
      return
    }

    setRecoveryBusy(true)
    setRecoveryMessage('')
    setRecoveryError('')

    try {
      const response = await requestCredentialRecovery({
        new_username: newUsername,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })

      setRecoveryMessage(response?.message ?? 'Verification email sent successfully.')
      setRecoveryStep('verify')
    } catch (requestError) {
      const message = requestError?.response?.data?.message ?? 'Unable to send verification email.'
      setRecoveryError(message)
    } finally {
      setRecoveryBusy(false)
    }
  }

  const handleVerifySubmit = async (event) => {
    event.preventDefault()
    setRecoveryBusy(true)
    setRecoveryMessage('')
    setRecoveryError('')

    try {
      const response = await verifyCredentialRecovery({
        new_username: newUsername,
        code: verificationCode,
      })

      updateLoginCredentials({ username: newUsername, password: newPassword })
      setUsername(newUsername)
      setPassword(newPassword)
      setShowForgot(false)
      setRecoveryStep('request')
      setVerificationCode('')
      setRecoveryMessage(response?.message ?? 'Verification successful. Please sign in.')
      navigate('/login', { replace: true })
    } catch (verifyError) {
      const message = verifyError?.response?.data?.message ?? 'Invalid verification code.'
      setRecoveryError(message)
    } finally {
      setRecoveryBusy(false)
    }
  }

  return (
    <section className="login-shell">
      <Card className="login-card w-full max-w-xl">
        {!showForgot ? (
          <CardHeader className="login-hero">
            <CardTitle>Pharmacy Management System</CardTitle>
            <CardDescription>Sign in to access your inventory dashboard.</CardDescription>
          </CardHeader>
        ) : (
          <CardHeader className="login-hero">
            <CardTitle>Account Recovery</CardTitle>
            <CardDescription>Set a new username and password, then verify the code from email.</CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {!showForgot ? (
            <form className="medicine-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
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
                  onClick={() => {
                    setShowForgot(true)
                    setRecoveryMessage('')
                    setRecoveryError('')
                  }}
                >
                  Forgot username and password?
                </button>
              </div>
            </form>
          ) : null}

          {showForgot ? (
            <>
              <form className="medicine-form forgot-panel" onSubmit={handleForgotSubmit}>
                <div className="form-field">
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                    placeholder="amirsiraj1995"
                    required
                  />
                  <p className="form-help">Only username amirsiraj1995 is allowed for verification email.</p>
                </div>

                <div className="form-field">
                  <Label htmlFor="newPassword">Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-field">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                </div>

                {recoveryMessage ? <div className="alert success">{recoveryMessage}</div> : null}
                {recoveryError ? <div className="alert error">{recoveryError}</div> : null}

                <div className="form-footer">
                  <Button type="submit" disabled={recoveryBusy}>
                    {recoveryBusy ? 'Sending...' : 'Submit'}
                  </Button>

                  <button
                    type="button"
                    className="button-ghost"
                    onClick={() => {
                      setShowForgot(false)
                      setRecoveryStep('request')
                      setRecoveryMessage('')
                      setRecoveryError('')
                    }}
                  >
                    Back to sign in
                  </button>
                </div>
              </form>

              {recoveryStep === 'verify' ? (
                <form className="medicine-form forgot-panel" onSubmit={handleVerifySubmit}>
                  <div className="form-field">
                    <Label htmlFor="verificationCode">Enter 6-digit verification code</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      value={verificationCode}
                      onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      required
                    />
                  </div>

                  {recoveryError ? <div className="alert error">{recoveryError}</div> : null}

                  <div className="form-footer">
                    <Button type="submit" disabled={recoveryBusy}>
                      {recoveryBusy ? 'Verifying...' : 'Verify code'}
                    </Button>
                  </div>
                </form>
              ) : null}
            </>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}